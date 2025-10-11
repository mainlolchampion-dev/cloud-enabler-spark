-- Create RSVPs table
CREATE TABLE public.rsvps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invitation_id UUID NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  number_of_guests INTEGER NOT NULL DEFAULT 1,
  will_attend TEXT NOT NULL CHECK (will_attend IN ('yes', 'no', 'maybe')),
  dietary_restrictions TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

-- Public can create RSVPs (anyone can respond)
CREATE POLICY "Anyone can create RSVPs" 
ON public.rsvps 
FOR INSERT 
WITH CHECK (true);

-- Users can view RSVPs for their own invitations
CREATE POLICY "Users can view RSVPs for their invitations" 
ON public.rsvps 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.invitations 
    WHERE invitations.id = rsvps.invitation_id 
    AND invitations.user_id = auth.uid()
  )
);

-- Users can delete RSVPs for their own invitations
CREATE POLICY "Users can delete RSVPs for their invitations" 
ON public.rsvps 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.invitations 
    WHERE invitations.id = rsvps.invitation_id 
    AND invitations.user_id = auth.uid()
  )
);

-- Create index for faster queries
CREATE INDEX idx_rsvps_invitation_id ON public.rsvps(invitation_id);
CREATE INDEX idx_rsvps_created_at ON public.rsvps(created_at DESC);

-- Trigger for updated_at
CREATE TRIGGER update_rsvps_updated_at
BEFORE UPDATE ON public.rsvps
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create Storage Buckets for images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('invitations', 'invitations', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']),
  ('gallery', 'gallery', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']),
  ('profiles', 'profiles', true, 2097152, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']);

-- Storage policies for invitations bucket
CREATE POLICY "Public can view invitation images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'invitations');

CREATE POLICY "Authenticated users can upload invitation images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'invitations' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Users can update their own invitation images" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'invitations' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Users can delete their own invitation images" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'invitations' 
  AND auth.uid() IS NOT NULL
);

-- Storage policies for gallery bucket
CREATE POLICY "Public can view gallery images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'gallery');

CREATE POLICY "Authenticated users can upload gallery images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'gallery' 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Users can delete gallery images" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'gallery' 
  AND auth.uid() IS NOT NULL
);

-- Storage policies for profiles bucket
CREATE POLICY "Public can view profile images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'profiles');

CREATE POLICY "Users can upload their own profile images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'profiles' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own profile images" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'profiles' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own profile images" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'profiles' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);