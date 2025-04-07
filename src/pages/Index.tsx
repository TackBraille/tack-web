
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChatHistorySidebar } from '@/components/sidebar';
import MainContent from '@/components/MainContent';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useChatSessions } from '@/hooks/useChatSessions';
import { useContentSubmission } from '@/hooks/useContentSubmission';
import { createChatSession } from '@/utils/chatSessionUtils';

const Index = () => {
  const {
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
  } = useChatSessions();

  const createSessionWithContent = () => {
    const newSession = createChatSession();
    return newSession.id;
  };

  const { isLoading, handleSubmit } = useContentSubmission({
    currentSessionId,
    createNewSession: handleNewChat,
    updateSessionAfterResponse,
    history
  });

  // This is now just a placeholder function as the actual functionality has moved to the MainContent component
  const handleRelatedQuestionClick = (question: string) => {
    // MainContent now handles this functionality
  };

  return (
    <SidebarProvider>
      <div className=" flex flex-col bg-background w-full">
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
            setHistory={setHistory}
          />
          
          <MainContent
            summaryData={summaryData}
            isLoading={isLoading}
            history={history}
            handleSubmit={handleSubmit}
            handleRelatedQuestionClick={handleRelatedQuestionClick}
          />
        </div>
        
        <Footer onReset={handleReset} />
      </div>
    </SidebarProvider>
  );
};

export default Index;
