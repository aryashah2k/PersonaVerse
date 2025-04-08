import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText, FileSpreadsheet, FileIcon, File, ArrowRight } from 'lucide-react';

// Components
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import FilePreview from '@/components/FilePreview';

// State management
import {
  setFile,
  uploadFileToStorage,
  selectIsUploading,
  selectUploadProgress,
  selectUploadSuccess,
  selectUploadError,
  selectFile,
  selectFileName,
  selectFileType,
  selectFileSize,
  selectFileUrl,
} from '@/store/slices/fileSlice';
import { selectUser } from '@/store/slices/userSlice';
import { AppDispatch } from '@/store';
import { formatBytes } from '@/lib/utils';

// Allowed file types
const ALLOWED_FILE_TYPES = [
  'text/plain',                                          // .txt
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',  // .docx
  'application/msword',                                 // .doc
  'application/pdf',                                    // .pdf
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',       // .xlsx
  'application/vnd.ms-excel',                           // .xls
];

export default function HomePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const [fileError, setFileError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState<boolean>(false);

  // Selectors
  const user = useSelector(selectUser);
  const file = useSelector(selectFile);
  const fileName = useSelector(selectFileName);
  const fileType = useSelector(selectFileType);
  const fileSize = useSelector(selectFileSize);
  const fileUrl = useSelector(selectFileUrl);
  const isUploading = useSelector(selectIsUploading);
  const uploadProgress = useSelector(selectUploadProgress);
  const uploadSuccess = useSelector(selectUploadSuccess);
  const uploadError = useSelector(selectUploadError);

  // File icon based on file type
  const getFileIcon = () => {
    if (fileType.includes('text/plain')) return <FileText className="h-8 w-8 text-blue-500" />;
    if (fileType.includes('word')) return <FileText className="h-8 w-8 text-blue-500" />;
    if (fileType.includes('pdf')) return <FileIcon className="h-8 w-8 text-red-500" />;
    if (fileType.includes('excel') || fileType.includes('spreadsheet'))
      return <FileSpreadsheet className="h-8 w-8 text-green-500" />;
    return <File className="h-8 w-8 text-gray-500" />;
  };

  // Handle file drop
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFileError(null);
      setShowPreview(false);

      if (acceptedFiles.length === 0) {
        return;
      }

      const newFile = acceptedFiles[0];

      // Validate file type
      if (!ALLOWED_FILE_TYPES.includes(newFile.type)) {
        setFileError('Invalid file type. Please upload a .txt, .doc, .docx, .pdf, or .xlsx file.');
        return;
      }

      // Validate file size (10MB max)
      if (newFile.size > 10 * 1024 * 1024) {
        setFileError('File too large. Maximum file size is 10MB.');
        return;
      }

      // Set file in Redux store
      dispatch(setFile(newFile));
    },
    [dispatch]
  );

  // Dropzone configuration
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      'text/plain': ['.txt'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    }
  });

  // Handle file upload
  const handleUpload = async () => {
    if (!file || !user) return;

    try {
      await dispatch(uploadFileToStorage({ file, userId: user.id }));
      setShowPreview(true);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  // Reset file selection
  const handleRemoveFile = () => {
    dispatch(setFile(null));
    setFileError(null);
    setShowPreview(false);
  };

  // Continue to next step
  const handleContinue = () => {
    navigate('/dashboard/personas');
  };

  // Show error toast for upload errors
  if (uploadError) {
    toast({
      title: 'Upload Failed',
      description: uploadError,
      variant: 'destructive',
    });
  }

  // Toggle file preview display
  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Upload Your Document</h1>
        <p className="text-muted-foreground">
          Start by uploading a document. We support .txt, .doc, .docx, .pdf, and .xlsx files.
        </p>
      </div>

      {!file ? (
        <Card>
          <CardContent className="p-6">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer flex flex-col items-center justify-center ${
                isDragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50 hover:bg-accent/50'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-1">Drag & drop your file here</h3>
              <p className="text-sm text-muted-foreground mb-4 text-center">
                or click to browse your files
              </p>
              <p className="text-xs text-muted-foreground text-center">
                Supported formats: .txt, .doc, .docx, .pdf, .xlsx
                <br />
                Maximum file size: 10MB
              </p>
              {fileError && (
                <p className="mt-4 text-sm text-destructive text-center">{fileError}</p>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-6">
                {getFileIcon()}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium truncate max-w-[250px] sm:max-w-md">{fileName}</h3>
                      <p className="text-sm text-muted-foreground">{formatBytes(fileSize)}</p>
                    </div>
                    {!isUploading && !uploadSuccess && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleRemoveFile}
                        className="ml-2 flex-shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {isUploading && (
                    <div className="mt-2 space-y-2">
                      <Progress value={uploadProgress} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        Uploading... {uploadProgress}%
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-4">
                {!isUploading && !uploadSuccess && (
                  <Button onClick={handleUpload} disabled={isUploading}>
                    Upload File
                  </Button>
                )}

                {uploadSuccess && (
                  <>
                    <Button variant="outline" onClick={togglePreview}>
                      {showPreview ? "Hide Preview" : "Show Preview"}
                    </Button>
                    <Button onClick={handleContinue}>
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* File Preview */}
          {uploadSuccess && showPreview && fileUrl && (
            <div className="mt-6">
              <FilePreview fileUrl={fileUrl} fileName={fileName} fileType={fileType} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
