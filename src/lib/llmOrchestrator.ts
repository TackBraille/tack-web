import { SummaryOutput } from '@/types';
import { summarizeContent } from '@/utils/summarize/summarizeContent';

export type TwoStepResult = {
  step1: SummaryOutput;
  step2: SummaryOutput;
};

/**
 * Run a two-step analysis:
 * 1) Summarize the provided content
 * 2) Run a follow-up summarization that asks for concrete action items based on step1
 */
export async function runTwoStepAnalysis(
  content: string,
  type: 'text' | 'url',
  history: SummaryOutput[] = [],
  modelId?: string
): Promise<TwoStepResult> {
  // Step 1: initial summary
  const step1 = await summarizeContent(content, type, history, modelId);

  // Build follow-up prompt using the step1.summary as context
  const followUpContent = `Based on the summary below, produce a concise list of action items (3-8 items) and next steps the user can take. Keep each item short and actionable.\n\nSUMMARY:\n${step1.summary}`;

  // Step 2: ask for actions based on step1
  const step2 = await summarizeContent(followUpContent, 'text', [step1], modelId);

  return { step1, step2 };
}
