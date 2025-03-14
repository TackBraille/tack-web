
import { AIModel, ModelConfig, SubModel } from '@/types';
import { toast } from '@/components/ui/use-toast';

// Model configurations
export const AVAILABLE_MODELS: ModelConfig[] = [
  { 
    id: 'claude',
    name: 'Claude',
    description: 'Anthropic\'s Claude model for accurate and nuanced summarization',
    subModels: [
      { id: 'claude-3-opus', name: 'Claude 3 Opus', description: 'Most powerful Claude model' },
      { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', description: 'Balance of intelligence and speed' },
      { id: 'claude-3-haiku', name: 'Claude 3 Haiku', description: 'Fast and efficient responses' }
    ]
  },
  { 
    id: 'perplexity',
    name: 'Perplexity',
    description: 'Perplexity AI model with strong knowledge capabilities',
    subModels: [
      { id: 'pplx-7b-online', name: 'PPLX 7B', description: 'Small online model' },
      { id: 'pplx-70b-online', name: 'PPLX 70B', description: 'Medium online model' },
      { id: 'pplx-online', name: 'PPLX Online', description: 'Default online model' }
    ]
  },
  { 
    id: 'chatgpt',
    name: 'ChatGPT',
    description: 'OpenAI\'s GPT model for versatile text generation',
    subModels: [
      { id: 'gpt-4o', name: 'GPT-4o', description: 'Most capable GPT-4 model' },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', description: 'Powerful with good efficiency' },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Fast and cost-effective' }
    ]
  },
  {
    id: 'llama',
    name: 'Llama',
    description: 'Meta\'s open source LLM for efficient summarization',
    subModels: [
      { id: 'llama-3.1-8b', name: 'Llama 3.1 8B', description: 'Smallest and fastest model' },
      { id: 'llama-3.1-70b', name: 'Llama 3.1 70B', description: 'Medium size with good performance' },
      { id: 'llama-3.1-405b', name: 'Llama 3.1 405B', description: 'Largest and most capable' }
    ]
  },
  {
    id: 'gemini',
    name: 'Gemini',
    description: 'Google\'s multimodal AI model with advanced capabilities',
    subModels: [
      { id: 'gemini-pro', name: 'Gemini Pro', description: 'Balanced performance model' },
      { id: 'gemini-ultra', name: 'Gemini Ultra', description: 'Most capable Google model' },
      { id: 'gemini-flash', name: 'Gemini Flash', description: 'Fast response model' }
    ]
  },
  {
    id: 'mistral',
    name: 'Mistral',
    description: 'Mistral AI\'s efficient model for accurate text processing',
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
  return savedModel || 'claude';
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
