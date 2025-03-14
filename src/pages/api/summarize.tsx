
import { SummaryOutput } from '@/types';

/**
 * API route handler for summarizing content
 * @param request - The incoming request
 * @returns Response with the summary data
 */
export async function POST(request: Request) {
  try {
    const { content, type } = await request.json();
    
    if (!content) {
      return new Response(
        JSON.stringify({ error: 'Content is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const result = await callSummarizationService(content, type);
    
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
 * Function to call Together AI summarization service
 */
async function callSummarizationService(content: string, type: 'text' | 'url'): Promise<SummaryOutput> {
  const TOGETHER_API_KEY = '78d84b5a9b94f0638bd4715a45b6cf229cfdd66eeed83c8d417d1d91fa792607'; // Your provided API key
  
  const prompt = type === 'url' 
    ? `Please summarize the content from this URL: ${content}`
    : `Please summarize this text: ${content}`;

  try {
    const response = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOGETHER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistralai/Mixtral-8x7B-Instruct-v0.1', // Using Mixtral as an example model
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI that provides concise summaries.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 200, // Adjust based on desired summary length
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`Together AI API request failed: ${response.status}`);
    }

    const data = await response.json();
    const summary = data.choices[0].message.content;

    return {
      summary,
      sources: type === 'url' ? [{
        id: '1',
        title: 'Provided URL',
        briefSummary: 'Original source',
        url: content
      }] : []
    };
  } catch (error) {
    console.error('Together AI API error:', error);
    throw error;
  }
}
