
import React from 'react';
import { Source } from '@/types';
import { Button } from '@/components/ui/button';
import { ExternalLink, VolumeUp } from 'lucide-react';
import { readAloud } from '@/utils/summarizeUtils';

interface SourceListProps {
  sources: Source[];
  loading?: boolean;
}

const SourceList: React.FC<SourceListProps> = ({ sources, loading }) => {
  // If there are no sources and not loading, don't render anything
  if (sources.length === 0 && !loading) {
    return null;
  }

  const handleReadAloudSource = (title: string, summary: string) => {
    readAloud(`Source: ${title}. ${summary}`);
  };

  return (
    <section 
      className="w-full max-w-3xl mx-auto mb-8"
      aria-labelledby="sources-section-title"
    >
      <h2 id="sources-section-title" className="text-xl font-semibold mb-3">Sources</h2>
      
      <div className="bg-card shadow-sm border rounded-lg animate-slide-up">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            <span className="ml-3 text-muted-foreground">Loading sources...</span>
          </div>
        ) : (
          <ul className="divide-y">
            {sources.map((source) => (
              <li key={source.id} className="p-4 transition-colors hover:bg-accent/30">
                <article aria-labelledby={`source-${source.id}-title`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 
                        id={`source-${source.id}-title`} 
                        className="font-medium text-lg"
                      >
                        {source.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">{source.briefSummary}</p>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleReadAloudSource(source.title, source.briefSummary)}
                        aria-label={`Read aloud source: ${source.title}`}
                        title="Read aloud"
                      >
                        <VolumeUp size={18} />
                      </Button>
                      
                      {source.url && (
                        <Button 
                          variant="ghost" 
                          size="icon"
                          asChild
                        >
                          <a 
                            href={source.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            aria-label={`Visit source: ${source.title}`}
                            title="Open source"
                          >
                            <ExternalLink size={18} />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default SourceList;
