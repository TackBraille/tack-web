
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatHistorySidebar from '@/components/ChatHistorySidebar';
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
    chatSessions,
    currentSessionId,
    handleNewChat,
    handleSelectSession,
    handleDeleteSession,
    handleRenameSession,
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

  // This function is kept but its behavior changes
  // Now it just passes the related question to MainContent
  // which will populate the input field
  const handleRelatedQuestionClick = (question: string) => {
    // We no longer auto-submit here, just pass the question
    // MainContent will handle populating the input field
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
            onRenameSession={handleRenameSession}
            history={history}
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
