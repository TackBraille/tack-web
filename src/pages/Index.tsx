
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import InputSection from '@/components/InputSection';
import SummaryOutput from '@/components/SummaryOutput';
import Footer from '@/components/Footer';
import ChatHistorySidebar from '@/components/ChatHistorySidebar';
import { SummaryOutput as SummaryType, ChatSession } from '@/types';
import { summarizeContent } from '@/utils/summarizeUtils';
import { toast } from '@/components/ui/use-toast';
import { 
  getChatSessions, 
  getCurrentSession, 
  setCurrentSession, 
  createChatSession, 
  deleteChatSession,
  getSessionHistory,
  saveSessionHistory
} from '@/utils/chatSessionUtils';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { PanelLeft } from 'lucide-react';

const Index = () => {
  const [summaryData, setSummaryData] = useState<SummaryType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<SummaryType[]>([]);
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

  const handleSubmit = async (content: string, type: 'text' | 'url') => {
    setIsLoading(true);
    setSummaryData({ summary: '', sources: [], loading: true });
    
    try {
      // Create a new session if we don't have one
      if (!currentSessionId) {
        const newSession = createChatSession(content);
        setChatSessions([newSession, ...chatSessions]);
        setCurrentSessionId(newSession.id);
      }
      
      const result = await summarizeContent(content, type);
      
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
      toast({
        title: 'Response generated',
        description: 'Your query has been successfully answered.',
      });
    } catch (error) {
      console.error('Error generating summary:', error);
      setSummaryData({
        summary: '',
        sources: [],
        error: 'Failed to generate response. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRelatedQuestionClick = (question: string) => {
    // When a user clicks a related question, we submit it as a new query
    handleSubmit(question, 'text');
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

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col bg-background w-full">
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 z-50"
        >
          Skip to main content
        </a>
        
        <Header />
        
        <div className="flex flex-1">
          <ChatHistorySidebar 
            sessions={chatSessions}
            currentSession={currentSessionId || undefined}
            onNewChat={handleNewChat}
            onSelectSession={handleSelectSession}
            onDeleteSession={handleDeleteSession}
            history={history}
          />
          
          <main id="main-content" className="flex-1 container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-2 mb-4">
                <SidebarTrigger className="flex-shrink-0" aria-label="Toggle chat history" />
                <h1 className="sr-only">AI Chat Assistant</h1>
              </div>
              
              <InputSection onSubmit={handleSubmit} isLoading={isLoading} />
              
              {/* Current response */}
              <SummaryOutput data={summaryData} />
              
              {/* Related questions (if available) */}
              {summaryData?.relatedQuestions && summaryData.relatedQuestions.length > 0 && (
                <section className="w-full max-w-3xl mx-auto mb-8">
                  <h2 className="text-lg font-medium mb-3">Related Questions</h2>
                  <div className="flex flex-wrap gap-2">
                    {summaryData.relatedQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleRelatedQuestionClick(question)}
                        className="bg-secondary/50 hover:bg-secondary px-3 py-1.5 rounded-full text-sm transition-colors"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </section>
              )}
              
              {/* Previous responses in history */}
              {history.length > 1 && (
                <section className="w-full max-w-3xl mx-auto mb-8">
                  <h2 className="text-xl font-semibold mb-3">Previous Responses</h2>
                  <div className="space-y-4">
                    {history.slice(0, -1).reverse().map((item, index) => (
                      <div key={index} className="bg-card border rounded-lg p-4 opacity-75 hover:opacity-100 transition-opacity">
                        <p className="text-sm line-clamp-2">{item.summary}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </main>
        </div>
        
        <Footer onReset={handleReset} />
      </div>
    </SidebarProvider>
  );
};

export default Index;
