
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// API route imports
import { POST as summarizePost } from "./pages/api/summarize";
import { POST as speechPost } from "./pages/api/speech";
import { GET as sessionsGet, POST as sessionsPost } from "./pages/api/sessions";
import { GET as historyGet, POST as historyPost } from "./pages/api/history";

const queryClient = new QueryClient();

// Setup API route handlers
const setupAPIRoutes = () => {
  // Register API routes
  const apiEndpoints = {
    '/api/summarize': { POST: summarizePost },
    '/api/speech': { POST: speechPost },
    '/api/sessions': { GET: sessionsGet, POST: sessionsPost },
    '/api/history': { GET: historyGet, POST: historyPost }
  };
  
  // Mock fetch implementation to intercept API calls
  const originalFetch = window.fetch;
  window.fetch = async (input, init) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
    
    // Check if this is an API call we should handle
    for (const [endpoint, handlers] of Object.entries(apiEndpoints)) {
      if (url.includes(endpoint)) {
        const method = init?.method || 'GET';
        const handler = handlers[method as keyof typeof handlers];
        
        if (handler) {
          console.log(`[API] Handling ${method} request to ${endpoint}`);
          return handler(new Request(url, init));
        }
      }
    }
    
    // If not an API call we handle, pass through to original fetch
    return originalFetch(input, init);
  };
};

// Initialize API routes
setupAPIRoutes();

const App = () => (
  <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
