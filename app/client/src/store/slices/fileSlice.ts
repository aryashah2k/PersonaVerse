import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FileState {
  file: File | null;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadProgress: number;
  isUploading: boolean;
  isUploaded: boolean;
  error: string | null;
}

const initialState: FileState = {
  file: null,
  fileName: '',
  fileType: '',
  fileSize: 0,
  uploadProgress: 0,
  isUploading: false,
  isUploaded: false,
  error: null,
};

export const fileSlice = createSlice({
  name: 'file',
  initialState,
  reducers: {
    setFile: (state, action: PayloadAction<File>) => {
      const file = action.payload;
      state.file = file;
      state.fileName = file.name;
      state.fileType = file.type;
      state.fileSize = file.size;
      state.error = null;
    },
    removeFile: (state) => {
      state.file = null;
      state.fileName = '';
      state.fileType = '';
      state.fileSize = 0;
      state.uploadProgress = 0;
      state.isUploaded = false;
      state.error = null;
    },
    uploadStart: (state) => {
      state.isUploading = true;
      state.uploadProgress = 0;
      state.error = null;
    },
    uploadProgress: (state, action: PayloadAction<number>) => {
      state.uploadProgress = action.payload;
    },
    uploadSuccess: (state) => {
      state.isUploading = false;
      state.isUploaded = true;
      state.uploadProgress = 100;
    },
    uploadFailure: (state, action: PayloadAction<string>) => {
      state.isUploading = false;
      state.error = action.payload;
    },
    resetFileState: () => initialState,
  },
});

export const {
  setFile,
  removeFile,
  uploadStart,
  uploadProgress,
  uploadSuccess,
  uploadFailure,
  resetFileState,
} = fileSlice.actions;

export default fileSlice.reducer;
export type { FileState };