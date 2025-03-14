
import React, { useState } from 'react';
import { MessageCircle, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
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
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
    setShowDeleteConfirm(false);
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(false);
  };

  return (
    <SidebarMenuItem>
      <SidebarMenuButton 
        isActive={isActive}
        onClick={onSelect}
        tooltip={`Chat ${index + 1}`}
        aria-label={`Select chat ${index + 1}`}
        aria-current={isActive ? 'page' : undefined}
      >
        <MessageCircle size={16} aria-hidden="true" />
        <span className="truncate max-w-[150px]">Chat {index + 1}</span>
        <span className="ml-auto text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(session.updatedAt), { addSuffix: true })}
        </span>
      </SidebarMenuButton>
      
      {showDeleteConfirm ? (
        <DeleteConfirmation 
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      ) : (
        <div className="ml-2">
          <SidebarMenuAction
            onClick={handleDeleteClick}
            showOnHover
            className="p-1"
            aria-label={`Delete chat ${index + 1}`}
          >
            <Trash2 size={14} aria-hidden="true" />
          </SidebarMenuAction>
        </div>
      )}
    </SidebarMenuItem>
  );
};

export default ChatSessionItem;
