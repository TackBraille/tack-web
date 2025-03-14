
import { SummaryOutput, Source, AIModel } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { getCurrentModel } from './modelUtils';

// Function for real-time summarization using the backend API
export const summarizeContent = async (content: string, type: 'text' | 'url'): Promise<SummaryOutput> => {
  try {
    const currentModel = getCurrentModel();
    
    // Show loading toast
    toast({
      title: "Generating summary",
      description: "Please wait while we process your request...",
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
        model: currentModel
      }),
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    // Add a small delay to ensure the UI transition looks smooth
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return data;
  } catch (error) {
    console.error('Error summarizing content:', error);
    toast({
      title: "Summarization failed",
      description: "Unable to summarize the content. Please try again.",
      variant: "destructive",
    });
    throw error;
  }
};

// Helper function to extract domain from URL
export const extractDomain = (url: string): string => {
  try {
    const domain = new URL(url).hostname;
    return domain;
  } catch {
    return url;
  }
};

// Function to read text aloud
export const readAloud = (text: string): void => {
  if (!window.speechSynthesis) {
    toast({
      title: "Text-to-speech unavailable",
      description: "Your browser doesn't support text-to-speech functionality.",
      variant: "destructive",
    });
    return;
  }
  
  // Cancel any ongoing speech
  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  
  // Use a voice that's available
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    // Try to find a good English voice
    const englishVoice = voices.find(voice => 
      voice.lang.includes('en') && voice.localService
    );
    if (englishVoice) utterance.voice = englishVoice;
  }
  
  window.speechSynthesis.speak(utterance);
  
  toast({
    title: "Reading aloud",
    description: "Text is being read aloud. Use browser controls to stop.",
  });
};
