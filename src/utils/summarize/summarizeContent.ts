import { SummaryOutput } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { getCurrentModel } from '../modelUtils';
import { generateMockSources } from './mockSourceUtils';

// Function for real-time summarization using the backend edge function
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
      description: `Please wait while we process your request...`,
    });
    
    // Call the Lovable Cloud edge function
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    
    const response = await fetch(`${supabaseUrl}/functions/v1/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({
        content,
        type,
        model: currentModel,
        history: history.map(h => ({
          originalQuery: h.originalQuery,
          summary: h.summary
        }))
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (response.status === 429) {
        toast({
          title: "Rate limit exceeded",
          description: "Please wait a moment and try again.",
          variant: "destructive",
        });
        throw new Error("Rate limit exceeded");
      }
      
      if (response.status === 402) {
        toast({
          title: "AI credits exhausted",
          description: "Please add funds to continue using AI features.",
          variant: "destructive",
        });
        throw new Error("AI credits exhausted");
      }
      
      throw new Error(errorData.error || `Request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    // For URL inputs, ensure we have at least one source
    if (type === 'url' && (!data.sources || data.sources.length === 0)) {
      data.sources = [{
        id: '1',
        title: 'Provided URL',
        briefSummary: 'A detailed summary of the key information extracted from this website.',
        url: content
      }];
    }
    
    // For text inputs, generate mock sources if none returned
    if (type === 'text' && (!data.sources || data.sources.length === 0)) {
      data.sources = generateMockSources(content);
    }
    
    // Add a small delay to ensure the UI transition looks smooth
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return data;
  } catch (error) {
    console.error('Error summarizing content:', error);
    toast({
      title: "Response generation failed",
      description: error instanceof Error ? error.message : "Unable to generate a response. Please try again.",
      variant: "destructive",
    });
    throw error;
  }
};
