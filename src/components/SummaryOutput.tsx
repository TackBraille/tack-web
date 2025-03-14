
import React from 'react';
import { SummaryOutput as SummaryType } from '@/types';
import { Button } from '@/components/ui/button';
import { Volume, Copy, Check } from 'lucide-react';
import { readAloud } from '@/utils/summarizeUtils';
import { toast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import SourceList from './SourceList';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SummaryOutputProps {
  data: SummaryType | null;
}

const SummaryOutput: React.FC<SummaryOutputProps> = ({ data }) => {
  const [copied, setCopied] = React.useState(false);
  const [isReading, setIsReading] = React.useState(false);

  if (!data || (!data.summary && !data.loading && !data.error)) {
    return null;
  }

  const handleReadAloud = () => {
    if (data.summary) {
      if (isReading) {
        // Stop reading if currently reading
        window.speechSynthesis.cancel();
        setIsReading(false);
        toast({
          title: "Reading stopped",
          description: "Text-to-speech has been stopped.",
        });
      } else {
        // Start reading
        readAloud(data.summary);
        setIsReading(true);
        toast({
          title: "Reading aloud",
          description: "Text is being read aloud. Click the button again to stop.",
        });
        
        // Add event listener to detect when speech has finished
        const handleSpeechEnd = () => {
          setIsReading(false);
        };
        
        window.speechSynthesis.addEventListener('end', handleSpeechEnd, { once: true });
        
        // Safety timeout in case the end event doesn't fire
        setTimeout(() => {
          if (setIsReading) {
            setIsReading(false);
          }
        }, (data.summary.length / 5) * 1000); // Approximate reading time
      }
    }
  };

  const handleCopy = () => {
    if (data.summary) {
      navigator.clipboard.writeText(data.summary)
        .then(() => {
          setCopied(true);
          toast({
            title: "Copied to clipboard",
            description: "Summary text has been copied to your clipboard.",
          });
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(() => {
          toast({
            title: "Copy failed",
            description: "Unable to copy to clipboard. Please try again.",
            variant: "destructive",
          });
        });
    }
  };

  // Display model used if available
  const modelInfo = data.modelUsed ? (
    <Badge variant="outline" className="ml-auto text-xs">
      Model: {data.modelUsed}
    </Badge>
  ) : null;

  return (
    <>
      <section 
        className="w-full max-w-3xl mx-auto mb-8"
        aria-labelledby="summary-section-title"
        aria-live="polite"
      >
        <div className="flex items-center mb-3">
          <h2 id="summary-section-title" className="text-xl font-semibold">AI Response</h2>
          {modelInfo}
        </div>
        
        <div className="bg-card shadow-sm border rounded-lg p-6 animate-slide-up">
          {data.loading ? (
            <div className="flex items-center justify-center py-8" aria-live="assertive">
              <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" aria-hidden="true"></div>
              <span className="ml-3 text-muted-foreground">Generating response...</span>
            </div>
          ) : data.error ? (
            <div className="text-destructive py-4" role="alert">
              {data.error}
            </div>
          ) : (
            <>
              <div className="prose prose-zinc dark:prose-invert max-w-none mb-4" aria-label="AI generated summary">
                <p className="text-lg leading-relaxed">{data.summary}</p>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className={`gap-2 ${isReading ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'} transition-colors`}
                        onClick={handleReadAloud}
                        aria-label={isReading ? "Stop reading aloud" : "Read summary aloud using text-to-speech"}
                      >
                        <Volume size={16} aria-hidden="true" />
                        <span>{isReading ? "Stop Reading" : "Read Aloud"}</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isReading ? "Stop text-to-speech" : "Read text aloud"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-2 bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        onClick={handleCopy}
                        aria-label="Copy summary to clipboard"
                      >
                        {copied ? (
                          <>
                            <Check size={16} aria-hidden="true" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy size={16} aria-hidden="true" />
                            <span>Copy</span>
                          </>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Copy to clipboard</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </>
          )}
        </div>
      </section>
      
      {/* Display sources with the SourceList component */}
      {data?.sources && data.sources.length > 0 && (
        <SourceList sources={data.sources} loading={data.loading} />
      )}
    </>
  );
};

export default SummaryOutput;
