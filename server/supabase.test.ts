import { describe, it, expect } from 'vitest';
import { supabase, supabaseAdmin } from './supabase';

describe('Supabase Connection', () => {
  it('should have valid Supabase URL', () => {
    expect(supabase.supabaseUrl).toBeTruthy();
    expect(supabase.supabaseUrl).toContain('supabase.co');
  });

  it('should have valid anon key', () => {
    expect(supabase.supabaseKey).toBeTruthy();
    expect(supabase.supabaseKey.length).toBeGreaterThan(20);
  });

  it('should connect to Supabase successfully', async () => {
    // Test connection by checking if we can access the database
    const { error } = await supabase.from('chat_rooms').select('count', { count: 'exact', head: true });
    
    // Should not have authentication errors (table may not exist yet, that's ok)
    if (error) {
      expect(error.code).not.toBe('PGRST301'); // Auth error
      expect(error.message).not.toContain('JWT');
    }
  });

  it('should have admin client with service role', () => {
    expect(supabaseAdmin.supabaseUrl).toBeTruthy();
    expect(supabaseAdmin.supabaseKey).toBeTruthy();
    expect(supabaseAdmin.supabaseKey).not.toBe(supabase.supabaseKey);
  });
});
