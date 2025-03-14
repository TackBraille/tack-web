
import React, { useState } from 'react';
import Header from '@/components/Header';
import InputSection from '@/components/InputSection';
import SummaryOutput from '@/components/SummaryOutput';
import SourceList from '@/components/SourceList';
import Footer from '@/components/Footer';
import { SummaryOutput as SummaryType } from '@/types';
import { summarizeContent } from '@/utils/summarizeUtils';
import { toast } from '@/components/ui/use-toast';

const Index = () => {
  const [summaryData, setSummaryData] = useState<SummaryType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (content: string, type: 'text' | 'url') => {
    setIsLoading(true);
    setSummaryData({ summary: '', sources: [], loading: true });
    
    try {
      const result = await summarizeContent(content, type);
      setSummaryData(result);
      toast({
        title: 'Summary generated',
        description: 'Your content has been successfully summarized.',
      });
    } catch (error) {
      console.error('Error generating summary:', error);
      setSummaryData({
        summary: '',
        sources: [],
        error: 'Failed to generate summary. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSummaryData(null);
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
          <SummaryOutput data={summaryData} />
          <SourceList 
            sources={summaryData?.sources || []} 
            loading={summaryData?.loading} 
          />
        </div>
      </main>
      
      <Footer onReset={handleReset} />
    </div>
  );
};

export default Index;
