import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  loadProfileStart,
  loadProfileSuccess,
  loadProfileFailure,
  loadHistoryStart,
  loadHistorySuccess,
  loadHistoryFailure,
  updateProfile,
  addTokens as addTokensAction,
  changePlan as changePlanAction,
} from '../store/slices/userSlice';
import { userService, historyService } from '../services/api';
import { addTokens, setProfileState } from '../store/slices/authSlice';
import Profile from '../model/profile';
import { getSignedURL } from '../services/api/genResponse';

export const useUserProfile = () => {
  const dispatch = useDispatch();
  const { profile, history, isLoadingProfile, isLoadingHistory, error } = useSelector(
    (state: RootState) => state.user
  );

  const loadProfile = useCallback(async () => {
    dispatch(loadProfileStart());
    try {
      const userProfile = await userService.getUserProfile();
      dispatch(loadProfileSuccess(userProfile));
      return userProfile;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load profile';
      dispatch(loadProfileFailure(errorMessage));
      throw error;
    }
  }, [dispatch]);

  const loadHistory = useCallback(async () => {
    dispatch(loadHistoryStart());
    try {
      const historyItems = await historyService.getUserHistory();
      dispatch(loadHistorySuccess(historyItems));
      return historyItems;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load history';
      dispatch(loadHistoryFailure(errorMessage));
      throw error;
    }
  }, [dispatch]);


  const updateUserProfile = useCallback(
    async (profile: Profile | null) => {
      try {
        if (profile) {
          dispatch(setProfileState(profile));
          return { success: true };
        }
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Failed to update Profile' };
      }
    },
    [dispatch]);

  const addUserTokens = useCallback(
    async (amount: number) => {
      try {
        dispatch(addTokens(amount));
        return true;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to add tokens';
        dispatch(loadProfileFailure(errorMessage));
        return false;
      }
    },
    [dispatch]
  );

  const changeUserPlan = useCallback(
    async (planType: 'free' | 'standard' | 'premium') => {
      try {
        await userService.changePlan(planType);
        dispatch(changePlanAction(planType));
        return true;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to change plan';
        dispatch(loadProfileFailure(errorMessage));
        return false;
      }
    },
    [dispatch]
  );

  const downloadHistoryItem = useCallback(async (filePath: string) => {
    const res = await getSignedURL({ storagePath: filePath });
    if (res.error) {
      console.error('Error generating signed URL:', res.error);
    } else if (res.data) {
      const downloadLink = document.createElement('a');
      downloadLink.href = res.data;       // the signed URL
      downloadLink.download = '';          // empty lets it download automatically with correct name
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }

  }, []);

  return {
    profile,
    history,
    isLoadingProfile,
    isLoadingHistory,
    error,
    loadProfile,
    loadHistory,
    updateUserProfile,
    addUserTokens,
    changeUserPlan,
    downloadHistoryItem,
  };
};

export default useUserProfile;
