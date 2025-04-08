import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Toaster } from '@/components/ui/toaster';

// Supabase auth listener
import { setupAuthListener } from '@/lib/supabase';
import { setUser, clearUser, fetchUserProfile } from '@/store/slices/userSlice';
import { AppDispatch } from '@/store';

export default function RootLayout() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        const { data } = await fetch('/api/auth/session');
        if (data?.session?.user) {
          dispatch(setUser(data.session.user));
          dispatch(fetchUserProfile(data.session.user.id));
        }
      } catch (error) {
        console.error('Error checking session:', error);
      }
    };

    checkSession();

    // Set up auth listener for tabs synchronization
    const { data: authListener } = setupAuthListener((event, session) => {
      // When auth state changes
      if (event === 'SIGNED_IN' && session?.user) {
        dispatch(setUser(session.user));
        dispatch(fetchUserProfile(session.user.id));
      } else if (event === 'SIGNED_OUT') {
        dispatch(clearUser());
      }
    });

    // Cleanup listener on unmount
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Outlet />
      <Toaster />
    </div>
  );
}
