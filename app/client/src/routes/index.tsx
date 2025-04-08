import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Layouts
import RootLayout from '@/layouts/RootLayout';
import AuthLayout from '@/layouts/AuthLayout';
import DashboardLayout from '@/layouts/DashboardLayout';

// Pages
import LoginPage from '@/pages/auth/LoginPage';
import SignupPage from '@/pages/auth/SignupPage';
import HomePage from '@/pages/dashboard/HomePage';
import PersonasPage from '@/pages/dashboard/PersonasPage';
import ExpectationPage from '@/pages/dashboard/ExpectationPage';
import ResultPage from '@/pages/dashboard/ResultPage';
import ProfilePage from '@/pages/dashboard/ProfilePage';
import AboutPage from '@/pages/AboutPage';
import PricingPage from '@/pages/PricingPage';
import NotFoundPage from '@/pages/NotFoundPage';
import SuccessPage from '@/pages/checkout/SuccessPage';

// Auth callback handler
import AuthCallback from '@/pages/auth/AuthCallback';

// State selectors
import { selectUser } from '@/store/slices/userSlice';
import { RootState } from '@/store';

// Protected route wrapper with loading state
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const user = useSelector(selectUser);
  const status = useSelector((state: RootState) => state.user.status);

  // Add loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

// Routes that require file upload
const FileRequiredRoute = ({ children }: { children: JSX.Element }) => {
  const fileName = useSelector((state: RootState) => state.file.fileName);

  if (!fileName) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Routes that require persona selection
const PersonaRequiredRoute = ({ children }: { children: JSX.Element }) => {
  const selectedPersonas = useSelector((state: RootState) => state.persona.selectedPersonas);

  if (!selectedPersonas.length) {
    return <Navigate to="/dashboard/personas" replace />;
  }

  return children;
};

// Routes that require both file and personas
const ProcessReadyRoute = ({ children }: { children: JSX.Element }) => {
  const fileName = useSelector((state: RootState) => state.file.fileName);
  const selectedPersonas = useSelector((state: RootState) => state.persona.selectedPersonas);

  if (!fileName) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!selectedPersonas.length) {
    return <Navigate to="/dashboard/personas" replace />;
  }

  return children;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <Navigate to="/auth/login" replace /> }, // Changed initial route to login page
      {
        path: 'auth',
        element: <AuthLayout />,
        children: [
          { path: '', element: <Navigate to="/auth/login" replace /> }, // Added default route for /auth
          { path: 'login', element: <LoginPage /> },
          { path: 'signup', element: <SignupPage /> },
          { path: 'callback', element: <AuthCallback /> }
        ]
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <HomePage /> },
          {
            path: 'personas',
            element: (
              <FileRequiredRoute>
                <PersonasPage />
              </FileRequiredRoute>
            )
          },
          {
            path: 'expectation',
            element: (
              <ProcessReadyRoute>
                <ExpectationPage />
              </ProcessReadyRoute>
            )
          },
          {
            path: 'result',
            element: (
              <ProcessReadyRoute>
                <ResultPage />
              </ProcessReadyRoute>
            )
          },
          { path: 'profile', element: <ProfilePage /> }
        ]
      },
      { path: 'about', element: <AboutPage /> },
      { path: 'pricing', element: <PricingPage /> },
      {
        path: 'checkout/success',
        element: (
          <ProtectedRoute>
            <SuccessPage />
          </ProtectedRoute>
        )
      },
      { path: '*', element: <NotFoundPage /> }
    ]
  }
]);
