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

const App: React.FC = () => {
  const { isAuthenticated, handleRefresh } = useAuth();
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
    setUser();
  }, [supabase.auth.onAuthStateChange]);
  return (
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
  );
};

export default App;
