import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Chip,
  CircularProgress,
  Alert,
  Paper,
} from "@mui/material";
import TokenIcon from "@mui/icons-material/Token";
import SendIcon from "@mui/icons-material/Send";
import { useUserProfile } from "../../hooks/useUserProfile";
import submitSurvey from "../../api/surveyApi";
import { FormResponse } from "../../model/response";
import { deductTokens } from "../../store/slices/userSlice";
import useForm from "../../hooks/useForm";
import useAppLoading from "../../hooks/useAppLoading";
import useAuth from "../../hooks/useAuth";

interface ResponsePromptProps {
  onSubmitComplete: (responseUrl: string) => void;
  onRequestTokens: () => void;
  onPrevious: () => void;
}

const ResponsePrompt: React.FC<ResponsePromptProps> = ({
  onSubmitComplete,
  onRequestTokens,
  onPrevious,
}) => {
  const { profile } = useAuth();
  const {
    submitForm,
    selectedModel,
    selectedPersonas,
    responsePrompt,
    setResponsePrompt,
    responseFormat,
    setResponseFormat,
    isSubmitted,
    isSubmitting,
    error,
  } = useForm();
  // const dispatch = useAppDispatch();
  const [promptError, setPromptError] = useState("");
  const { setAppLoadingFalse } = useAppLoading();
  const [pageError, setError] = useState<string | null>(null);
  const estimatedTokenCost = selectedPersonas.length * 5 + 10; // Example token cost calculation
  const hasEnoughTokens = (profile?.tokens || 1000) >= estimatedTokenCost;
  const handlePrevious = () => {
    onPrevious();
  };

  const handleSubmit = async () => {
    try {
      submitForm();
      // onSubmitComplete("kjhddsjfahkjsda");
    } catch (error) {
      console.error("Error during submission:", error);
      setError("An error occurred while processing your request.");
    } finally {
      setAppLoadingFalse();
    }
  };

  return (
    <Box sx={{ my: 4 }}>
      <Card
        variant="outlined"
        sx={{
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Specify Response Parameters
          </Typography>
          <Typography color="text.secondary" gutterBottom>
            Enter details for how the selected personas should respond to your
            survey
          </Typography>

          {(pageError || error) && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {pageError || error}
            </Alert>
          )}

          <Box sx={{ mt: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                mb: 4,
              }}
            >
              <Typography variant="subtitle1" gutterBottom fontWeight={500}>
                Current Selections
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Selected AI Model:
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {selectedModel?.name || "None selected"}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Selected Personas ({selectedPersonas.length}):
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 0.5,
                        mt: 0.5,
                      }}
                    >
                      {selectedPersonas.length > 0 ? (
                        selectedPersonas.map((persona) => (
                          <Chip
                            key={persona.id}
                            label={persona.name}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        ))
                      ) : (
                        <Typography variant="body1">None selected</Typography>
                      )}
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Response Instruction"
                  placeholder="Explain how personas should approach the questions (e.g., 'Please answer the questions by rating each on a scale of 1 to 5, where 1 means Strongly Disagree and 5 means Strongly Agree.')"
                  fullWidth
                  multiline
                  rows={4}
                  value={responsePrompt}
                  // onChange={(e) => dispatch(setInstruction(e.target.value))}
                  onChange={(e) => setResponsePrompt(e.target.value)}
                  error={!!promptError}
                  helperText={promptError}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="response-format-label">
                    Response Format
                  </InputLabel>
                  <Select
                    labelId="response-format-label"
                    id="response-format"
                    value={responseFormat}
                    label="Response Format"
                    onChange={(e) => setResponseFormat(e.target.value)}
                  >
                    <MenuItem value="csv">CSV File (.csv)</MenuItem>
                    <MenuItem value="json">JSON File (.json)</MenuItem>
                  </Select>
                  <FormHelperText>
                    Format for the generated responses
                  </FormHelperText>
                </FormControl>
              </Grid>
            </Grid>

            <Box
              sx={{
                mt: 4,
                p: 2,
                bgcolor: hasEnoughTokens ? "success.light" : "error.light",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
              }}
            >
              <TokenIcon
                sx={{
                  color: hasEnoughTokens ? "success.dark" : "error.dark",
                  mr: 1,
                }}
              />
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: hasEnoughTokens ? "success.dark" : "error.dark",
                    fontWeight: 500,
                  }}
                >
                  {hasEnoughTokens
                    ? `You have sufficient tokens (${
                        profile?.tokens || 0
                      } available)`
                    : `Insufficient tokens (${
                        profile?.tokens || 0
                      } available, ${estimatedTokenCost} needed)`}
                </Typography>
                {!hasEnoughTokens && (
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    onClick={onRequestTokens}
                    sx={{ mt: 1 }}
                  >
                    Get More Tokens
                  </Button>
                )}
              </Box>
            </Box>

            <Box
              sx={{
                mt: 4,
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
              }}
            >
              <Button
                variant="outlined"
                color="primary"
                sx={{ backgroundColor: "transparent", color: "text.primary" }}
                disabled={isSubmitting}
                onClick={handlePrevious}
              >
                Previous
              </Button>
              <Button
                variant="contained"
                color="primary"
                size="large"
                disabled={isSubmitting || !hasEnoughTokens}
                onClick={handleSubmit}
                startIcon={
                  isSubmitting ? <CircularProgress size={20} /> : <SendIcon />
                }
              >
                {isSubmitting ? "Generating..." : "Generate Responses"}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ResponsePrompt;
