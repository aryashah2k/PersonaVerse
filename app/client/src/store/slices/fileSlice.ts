import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { uploadFile, createRecord, getPublicUrl } from '@/lib/supabase';
import { RootState } from '@/store';

interface FileState {
  file: File | null;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  uploadProgress: number;
  isUploading: boolean;
  uploadSuccess: boolean;
  uploadError: string | null;
  uploadedFileId: string | null;
}

const initialState: FileState = {
  file: null,
  fileName: '',
  fileType: '',
  fileSize: 0,
  fileUrl: '',
  uploadProgress: 0,
  isUploading: false,
  uploadSuccess: false,
  uploadError: null,
  uploadedFileId: null,
};

// Function to normalize file name for storage
const normalizeFileName = (fileName: string): string => {
  return `${Date.now()}_${fileName.replace(/[^a-zA-Z0-9.]/g, '_')}`;
};

// Async thunk for file upload
export const uploadFileToStorage = createAsyncThunk(
  'file/uploadFileToStorage',
  async ({ file, userId }: { file: File; userId: string }, { rejectWithValue, dispatch }) => {
    try {
      // First set progress to 10%
      dispatch(setUploadProgress(10));

      // Handle test user without actually accessing Supabase
      if (userId === 'test-user-id') {
        console.log('Mock file upload for test user');

        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        dispatch(setUploadProgress(50));

        // Simulate another delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        dispatch(setUploadProgress(100));

        // Return mock file data
        return {
          file,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          fileUrl: 'https://mock-file-url.com/' + file.name,
          uploadedFileId: 'mock-file-id-' + Date.now(),
        };
      }

      // Regular upload flow for non-test users
      // Normalize file name for storage
      const storageFileName = normalizeFileName(file.name);
      const filePath = `${userId}/${storageFileName}`;

      // Upload to Supabase storage
      const storageData = await uploadFile('files', filePath, file);

      if (!storageData) {
        return rejectWithValue('Failed to upload file to storage');
      }

      // Get public URL
      const publicUrl = getPublicUrl('files', filePath);

      // Update progress to 50%
      dispatch(setUploadProgress(50));

      // Create record in database
      const fileRecord = {
        profile_id: userId,
        file_name: file.name,
        file_url: publicUrl,
        file_type: file.type,
        file_size: file.size,
        processed: false,
      };

      const recordData = await createRecord('files', fileRecord);

      // Update progress to 100%
      dispatch(setUploadProgress(100));

      return {
        file,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        fileUrl: publicUrl,
        uploadedFileId: recordData.id,
      };
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred during file upload');
    }
  }
);

const fileSlice = createSlice({
  name: 'file',
  initialState,
  reducers: {
    setFile: (state, action: PayloadAction<File | null>) => {
      const file = action.payload;
      state.file = file;

      if (file) {
        state.fileName = file.name;
        state.fileType = file.type;
        state.fileSize = file.size;
      } else {
        state.fileName = '';
        state.fileType = '';
        state.fileSize = 0;
        state.fileUrl = '';
      }
    },
    setUploadProgress: (state, action: PayloadAction<number>) => {
      state.uploadProgress = action.payload;
    },
    resetFileState: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadFileToStorage.pending, (state) => {
        state.isUploading = true;
        state.uploadSuccess = false;
        state.uploadError = null;
      })
      .addCase(uploadFileToStorage.fulfilled, (state, action) => {
        state.isUploading = false;
        state.uploadSuccess = true;
        state.fileUrl = action.payload.fileUrl;
        state.uploadedFileId = action.payload.uploadedFileId;
      })
      .addCase(uploadFileToStorage.rejected, (state, action) => {
        state.isUploading = false;
        state.uploadError = action.payload as string;
        state.uploadProgress = 0;
      });
  },
});

export const { setFile, setUploadProgress, resetFileState } = fileSlice.actions;

// Selectors
export const selectFile = (state: RootState) => state.file.file;
export const selectFileName = (state: RootState) => state.file.fileName;
export const selectFileType = (state: RootState) => state.file.fileType;
export const selectFileSize = (state: RootState) => state.file.fileSize;
export const selectFileUrl = (state: RootState) => state.file.fileUrl;
export const selectUploadProgress = (state: RootState) => state.file.uploadProgress;
export const selectIsUploading = (state: RootState) => state.file.isUploading;
export const selectUploadSuccess = (state: RootState) => state.file.uploadSuccess;
export const selectUploadError = (state: RootState) => state.file.uploadError;
export const selectUploadedFileId = (state: RootState) => state.file.uploadedFileId;

export default fileSlice.reducer;
