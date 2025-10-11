// Invitation storage using Lovable Cloud (Supabase)
import { supabase } from "@/integrations/supabase/client";

export type InvitationType = 'wedding' | 'baptism' | 'party';

export interface BaseInvitation {
  id: string;
  type: InvitationType;
  title: string;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  data: any;
}

// Generate UUID v4
export function generateUUID(): string {
  return crypto.randomUUID();
}

// Get all invitations for the current user
export async function getInvitationsIndex(): Promise<BaseInvitation[]> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from('invitations')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching invitations:', error);
    return [];
  }

  return data.map(inv => ({
    id: inv.id,
    type: inv.type as InvitationType,
    title: inv.title,
    status: inv.status as 'draft' | 'published',
    createdAt: inv.created_at,
    updatedAt: inv.updated_at,
    publishedAt: inv.published_at || undefined,
    data: inv.data,
  }));
}

// Save draft
export async function saveDraft(invitation: Partial<BaseInvitation>): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be logged in to save drafts');
  }

  // If invitation has an ID, update it
  if (invitation.id) {
    const { error } = await supabase
      .from('invitations')
      .update({
        title: invitation.title,
        type: invitation.type,
        data: invitation.data,
        status: 'draft',
      })
      .eq('id', invitation.id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error updating draft:', error);
      throw error;
    }

    return invitation.id;
  }

  // Create new invitation
  const { data, error } = await supabase
    .from('invitations')
    .insert({
      user_id: user.id,
      type: invitation.type || 'wedding',
      title: invitation.title || 'Untitled',
      status: 'draft',
      data: invitation.data || {},
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating draft:', error);
    throw error;
  }

  return data.id;
}

// Publish invitation
// Publish invitation
export async function publishInvitation(
  id: string,
  data: any,
  type: InvitationType,
  title: string
): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be logged in to publish invitations');
  }

  console.log('Publishing invitation to database:', { id, type, title, dataKeys: Object.keys(data) });

  const { error } = await supabase
    .from('invitations')
    .upsert({
      id,
      user_id: user.id,
      type,
      title,
      status: 'published',
      data,
      published_at: new Date().toISOString(),
    });

  if (error) {
    console.error('Error publishing invitation:', error);
    throw error;
  }
  
  console.log('Invitation published successfully');
}

// Get invitation by ID (public - anyone can access published invitations)
export async function getInvitation(id: string): Promise<BaseInvitation | null> {
  const { data, error } = await supabase
    .from('invitations')
    .select('*')
    .eq('id', id)
    .eq('status', 'published')
    .maybeSingle();

  if (error) {
    console.error('Error fetching invitation:', error);
    return null;
  }

  if (!data) {
    return null;
  }

  return {
    id: data.id,
    type: data.type as InvitationType,
    title: data.title,
    status: data.status as 'draft' | 'published',
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    publishedAt: data.published_at || undefined,
    data: data.data,
  };
}

// Delete invitation
export async function deleteInvitation(id: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be logged in to delete invitations');
  }

  const { error } = await supabase
    .from('invitations')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error deleting invitation:', error);
    throw error;
  }
}
