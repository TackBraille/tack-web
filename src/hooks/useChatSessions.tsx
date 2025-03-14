
import { useState, useEffect } from 'react';
import { SummaryOutput, ChatSession } from '@/types';
import { 
  getChatSessions, 
  getCurrentSession, 
  setCurrentSession, 
  createChatSession, 
  deleteChatSession,
  getSessionHistory,
  saveSessionHistory
} from '@/utils/chatSessionUtils';
import { toast } from '@/components/ui/use-toast';

export function useChatSessions() {
  const [summaryData, setSummaryData] = useState<SummaryOutput | null>(null);
  const [history, setHistory] = useState<SummaryOutput[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // Load chat sessions and current session on initial load
  useEffect(() => {
    const sessions = getChatSessions();
    setChatSessions(sessions);
    
    const currentSession = getCurrentSession();
    setCurrentSessionId(currentSession);
    
    if (currentSession) {
      const sessionHistory = getSessionHistory(currentSession);
      setHistory(sessionHistory);
    }
  }, []);

  const handleNewChat = () => {
    const newSession = createChatSession();
    setChatSessions([newSession, ...chatSessions.filter(s => s.id !== newSession.id)]);
    setCurrentSessionId(newSession.id);
    setHistory([]);
    setSummaryData(null);
  };

  const handleSelectSession = (sessionId: string) => {
    setCurrentSession(sessionId);
    setCurrentSessionId(sessionId);
    const sessionHistory = getSessionHistory(sessionId);
    setHistory(sessionHistory);
    setSummaryData(sessionHistory.length > 0 ? sessionHistory[sessionHistory.length - 1] : null);
  };

  const handleDeleteSession = (sessionId: string) => {
    deleteChatSession(sessionId);
    setChatSessions(chatSessions.filter(s => s.id !== sessionId));
    
    if (currentSessionId === sessionId) {
      const newSessions = chatSessions.filter(s => s.id !== sessionId);
      if (newSessions.length > 0) {
        handleSelectSession(newSessions[0].id);
      } else {
        setCurrentSessionId(null);
        setHistory([]);
        setSummaryData(null);
      }
    }
  };

  const handleReset = () => {
    setSummaryData(null);
    setHistory([]);
    setChatSessions([]);
    setCurrentSessionId(null);
    localStorage.clear();
    toast({
      title: 'Application reset',
      description: 'The application has been reset.',
    });
  };

  const updateSessionAfterResponse = (result: SummaryOutput) => {
    // Add to history
    const updatedHistory = [...history, result];
    setHistory(updatedHistory);
    
    // Save to session storage
    if (currentSessionId) {
      saveSessionHistory(currentSessionId, updatedHistory);
      
      // Refresh sessions list to update timestamps
      setChatSessions(getChatSessions());
    }
    
    setSummaryData(result);
  };

  return {
    summaryData,
    setSummaryData,
    history,
    chatSessions,
    currentSessionId,
    handleNewChat,
    handleSelectSession,
    handleDeleteSession,
    handleReset,
    updateSessionAfterResponse
  };
}
