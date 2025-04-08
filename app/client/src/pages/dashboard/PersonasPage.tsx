import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CheckCircle2, ArrowRight, ArrowLeft, User } from 'lucide-react';

// Components
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// State management
import {
  fetchPersonas,
  setMockPersonas,
  selectPersona,
  unselectPersona,
  setSelectedModel,
  selectPersonas,
  selectSelectedPersonas,
  selectPersonaStatus,
  selectSelectedModel,
  Model
} from '@/store/slices/personaSlice';
import { selectFileName } from '@/store/slices/fileSlice';
import { selectUser } from '@/store/slices/userSlice';
import { AppDispatch } from '@/store';

export default function PersonasPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const personas = useSelector(selectPersonas);
  const selectedPersonaIds = useSelector(selectSelectedPersonas);
  const selectedModel = useSelector(selectSelectedModel);
  const status = useSelector(selectPersonaStatus);
  const user = useSelector(selectUser);
  const fileName = useSelector(selectFileName);

  // Fetch personas or use mock data for development
  useEffect(() => {
    // If personas haven't been loaded yet
    if (status === 'idle') {
      // For test user, use mock personas
      if (user && user.id === 'test-user-id') {
        dispatch(setMockPersonas());
      } else {
        // Real users use the database
        dispatch(fetchPersonas());
      }
    }
  }, [status, dispatch, user]);

  // Toggle persona selection
  const togglePersona = (personaId: string) => {
    if (selectedPersonaIds.includes(personaId)) {
      dispatch(unselectPersona(personaId));
    } else {
      dispatch(selectPersona(personaId));
    }
  };

  // Handle model selection
  const handleModelChange = (value: string) => {
    dispatch(setSelectedModel(value as Model));
  };

  // Navigate back to file upload
  const handleBack = () => {
    navigate('/dashboard');
  };

  // Navigate to next step
  const handleNext = () => {
    if (selectedPersonaIds.length > 0) {
      navigate('/dashboard/expectation');
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Select Personas</h1>
        <p className="text-muted-foreground">
          Choose people who will evaluate your document. Select at least one persona.
        </p>
      </div>

      {/* File info card */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Current file:</p>
              <p className="font-medium truncate">{fileName}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Model selection */}
      <div className="mb-6">
        <label className="text-sm font-medium mb-2 block">Select Model</label>
        <Select value={selectedModel} onValueChange={handleModelChange}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Select model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gpt-4o">GPT-4o (Default)</SelectItem>
            <SelectItem value="gpt-mini">GPT-Mini</SelectItem>
            <SelectItem value="deepseek">DeepSeek</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Personas grid */}
      {status === 'loading' ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {personas.map((persona) => (
            <Card
              key={persona.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedPersonaIds.includes(persona.id)
                  ? 'ring-2 ring-primary'
                  : 'hover:border-primary/50'
              }`}
              onClick={() => togglePersona(persona.id)}
            >
              <CardContent className="p-4 relative">
                {selectedPersonaIds.includes(persona.id) && (
                  <div className="absolute top-2 right-2 text-primary">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                )}

                <div className="flex flex-col items-center text-center">
                  {persona.image_url ? (
                    <img
                      src={persona.image_url}
                      alt={persona.name}
                      className="w-20 h-20 rounded-full object-cover mb-3"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-3">
                      <User className="h-10 w-10 text-muted-foreground" />
                    </div>
                  )}
                  <h3 className="font-medium text-base mb-1">{persona.name}</h3>
                  <p className="text-xs text-muted-foreground mb-1">{persona.job}</p>
                  <p className="text-xs text-muted-foreground">{persona.location}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={selectedPersonaIds.length === 0}
        >
          Next
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
