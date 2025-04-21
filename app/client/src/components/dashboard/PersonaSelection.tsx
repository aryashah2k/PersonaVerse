import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Avatar,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  Alert,
  SelectChangeEvent,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import PersonIcon from "@mui/icons-material/Person";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Persona } from "../../model/persona";
import { AIModel } from "../../model/AIModel";
import { useAppDispatch, useAppSelector } from "../../store";
import { setModel, setPersona } from "../../store/slices/formSlice";
import usePersonasAI from "../../hooks/usePersonasAI";
import useAuth from "../../hooks/useAuth";
import useForm from "../../hooks/useForm";

const PersonaCard = styled(Card)(({ theme }) => ({
  height: "100%",
  borderRadius: theme.shape.borderRadius * 2,
  transition: "all 0.2s ease",
  position: "relative",
  overflow: "visible",
}));

const PersonaAvatar = styled(Avatar)(({ theme }) => ({
  width: 60,
  height: 60,
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.main,
  fontSize: "1.5rem",
  fontWeight: "bold",
  marginBottom: theme.spacing(2),
}));

const SelectedCheck = styled(CheckCircleIcon)(({ theme }) => ({
  position: "absolute",
  top: -10,
  right: -10,
  backgroundColor: "white",
  borderRadius: "50%",
  color: theme.palette.primary.main,
  fontSize: 30,
}));

interface PersonaSelectionProps {
  onSelectionComplete: () => void;
  onPrevious: () => void;
}

const PersonaSelection: React.FC<PersonaSelectionProps> = ({
  onSelectionComplete,
  onPrevious,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { models, personas } = usePersonasAI();
  const { profile } = useAuth();
  const { selectedModel, selectedPersonas, selectPersona, selectModel } =
    useForm();
  // const dispatch = useAppDispatch();

  useEffect(() => {}, []);

  const handleContinue = () => {
    if (selectedModel && selectedPersonas.length > 0) {
      onSelectionComplete();
    }
  };
  const handlePrevious = () => {
    onPrevious();
  };
  const handlePersonaClick = (persona: Persona) => {
    // dispatch(setPersona(persona));
    selectPersona(persona);
  };

  const handleModelChange = (event: SelectChangeEvent<string>) => {
    // dispatch(setModel(models[parseInt(event.target.value) - 1]));
    selectModel(models[parseInt(event.target.value) - 1]);
  };

  if (loading) {
    return (
      <Box sx={{ my: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Select Personas
      </Typography>
      <Typography color="text.secondary" gutterBottom>
        Choose the personas that will respond to your survey questions.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box mt={4}>
        <FormControl fullWidth sx={{ mb: 4 }}>
          <InputLabel id="model-select-label">Select AI Model</InputLabel>
          <Select
            labelId="model-select-label"
            value={selectedModel?.id || ""}
            label="Select AI Model"
            onChange={handleModelChange}
          >
            {models
              .filter((model) => model.usageType?.includes(profile!.planType))
              .map((model) => (
                <MenuItem key={model.id} value={model.id}>
                  {model.name} - {model.description}
                </MenuItem>
              ))}
          </Select>
          <FormHelperText>
            Different AI models offer varying levels of response quality and
            detail.
          </FormHelperText>
        </FormControl>

        <Typography variant="subtitle1" fontWeight={500} gutterBottom>
          Available Personas ({selectedPersonas.length} selected)
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {personas.map((persona) => (
            <Grid item xs={12} sm={6} md={4} key={persona.id}>
              <PersonaCard
                elevation={
                  selectedPersonas.some((p) => p.id === persona.id) ? 10 : 1
                }
              >
                {selectedPersonas.some((p) => p.id === persona.id) && (
                  <SelectedCheck />
                )}
                <CardActionArea
                  onClick={() => {
                    handlePersonaClick(persona);
                  }}
                  sx={{ p: 2, height: "100%" }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <PersonaAvatar>{persona.name.charAt(0)}</PersonaAvatar>
                      <Typography
                        variant="h6"
                        component="h3"
                        gutterBottom
                        align="center"
                      >
                        {persona.name}
                      </Typography>
                      <Box
                        sx={{
                          mb: 1,
                          display: "flex",
                          gap: 0.5,
                          flexWrap: "wrap",
                          justifyContent: "center",
                        }}
                      >
                        <Chip size="small" label={`${persona.age} years`} />
                        <Chip size="small" label={persona.gender} />
                        <Chip size="small" label={persona.location} />
                      </Box>
                      <Box sx={{ mt: 1 }}>
                        <Typography
                          variant="body2"
                          color="text.primary"
                          sx={{ fontWeight: "medium" }}
                        >
                          {persona.job}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          align="center"
                          sx={{ mt: 1 }}
                        >
                          {persona.description}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </PersonaCard>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
          <Typography variant="body2" color="text.secondary">
            <PersonIcon
              sx={{ fontSize: 16, verticalAlign: "text-bottom", mr: 0.5 }}
            />
            Select 1-5 personas for best results
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              color="primary"
              sx={{ backgroundColor: "transparent", color: "text.primary" }}
              // disabled={!hasSelectedPersona || !hasSelectedModel}
              onClick={handlePrevious}
            >
              Previous
            </Button>
            <Button
              variant="contained"
              color="primary"
              endIcon={<ArrowForwardIcon />}
              disabled={
                selectedModel && selectedPersonas.length > 0 ? false : true
              }
              onClick={handleContinue}
            >
              Continue
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PersonaSelection;
