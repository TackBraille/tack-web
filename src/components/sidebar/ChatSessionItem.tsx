
import React, { useState } from 'react';
import { MessageCircle, Trash2 } from 'lucide-react';
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
    console.log('Deleting session:', session.id);
    onDelete();
    setShowDeleteConfirm(false);
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setShowDeleteConfirm(false);
  };

  const chatName = `Chat ${index + 1}`;

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
        <div className="ml-2 flex items-center">
          <SidebarMenuAction
            onClick={handleDeleteClick}
            showOnHover
            className="p-1 hover:bg-destructive/10"
            aria-label={`Delete ${chatName}`}
            data-testid={`delete-chat-${session.id}`}
          >
            <Trash2 size={14} className="text-muted-foreground hover:text-destructive" aria-hidden="true" />
          </SidebarMenuAction>
        </div>
      )}
    </SidebarMenuItem>
  );
};

export default ChatSessionItem;
