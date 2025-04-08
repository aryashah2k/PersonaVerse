import { store } from '@/store';
import { supabase, getUserProfile } from '@/lib/supabase';
import { setUser, clearUser, setAuthLoading } from '@/store/slices/userSlice';
import { Profile } from '@/types/supabase';

/**
 * Check for an existing session and restore user state
 * @returns Promise that resolves when session check is complete
 */
export const checkAndRestoreSession = async (): Promise<boolean> => {
  try {
    // Set loading state
    store.dispatch(setAuthLoading(true));

    // Get session
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.user) {
      await restoreUserState(session.user);
      return true;
    }

    // Clear loading state
    store.dispatch(setAuthLoading(false));
    return false;
  } catch (error) {
    console.error('Error checking session:', error);

    // Clear loading state
    store.dispatch(setAuthLoading(false));
    return false;
  }
};

/**
 * Restore user state from a session user
 * @param user The user object from the session
 */
export const restoreUserState = async (user: any): Promise<void> => {
  try {
    // For test user, create a mock profile
    if (user.email === 'user@test.com') {
      const mockProfile: Profile = {
        id: user.id,
        username: 'testuser',
        full_name: 'Test User',
        avatar_url: null,
        current_plan: 'free',
        tokens_left: 1000,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Set user in Redux store
      store.dispatch(setUser({ user, profile: mockProfile }));
    } else {
      // Get real user profile from Supabase
      const profile = await getUserProfile(user.id);

      if (profile) {
        // Set user in Redux store for real users
        store.dispatch(setUser({ user, profile }));
      } else {
        console.error('Profile not found for user:', user.id);
        // Clear loading state
        store.dispatch(setAuthLoading(false));
      }
    }
  } catch (error) {
    console.error('Error restoring user state:', error);
    // Clear loading state
    store.dispatch(setAuthLoading(false));
  }
};

/**
 * Sign out the current user
 */
export const signOut = async (): Promise<void> => {
  try {
    await supabase.auth.signOut();
    store.dispatch(clearUser());
  } catch (error) {
    console.error('Error signing out:', error);
  }
};

/**
 * Setup auth state change listener
 * @returns Cleanup function to remove the listener
 */
export const setupAuthListener = (): (() => void) => {
  const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
    console.log('Auth state changed:', event);

    if (event === 'SIGNED_OUT') {
      store.dispatch(clearUser());
    } else if (event === 'SIGNED_IN' && session?.user) {
      // Set loading state
      store.dispatch(setAuthLoading(true));
      await restoreUserState(session.user);
    }
  });

  return () => {
    authListener.subscription.unsubscribe();
  };
};
