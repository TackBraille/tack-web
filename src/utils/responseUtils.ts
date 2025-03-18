
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
    const questionText = questionsMatch[1].trim();
    
    // First approach: Try to extract numbered questions (1. Question)
    const numberedQuestionMatches = Array.from(questionText.matchAll(/\d+[\.\)]\s+([^\d\n]+)/g));
    if (numberedQuestionMatches.length > 0) {
      return numberedQuestionMatches
        .map(match => match[1].trim())
        .filter(q => q.length > 0 && !q.startsWith('Related Questions:'));
    }
    
    // Second approach: Try to extract bullet-pointed questions
    const bulletQuestionMatches = Array.from(questionText.matchAll(/[\*\-\•]\s+([^\*\-\•\n]+)/g));
    if (bulletQuestionMatches.length > 0) {
      return bulletQuestionMatches
        .map(match => match[1].trim())
        .filter(q => q.length > 0);
    }
    
    // Third approach: Split by newlines and clean up
    const lines = questionText.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && !line.startsWith('Related Questions:'));
    
    if (lines.length > 0) {
      // Remove any numbering or bullets that might remain
      return lines.map(line => 
        line.replace(/^\d+[\.\)]\s*/, '')
           .replace(/^[\*\-\•]\s*/, '')
           .trim()
      );
    }
  }
  
  // Fallback with generic questions if we can't extract any
  return [
    "What are the main benefits of this topic?",
    "How does this compare to alternatives?",
    "What are common misconceptions about this?",
    "How has this evolved over time?",
    "What are the future trends in this area?",
    "Where can I learn more about this topic?"
  ];
}

/**
 * Generate fallback content when API calls fail
 */
export function generateFallbackContent(content: string, type: 'text' | 'url'): SummaryOutput {
  // More helpful fallback for visually impaired users
  const summary = `I'm currently unable to provide a complete answer about "${content}". This could be due to a temporary service issue. Please try again in a few moments, or try rephrasing your question for better results.`;

  // Simple related questions for fallback
  const relatedQuestions = [
    `Try rephrasing your question?`,
    `Is there a more specific aspect you're interested in?`,
    `Would you like information about a related topic?`,
    `Should we try a different approach to this question?`,
    `Would you like to try a simpler version of this question?`,
    `Is there another topic you'd like to explore instead?`
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
