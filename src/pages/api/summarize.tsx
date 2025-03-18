import { SummaryOutput } from '@/types';
import { callGeminiApi, createPrompt } from '@/services/geminiService';
import { 
  extractTextFromGeminiResponse, 
  extractSummary, 
  extractRelatedQuestions,
  generateFallbackContent
} from '@/utils/responseUtils';
import { extractDomain } from '@/utils/summarize/domainUtils';

/**
 * API route handler for summarizing content
 * @param request - The incoming request
 * @returns Response with the summary data
 */
export async function POST(request: Request) {
  try {
    const { content, type, model, history = [] } = await request.json();
    
    if (!content) {
      return new Response(
        JSON.stringify({ error: 'Content is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Log which model was requested
    console.log(`Model requested: ${model || 'default'}`);
    
    // Call the Gemini service for summarization
    const result = await callGeminiService(content, type, history, model);
    
    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in summarize API:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to summarize content', details: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * Function to call Gemini API for summarization
 */
async function callGeminiService(
  content: string, 
  type: 'text' | 'url', 
  conversationHistory: SummaryOutput[] = [],
  modelId?: string
): Promise<SummaryOutput> {
  try {
    // Create prompt for the AI model
    const prompt = createPrompt(content, type, conversationHistory, modelId);

    // Call the Gemini API
    const data = await callGeminiApi(prompt, modelId);
    
    // Extract text from Gemini response
    const fullResponse = extractTextFromGeminiResponse(data);
    
    // Parse the response to extract summary and related questions
    const summary = extractSummary(fullResponse);
    const relatedQuestions = extractRelatedQuestions(fullResponse);
    
    // Generate relevant sources based on content
    const sources = generateRelevantSources(content, type);

    return {
      summary,
      sources,
      relatedQuestions,
      originalQuery: content, // Save original query for context
      modelUsed: modelId || 'gemini' // Track which model was used
    };
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error; // Let the main API handler handle the error
  }
}

/**
 * Generate relevant sources based on query content
 */
function generateRelevantSources(query: string, type: 'text' | 'url'): any[] {
  if (type === 'url') {
    // For URL queries, create a nicely formatted source entry
    return [{
      id: '1',
      title: 'Provided URL',
      briefSummary: 'Primary source content that was analyzed to generate the response.',
      url: query
    }];
  }
  
  // For text queries, generate relevant sources based on the content
  const sources = [];
  const lowerQuery = query.toLowerCase();
  
  // Check for university-related queries and prioritize them
  if (lowerQuery.includes('university') || lowerQuery.includes('college') || 
      lowerQuery.includes('school') || lowerQuery.includes('asu') || 
      lowerQuery.includes('arizona state')) {
    
    // Extract university name from the query
    const uniName = extractUniversityName(lowerQuery);
    
    if (uniName) {
      // Add official university website as primary source
      sources.push({
        id: '1',
        title: `${uniName} Official Website`,
        briefSummary: `Official information about academics, admissions, campus life, and rankings at ${uniName}.`,
        url: determineUniversityUrl(uniName)
      });
      
      // Add rankings source
      sources.push({
        id: '2',
        title: 'U.S. News & World Report College Rankings',
        briefSummary: `Comprehensive ranking data for ${uniName} including academic reputation, selectivity, and student outcomes.`,
        url: `https://www.usnews.com/best-colleges/search?q=${encodeURIComponent(uniName)}`
      });
      
      // Add academic research source
      sources.push({
        id: '3',
        title: 'Times Higher Education World University Rankings',
        briefSummary: `Global performance assessment of ${uniName} across teaching, research, knowledge transfer and international outlook.`,
        url: `https://www.timeshighereducation.com/world-university-rankings/search?q=${encodeURIComponent(uniName)}`
      });
      
      // Add Wikipedia source for general information
      sources.push({
        id: '4',
        title: `${uniName} - Wikipedia`,
        briefSummary: `Comprehensive reference on ${uniName} with detailed information on history, structure, and notable aspects.`,
        url: `https://en.wikipedia.org/wiki/${encodeURIComponent(uniName.replace(/\s+/g, '_'))}`
      });
      
      return sources;
    }
  }
  
  // For other query types, continue with the existing categorization logic
  if (lowerQuery.includes('history') || lowerQuery.includes('when') || lowerQuery.includes('past')) {
    // History-related sources
    sources.push({
      id: '1',
      title: 'Encyclopedia Britannica',
      briefSummary: `Authoritative historical information related to "${query}"`,
      url: `https://www.britannica.com/search?query=${encodeURIComponent(query)}`
    });
    
    sources.push({
      id: '2',
      title: 'History.com',
      briefSummary: `Historical context and timeline on "${query}"`,
      url: `https://www.history.com/search?q=${encodeURIComponent(query)}`
    });
  } else if (lowerQuery.includes('science') || lowerQuery.includes('how') || lowerQuery.includes('why')) {
    // Science-related sources
    sources.push({
      id: '1',
      title: 'Scientific American',
      briefSummary: `Scientific explanation and research on "${query}"`,
      url: `https://www.scientificamerican.com/search/?q=${encodeURIComponent(query)}`
    });
    
    sources.push({
      id: '2',
      title: 'Science.org',
      briefSummary: `Peer-reviewed research related to "${query}"`,
      url: `https://www.science.org/action/doSearch?text=${encodeURIComponent(query)}`
    });
  } else if (lowerQuery.includes('news') || lowerQuery.includes('current') || lowerQuery.includes('recent')) {
    // News-related sources
    sources.push({
      id: '1',
      title: 'Reuters',
      briefSummary: `Latest news and developments on "${query}"`,
      url: `https://www.reuters.com/search/news?blob=${encodeURIComponent(query)}`
    });
    
    sources.push({
      id: '2',
      title: 'Associated Press',
      briefSummary: `Recent reporting on "${query}"`,
      url: `https://apnews.com/search?q=${encodeURIComponent(query)}`
    });
  }
  
  // Add Wikipedia as a general reference if not already added
  if (!sources.some(s => s.title.includes('Wikipedia'))) {
    sources.push({
      id: sources.length + 1 + '',
      title: 'Wikipedia',
      briefSummary: `Comprehensive reference on "${query}" with detailed information.`,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(query.replace(/\s+/g, '_'))}`
    });
  }
  
  // For general educational/academic queries, include Google Scholar
  sources.push({
    id: sources.length + 1 + '',
    title: 'Google Scholar',
    briefSummary: `Academic research papers and citations related to "${query}"`,
    url: `https://scholar.google.com/scholar?q=${encodeURIComponent(query)}`
  });
  
  return sources.slice(0, 4); // Limit to 4 sources
}

/**
 * Extract university name from query
 */
function extractUniversityName(query: string): string | null {
  // Special case for ASU
  if (query.includes('asu') || query.includes('arizona state')) {
    return 'Arizona State University';
  }
  
  // Extract other university names
  const uniPatterns = [
    /university of ([a-z ]+)/i,
    /([a-z ]+) university/i,
    /([a-z ]+) college/i
  ];
  
  for (const pattern of uniPatterns) {
    const match = query.match(pattern);
    if (match && match[1]) {
      return match[1].trim().split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    }
  }
  
  return null;
}

/**
 * Determine the correct university URL
 */
function determineUniversityUrl(uniName: string): string {
  const normalizedName = uniName.toLowerCase();
  
  // Special cases for specific universities
  if (normalizedName.includes('arizona state')) {
    return 'https://www.asu.edu/';
  }
  
  if (normalizedName.includes('mit') || normalizedName === 'massachusetts institute of technology') {
    return 'https://www.mit.edu/';
  }
  
  if (normalizedName.includes('harvard')) {
    return 'https://www.harvard.edu/';
  }
  
  if (normalizedName.includes('stanford')) {
    return 'https://www.stanford.edu/';
  }
  
  // Extract domain name from university name
  const simplifiedName = normalizedName
    .replace(/university of /i, '')
    .replace(/ university/i, '')
    .replace(/ college/i, '')
    .replace(/\s+/g, '');
  
  // Format based on whether it's "University of X" or "X University"
  if (normalizedName.startsWith('university of')) {
    return `https://www.${simplifiedName}.edu/`;
  } else {
    return `https://www.${simplifiedName}.edu/`;
  }
}
