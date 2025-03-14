
import { SummaryOutput, Source } from '@/types';

const GEMINI_API_KEY = 'AIzaSyD38ovCCHVPectV46kPSqWI1Ehx2sfIrE4';

/**
 * Maps the requested model to the appropriate Gemini model
 */
export function mapToGeminiModel(modelId?: string): string {
  // By default we'll use gemini-2.0-flash as the fastest model
  let geminiModel = 'gemini-2.0-flash';
  
  // Model mapping based on user selection
  if (modelId) {
    switch(modelId) {
      case 'gemini':
        geminiModel = 'gemini-2.0-flash';
        break;
      case 'mistral':
      case 'perplexity':
        // For these models we'll use gemini-2.0-pro
        geminiModel = 'gemini-2.0-pro';
        break;
      case 'chatgpt':
        // For ChatGPT option we'll use the most powerful model
        geminiModel = 'gemini-2.0-pro';
        break;
      default:
        geminiModel = 'gemini-2.0-flash';
    }
  }

  console.log(`Using Gemini model: ${geminiModel}`);
  return geminiModel;
}

/**
 * Creates a prompt for the Gemini model based on content type
 */
export function createPrompt(content: string, type: 'text' | 'url'): string {
  return type === 'url' 
    ? `Please summarize the content from this URL: ${content}. This app is for visually impaired users, so provide direct, factual, and concise answers without summarizing the question back. For date or time questions, give the actual date/time information. Include 3 relevant follow-up questions that are very brief.`
    : `Please answer this question directly: ${content}. This app is for visually impaired users, so provide direct, factual, and concise answers without summarizing the question back. For date or time questions, give the actual date/time information. Include 3 relevant follow-up questions that are very brief.`;
}

/**
 * Calls the Gemini API for content summarization
 */
export async function callGeminiApi(prompt: string, modelId?: string): Promise<any> {
  const geminiModel = mapToGeminiModel(modelId);
  
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.2, // Lower temperature for more direct answers
        maxOutputTokens: 800,
      }
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error('Gemini API error response:', errorData);
    throw new Error(`Gemini API request failed: ${response.status}`);
  }

  return response.json();
}
