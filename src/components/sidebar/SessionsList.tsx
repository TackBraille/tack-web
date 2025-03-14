
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatSession } from '@/types';
import { SidebarMenu } from '@/components/ui/sidebar';
import ChatSessionItem from './ChatSessionItem';
import EmptyState from './EmptyState';

interface SessionsListProps {
  sessions: ChatSession[];
  currentSession?: string;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
}

const SessionsList = ({
  sessions,
  currentSession,
  onSelectSession,
  onDeleteSession,
}: SessionsListProps) => {
  return (
    <ScrollArea 
      className="h-[calc(100vh-180px)]" 
      aria-labelledby="recent-chats-label"
    >
      <SidebarMenu>
        {sessions.length > 0 ? (
          sessions.map((session, index) => (
            <ChatSessionItem
              key={session.id}
              session={session}
              index={index}
              isActive={currentSession === session.id}
              onSelect={() => onSelectSession(session.id)}
              onDelete={() => onDeleteSession(session.id)}
            />
          ))
        ) : (
          <EmptyState />
        )}
      </SidebarMenu>
    </ScrollArea>
  );
};

export default SessionsList;
