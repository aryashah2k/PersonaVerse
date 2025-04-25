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
  setProfileState,
} from '../store/slices/authSlice';
import { authService } from '../services/authService';
import { User } from '@supabase/supabase-js';
import { changePlanType } from '../services/api/profileApi';

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
  const { isAuthenticated, user, profile, loading, error } = useAppSelector((state) => state.auth)
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
        const profileData = await authService.getProfile();
        if (profileData) {
          dispatch(setProfileState(profileData));
          return { success: true };
        }
        else {
          await authService.logout();
          dispatch(logoutAction());
          dispatch(loginFailure('Failed to fetch profile data'));
        }
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

  const handleRefresh = useCallback(
    async (user: User | null) => {
      try {
        if (user) {
          dispatch(loginSuccess(user));
          const profileData = await authService.getProfile();
          if (profileData) {
            dispatch(setProfileState(profileData));
            return { success: true };
          }
          else {
            await authService.logout();
            dispatch(logoutAction());
            dispatch(loginFailure('Failed to fetch profile data'));
          }
        }
        else {
          dispatch(logoutAction());
          dispatch(loginFailure('User is null'));
        }
      } catch (error) {
        dispatch(loginFailure(error instanceof Error ? error.message : 'Login failed'));
        return { success: false, error: error instanceof Error ? error.message : 'Login failed' };
      }
    },
    [dispatch]
  );

  const changePlanTypeToFree = useCallback(async () => {
    try {
      const res = await changePlanType();
      if (res.error) {
        return { success: false, error: res.error };
      }
      else {
        handleRefresh(user)
      }
    } catch (error) {
      dispatch(loginFailure(error instanceof Error ? error.message : 'Failed to change plan type'));
      return { success: false, error: error instanceof Error ? error.message : 'Failed to change plan type' };
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
    profile,
    clearAuthError,
    handleRefresh,
    changePlanTypeToFree
  };
};

export default useAuth;