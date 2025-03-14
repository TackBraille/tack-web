
import React from 'react';
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
  return (
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
          <RelatedQuestions 
            questions={summaryData.relatedQuestions} 
            onQuestionClick={handleRelatedQuestionClick} 
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
