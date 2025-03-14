
import { Source } from '@/types';

// Generate mock sources based on the query content for demonstration
export const generateMockSources = (query: string): Source[] => {
  const sources: Source[] = [];
  const lowerQuery = query.toLowerCase();
  
  // University-related query detection
  if (lowerQuery.includes('university') || lowerQuery.includes('college') || 
      lowerQuery.includes('school') || lowerQuery.includes('asu')) {
    
    // ASU-specific sources
    if (lowerQuery.includes('asu') || lowerQuery.includes('arizona state')) {
      sources.push({
        id: '1',
        title: 'Arizona State University Official Website',
        briefSummary: 'Official information about academics, admissions, campus life, and rankings at ASU.',
        url: 'https://www.asu.edu/'
      });
      
      sources.push({
        id: '2',
        title: 'U.S. News & World Report - ASU Rankings',
        briefSummary: 'Comprehensive ranking data for Arizona State University including academic reputation and student outcomes.',
        url: 'https://www.usnews.com/best-colleges/arizona-state-university-1081'
      });
    } else {
      // Generic university sources
      sources.push({
        id: '1',
        title: 'University Rankings and Reviews',
        briefSummary: `Information about universities related to "${query}"`,
        url: `https://www.usnews.com/best-colleges/search?q=${encodeURIComponent(query)}`
      });
    }
  } else if (lowerQuery.includes('history') || lowerQuery.includes('when')) {
    // History-related sources
    sources.push({
      id: '1',
      title: 'Encyclopedia Britannica',
      briefSummary: `Historical information about "${query}"`,
      url: `https://www.britannica.com/search?query=${encodeURIComponent(query)}`
    });
  } else if (lowerQuery.includes('science') || lowerQuery.includes('how')) {
    // Science-related sources
    sources.push({
      id: '1',
      title: 'Scientific American',
      briefSummary: `Scientific explanation of "${query}"`,
      url: `https://www.scientificamerican.com/search/?q=${encodeURIComponent(query)}`
    });
  }
  
  // Always include Wikipedia as a fallback source if no other sources are added
  if (sources.length === 0 || sources.length < 2) {
    sources.push({
      id: sources.length + 1 + '',
      title: 'Wikipedia',
      briefSummary: `General information about "${query}"`,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(query.replace(/\s+/g, '_'))}`
    });
  }
  
  return sources;
};
