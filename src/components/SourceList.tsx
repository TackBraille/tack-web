
import React from 'react';
import { Source } from '@/types';
import { Button } from '@/components/ui/button';
import { ExternalLink, Volume, FileText, Globe, Link } from 'lucide-react';
import { readAloud } from '@/utils/summarizeUtils';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { extractDomain } from '@/utils/summarizeUtils';

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
      
      <Card>
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
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {source.url ? (
                          <Globe size={16} className="text-primary" aria-hidden="true" />
                        ) : (
                          <FileText size={16} className="text-primary" aria-hidden="true" />
                        )}
                        <h3 
                          id={`source-${source.id}-title`} 
                          className="font-medium text-lg"
                        >
                          {source.title}
                        </h3>
                      </div>
                      
                      {source.url && (
                        <div className="flex items-center mt-1 mb-2">
                          <Link size={14} className="text-muted-foreground mr-1" aria-hidden="true" />
                          <span className="text-xs text-muted-foreground truncate max-w-[90%]">
                            {extractDomain(source.url)}
                          </span>
                        </div>
                      )}
                      
                      <p className="text-muted-foreground text-sm">{source.briefSummary}</p>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleReadAloudSource(source.title, source.briefSummary)}
                              aria-label={`Read aloud source: ${source.title}`}
                              className="bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors border-secondary-foreground/20"
                            >
                              <Volume size={18} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Read aloud</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      {source.url && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="icon"
                                asChild
                                className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors border-primary/20"
                              >
                                <a 
                                  href={source.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  aria-label={`Visit source: ${source.title}`}
                                >
                                  <ExternalLink size={18} />
                                </a>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Open source website</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {source.url && (
                      <Badge variant="outline" className="text-xs">
                        <Globe size={12} className="mr-1" />
                        Website
                      </Badge>
                    )}
                    {source.id && (
                      <Badge variant="secondary" className="text-xs">
                        Source #{source.id}
                      </Badge>
                    )}
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </section>
  );
};

export default SourceList;
