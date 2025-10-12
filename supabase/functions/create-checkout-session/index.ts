import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.21.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") as string, {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
});

const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CheckoutRequest {
  priceId: string;
  userId: string;
  planType: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { priceId, userId, planType }: CheckoutRequest = await req.json();

    if (!priceId || !userId || !planType) {
      throw new Error("Missing required fields");
    }

    // Get or create Stripe customer
    const { data: subscription } = await supabase
      .from("user_subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", userId)
      .single();

    let customerId = subscription?.stripe_customer_id;

    if (!customerId) {
      // Get user email
      const { data: { user } } = await supabase.auth.admin.getUserById(userId);
      
      const customer = await stripe.customers.create({
        email: user?.email,
        metadata: {
          user_id: userId,
        },
      });
      customerId = customer.id;

      // Update subscription with customer ID
      await supabase
        .from("user_subscriptions")
        .update({ stripe_customer_id: customerId })
        .eq("user_id", userId);
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${req.headers.get("origin")}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/pricing`,
      metadata: {
        user_id: userId,
        plan_type: planType,
      },
    });

    return new Response(
      JSON.stringify({ sessionId: session.id, url: session.url }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
