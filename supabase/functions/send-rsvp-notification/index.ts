import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Input validation schema
const rsvpNotificationSchema = z.object({
  invitationId: z.string().uuid(),
  guestName: z.string().trim().min(1).max(100),
  guestEmail: z.string().email().max(255),
  guestPhone: z.string().max(20).optional(),
  willAttend: z.enum(['yes', 'no', 'maybe']),
  numberOfGuests: z.number().int().min(1).max(20),
  dietaryRestrictions: z.string().max(500).optional(),
  message: z.string().max(2000).optional(),
  invitationTitle: z.string().max(200).optional(),
  invitationType: z.enum(['wedding', 'baptism', 'party']),
});

interface RSVPNotificationRequest {
  invitationId: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  willAttend: 'yes' | 'no' | 'maybe';
  numberOfGuests: number;
  dietaryRestrictions?: string;
  message?: string;
  invitationTitle?: string;
  invitationType: 'wedding' | 'baptism' | 'party';
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse and validate input
    const body = await req.json();
    const validation = rsvpNotificationSchema.safeParse(body);
    
    if (!validation.success) {
      console.error('❌ Invalid input:', validation.error);
      return new Response(
        JSON.stringify({ error: 'Invalid input', details: validation.error.errors }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const {
      invitationId,
      guestName,
      guestEmail,
      guestPhone,
      willAttend,
      numberOfGuests,
      dietaryRestrictions,
      message,
      invitationTitle,
      invitationType,
    }: RSVPNotificationRequest = validation.data;

    console.log(`📩 Sending RSVP notification for invitation ${invitationId}`);

    // Create Supabase client to get owner's email
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Get invitation owner's email
    const { data: invitation, error: invError } = await supabaseClient
      .from('invitations')
      .select('user_id')
      .eq('id', invitationId)
      .single();

    if (invError || !invitation) {
      throw new Error('Invitation not found');
    }

    // Get owner's email from auth.users
    const { data: { user: ownerUser }, error: userError } = await supabaseClient.auth.admin.getUserById(invitation.user_id);

    if (userError || !ownerUser?.email) {
      throw new Error('Owner email not found');
    }

    // Check notification preferences
    const { data: preferences } = await supabaseClient
      .from('notification_preferences')
      .select('email_rsvp_confirmations')
      .eq('user_id', invitation.user_id)
      .single();

    if (preferences && !preferences.email_rsvp_confirmations) {
      console.log('📧 RSVP email notifications are disabled for this user');
      return new Response(
        JSON.stringify({ success: false, message: 'Email notifications disabled' }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const ownerEmail = ownerUser.email;

    // Format attendance status in Greek - sanitized
    const attendanceStatus = willAttend === 'yes' 
      ? '✅ Ναι, θα έρθω' 
      : willAttend === 'no' 
      ? '❌ Δυστυχώς δεν θα μπορέσω' 
      : '❓ Ίσως';

    // Format event type in Greek
    const eventTypeGreek = invitationType === 'wedding' 
      ? 'Γάμος' 
      : invitationType === 'baptism' 
      ? 'Βάπτιση' 
      : 'Πάρτι';

    // Sanitize user-provided strings for email
    const sanitizedGuestName = guestName.replace(/[<>"']/g, '');
    const sanitizedGuestEmail = guestEmail.replace(/[<>"']/g, '');
    const sanitizedGuestPhone = guestPhone?.replace(/[<>"']/g, '') || '';
    const sanitizedTitle = invitationTitle?.replace(/[<>"']/g, '') || 'Εκδήλωση';
    const sanitizedDietaryRestrictions = dietaryRestrictions?.replace(/[<>"']/g, '') || '';
    const sanitizedMessage = message?.replace(/[<>"']/g, '') || '';

    // Build email HTML
    let emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333; border-bottom: 2px solid #f97316; padding-bottom: 10px;">
          Νέα Απάντηση RSVP
        </h1>
        
        <p style="font-size: 16px; color: #666;">
          Λάβατε μια νέα απάντηση για την εκδήλωσή σας!
        </p>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #f97316; margin-top: 0;">Στοιχεία Εκδήλωσης</h2>
          <p><strong>Τίτλος:</strong> ${sanitizedTitle}</p>
          <p><strong>Τύπος:</strong> ${eventTypeGreek}</p>
        </div>
        
        <div style="background-color: #fff; border: 1px solid #ddd; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #f97316; margin-top: 0;">Στοιχεία Καλεσμένου</h2>
          <p><strong>Όνομα:</strong> ${sanitizedGuestName}</p>
          <p><strong>Email:</strong> ${sanitizedGuestEmail}</p>
          ${sanitizedGuestPhone ? `<p><strong>Τηλέφωνο:</strong> ${sanitizedGuestPhone}</p>` : ''}
          <p><strong>Θα παραβρεθεί:</strong> ${attendanceStatus}</p>
          ${willAttend === 'yes' ? `<p><strong>Αριθμός ατόμων:</strong> ${numberOfGuests}</p>` : ''}
          ${sanitizedDietaryRestrictions ? `<p><strong>Διατροφικοί περιορισμοί:</strong> ${sanitizedDietaryRestrictions}</p>` : ''}
        </div>
        
        ${sanitizedMessage ? `
        <div style="background-color: #fff8e6; border-left: 4px solid #f97316; padding: 15px; margin: 20px 0;">
          <h3 style="color: #f97316; margin-top: 0;">Μήνυμα από τον καλεσμένο:</h3>
          <p style="font-style: italic;">"${sanitizedMessage}"</p>
        </div>
        ` : ''}
        
        <p style="color: #999; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
          Αυτό το email στάλθηκε αυτόματα από το σύστημα WediLink.
        </p>
      </div>
    `;

    // Send email using Resend API
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'WediLink RSVP <onboarding@resend.dev>',
        to: [ownerEmail],
        subject: `Νέα απάντηση RSVP: ${sanitizedGuestName} - ${sanitizedTitle}`,
        html: emailHtml,
      }),
    });

    const emailData = await emailResponse.json();
    const status = emailResponse.ok ? 'sent' : 'failed';
    const errorMessage = emailResponse.ok ? null : JSON.stringify(emailData);

    console.log("✅ Notification email sent to owner:", emailData);

    // Log to notification_history
    await supabaseClient.from("notification_history").insert({
      user_id: invitation.user_id,
      invitation_id: invitationId,
      type: 'email',
      subject: `Νέα απάντηση RSVP: ${sanitizedGuestName}`,
      recipient: ownerEmail,
      status,
      error_message: errorMessage,
    });

    if (!emailResponse.ok) {
      throw new Error(`Resend API error: ${JSON.stringify(emailData)}`);
    }

    return new Response(JSON.stringify({ success: true, messageId: emailData.id }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("❌ Error in send-rsvp-notification function:", error);

    // Try to log failed notification
    try {
      const { invitationId } = await req.json().catch(() => ({}));
      if (invitationId) {
        const supabaseClient = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
        );

        const { data: invitation } = await supabaseClient
          .from('invitations')
          .select('user_id')
          .eq('id', invitationId)
          .single();

        if (invitation) {
          await supabaseClient.from("notification_history").insert({
            user_id: invitation.user_id,
            invitation_id: invitationId,
            type: 'email',
            subject: 'Νέα απάντηση RSVP',
            recipient: 'unknown',
            status: 'failed',
            error_message: error instanceof Error ? error.message : "Unknown error",
          });
        }
      }
    } catch (logError) {
      console.error("Failed to log error:", logError);
    }

    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
