
import React from 'react';
import { Trash2, X } from 'lucide-react';
import { SidebarMenuAction } from '@/components/ui/sidebar';

interface DeleteConfirmationProps {
  onConfirm: (e: React.MouseEvent) => void;
  onCancel: (e: React.MouseEvent) => void;
}

const DeleteConfirmation = ({ onConfirm, onCancel }: DeleteConfirmationProps) => {
  return (
    <div className="flex items-center gap-1 ml-2">
      <SidebarMenuAction
        onClick={onConfirm}
        aria-label="Confirm delete"
      >
        <Trash2 size={14} className="text-destructive" aria-hidden="true" />
      </SidebarMenuAction>
      <SidebarMenuAction
        onClick={onCancel}
        aria-label="Cancel delete"
      >
        <X size={14} aria-hidden="true" />
      </SidebarMenuAction>
    </div>
  );
};

export default DeleteConfirmation;
