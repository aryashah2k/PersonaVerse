import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase, getUserProfile } from '@/lib/supabase';
import { Profile } from '@/types/supabase';
import { RootState } from '@/store';

interface UserState {
  user: any | null;
  profile: Profile | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UserState = {
  user: null,
  profile: null,
  status: 'idle',
  error: null,
};

// Async thunks for user operations
export const loginUserEmail = createAsyncThunk(
  'user/loginUserEmail',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      // Handle test credentials specifically for demo purposes
      if (email === 'user@test.com' && password === 'user') {
        console.log('Using test credentials');
        // Create a mock user and profile for testing
        const mockUser = {
          id: 'test-user-id',
          email: 'user@test.com',
          role: 'authenticated',
          app_metadata: { provider: 'email' },
          user_metadata: { name: 'Test User' },
          aud: 'authenticated',
        };

        const mockProfile = {
          id: 'test-user-id',
          username: 'testuser',
          full_name: 'Test User',
          avatar_url: null,
          current_plan: 'free',
          tokens_left: 1000,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        return { user: mockUser, profile: mockProfile };
      }

      // Regular auth flow for non-test credentials
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return rejectWithValue(error.message);
      }

      // Fetch user profile
      if (data?.user) {
        const profile = await getUserProfile(data.user.id);
        return { user: data.user, profile };
      }

      return { user: data?.user, profile: null };
    } catch (error) {
      console.error('Login error:', error);
      return rejectWithValue('Login failed. Please try again.');
    }
  }
);

export const loginUserGoogle = createAsyncThunk(
  'user/loginUserGoogle',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        return rejectWithValue(error.message);
      }

      return data;
    } catch (error) {
      return rejectWithValue('Google login failed. Please try again.');
    }
  }
);

export const signUpUserEmail = createAsyncThunk(
  'user/signUpUserEmail',
  async ({ email, password, username, name }: {
    email: string;
    password: string;
    username: string;
    name: string;
  }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            full_name: name,
          },
        },
      });

      if (error) {
        return rejectWithValue(error.message);
      }

      // Create profile
      if (data?.user) {
        const newProfile = {
          id: data.user.id,
          username,
          full_name: name,
          current_plan: 'free',
          tokens_left: 1000, // Default for free plan
        };

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .single();

        if (profileError) {
          return rejectWithValue(profileError.message);
        }

        return { user: data.user, profile: profileData };
      }

      return { user: data?.user, profile: null };
    } catch (error) {
      return rejectWithValue('Signup failed. Please try again.');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return rejectWithValue(error.message);
      }

      return null;
    } catch (error) {
      return rejectWithValue('Logout failed. Please try again.');
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'user/fetchUserProfile',
  async (userId: string, { rejectWithValue }) => {
    try {
      const profile = await getUserProfile(userId);

      if (!profile) {
        return rejectWithValue('Profile not found');
      }

      return profile;
    } catch (error) {
      return rejectWithValue('Failed to fetch user profile');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async ({ userId, updates }: { userId: string; updates: Partial<Profile> }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        return rejectWithValue(error.message);
      }

      return data;
    } catch (error) {
      return rejectWithValue('Failed to update user profile');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ user: any; profile: Profile | null }>) => {
      state.user = action.payload.user;
      state.profile = action.payload.profile;
      state.status = 'succeeded';
      state.error = null;
    },
    clearUser: (state) => {
      state.user = null;
      state.profile = null;
      state.status = 'idle';
      state.error = null;
    },
    deductTokens: (state, action: PayloadAction<number>) => {
      if (state.profile) {
        state.profile.tokens_left = Math.max(0, state.profile.tokens_left - action.payload);
      }
    },
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.status = action.payload ? 'loading' : 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUserEmail.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUserEmail.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.profile = action.payload.profile;
      })
      .addCase(loginUserEmail.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(signUpUserEmail.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(signUpUserEmail.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.profile = action.payload.profile;
      })
      .addCase(signUpUserEmail.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.profile = null;
        state.status = 'idle';
      })
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      });
  },
});

export const { setUser, clearUser, deductTokens, setAuthLoading } = userSlice.actions;

// Selectors
export const selectUser = (state: RootState) => state.user.user;
export const selectProfile = (state: RootState) => state.user.profile;
export const selectUserStatus = (state: RootState) => state.user.status;
export const selectUserError = (state: RootState) => state.user.error;
export const selectTokensLeft = (state: RootState) => state.user.profile?.tokens_left || 0;
export const selectHasEnoughTokens = (state: RootState, requiredTokens: number) =>
  (state.user.profile?.tokens_left || 0) >= requiredTokens;

export default userSlice.reducer;
