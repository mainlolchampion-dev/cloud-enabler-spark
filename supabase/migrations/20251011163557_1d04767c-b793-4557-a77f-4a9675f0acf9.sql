-- Create invitations table
CREATE TABLE public.invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('wedding', 'baptism', 'party')),
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- Create policies for invitations
-- Users can view their own invitations
CREATE POLICY "Users can view their own invitations" 
ON public.invitations 
FOR SELECT 
USING (auth.uid() = user_id);

-- Anyone can view published invitations
CREATE POLICY "Anyone can view published invitations" 
ON public.invitations 
FOR SELECT 
USING (status = 'published');

-- Users can create their own invitations
CREATE POLICY "Users can create their own invitations" 
ON public.invitations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own invitations
CREATE POLICY "Users can update their own invitations" 
ON public.invitations 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Users can delete their own invitations
CREATE POLICY "Users can delete their own invitations" 
ON public.invitations 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_invitations_updated_at
BEFORE UPDATE ON public.invitations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better query performance
CREATE INDEX idx_invitations_user_id ON public.invitations(user_id);
CREATE INDEX idx_invitations_status ON public.invitations(status);
CREATE INDEX idx_invitations_type ON public.invitations(type);