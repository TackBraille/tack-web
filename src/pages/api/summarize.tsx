
import { SummaryOutput } from '@/types';
import { callGeminiApi, createPrompt } from '@/services/geminiService';
import { 
  extractTextFromGeminiResponse, 
  extractSummary, 
  extractRelatedQuestions,
  generateFallbackContent
} from '@/utils/responseUtils';

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
      JSON.stringify({ error: 'Failed to summarize content' }),
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
    // Create prompt for the AI model, now passing model ID
    const prompt = createPrompt(content, type, conversationHistory, modelId);

    // Call the Gemini API
    const data = await callGeminiApi(prompt, modelId);
    
    // Extract text from Gemini response
    const fullResponse = extractTextFromGeminiResponse(data);
    
    // Parse the response to extract summary and related questions
    const summary = extractSummary(fullResponse);
    const relatedQuestions = extractRelatedQuestions(fullResponse);
    
    // Generate mock sources for demonstration purposes (in a real app, this would come from the AI)
    const sources = generateSources(content, type);

    return {
      summary,
      sources,
      relatedQuestions,
      originalQuery: content, // Save original query for context
      modelUsed: modelId || 'gemini' // Track which model was used
    };
  } catch (error) {
    console.error('Gemini API error:', error);
    
    // If API fails, fall back to a simulated response
    console.log('Falling back to simulated response');
    
    return generateFallbackContent(content, type);
  }
}

/**
 * Generate example sources based on query content (for demonstration purposes)
 */
function generateSources(query: string, type: 'text' | 'url'): any[] {
  if (type === 'url') {
    return [{
      id: '1',
      title: 'Provided URL',
      briefSummary: 'Primary source of information that was analyzed',
      url: query
    }];
  }
  
  // For text queries, generate relevant-looking sources
  const sources = [
    {
      id: '1',
      title: 'Wikipedia',
      briefSummary: `Comprehensive reference on "${query}"`,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(query.replace(/\s+/g, '_'))}`
    }
  ];
  
  // Add additional sources based on query keywords
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('history') || lowerQuery.includes('when') || lowerQuery.includes('past')) {
    sources.push({
      id: '2',
      title: 'History.com',
      briefSummary: `Historical context and timeline`,
      url: `https://www.history.com/search?q=${encodeURIComponent(query)}`
    });
  }
  
  if (lowerQuery.includes('science') || lowerQuery.includes('how') || lowerQuery.includes('why')) {
    sources.push({
      id: '3',
      title: 'Scientific American',
      briefSummary: `Scientific explanation and research`,
      url: `https://www.scientificamerican.com/search/?q=${encodeURIComponent(query)}`
    });
  }
  
  if (lowerQuery.includes('news') || lowerQuery.includes('current') || lowerQuery.includes('recent')) {
    sources.push({
      id: '4',
      title: 'Reuters',
      briefSummary: `Latest news and developments`,
      url: `https://www.reuters.com/search/news?blob=${encodeURIComponent(query)}`
    });
  }
  
  if (lowerQuery.includes('university') || lowerQuery.includes('education') || lowerQuery.includes('academic')) {
    sources.push({
      id: '5',
      title: 'Google Scholar',
      briefSummary: `Academic research and papers`,
      url: `https://scholar.google.com/scholar?q=${encodeURIComponent(query)}`
    });
  }
  
  // Limit to 3-4 sources to avoid overwhelming the user
  return sources.slice(0, 4);
}
