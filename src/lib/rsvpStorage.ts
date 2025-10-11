// RSVP storage using Supabase
import { supabase } from "@/integrations/supabase/client";

export interface RSVPResponse {
  id: string;
  invitationId: string;
  name: string;
  email: string;
  phone?: string;
  numberOfGuests: number;
  willAttend: 'yes' | 'no' | 'maybe';
  dietaryRestrictions?: string;
  message?: string;
  createdAt: string;
}

export interface RSVPStats {
  total: number;
  attending: number;
  notAttending: number;
  maybe: number;
  totalGuests: number;
}

// Save RSVP response
export async function saveRSVP(
  response: Omit<RSVPResponse, 'id' | 'createdAt'>
): Promise<RSVPResponse> {
  const { data, error } = await supabase
    .from('rsvps')
    .insert({
      invitation_id: response.invitationId,
      name: response.name,
      email: response.email,
      phone: response.phone,
      number_of_guests: response.numberOfGuests,
      will_attend: response.willAttend,
      dietary_restrictions: response.dietaryRestrictions,
      message: response.message,
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving RSVP:', error);
    throw error;
  }

  return {
    id: data.id,
    invitationId: data.invitation_id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    numberOfGuests: data.number_of_guests,
    willAttend: data.will_attend as 'yes' | 'no' | 'maybe',
    dietaryRestrictions: data.dietary_restrictions,
    message: data.message,
    createdAt: data.created_at,
  };
}

// Get all RSVPs for an invitation
export async function getRSVPsForInvitation(invitationId: string): Promise<RSVPResponse[]> {
  const { data, error } = await supabase
    .from('rsvps')
    .select('*')
    .eq('invitation_id', invitationId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching RSVPs:', error);
    return [];
  }

  return data.map(rsvp => ({
    id: rsvp.id,
    invitationId: rsvp.invitation_id,
    name: rsvp.name,
    email: rsvp.email,
    phone: rsvp.phone,
    numberOfGuests: rsvp.number_of_guests,
    willAttend: rsvp.will_attend as 'yes' | 'no' | 'maybe',
    dietaryRestrictions: rsvp.dietary_restrictions,
    message: rsvp.message,
    createdAt: rsvp.created_at,
  }));
}

// Get RSVP statistics
export async function getRSVPStats(invitationId: string): Promise<RSVPStats> {
  const responses = await getRSVPsForInvitation(invitationId);
  
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

// Delete RSVP (for invitation owner)
export async function deleteRSVP(id: string): Promise<void> {
  const { error } = await supabase
    .from('rsvps')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting RSVP:', error);
    throw error;
  }
}

// Export RSVPs to CSV format
export function exportRSVPsToCSV(rsvps: RSVPResponse[]): string {
  const headers = ['Name', 'Email', 'Phone', 'Will Attend', 'Number of Guests', 'Dietary Restrictions', 'Message', 'Created At'];
  const rows = rsvps.map(rsvp => [
    rsvp.name,
    rsvp.email,
    rsvp.phone || '',
    rsvp.willAttend,
    rsvp.numberOfGuests.toString(),
    rsvp.dietaryRestrictions || '',
    rsvp.message || '',
    new Date(rsvp.createdAt).toLocaleString('el-GR'),
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');

  return csvContent;
}
