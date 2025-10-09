import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { createSpeechRecognizer, parseVoiceCommand, speak } from '@/lib/voiceControl';
import { dispatchVoiceText } from '@/lib/commandDispatcher';

type VoiceActions = {
  createChat: () => void;
  submitText: (text: string) => void;
  speakCurrentSummary: () => void;
  deleteSession: (id?: string) => void;
  selectSession: (id: string) => void;
  getCurrentSessionId?: () => string | null;
};

type VoiceContextType = {
  isListening: boolean;
  lastTranscript: string;
  startListening: () => void;
  stopListening: () => void;
  speakText: (text: string) => Promise<void>;
  parseCommand: (text: string) => any;
  registerActions: (actions: VoiceActions) => void;
};

const VoiceContext = createContext<VoiceContextType | null>(null);

export const useVoice = () => {
  const ctx = useContext(VoiceContext);
  if (!ctx) throw new Error('useVoice must be used within VoiceProvider');
  return ctx;
};

export const VoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isListening, setIsListening] = useState(false);
  const [lastTranscript, setLastTranscript] = useState('');
  const recognizerRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // Preload voices to reduce delay on first speak
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  const onResult = (text: string, isFinal: boolean) => {
    setLastTranscript(text);
    if (isFinal) {
      // parse command and optionally act on it - app-level actions may be registered
      const cmd = parseVoiceCommand(text);
      console.log('Voice command parsed:', cmd);
      if (actionsRef.current) {
        try {
          dispatchVoiceText(text, actionsRef.current);
        } catch (err) {
          console.error('Error dispatching voice command', err);
        }
      }
    }
  };

  const startListening = () => {
    const rec = createSpeechRecognizer(onResult);
    if (!rec) {
      console.warn('SpeechRecognition not available');
      return;
    }
    recognizerRef.current = rec;
    try {
      rec.start();
      setIsListening(true);
    } catch (e) {
      console.error('Failed to start recognizer', e);
    }
  };

  const stopListening = () => {
    const rec = recognizerRef.current;
    if (rec) {
      try {
        rec.stop();
      } catch (e) {
        console.warn('Failed to stop recognizer', e);
      }
      recognizerRef.current = null;
    }
    setIsListening(false);
  };

  const speakText = (text: string) => speak(text);
  const actionsRef = useRef<VoiceActions | null>(null);
  const registerActions = (actions: VoiceActions) => {
    actionsRef.current = actions;
  };

  return (
    <VoiceContext.Provider value={{ isListening, lastTranscript, startListening, stopListening, speakText, parseCommand: parseVoiceCommand, registerActions }}>
      {children}
    </VoiceContext.Provider>
  );
};

export default VoiceContext;
