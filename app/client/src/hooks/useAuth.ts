import { useCallback, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../store';
import {
  loginStart,
  loginSuccess,
  loginFailure,
  signupStart,
  signupSuccess,
  signupFailure,
  logout as logoutAction,
  clearError,
} from '../store/slices/authSlice';
import { authService } from '../services/authService';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  username: string;
  email: string;
  password: string;
}

export const useAuth = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading, error } = useAppSelector((state) => state.auth)
  const { profile } = useAppSelector((state) => state.profile)
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          dispatch(loginSuccess(currentUser));
        }
      } catch (error) {
        console.error('Error checking authentication state:', error);
      } finally {
        setInitialized(true);
      }
    };

    checkAuth();
  }, [dispatch]);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        dispatch(loginStart());
        const user = await authService.login(credentials);
        dispatch(loginSuccess(user));

        return { success: true };
      } catch (error) {
        dispatch(loginFailure(error instanceof Error ? error.message : 'Login failed'));
        return { success: false, error: error instanceof Error ? error.message : 'Login failed' };
      }
    },
    [dispatch]
  );

  const signup = useCallback(
    async (data: SignupData) => {
      try {
        dispatch(signupStart());
        const user = await authService.register(data);
        dispatch(signupSuccess(user));
        return { success: true };
      } catch (error) {
        dispatch(signupFailure(error instanceof Error ? error.message : 'Signup failed'));
        return { success: false, error: error instanceof Error ? error.message : 'Signup failed' };
      }
    },
    [dispatch]
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
      dispatch(logoutAction());
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: 'Failed to logout' };
    }
  }, [dispatch]);

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    isAuthenticated,
    user,
    loading,
    error,
    initialized,
    login,
    signup,
    logout,
    clearAuthError,
  };
};

export default useAuth;