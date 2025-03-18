
import { Source } from '@/types';

// Generate mock sources based on the query content for demonstration
export const generateMockSources = (query: string): Source[] => {
  const sources: Source[] = [];
  const lowerQuery = query.toLowerCase();
  
  // University-related query detection with improved patterns
  if (lowerQuery.includes('university') || lowerQuery.includes('college') || 
      lowerQuery.includes('school') || lowerQuery.includes('asu') || 
      lowerQuery.includes('education') || lowerQuery.includes('campus')) {
    
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
      
      sources.push({
        id: '3',
        title: 'ASU - Academic Programs',
        briefSummary: 'Information about degree programs, majors, and academic departments at Arizona State University.',
        url: 'https://www.asu.edu/academics'
      });
    } else {
      // Generic university sources
      sources.push({
        id: '1',
        title: 'University Rankings and Reviews',
        briefSummary: `Information about universities related to "${query}"`,
        url: `https://www.usnews.com/best-colleges/search?q=${encodeURIComponent(query)}`
      });
      
      sources.push({
        id: '2',
        title: 'College Board - University Search',
        briefSummary: `Comprehensive information about colleges and universities matching "${query}"`,
        url: `https://bigfuture.collegeboard.org/college-search?q=${encodeURIComponent(query)}`
      });
    }
  } else if (lowerQuery.includes('climate') || lowerQuery.includes('environment') || lowerQuery.includes('warming')) {
    // Climate-related sources
    sources.push({
      id: '1',
      title: 'NASA - Climate Change and Global Warming',
      briefSummary: 'Scientific information about climate change from NASA research and satellite data.',
      url: 'https://climate.nasa.gov/'
    });
    
    sources.push({
      id: '2',
      title: 'NOAA Climate.gov',
      briefSummary: 'Climate data, research, and information from the National Oceanic and Atmospheric Administration.',
      url: 'https://www.climate.gov/'
    });
  } else if (lowerQuery.includes('history') || lowerQuery.includes('when')) {
    // History-related sources
    sources.push({
      id: '1',
      title: 'Encyclopedia Britannica',
      briefSummary: `Historical information about "${query}"`,
      url: `https://www.britannica.com/search?query=${encodeURIComponent(query)}`
    });
    
    sources.push({
      id: '2',
      title: 'History.com',
      briefSummary: `Historical events, figures, and timelines related to "${query}"`,
      url: `https://www.history.com/search?q=${encodeURIComponent(query)}`
    });
  } else if (lowerQuery.includes('science') || lowerQuery.includes('how') || lowerQuery.includes('what is')) {
    // Science-related sources
    sources.push({
      id: '1',
      title: 'Scientific American',
      briefSummary: `Scientific explanation of "${query}"`,
      url: `https://www.scientificamerican.com/search/?q=${encodeURIComponent(query)}`
    });
    
    sources.push({
      id: '2',
      title: 'Nature.com',
      briefSummary: `Research papers and scientific articles about "${query}"`,
      url: `https://www.nature.com/search?q=${encodeURIComponent(query)}`
    });
  } else if (lowerQuery.includes('tech') || lowerQuery.includes('ai') || lowerQuery.includes('computer')) {
    // Technology-related sources
    sources.push({
      id: '1',
      title: 'MIT Technology Review',
      briefSummary: 'Analysis of emerging technologies and their potential impact.',
      url: `https://www.technologyreview.com/search/?s=${encodeURIComponent(query)}`
    });
    
    sources.push({
      id: '2',
      title: 'IEEE Spectrum',
      briefSummary: 'Technical information and analysis from the world\'s largest professional technology organization.',
      url: `https://spectrum.ieee.org/searchresults?q=${encodeURIComponent(query)}`
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
  
  // Add Google Scholar for most searches
  if (!lowerQuery.includes('movie') && !lowerQuery.includes('celebrity') && !lowerQuery.includes('sport')) {
    sources.push({
      id: sources.length + 1 + '',
      title: 'Google Scholar',
      briefSummary: `Academic papers and research related to "${query}"`,
      url: `https://scholar.google.com/scholar?q=${encodeURIComponent(query)}`
    });
  }
  
  return sources;
};
