
import React from 'react';
import { Source } from '@/types';
import { Button } from '@/components/ui/button';
import { ExternalLink, Volume, FileText, Globe, Link, Book, University, Award, BookOpen } from 'lucide-react';
import { readAloud } from '@/utils/summarizeUtils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { extractDomain } from '@/utils/summarizeUtils';
import { toast } from '@/components/ui/use-toast';

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
    toast({
      title: "Reading source summary",
      description: `Reading summary for: ${title}`
    });
  };

  // Get appropriate icon for source
  const getSourceIcon = (source: Source) => {
    if (!source.url) return <FileText size={16} className="text-primary" aria-hidden="true" />;
    
    const url = source.url.toLowerCase();
    
    if (url.includes('wikipedia')) {
      return <BookOpen size={16} className="text-primary" aria-hidden="true" />;
    } else if (url.includes('asu.edu') || url.includes('arizona') || url.includes('.edu')) {
      return <University size={16} className="text-primary" aria-hidden="true" />;
    } else if (url.includes('usnews') || url.includes('ranking') || url.includes('timeshighereducation')) {
      return <Award size={16} className="text-primary" aria-hidden="true" />;
    } else {
      return <Globe size={16} className="text-primary" aria-hidden="true" />;
    }
  };

  return (
    <section 
      className="w-full max-w-3xl mx-auto mb-8 animate-fade-in"
      aria-labelledby="sources-section-title"
    >
      <Card className="border-primary/20 shadow-md">
        <CardHeader className="bg-primary/5 pb-2">
          <CardTitle id="sources-section-title" className="text-xl font-semibold flex items-center gap-2">
            <Book size={20} className="text-primary" aria-hidden="true" />
            Sources & References
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="max-h-[600px] md:max-h-[800px] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8" aria-live="polite">
                <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                <span className="ml-3 text-muted-foreground">Loading sources...</span>
              </div>
            ) : (
              <ul className="divide-y">
                {sources.map((source) => (
                  <li key={source.id} className="p-5 transition-colors hover:bg-accent/30">
                    <article aria-labelledby={`source-${source.id}-title`} className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            {getSourceIcon(source)}
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
                          
                          <p className="text-muted-foreground text-base leading-relaxed mb-3">{source.briefSummary}</p>
                        </div>
                        
                        <div className="flex gap-2 ml-4 flex-shrink-0">
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
                                <p>Read aloud source summary</p>
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
                        {source.url && source.url.includes('.edu') && (
                          <Badge variant="outline" className="text-xs bg-blue-100 dark:bg-blue-900/20">
                            <University size={12} className="mr-1" />
                            University
                          </Badge>
                        )}
                        {source.url && source.url.includes('wikipedia') && (
                          <Badge variant="outline" className="text-xs">
                            <BookOpen size={12} className="mr-1" />
                            Encyclopedia
                          </Badge>
                        )}
                        {source.url && (source.url.includes('usnews') || source.url.includes('ranking')) && (
                          <Badge variant="outline" className="text-xs bg-amber-100 dark:bg-amber-900/20">
                            <Award size={12} className="mr-1" />
                            Rankings
                          </Badge>
                        )}
                        {source.url && !(
                          source.url.includes('.edu') || 
                          source.url.includes('wikipedia') || 
                          source.url.includes('usnews') || 
                          source.url.includes('ranking')
                        ) && (
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
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default SourceList;

