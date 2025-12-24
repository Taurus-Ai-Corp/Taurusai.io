import { createClient } from '@supabase/supabase-js';

// Client-side Supabase client (safe for browser use)
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

// Note: Service role client should only be used server-side
// It's defined in server/supabase.ts for server-side operations
