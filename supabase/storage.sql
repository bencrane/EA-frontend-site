-- Everything Automation - Storage Bucket Setup
-- Run this in your Supabase SQL Editor after migration.sql

-- Create storage bucket for system images
INSERT INTO storage.buckets (id, name, public)
VALUES ('system-images', 'system-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to the bucket
CREATE POLICY "Public can view system images" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'system-images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'system-images'
    AND auth.role() = 'authenticated'
  );

-- Allow authenticated users to update their images
CREATE POLICY "Authenticated users can update images" ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'system-images'
    AND auth.role() = 'authenticated'
  );

-- Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete images" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'system-images'
    AND auth.role() = 'authenticated'
  );
