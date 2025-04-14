import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setFile,
  removeFile,
  uploadStart,
  uploadProgress,
  uploadSuccess,
  uploadFailure,
  resetFileState
} from '../store/slices/fileSlice';
import { RootState } from '../store';
import { fileService } from '../services/api';
import { isValidFileType, isValidFileSize } from '../utils/fileUtils';

export const useFileUpload = () => {
  const dispatch = useDispatch();
  const {
    file,
    fileName,
    fileType,
    fileSize,
    uploadProgress: progress,
    isUploading,
    isUploaded,
    error
  } = useSelector((state: RootState) => state.file);

  const handleFileChange = useCallback((newFile: File) => {
    if (!isValidFileType(newFile)) {
      dispatch(uploadFailure('Invalid file type. Please upload a PDF, DOCX, XLSX or TXT file.'));
      return;
    }

    if (!isValidFileSize(newFile)) {
      dispatch(uploadFailure('File size exceeds 10MB limit. Please choose a smaller file.'));
      return;
    }

    dispatch(setFile(newFile));
  }, [dispatch]);

  const uploadFile = useCallback(async () => {
    if (!file) {
      return { success: false, error: 'No file selected' };
    }

    dispatch(uploadStart());

    try {
      const result = await fileService.uploadFile(file, (progress) => {
        dispatch(uploadProgress(progress));
      });

      dispatch(uploadSuccess());
      return { success: true, fileUrl: result.fileUrl };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload file';
      dispatch(uploadFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  }, [dispatch, file]);

  const resetUploadState = useCallback(() => {
    dispatch(resetFileState());
  }, [dispatch]);

  return {
    file,
    fileName,
    fileType,
    fileSize,
    progress,
    isUploading,
    isUploaded,
    error,
    handleFileChange,
    uploadFile,
    removeFile: () => dispatch(removeFile()),
    resetUploadState,
  };
};

export default useFileUpload;
