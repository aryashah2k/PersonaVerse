import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/store';

interface ProcessState {
  expectation: string;
  isProcessing: boolean;
  processingSuccess: boolean;
  processingError: string | null;
  resultUrl: string | null;
}

const initialState: ProcessState = {
  expectation: '',
  isProcessing: false,
  processingSuccess: false,
  processingError: null,
  resultUrl: null,
};

const processSlice = createSlice({
  name: 'process',
  initialState,
  reducers: {
    setExpectation: (state, action: PayloadAction<string>) => {
      state.expectation = action.payload;
    },
    startProcessing: (state) => {
      state.isProcessing = true;
      state.processingSuccess = false;
      state.processingError = null;
    },
    processingSuccess: (state, action: PayloadAction<string>) => {
      state.isProcessing = false;
      state.processingSuccess = true;
      state.resultUrl = action.payload;
    },
    processingError: (state, action: PayloadAction<string>) => {
      state.isProcessing = false;
      state.processingError = action.payload;
    },
    resetProcessState: (state) => {
      return initialState;
    },
    // Mock completed process for development
    setMockCompleted: (state) => {
      state.isProcessing = false;
      state.processingSuccess = true;
      state.resultUrl = 'https://example.com/mock-result.xlsx';
    }
  },
});

export const {
  setExpectation,
  startProcessing,
  processingSuccess,
  processingError,
  resetProcessState,
  setMockCompleted
} = processSlice.actions;

// Selectors
export const selectExpectation = (state: RootState) => state.process.expectation;
export const selectIsProcessing = (state: RootState) => state.process.isProcessing;
export const selectProcessingSuccess = (state: RootState) => state.process.processingSuccess;
export const selectProcessingError = (state: RootState) => state.process.processingError;
export const selectResultUrl = (state: RootState) => state.process.resultUrl;

export default processSlice.reducer;
