import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { supabase } from '@/lib/supabase';
import { setUser, fetchUserProfile } from '@/store/slices/userSlice';
import { AppDispatch } from '@/store';

export default function AuthCallback() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Parse the URL fragment
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');

        // If there are tokens in the URL, exchange them for a session
        if (accessToken && refreshToken) {
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            throw error;
          }

          if (data?.user) {
            // Set user in Redux
            dispatch(setUser(data.user));

            // Fetch user profile
            dispatch(fetchUserProfile(data.user.id));

            // Navigate to dashboard
            navigate('/dashboard');
          }
        } else {
          // If no tokens, check for existing session
          const { data } = await supabase.auth.getSession();

          if (data?.session?.user) {
            // Set user in Redux
            dispatch(setUser(data.session.user));

            // Fetch user profile
            dispatch(fetchUserProfile(data.session.user.id));

            // Navigate to dashboard
            navigate('/dashboard');
          } else {
            // No session, redirect to login
            navigate('/auth/login');
          }
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        setError('Authentication failed. Please try again.');
        setTimeout(() => {
          navigate('/auth/login');
        }, 3000);
      }
    };

    handleCallback();
  }, [dispatch, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
      {error ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive mb-2">Authentication Error</h2>
          <p className="text-muted-foreground">{error}</p>
          <p className="mt-4">Redirecting to login page...</p>
        </div>
      ) : (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold mb-2">Authenticating...</h2>
          <p className="text-muted-foreground">Please wait while we complete the authentication process.</p>
        </div>
      )}
    </div>
  );
}
