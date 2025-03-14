
import React from 'react';
import { SummaryOutput as SummaryType } from '@/types';

interface PreviousResponsesProps {
  history: SummaryType[];
}

const PreviousResponses: React.FC<PreviousResponsesProps> = ({ history }) => {
  return (
    <section className="w-full max-w-3xl mx-auto mb-8">
      <h2 className="text-xl font-semibold mb-3">Previous Responses</h2>
      <div className="space-y-4">
        {history.slice(0, -1).reverse().map((item, index) => (
          <div key={index} className="bg-card border rounded-lg p-4 opacity-75 hover:opacity-100 transition-opacity">
            <p className="text-sm line-clamp-2">{item.summary}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PreviousResponses;
