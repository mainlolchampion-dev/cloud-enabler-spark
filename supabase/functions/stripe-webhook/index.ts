import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import Stripe from "https://esm.sh/stripe@18.5.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") as string, {
  apiVersion: "2025-08-27.basil",
  httpClient: Stripe.createFetchHttpClient(),
});

const cryptoProvider = Stripe.createSubtleCryptoProvider();

const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

// Map Stripe price IDs to plan types
const PRICE_TO_PLAN: Record<string, "basic" | "plus" | "premium"> = {
  "price_1SHOW4Ks4zHW11KqsonASzmG": "basic",
  "price_1SHOWQKs4zHW11KqQchSaA1i": "plus",
  "price_1SHOWiKs4zHW11Kqy5Ecvlbu": "premium",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const signature = req.headers.get("stripe-signature");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

  if (!signature || !webhookSecret) {
    logStep("ERROR: Missing signature or webhook secret");
    return new Response("Webhook Error", { status: 400 });
  }

  try {
    const body = await req.text();
    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret,
      undefined,
      cryptoProvider
    );

    logStep("Received webhook event", { type: event.type });

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        logStep("Checkout completed", { 
          sessionId: session.id,
          customerId: session.customer,
          paymentStatus: session.payment_status 
        });

        if (session.payment_status === "paid" && session.mode === "payment") {
          const customerId = session.customer as string;
          const planType = session.metadata?.plan_type as "basic" | "plus" | "premium" || "basic";
          const userId = session.metadata?.user_id;

          if (!userId) {
            logStep("ERROR: No user_id in session metadata");
            break;
          }

          logStep("Processing one-time payment", { userId, planType, customerId });

          // Update user subscription in database
          const { error: upsertError } = await supabase
            .from("user_subscriptions")
            .upsert({
              user_id: userId,
              plan_type: planType,
              status: "active",
              stripe_customer_id: customerId,
              updated_at: new Date().toISOString(),
            }, {
              onConflict: "user_id"
            });

          if (upsertError) {
            logStep("ERROR: Failed to update subscription", { error: upsertError });
          } else {
            logStep("Subscription activated successfully", { userId, planType });
          }
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        
        logStep("Subscription event", { 
          type: event.type,
          customerId,
          status: subscription.status 
        });
        
        // Get user from customer ID
        const { data: existingSubscription } = await supabase
          .from("user_subscriptions")
          .select("user_id")
          .eq("stripe_customer_id", customerId)
          .maybeSingle();

        if (existingSubscription) {
          const priceId = subscription.items.data[0].price.id;
          const planType = PRICE_TO_PLAN[priceId] || "basic";

          await supabase
            .from("user_subscriptions")
            .update({
              stripe_subscription_id: subscription.id,
              status: subscription.status,
              plan_type: planType,
              expires_at: subscription.current_period_end 
                ? new Date(subscription.current_period_end * 1000).toISOString() 
                : null,
              updated_at: new Date().toISOString(),
            })
            .eq("stripe_customer_id", customerId);

          logStep("Subscription updated", { customerId, planType });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        await supabase
          .from("user_subscriptions")
          .update({
            status: "canceled",
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_customer_id", customerId);

        logStep("Subscription canceled", { customerId });
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        logStep("Payment succeeded", { invoiceId: invoice.id });
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        logStep("Payment failed", { invoiceId: invoice.id });
        break;
      }

      default:
        logStep("Unhandled event type", { type: event.type });
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    logStep("ERROR in webhook", { error: err instanceof Error ? err.message : "Unknown error" });
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});