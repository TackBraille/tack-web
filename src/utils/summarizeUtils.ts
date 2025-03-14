
import { SummaryOutput, Source, AIModel } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { getCurrentModel } from './modelUtils';

// Mock function for summarization in this demo
// In a real app, this would connect to the appropriate API
export const summarizeContent = async (content: string, type: 'text' | 'url'): Promise<SummaryOutput> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  try {
    const currentModel = getCurrentModel();
    
    // For URL type, we would fetch the content first in a real implementation
    if (type === 'url') {
      // Here we'd normally fetch the URL content
      console.log(`Fetching content from URL: ${content}`);
      // For now, we'll just pretend we did
    }
    
    // This is just mock data - in a real app this would come from the AI model
    return mockSummarize(content, currentModel);
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

// Simulates AI summarization for demo purposes
const mockSummarize = (content: string, model: AIModel): SummaryOutput => {
  const isUrl = content.startsWith('http');
  
  let mockSummary: string;
  let mockSources: Source[];
  
  if (isUrl) {
    const domain = extractDomain(content);
    mockSummary = `This page discusses key principles of accessible web design and their implementation in modern applications.`;
    
    mockSources = [
      {
        id: '1',
        title: `${domain} - Main Article`,
        briefSummary: "Accessibility principles for developers",
        url: content
      },
      {
        id: '2',
        title: "Web Content Accessibility Guidelines",
        briefSummary: "Official WCAG 2.1 standards",
        url: "https://www.w3.org/WAI/standards-guidelines/wcag/"
      },
      {
        id: '3',
        title: "Aria Best Practices",
        briefSummary: "Implementation patterns for accessibility",
        url: "https://www.w3.org/WAI/ARIA/apg/"
      }
    ];
  } else {
    // For text input
    if (content.length < 30) {
      mockSummary = `Query about ${content} suggests exploring aspects of this topic in relation to accessibility and web design.`;
    } else {
      mockSummary = `The text discusses approaches to creating accessible web interfaces with semantic HTML and ARIA attributes.`;
    }
    
    mockSources = [
      {
        id: '1',
        title: "Accessibility Fundamentals",
        briefSummary: "Core concepts for developers",
        url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility"
      },
      {
        id: '2',
        title: "Screen Reader Compatibility",
        briefSummary: "Best practices for implementation",
        url: "https://webaim.org/techniques/screenreader/"
      }
    ];
  }
  
  return {
    summary: mockSummary,
    sources: mockSources
  };
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
