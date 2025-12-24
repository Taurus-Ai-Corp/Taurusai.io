import { createClient } from '@supabase/supabase-js';
import { ENV } from './_core/env';

// Server-side Supabase client with service role key
// This bypasses Row Level Security and should only be used server-side
export const supabaseAdmin = createClient(
  ENV.supabaseUrl,
  ENV.supabaseServiceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Regular client for server-side operations that respect RLS
export const supabase = createClient(
  ENV.supabaseUrl,
  ENV.supabaseAnonKey
);
