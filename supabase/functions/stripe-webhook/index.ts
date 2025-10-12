import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Webhook received");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (!stripeKey || !webhookSecret) {
      throw new Error("Missing Stripe keys");
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const signature = req.headers.get("stripe-signature");
    if (!signature) throw new Error("No signature");

    const body = await req.text();
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    logStep("Event type", { type: event.type });

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        const planType = session.metadata?.plan_type;

        if (!userId || !planType) {
          logStep("Missing metadata", { userId, planType });
          break;
        }

        // Get subscription details
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        const expiresAt = new Date(subscription.current_period_end * 1000).toISOString();

        // Upsert user_subscriptions
        const { error } = await supabaseClient
          .from("user_subscriptions")
          .upsert({
            user_id: userId,
            plan_type: planType,
            stripe_customer_id: session.customer,
            stripe_subscription_id: session.subscription,
            status: "active",
            expires_at: expiresAt,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: "user_id"
          });

        if (error) {
          logStep("Database error", { error: error.message });
        } else {
          logStep("Subscription created/updated", { userId, planType, expiresAt });
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Get plan type from metadata or price
        const planType = subscription.metadata?.plan_type || "basic";
        const expiresAt = new Date(subscription.current_period_end * 1000).toISOString();
        const status = subscription.status === "active" ? "active" : "canceled";

        const { error } = await supabaseClient
          .from("user_subscriptions")
          .update({
            plan_type: planType,
            status: status,
            expires_at: expiresAt,
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_customer_id", customerId);

        if (error) {
          logStep("Update error", { error: error.message });
        } else {
          logStep("Subscription updated", { customerId, status, expiresAt });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const { error } = await supabaseClient
          .from("user_subscriptions")
          .update({
            status: "canceled",
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_customer_id", customerId);

        if (error) {
          logStep("Cancellation error", { error: error.message });
        } else {
          logStep("Subscription canceled", { customerId });
        }
        break;
      }

      case "invoice.payment_succeeded":
        logStep("Payment succeeded", { invoiceId: event.data.object.id });
        break;

      case "invoice.payment_failed":
        logStep("Payment failed", { invoiceId: event.data.object.id });
        break;

      default:
        logStep("Unhandled event type", { type: event.type });
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
