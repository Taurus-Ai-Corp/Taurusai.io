import { describe, it, expect } from 'vitest';
import { createClient } from '@supabase/supabase-js';
import { ENV } from './_core/env';

describe('Supabase Credentials Validation', () => {
  it('should have Supabase URL configured', () => {
    expect(ENV.supabaseUrl).toBeDefined();
    expect(ENV.supabaseUrl.length).toBeGreaterThan(0);
    expect(ENV.supabaseUrl).toMatch(/^https:\/\//);
  });

  it('should have Supabase anon key configured', () => {
    expect(ENV.supabaseAnonKey).toBeDefined();
    expect(ENV.supabaseAnonKey.length).toBeGreaterThan(0);
  });

  it('should connect to Supabase with provided credentials', async () => {
    const supabase = createClient(ENV.supabaseUrl, ENV.supabaseAnonKey);
    
    // Test connection by checking if we can query (even if tables don't exist yet)
    const { error } = await supabase.from('documents').select('count').limit(0);
    
    // We expect either success or a specific error about the table not existing
    // Authentication errors would have different error codes
    if (error) {
      // Check if it's NOT an auth error
      expect(error.code).not.toBe('PGRST301'); // JWT expired
      expect(error.code).not.toBe('PGRST302'); // JWT invalid
      expect(error.message).not.toContain('JWT');
      expect(error.message).not.toContain('authentication');
    }
  }, 10000);

  it('should have service role key configured', () => {
    expect(ENV.supabaseServiceRoleKey).toBeDefined();
    expect(ENV.supabaseServiceRoleKey.length).toBeGreaterThan(0);
  });
});
