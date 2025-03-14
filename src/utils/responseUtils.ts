
import { SummaryOutput, Source } from '@/types';

/**
 * Extract the AI model's text response from the Gemini API response
 */
export function extractTextFromGeminiResponse(data: any): string {
  if (data.candidates && data.candidates[0]?.content?.parts) {
    return data.candidates[0].content.parts
      .filter((part: any) => part.text)
      .map((part: any) => part.text)
      .join('\n');
  }
  throw new Error('Unexpected response format from Gemini API');
}

/**
 * Helper function to extract the summary from LLM response
 */
export function extractSummary(response: string): string {
  // Look for "Summary:" or just return the whole thing if we can't find it
  const summaryMatch = response.match(/Summary:([\s\S]*?)(?:Related Questions:|$)/i);
  if (summaryMatch && summaryMatch[1]) {
    return summaryMatch[1].trim();
  }
  
  // If no "Summary:" section found, return everything before "Related Questions:"
  const relatedQuestionsIndex = response.indexOf("Related Questions:");
  if (relatedQuestionsIndex > -1) {
    return response.substring(0, relatedQuestionsIndex).trim();
  }
  
  // If no pattern is found, just return the whole response
  return response;
}

/**
 * Helper function to extract related questions from LLM response
 */
export function extractRelatedQuestions(response: string): string[] {
  const questionsMatch = response.match(/Related Questions:([\s\S]*)/i);
  
  if (questionsMatch && questionsMatch[1]) {
    // Try to split by numbered list (1., 2., 3., etc.)
    const questionText = questionsMatch[1].trim();
    const questions = questionText.split(/\d+\.\s+/)
      .map(q => q.trim())
      .filter(q => q.length > 0);
    
    if (questions.length > 0) {
      return questions.slice(0, 6); // Increase to get up to 6 questions
    }
    
    // Fallback to splitting by newlines
    return questionText.split('\n')
      .map(line => line.trim().replace(/^[•\-*]\s+/, ''))
      .filter(line => line.length > 0 && line.endsWith('?'))
      .slice(0, 6); // Increase to get up to 6 questions
  }
  
  // Fallback: Look for question marks in the text
  const questionRegex = /(\b[^.!?]+\?)/g;
  const allQuestions = [...response.matchAll(questionRegex)]
    .map(match => match[0].trim())
    .filter(q => q.length > 10 && q.length < 100);
  
  return allQuestions.slice(0, 6); // Increase to get up to 6 questions
}

/**
 * Generate fallback content when API calls fail
 */
export function generateFallbackContent(content: string, type: 'text' | 'url'): SummaryOutput {
  // More helpful fallback for visually impaired users
  const summary = `Unable to generate an answer right now. The AI service is currently unavailable. Please try again in a few moments.`;

  // Simple related questions for fallback
  const relatedQuestions = [
    `Try again?`,
    `Check your internet connection?`,
    `Try a different query?`,
    `Is the service working now?`,
    `Try a simpler question?`,
    `Would you like help troubleshooting?`
  ];

  return {
    summary,
    sources: type === 'url' ? [{
      id: '1',
      title: 'Provided URL',
      briefSummary: 'Original source',
      url: content
    }] : [],
    relatedQuestions
  };
}
