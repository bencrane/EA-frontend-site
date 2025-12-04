import { supabase, createServerClient } from './supabase';
import { EASystem, EASystemInsert, EASystemUpdate } from '@/types/database';

// Fetch all live systems for public display (sorted by order_index)
export async function getLiveSystems(): Promise<EASystem[]> {
  const { data, error } = await supabase
    .from('ea_systems')
    .select('*')
    .eq('status', 'live')
    .order('order_index', { ascending: true });

  if (error) {
    console.error('Error fetching live systems:', error);
    return [];
  }

  return (data as EASystem[]) || [];
}

// Fetch a single system by slug (public)
export async function getSystemBySlug(slug: string): Promise<EASystem | null> {
  const { data, error } = await supabase
    .from('ea_systems')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'live')
    .single();

  if (error) {
    console.error('Error fetching system by slug:', error);
    return null;
  }

  return data as EASystem;
}

// Admin: Fetch all systems (including drafts and hidden)
export async function getAllSystems(): Promise<EASystem[]> {
  const serverClient = createServerClient();
  const { data, error } = await serverClient
    .from('ea_systems')
    .select('*')
    .order('order_index', { ascending: true });

  if (error) {
    console.error('Error fetching all systems:', error);
    return [];
  }

  return (data as EASystem[]) || [];
}

// Admin: Fetch a single system by ID
export async function getSystemById(id: string): Promise<EASystem | null> {
  const serverClient = createServerClient();
  const { data, error } = await serverClient
    .from('ea_systems')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching system by ID:', error);
    return null;
  }

  return data as EASystem;
}

// Admin: Create a new system
export async function createSystem(system: EASystemInsert): Promise<EASystem | null> {
  const serverClient = createServerClient();
  const { data, error } = await serverClient
    .from('ea_systems')
    .insert(system as unknown as Record<string, unknown>)
    .select()
    .single();

  if (error) {
    console.error('Error creating system:', error);
    throw error;
  }

  return data as EASystem;
}

// Admin: Update an existing system
export async function updateSystem(id: string, updates: EASystemUpdate): Promise<EASystem | null> {
  const serverClient = createServerClient();
  const { data, error } = await serverClient
    .from('ea_systems')
    .update(updates as unknown as Record<string, unknown>)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating system:', error);
    throw error;
  }

  return data as EASystem;
}

// Admin: Delete a system
export async function deleteSystem(id: string): Promise<boolean> {
  const serverClient = createServerClient();
  const { error } = await serverClient
    .from('ea_systems')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting system:', error);
    throw error;
  }

  return true;
}

// Helper: Generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Helper: Check if slug is unique
export async function isSlugUnique(slug: string, excludeId?: string): Promise<boolean> {
  const serverClient = createServerClient();
  let query = serverClient
    .from('ea_systems')
    .select('id')
    .eq('slug', slug);

  if (excludeId) {
    query = query.neq('id', excludeId);
  }

  const { data } = await query;
  return !data || data.length === 0;
}
