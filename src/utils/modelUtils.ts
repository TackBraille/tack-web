
import { AIModel, ModelConfig, SubModel } from '@/types';
import { toast } from '@/components/ui/use-toast';

// Model configurations
export const AVAILABLE_MODELS: ModelConfig[] = [
  { 
    id: 'gemini',
    name: 'Gemini',
    description: 'Google\'s Generative AI model for comprehensive text generation',
    subModels: [
      { id: 'gemini-2.0-flash', name: 'Gemini Flash', description: 'Fast response model' },
      { id: 'gemini-2.0-pro', name: 'Gemini Pro', description: 'Balanced performance model' }
    ]
  },
  { 
    id: 'chatgpt',
    name: 'ChatGPT',
    description: 'OpenAI\'s GPT model for versatile text generation',
    subModels: [
      { id: 'gpt-4o', name: 'GPT-4o', description: 'Most capable GPT-4 model' },
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini', description: 'Faster and more efficient GPT-4 model' }
    ]
  },
  { 
    id: 'perplexity',
    name: 'Perplexity',
    description: 'Optimized for knowledge retrieval',
    subModels: [
      { id: 'pplx-7b-online', name: 'PPLX 7B', description: 'Small online model' },
      { id: 'pplx-70b-online', name: 'PPLX 70B', description: 'Medium online model' },
      { id: 'pplx-online', name: 'PPLX Online', description: 'Default online model' }
    ]
  },
  {
    id: 'mistral',
    name: 'Mistral',
    description: 'Efficient and powerful language model',
    subModels: [
      { id: 'mistral-small', name: 'Mistral Small', description: 'Fast and efficient model' },
      { id: 'mistral-medium', name: 'Mistral Medium', description: 'Balanced performance' },
      { id: 'mistral-large', name: 'Mistral Large', description: 'Most powerful Mistral model' }
    ]
  }
];

// Function to handle model and sub-model selection
export const selectModel = (modelId: AIModel, subModelId?: string): void => {
  localStorage.setItem('selected-model', modelId);
  
  if (subModelId) {
    localStorage.setItem('selected-submodel', subModelId);
    toast({
      title: "Model switched",
      description: `Now using ${getSubModelNameById(modelId, subModelId)}`,
    });
  } else {
    // Default to first sub-model if available
    const model = AVAILABLE_MODELS.find(m => m.id === modelId);
    if (model?.subModels && model.subModels.length > 0) {
      localStorage.setItem('selected-submodel', model.subModels[0].id);
    }
    toast({
      title: "Model switched",
      description: `Now using ${getModelNameById(modelId)}`,
    });
  }
};

export const getCurrentModel = (): AIModel => {
  const savedModel = localStorage.getItem('selected-model') as AIModel | null;
  return savedModel || 'gemini';  // Default to Gemini
};

export const getCurrentSubModel = (): string | null => {
  return localStorage.getItem('selected-submodel');
};

export const getModelNameById = (modelId: AIModel): string => {
  const model = AVAILABLE_MODELS.find(m => m.id === modelId);
  return model ? model.name : 'Unknown Model';
};

export const getSubModelNameById = (modelId: AIModel, subModelId: string): string => {
  const model = AVAILABLE_MODELS.find(m => m.id === modelId);
  const subModel = model?.subModels?.find(sm => sm.id === subModelId);
  return subModel ? `${model?.name} - ${subModel.name}` : getModelNameById(modelId);
};
