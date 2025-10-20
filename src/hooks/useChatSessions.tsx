
import { useState, useEffect, useCallback } from 'react';
import { SummaryOutput, ChatSession } from '@/types';
import { 
  getChatSessions, 
  getCurrentSession, 
  setCurrentSession, 
  createChatSession, 
  deleteChatSession,
  deleteAllSessions,
  getSessionHistory,
  saveSessionHistory,
  updateChatSession
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
    
    // Capture the session and history so we can restore on undo
    const sessions = getChatSessions();
    const sessionToDelete = sessions.find(s => s.id === sessionId) || null;
    const sessionHistory = sessionId ? getSessionHistory(sessionId) : [];

    // Remove from storage
    deleteChatSession(sessionId);

    // Update internal state
    const remainingSessions = getChatSessions();
    setChatSessions(remainingSessions);

    // If the deleted session was the current one, select another session or create a new one
    if (currentSessionId === sessionId) {
      if (remainingSessions.length > 0) {
        handleSelectSession(remainingSessions[0].id);
      } else {
        // If no sessions remain, create a new one
        handleNewChat();
      }
    }

    // Show toast with undo option
    const t = toast({
      title: 'Chat deleted',
      description: 'The chat has been removed from your history.',
      action: (
        <button
          onClick={() => {
            // Restore session and its history
            if (sessionToDelete) {
              const restored = [sessionToDelete, ...getChatSessions()];
              // Persist restored sessions and history
              try {
                localStorage.setItem('ai-chat-sessions', JSON.stringify(restored));
                if (sessionHistory && sessionHistory.length > 0) {
                  localStorage.setItem(`ai-session-history-${sessionToDelete.id}`, JSON.stringify(sessionHistory));
                }
                // Update state
                setChatSessions(restored);
                setCurrentSession(sessionToDelete.id);
                setCurrentSessionId(sessionToDelete.id);
                setHistory(sessionHistory || []);
                toast({ title: 'Restored', description: 'Chat restored.' });
              } catch (err) {
                console.error('Failed to restore session', err);
              }
            }
            // dismiss this toast
            t.dismiss();
          }}
          className="text-sm font-medium"
        >
          Undo
        </button>
      ) as any,
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

  const handleDeleteAll = useCallback(() => {
    const sessions = getChatSessions();
    const allHistories = sessions.reduce((acc, s) => {
      acc[s.id] = getSessionHistory(s.id);
      return acc;
    }, {} as Record<string, SummaryOutput[]>);

    // Remove all
    deleteAllSessions();
    setChatSessions([]);
    setCurrentSessionId(null);
    setHistory([]);
    setSummaryData(null);

    const t = toast({
      title: 'All chats deleted',
      description: 'All chats were removed.',
      action: (
        <button
          onClick={() => {
            try {
              // restore
              localStorage.setItem('ai-chat-sessions', JSON.stringify(sessions));
              Object.keys(allHistories).forEach(id => {
                localStorage.setItem(`ai-session-history-${id}`, JSON.stringify(allHistories[id]));
              });
              setChatSessions(sessions);
              if (sessions.length > 0) {
                setCurrentSessionId(sessions[0].id);
                setCurrentSession(sessions[0].id);
                setHistory(allHistories[sessions[0].id] || []);
              }
              toast({ title: 'Restored', description: 'All chats restored.' });
            } catch (err) {
              console.error('Failed to restore all', err);
            }
            t.dismiss();
          }}
          className="text-sm font-medium"
        >
          Undo
        </button>
      ) as any,
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
    handleDeleteAll,
    handleReset,
    updateSessionAfterResponse
  };
}
