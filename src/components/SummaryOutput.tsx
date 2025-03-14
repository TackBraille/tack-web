
import React from 'react';
import { SummaryOutput as SummaryType } from '@/types';
import { Button } from '@/components/ui/button';
import { VolumeUp, Copy, Check } from 'lucide-react';
import { readAloud } from '@/utils/summarizeUtils';
import { toast } from '@/components/ui/use-toast';

interface SummaryOutputProps {
  data: SummaryType | null;
}

const SummaryOutput: React.FC<SummaryOutputProps> = ({ data }) => {
  const [copied, setCopied] = React.useState(false);

  // If there's no data, don't render anything
  if (!data || (!data.summary && !data.loading && !data.error)) {
    return null;
  }

  const handleReadAloud = () => {
    if (data.summary) {
      readAloud(data.summary);
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

  return (
    <section 
      className="w-full max-w-3xl mx-auto mb-8"
      aria-labelledby="summary-section-title"
      aria-live="polite"
    >
      <h2 id="summary-section-title" className="text-xl font-semibold mb-3">Summary</h2>
      
      <div className="bg-card shadow-sm border rounded-lg p-6 animate-slide-up">
        {data.loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            <span className="ml-3 text-muted-foreground">Generating summary...</span>
          </div>
        ) : data.error ? (
          <div className="text-destructive py-4" role="alert">
            {data.error}
          </div>
        ) : (
          <>
            <p className="text-lg leading-relaxed mb-4" aria-label="Summary text">
              {data.summary}
            </p>
            
            <div className="flex flex-wrap gap-2 mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={handleReadAloud}
                aria-label="Read summary aloud"
              >
                <VolumeUp size={16} />
                <span>Read Aloud</span>
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={handleCopy}
                aria-label="Copy summary to clipboard"
              >
                {copied ? (
                  <>
                    <Check size={16} />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    <span>Copy</span>
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default SummaryOutput;
