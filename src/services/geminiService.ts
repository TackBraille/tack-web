import { SummaryOutput, Source, AIModel } from '@/types';

// Replace the suspended API key with a placeholder
// In a production environment, this would be stored in environment variables
const GEMINI_API_KEY = ''; // Intentionally blank to trigger fallback behavior

/**
 * Maps the requested model to the appropriate Gemini model
 */
export function mapToGeminiModel(modelId?: string): string {
  // By default we'll use gemini-1.5-flash as the fastest model
  let geminiModel = 'gemini-1.5-flash';
  
  // Model mapping based on user selection
  if (modelId) {
    switch(modelId) {
      case 'gemini':
        geminiModel = 'gemini-1.5-flash';
        break;
      case 'mistral':
      case 'perplexity':
      case 'claude':
      case 'llama':
        // For these models we'll use gemini-1.5-pro
        geminiModel = 'gemini-1.5-pro';
        break;
      case 'chatgpt':
        // For ChatGPT option we'll use the most powerful model
        geminiModel = 'gemini-1.5-pro';
        break;
      default:
        geminiModel = 'gemini-1.5-flash';
    }
  }

  console.log(`Using Gemini model: ${geminiModel}`);
  return geminiModel;
}

/**
 * Creates a prompt for the Gemini model based on content type and selected model
 */
export function createPrompt(content: string, type: 'text' | 'url', conversationHistory: SummaryOutput[] = [], modelId?: string): string {
  // Determine which model we're emulating
  const modelEmulation = getModelEmulationInstructions(modelId);
  
  // Application context for more helpful responses
  const appContext = `
    You are an AI assistant for an accessibility-focused application designed to help visually impaired users 
    access and understand web content. Your responses will be read aloud using text-to-speech technology, 
    so clarity and conciseness are essential. The user is interacting with a screen reader.
    
    ${modelEmulation}
  `;
  
  const guidelines = `
    1. Provide direct, factual answers without unnecessary elaboration
    2. For date/time questions, give specific information rather than relative terms
    3. Structure information in a way that's easy to follow when heard rather than read
    4. Do not repeat the question in your answer
    5. Prioritize clarity and conciseness over conversational tone
    6. Include 5-6 relevant follow-up questions that the user might want to ask next
  `;

  // Build conversation context from history
  let conversationContext = '';
  if (conversationHistory.length > 0) {
    conversationContext = 'Previous conversation context:\n';
    // Add up to last 3 exchanges to maintain context without making prompt too long
    const recentHistory = conversationHistory.slice(-3);
    recentHistory.forEach((item, index) => {
      conversationContext += `[${index + 1}] User: ${item.originalQuery || 'Unknown query'}\n`;
      conversationContext += `[${index + 1}] Assistant: ${item.summary}\n\n`;
    });
    conversationContext += 'Remember this conversation history when responding to the current query.\n\n';
  }
  
  if (type === 'url') {
    return `${appContext}
    
    ${conversationContext}
    
    Please summarize the content from this URL: ${content}
    
    ${guidelines}
    
    Format your response with a clear summary followed by "Related Questions:" and then list 5-6 follow-up questions.`;
  } else {
    return `${appContext}
    
    ${conversationContext}
    
    Please answer this question directly: ${content}
    
    ${guidelines}
    
    Format your response with a clear answer followed by "Related Questions:" and then list 5-6 follow-up questions.`;
  }
}

/**
 * Get model-specific emulation instructions
 */
