import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RSVPSmsRequest {
  to: string;
  guestName: string;
  eventTitle: string;
  willAttend: string;
  invitationId?: string;
  userId?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, guestName, eventTitle, willAttend, invitationId, userId }: RSVPSmsRequest = await req.json();

    if (!to || !guestName || !eventTitle || !willAttend) {
      throw new Error("Missing required fields");
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Check user preferences
    if (userId) {
      const { data: preferences } = await supabaseClient
        .from("notification_preferences")
        .select("sms_reminders")
        .eq("user_id", userId)
        .single();

      if (preferences && !preferences.sms_reminders) {
        console.log("SMS notifications are disabled for this user");
        return new Response(
          JSON.stringify({ success: false, message: "SMS notifications disabled" }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    const accountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
    const authToken = Deno.env.get("TWILIO_AUTH_TOKEN");
    const twilioPhoneNumber = Deno.env.get("TWILIO_PHONE_NUMBER") || "+1234567890";

    if (!accountSid || !authToken) {
      throw new Error("Twilio credentials not configured");
    }

    const attendanceText = willAttend === "yes" 
      ? "θα παραστεί" 
      : willAttend === "no" 
      ? "δεν θα παραστεί" 
      : "ίσως παραστεί";

    const message = `Νέα απάντηση RSVP!\n\n${guestName} ${attendanceText} στο ${eventTitle}.\n\nΕυχαριστούμε!`;

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          "Authorization": `Basic ${btoa(`${accountSid}:${authToken}`)}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          To: to,
          From: twilioPhoneNumber,
          Body: message,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Twilio API error:", errorText);
      throw new Error(`Twilio API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("SMS sent successfully:", data.sid);

    // Log to notification_history
    if (userId) {
      await supabaseClient.from("notification_history").insert({
        user_id: userId,
        invitation_id: invitationId || null,
        type: 'sms',
        subject: null,
        recipient: to,
        status: 'sent',
        error_message: null,
      });
    }

    return new Response(
      JSON.stringify({ success: true, messageSid: data.sid }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in send-rsvp-sms function:", error);
    
    // Log failed notification
    const { userId, invitationId, to } = await req.json().catch(() => ({}));
    if (userId) {
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      );
      
      await supabaseClient.from("notification_history").insert({
        user_id: userId,
        invitation_id: invitationId || null,
        type: 'sms',
        subject: null,
        recipient: to || 'unknown',
        status: 'failed',
        error_message: error instanceof Error ? error.message : "Unknown error",
      });
    }
    
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
