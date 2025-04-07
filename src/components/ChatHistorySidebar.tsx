
import React, { useState } from 'react';
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
import { toast } from '@/components/ui/use-toast';

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
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleDeleteClick = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    setConfirmDeleteId(sessionId);
  };

  const confirmDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirmDeleteId) {
      onDeleteSession(confirmDeleteId);
      toast({
        title: "Chat deleted",
        description: "The chat has been removed from your history.",
      });
      setConfirmDeleteId(null);
    }
  };

  const cancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmDeleteId(null);
  };

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
                sessions.map((session, index) => (
                  <SidebarMenuItem key={session.id}>
  <div className="flex items-center justify-between w-full">
    <SidebarMenuButton 
      isActive={currentSession === session.id}
      onClick={() => onSelectSession(session.id)}
      tooltip={`Chat ${index + 1}`}
      aria-label={`Select chat ${index + 1}`}
      aria-current={currentSession === session.id ? 'page' : undefined}
      className="flex-1"
    >
      <MessageCircle size={16} aria-hidden="true" />
      <span className="truncate max-w-[150px]">Chat {index + 1}</span>
      <span className="ml-auto text-xs text-muted-foreground">
        {formatDistanceToNow(new Date(session.updatedAt), { addSuffix: true })}
      </span>
    </SidebarMenuButton>
    
    {confirmDeleteId === session.id ? (
      <div className="flex items-center gap-1 ml-auto">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6" 
          onClick={confirmDelete}
          aria-label="Confirm delete"
        >
          <Trash2 size={14} className="text-destructive" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6" 
          onClick={cancelDelete}
          aria-label="Cancel delete"
        >
          <X size={14} />
        </Button>
      </div>
    ) : (
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 opacity-0 group-hover:opacity-100"
        onClick={(e) => handleDeleteClick(e, session.id)}
        aria-label={`Delete chat ${index + 1}`}
      >
        <Trash2 size={14} />
      </Button>
    )}
  </div>
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
              onClick={() => {
                setHistory([]);
                onDeleteSession(currentSession);
                onNewChat();
              }}
              aria-label="Clear current chat"
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
