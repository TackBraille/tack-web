
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
    const { content, type, model } = await request.json();
    
    if (!content) {
      return new Response(
        JSON.stringify({ error: 'Content is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Log which model was requested
    console.log(`Model requested: ${model || 'default'}`);
    
    // Call the Gemini service for summarization
    const result = await callGeminiService(content, type, model);
    
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
async function callGeminiService(content: string, type: 'text' | 'url', modelId?: string): Promise<SummaryOutput> {
  try {
    // Create prompt for the AI model
    const prompt = createPrompt(content, type);

    // Call the Gemini API
    const data = await callGeminiApi(prompt, modelId);
    
    // Extract text from Gemini response
    const fullResponse = extractTextFromGeminiResponse(data);
    
    // Parse the response to extract summary and related questions
    const summary = extractSummary(fullResponse);
    const relatedQuestions = extractRelatedQuestions(fullResponse);

    return {
      summary,
      sources: type === 'url' ? [{
        id: '1',
        title: 'Provided URL',
        briefSummary: 'Original source',
        url: content
      }] : [],
      relatedQuestions
    };
  } catch (error) {
    console.error('Gemini API error:', error);
    
    // If API fails, fall back to a simulated response
    console.log('Falling back to simulated response');
    
    return generateFallbackContent(content, type);
  }
}
