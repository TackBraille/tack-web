
import { useState } from 'react';
import { SummaryOutput } from '@/types';
import { summarizeContent } from '@/utils/summarize';
import { toast } from '@/components/ui/use-toast';
import { getCurrentModel, getCurrentSubModel } from '@/utils/modelUtils';

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
    if (!content.trim()) {
      toast({
        title: "Empty query",
        description: "Please enter a question or URL to analyze.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    // Show loading state in the UI
    updateSessionAfterResponse({ 
      summary: '', 
      sources: [], 
      loading: true, 
      originalQuery: content,
      // Add a loading message that's accessible to screen readers
      error: 'Loading response... Please wait.' 
    });
    
    try {
      // Create a new session if we don't have one
      if (!currentSessionId) {
        createNewSession();
      }
      
      // Get the currently selected model
      const selectedModel = getCurrentModel();
      const selectedSubModel = getCurrentSubModel();
      const modelToUse = selectedSubModel || selectedModel;
      
      // Pass the current conversation history and model for context
      const result = await summarizeContent(content, type, history, modelToUse);
      
      // Update the history and current session
      updateSessionAfterResponse({...result, originalQuery: content});
      
      toast({
        title: 'Response generated',
        description: `Your query has been successfully answered using ${selectedModel}.`,
      });

      // Announce to screen readers that content has loaded
      const announcement = document.getElementById('live-region');
      if (announcement) {
        announcement.textContent = 'Response loaded. New content is available.';
        // Clear after announcement is read
        setTimeout(() => {
          announcement.textContent = '';
        }, 1000);
      }
    } catch (error) {
      console.error('Error generating summary:', error);
      updateSessionAfterResponse({
        summary: '',
        sources: [],
        error: 'Failed to generate response. Please try again.',
        originalQuery: content
      });

      toast({
        title: 'Error',
        description: 'Failed to generate a response. Please try again.',
        variant: 'destructive',
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
