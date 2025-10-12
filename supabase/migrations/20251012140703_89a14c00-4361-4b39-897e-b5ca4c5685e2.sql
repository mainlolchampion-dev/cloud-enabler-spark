-- Add custom_subdomain field to invitations table
ALTER TABLE public.invitations 
ADD COLUMN IF NOT EXISTS custom_subdomain TEXT UNIQUE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_invitations_custom_subdomain 
ON public.invitations(custom_subdomain) 
WHERE custom_subdomain IS NOT NULL;

-- Add comment
COMMENT ON COLUMN public.invitations.custom_subdomain IS 'Custom subdomain for premium users';