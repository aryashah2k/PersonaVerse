import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppLoadingState {
  isLoading: boolean;
}

const initialState: AppLoadingState = {
  isLoading: false,
};

export const appLoadingSlice = createSlice({
  name: 'appLoading',
  initialState,
  reducers: {
    setLoadingTrue: (state) => {
      state.isLoading = true;
    },
    setLoadingFalse: (state) => {
      state.isLoading = false;
    },
  },
});

export const {
  setLoadingTrue,
  setLoadingFalse,
} = appLoadingSlice.actions;

export default appLoadingSlice.reducer;
export type { AppLoadingState };