
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { PlusCircle, MessageCircle, Trash2, X } from 'lucide-react';
import { ChatSession, SummaryOutput } from '@/types';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuAction,
} from '@/components/ui/sidebar';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface ChatHistorySidebarProps {
  sessions: ChatSession[];
  currentSession?: string;
  onNewChat: () => void;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  history: SummaryOutput[];
}

const ChatHistorySidebar = ({
  sessions,
  currentSession,
  onNewChat,
  onSelectSession,
  onDeleteSession,
  history,
}: ChatHistorySidebarProps) => {
  return (
    <Sidebar>
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
          <ScrollArea className="h-[calc(100vh-180px)]" aria-labelledby="recent-chats-label">
            <SidebarMenu>
              {sessions.length > 0 ? (
                sessions.map((session) => (
                  <SidebarMenuItem key={session.id}>
                    <SidebarMenuButton 
                      isActive={currentSession === session.id}
                      onClick={() => onSelectSession(session.id)}
                      tooltip={session.title}
                      aria-label={`Select chat: ${session.title}`}
                      aria-current={currentSession === session.id ? 'page' : undefined}
                    >
                      <MessageCircle size={16} aria-hidden="true" />
                      <span className="truncate">{session.title}</span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        {formatDistanceToNow(session.updatedAt, { addSuffix: true })}
                      </span>
                    </SidebarMenuButton>
                    <SidebarMenuAction
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(session.id);
                      }}
                      showOnHover
                      aria-label={`Delete chat ${session.title}`}
                    >
                      <Trash2 size={14} aria-hidden="true" />
                    </SidebarMenuAction>
                  </SidebarMenuItem>
                ))
              ) : (
                <div className="px-3 py-4 text-sm text-muted-foreground flex items-center justify-center">
                  <p>No chat history yet.</p>
                </div>
              )}
            </SidebarMenu>
          </ScrollArea>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-3 border-t">
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
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
              aria-label={currentSession ? "Close current chat" : "Close sidebar"}
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
