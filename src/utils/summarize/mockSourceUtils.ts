
import { Source } from '@/types';

// Generate mock sources based on the query content for demonstration
export const generateMockSources = (query: string): Source[] => {
  // Simple function to create mock sources for demonstration purposes
  const sources: Source[] = [
    {
      id: '1',
      title: 'Wikipedia',
      briefSummary: `Comprehensive reference on "${query}"`,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(query.replace(/\s+/g, '_'))}`
    }
  ];
  
  // Add additional sources based on query content
  if (query.toLowerCase().includes('history') || query.toLowerCase().includes('when')) {
    sources.push({
      id: '2',
      title: 'History.com',
      briefSummary: `Historical context and timeline for "${query}"`,
      url: `https://www.history.com/search?q=${encodeURIComponent(query)}`
    });
  }
  
  if (query.toLowerCase().includes('science') || query.toLowerCase().includes('how') || query.toLowerCase().includes('why')) {
    sources.push({
      id: '3',
      title: 'Scientific American',
      briefSummary: `Scientific explanation of "${query}"`,
      url: `https://www.scientificamerican.com/search/?q=${encodeURIComponent(query)}`
    });
  }
  
  if (query.toLowerCase().includes('news') || query.toLowerCase().includes('current') || query.toLowerCase().includes('today')) {
    sources.push({
      id: '4',
      title: 'Reuters',
      briefSummary: `Latest news about "${query}"`,
      url: `https://www.reuters.com/search/news?blob=${encodeURIComponent(query)}`
    });
  }
  
  return sources;
};
