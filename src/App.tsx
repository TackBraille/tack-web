import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { ClerkProvider, SignIn, SignInButton, SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";

// API route imports
import { POST as summarizePost } from "./pages/api/summarize";
import { POST as speechPost } from "./pages/api/speech";
import { GET as sessionsGet, POST as sessionsPost } from "./pages/api/sessions";
import { GET as historyGet, POST as historyPost } from "./pages/api/history";

// Replace with your actual Clerk publishable key
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "pk_test_ZWFzeS1zcGFycm93LTc5LmNsZXJrLmFjY291bnRzLmRldiQ";

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

// LoginScreen component for non-authenticated users
const LoginScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-6 bg-gradient-to-b from-background to-background/80">
      <div className="w-full max-w-md px-8 py-12 transform transition-all">
        <div className="overflow-hidden rounded-2xl shadow-xl bg-card border border-border">
          <div className="relative p-8">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-primary/20 rounded-full -ml-8 -mb-8 blur-xl"></div>
        
        <div className="text-center space-y-5 mb-8 relative z-10">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Insight Scribe
          </h1>
          <p className="text-muted-foreground">Transform your meetings into actionable insights</p>
        </div>
        
        <div className="flex justify-center mb-2">
          <SignInButton>
            <Button size="lg" className="w-full font-medium">
          Sign in to continue
            </Button>
          </SignInButton>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AppContent = () => (
  <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={
              <>
                <SignedIn>
                  <Index />
                </SignedIn>
                <SignedOut>
                  <LoginScreen />
                </SignedOut>
              </>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

const App = () => (
  <ClerkProvider publishableKey={clerkPubKey}>
    <AppContent />
  </ClerkProvider>
);

export default App;
