
import { SummaryOutput } from '@/types';

/**
 * API route handler for fetching chat history for a session
 * @param request - The incoming request
 * @returns Response with the history data
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const sessionId = url.searchParams.get('sessionId');
    
    if (!sessionId) {
      return new Response(
        JSON.stringify({ error: 'Session ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // In a real implementation, you would fetch from a database
    // For now, we'll return mock data
    const history: SummaryOutput[] = [
      {
        summary: 'This is the first message in the conversation.',
        sources: [
          {
            id: '1',
            title: 'Example Source',
            briefSummary: 'A sample source',
            url: 'https://example.com'
          }
        ]
      },
      {
        summary: 'This is the second message in the conversation.',
        sources: []
      }
    ];
    
    return new Response(
      JSON.stringify(history),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in history API:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch history' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * API route handler for saving chat history for a session
 * @param request - The incoming request
 * @returns Response with success status
 */
export async function POST(request: Request) {
  try {
    const { sessionId, history } = await request.json();
    
    if (!sessionId) {
      return new Response(
        JSON.stringify({ error: 'Session ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    if (!history || !Array.isArray(history)) {
      return new Response(
        JSON.stringify({ error: 'Valid history array is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // In a real implementation, you would save to a database
    // For now, we'll just return success
    
    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in history API:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to save history' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
