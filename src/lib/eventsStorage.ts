import { supabase } from "@/integrations/supabase/client";

export interface EventTimeline {
  id: string;
  invitationId: string;
  eventName: string;
  eventDescription?: string;
  eventDate: string;
  eventTime?: string;
  locationName?: string;
  locationAddress?: string;
  locationLat?: number;
  locationLng?: number;
  eventOrder: number;
  createdAt: string;
  updatedAt: string;
}

// Get all events for an invitation
export async function getEvents(invitationId: string): Promise<EventTimeline[]> {
  const { data, error } = await supabase
    .from('events_timeline')
    .select('*')
    .eq('invitation_id', invitationId)
    .order('event_order', { ascending: true })
    .order('event_date', { ascending: true });

  if (error) {
    console.error('Error fetching events:', error);
    return [];
  }

  return data.map(event => ({
    id: event.id,
    invitationId: event.invitation_id,
    eventName: event.event_name,
    eventDescription: event.event_description,
    eventDate: event.event_date,
    eventTime: event.event_time,
    locationName: event.location_name,
    locationAddress: event.location_address,
    locationLat: event.location_lat ? parseFloat(event.location_lat as any) : undefined,
    locationLng: event.location_lng ? parseFloat(event.location_lng as any) : undefined,
    eventOrder: event.event_order,
    createdAt: event.created_at,
    updatedAt: event.updated_at,
  }));
}

// Create an event
export async function createEvent(event: Omit<EventTimeline, 'id' | 'createdAt' | 'updatedAt'>): Promise<EventTimeline> {
  const { data, error } = await supabase
    .from('events_timeline')
    .insert({
      invitation_id: event.invitationId,
      event_name: event.eventName,
      event_description: event.eventDescription,
      event_date: event.eventDate,
      event_time: event.eventTime,
      location_name: event.locationName,
      location_address: event.locationAddress,
      location_lat: event.locationLat,
      location_lng: event.locationLng,
      event_order: event.eventOrder,
    } as any)
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    invitationId: data.invitation_id,
    eventName: data.event_name,
    eventDescription: data.event_description,
    eventDate: data.event_date,
    eventTime: data.event_time,
    locationName: data.location_name,
    locationAddress: data.location_address,
    locationLat: data.location_lat ? parseFloat(data.location_lat as any) : undefined,
    locationLng: data.location_lng ? parseFloat(data.location_lng as any) : undefined,
    eventOrder: data.event_order,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

// Update an event
export async function updateEvent(id: string, updates: Partial<EventTimeline>): Promise<void> {
  const dbUpdates: any = {};
  
  if (updates.eventName !== undefined) dbUpdates.event_name = updates.eventName;
  if (updates.eventDescription !== undefined) dbUpdates.event_description = updates.eventDescription;
  if (updates.eventDate !== undefined) dbUpdates.event_date = updates.eventDate;
  if (updates.eventTime !== undefined) dbUpdates.event_time = updates.eventTime;
  if (updates.locationName !== undefined) dbUpdates.location_name = updates.locationName;
  if (updates.locationAddress !== undefined) dbUpdates.location_address = updates.locationAddress;
  if (updates.locationLat !== undefined) dbUpdates.location_lat = updates.locationLat;
  if (updates.locationLng !== undefined) dbUpdates.location_lng = updates.locationLng;
  if (updates.eventOrder !== undefined) dbUpdates.event_order = updates.eventOrder;

  const { error } = await supabase
    .from('events_timeline')
    .update(dbUpdates)
    .eq('id', id);

  if (error) throw error;
}

// Delete an event
export async function deleteEvent(id: string): Promise<void> {
  const { error } = await supabase
    .from('events_timeline')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
