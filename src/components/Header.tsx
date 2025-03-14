
import React, { useState } from 'react';
import { AIModel } from '@/types';
import { AVAILABLE_MODELS, selectModel, getCurrentModel, getCurrentSubModel } from '@/utils/modelUtils';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown, Settings } from 'lucide-react';

const Header: React.FC = () => {
  const [activeModel, setActiveModel] = useState<AIModel>(getCurrentModel());
  const [activeSubModel, setActiveSubModel] = useState<string | null>(getCurrentSubModel());
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);

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
    
    // Reset sub-model when model changes
    const newModel = AVAILABLE_MODELS.find(m => m.id === modelId);
    if (newModel?.subModels && newModel.subModels.length > 0) {
      setActiveSubModel(newModel.subModels[0].id);
    }
  };

  const handleSubModelSelect = (subModelId: string) => {
    setActiveSubModel(subModelId);
    selectModel(activeModel, subModelId);
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
           Where Accessibility Meets Intelligence
          </p>
        </div>

        {isMobile ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Settings className="h-4 w-4" aria-hidden="true" />
                <span>Models</span>
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Select AI Model</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {AVAILABLE_MODELS.map((model) => (
                <DropdownMenuSub key={model.id}>
                  <DropdownMenuSubTrigger
                    className={activeModel === model.id ? "bg-accent" : ""}
                  >
                    {model.name}
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup 
                      value={activeModel === model.id ? activeSubModel || "" : ""}
                      onValueChange={handleSubModelSelect}
                    >
                      {model.subModels?.map((subModel) => (
                        <DropdownMenuRadioItem
                          key={subModel.id}
                          value={subModel.id}
                          className="cursor-pointer"
                          onClick={() => {
                            if (activeModel !== model.id) {
                              handleModelSelect(model.id);
                            }
                          }}
                        >
                          {subModel.name}
                          <span className="ml-2 text-xs text-muted-foreground">
                            {subModel.description.substring(0, 20)}...
                          </span>
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex flex-col items-end gap-2">
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
            
            {activeModel && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-xs h-7 px-2">
                    {AVAILABLE_MODELS.find(m => m.id === activeModel)?.subModels?.find(s => s.id === activeSubModel)?.name || "Select variant"}
                    <ChevronDown className="h-3 w-3 ml-1" aria-hidden="true" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Select model variant</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup 
                    value={activeSubModel || ""}
                    onValueChange={handleSubModelSelect}
                  >
                    {AVAILABLE_MODELS.find(m => m.id === activeModel)?.subModels?.map((subModel) => (
                      <DropdownMenuRadioItem
                        key={subModel.id}
                        value={subModel.id}
                        className="cursor-pointer"
                      >
                        {subModel.name}
                        <span className="ml-2 text-xs text-muted-foreground">
                          {subModel.description}
                        </span>
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
