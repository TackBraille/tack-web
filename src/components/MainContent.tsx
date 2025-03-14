
import React, { useState, useRef } from 'react';
import InputSection from '@/components/InputSection';
import SummaryOutput from '@/components/SummaryOutput';
import { SummaryOutput as SummaryType } from '@/types';
import RelatedQuestions from '@/components/RelatedQuestions';
import PreviousResponses from '@/components/PreviousResponses';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface MainContentProps {
  summaryData: SummaryType | null;
  isLoading: boolean;
  history: SummaryType[];
  handleSubmit: (content: string, type: 'text' | 'url') => Promise<void>;
  handleRelatedQuestionClick: (question: string) => void;
}

const MainContent: React.FC<MainContentProps> = ({
  summaryData,
  isLoading,
  history,
  handleSubmit,
  handleRelatedQuestionClick
}) => {
  // Reference to the setInputContent function from InputSection
  const setInputContentRef = useRef<(content: string) => void | null>(null);
  
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
    <main id="main-content" className="flex-1 container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <SidebarTrigger className="flex-shrink-0" aria-label="Toggle chat history" />
          <h1 className="sr-only">AI Chat Assistant</h1>
        </div>
        
        <InputSection 
          onSubmit={handleSubmit} 
          isLoading={isLoading} 
          externalSetInputContent={getInputSetter}
        />
        
        {/* Accessibility announcement region */}
        <div 
          id="live-region" 
          aria-live="assertive" 
          className="sr-only" 
          role="status"
        ></div>
        
        {/* Current response */}
        <SummaryOutput data={summaryData} />
        
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
