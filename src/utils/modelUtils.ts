
import { AIModel, ModelConfig } from '@/types';
import { toast } from '@/components/ui/use-toast';

// Model configurations
export const AVAILABLE_MODELS: ModelConfig[] = [
  { 
    id: 'claude',
    name: 'Claude',
    description: 'Anthropic\'s Claude model for accurate and nuanced summarization'
  },
  { 
    id: 'perplexity',
    name: 'Perplexity',
    description: 'Perplexity AI model with strong knowledge capabilities'
  },
  { 
    id: 'chatgpt',
    name: 'ChatGPT',
    description: 'OpenAI\'s GPT model for versatile text generation'
  },
  {
    id: 'llama',
    name: 'Llama',
    description: 'Meta\'s open source LLM for efficient summarization'
  },
  {
    id: 'gemini',
    name: 'Gemini',
    description: 'Google\'s multimodal AI model with advanced capabilities'
  },
  {
    id: 'mistral',
    name: 'Mistral',
    description: 'Mistral AI\'s efficient model for accurate text processing'
  }
];

// Mock function for model switching in this demo
// In a real app, this would connect to the appropriate API
export const selectModel = (modelId: AIModel): void => {
  localStorage.setItem('selected-model', modelId);
  toast({
    title: "Model switched",
    description: `Now using ${getModelNameById(modelId)}`,
  });
};

export const getCurrentModel = (): AIModel => {
  const savedModel = localStorage.getItem('selected-model') as AIModel | null;
  return savedModel || 'claude';
};

export const getModelNameById = (modelId: AIModel): string => {
  const model = AVAILABLE_MODELS.find(m => m.id === modelId);
  return model ? model.name : 'Unknown Model';
};
