
import { toast } from '@/components/ui/use-toast';

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
  
  // For long text, split it into manageable chunks
  const maxChunkLength = 250; // Maximum characters per chunk
  let textChunks = [];
  
  if (text.length > maxChunkLength) {
    // Split on sentences to avoid cutting in the middle of sentences
    const sentences = text.split(/(?<=\.|\?|\!)\s+/);
    let currentChunk = "";
    
    for (const sentence of sentences) {
      if ((currentChunk + sentence).length <= maxChunkLength) {
        currentChunk += sentence + " ";
      } else {
        if (currentChunk) textChunks.push(currentChunk.trim());
        currentChunk = sentence + " ";
      }
    }
    
    if (currentChunk) textChunks.push(currentChunk.trim());
  } else {
    textChunks = [text];
  }
  
  const utterances = textChunks.map(chunk => {
    const utterance = new SpeechSynthesisUtterance(chunk);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    return utterance;
  });
  
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
    
    // Chain utterances to speak one after another
    utterances.forEach((utterance, index) => {
      if (selectedVoice) utterance.voice = selectedVoice;
      
      // Set up event handling for all except the last utterance
      if (index < utterances.length - 1) {
        utterance.onend = () => {
          window.speechSynthesis.speak(utterances[index + 1]);
        };
      }
      
      // Add error handling to each utterance
      utterance.onerror = (event) => {
        console.error('Text-to-speech error:', event);
        toast({
          title: "Text-to-speech error",
          description: "There was an error while reading the text aloud.",
          variant: "destructive",
        });
      };
    });
    
    // Start speaking with the first utterance
    if (utterances.length > 0) {
      window.speechSynthesis.speak(utterances[0]);
    }
  }
};
