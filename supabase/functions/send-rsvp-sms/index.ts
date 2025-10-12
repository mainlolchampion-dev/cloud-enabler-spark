import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RSVPSmsRequest {
  to: string;
  guestName: string;
  eventTitle: string;
  willAttend: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, guestName, eventTitle, willAttend }: RSVPSmsRequest = await req.json();

    if (!to || !guestName || !eventTitle || !willAttend) {
      throw new Error("Missing required fields");
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

    return new Response(
      JSON.stringify({ success: true, messageSid: data.sid }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in send-rsvp-sms function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
