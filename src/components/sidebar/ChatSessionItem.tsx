
import React, { useState } from 'react';
import { MessageCircle, Trash2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { updateChatSession } from '@/utils/chatSessionUtils';
import { 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarMenuAction 
} from '@/components/ui/sidebar';
import { ChatSession } from '@/types';
import DeleteConfirmation from './DeleteConfirmation';

interface ChatSessionItemProps {
  session: ChatSession;
  index: number;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

const ChatSessionItem = ({
  session,
  index,
  isActive,
  onSelect,
  onDelete,
}: ChatSessionItemProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    console.log('Deleting session from UI item:', session.id);
    // Call onDelete with the session id. The parent handler may accept an id or be a closure.
    try {
      // If parent expects an id, pass it. If parent is a zero-arg closure, extra args are ignored.
      (onDelete as unknown as (id?: string) => void)(session.id);
    } catch (err) {
      // Fallback: call without arguments
      try { onDelete(); } catch (err2) { console.error('Failed to call onDelete', err2); }
    }
    setShowDeleteConfirm(false);
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setShowDeleteConfirm(false);
  };

  const chatName = `Chat ${index + 1}`;

  const handleAutoReadToggle = (v: boolean) => {
    try {
      updateChatSession(session.id, { autoRead: !!v });
    } catch (err) {
      console.error('Failed to update autoRead', err);
    }
  };

  return (
    <SidebarMenuItem>
      <SidebarMenuButton 
        isActive={isActive}
        onClick={onSelect}
        tooltip={chatName}
        aria-label={`Select ${chatName}`}
        aria-current={isActive ? 'page' : undefined}
      >
        <MessageCircle size={16} aria-hidden="true" />
        <span className="truncate max-w-[150px]">{chatName}</span>
      </SidebarMenuButton>
      
      {showDeleteConfirm ? (
        <DeleteConfirmation 
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          itemName={chatName}
        />
      ) : (
        <div className="ml-2 flex items-center gap-2">
          <SidebarMenuAction
            onClick={handleDeleteClick}
            showOnHover
            className="p-1 hover:bg-destructive/10"
            aria-label={`Delete ${chatName}`}
            data-testid={`delete-chat-${session.id}`}
          >
            <Trash2 size={14} className="text-muted-foreground hover:text-destructive" aria-hidden="true" />
          </SidebarMenuAction>
          <div className="flex items-center gap-1">
            <label className="sr-only">Auto read</label>
            <Switch checked={!!session.autoRead} onCheckedChange={(v) => handleAutoReadToggle(!!v)} aria-label="Auto read this chat" />
          </div>
        </div>
      )}
    </SidebarMenuItem>
  );
};

export default ChatSessionItem;
