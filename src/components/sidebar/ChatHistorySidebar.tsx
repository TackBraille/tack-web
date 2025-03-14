
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { ChatSession, SummaryOutput } from '@/types';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import SessionsList from './SessionsList';

interface ChatHistorySidebarProps {
  sessions: ChatSession[];
  currentSession?: string;
  onNewChat: () => void;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  history: SummaryOutput[];
  setHistory: React.Dispatch<React.SetStateAction<SummaryOutput[]>>;
}

const ChatHistorySidebar = ({
  sessions,
  currentSession,
  onNewChat,
  onSelectSession,
  onDeleteSession,
  history,
  setHistory,
}: ChatHistorySidebarProps) => {
  return (
    <Sidebar aria-label="Chat history sidebar">
      <SidebarHeader className="p-3">
        <Button 
          variant="default" 
          className="w-full justify-start gap-2" 
          onClick={onNewChat}
          aria-label="New chat"
        >
          <PlusCircle size={16} aria-hidden="true" />
          <span>New Chat</span>
        </Button>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel id="recent-chats-label">Recent Chats</SidebarGroupLabel>
          <SessionsList 
            sessions={sessions}
            currentSession={currentSession}
            onSelectSession={onSelectSession}
            onDeleteSession={onDeleteSession}
          />
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-3 border-t">
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground" aria-live="polite">
            {history.length > 0 ? (
              <Badge variant="outline" className="gap-1">
                <span>{history.length}</span> 
                <span>{history.length === 1 ? 'message' : 'messages'}</span>
              </Badge>
            ) : (
              'Start a new chat'
            )}
          </div>
          {currentSession && history.length > 0 && (
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-7 w-7 p-0" 
              onClick={() => {
                setHistory([]);
                onDeleteSession(currentSession);
                onNewChat();
              }}
              aria-label="Clear current chat and start new"
            >
              <X size={14} aria-hidden="true" />
            </Button>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default ChatHistorySidebar;
