
import React from 'react';
import { Trash2, X } from 'lucide-react';
import { SidebarMenuAction } from '@/components/ui/sidebar';

interface DeleteConfirmationProps {
  onConfirm: (e: React.MouseEvent) => void;
  onCancel: (e: React.MouseEvent) => void;
  itemName?: string;
}

const DeleteConfirmation = ({ onConfirm, onCancel, itemName = 'item' }: DeleteConfirmationProps) => {
  return (
    <div 
      className="flex items-center gap-1 ml-2"
      role="alertdialog"
      aria-labelledby="delete-confirmation-title"
    >
      <span id="delete-confirmation-title" className="sr-only">
        Confirm deletion of {itemName}
      </span>
      <SidebarMenuAction
        onClick={onConfirm}
        aria-label={`Confirm delete ${itemName}`}
      >
        <Trash2 size={14} className="text-destructive" aria-hidden="true" />
      </SidebarMenuAction>
      <SidebarMenuAction
        onClick={onCancel}
        aria-label={`Cancel delete ${itemName}`}
      >
        <X size={14} aria-hidden="true" />
      </SidebarMenuAction>
    </div>
  );
};

export default DeleteConfirmation;
