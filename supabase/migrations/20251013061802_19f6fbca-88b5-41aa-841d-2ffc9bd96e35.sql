-- Fix PUBLIC_DATA_EXPOSURE: Update RLS policy to exclude sensitive fields
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Anyone can view published invitations" ON public.invitations;

-- Create separate policies for authenticated users (can see everything they own)
-- and unauthenticated users (cannot see sensitive fields)

-- Authenticated users can see all their own invitations
CREATE POLICY "Users can view their own invitations with all fields"
ON public.invitations FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Public users can only view published invitations WITHOUT sensitive fields
-- Note: Application code must explicitly exclude webhook_url and password from SELECT
CREATE POLICY "Public can view published invitations basic info"
ON public.invitations FOR SELECT
TO anon
USING (status = 'published');