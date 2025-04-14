import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Alert,
  Paper,
} from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import PersonIcon from "@mui/icons-material/Person";
import ChatIcon from "@mui/icons-material/Chat";
import DescriptionIcon from "@mui/icons-material/Description";
import FileUpload from "./FileUpload";
import PersonaSelection from "./PersonaSelection";
import ResponsePrompt from "./ResponsePrompt";
import ResultDisplay from "./ResultDisplay";
import TokenDialog from "./TokenDialog";
import Layout from "../layout/Layout";
import { useUserProfile } from "../../hooks/useUserProfile";
import { useAppDispatch } from "../../store";
import { resetFormState } from "../../store/slices/formSlice";
import useFileUpload from "../../hooks/useFileUpload";

const steps = [
  { label: "Upload Survey", icon: <FileUploadIcon /> },
  { label: "Select Personas", icon: <PersonIcon /> },
  { label: "Specify Response Parameters", icon: <ChatIcon /> },
  { label: "Get Results", icon: <DescriptionIcon /> },
];

const Dashboard: React.FC = () => {
  const { loadProfile } = useUserProfile();
  const { resetUploadState } = useFileUpload();
  const [activeStep, setActiveStep] = useState(0);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [responseUrl, setResponseUrl] = useState<string | null>(null);
  const [showTokenDialog, setShowTokenDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();
  useEffect(() => {
    const init = async () => {
      try {
        await loadProfile();
      } catch (err) {
        setError("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [loadProfile]);

  const handleFileUploadComplete = (url: string) => {
    setFileUrl(url);
    setActiveStep(1);
  };

  const handlePersonaSelectionComplete = () => {
    setActiveStep(2);
  };

  const handleResponsePromptComplete = (url: string) => {
    setResponseUrl(url);
    setActiveStep(3);
  };

  const handlePrevious = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setActiveStep(0);
    setFileUrl(null);
    setResponseUrl(null);
    resetUploadState();
    dispatch(resetFormState());
  };

  const handleNeedMoreTokens = () => {
    setShowTokenDialog(true);
  };

  const handleTokenDialogClose = () => {
    setShowTokenDialog(false);
    loadProfile(); // Refresh token balance
  };

  if (loading) {
    return (
      <Layout>
        <Container>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
            <CircularProgress />
          </Box>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container>
        <Box sx={{ mt: 4, mb: 6 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Generate AI-powered persona responses for your surveys in just a few
            steps.
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        <Paper sx={{ p: { xs: 2, md: 3 }, mb: 4 }}>
          <Stepper
            activeStep={activeStep}
            alternativeLabel
            sx={{
              mb: 4,
              "& .MuiStepLabel-iconContainer": { marginRight: 0 },
            }}
          >
            {steps.map((step, index) => (
              <Step key={index}>
                <StepLabel
                  StepIconComponent={() => (
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor:
                          index <= activeStep ? "primary.main" : "grey.300",
                        color:
                          index <= activeStep
                            ? "primary.contrastText"
                            : "grey.700",
                      }}
                    >
                      {step.icon}
                    </Box>
                  )}
                >
                  {step.label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box>
            {activeStep === 0 && (
              <FileUpload onUploadComplete={handleFileUploadComplete} />
            )}

            {activeStep === 1 && (
              <PersonaSelection
                onSelectionComplete={handlePersonaSelectionComplete}
                onPrevious={handlePrevious}
              />
            )}

            {activeStep === 2 && fileUrl && (
              <ResponsePrompt
                fileUrl={fileUrl}
                onSubmitComplete={handleResponsePromptComplete}
                onRequestTokens={handleNeedMoreTokens}
                onPrevious={handlePrevious}
              />
            )}

            {activeStep === 3 && responseUrl && (
              <ResultDisplay
                responseUrl={responseUrl}
                onStartNew={handleReset}
              />
            )}
          </Box>
        </Paper>

        <TokenDialog open={showTokenDialog} onClose={handleTokenDialogClose} />
      </Container>
    </Layout>
  );
};

export default Dashboard;
