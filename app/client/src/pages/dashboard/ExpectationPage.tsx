import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowRight, ArrowLeft, Users, FileSpreadsheet } from 'lucide-react';

// Components
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  deductTokens,
  selectHasEnoughTokens,
  selectTokensLeft,
  selectUser
} from '@/store/slices/userSlice';
import {
  setExpectation,
  startProcessing,
  setMockCompleted,
  selectExpectation
} from '@/store/slices/processSlice';
import { AppDispatch } from '@/store';
import { selectFileName } from '@/store/slices/fileSlice';
import {
  selectPersonasById,
  selectSelectedPersonas,
  selectSelectedModel
} from '@/store/slices/personaSlice';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

// Required tokens for processing
const TOKENS_REQUIRED = 100;

export default function ExpectationPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();

  // Selectors
  const fileName = useSelector(selectFileName);
  const selectedPersonaIds = useSelector(selectSelectedPersonas);
  const selectedPersonas = useSelector((state) => selectPersonasById(state, selectedPersonaIds));
  const selectedModel = useSelector(selectSelectedModel);
  const expectation = useSelector(selectExpectation);
  const tokensLeft = useSelector(selectTokensLeft);
  const hasEnoughTokens = useSelector((state) =>
    selectHasEnoughTokens(state, TOKENS_REQUIRED)
  );

  // Add user to the selectors
  const user = useSelector(selectUser);

  // Local state for form
  const [localExpectation, setLocalExpectation] = useState(expectation || '');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false); // New state for processing
  const [expectationError, setExpectationError] = useState(''); // New state for expectation error

  // Handle back button navigation
  const handleBack = () => {
    if (localExpectation) {
      dispatch(setExpectation(localExpectation));
    }
    navigate('/dashboard/personas');
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalExpectation(e.target.value);
    if (e.target.value.trim()) {
      setExpectationError('');
    }
  };

  // Handle submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true); // Set processing state

    // Validate input
    if (!localExpectation.trim()) {
      setExpectationError('Please provide your expectation');
      setIsProcessing(false); // Reset processing state
      return;
    }

    // Check if user has enough tokens
    if (!hasEnoughTokens) {
      toast({
        title: 'Not enough tokens',
        description: `You need at least ${TOKENS_REQUIRED} tokens. Please upgrade your plan.`,
        variant: 'destructive',
      });
      setIsProcessing(false); // Reset processing state
      return;
    }

    // Store expectation in state
    dispatch(setExpectation(localExpectation));

    // Start processing
    dispatch(startProcessing());

    // Special handling for test user - use mock completion
    if (user && user.id === 'test-user-id') {
      // Simulate processing delay
      setTimeout(() => {
        // Deduct tokens for the test user
        dispatch(deductTokens(TOKENS_REQUIRED));
        // Set mock completed status
        dispatch(setMockCompleted());
        // Navigate to results
        navigate('/dashboard/result');
        setIsProcessing(false); // Reset processing state
      }, 2000);
      return;
    }

    try {
      // For normal users, process with the real API
      // This would be where you call your processing API

      // Deduct tokens for processing
      dispatch(deductTokens(TOKENS_REQUIRED));

      // Using the mock completion for now since the real API isn't implemented
      setTimeout(() => {
        dispatch(setMockCompleted());
        navigate('/dashboard/result');
        setIsProcessing(false); // Reset processing state
      }, 2000);

    } catch (error) {
      toast({
        title: 'Processing Failed',
        description: 'There was an error processing your request.',
        variant: 'destructive',
      });
      setIsProcessing(false); // Reset processing state
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">What's your expectation?</h1>
        <p className="text-muted-foreground">
          Tell us what kind of response you expect from the personas.
        </p>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="expectation" className="block text-sm font-medium">
                  How should personas respond to your document?
                </label>
                <Textarea
                  id="expectation"
                  placeholder="e.g., Evaluate on a scale from 1-10, Provide pros and cons, Give a yes/no answer..."
                  className="min-h-[100px]"
                  value={localExpectation}
                  onChange={handleInputChange}
                  disabled={isProcessing}
                />
                {expectationError && (
                  <p className="text-sm text-destructive">{expectationError}</p>
                )}
              </div>

              <div className="flex justify-between items-center flex-wrap gap-4 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={isProcessing}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Personas
                </Button>

                <Button
                  type="submit"
                  disabled={!localExpectation.trim() || isProcessing || !hasEnoughTokens}
                >
                  {isProcessing ? (
                    'Processing...'
                  ) : (
                    <>
                      Submit
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Summary of selections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Document</p>
                <p className="font-medium truncate">{fileName}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Personas</p>
                <p className="font-medium">
                  {selectedPersonas.length} selected
                  <span className="text-sm text-muted-foreground ml-2">
                    ({selectedModel})
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Token info */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <p className="text-sm">
            This will use <span className="font-medium">{TOKENS_REQUIRED}</span> tokens
          </p>
          <p className="text-sm">
            Tokens remaining: <span className="font-medium">{tokensLeft}</span>
          </p>
        </div>
      </div>

      {/* Token warning */}
      {!hasEnoughTokens && (
        <div className="mt-4 p-4 bg-destructive/10 border border-destructive rounded-md">
          <p className="text-sm text-destructive">
            You don't have enough tokens to process this request.
            Please <a href="/pricing" className="underline">upgrade your plan</a> to continue.
          </p>
        </div>
      )}
    </div>
  );
}
