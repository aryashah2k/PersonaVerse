import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Profile from '../../model/profile';


interface ProfileState {
    profile: Profile | null;
    isAuthenticated: boolean;
}

const initialState: ProfileState = {
    profile: null,
    isAuthenticated: false,
};

export const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setProfileState: (state, action: PayloadAction<Profile>) => {
            state.profile = action.payload;
            state.isAuthenticated = true;
        },
        // loadProfileSuccess: (state, action: PayloadAction<UserProfile>) => {
        //   state.profile = action.payload;
        //   state.isLoadingProfile = false;
        //   state.error = null;
        // },
        // loadProfileFailure: (state, action: PayloadAction<string>) => {
        //   state.isLoadingProfile = false;
        //   state.error = action.payload;
        // },
        // loadHistoryStart: (state) => {
        //   state.isLoadingHistory = true;
        //   state.error = null;
        // },
        // loadHistorySuccess: (state, action: PayloadAction<HistoryItem[]>) => {
        //   state.history = action.payload;
        //   state.isLoadingHistory = false;
        //   state.error = null;
        // },
        // loadHistoryFailure: (state, action: PayloadAction<string>) => {
        //   state.isLoadingHistory = false;
        //   state.error = action.payload;
        // },
        // updateProfile: (state, action: PayloadAction<UserProfile>) => {
        //   state.profile = action.payload;
        // },
        // addTokens: (state, action: PayloadAction<number>) => {
        //   if (state.profile) {
        //     state.profile.tokensAvailable += action.payload;
        //   }
        // },
        // deductTokens: (state, action: PayloadAction<number>) => {
        //   if (state.profile && state.profile.tokensAvailable >= action.payload) {
        //     state.profile.tokensAvailable -= action.payload;
        //   }
        // },
        // changePlan: (state, action: PayloadAction<'free' | 'standard' | 'premium'>) => {
        //   if (state.profile) {
        //     state.profile.plan = action.payload;
        //   }
        // },
        clearProfileState: () => initialState,
    },
});

export const {
    //   loadProfileStart,
    //   loadProfileSuccess,
    //   loadProfileFailure,
    //   loadHistoryStart,
    //   loadHistorySuccess,
    //   loadHistoryFailure,
    //   updateProfile,
    //   addTokens,
    //   deductTokens,
    //   changePlan,
    setProfileState,
    clearProfileState,
} = profileSlice.actions;

export default profileSlice.reducer;
export type { ProfileState as UserState };
