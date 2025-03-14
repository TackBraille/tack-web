
import { useState, useEffect, useCallback } from 'react';
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

  const handleNewChat = useCallback(() => {
    const newSession = createChatSession();
    setChatSessions(prevSessions => [newSession, ...prevSessions.filter(s => s.id !== newSession.id)]);
    setCurrentSessionId(newSession.id);
    setHistory([]);
    setSummaryData(null);
  }, []);

  const handleSelectSession = useCallback((sessionId: string) => {
    setCurrentSession(sessionId);
    setCurrentSessionId(sessionId);
    const sessionHistory = getSessionHistory(sessionId);
    setHistory(sessionHistory);
    setSummaryData(sessionHistory.length > 0 ? sessionHistory[sessionHistory.length - 1] : null);
  }, []);

  const handleDeleteSession = useCallback((sessionId: string) => {
    console.log('Deleting session from hook:', sessionId);
    
    // Delete from local storage first
    deleteChatSession(sessionId);
    
    // Then update the state
    setChatSessions(prevSessions => prevSessions.filter(s => s.id !== sessionId));
    
    // If the deleted session was the current one, select another session or create a new one
    if (currentSessionId === sessionId) {
      const remainingSessions = chatSessions.filter(s => s.id !== sessionId);
      if (remainingSessions.length > 0) {
        handleSelectSession(remainingSessions[0].id);
      } else {
        // If no sessions remain, create a new one
        handleNewChat();
      }
    }
    
    // Add toast notification for successful deletion
    toast({
      title: "Chat deleted",
      description: "The chat has been removed from your history.",
    });
  }, [chatSessions, currentSessionId, handleNewChat, handleSelectSession]);

  const handleReset = useCallback(() => {
    setSummaryData(null);
    setHistory([]);
    setChatSessions([]);
    setCurrentSessionId(null);
    localStorage.clear();
    toast({
      title: 'Application reset',
      description: 'The application has been reset.',
    });
  }, []);

  const updateSessionAfterResponse = useCallback((result: SummaryOutput) => {
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
  }, [currentSessionId, history]);

  return {
    summaryData,
    setSummaryData,
    history,
    setHistory,
    chatSessions,
    currentSessionId,
    handleNewChat,
    handleSelectSession,
    handleDeleteSession,
    handleReset,
    updateSessionAfterResponse
  };
}
