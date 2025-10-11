-- Create guests table for guest list management (before RSVP)
CREATE TABLE public.guests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invitation_id UUID NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  category TEXT, -- e.g., 'family', 'friends', 'colleagues'
  plus_one_allowed BOOLEAN DEFAULT false,
  plus_one_name TEXT,
  dietary_restrictions TEXT,
  notes TEXT,
  invitation_sent BOOLEAN DEFAULT false,
  invitation_sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for guests
CREATE POLICY "Users can view their own guests"
ON public.guests FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.invitations
  WHERE invitations.id = guests.invitation_id
  AND invitations.user_id = auth.uid()
));

CREATE POLICY "Users can create guests for their invitations"
ON public.guests FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.invitations
  WHERE invitations.id = guests.invitation_id
  AND invitations.user_id = auth.uid()
));

CREATE POLICY "Users can update their own guests"
ON public.guests FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.invitations
  WHERE invitations.id = guests.invitation_id
  AND invitations.user_id = auth.uid()
));

CREATE POLICY "Users can delete their own guests"
ON public.guests FOR DELETE
USING (EXISTS (
  SELECT 1 FROM public.invitations
  WHERE invitations.id = guests.invitation_id
  AND invitations.user_id = auth.uid()
));

-- Create trigger for updated_at
CREATE TRIGGER update_guests_updated_at
BEFORE UPDATE ON public.guests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create tables for seating chart
CREATE TABLE public.tables (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invitation_id UUID NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  table_number INTEGER NOT NULL,
  table_name TEXT,
  capacity INTEGER NOT NULL DEFAULT 8,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.tables ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage tables for their invitations"
ON public.tables FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.invitations
  WHERE invitations.id = tables.invitation_id
  AND invitations.user_id = auth.uid()
));

CREATE TRIGGER update_tables_updated_at
BEFORE UPDATE ON public.tables
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create guest-table assignments
CREATE TABLE public.guest_table_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_id UUID NOT NULL REFERENCES public.guests(id) ON DELETE CASCADE,
  table_id UUID NOT NULL REFERENCES public.tables(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(guest_id)
);

ALTER TABLE public.guest_table_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage table assignments for their guests"
ON public.guest_table_assignments FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.guests
  JOIN public.invitations ON invitations.id = guests.invitation_id
  WHERE guests.id = guest_table_assignments.guest_id
  AND invitations.user_id = auth.uid()
));

-- Create gift registry table
CREATE TABLE public.gift_registry (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invitation_id UUID NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  item_description TEXT,
  price DECIMAL(10, 2),
  store_name TEXT,
  store_url TEXT,
  image_url TEXT,
  priority INTEGER DEFAULT 0, -- 0=low, 1=medium, 2=high
  purchased BOOLEAN DEFAULT false,
  purchased_by TEXT,
  purchased_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.gift_registry ENABLE ROW LEVEL SECURITY;

-- RLS for gift registry - owners can manage, public can view
CREATE POLICY "Users can manage their gift registry"
ON public.gift_registry FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.invitations
  WHERE invitations.id = gift_registry.invitation_id
  AND invitations.user_id = auth.uid()
));

CREATE POLICY "Anyone can view published gift registries"
ON public.gift_registry FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.invitations
  WHERE invitations.id = gift_registry.invitation_id
  AND invitations.status = 'published'
));

CREATE TRIGGER update_gift_registry_updated_at
BEFORE UPDATE ON public.gift_registry
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create events timeline table
CREATE TABLE public.events_timeline (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invitation_id UUID NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  event_name TEXT NOT NULL,
  event_description TEXT,
  event_date DATE NOT NULL,
  event_time TIME,
  location_name TEXT,
  location_address TEXT,
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  event_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.events_timeline ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their events timeline"
ON public.events_timeline FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.invitations
  WHERE invitations.id = events_timeline.invitation_id
  AND invitations.user_id = auth.uid()
));

CREATE POLICY "Anyone can view published events timeline"
ON public.events_timeline FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.invitations
  WHERE invitations.id = events_timeline.invitation_id
  AND invitations.status = 'published'
));

CREATE TRIGGER update_events_timeline_updated_at
BEFORE UPDATE ON public.events_timeline
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();