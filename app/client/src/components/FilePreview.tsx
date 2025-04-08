import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { ChevronLeft, ChevronRight, Download, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

// Set up the PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface FilePreviewProps {
  fileUrl: string;
  fileName: string;
  fileType: string;
}

const FilePreview: React.FC<FilePreviewProps> = ({ fileUrl, fileName, fileType }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [fullScreen, setFullScreen] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    setLoading(true);
    setError(null);
    setPageNumber(1);
    setNumPages(null);
  }, [fileUrl]);

  // Handle PDF document loading
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('Failed to load PDF:', error);
    setError('Failed to load the PDF document. Please check if the file is valid.');
    setLoading(false);
  };

  // Navigation functions
  const goToPrevPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  const goToNextPage = () => {
    if (numPages && pageNumber < numPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  // Determine if the file is a PDF
  const isPdf = fileType === 'application/pdf';

  // Handle file download
  const handleDownload = () => {
    try {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast({
        title: 'Download Failed',
        description: 'Failed to download the file. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Toggle fullscreen mode
  const toggleFullScreen = () => {
    setFullScreen(!fullScreen);
  };

  // Render text file content
  const renderTextPreview = () => {
    return (
      <iframe
        src={fileUrl}
        title={fileName}
        className="w-full h-[500px] border rounded"
      />
    );
  };

  // Render file preview based on type
  const renderPreview = () => {
    if (loading) {
      return <div className="flex justify-center py-10">Loading document...</div>;
    }

    if (error) {
      return <div className="text-destructive py-10">{error}</div>;
    }

    if (isPdf) {
      return (
        <div className={`pdf-container ${fullScreen ? 'fixed inset-0 z-50 bg-background p-4' : ''}`}>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              {numPages && (
                <div className="text-sm">
                  Page {pageNumber} of {numPages}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={goToPrevPage} disabled={pageNumber <= 1}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={goToNextPage} disabled={!numPages || pageNumber >= numPages}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={toggleFullScreen}>
                {fullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className={`pdf-document-container ${fullScreen ? 'h-[calc(100vh-120px)]' : 'h-[500px]'} overflow-auto`}>
            <Document
              file={fileUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={<div className="flex justify-center py-10">Loading document...</div>}
              error={<div className="text-destructive py-10">Failed to load PDF. Please check if the file is valid.</div>}
            >
              <Page pageNumber={pageNumber} width={fullScreen ? undefined : 600} />
            </Document>
          </div>
        </div>
      );
    }

    // For other file types like text, docx, xlsx
    if (fileType.includes('text/plain')) {
      return renderTextPreview();
    }

    // For other file types, show download option
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-4">
        <p>Preview not available for this file type.</p>
        <Button onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
      </div>
    );
  };

  return (
    <Card className={fullScreen ? 'fixed inset-0 z-50 rounded-none' : ''}>
      <CardContent className={`p-6 ${fullScreen ? 'h-full' : ''}`}>
        <div className="mb-4">
          <h3 className="text-lg font-medium">{fileName}</h3>
          <p className="text-sm text-muted-foreground">{fileType}</p>
        </div>
        {renderPreview()}
      </CardContent>
    </Card>
  );
};

export default FilePreview;
