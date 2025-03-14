
import { ChatSession } from '@/types';

/**
 * API route handler for fetching chat sessions
 * @param request - The incoming request
 * @returns Response with the sessions data
 */
export async function GET(request: Request) {
  try {
    // In a real implementation, you would fetch from a database
    // For now, we'll return mock data
    const sessions: ChatSession[] = [
      {
        id: '1',
        title: 'Example Session 1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Example Session 2',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    
    return new Response(
      JSON.stringify(sessions),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in sessions API:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch sessions' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * API route handler for creating a new chat session
 * @param request - The incoming request
 * @returns Response with the created session data
 */
export async function POST(request: Request) {
  try {
    const { title } = await request.json();
    
    // In a real implementation, you would create in a database
    // For now, we'll return mock data
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: title || 'New Chat',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return new Response(
      JSON.stringify(newSession),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in sessions API:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create session' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
