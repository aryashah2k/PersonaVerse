import React, { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, Box } from "@mui/material";
import theme from "./styles/theme";

// Pages
import Home from "./pages/home/Home";
import Dashboard from "./components/dashboard/Dashboard";
import Profile from "./pages/profile/Profile";
import History from "./pages/history/History";
import Pricing from "./pages/pricing/Pricing";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import NotFound from "./pages/notFound/NotFound";

// Auth
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PublicRoute from "./components/auth/PublicRoute";
import About from "./pages/about/About";
import useAuth from "./hooks/useAuth";
import { supabase } from "./utils/supabase/supabase";
import { logout } from "./store/slices/authSlice";
import { getSignedURL } from "./services/api/genResponse";
import useAppLoading from "./hooks/useAppLoading";
import AppLoader from "./components/loader/loader";
import useForm from "./hooks/useForm";

const App: React.FC = () => {
  const { isAuthenticated, profile, handleRefresh } = useAuth();
  const { isLoading } = useAppLoading();
  const { isSubmitting } = useForm();
  const navigate = useNavigate();
  const setUser = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      logout();
      navigate("/");
    } else {
      handleRefresh(data.user);
    }
  };

  useEffect(() => {
    // if (profile == null && isAuthenticated) {
    setUser();
    // }
    // const fn = async () => {
    //   const {
    //     data: { session },
    //     error: sessionError,
    //   } = await supabase.auth.getSession();
    //   console.log("Session data:", session?.access_token);
    // };
    // fn();
  }, [supabase.auth.onAuthStateChange, isAuthenticated]);
  return (
    <>
      {(isLoading || isSubmitting) && (
        <div
          style={{
            height: "100vh",
            width: "100vw",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#ffffff75",
            opacity: 1,
            position: "fixed",
            zIndex: 9999,
            top: 0,
            left: 0,
          }}
        >
          <AppLoader />
        </div>
      )}
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ width: "100vw", overflowX: "hidden" }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/about" element={<About />} />

            {/* Auth Routes */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <Signup />
                </PublicRoute>
              }
            />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              }
            />

            {/* 404 and Redirects */}
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate replace to="/404" />} />
          </Routes>
        </Box>
      </ThemeProvider>
    </>
  );
};

export default App;
