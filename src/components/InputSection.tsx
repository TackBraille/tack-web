
import React, { useState } from 'react';
import { Mic, Globe, Send, Loader2, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { InputType } from '@/types';
import { toast } from '@/components/ui/use-toast';

interface InputSectionProps {
  onSubmit: (content: string, type: 'text' | 'url') => void;
  isLoading: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({ onSubmit, isLoading }) => {
  const [inputContent, setInputContent] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [detectedType, setDetectedType] = useState<InputType>('text');

  // Function to detect input type
  const detectInputType = (content: string): InputType => {
    // Check if it's a URL
    if (content.match(/^https?:\/\//i)) {
      return 'url';
    }
    // Default to text
    return 'text';
  };

  // Handle input change
  const handleInputChange = (value: string) => {
    setInputContent(value);
    setDetectedType(detectInputType(value));
  };

  // Function to handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputContent.trim()) {
      toast({
        title: "Empty input",
        description: "Please enter text or a URL before submitting.",
        variant: "destructive",
      });
      return;
    }

    if (detectedType === 'url' && !inputContent.match(/^https?:\/\//i)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL starting with http:// or https://.",
        variant: "destructive",
      });
      return;
    }

    onSubmit(inputContent, detectedType);
  };

  // Function to handle speech-to-text
  const toggleSpeechRecognition = () => {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      toast({
        title: "Speech recognition unavailable",
        description: "Your browser doesn't support speech recognition.",
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      // Stop listening logic would go here
      setIsListening(false);
      toast({
        title: "Voice input stopped",
        description: "Speech recognition has been stopped.",
      });
      return;
    }

    // This is a mock implementation - in a real app we'd use the Web Speech API
    setIsListening(true);
    toast({
      title: "Listening...",
      description: "Speak now. Voice recognition is active.",
    });

    // Simulate receiving speech after 3 seconds
    setTimeout(() => {
      const mockRecognizedText = "How to implement accessible web applications using ARIA";
      setInputContent(prevContent => 
        prevContent + (prevContent ? ' ' : '') + mockRecognizedText
      );
      setIsListening(false);
      toast({
        title: "Voice input received",
        description: "Your speech has been converted to text.",
      });
    }, 3000);
  };

  return (
    <section 
      className="w-full max-w-3xl mx-auto mb-8 animate-fade-in"
      aria-labelledby="input-section-title"
    >
      <h2 id="input-section-title" className="sr-only">Input Section</h2>
      
      <div className="bg-card shadow-sm border rounded-lg overflow-hidden transition-all duration-300">
        <form onSubmit={handleSubmit} className="p-4">
          <div className="relative">
            <Textarea
              aria-label="Enter text, URL, or question"
              placeholder="Enter text, paste a URL, or ask a question..."
              className="min-h-32 mb-4 resize-y pr-10"
              value={inputContent}
              onChange={(e) => handleInputChange(e.target.value)}
              disabled={isLoading || isListening}
            />
            
            {/* Input type indicator */}
            <div className="absolute top-2 right-2">
              {detectedType === 'url' ? (
                <Globe size={16} className="text-primary" aria-hidden="true" title="URL detected" />
              ) : (
                <Type size={16} className="text-muted-foreground" aria-hidden="true" title="Text input" />
              )}
            </div>
          </div>

          <div className="flex justify-between">
            <Button
              type="button"
              variant={isListening ? "destructive" : "outline"}
              onClick={toggleSpeechRecognition}
              disabled={isLoading}
              aria-pressed={isListening}
              className="gap-2"
            >
              <Mic size={16} aria-hidden="true" />
              <span className="sr-only md:not-sr-only md:inline-block">
                {isListening ? "Stop Listening" : "Voice Input"}
              </span>
            </Button>
            
            <Button
              type="submit"
              disabled={isLoading || !inputContent.trim()}
              className="gap-2 ml-2 flex-1 md:flex-none md:min-w-32"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Send size={16} aria-hidden="true" />
                  <span>{detectedType === 'url' ? 'Analyze URL' : 'Submit'}</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default InputSection;
