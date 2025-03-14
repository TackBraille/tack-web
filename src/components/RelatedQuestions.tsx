
import React from 'react';
import { MessageSquareMore } from 'lucide-react';

interface RelatedQuestionsProps {
  questions: string[];
  onQuestionClick: (question: string) => void;
}

const RelatedQuestions: React.FC<RelatedQuestionsProps> = ({ questions, onQuestionClick }) => {
  if (!questions || questions.length === 0) return null;
  
  return (
    <section className="w-full max-w-3xl mx-auto mb-8" aria-labelledby="related-questions-heading">
      <h2 
        id="related-questions-heading" 
        className="text-lg font-medium mb-3 flex items-center gap-2"
      >
        <MessageSquareMore size={18} aria-hidden="true" />
        <span>Related Questions</span>
      </h2>
      
      <div className="flex flex-wrap gap-2" role="list">
        {questions.map((question, index) => (
          <button
            key={index}
            onClick={() => onQuestionClick(question)}
            className="bg-secondary/50 hover:bg-secondary px-3 py-1.5 rounded-full text-sm transition-colors flex items-center gap-1"
            aria-label={`Add related question to input: ${question}`}
            role="listitem"
          >
            {question}
          </button>
        ))}
      </div>
      <div className="text-xs text-muted-foreground mt-2">
        Click a question to add it to the input box
      </div>
    </section>
  );
};

export default RelatedQuestions;
