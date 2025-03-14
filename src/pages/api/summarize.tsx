
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
    
    // Call the actual summarization service
    // In a real implementation, you would call an external API
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
 * Mock function to call summarization service
 * In a real implementation, this would call an external API
 */
async function callSummarizationService(content: string, type: 'text' | 'url'): Promise<SummaryOutput> {
  // Simulating API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // This is where you would call an external API like Perplexity API
  // For now, we're returning mock data
  return {
    summary: `This is a summary of the ${type === 'url' ? 'URL' : 'text'} content: ${content.substring(0, 50)}...`,
    sources: [
      {
        id: '1',
        title: 'Example Source 1',
        briefSummary: 'This is a sample source summary',
        url: 'https://example.com/1'
      },
      {
        id: '2',
        title: 'Example Source 2',
        briefSummary: 'Another sample source summary',
        url: 'https://example.com/2'
      }
    ]
  };
}
