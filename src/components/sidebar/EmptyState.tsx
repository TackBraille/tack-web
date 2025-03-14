
import React from 'react';

const EmptyState = () => {
  return (
    <div 
      className="px-3 py-4 text-sm text-muted-foreground flex items-center justify-center"
      aria-live="polite"
    >
      <p>No chat history yet. Start a new chat to begin.</p>
    </div>
  );
};

export default EmptyState;
