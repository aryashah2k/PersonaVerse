import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CheckCircle, Download, Loader2, FileSpreadsheet, Users, MessageSquare, Home } from 'lucide-react';

// Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

// Selectors
import {
  selectFileName
} from '@/store/slices/fileSlice';
import {
  selectPersonasById,
  selectSelectedPersonas,
  selectSelectedModel,
  resetPersonaSelections
} from '@/store/slices/personaSlice';
import {
  selectIsProcessing,
  selectProcessingSuccess,
  selectProcessingError,
  selectResultUrl,
  selectExpectation,
  resetProcessState
} from '@/store/slices/processSlice';
import { resetFileState } from '@/store/slices/fileSlice';
import { AppDispatch } from '@/store';

export default function ResultPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Selectors
  const fileName = useSelector(selectFileName);
  const selectedPersonaIds = useSelector(selectSelectedPersonas);
  const selectedPersonas = useSelector((state) => selectPersonasById(state, selectedPersonaIds));
  const selectedModel = useSelector(selectSelectedModel);
  const expectation = useSelector(selectExpectation);
  const isProcessing = useSelector(selectIsProcessing);
  const processingSuccess = useSelector(selectProcessingSuccess);
  const processingError = useSelector(selectProcessingError);
  const resultUrl = useSelector(selectResultUrl);

  // Mock progress state for UI animation
  const [progress, setProgress] = useState(0);

  // Simulate progress during processing
  useEffect(() => {
    if (isProcessing) {
      const timer = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(timer);
            return 100;
          }
          return prevProgress + 5;
        });
      }, 200);

      return () => {
        clearInterval(timer);
      };
    }
  }, [isProcessing]);

  // Handle download
  const handleDownload = () => {
    // In a real app, this would use the actual result URL
    window.open(resultUrl || 'https://example.com/mock-result.xlsx', '_blank');
  };

  // Start over - reset all state and go back to home
  const handleStartOver = () => {
    dispatch(resetFileState());
    dispatch(resetPersonaSelections());
    dispatch(resetProcessState());
    navigate('/dashboard');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 text-center">
        {isProcessing ? (
          <>
            <h1 className="text-3xl font-bold mb-2">Processing Your Request</h1>
            <p className="text-muted-foreground">
              Please wait while we analyze your document with the selected personas.
            </p>
          </>
        ) : processingSuccess ? (
          <>
            <h1 className="text-3xl font-bold mb-2">Processing Complete!</h1>
            <p className="text-muted-foreground">
              Your document has been analyzed with the selected personas.
            </p>
          </>
        ) : processingError ? (
          <>
            <h1 className="text-3xl font-bold mb-2 text-destructive">Processing Failed</h1>
            <p className="text-muted-foreground">
              There was an error processing your document. Please try again.
            </p>
          </>
        ) : null}
      </div>

      {/* Processing indicator */}
      {isProcessing && (
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <h3 className="text-lg font-medium mb-4">Processing...</h3>
              <Progress value={progress} className="w-full mb-2" />
              <p className="text-sm text-muted-foreground">{progress}% complete</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success card */}
      {processingSuccess && (
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-lg font-medium mb-4">Ready to Download</h3>
              <p className="text-center text-muted-foreground mb-6">
                Your analysis is ready. Click the button below to download your Excel file.
              </p>
              <Button className="w-full sm:w-auto" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download Excel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error card */}
      {processingError && (
        <Card className="mb-8 border-destructive">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-destructive/10 p-3 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-destructive h-6 w-6"
                >
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                  <path d="m15 9-6 6"></path>
                  <path d="m9 9 6 6"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-4">Processing Failed</h3>
              <p className="text-center text-muted-foreground mb-6">
                {processingError || 'There was an error processing your request. Please try again.'}
              </p>
              <Button variant="outline" className="w-full sm:w-auto" onClick={handleStartOver}>
                Start Over
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary card */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-medium text-lg mb-4">Request Summary</h3>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <FileSpreadsheet className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="font-medium">Document</p>
                <p className="text-sm text-muted-foreground truncate">{fileName}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-purple-500 mt-0.5" />
              <div>
                <p className="font-medium">Personas</p>
                <p className="text-sm text-muted-foreground">
                  {selectedPersonas.length} selected
                  <span className="ml-2">({selectedModel})</span>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MessageSquare className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Expected Response</p>
                <p className="text-sm text-muted-foreground">{expectation}</p>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="px-6 pb-6 pt-0 flex justify-end">
          <Button variant="outline" onClick={handleStartOver}>
            <Home className="mr-2 h-4 w-4" />
            Start New Request
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
