
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
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        title: 'Example Session 2',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    // Convert Date objects to ISO strings for JSON serialization
    const serializedSessions = sessions.map(session => ({
      ...session,
      createdAt: session.createdAt.toISOString(),
      updatedAt: session.updatedAt.toISOString()
    }));
    
    return new Response(
      JSON.stringify(serializedSessions),
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
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Convert Date objects to ISO strings for JSON serialization
    const serializedSession = {
      ...newSession,
      createdAt: newSession.createdAt.toISOString(),
      updatedAt: newSession.updatedAt.toISOString()
    };
    
    return new Response(
      JSON.stringify(serializedSession),
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
