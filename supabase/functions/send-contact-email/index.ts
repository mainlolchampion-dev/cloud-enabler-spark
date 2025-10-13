import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Input validation schema
const contactEmailSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().email().max(255),
  phone: z.string().max(20).optional(),
  subject: z.string().trim().min(1).max(200),
  message: z.string().trim().min(1).max(2000),
});

interface ContactEmailRequest {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse and validate input
    const body = await req.json();
    const validation = contactEmailSchema.safeParse(body);
    
    if (!validation.success) {
      console.error('❌ Invalid input:', validation.error);
      return new Response(
        JSON.stringify({ error: 'Invalid input', details: validation.error.errors }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { name, email, phone, subject, message }: ContactEmailRequest = validation.data;

    console.log("Received contact form submission:", { name, email, subject });

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    // Sanitize user inputs for email
    const sanitizedName = name.replace(/[<>"']/g, '');
    const sanitizedEmail = email.replace(/[<>"']/g, '');
    const sanitizedPhone = phone?.replace(/[<>"']/g, '') || '';
    const sanitizedSubject = subject.replace(/[<>"']/g, '');
    const sanitizedMessage = message.replace(/[<>"']/g, '');

    // Send email to company
    const companyEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'WediLink Contact <onboarding@resend.dev>',
        to: ['wedilink@gmail.com'],
        reply_to: sanitizedEmail,
        subject: `Νέο μήνυμα επικοινωνίας: ${sanitizedSubject}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                }
                .header {
                  background: linear-gradient(135deg, #ff6b9d 0%, #c06c84 100%);
                  color: white;
                  padding: 30px;
                  border-radius: 10px 10px 0 0;
                  text-align: center;
                }
                .content {
                  background: #f9f9f9;
                  padding: 30px;
                  border: 1px solid #e0e0e0;
                  border-radius: 0 0 10px 10px;
                }
                .info-row {
                  margin: 15px 0;
                  padding: 10px;
                  background: white;
                  border-left: 4px solid #ff6b9d;
                  border-radius: 4px;
                }
                .label {
                  font-weight: bold;
                  color: #666;
                  font-size: 12px;
                  text-transform: uppercase;
                  letter-spacing: 0.5px;
                }
                .value {
                  margin-top: 5px;
                  font-size: 15px;
                }
                .message-box {
                  background: white;
                  padding: 20px;
                  border-radius: 8px;
                  margin-top: 20px;
                  white-space: pre-wrap;
                  line-height: 1.8;
                }
                .footer {
                  margin-top: 30px;
                  text-align: center;
                  color: #999;
                  font-size: 12px;
                }
              </style>
            </head>
            <body>
              <div class="header">
                <h1 style="margin: 0; font-size: 24px;">💌 Νέο Μήνυμα Επικοινωνίας</h1>
              </div>
              <div class="content">
                <div class="info-row">
                  <div class="label">Όνομα</div>
                  <div class="value">${sanitizedName}</div>
                </div>
                
                <div class="info-row">
                  <div class="label">Email</div>
                  <div class="value"><a href="mailto:${sanitizedEmail}" style="color: #ff6b9d; text-decoration: none;">${sanitizedEmail}</a></div>
                </div>
                
                ${sanitizedPhone ? `
                <div class="info-row">
                  <div class="label">Τηλέφωνο</div>
                  <div class="value">${sanitizedPhone}</div>
                </div>
                ` : ''}
                
                <div class="info-row">
                  <div class="label">Θέμα</div>
                  <div class="value">${sanitizedSubject}</div>
                </div>
                
                <div style="margin-top: 25px;">
                  <div class="label" style="margin-bottom: 10px;">Μήνυμα</div>
                  <div class="message-box">${sanitizedMessage}</div>
                </div>
                
                <div class="footer">
                  <p>Αυτό το email στάλθηκε από τη φόρμα επικοινωνίας του WediLink</p>
                  <p>Μπορείτε να απαντήσετε απευθείας σε αυτό το email</p>
                </div>
              </div>
            </body>
          </html>
        `,
      }),
    });

    const companyEmailData = await companyEmailResponse.json();

    if (!companyEmailResponse.ok) {
      throw new Error(`Resend API error: ${JSON.stringify(companyEmailData)}`);
    }

    console.log("Company email sent successfully:", companyEmailData);

    // Send confirmation email to user
    const userEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'WediLink <onboarding@resend.dev>',
        to: [sanitizedEmail],
        subject: 'Λάβαμε το μήνυμά σας - WediLink',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                }
                .header {
                  background: linear-gradient(135deg, #ff6b9d 0%, #c06c84 100%);
                  color: white;
                  padding: 40px;
                  border-radius: 10px 10px 0 0;
                  text-align: center;
                }
                .content {
                  background: white;
                  padding: 40px;
                  border: 1px solid #e0e0e0;
                  border-radius: 0 0 10px 10px;
                }
                .message-preview {
                  background: #f9f9f9;
                  padding: 20px;
                  border-left: 4px solid #ff6b9d;
                  border-radius: 4px;
                  margin: 20px 0;
                }
                .button {
                  display: inline-block;
                  background: linear-gradient(135deg, #ff6b9d 0%, #c06c84 100%);
                  color: white;
                  padding: 15px 30px;
                  text-decoration: none;
                  border-radius: 8px;
                  margin: 20px 0;
                  font-weight: bold;
                }
                .footer {
                  margin-top: 30px;
                  text-align: center;
                  color: #999;
                  font-size: 13px;
                  padding-top: 20px;
                  border-top: 1px solid #e0e0e0;
                }
              </style>
            </head>
            <body>
              <div class="header">
                <h1 style="margin: 0; font-size: 28px;">✉️ Λάβαμε το μήνυμά σας!</h1>
              </div>
              <div class="content">
                <p style="font-size: 18px; margin-bottom: 20px;">Γεια σας ${sanitizedName},</p>
                
                <p>Σας ευχαριστούμε που επικοινωνήσατε με το WediLink! Λάβαμε το μήνυμά σας και θα επικοινωνήσουμε μαζί σας το συντομότερο δυνατό.</p>
                
                <div class="message-preview">
                  <p style="margin: 0; color: #666; font-size: 13px; font-weight: bold;">ΤΟ ΜΗΝΥΜΑ ΣΑΣ:</p>
                  <p style="margin: 10px 0 0 0;"><strong>Θέμα:</strong> ${sanitizedSubject}</p>
                  <p style="margin: 10px 0 0 0; white-space: pre-wrap;">${sanitizedMessage}</p>
                </div>
                
                <p>Η ομάδα υποστήριξής μας θα εξετάσει το αίτημά σας και θα επικοινωνήσει μαζί σας εντός 24 ωρών.</p>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="https://wedilink.lovable.app" class="button">Επισκεφθείτε το WediLink</a>
                </div>
                
                <p style="margin-top: 30px; color: #666; font-size: 14px;">
                  <strong>Χρειάζεστε άμεση βοήθεια;</strong><br>
                  📧 Email: wedilink@gmail.com<br>
                  📞 Τηλέφωνο: +30 210 123 4567<br>
                  🕐 Ωράριο: Δευτέρα - Παρασκευή, 9:00 - 18:00
                </p>
                
                <div class="footer">
                  <p><strong>WediLink</strong> - Τα καλύτερα ηλεκτρονικά προσκλητήρια</p>
                  <p>© 2025 WediLink. All rights reserved.</p>
                </div>
              </div>
            </body>
          </html>
        `,
      }),
    });

    const userEmailData = await userEmailResponse.json();

    if (!userEmailResponse.ok) {
      throw new Error(`Resend API error: ${JSON.stringify(userEmailData)}`);
    }

    console.log("User confirmation email sent successfully:", userEmailData);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Emails sent successfully",
        companyEmailId: companyEmailData.id,
        userEmailId: userEmailData.id 
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
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: "Failed to send contact email"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
