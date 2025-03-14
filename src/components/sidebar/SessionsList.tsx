
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
  onRenameSession: (sessionId: string) => void;
  onExportSession: (sessionId: string) => void;
  filteredSessions?: ChatSession[];
  isSearching?: boolean;
}

const SessionsList = ({
  sessions,
  currentSession,
  onSelectSession,
  onDeleteSession,
  onRenameSession,
  onExportSession,
  filteredSessions,
  isSearching = false,
}: SessionsListProps) => {
  const displaySessions = isSearching && filteredSessions ? filteredSessions : sessions;
  
  return (
    <ScrollArea 
      className="h-[calc(100vh-240px)]" 
      aria-labelledby="recent-chats-label"
    >
      <SidebarMenu>
        {displaySessions.length > 0 ? (
          displaySessions.map((session, index) => (
            <ChatSessionItem
              key={session.id}
              session={session}
              index={index}
              isActive={currentSession === session.id}
              onSelect={() => onSelectSession(session.id)}
              onDelete={() => onDeleteSession(session.id)}
              onRename={onRenameSession}
              onExport={onExportSession}
            />
          ))
        ) : (
          isSearching ? (
            <div className="px-3 py-4 text-sm text-muted-foreground flex items-center justify-center">
              <p>No matching chats found.</p>
            </div>
          ) : (
            <EmptyState />
          )
        )}
      </SidebarMenu>
    </ScrollArea>
  );
};

export default SessionsList;
