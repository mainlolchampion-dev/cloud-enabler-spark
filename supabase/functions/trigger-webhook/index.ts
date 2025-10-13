import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Schema for validating webhook URL and preventing SSRF
const webhookRequestSchema = z.object({
  url: z.string().url().refine((url) => {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();
    
    // Block localhost and internal IP ranges
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '0.0.0.0' ||
      hostname.startsWith('10.') ||
      hostname.startsWith('192.168.') ||
      hostname.match(/^172\.(1[6-9]|2[0-9]|3[01])\./)
    ) {
      return false;
    }
    
    // Only allow HTTP/HTTPS
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return false;
    }
    
    return true;
  }, {
    message: "Internal URLs and non-HTTP protocols are not allowed"
  }),
  data: z.record(z.any()),
});

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    
    // Validate request
    const validated = webhookRequestSchema.parse(body);
    
    console.log('🔔 Triggering webhook:', validated.url);
    
    // Send webhook request with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    try {
      const response = await fetch(validated.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Lovable-Webhook/1.0',
        },
        body: JSON.stringify(validated.data),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      console.log('✅ Webhook response status:', response.status);
      
      return new Response(
        JSON.stringify({
          success: true,
          status: response.status,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error('❌ Webhook request failed:', fetchError);
      
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Webhook request failed',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }
  } catch (error) {
    console.error('❌ Error processing webhook request:', error);
    
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid webhook request',
          details: error.errors,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }
    
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal server error',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
