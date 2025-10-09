
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChatHistorySidebar } from '@/components/sidebar';
import MainContent from '@/components/MainContent';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useChatSessions } from '@/hooks/useChatSessions';
import { useContentSubmission } from '@/hooks/useContentSubmission';
import { createChatSession } from '@/utils/chatSessionUtils';
import { useEffect } from 'react';
import { useVoice } from '@/context/VoiceContext';
import { runTwoStepAnalysis } from '@/lib/llmOrchestrator';

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
    handleDeleteAll,
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

  const handleOrchestrate = async (content: string) => {
    try {
      const result = await runTwoStepAnalysis(content, 'text', history);
      // Update summary with step1 and add a follow-up item from step2
      if (result && result.step1) {
        // Set summary to step1 and add step2 as a related follow-up
        // Reuse existing session update function for consistency
        updateSessionAfterResponse(result.step1);
        // Also set the follow-up (step2) into history so user can inspect
        setSummaryData(result.step2);
      }
    } catch (err) {
      console.error('Two-step analysis failed', err);
    }
  };

  const voice = useVoice();

  useEffect(() => {
    // Register actions so voice commands can call into app logic
    voice.registerActions({
      createChat: handleNewChat,
      submitText: (text: string) => handleSubmit(text, 'text'),
      speakCurrentSummary: () => {
        if (summaryData && voice) {
          voice.speakText(summaryData.summary).catch(() => {});
        }
      },
      deleteSession: (id?: string) => {
        if (id) handleDeleteSession(id);
        else if (currentSessionId) handleDeleteSession(currentSessionId);
      },
      selectSession: (id: string) => handleSelectSession(id),
      getCurrentSessionId: () => currentSessionId,
    });
  }, [voice, handleNewChat, handleSubmit, summaryData, handleDeleteSession, currentSessionId, handleSelectSession]);

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
            onDeleteAll={handleDeleteAll}
            history={history}
            setHistory={setHistory}
          />
          
          <MainContent
            summaryData={summaryData}
            isLoading={isLoading}
            history={history}
            handleSubmit={handleSubmit}
            handleRelatedQuestionClick={handleRelatedQuestionClick}
            currentSessionId={currentSessionId}
            chatSessions={chatSessions}
            onOrchestrate={handleOrchestrate}
          />
        </div>
        
        <Footer onReset={handleReset} />
      </div>
    </SidebarProvider>
  );
};

export default Index;
