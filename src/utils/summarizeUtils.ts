
import { SummaryOutput, Source, AIModel } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { getCurrentModel } from './modelUtils';

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

// Helper function to extract domain from URL
export const extractDomain = (url: string): string => {
  try {
    const domain = new URL(url).hostname;
    return domain;
  } catch {
    return url;
  }
};

// Improved function to read text aloud with better voice selection and error handling
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
  
  // Use a voice that's available - load voices if needed
  let voices = window.speechSynthesis.getVoices();
  
  // If voices aren't loaded yet, wait for them
  if (voices.length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      voices = window.speechSynthesis.getVoices();
      selectVoiceAndSpeak();
    };
  } else {
    selectVoiceAndSpeak();
  }
  
  function selectVoiceAndSpeak() {
    // Try to find a good English voice with preference for natural sounding ones
    const preferredVoices = [
      // Look for high-quality voices first
      voices.find(v => v.name.includes('Google') && v.lang.includes('en')),
      voices.find(v => v.name.includes('Microsoft') && v.lang.includes('en')),
      voices.find(v => v.name.includes('Apple') && v.lang.includes('en')),
      // Then any English voice
      voices.find(v => v.lang.includes('en') && v.localService),
      voices.find(v => v.lang.includes('en')),
      // Finally any voice
      voices[0]
    ];
    
    // Use the first available voice from our preferences
    const selectedVoice = preferredVoices.find(v => v);
    if (selectedVoice) utterance.voice = selectedVoice;
    
    // Add error handling
    utterance.onerror = (event) => {
      console.error('Text-to-speech error:', event);
      toast({
        title: "Text-to-speech error",
        description: "There was an error while reading the text aloud.",
        variant: "destructive",
      });
    };
    
    window.speechSynthesis.speak(utterance);
  }
};
