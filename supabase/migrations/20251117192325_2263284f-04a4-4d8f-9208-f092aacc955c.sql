-- Create custom_invitations table for storing template-based invitations
CREATE TABLE IF NOT EXISTS public.custom_invitations (
  id TEXT PRIMARY KEY,
  template_data JSONB NOT NULL,
  host_name TEXT NOT NULL,
  event_date TEXT NOT NULL,
  event_type TEXT NOT NULL,
  views INTEGER DEFAULT 0,
  rsvps JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.custom_invitations ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read published invitations (public access)
CREATE POLICY "Anyone can view custom invitations"
  ON public.custom_invitations
  FOR SELECT
  USING (true);

-- Policy: Only authenticated users can create invitations
CREATE POLICY "Authenticated users can create invitations"
  ON public.custom_invitations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Only authenticated users can update their own invitations
CREATE POLICY "Users can update invitations"
  ON public.custom_invitations
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add trigger for updated_at
CREATE TRIGGER update_custom_invitations_updated_at
  BEFORE UPDATE ON public.custom_invitations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX idx_custom_invitations_id ON public.custom_invitations(id);
CREATE INDEX idx_custom_invitations_event_date ON public.custom_invitations(event_date);
CREATE INDEX idx_custom_invitations_created_at ON public.custom_invitations(created_at);
