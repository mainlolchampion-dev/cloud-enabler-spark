import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RSVPConfirmationRequest {
  rsvpId: string;
  invitationId: string;
  name: string;
  email: string;
  willAttend: 'yes' | 'no' | 'maybe';
  numberOfGuests?: number;
  invitationTitle?: string;
  invitationType?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { 
      rsvpId,
      invitationId,
      name, 
      email, 
      willAttend, 
      numberOfGuests,
      invitationTitle,
      invitationType
    }: RSVPConfirmationRequest = await req.json();

    console.log(`📧 Sending RSVP confirmation to ${email} for ${name}`);

    // Get invitation details
    let title = invitationTitle || 'Η Πρόσκληση';
    let type = invitationType || 'invitation';
    
    if (!invitationTitle && invitationId) {
      const { data: invitation } = await supabaseClient
        .from('invitations')
        .select('title, type')
        .eq('id', invitationId)
        .single();
      
      if (invitation) {
        title = invitation.title;
        type = invitation.type;
      }
    }

    // Get the invitation URL
    const baseUrl = Deno.env.get('SUPABASE_URL')?.replace('/rest/v1', '') || '';
    const invitationUrl = `${baseUrl}/prosklisi/${invitationId}`;

    // Send email using Resend API
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    
    // Determine the email content based on attendance
    let subject = '';
    let message = '';
    
    if (willAttend === 'yes') {
      subject = `✓ Επιβεβαίωση Παρουσίας - ${title}`;
      message = `
        <h1 style="color: #4F46E5; font-family: Arial, sans-serif;">Ευχαριστούμε ${name}!</h1>
        <p style="font-size: 16px; color: #333; font-family: Arial, sans-serif;">
          Είμαστε πολύ χαρούμενοι που θα μας τιμήσετε με την παρουσία σας ${numberOfGuests && numberOfGuests > 1 ? `μαζί με ${numberOfGuests - 1} επιπλέον ${numberOfGuests === 2 ? 'άτομο' : 'άτομα'}` : ''}.
        </p>
        <p style="font-size: 16px; color: #333; font-family: Arial, sans-serif;">
          Λάβαμε την επιβεβαίωσή σας για <strong>${title}</strong>.
        </p>
        <div style="margin: 30px 0;">
          <a href="${invitationUrl}" 
             style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-family: Arial, sans-serif; display: inline-block;">
            Δείτε την Πρόσκληση
          </a>
        </div>
        <p style="font-size: 14px; color: #666; font-family: Arial, sans-serif;">
          Ανυπομονούμε να σας δούμε!
        </p>
      `;
    } else if (willAttend === 'no') {
      subject = `Επιβεβαίωση Απάντησης - ${title}`;
      message = `
        <h1 style="color: #4F46E5; font-family: Arial, sans-serif;">Ευχαριστούμε ${name}</h1>
        <p style="font-size: 16px; color: #333; font-family: Arial, sans-serif;">
          Λυπούμαστε που δεν θα μπορέσετε να είστε μαζί μας στο <strong>${title}</strong>.
        </p>
        <p style="font-size: 16px; color: #333; font-family: Arial, sans-serif;">
          Λάβαμε την απάντησή σας και την κατανοούμε.
        </p>
        <p style="font-size: 14px; color: #666; font-family: Arial, sans-serif; margin-top: 30px;">
          Ελπίζουμε να τα πούμε σύντομα!
        </p>
      `;
    } else {
      subject = `Επιβεβαίωση Απάντησης - ${title}`;
      message = `
        <h1 style="color: #4F46E5; font-family: Arial, sans-serif;">Ευχαριστούμε ${name}</h1>
        <p style="font-size: 16px; color: #333; font-family: Arial, sans-serif;">
          Λάβαμε την απάντησή σας για το <strong>${title}</strong>.
        </p>
        <p style="font-size: 16px; color: #333; font-family: Arial, sans-serif;">
          Ελπίζουμε να μπορέσετε να παρευρεθείτε!
        </p>
        <div style="margin: 30px 0;">
          <a href="${invitationUrl}" 
             style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-family: Arial, sans-serif; display: inline-block;">
            Δείτε την Πρόσκληση
          </a>
        </div>
        <p style="font-size: 14px; color: #666; font-family: Arial, sans-serif;">
          Μπορείτε να ενημερώσετε την απάντησή σας ανά πάσα στιγμή.
        </p>
      `;
    }

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'WediLink <onboarding@resend.dev>',
        to: [email],
        subject: subject,
        html: message,
      }),
    });

    const emailData = await emailResponse.json();

    if (!emailResponse.ok) {
      throw new Error(`Resend API error: ${JSON.stringify(emailData)}`);
    }

    console.log("✅ Email sent successfully:", emailData);

    return new Response(
      JSON.stringify({ 
        success: true, 
        emailId: emailData.id 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("❌ Error in send-rsvp-confirmation function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);
