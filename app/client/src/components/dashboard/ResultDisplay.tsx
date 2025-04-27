import React from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Alert,
  Paper,
  Stack,
  Divider,
  Chip,
  Link,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import DownloadIcon from "@mui/icons-material/Download";
import ReplayIcon from "@mui/icons-material/Replay";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FilePresentIcon from "@mui/icons-material/FilePresent";
import { getFileTypeFromUrl } from "../../utils/fileUtils";
import { historyService } from "../../services/api";
import useUserProfile from "../../hooks/useUserProfile";
import useForm from "../../hooks/useForm";
import useFileUpload from "../../hooks/useFileUpload";

const SuccessIcon = styled(CheckCircleIcon)(({ theme }) => ({
  fontSize: 80,
  color: theme.palette.success.main,
  marginBottom: theme.spacing(2),
}));

const ResultCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  textAlign: "center",
  maxWidth: 600,
  margin: "0 auto",
}));

const ResultDisplay: React.FC = () => {
  const { downloadHistoryItem } = useUserProfile();
  const { surveyResponse, resetForm } = useForm();
  const handleDownload = () => {
    downloadHistoryItem(surveyResponse!.filePath);
  };
  const { removeFile } = useFileUpload();
  const fileType = getFileTypeFromUrl(surveyResponse!.filePath);

  return (
    <Box sx={{ my: 6 }}>
      <ResultCard elevation={1}>
        <SuccessIcon />
        <Typography variant="h4" component="h2" gutterBottom>
          Responses Generated!
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Your AI-powered persona responses have been generated successfully.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Card sx={{ mb: 4, p: 2, textAlign: "left" }}>
          <CardContent sx={{ p: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <FilePresentIcon
                fontSize="large"
                color="primary"
                sx={{ mr: 2 }}
              />
              <Box>
                <Typography variant="subtitle1" fontWeight={500}>
                  Survey Responses
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                  <Chip
                    label={fileType}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ mr: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Ready to download
                  </Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="center"
        >
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
            fullWidth
            sx={{ py: 1.5 }}
          >
            Download Responses
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            startIcon={<ReplayIcon />}
            onClick={() => {
              removeFile();
              resetForm();
            }}
            fullWidth
            sx={{ py: 1.5 }}
          >
            Start New Response
          </Button>
        </Stack>

        <Box sx={{ mt: 4 }}>
          <Alert severity="info" sx={{ textAlign: "left" }}>
            <Typography variant="body2">
              You can also view and download this response later from your{" "}
              <Link href="/history" underline="hover">
                history page
              </Link>
              .
            </Typography>
          </Alert>
        </Box>
      </ResultCard>
    </Box>
  );
};

export default ResultDisplay;
