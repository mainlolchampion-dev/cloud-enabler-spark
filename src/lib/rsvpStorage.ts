// Storage module for RSVP responses

export interface RSVPResponse {
  id: string;
  invitationId: string;
  name: string;
  email?: string;
  phone?: string;
  numberOfGuests: number;
  willAttend: 'yes' | 'no' | 'maybe';
  dietaryRestrictions?: string;
  message?: string;
  createdAt: string;
}

const RSVP_KEY_PREFIX = 'rsvp:';

// Generate UUID v4
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Save RSVP response
export function saveRSVP(response: Omit<RSVPResponse, 'id' | 'createdAt'>): RSVPResponse {
  const rsvp: RSVPResponse = {
    ...response,
    id: generateUUID(),
    createdAt: new Date().toISOString(),
  };
  
  // Get existing responses for this invitation
  const responses = getRSVPsForInvitation(response.invitationId);
  responses.push(rsvp);
  
  // Save updated list
  localStorage.setItem(`${RSVP_KEY_PREFIX}${response.invitationId}`, JSON.stringify(responses));
  
  return rsvp;
}

// Get all RSVPs for an invitation
export function getRSVPsForInvitation(invitationId: string): RSVPResponse[] {
  const stored = localStorage.getItem(`${RSVP_KEY_PREFIX}${invitationId}`);
  return stored ? JSON.parse(stored) : [];
}

// Get RSVP statistics
export function getRSVPStats(invitationId: string) {
  const responses = getRSVPsForInvitation(invitationId);
  
  return {
    total: responses.length,
    attending: responses.filter(r => r.willAttend === 'yes').length,
    notAttending: responses.filter(r => r.willAttend === 'no').length,
    maybe: responses.filter(r => r.willAttend === 'maybe').length,
    totalGuests: responses
      .filter(r => r.willAttend === 'yes')
      .reduce((sum, r) => sum + r.numberOfGuests, 0),
  };
}
