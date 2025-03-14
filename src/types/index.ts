
export interface SummaryOutput {
  summary: string;
  sources: Source[];
  loading?: boolean;
  error?: string;
  relatedQuestions?: string[];
}

export interface Source {
  id: string;
  title: string;
  briefSummary: string;
  url?: string;
}

export type AIModel = 'claude' | 'perplexity' | 'chatgpt' | 'llama' | 'gemini' | 'mistral';

export interface ModelConfig {
  id: AIModel;
  name: string;
  description: string;
  subModels?: SubModel[];
}

export interface SubModel {
  id: string;
  name: string;
  description: string;
}

export type InputType = 'text' | 'url' | 'conversation';
