
import React from 'react';
import { AIModel } from '@/types';
import { AVAILABLE_MODELS, selectModel, getCurrentModel } from '@/utils/modelUtils';

const Header: React.FC = () => {
  const [activeModel, setActiveModel] = React.useState<AIModel>(getCurrentModel());

  const handleModelSelect = (modelId: AIModel) => {
    setActiveModel(modelId);
    selectModel(modelId);
  };

  // Use Enter key for accessibility
  const handleKeyDown = (e: React.KeyboardEvent, modelId: AIModel) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleModelSelect(modelId);
    }
  };

  return (
    <header className="w-full bg-background/80 backdrop-blur-sm z-10 py-6 animate-slide-down">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <h1 className="text-3xl font-bold tracking-tight">
            <span aria-hidden="true" className="text-primary">T</span>ack
            <span aria-hidden="true" className="text-primary">I</span>nsight
          </h1>
          <p className="text-muted-foreground text-sm">
            Accessible summarization & source analysis
          </p>
        </div>

        <div 
          role="radiogroup" 
          aria-labelledby="model-selection"
          className="flex flex-wrap gap-2"
        >
          <span id="model-selection" className="sr-only">Select AI model</span>
          
          {AVAILABLE_MODELS.map((model) => (
            <button
              key={model.id}
              role="radio"
              aria-checked={activeModel === model.id}
              tabIndex={0}
              onClick={() => handleModelSelect(model.id)}
              onKeyDown={(e) => handleKeyDown(e, model.id)}
              className={`px-4 py-2 rounded-full transition-all duration-300 focus:ring-2 font-medium text-sm
                ${activeModel === model.id 
                  ? 'bg-primary text-primary-foreground shadow-md' 
                  : 'bg-secondary text-secondary-foreground hover:bg-accent'}`}
              aria-label={`Use ${model.name} model: ${model.description}`}
            >
              {model.name}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
