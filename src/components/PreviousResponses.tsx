
import React from 'react';
import { SummaryOutput as SummaryType } from '@/types';

interface PreviousResponsesProps {
  history: SummaryType[];
}

const PreviousResponses: React.FC<PreviousResponsesProps> = ({ history }) => {
  return (
    <section className="w-full  max-w-3xl mx-auto mb-24">
      <h2 className="text-xl font-semibold mb-3">Previous Conversations</h2>
      <div className="space-y-4">
        {history.slice(0, -1).reverse().map((item, index) => (
          <div key={index} className="bg-card border rounded-lg p-4 opacity-75 hover:opacity-100 transition-opacity">
            {item.originalQuery && (
              <div className="mb-2">
                <p className="font-medium text-sm text-primary">Question:</p>
                <p className="text-sm">{item.originalQuery}</p>
              </div>
            )}
            <div>
              <p className="font-medium text-sm text-primary">Answer:</p>
              <p className="text-sm">{item.summary}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PreviousResponses;
