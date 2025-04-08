import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Debug: Log environment variables (values will be public in client-side code)
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL ? 'Defined' : 'Undefined');
console.log('Supabase Anon Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Defined' : 'Undefined');

// Use environment variables with fallbacks for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      storageKey: 'PersonaVerse-auth',
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
    }
  }
);

// Define a helper function to get user profile from the database
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return data;
};

// Helper for uploading files to Supabase storage
export const uploadFile = async (
  bucketName: string,
  filePath: string,
  file: File,
  options = {}
) => {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
      ...options,
    });

  if (error) {
    throw error;
  }

  return data;
};

// Helper to create a record in the Supabase database
export const createRecord = async (
  tableName: string,
  record: any
) => {
  const { data, error } = await supabase
    .from(tableName)
    .insert(record)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

// Listen to auth changes on all tabs
export const setupAuthListener = (callback: (event: any, session: any) => void) => {
  return supabase.auth.onAuthStateChange(callback);
};

// Get public URL for a file
export const getPublicUrl = (bucketName: string, filePath: string) => {
  const { data } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);

  return data.publicUrl;
};
