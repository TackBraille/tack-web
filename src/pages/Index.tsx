
import React, { useState } from 'react';
import Header from '@/components/Header';
import InputSection from '@/components/InputSection';
import SummaryOutput from '@/components/SummaryOutput';
import Footer from '@/components/Footer';
import { SummaryOutput as SummaryType } from '@/types';
import { summarizeContent } from '@/utils/summarizeUtils';
import { toast } from '@/components/ui/use-toast';

const Index = () => {
  const [summaryData, setSummaryData] = useState<SummaryType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<SummaryType[]>([]);

  const handleSubmit = async (content: string, type: 'text' | 'url') => {
    setIsLoading(true);
    setSummaryData({ summary: '', sources: [], loading: true });
    
    try {
      const result = await summarizeContent(content, type);
      
      // Add to history
      setHistory(prev => [...prev, result]);
      
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
    toast({
      title: 'Application reset',
      description: 'The application has been reset.',
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 z-50"
      >
        Skip to main content
      </a>
      
      <Header />
      
      <main id="main-content" className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
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
      
      <Footer onReset={handleReset} />
    </div>
  );
};

export default Index;
