
import React, { useState } from 'react';
import { Mic, Type, Globe, Send, Loader2 } from 'lucide-react';
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
  const [inputType, setInputType] = useState<InputType>('text');
  const [inputContent, setInputContent] = useState('');
  const [isListening, setIsListening] = useState(false);

  // Function to handle input type switching
  const switchInputType = (type: InputType) => {
    setInputType(type);
    setInputContent('');
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

    if (inputType === 'url' && !inputContent.match(/^https?:\/\//i)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL starting with http:// or https://.",
        variant: "destructive",
      });
      return;
    }

    onSubmit(inputContent, inputType === 'conversation' ? 'text' : inputType);
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
        <div className="flex border-b" role="tablist" aria-label="Input type selection">
          <button
            role="tab"
            aria-selected={inputType === 'text'}
            aria-controls="text-input-panel"
            id="text-input-tab"
            className={`flex items-center gap-2 px-4 py-3 flex-1 transition-all 
              ${inputType === 'text' 
                ? 'bg-background border-b-2 border-primary font-medium' 
                : 'hover:bg-secondary/50'}`}
            onClick={() => switchInputType('text')}
          >
            <Type size={18} />
            <span>Text</span>
          </button>
          
          <button
            role="tab"
            aria-selected={inputType === 'url'}
            aria-controls="url-input-panel"
            id="url-input-tab"
            className={`flex items-center gap-2 px-4 py-3 flex-1 transition-all 
              ${inputType === 'url' 
                ? 'bg-background border-b-2 border-primary font-medium' 
                : 'hover:bg-secondary/50'}`}
            onClick={() => switchInputType('url')}
          >
            <Globe size={18} />
            <span>URL</span>
          </button>
          
          <button
            role="tab"
            aria-selected={inputType === 'conversation'}
            aria-controls="conversation-input-panel"
            id="conversation-input-tab"
            className={`flex items-center gap-2 px-4 py-3 flex-1 transition-all 
              ${inputType === 'conversation' 
                ? 'bg-background border-b-2 border-primary font-medium' 
                : 'hover:bg-secondary/50'}`}
            onClick={() => switchInputType('conversation')}
          >
            <Mic size={18} />
            <span>Conversation</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div
            role="tabpanel"
            id="text-input-panel"
            aria-labelledby="text-input-tab"
            hidden={inputType !== 'text'}
          >
            <Textarea
              aria-label="Enter text to summarize"
              placeholder="Enter text, paste content, or ask a question..."
              className="min-h-32 mb-4 resize-y"
              value={inputType === 'text' ? inputContent : ''}
              onChange={(e) => setInputContent(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div
            role="tabpanel"
            id="url-input-panel"
            aria-labelledby="url-input-tab"
            hidden={inputType !== 'url'}
          >
            <Input
              type="url"
              aria-label="Enter URL to summarize"
              placeholder="https://example.com/article"
              className="mb-4"
              value={inputType === 'url' ? inputContent : ''}
              onChange={(e) => setInputContent(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div
            role="tabpanel"
            id="conversation-input-panel"
            aria-labelledby="conversation-input-tab"
            hidden={inputType !== 'conversation'}
          >
            <Textarea
              aria-label="Enter conversation text or use voice input"
              placeholder="Type your question or click the microphone button to speak..."
              className="min-h-32 mb-4 resize-y"
              value={inputType === 'conversation' ? inputContent : ''}
              onChange={(e) => setInputContent(e.target.value)}
              disabled={isLoading || isListening}
            />
          </div>

          <div className="flex justify-between">
            {inputType === 'conversation' && (
              <Button
                type="button"
                variant={isListening ? "destructive" : "outline"}
                onClick={toggleSpeechRecognition}
                disabled={isLoading}
                aria-pressed={isListening}
                className="gap-2"
              >
                <Mic size={16} />
                {isListening ? "Stop Listening" : "Start Voice Input"}
              </Button>
            )}
            
            <div className={inputType === 'conversation' ? "ml-auto" : "w-full"}>
              <Button
                type="submit"
                disabled={isLoading || !inputContent.trim()}
                className="w-full gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Summarize</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default InputSection;
