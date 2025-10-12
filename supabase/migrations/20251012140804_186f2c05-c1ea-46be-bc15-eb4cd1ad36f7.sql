-- Create fonts storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('fonts', 'fonts', true)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for fonts bucket
CREATE POLICY "Authenticated users can upload fonts"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'fonts' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Fonts are publicly accessible"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'fonts');

CREATE POLICY "Users can delete their own fonts"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'fonts' AND auth.uid()::text = (storage.foldername(name))[1]);