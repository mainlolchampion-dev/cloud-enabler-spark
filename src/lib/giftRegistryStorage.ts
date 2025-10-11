import { supabase } from "@/integrations/supabase/client";

export interface GiftItem {
  id: string;
  invitationId: string;
  itemName: string;
  itemDescription?: string;
  price?: number;
  storeName?: string;
  storeUrl?: string;
  imageUrl?: string;
  priority: number;
  purchased: boolean;
  purchasedBy?: string;
  purchasedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Get all gift items for an invitation
export async function getGiftItems(invitationId: string): Promise<GiftItem[]> {
  const { data, error } = await supabase
    .from('gift_registry')
    .select('*')
    .eq('invitation_id', invitationId)
    .order('priority', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching gift items:', error);
    return [];
  }

  return data.map(item => ({
    id: item.id,
    invitationId: item.invitation_id,
    itemName: item.item_name,
    itemDescription: item.item_description,
    price: item.price ? parseFloat(item.price as any) : undefined,
    storeName: item.store_name,
    storeUrl: item.store_url,
    imageUrl: item.image_url,
    priority: item.priority,
    purchased: item.purchased,
    purchasedBy: item.purchased_by,
    purchasedAt: item.purchased_at,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  }));
}

// Create a gift item
export async function createGiftItem(item: Omit<GiftItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<GiftItem> {
  const { data, error } = await supabase
    .from('gift_registry')
    .insert({
      invitation_id: item.invitationId,
      item_name: item.itemName,
      item_description: item.itemDescription,
      price: item.price,
      store_name: item.storeName,
      store_url: item.storeUrl,
      image_url: item.imageUrl,
      priority: item.priority,
      purchased: item.purchased,
      purchased_by: item.purchasedBy,
      purchased_at: item.purchasedAt,
    } as any)
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    invitationId: data.invitation_id,
    itemName: data.item_name,
    itemDescription: data.item_description,
    price: data.price ? parseFloat(data.price as any) : undefined,
    storeName: data.store_name,
    storeUrl: data.store_url,
    imageUrl: data.image_url,
    priority: data.priority,
    purchased: data.purchased,
    purchasedBy: data.purchased_by,
    purchasedAt: data.purchased_at,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

// Update a gift item
export async function updateGiftItem(id: string, updates: Partial<GiftItem>): Promise<void> {
  const dbUpdates: any = {};
  
  if (updates.itemName !== undefined) dbUpdates.item_name = updates.itemName;
  if (updates.itemDescription !== undefined) dbUpdates.item_description = updates.itemDescription;
  if (updates.price !== undefined) dbUpdates.price = updates.price;
  if (updates.storeName !== undefined) dbUpdates.store_name = updates.storeName;
  if (updates.storeUrl !== undefined) dbUpdates.store_url = updates.storeUrl;
  if (updates.imageUrl !== undefined) dbUpdates.image_url = updates.imageUrl;
  if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
  if (updates.purchased !== undefined) dbUpdates.purchased = updates.purchased;
  if (updates.purchasedBy !== undefined) dbUpdates.purchased_by = updates.purchasedBy;
  if (updates.purchasedAt !== undefined) dbUpdates.purchased_at = updates.purchasedAt;

  const { error } = await supabase
    .from('gift_registry')
    .update(dbUpdates)
    .eq('id', id);

  if (error) throw error;
}

// Delete a gift item
export async function deleteGiftItem(id: string): Promise<void> {
  const { error } = await supabase
    .from('gift_registry')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Mark item as purchased (for public view)
export async function markItemPurchased(id: string, purchasedBy: string): Promise<void> {
  const { error } = await supabase
    .from('gift_registry')
    .update({
      purchased: true,
      purchased_by: purchasedBy,
      purchased_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) throw error;
}
