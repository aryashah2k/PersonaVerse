// File utilities for PersonaVerse

// Valid file types for upload
export const VALID_FILE_TYPES = [
  'application/pdf', // PDF
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLSX
  'text/plain', // TXT
  // Sometimes browsers report different MIME types
  'application/msword',
  'application/vnd.ms-excel',
  'application/octet-stream', // For some .docx files
  'text/csv', // CSV
];

// Map mime types to user-friendly names
export const FILE_TYPE_NAMES: Record<string, string> = {
  'application/pdf': 'PDF',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word Document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel Spreadsheet',
  'text/plain': 'Text File',
  'text/csv': 'CSV File',
};

// File size limits
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Check if a file is of a valid type
 */
export const isValidFileType = (file: File): boolean => {
  const acceptedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'application/msword',
    'application/vnd.ms-excel',
    'text/csv',
  ];
  return acceptedTypes.includes(file.type);
};

/**
 * Check if a file exceeds maximum size
 */
export const isValidFileSize = (file: File): boolean => {
  const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
  return file.size <= maxSizeInBytes;
};

/**
 * Get a user-friendly name for a file type
 */
export const getFileTypeName = (fileType: string): string => {
  if (fileType.includes('pdf')) {
    return 'PDF';
  } else if (fileType.includes('spreadsheet') || fileType.includes('excel') || fileType.includes('xlsx')) {
    return 'Excel';
  } else if (fileType.includes('document') || fileType.includes('word') || fileType.includes('docx')) {
    return 'Word';
  } else if (fileType.includes('text') || fileType.includes('txt')) {
    return 'Text';
  }
  else if (fileType.includes('csv')) {
    return 'CSV';
  } else {
    return 'File';
  }
};

/**
 * Format file size in a human-readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Extract file extension from file name
 */
export const getFileExtension = (filename: string): string => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2).toLowerCase();
};

/**
 * Get file icon name based on file type
 */
export const getFileTypeIcon = (mimeType: string): string => {
  if (mimeType.includes('pdf')) {
    return 'pdf';
  } else if (mimeType.includes('word') || mimeType.includes('document') || mimeType.includes('docx')) {
    return 'doc';
  } else if (mimeType.includes('sheet') || mimeType.includes('excel') || mimeType.includes('xlsx')) {
    return 'xls';
  } else if (mimeType.includes('text') || mimeType.includes('txt')) {
    return 'txt';
  } else {
    return 'file';
  }
};

/**
 * Get file type from URL extension
 */
export const getFileTypeFromUrl = (url: string): string => {
  const extension = url.split('.').pop()?.toLowerCase() || '';
  switch (extension) {
    case 'pdf':
      return 'PDF';
    case 'docx':
    case 'doc':
      return 'Word';
    case 'xlsx':
    case 'xls':
      return 'Excel';
    case 'txt':
      return 'Text';
    case 'csv':
      return 'CSV';
    case 'json':
      return 'JSON';
    default:
      return 'File';
  }
};
