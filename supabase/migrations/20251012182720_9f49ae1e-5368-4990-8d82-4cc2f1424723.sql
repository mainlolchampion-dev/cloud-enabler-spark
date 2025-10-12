-- Add theme column to invitations table
ALTER TABLE invitations 
ADD COLUMN IF NOT EXISTS theme VARCHAR(50) DEFAULT 'romantic';

COMMENT ON COLUMN invitations.theme IS 'Theme/design template for the invitation (romantic, classic, modern, garden, vintage, luxe)';