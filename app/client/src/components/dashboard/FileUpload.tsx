import React, { useState, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  LinearProgress,
  Card,
  CardContent,
  Alert,
  Stack,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DescriptionIcon from "@mui/icons-material/Description";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import useFileUpload from "../../hooks/useFileUpload";
import { formatFileSize, getFileTypeName } from "../../utils/fileUtils";
import useForm from "../../hooks/useForm";

interface FileUploadProps {
  onUploadComplete: (fileUrl: string) => void;
}

const DropZone = styled(Paper)(({ theme }) => ({
  border: `2px dashed ${theme.palette.primary.main}`,
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(6),
  textAlign: "center",
  cursor: "pointer",
  transition: "all 0.3s ease",
  backgroundColor: theme.palette.background.paper,
  "&:hover": {
    borderColor: theme.palette.primary.dark,
    backgroundColor: theme.palette.action.hover,
  },
}));

const HiddenInput = styled("input")({
  display: "none",
});

const FileUpload: React.FC<FileUploadProps> = ({ onUploadComplete }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const {
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
    removeFile,
  } = useFileUpload();
  const { resetForm } = useForm();
  const handleRemoveFile = () => {
    removeFile();
    resetForm();
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileChange(e.target.files[0]);
    }
  };

  const handleSelectFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUpload = async () => {
    const result = await uploadFile();
    if (result.success && result.fileUrl) {
      onUploadComplete(result.fileUrl);
    }
  };

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Upload Your Survey File
      </Typography>
      <Typography color="text.secondary" paragraph>
        Upload your survey questions as a file. We support PDF, DOCX, XLSX, CSV
        and TXT formats (max 10MB).
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {!file ? (
        <DropZone
          onDrop={handleFileDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleSelectFile}
          sx={{
            borderColor: dragActive ? "primary.dark" : "primary.main",
            bgcolor: dragActive ? "action.hover" : "background.paper",
          }}
        >
          <UploadFileIcon sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Drag & Drop your file here
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            or
          </Typography>
          <Button
            variant="contained"
            component="span"
            startIcon={<CloudUploadIcon />}
            sx={{ mt: 2 }}
          >
            Browse Files
          </Button>
          <HiddenInput
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.xlsx,.txt,.doc,.xls,.csv"
            onChange={handleFileInputChange}
          />
        </DropZone>
      ) : (
        <Card variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <DescriptionIcon
                sx={{ fontSize: 40, color: "primary.main", mr: 2 }}
              />
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1" fontWeight="medium" noWrap>
                  {fileName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {getFileTypeName(fileType)} • {formatFileSize(fileSize)}
                </Typography>
              </Box>
              <Button
                startIcon={<DeleteIcon />}
                color="error"
                onClick={handleRemoveFile}
                disabled={isUploading}
              >
                Remove
              </Button>
            </Box>

            {isUploading && (
              <Box sx={{ width: "100%", mt: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{ height: 8, borderRadius: 4 }}
                />
                <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                  Uploading: {progress}%
                </Typography>
              </Box>
            )}

            <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                disabled={isUploading || isUploaded}
                onClick={handleUpload}
                fullWidth
              >
                {isUploaded ? "Uploaded" : "Upload File"}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default FileUpload;
