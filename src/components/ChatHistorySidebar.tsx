
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { PlusCircle, MessageCircle, PanelLeft, Trash2 } from 'lucide-react';
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
import { toast } from '@/components/ui/use-toast';
import { formatDistanceToNow } from 'date-fns';

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
          <PlusCircle size={16} />
          <span>New Chat</span>
        </Button>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Recent Chats</SidebarGroupLabel>
          <ScrollArea className="h-[calc(100vh-180px)]">
            <SidebarMenu>
              {sessions.length > 0 ? (
                sessions.map((session) => (
                  <SidebarMenuItem key={session.id}>
                    <SidebarMenuButton 
                      isActive={currentSession === session.id}
                      onClick={() => onSelectSession(session.id)}
                      tooltip={session.title}
                    >
                      <MessageCircle size={16} />
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
                      <Trash2 size={14} />
                    </SidebarMenuAction>
                  </SidebarMenuItem>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  No chat history yet.
                </div>
              )}
            </SidebarMenu>
          </ScrollArea>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-3">
        <div className="text-xs text-muted-foreground">
          {history.length > 0 ? `${history.length} message${history.length > 1 ? 's' : ''} in this chat` : 'Start a new chat'}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default ChatHistorySidebar;
