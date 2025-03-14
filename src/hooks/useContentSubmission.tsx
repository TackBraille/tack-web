
import { useState } from 'react';
import { SummaryOutput } from '@/types';
import { summarizeContent } from '@/utils/summarizeUtils';
import { toast } from '@/components/ui/use-toast';

interface UseContentSubmissionProps {
  currentSessionId: string | null;
  createNewSession: () => void;
  updateSessionAfterResponse: (result: SummaryOutput) => void;
  history: SummaryOutput[];
}

export function useContentSubmission({ 
  currentSessionId, 
  createNewSession, 
  updateSessionAfterResponse,
  history
}: UseContentSubmissionProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (content: string, type: 'text' | 'url') => {
    setIsLoading(true);
    updateSessionAfterResponse({ summary: '', sources: [], loading: true, originalQuery: content });
    
    try {
      // Create a new session if we don't have one
      if (!currentSessionId) {
        createNewSession();
      }
      
      // Pass the current conversation history for context
      const result = await summarizeContent(content, type, history);
      
      // Update the history and current session
      updateSessionAfterResponse({...result, originalQuery: content});
      
      toast({
        title: 'Response generated',
        description: 'Your query has been successfully answered.',
      });
    } catch (error) {
      console.error('Error generating summary:', error);
      updateSessionAfterResponse({
        summary: '',
        sources: [],
        error: 'Failed to generate response. Please try again.',
        originalQuery: content
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleSubmit
  };
}
