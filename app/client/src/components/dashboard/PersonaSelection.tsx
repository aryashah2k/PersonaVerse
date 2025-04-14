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
import { useAppSelector } from "../../hooks/useAppSelector";
import { useAppDispatch } from "../../store";
import { setModel, setPersona } from "../../store/slices/formSlice";

const mockPersonas: Persona[] = [
  {
    id: "1",
    name: "John Smith",
    age: 35,
    gender: "Male",
    job: "Marketing Manager",
    location: "New York, USA",
    background: "MBA graduate, worked in tech for 10 years",
    description:
      "Tech-savvy professional with 10+ years experience in marketing.",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    age: 28,
    gender: "Female",
    job: "UX/UI Designer",
    location: "San Francisco, USA",
    background: "Design school graduate, 5 years in tech startups",
    description:
      "Creative designer focused on user experience and accessibility.",
  },
  {
    id: "3",
    name: "David Chen",
    age: 42,
    gender: "Male",
    job: "Chief Technology Officer",
    location: "Boston, USA",
    background: "Computer Science PhD, former startup founder",
    description: "Strategic decision-maker with strong technical background.",
  },
  {
    id: "4",
    name: "Emily Rodriguez",
    age: 31,
    gender: "Female",
    job: "Market Research Analyst",
    location: "Chicago, USA",
    background: "Economics degree, certified data analyst",
    description: "Data-driven analyst with expertise in consumer behavior.",
  },
  {
    id: "5",
    name: "Michael Grant",
    age: 55,
    gender: "Male",
    job: "University Professor",
    location: "Austin, USA",
    background: "PhD in Sociology, 25 years in academia",
    description: "Thought leader with traditional academic perspective.",
  },
  {
    id: "6",
    name: "Lisa Wong",
    age: 24,
    gender: "Female",
    job: "Graduate Student",
    location: "Portland, USA",
    background: "Studying Human-Computer Interaction",
    description:
      "Digital native with progressive views and high tech literacy.",
  },
  {
    id: "7",
    name: "Robert Garcia",
    age: 38,
    gender: "Male",
    job: "Small Business Owner",
    location: "Miami, USA",
    background: "Owned a local grocery store for 12 years",
    description:
      "Practical, budget-conscious entrepreneur focused on community.",
  },
  {
    id: "8",
    name: "Jennifer Wilson",
    age: 45,
    gender: "Female",
    job: "Healthcare Administrator",
    location: "Minneapolis, USA",
    background: "Nursing background with 15 years in healthcare management",
    description:
      "Detail-oriented professional with strong focus on compliance and safety.",
  },
  {
    id: "9",
    name: "Tyler Jackson",
    age: 22,
    gender: "Male",
    job: "College Student",
    location: "Atlanta, USA",
    background: "Business major, part-time barista",
    description:
      "Value-conscious consumer balancing education and work responsibilities.",
  },
  {
    id: "10",
    name: "Karen Thompson",
    age: 67,
    gender: "Female",
    job: "Retired Teacher",
    location: "Seattle, USA",
    background: "35 years teaching high school English",
    description:
      "Traditional consumer who values quality, service, and familiarity.",
  },
  {
    id: "11",
    name: "James Liu",
    age: 33,
    gender: "Male",
    job: "Software Engineer",
    location: "San Jose, USA",
    background: "CS degree, worked at 3 major tech companies",
    description:
      "Early adopter of new technologies with high technical expertise.",
  },
  {
    id: "12",
    name: "Maria Gonzalez",
    age: 29,
    gender: "Female",
    job: "Social Media Manager",
    location: "Los Angeles, USA",
    background: "Communications degree, influencer marketing",
    description:
      "Trend-conscious professional who values brand image and engagement.",
  },
  {
    id: "13",
    name: "Jamal Williams",
    age: 41,
    gender: "Male",
    job: "Construction Foreman",
    location: "Detroit, USA",
    background: "20 years in construction industry",
    description:
      "Practical decision-maker who values durability and reliability.",
  },
  {
    id: "14",
    name: "Sophia Kim",
    age: 27,
    gender: "Female",
    job: "Environmental Scientist",
    location: "Denver, USA",
    background: "Master's in environmental science, climate researcher",
    description:
      "Eco-conscious professional with strong focus on sustainability.",
  },
  {
    id: "15",
    name: "Daniel Murphy",
    age: 52,
    gender: "Male",
    job: "Financial Advisor",
    location: "Philadelphia, USA",
    background: "MBA in Finance, former investment banker",
    description:
      "Risk-aware professional who values long-term planning and stability.",
  },
];
const mockModels: AIModel[] = [
  {
    id: "1",
    name: "GPT-Mini",
    description: "Fast, efficient responses for basic surveys",
    tokenCost: 5,
  },
  {
    id: "2",
    name: "GPT-4o",
    description: "Advanced model with human-like understanding",
    tokenCost: 15,
  },
  {
    id: "3",
    name: "DeepSeek",
    description: "Specialized for detailed, nuanced responses",
    tokenCost: 10,
  },
  {
    id: "4",
    name: "Claude",
    description: "Best for complex reasoning and explanation",
    tokenCost: 20,
  },
  {
    id: "5",
    name: "Llama-3",
    description: "Balanced performance and accuracy for general surveys",
    tokenCost: 12,
  },
  {
    id: "6",
    name: "Mistral-8x7B",
    description: "Excellent for multilingual surveys and cultural sensitivity",
    tokenCost: 18,
  },
];

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
  const models = mockModels;
  const personas = mockPersonas;
  const selectedModel = useAppSelector((state) => state.form.model);
  const selectedPersonas = useAppSelector((state) => state.form.personas);
  const dispatch = useAppDispatch();

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
    dispatch(setPersona(persona));
  };

  const handleModelChange = (event: SelectChangeEvent<string>) => {
    dispatch(setModel(models[parseInt(event.target.value) - 1]));
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
            {models.map((model) => (
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
