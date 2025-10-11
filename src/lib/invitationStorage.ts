// Storage module for invitations - can be replaced with API later

export type InvitationType = 'wedding' | 'baptism' | 'party';

export interface BaseInvitation {
  id: string;
  type: InvitationType;
  title: string;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
  data: any;
}

const INVITATIONS_INDEX_KEY = 'invites:index';

// Generate UUID v4
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Get all invitations index
export function getInvitationsIndex(): BaseInvitation[] {
  const index = localStorage.getItem(INVITATIONS_INDEX_KEY);
  return index ? JSON.parse(index) : [];
}

// Save invitations index
function saveInvitationsIndex(index: BaseInvitation[]) {
  localStorage.setItem(INVITATIONS_INDEX_KEY, JSON.stringify(index));
}

// Save draft
export function saveDraft(invitation: Partial<BaseInvitation>): BaseInvitation {
  const index = getInvitationsIndex();
  const now = new Date().toISOString();
  
  let savedInvitation: BaseInvitation;
  
  if (invitation.id) {
    // Update existing
    const existingIndex = index.findIndex(inv => inv.id === invitation.id);
    savedInvitation = {
      ...index[existingIndex],
      ...invitation,
      updatedAt: now,
    } as BaseInvitation;
    
    if (existingIndex >= 0) {
      index[existingIndex] = savedInvitation;
    } else {
      index.push(savedInvitation);
    }
  } else {
    // Create new
    savedInvitation = {
      id: generateUUID(),
      type: invitation.type || 'wedding',
      title: invitation.title || 'Untitled',
      status: 'draft',
      createdAt: now,
      updatedAt: now,
      data: invitation.data || {},
    };
    index.push(savedInvitation);
  }
  
  // Save to index and individual key
  saveInvitationsIndex(index);
  localStorage.setItem(`invite:${savedInvitation.id}`, JSON.stringify(savedInvitation));
  
  return savedInvitation;
}

// Publish invitation
export function publishInvitation(id: string, data: any, type: InvitationType, title: string): BaseInvitation {
  const index = getInvitationsIndex();
  const now = new Date().toISOString();
  
  const existingIndex = index.findIndex(inv => inv.id === id);
  
  const publishedInvitation: BaseInvitation = {
    id,
    type,
    title,
    status: 'published',
    createdAt: existingIndex >= 0 ? index[existingIndex].createdAt : now,
    updatedAt: now,
    data,
  };
  
  if (existingIndex >= 0) {
    index[existingIndex] = publishedInvitation;
  } else {
    index.push(publishedInvitation);
  }
  
  saveInvitationsIndex(index);
  localStorage.setItem(`invite:${id}`, JSON.stringify(publishedInvitation));
  
  return publishedInvitation;
}

// Get invitation by ID
export function getInvitation(id: string): BaseInvitation | null {
  const stored = localStorage.getItem(`invite:${id}`);
  return stored ? JSON.parse(stored) : null;
}

// Delete invitation
export function deleteInvitation(id: string): void {
  const index = getInvitationsIndex();
  const newIndex = index.filter(inv => inv.id !== id);
  saveInvitationsIndex(newIndex);
  localStorage.removeItem(`invite:${id}`);
}
