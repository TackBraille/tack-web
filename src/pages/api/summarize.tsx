
import { SummaryOutput } from '@/types';

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
    
    // Use Anthropic API for summarization
    const result = await callAnthropicService(content, type, model);
    
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
 * Function to call Anthropic Claude API for summarization
 */
async function callAnthropicService(content: string, type: 'text' | 'url', modelId?: string): Promise<SummaryOutput> {
  // This would normally be in an environment variable
  const ANTHROPIC_API_KEY = 'sk-ant-api03-demo-key-for-testing';
  
  const prompt = type === 'url' 
    ? `Please summarize the content from this URL: ${content}. Include 3 related questions about the content.`
    : `Please summarize this text: ${content}. Include 3 related questions about the content.`;

  try {
    // Determine which model to use based on modelId
    // Claude models: claude-3-opus-20240229, claude-3-sonnet-20240229, claude-3-haiku-20240307
    const modelToUse = modelId === 'claude' 
      ? 'claude-3-opus-20240229'
      : 'claude-3-haiku-20240307'; // Default to faster model for other selections

    console.log(`Using Claude model: ${modelToUse}`);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelToUse,
        max_tokens: 1000,
        temperature: 0.7,
        system: "You are a helpful AI that provides concise summaries. When asked to summarize, also include 3 related questions that would be valuable follow-ups.",
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API request failed: ${response.status}`);
    }

    const data = await response.json();
    const fullResponse = data.content[0].text;
    
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
    console.error('Anthropic API error:', error);
    
    // If API fails, fall back to a simulated response
    console.log('Falling back to simulated response');
    
    const summary = `Unable to generate a real-time summary for: "${content.substring(0, 50)}...". Using fallback content.
    
    This is a simulated fallback summary. The AI service may be temporarily unavailable or there might be issues with the API connection. Please try again later.`;

    const relatedQuestions = [
      `What are the main points of ${content.substring(0, 10)}...?`,
      `Can you explain more about ${content.substring(0, 8)}...?`,
      `What are practical applications of ${content.substring(0, 12)}...?`
    ];

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
  }
}

/**
 * Helper function to extract the summary from LLM response
 */
function extractSummary(response: string): string {
  // Look for "Summary:" or just return the whole thing if we can't find it
  const summaryMatch = response.match(/Summary:([\s\S]*?)(?:Related Questions:|$)/i);
  if (summaryMatch && summaryMatch[1]) {
    return summaryMatch[1].trim();
  }
  
  // If no "Summary:" section found, return everything before "Related Questions:"
  const relatedQuestionsIndex = response.indexOf("Related Questions:");
  if (relatedQuestionsIndex > -1) {
    return response.substring(0, relatedQuestionsIndex).trim();
  }
  
  // If no pattern is found, just return the whole response
  return response;
}

/**
 * Helper function to extract related questions from LLM response
 */
function extractRelatedQuestions(response: string): string[] {
  const questionsMatch = response.match(/Related Questions:([\s\S]*)/i);
  
  if (questionsMatch && questionsMatch[1]) {
    // Try to split by numbered list (1., 2., 3.)
    const questionText = questionsMatch[1].trim();
    const questions = questionText.split(/\d+\.\s+/)
      .map(q => q.trim())
      .filter(q => q.length > 0);
    
    if (questions.length > 0) {
      return questions;
    }
    
    // Fallback to splitting by newlines
    return questionText.split('\n')
      .map(line => line.trim().replace(/^[•\-*]\s+/, ''))
      .filter(line => line.length > 0 && line.endsWith('?'))
      .slice(0, 3);
  }
  
  // Fallback: Look for question marks in the text
  const questionRegex = /(\b[^.!?]+\?)/g;
  const allQuestions = [...response.matchAll(questionRegex)]
    .map(match => match[0].trim())
    .filter(q => q.length > 10 && q.length < 100);
  
  return allQuestions.slice(0, 3);
}
