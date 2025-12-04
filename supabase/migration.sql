-- Everything Automation - Database Migration
-- Run this in your Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ea_systems table
CREATE TABLE IF NOT EXISTS ea_systems (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  short_description TEXT,
  long_description TEXT,
  category TEXT DEFAULT 'General',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'live', 'hidden')),
  order_index INTEGER DEFAULT 0,
  hero_image_url TEXT,
  attributes JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_ea_systems_slug ON ea_systems(slug);
CREATE INDEX IF NOT EXISTS idx_ea_systems_order_index ON ea_systems(order_index);
CREATE INDEX IF NOT EXISTS idx_ea_systems_status ON ea_systems(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger to ea_systems
DROP TRIGGER IF EXISTS set_updated_at ON ea_systems;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON ea_systems
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE ea_systems ENABLE ROW LEVEL SECURITY;

-- Public read access for live systems only
CREATE POLICY "Public can view live systems" ON ea_systems
  FOR SELECT
  USING (status = 'live');

-- Authenticated users (admin) can do everything
CREATE POLICY "Authenticated users have full access" ON ea_systems
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Grant permissions
GRANT SELECT ON ea_systems TO anon;
GRANT ALL ON ea_systems TO authenticated;
