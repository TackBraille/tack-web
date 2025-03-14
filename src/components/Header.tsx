
import React from 'react';
import { AIModel } from '@/types';
import { AVAILABLE_MODELS, selectModel, getCurrentModel } from '@/utils/modelUtils';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

const Header: React.FC = () => {
  const [activeModel, setActiveModel] = React.useState<AIModel>(getCurrentModel());
  const [isMobile, setIsMobile] = React.useState<boolean>(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

        {isMobile ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                {AVAILABLE_MODELS.find(m => m.id === activeModel)?.name || 'Select Model'}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuRadioGroup value={activeModel} onValueChange={(value) => handleModelSelect(value as AIModel)}>
                {AVAILABLE_MODELS.map((model) => (
                  <DropdownMenuRadioItem
                    key={model.id}
                    value={model.id}
                    className="cursor-pointer"
                  >
                    {model.name}
                    <span className="ml-2 text-xs text-muted-foreground">
                      {model.description.substring(0, 20)}...
                    </span>
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div 
            role="radiogroup" 
            aria-labelledby="model-selection"
            className="flex flex-wrap gap-2 justify-center"
          >
            <span id="model-selection" className="sr-only">Select AI model</span>
            
            <ToggleGroup type="single" value={activeModel} onValueChange={(value) => value && handleModelSelect(value as AIModel)}>
              {AVAILABLE_MODELS.map((model) => (
                <ToggleGroupItem
                  key={model.id}
                  value={model.id}
                  aria-checked={activeModel === model.id}
                  aria-label={`Use ${model.name} model: ${model.description}`}
                  className={`transition-all duration-300 focus:ring-2`}
                >
                  {model.name}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
