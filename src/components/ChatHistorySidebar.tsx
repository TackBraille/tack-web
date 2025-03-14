
import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { PlusCircle, MessageCircle, Trash2, X, Pencil } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';

interface ChatHistorySidebarProps {
  sessions: ChatSession[];
  currentSession?: string;
  onNewChat: () => void;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onRenameSession?: (sessionId: string, newTitle: string) => void;
  history: SummaryOutput[];
  setHistory: React.Dispatch<React.SetStateAction<SummaryOutput[]>>;
}

const ChatHistorySidebar = ({
  sessions,
  currentSession,
  onNewChat,
  onSelectSession,
  onDeleteSession,
  onRenameSession,
  history,
  setHistory,
}: ChatHistorySidebarProps) => {
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [sessionToRename, setSessionToRename] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleRenameClick = (e: React.MouseEvent, sessionId: string, currentTitle: string) => {
    e.stopPropagation();
    setSessionToRename(sessionId);
    setNewTitle(currentTitle);
    setIsRenameDialogOpen(true);
  };

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sessionToRename && onRenameSession && newTitle.trim()) {
      onRenameSession(sessionToRename, newTitle.trim());
      setIsRenameDialogOpen(false);
      setSessionToRename(null);
      setNewTitle('');
    }
  };

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
    <>
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
                        <span className="truncate max-w-[150px]">{session.title}</span>
                        <span className="ml-auto text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(session.updatedAt), { addSuffix: true })}
                        </span>
                      </SidebarMenuButton>
                      
                      {confirmDeleteId === session.id ? (
                        <div className="flex items-center gap-1 ml-1">
                          <SidebarMenuAction
                            onClick={confirmDelete}
                            aria-label="Confirm delete"
                          >
                            <Trash2 size={14} className="text-destructive" aria-hidden="true" />
                          </SidebarMenuAction>
                          <SidebarMenuAction
                            onClick={cancelDelete}
                            aria-label="Cancel delete"
                          >
                            <X size={14} aria-hidden="true" />
                          </SidebarMenuAction>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 ml-1">
                          <SidebarMenuAction
                            onClick={(e) => handleRenameClick(e, session.id, session.title)}
                            showOnHover
                            className="p-1"
                            aria-label={`Rename chat ${session.title}`}
                          >
                            <Pencil size={14} aria-hidden="true" />
                          </SidebarMenuAction>
                          <SidebarMenuAction
                            onClick={(e) => handleDeleteClick(e, session.id)}
                            showOnHover
                            className="p-1"
                            aria-label={`Delete chat ${session.title}`}
                          >
                            <Trash2 size={14} aria-hidden="true" />
                          </SidebarMenuAction>
                        </div>
                      )}
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

      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Chat</DialogTitle>
            <DialogDescription>
              Enter a new name for this chat session.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRenameSubmit}>
            <div className="grid gap-4 py-4">
              <Input
                id="rename-input"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Enter chat name"
                className="col-span-3"
                aria-label="New chat name"
                autoFocus
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={!newTitle.trim()}>
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChatHistorySidebar;
