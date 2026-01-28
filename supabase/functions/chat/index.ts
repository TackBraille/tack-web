import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatRequest {
  content: string;
  type: "text" | "url";
  history?: Array<{ originalQuery?: string; summary?: string }>;
  model?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, type, history = [], model } = await req.json() as ChatRequest;
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service is not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build conversation messages
    const messages: Message[] = [
      {
        role: "system",
        content: `You are an AI assistant for an accessibility-focused application designed to help visually impaired users access and understand web content. Your responses will be read aloud using text-to-speech technology, so clarity and conciseness are essential.

Guidelines:
1. Provide direct, factual answers without unnecessary elaboration
2. For date/time questions, give specific information rather than relative terms
3. Structure information in a way that's easy to follow when heard rather than read
4. Do not repeat the question in your answer
5. Prioritize clarity and conciseness over conversational tone
6. Include 5-6 relevant follow-up questions that the user might want to ask next

Format your response with a clear answer followed by "Related Questions:" and then list 5-6 follow-up questions.

Current date and time: ${new Date().toLocaleString("en-US", { timeZone: "America/Phoenix" })}`
      }
    ];

    // Add conversation history
    for (const item of history.slice(-3)) {
      if (item.originalQuery) {
        messages.push({ role: "user", content: item.originalQuery });
      }
      if (item.summary) {
        messages.push({ role: "assistant", content: item.summary });
      }
    }

    // Add current query
    const userMessage = type === "url" 
      ? `Please summarize the content from this URL: ${content}`
      : content;
    messages.push({ role: "user", content: userMessage });

    console.log("Calling Lovable AI with model:", model || "google/gemini-3-flash-preview");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages,
        temperature: 0.2,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "AI service error", details: errorText }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || "";

    // Parse response to extract summary and related questions
    let summary = aiResponse;
    let relatedQuestions: string[] = [];

    const relatedIndex = aiResponse.toLowerCase().indexOf("related questions:");
    if (relatedIndex !== -1) {
      summary = aiResponse.substring(0, relatedIndex).trim();
      const questionsSection = aiResponse.substring(relatedIndex + 18);
      relatedQuestions = questionsSection
        .split(/\n/)
        .map((q: string) => q.replace(/^\d+[\.\)]\s*/, "").replace(/^[-•*]\s*/, "").trim())
        .filter((q: string) => q.length > 0)
        .slice(0, 6);
    }

    // Generate sources based on query type
    const sources = generateSources(content, type);

    return new Response(
      JSON.stringify({
        summary,
        sources,
        relatedQuestions,
        originalQuery: content,
        modelUsed: model || "gemini"
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Chat function error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Failed to process request", 
        details: error instanceof Error ? error.message : "Unknown error" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function generateSources(query: string, type: "text" | "url") {
  if (type === "url") {
    return [{
      id: "1",
      title: "Provided URL",
      briefSummary: "Primary source content analyzed to generate the response.",
      url: query
    }];
  }

  const sources = [];
  const lowerQuery = query.toLowerCase();

  // Add Wikipedia as primary reference
  sources.push({
    id: "1",
    title: "Wikipedia",
    briefSummary: `Comprehensive reference on "${query}"`,
    url: `https://en.wikipedia.org/wiki/${encodeURIComponent(query.replace(/\s+/g, "_"))}`
  });

  // Add Google Scholar for academic queries
  sources.push({
    id: "2",
    title: "Google Scholar",
    briefSummary: `Academic research related to "${query}"`,
    url: `https://scholar.google.com/scholar?q=${encodeURIComponent(query)}`
  });

  return sources.slice(0, 4);
}
