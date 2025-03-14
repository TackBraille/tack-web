
import React from 'react';

interface RelatedQuestionsProps {
  questions: string[];
  onQuestionClick: (question: string) => void;
}

const RelatedQuestions: React.FC<RelatedQuestionsProps> = ({ questions, onQuestionClick }) => {
  return (
    <section className="w-full max-w-3xl mx-auto mb-8">
      <h2 className="text-lg font-medium mb-3">Related Questions</h2>
      <div className="flex flex-wrap gap-2">
        {questions.map((question, index) => (
          <button
            key={index}
            onClick={() => onQuestionClick(question)}
            className="bg-secondary/50 hover:bg-secondary px-3 py-1.5 rounded-full text-sm transition-colors"
          >
            {question}
          </button>
        ))}
      </div>
    </section>
  );
};

export default RelatedQuestions;
