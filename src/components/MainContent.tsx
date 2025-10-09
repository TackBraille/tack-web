
import React, { useState, useRef } from 'react';
import InputSection from '@/components/InputSection';
import SummaryOutput from '@/components/SummaryOutput';
import { SummaryOutput as SummaryType } from '@/types';
import RelatedQuestions from '@/components/RelatedQuestions';
import PreviousResponses from '@/components/PreviousResponses';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useEffect } from 'react';
import { useVoice } from '@/context/VoiceContext';
import useTTSSetting from '@/hooks/useTTSSetting';

interface MainContentProps {
  summaryData: SummaryType | null;
  isLoading: boolean;
  history: SummaryType[];
  handleSubmit: (content: string, type: 'text' | 'url') => Promise<void>;
  handleRelatedQuestionClick: (question: string) => void;
  onOrchestrate?: (content: string) => Promise<void>;
  currentSessionId?: string | null;
  chatSessions?: import('@/types').ChatSession[];
}

const MainContent: React.FC<MainContentProps> = ({
  summaryData,
  isLoading,
  history,
  handleSubmit,
  handleRelatedQuestionClick
  ,currentSessionId, chatSessions
}) => {
  // Reference to the setInputContent function from InputSection
  const setInputContentRef = useRef<((content: string) => void) | null>(null);
  
  // Function to handle related question clicks
  const handleRelatedQuestion = (question: string) => {
    // Set the question text in the input field
    if (setInputContentRef.current) {
      setInputContentRef.current(question);
      
      // Focus on the input element (scrolling to it)
      const inputElement = document.querySelector('textarea');
      if (inputElement) {
        inputElement.focus();
        // Announce to screen readers
        const announcement = document.getElementById('live-region');
        if (announcement) {
          announcement.textContent = `Related question "${question}" added to input. Press Enter to submit.`;
          setTimeout(() => {
            announcement.textContent = '';
          }, 2000);
        }
      }
    }
    
    // We're not auto-submitting anymore, just populating the input
    // This allows users to edit the question if needed before submitting
  };
  
  // Function to expose the input setter
  const getInputSetter = (setter: (content: string) => void) => {
    setInputContentRef.current = setter;
  };

  return (
    <main id="main-content" className="flex flex-col md:w-9/12 mx-auto w-full  pt-8">
      <div className="items-start justify-start  ">
        <div className="flex items-center gap-2 mb-4">
          {/* <SidebarTrigger className="flex-shrink-0" aria-label="Toggle chat history" /> */}
          <h1 className="sr-only">AI Chat Assistant</h1>
        </div>
        <div className="flex flex-col mx-auto w-full items-center justify-center">
        <h1 className='text-2xl font-semibold pb-6 '>Tack Insight Web Browser</h1>

        <InputSection 
          onSubmit={handleSubmit} 
          isLoading={isLoading} 
          externalSetInputContent={getInputSetter}
          onOrchestrate={undefined}
        />
        </div>
        
        {/* Accessibility announcement region */}
        <div 
          id="live-region" 
          aria-live="assertive" 
          className="sr-only" 
          role="status"
        ></div>
        
        {/* Current response */}
        <SummaryOutput data={summaryData} />

        {/* Read summary aloud when new content appears if available */}
        {/* voiceEnabled could be added to settings later */}
        {summaryData?.summary && (
          <VoiceReader summary={summaryData.summary} currentSessionId={currentSessionId} chatSessions={chatSessions} />
        )}
        
        {/* Related questions (if available) */}
        {summaryData?.relatedQuestions && summaryData.relatedQuestions.length > 0 && (
          <RelatedQuestions 
            questions={summaryData.relatedQuestions} 
            onQuestionClick={handleRelatedQuestion} 
          />
        )}
        
        {/* Previous responses in history */}
        {history.length > 1 && (
          <PreviousResponses history={history} />
        )}
      </div>
    </main>
  );
};

export default MainContent;

// Small component to trigger TTS when summary changes
const VoiceReader: React.FC<{ summary: string; currentSessionId?: string | null; chatSessions?: import('@/types').ChatSession[] }> = ({ summary, currentSessionId, chatSessions }) => {
  const { speakText } = useVoice();
  const [ttsEnabled] = useTTSSetting();

  useEffect(() => {
    if (!summary || !speakText || !ttsEnabled) return;

    // Check per-session autoRead setting
    let allowRead = true;
    if (currentSessionId && chatSessions) {
      const session = chatSessions.find(s => s.id === currentSessionId);
      if (session && typeof session.autoRead !== 'undefined') {
        allowRead = !!session.autoRead;
      }
    }

    if (allowRead) {
      speakText(summary).catch(() => {});
    }
  }, [summary, speakText, ttsEnabled, currentSessionId, chatSessions]);

  return null;
};
