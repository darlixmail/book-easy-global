-- Create storage bucket for business assets (service images and staff photos)
INSERT INTO storage.buckets (id, name, public)
VALUES ('business-assets', 'business-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to view files (public bucket)
CREATE POLICY "Public read access for business assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'business-assets');

-- Allow authenticated users to upload/update/delete their files
CREATE POLICY "Authenticated users can upload business assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'business-assets');

CREATE POLICY "Authenticated users can update their business assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'business-assets');

CREATE POLICY "Authenticated users can delete their business assets"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'business-assets');

-- Add image_url column to services table
ALTER TABLE public.services
ADD COLUMN IF NOT EXISTS image_url text;