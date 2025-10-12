import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ReminderRequest {
  invitationId: string;
  daysBeforeEvent: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { invitationId, daysBeforeEvent }: ReminderRequest = await req.json();

    // Get invitation details
    const { data: invitation, error: invError } = await supabaseClient
      .from("invitations")
      .select("*")
      .eq("id", invitationId)
      .single();

    if (invError || !invitation) {
      throw new Error("Invitation not found");
    }

    // Get guests who confirmed attendance
    const { data: rsvps, error: rsvpError } = await supabaseClient
      .from("rsvps")
      .select("*")
      .eq("invitation_id", invitationId)
      .eq("will_attend", "yes");

    if (rsvpError) throw rsvpError;

    if (!rsvps || rsvps.length === 0) {
      return new Response(
        JSON.stringify({ message: "No confirmed guests to remind" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    // Check user preferences
    const { data: preferences } = await supabaseClient
      .from("notification_preferences")
      .select("email_reminders, reminder_days_before")
      .eq("user_id", invitation.user_id)
      .single();

    if (preferences && !preferences.email_reminders) {
      return new Response(
        JSON.stringify({ message: "Email reminders are disabled for this user" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    // Send reminder emails
    const emailPromises = rsvps.map(async (rsvp) => {
      const eventDate = invitation.data?.weddingDate || invitation.data?.baptismDate || invitation.data?.partyDate;
      let status = 'pending';
      let errorMessage = null;
      
      try {
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "Προσκλήσεις <noreply@yourdomain.com>",
            to: [rsvp.email],
            subject: `Υπενθύμιση: ${invitation.title} - ${daysBeforeEvent} ημέρες!`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Γεια σου ${rsvp.name}!</h2>
                <p>Αυτό είναι ένα φιλικό υπενθύμισημα για την εκδήλωση:</p>
                <div style="background-color: #f5f5f5; padding: 20px; border-radius: 10px; margin: 20px 0;">
                  <h3 style="margin-top: 0;">${invitation.title}</h3>
                  <p><strong>Ημερομηνία:</strong> ${new Date(eventDate).toLocaleDateString('el-GR')}</p>
                  <p><strong>Απομένουν:</strong> ${daysBeforeEvent} ημέρες!</p>
                </div>
                <p>Ανυπομονούμε να σε δούμε!</p>
              </div>
            `,
          }),
        });

        const result = await response.json();
        status = response.ok ? 'sent' : 'failed';
        if (!response.ok) {
          errorMessage = JSON.stringify(result);
        }

        // Log to notification_history
        await supabaseClient.from("notification_history").insert({
          user_id: invitation.user_id,
          invitation_id: invitationId,
          type: 'email',
          subject: `Υπενθύμιση: ${invitation.title} - ${daysBeforeEvent} ημέρες!`,
          recipient: rsvp.email,
          status,
          error_message: errorMessage,
        });

        return result;
      } catch (error) {
        errorMessage = error instanceof Error ? error.message : 'Unknown error';
        
        // Log failed notification
        await supabaseClient.from("notification_history").insert({
          user_id: invitation.user_id,
          invitation_id: invitationId,
          type: 'email',
          subject: `Υπενθύμιση: ${invitation.title} - ${daysBeforeEvent} ημέρες!`,
          recipient: rsvp.email,
          status: 'failed',
          error_message: errorMessage,
        });

        throw error;
      }
    });

    const results = await Promise.all(emailPromises);

    return new Response(
      JSON.stringify({ 
        message: `Sent ${results.length} reminder emails`,
        results 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error sending reminders:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
