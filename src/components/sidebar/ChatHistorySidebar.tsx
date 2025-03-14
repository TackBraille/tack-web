
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, MoonStar, Sun } from 'lucide-react';
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
import SearchBox from './SearchBox';
import RenameDialog from './RenameDialog';
import { useTheme } from 'next-themes';

interface ChatHistorySidebarProps {
  sessions: ChatSession[];
  currentSession?: string;
  onNewChat: () => void;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onRenameSession: (sessionId: string, newTitle: string) => void;
  onExportSession: (sessionId: string) => void;
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
  onExportSession,
  history,
  setHistory,
}: ChatHistorySidebarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [renameSessionId, setRenameSessionId] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();
  
  const currentSessionTitle = currentSession 
    ? sessions.find(s => s.id === currentSession)?.title || "Untitled Chat" 
    : "Untitled Chat";

  const filteredSessions = sessions.filter(session => {
    const sessionTitle = session.title || `Chat ${sessions.indexOf(session) + 1}`;
    return sessionTitle.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleRenameClick = (sessionId: string) => {
    setRenameSessionId(sessionId);
  };

  const handleRenameSession = (sessionId: string, newTitle: string) => {
    onRenameSession(sessionId, newTitle);
    setRenameSessionId(null);
  };

  const handleCloseRename = () => {
    setRenameSessionId(null);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Sidebar aria-label="Chat history sidebar">
      <SidebarHeader className="p-3 space-y-3">
        <Button 
          variant="default" 
          className="w-full justify-start gap-2" 
          onClick={onNewChat}
          aria-label="New chat"
        >
          <PlusCircle size={16} aria-hidden="true" />
          <span>New Chat</span>
        </Button>
        <SearchBox onSearch={handleSearch} />
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <div className="flex justify-between items-center px-2">
            <SidebarGroupLabel id="recent-chats-label">
              {searchQuery ? 'Search Results' : 'Recent Chats'}
            </SidebarGroupLabel>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7" 
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <Sun size={14} className="text-muted-foreground" />
              ) : (
                <MoonStar size={14} className="text-muted-foreground" />
              )}
            </Button>
          </div>
          <SessionsList 
            sessions={sessions}
            currentSession={currentSession}
            onSelectSession={onSelectSession}
            onDeleteSession={onDeleteSession}
            onRenameSession={handleRenameClick}
            onExportSession={onExportSession}
            filteredSessions={filteredSessions}
            isSearching={searchQuery.length > 0}
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

      {renameSessionId && (
        <RenameDialog
          isOpen={!!renameSessionId}
          sessionId={renameSessionId}
          currentTitle={sessions.find(s => s.id === renameSessionId)?.title || `Chat ${sessions.findIndex(s => s.id === renameSessionId) + 1}`}
          onRename={handleRenameSession}
          onClose={handleCloseRename}
        />
      )}
    </Sidebar>
  );
};

export default ChatHistorySidebar;