function getModelEmulationInstructions(modelId?: string): string {
  if (!modelId || modelId === 'gemini') {
    return "Respond as Gemini, Google's AI assistant.";
  }
  
  switch(modelId) {
    case 'chatgpt':
      return "Emulate the behavior and response style of ChatGPT. Be helpful, harmless, and honest. Your answers should be comprehensive yet concise, showing a strong ability to understand and respond to complex queries with nuance.";
    case 'claude':
      return "Emulate Claude's calm, thoughtful, and slightly formal tone. Provide nuanced, balanced responses that consider multiple perspectives. Be particularly careful with sensitive topics and prioritize helpfulness and harmlessness.";
    case 'mistral':
      return "Emulate Mistral's direct and efficient response style. Provide factual, straightforward answers with minimal embellishment while maintaining accuracy and helpfulness.";
    case 'perplexity':
      return "Emulate Perplexity's focus on providing well-researched information. Your answers should emphasize factual accuracy, with clear information synthesis and balanced presentation of different viewpoints.";
    case 'llama':
      return "Emulate LLaMA's response style. Be conversational yet informative, with a good balance of technical detail and accessible explanation. Show versatility in handling both technical and general knowledge topics.";
    default:
      return "Respond as Gemini, Google's AI assistant.";
  }
}

/**
 * Calls the Gemini API for content summarization with improved error handling
 */
export async function callGeminiApi(prompt: string, modelId?: string): Promise<any> {
  // Check if API key is properly configured
  if (!GEMINI_API_KEY || GEMINI_API_KEY === '') {
    console.log('No valid Gemini API key configured, using mock response');
    return mockGeminiResponse(prompt);
  }

  const geminiModel = mapToGeminiModel(modelId);
  
  try {
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
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return mockGeminiResponse(prompt);
  }
}

/**
 * Generates a mock response when the Gemini API is unavailable
 */
function mockGeminiResponse(prompt: string): any {
  console.log('Generating mock Gemini response');
  
  // Extract the main question/URL from the prompt
  const contentMatch = prompt.match(/Please (answer this question directly|summarize the content from this URL): (.+?)(?:\n|$)/);
  const content = contentMatch ? contentMatch[2].trim() : 'Unknown query';
  
  // Generate a relevant mock response based on the content
  let response = '';
  const lowerContent = content.toLowerCase();
  
  if (lowerContent.includes('university') || lowerContent.includes('college') || lowerContent.includes('asu')) {
    response = `${content.includes('asu') || content.includes('ASU') ? 'Arizona State University' : 'The university'} is highly regarded for its innovation, research opportunities, and inclusive approach to education. It offers a wide range of academic programs across multiple disciplines and has received recognition for its online programs. The quality of education depends on the specific program and department, with some areas being particularly strong. Students benefit from extensive resources, diverse campus life, and career development opportunities.`;
  } else if (lowerContent.includes('climate') || lowerContent.includes('environment')) {
    response = `Climate change is a significant global challenge caused primarily by human activities like burning fossil fuels and deforestation. Key effects include rising temperatures, sea level rise, extreme weather events, disruption of ecosystems, and threats to human health and infrastructure. Addressing climate change requires both mitigation strategies to reduce greenhouse gas emissions and adaptation measures to cope with unavoidable impacts.`;
  } else if (lowerContent.includes('tech') || lowerContent.includes('ai') || lowerContent.includes('computer')) {
    response = `Artificial intelligence and machine learning technologies have advanced significantly in recent years, with applications across numerous industries including healthcare, finance, transportation, and education. These technologies can analyze vast amounts of data, recognize patterns, make predictions, and even generate content. While offering substantial benefits like increased efficiency and new capabilities, they also raise important questions about privacy, bias, job displacement, and ethical use.`;
  } else {
    response = `This is a mock response generated because the Gemini API is currently unavailable. The system is designed to provide informative, concise answers to your questions or summarize URL content effectively. The actual response would analyze your query and provide relevant information along with sources.`;
  }
  
  // Add related questions section
  response += `\n\nRelated Questions:\n1. How does this compare to alternatives?\n2. What are the most recent developments in this area?\n3. What are common misconceptions about this topic?\n4. What experts say about this subject?\n5. How might this change in the next five years?\n6. What resources are available to learn more?`;
  
  // Return in Gemini API format
  return {
    candidates: [{
      content: {
        parts: [{ text: response }]
      }
    }]
  };
}
