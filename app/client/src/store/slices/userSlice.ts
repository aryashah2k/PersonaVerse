import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  plan: 'free' | 'standard' | 'premium';
  tokensAvailable: number;
}

export interface HistoryItem {
  id: string;
  title: string;
  fileUrl: string;
  createdAt: string;
  modelUsed: string;
  personasUsed: string[];
  tokensCost: number;
}

interface UserState {
  profile: UserProfile | null;
  history: HistoryItem[];
  isLoadingProfile: boolean;
  isLoadingHistory: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  history: [],
  isLoadingProfile: false,
  isLoadingHistory: false,
  error: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loadProfileStart: (state) => {
      state.isLoadingProfile = true;
      state.error = null;
    },
    loadProfileSuccess: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
      state.isLoadingProfile = false;
      state.error = null;
    },
    loadProfileFailure: (state, action: PayloadAction<string>) => {
      state.isLoadingProfile = false;
      state.error = action.payload;
    },
    loadHistoryStart: (state) => {
      state.isLoadingHistory = true;
      state.error = null;
    },
    loadHistorySuccess: (state, action: PayloadAction<HistoryItem[]>) => {
      state.history = action.payload;
      state.isLoadingHistory = false;
      state.error = null;
    },
    loadHistoryFailure: (state, action: PayloadAction<string>) => {
      state.isLoadingHistory = false;
      state.error = action.payload;
    },
    updateProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
    },
    addTokens: (state, action: PayloadAction<number>) => {
      if (state.profile) {
        state.profile.tokensAvailable += action.payload;
      }
    },
    deductTokens: (state, action: PayloadAction<number>) => {
      if (state.profile && state.profile.tokensAvailable >= action.payload) {
        state.profile.tokensAvailable -= action.payload;
      }
    },
    changePlan: (state, action: PayloadAction<'free' | 'standard' | 'premium'>) => {
      if (state.profile) {
        state.profile.plan = action.payload;
      }
    },
    clearUserState: () => initialState,
  },
});

export const {
  loadProfileStart,
  loadProfileSuccess,
  loadProfileFailure,
  loadHistoryStart,
  loadHistorySuccess,
  loadHistoryFailure,
  updateProfile,
  addTokens,
  deductTokens,
  changePlan,
  clearUserState,
} = userSlice.actions;

export default userSlice.reducer;
export type { UserState };
