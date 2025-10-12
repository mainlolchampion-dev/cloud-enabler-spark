import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[ADMIN-UPDATE-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const adminUser = userData.user;
    if (!adminUser) throw new Error("User not authenticated");

    logStep("Admin user authenticated", { userId: adminUser.id });

    // Check if user is admin
    const { data: roleData, error: roleError } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', adminUser.id)
      .eq('role', 'admin')
      .single();

    if (roleError || !roleData) {
      throw new Error("Unauthorized: User is not an admin");
    }

    logStep("Admin role verified");

    const { userId, planType, expiresAt } = await req.json();
    
    if (!userId || !planType) {
      throw new Error("Missing required fields: userId and planType");
    }

    logStep("Request data", { userId, planType, expiresAt });

    // Calculate expires_at (30 days from now if not provided)
    const expirationDate = expiresAt 
      ? new Date(expiresAt).toISOString()
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    // Update or insert subscription
    const { data: subscription, error: upsertError } = await supabaseClient
      .from('user_subscriptions')
      .upsert({
        user_id: userId,
        plan_type: planType,
        status: 'active',
        expires_at: expirationDate,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single();

    if (upsertError) throw upsertError;

    logStep("Subscription updated successfully", { 
      userId, 
      planType, 
      expiresAt: expirationDate 
    });

    return new Response(JSON.stringify({ 
      success: true, 
      subscription,
      message: "Η συνδρομή ενημερώθηκε επιτυχώς"
    }), {
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