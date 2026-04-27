import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'CRITICAL ERROR: Supabase credentials are missing. ' +
    'Please check that your .env file contains VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY. ' +
    'If you just added them, RESTART your dev server.'
  );
}

// Ensure createClient is called with values even if they're missing to avoid crash, 
// but the console error above will inform the developer.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder-key'
);
