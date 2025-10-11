import { supabase } from "@/integrations/supabase/client";

export interface Guest {
  id: string;
  invitationId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  category?: string;
  plusOneAllowed: boolean;
  plusOneName?: string;
  dietaryRestrictions?: string;
  notes?: string;
  invitationSent: boolean;
  invitationSentAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GuestStats {
  total: number;
  withPlusOne: number;
  invited: number;
  categories: Record<string, number>;
}

// Get all guests for an invitation
export async function getGuests(invitationId: string): Promise<Guest[]> {
  const { data, error } = await supabase
    .from('guests')
    .select('*')
    .eq('invitation_id', invitationId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching guests:', error);
    return [];
  }

  return data.map(guest => ({
    id: guest.id,
    invitationId: guest.invitation_id,
    firstName: guest.first_name,
    lastName: guest.last_name,
    email: guest.email,
    phone: guest.phone,
    category: guest.category,
    plusOneAllowed: guest.plus_one_allowed,
    plusOneName: guest.plus_one_name,
    dietaryRestrictions: guest.dietary_restrictions,
    notes: guest.notes,
    invitationSent: guest.invitation_sent,
    invitationSentAt: guest.invitation_sent_at,
    createdAt: guest.created_at,
    updatedAt: guest.updated_at,
  }));
}

// Create a guest
export async function createGuest(guest: Omit<Guest, 'id' | 'createdAt' | 'updatedAt'>): Promise<Guest> {
  const { data, error } = await supabase
    .from('guests')
    .insert({
      invitation_id: guest.invitationId,
      first_name: guest.firstName,
      last_name: guest.lastName,
      email: guest.email,
      phone: guest.phone,
      category: guest.category,
      plus_one_allowed: guest.plusOneAllowed,
      plus_one_name: guest.plusOneName,
      dietary_restrictions: guest.dietaryRestrictions,
      notes: guest.notes,
      invitation_sent: guest.invitationSent,
      invitation_sent_at: guest.invitationSentAt,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    invitationId: data.invitation_id,
    firstName: data.first_name,
    lastName: data.last_name,
    email: data.email,
    phone: data.phone,
    category: data.category,
    plusOneAllowed: data.plus_one_allowed,
    plusOneName: data.plus_one_name,
    dietaryRestrictions: data.dietary_restrictions,
    notes: data.notes,
    invitationSent: data.invitation_sent,
    invitationSentAt: data.invitation_sent_at,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

// Update a guest
export async function updateGuest(id: string, updates: Partial<Guest>): Promise<void> {
  const dbUpdates: any = {};
  
  if (updates.firstName !== undefined) dbUpdates.first_name = updates.firstName;
  if (updates.lastName !== undefined) dbUpdates.last_name = updates.lastName;
  if (updates.email !== undefined) dbUpdates.email = updates.email;
  if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
  if (updates.category !== undefined) dbUpdates.category = updates.category;
  if (updates.plusOneAllowed !== undefined) dbUpdates.plus_one_allowed = updates.plusOneAllowed;
  if (updates.plusOneName !== undefined) dbUpdates.plus_one_name = updates.plusOneName;
  if (updates.dietaryRestrictions !== undefined) dbUpdates.dietary_restrictions = updates.dietaryRestrictions;
  if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
  if (updates.invitationSent !== undefined) dbUpdates.invitation_sent = updates.invitationSent;
  if (updates.invitationSentAt !== undefined) dbUpdates.invitation_sent_at = updates.invitationSentAt;

  const { error } = await supabase
    .from('guests')
    .update(dbUpdates)
    .eq('id', id);

  if (error) throw error;
}

// Delete a guest
export async function deleteGuest(id: string): Promise<void> {
  const { error } = await supabase
    .from('guests')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Import guests from CSV
export async function importGuestsFromCSV(
  invitationId: string,
  csvContent: string
): Promise<{ success: number; errors: string[] }> {
  const lines = csvContent.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  
  const results = { success: 0, errors: [] as string[] };

  for (let i = 1; i < lines.length; i++) {
    try {
      const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      const guest: any = { invitation_id: invitationId };

      headers.forEach((header, index) => {
        const value = values[index];
        switch (header) {
          case 'first name':
          case 'firstname':
            guest.first_name = value;
            break;
          case 'last name':
          case 'lastname':
            guest.last_name = value;
            break;
          case 'email':
            guest.email = value;
            break;
          case 'phone':
            guest.phone = value;
            break;
          case 'category':
            guest.category = value;
            break;
          case 'plus one':
          case 'plusone':
            guest.plus_one_allowed = value.toLowerCase() === 'yes' || value === '1';
            break;
          case 'dietary restrictions':
          case 'dietary':
            guest.dietary_restrictions = value;
            break;
        }
      });

      if (!guest.first_name || !guest.last_name) {
        results.errors.push(`Line ${i + 1}: Missing required fields`);
        continue;
      }

      await supabase.from('guests').insert(guest);
      results.success++;
    } catch (error: any) {
      results.errors.push(`Line ${i + 1}: ${error.message}`);
    }
  }

  return results;
}

// Get guest statistics
export async function getGuestStats(invitationId: string): Promise<GuestStats> {
  const guests = await getGuests(invitationId);
  
  const categories: Record<string, number> = {};
  guests.forEach(guest => {
    if (guest.category) {
      categories[guest.category] = (categories[guest.category] || 0) + 1;
    }
  });

  return {
    total: guests.length,
    withPlusOne: guests.filter(g => g.plusOneAllowed).length,
    invited: guests.filter(g => g.invitationSent).length,
    categories,
  };
}

// Export guests to CSV
export function exportGuestsToCSV(guests: Guest[]): string {
  const headers = [
    'First Name',
    'Last Name',
    'Email',
    'Phone',
    'Category',
    'Plus One Allowed',
    'Plus One Name',
    'Dietary Restrictions',
    'Notes',
    'Invitation Sent',
  ];

  const rows = guests.map(guest => [
    guest.firstName,
    guest.lastName,
    guest.email || '',
    guest.phone || '',
    guest.category || '',
    guest.plusOneAllowed ? 'Yes' : 'No',
    guest.plusOneName || '',
    guest.dietaryRestrictions || '',
    guest.notes || '',
    guest.invitationSent ? 'Yes' : 'No',
  ]);

  return [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');
}
