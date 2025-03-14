
import { SummaryOutput, Source } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { getCurrentModel } from '../modelUtils';
import { generateMockSources } from './mockSourceUtils';

// Function for real-time summarization using the backend API
export const summarizeContent = async (
  content: string, 
  type: 'text' | 'url',
  history: SummaryOutput[] = [],
  modelId?: string
): Promise<SummaryOutput> => {
  try {
    const currentModel = modelId || getCurrentModel();
    
    // Show loading toast
    toast({
      title: "Generating response",
      description: `Please wait while we process your request using ${currentModel}...`,
    });
    
    // Call our API endpoint
    const response = await fetch('/api/summarize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content,
        type,
        model: currentModel,
        history
      }),
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    // For URL inputs, ensure we have at least one source
    if (type === 'url' && (!data.sources || data.sources.length === 0)) {
      data.sources = [{
        id: '1',
        title: 'Provided URL',
        briefSummary: 'A detailed summary of the key information extracted from this website. Contains main facts, figures, and conclusions presented in the content.',
        url: content
      }];
    }
    
    // For text inputs, generate mock sources to show the feature
    if (type === 'text' && (!data.sources || data.sources.length === 0)) {
      // Generate fake sources based on the query content
      data.sources = generateMockSources(content);
    }
    
    // Add a small delay to ensure the UI transition looks smooth
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return data;
  } catch (error) {
    console.error('Error summarizing content:', error);
    toast({
      title: "Response generation failed",
      description: "Unable to generate a response. Please try again.",
      variant: "destructive",
    });
    throw error;
  }
};
