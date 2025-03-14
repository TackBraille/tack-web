
export interface SummaryOutput {
  summary: string;
  sources: Source[];
  loading?: boolean;
  error?: string;
  relatedQuestions?: string[];
  originalQuery?: string; // Store the original query for context
  modelUsed?: string; // Store which model was used for the response
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

export interface ChatSession {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  firstQuery?: string;
}

// Interface for renaming a chat session
export interface RenameSessionProps {
  sessionId: string;
  newTitle: string;
}
