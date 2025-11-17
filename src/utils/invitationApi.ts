import { PremiumTemplateConfig } from '@/config/premiumTemplates';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const API_BASE = `${SUPABASE_URL}/functions/v1`;

interface InvitationResponse {
  success: boolean;
  invitationId: string;
  shareUrl: string;
}

interface GetInvitationResponse {
  success: boolean;
  invitation: {
    id: string;
    templateData: PremiumTemplateConfig;
    hostName: string;
    eventDate: string;
    eventType: string;
    createdAt: string;
    views: number;
    rsvps: any[];
  };
}

async function apiCall(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'API request failed' }));
    throw new Error(error.message || 'API request failed');
  }
  
  return response.json();
}

export async function createInvitation(data: {
  templateData: PremiumTemplateConfig;
  hostName: string;
  eventDate: string;
  eventType: string;
}): Promise<InvitationResponse> {
  return apiCall('/invitations', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getInvitation(id: string): Promise<GetInvitationResponse> {
  return apiCall(`/invitations/${id}`);
}

export async function submitRSVP(invitationId: string, rsvpData: {
  name: string;
  email: string;
  phone?: string;
  attending: boolean;
  message?: string;
}) {
  return apiCall(`/invitations/${invitationId}/rsvp`, {
    method: 'POST',
    body: JSON.stringify(rsvpData),
  });
}
