
import { ChatSession, SummaryOutput } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Local storage keys
const CHAT_SESSIONS_KEY = 'ai-chat-sessions';
const CURRENT_SESSION_KEY = 'ai-current-session';
const SESSION_HISTORY_PREFIX = 'ai-session-history-';

// Get all chat sessions
export const getChatSessions = (): ChatSession[] => {
  try {
    const sessions = localStorage.getItem(CHAT_SESSIONS_KEY);
    return sessions ? JSON.parse(sessions) : [];
  } catch (error) {
    console.error('Error loading chat sessions:', error);
    return [];
  }
};

// Save chat sessions
export const saveChatSessions = (sessions: ChatSession[]): void => {
  try {
    localStorage.setItem(CHAT_SESSIONS_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error('Error saving chat sessions:', error);
  }
};

// Create a new chat session
export const createChatSession = (firstQuery?: string): ChatSession => {
  const newSession: ChatSession = {
    id: uuidv4(),
    title: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    firstQuery
  };
  
  const sessions = getChatSessions();
  saveChatSessions([newSession, ...sessions]);
  setCurrentSession(newSession.id);
  
  return newSession;
};

// Delete a chat session
export const deleteChatSession = (sessionId: string): void => {
  try {
    console.log('Deleting session from utils:', sessionId);
    
    // Get current sessions
    const sessions = getChatSessions();
    
    // Filter out the session to delete
    const updatedSessions = sessions.filter(session => session.id !== sessionId);
    
    // Save updated sessions list
    saveChatSessions(updatedSessions);
    
    // Remove session history
    localStorage.removeItem(`${SESSION_HISTORY_PREFIX}${sessionId}`);
    
    // If current session was deleted, update current session
    const currentSession = getCurrentSession();
    if (currentSession === sessionId) {
      if (updatedSessions.length > 0) {
        setCurrentSession(updatedSessions[0].id);
      } else {
        localStorage.removeItem(CURRENT_SESSION_KEY);
      }
    }
    
    console.log('Deletion completed for session:', sessionId);
  } catch (error) {
    console.error('Error deleting chat session:', error);
  }
};

// Update a chat session
export const updateChatSession = (
  sessionId: string, 
  updates: Partial<ChatSession>
): ChatSession | null => {
  const sessions = getChatSessions();
  const index = sessions.findIndex(s => s.id === sessionId);
  
  if (index === -1) return null;
  
  sessions[index] = {
    ...sessions[index],
    ...updates,
    updatedAt: new Date()
  };
  
  saveChatSessions(sessions);
  return sessions[index];
};

// Get current session ID
export const getCurrentSession = (): string | null => {
  return localStorage.getItem(CURRENT_SESSION_KEY);
};

// Set current session ID
export const setCurrentSession = (sessionId: string | null): void => {
  if (sessionId) {
    localStorage.setItem(CURRENT_SESSION_KEY, sessionId);
  } else {
    localStorage.removeItem(CURRENT_SESSION_KEY);
  }
};

// Get session history
export const getSessionHistory = (sessionId: string): SummaryOutput[] => {
  try {
    const history = localStorage.getItem(`${SESSION_HISTORY_PREFIX}${sessionId}`);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error(`Error loading history for session ${sessionId}:`, error);
    return [];
  }
};

// Save session history
export const saveSessionHistory = (sessionId: string, history: SummaryOutput[]): void => {
  try {
    localStorage.setItem(`${SESSION_HISTORY_PREFIX}${sessionId}`, JSON.stringify(history));
    
    // Update session timestamp
    const sessions = getChatSessions();
    const session = sessions.find(s => s.id === sessionId);
    
    if (session) {
      updateChatSession(sessionId, { 
        updatedAt: new Date()
      });
    }
  } catch (error) {
    console.error(`Error saving history for session ${sessionId}:`, error);
  }
};
