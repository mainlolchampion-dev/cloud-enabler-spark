import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InvitationData {
  templateData: any;
  hostName: string;
  eventDate: string;
  eventType: string;
}

interface RSVPData {
  name: string;
  email: string;
  phone?: string;
  attending: boolean;
  message?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    
    // POST /invitations - Create new invitation
    if (req.method === 'POST' && pathParts.length === 2) {
      const data: InvitationData = await req.json();
      
      // Generate unique ID
      const invitationId = `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Store in Supabase storage (using a simple table)
      const { error } = await supabaseClient
        .from('custom_invitations')
        .insert({
          id: invitationId,
          template_data: data.templateData,
          host_name: data.hostName,
          event_date: data.eventDate,
          event_type: data.eventType,
          views: 0,
          rsvps: []
        });

      if (error) {
        console.error('Error creating invitation:', error);
        throw error;
      }

      const shareUrl = `${url.origin}/invitation/${invitationId}`;
      
      return new Response(
        JSON.stringify({
          success: true,
          invitationId,
          shareUrl
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }
    
    // GET /invitations/:id - Get invitation by ID
    if (req.method === 'GET' && pathParts.length === 3) {
      const invitationId = pathParts[2];
      
      const { data: invitation, error } = await supabaseClient
        .from('custom_invitations')
        .select('*')
        .eq('id', invitationId)
        .single();

      if (error || !invitation) {
        return new Response(
          JSON.stringify({ error: 'Invitation not found' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 404,
          }
        );
      }

      // Increment views
      await supabaseClient
        .from('custom_invitations')
        .update({ views: (invitation.views || 0) + 1 })
        .eq('id', invitationId);

      return new Response(
        JSON.stringify({
          success: true,
          invitation: {
            id: invitation.id,
            templateData: invitation.template_data,
            hostName: invitation.host_name,
            eventDate: invitation.event_date,
            eventType: invitation.event_type,
            createdAt: invitation.created_at,
            views: invitation.views + 1,
            rsvps: invitation.rsvps || []
          }
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }
    
    // POST /invitations/:id/rsvp - Submit RSVP
    if (req.method === 'POST' && pathParts.length === 4 && pathParts[3] === 'rsvp') {
      const invitationId = pathParts[2];
      const rsvpData: RSVPData = await req.json();
      
      const { data: invitation, error: fetchError } = await supabaseClient
        .from('custom_invitations')
        .select('*')
        .eq('id', invitationId)
        .single();

      if (fetchError || !invitation) {
        return new Response(
          JSON.stringify({ error: 'Invitation not found' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 404,
          }
        );
      }

      const rsvps = invitation.rsvps || [];
      rsvps.push({
        ...rsvpData,
        submittedAt: new Date().toISOString()
      });

      const { error: updateError } = await supabaseClient
        .from('custom_invitations')
        .update({ rsvps })
        .eq('id', invitationId);

      if (updateError) {
        console.error('Error submitting RSVP:', updateError);
        throw updateError;
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: 'RSVP submitted successfully'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Invalid route
    return new Response(
      JSON.stringify({ error: 'Not found' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404,
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'An error occurred' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
