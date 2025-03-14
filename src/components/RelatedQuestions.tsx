
import React from 'react';

interface RelatedQuestionsProps {
  questions: string[];
  onQuestionClick: (question: string) => void;
}

const RelatedQuestions: React.FC<RelatedQuestionsProps> = ({ questions, onQuestionClick }) => {
  // Take only the first question if available
  const singleQuestion = questions && questions.length > 0 ? questions[0] : null;

  if (!singleQuestion) return null;
  
  return (
    <section className="w-full max-w-3xl mx-auto mb-8">
      <h2 className="text-lg font-medium mb-3">Follow-up Question</h2>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onQuestionClick(singleQuestion)}
          className="bg-secondary/50 hover:bg-secondary px-3 py-1.5 rounded-full text-sm transition-colors"
        >
          {singleQuestion}
        </button>
      </div>
    </section>
  );
};

export default RelatedQuestions;
