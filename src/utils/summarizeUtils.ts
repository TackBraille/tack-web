
import { SummaryOutput, Source, AIModel } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { getCurrentModel } from './modelUtils';

// Mock function for summarization in this demo
// In a real app, this would connect to the appropriate API
export const summarizeContent = async (content: string, type: 'text' | 'url'): Promise<SummaryOutput> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  try {
    const currentModel = getCurrentModel();
    
    // For URL type, we would fetch the content first in a real implementation
    if (type === 'url') {
      // Here we'd normally fetch the URL content
      console.log(`Fetching content from URL: ${content}`);
      // For now, we'll just pretend we did
    }
    
    // In a real implementation, we would call the Perplexity API like:
    /*
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: 'Provide a concise answer with relevant sources.'
          },
          {
            role: 'user',
            content: content
          }
        ],
        temperature: 0.2,
        top_p: 0.9,
        max_tokens: 1000,
        return_related_questions: true,
        search_domain_filter: [],
        search_recency_filter: 'month',
        frequency_penalty: 1,
        presence_penalty: 0
      }),
    });
    
    const data = await response.json();
    */
    
    // This is just mock data - in a real app this would come from the Perplexity API
    return mockPerplexitySummarize(content, currentModel);
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

// Simulates Perplexity AI summarization for demo purposes
const mockPerplexitySummarize = (content: string, model: AIModel): SummaryOutput => {
  const isUrl = content.startsWith('http');
  
  let mockSummary: string;
  let mockSources: Source[];
  let relatedQuestions: string[] = [];
  
  if (isUrl) {
    const domain = extractDomain(content);
    mockSummary = `Web accessibility refers to the inclusive practice of making websites usable by people of all abilities and disabilities. This includes providing semantic HTML structure, proper ARIA attributes, keyboard navigation, and ensuring content is perceivable by screen readers. The WCAG guidelines provide standards for creating accessible web content across four main principles: perceivable, operable, understandable, and robust.`;
    
    mockSources = [
      {
        id: '1',
        title: `${domain} - Web Accessibility Fundamentals`,
        briefSummary: "Accessibility principles for developers",
        url: content
      },
      {
        id: '2',
        title: "Web Content Accessibility Guidelines (WCAG) 2.1",
        briefSummary: "Official accessibility standards",
        url: "https://www.w3.org/WAI/standards-guidelines/wcag/"
      },
      {
        id: '3',
        title: "MDN Web Docs: Accessibility",
        briefSummary: "Mozilla's accessibility documentation",
        url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility"
      },
      {
        id: '4',
        title: "WAI-ARIA Authoring Practices",
        briefSummary: "Implementation patterns for accessibility",
        url: "https://www.w3.org/WAI/ARIA/apg/"
      }
    ];
    
    relatedQuestions = [
      "What are the four main principles of WCAG?",
      "How do I make images accessible to screen readers?",
      "What is the difference between WCAG 2.0 and 2.1?",
      "How can I test my website for accessibility issues?"
    ];
  } else {
    // For text input - more like a chat query
    if (content.length < 30) {
      mockSummary = `Web accessibility is about ensuring websites and applications are usable by people with disabilities, including those using screen readers, keyboard navigation, or other assistive technologies. Key practices include providing alternative text for images, ensuring proper color contrast, using semantic HTML, implementing ARIA attributes, and supporting keyboard navigation. Following the Web Content Accessibility Guidelines (WCAG) helps create inclusive web experiences that work for everyone.`;
    } else {
      mockSummary = `${content} relates to web accessibility, which is the practice of making websites usable by people with all abilities and disabilities. This includes providing semantic HTML structure with proper heading levels, descriptive alt text for images, sufficient color contrast, keyboard navigation support, and appropriate ARIA attributes when native HTML semantics aren't available. Screen readers and other assistive technologies rely on these implementations to provide usable experiences to users with disabilities.`;
    }
    
    mockSources = [
      {
        id: '1',
        title: "W3C Web Accessibility Initiative (WAI)",
        briefSummary: "Standards and support resources",
        url: "https://www.w3.org/WAI/"
      },
      {
        id: '2',
        title: "WebAIM: Web Accessibility In Mind",
        briefSummary: "Practical accessibility resources",
        url: "https://webaim.org/"
      },
      {
        id: '3',
        title: "The A11Y Project",
        briefSummary: "Community-driven accessibility effort",
        url: "https://www.a11yproject.com/"
      },
      {
        id: '4',
        title: "Deque University",
        briefSummary: "Accessibility training and resources",
        url: "https://dequeuniversity.com/"
      }
    ];
    
    relatedQuestions = [
      "What are the most common accessibility issues?",
      "How do I make my forms accessible?",
      "What tools can I use to test accessibility?",
      "Are there keyboard shortcuts for accessibility testing?"
    ];
  }
  
  return {
    summary: mockSummary,
    sources: mockSources,
    relatedQuestions: relatedQuestions
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
