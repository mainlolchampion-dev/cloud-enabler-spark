-- Create live_photo_wall table for Plus plan feature
CREATE TABLE IF NOT EXISTS public.live_photo_wall (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invitation_id UUID NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  uploaded_by TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.live_photo_wall ENABLE ROW LEVEL SECURITY;

-- Anyone can view photos from published invitations
CREATE POLICY "Anyone can view published invitation photos"
ON public.live_photo_wall
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM invitations
    WHERE invitations.id = live_photo_wall.invitation_id
    AND invitations.status = 'published'
  )
);

-- Anyone can upload photos to published invitations (guests)
CREATE POLICY "Anyone can upload photos to published invitations"
ON public.live_photo_wall
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM invitations
    WHERE invitations.id = live_photo_wall.invitation_id
    AND invitations.status = 'published'
  )
);

-- Users can delete photos from their own invitations
CREATE POLICY "Users can delete photos from their invitations"
ON public.live_photo_wall
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM invitations
    WHERE invitations.id = live_photo_wall.invitation_id
    AND invitations.user_id = auth.uid()
  )
);

-- Add webhook_url column to invitations for Zapier/Make integration
ALTER TABLE public.invitations 
ADD COLUMN IF NOT EXISTS webhook_url TEXT;

-- Add password column to invitations for password protection
ALTER TABLE public.invitations 
ADD COLUMN IF NOT EXISTS password TEXT;

-- Enable realtime for live_photo_wall
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_photo_wall;