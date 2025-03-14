
import React from 'react';
import { SummaryOutput as SummaryType } from '@/types';
import { Button } from '@/components/ui/button';
import { Volume, Copy, Check } from 'lucide-react';
import { readAloud } from '@/utils/summarizeUtils';
import { toast } from '@/components/ui/use-toast';

interface SummaryOutputProps {
  data: SummaryType | null;
}

const SummaryOutput: React.FC<SummaryOutputProps> = ({ data }) => {
  const [copied, setCopied] = React.useState(false);

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
      <h2 id="summary-section-title" className="text-xl font-semibold mb-3">AI Response</h2>
      
      <div className="bg-card shadow-sm border rounded-lg p-6 animate-slide-up">
        {data.loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            <span className="ml-3 text-muted-foreground">Generating response...</span>
          </div>
        ) : data.error ? (
          <div className="text-destructive py-4" role="alert">
            {data.error}
          </div>
        ) : (
          <>
            <div className="prose prose-zinc dark:prose-invert max-w-none mb-4" aria-label="Summary text">
              <p className="text-lg leading-relaxed">{data.summary}</p>
              
              {data.sources && data.sources.length > 0 && (
                <div className="border-t pt-4 mt-6">
                  <h3 className="text-base font-medium mb-2">Sources</h3>
                  <ol className="list-decimal pl-5 space-y-1 text-sm text-muted-foreground">
                    {data.sources.map((source, index) => (
                      <li key={source.id || index}>
                        <a 
                          href={source.url} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline text-primary"
                        >
                          {source.title}
                        </a>
                        {source.briefSummary && (
                          <span className="ml-1 text-muted-foreground">— {source.briefSummary}</span>
                        )}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={handleReadAloud}
                aria-label="Read summary aloud"
              >
                <Volume size={16} />
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
