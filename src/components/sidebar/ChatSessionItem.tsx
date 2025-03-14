import React, { useState } from 'react';
import { MessageCircle, Trash2, Edit, Download } from 'lucide-react';
import { 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarMenuAction 
} from '@/components/ui/sidebar';
import { ChatSession } from '@/types';
import DeleteConfirmation from './DeleteConfirmation';
import { useToast } from '@/components/ui/use-toast';

interface ChatSessionItemProps {
  session: ChatSession;
  index: number;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onRename: (sessionId: string) => void;
  onExport: (sessionId: string) => void;
}

const ChatSessionItem = ({
  session,
  index,
  isActive,
  onSelect,
  onDelete,
  onRename,
  onExport,
}: ChatSessionItemProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { toast } = useToast();

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

  const handleRenameClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onRename(session.id);
  };

  const handleExportClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onExport(session.id);
    toast({
      title: "Chat exported",
      description: "Your chat has been exported to a text file.",
    });
  };

  const chatName = session.title || `Chat ${index + 1}`;

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
        <div className="flex items-center justify-between ml-2 w-24">
          <SidebarMenuAction
            onClick={handleDeleteClick}
            showOnHover
            className="p-1 hover:bg-destructive/10"
            aria-label={`Delete ${chatName}`}
            data-testid={`delete-chat-${session.id}`}
          >
            <Trash2 size={14} className="text-muted-foreground hover:text-destructive" aria-hidden="true" />
          </SidebarMenuAction>
          <SidebarMenuAction
            onClick={handleRenameClick}
            showOnHover
            className="p-1"
            aria-label={`Rename ${chatName}`}
          >
            <Edit size={14} className="text-muted-foreground hover:text-primary" aria-hidden="true" />
          </SidebarMenuAction>
          <SidebarMenuAction
            onClick={handleExportClick}
            showOnHover
            className="p-1"
            aria-label={`Export ${chatName}`}
          >
            <Download size={14} className="text-muted-foreground hover:text-primary" aria-hidden="true" />
          </SidebarMenuAction>
        </div>
      )}
    </SidebarMenuItem>
  );
};

export default ChatSessionItem;
