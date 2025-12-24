import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Client-side Supabase client (safe for browser use)
// Returns null if credentials are not available
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null = 
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Helper to check if Supabase is available
export const isSupabaseAvailable = (): boolean => {
  return supabase !== null;
};

// Note: Service role client should only be used server-side
// It's defined in server/supabase.ts for server-side operations
