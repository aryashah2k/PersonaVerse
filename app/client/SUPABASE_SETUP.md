# Setting Up Supabase for PersonaVerse

This guide will walk you through setting up a Supabase project and configuring it for the PersonaVerse application.

## Creating a Supabase Project

1. **Sign Up / Sign In to Supabase**
   - Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Sign in with your account or create a new one

2. **Create a New Project**
   - Click the "New Project" button
   - Enter a name for your project (e.g., "PersonaVerse")
   - Set a secure database password (save this somewhere safe)
   - Choose the region closest to your users
   - Click "Create new project"
   - Wait for your project to be provisioned (this may take a few minutes)

## Getting Your API Credentials

Once your project is created, you need to get your API credentials:

1. **Access API Settings**
   - In your project dashboard, go to "Settings" in the sidebar
   - Select "API" from the menu

2. **Copy Your Credentials**
   - Find the "Project URL" (looks like `https://xxxxxxxxxxxx.supabase.co`)
   - Find the "Project API Keys" section
   - Copy the `anon` public key (this is safe to use in your frontend code)
   - **NEVER** use the `service_role` key in your frontend code (it has admin privileges)

3. **Update Your .env File**
   - Open the `.env` file in the PersonaVerse project
   - Replace the placeholder values with your actual credentials:
     ```
     VITE_SUPABASE_URL=your-project-url
     VITE_SUPABASE_ANON_KEY=your-anon-key
     ```

## Setting Up Database Tables

For the PersonaVerse application, you'll need to set up the following tables:

1. **Create the `profiles` Table**
   - Go to the "SQL Editor" in your Supabase dashboard
   - Run the following SQL:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  current_plan TEXT DEFAULT 'free',
  tokens_left INTEGER DEFAULT 1000,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create security policies (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public profiles are viewable by everyone"
ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE USING (auth.uid() = id);

-- Create files table for document uploads
CREATE TABLE files (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  processed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS on files table
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- Create policies for files
CREATE POLICY "Users can view their own files"
ON files FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY "Users can insert their own files"
ON files FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update their own files"
ON files FOR UPDATE USING (auth.uid() = profile_id);

CREATE POLICY "Users can delete their own files"
ON files FOR DELETE USING (auth.uid() = profile_id);
```

2. **Set Up Storage Buckets**
   - Go to "Storage" in your Supabase dashboard
   - Create two buckets:
     - `files` (for document uploads)
     - `avatars` (for user profile pictures)
   - For each bucket, go to "Policies" and add the following policies:
     - Allow uploads from authenticated users
     - Allow reads from authenticated users

## Enabling Authentication Methods

1. **Configure Email Authentication**
   - Go to "Authentication" → "Providers" in your Supabase dashboard
   - Ensure "Email" is enabled
   - Configure your email templates if desired

2. **Set Up Google OAuth (Optional)**
   - Go to "Authentication" → "Providers" → "Google"
   - Enable Google Sign-In
   - Follow the instructions to set up a Google OAuth application
   - Add your redirect URL (typically `https://[YOUR_PROJECT_REF].supabase.co/auth/v1/callback`)

## Testing Your Setup

After completing the setup:

1. Restart your PersonaVerse application
2. Try signing up with email
3. Verify that you can log in and see your profile
4. Test the file upload functionality

If you encounter any issues, check your browser console for errors and verify your Supabase configuration.

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/start)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
