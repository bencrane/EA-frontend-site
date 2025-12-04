import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Lazy-loaded client for public/browser use (respects RLS)
let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!supabaseInstance) {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase environment variables are not set');
    }
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseInstance;
}

// For backwards compatibility - lazy getter
export const supabase = {
  from: (table: string) => getSupabase().from(table),
  auth: {
    signInWithPassword: (credentials: { email: string; password: string }) =>
      getSupabase().auth.signInWithPassword(credentials),
    signOut: () => getSupabase().auth.signOut(),
    getSession: () => getSupabase().auth.getSession(),
  },
  storage: {
    from: (bucket: string) => getSupabase().storage.from(bucket),
  },
};

// Server client with service role (bypasses RLS) - only use server-side
export function createServerClient(): SupabaseClient {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase environment variables are not set');
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Helper to get public URL for storage items
export function getStorageUrl(path: string): string {
  return `${supabaseUrl}/storage/v1/object/public/system-images/${path}`;
}

// Helper to generate a unique filename for uploads
export function generateImageFilename(originalName: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop() || 'jpg';
  return `${timestamp}-${randomString}.${extension}`;
}
