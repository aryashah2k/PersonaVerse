import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes';
import { store } from '@/store';
import { useEffect } from 'react';
import { checkAndRestoreSession, setupAuthListener } from '@/lib/auth';

// Component to handle auth state changes and session persistence
function AuthHandler() {
  useEffect(() => {
    // Check for existing session on page load/refresh
    const restoreSession = async () => {
      await checkAndRestoreSession();
    };

    // Run session check
    restoreSession();

    // Set up auth state change listener
    const cleanup = setupAuthListener();

    // Clean up listener on unmount
    return cleanup;
  }, []);

  return null;
}

export default function App() {
  return (
    <Provider store={store}>
      <AuthHandler />
      <RouterProvider router={router} />
    </Provider>
  );
}
