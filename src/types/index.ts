
export interface SummaryOutput {
  summary: string;
  sources: Source[];
  loading?: boolean;
  error?: string;
}

export interface Source {
  id: string;
  title: string;
  briefSummary: string;
  url?: string;
}

export type AIModel = 'claude' | 'perplexity' | 'chatgpt';

export interface ModelConfig {
  id: AIModel;
  name: string;
  description: string;
}

export type InputType = 'text' | 'url' | 'conversation';
