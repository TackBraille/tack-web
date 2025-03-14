
import React from 'react';
import { ArrowLeft, RefreshCcw, ArrowRight, Info, Lightbulb, MessageSquareHeart, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FooterProps {
  onReset: () => void;
}

const Footer: React.FC<FooterProps> = ({ onReset }) => {
  const showAccessibilityInfo = () => {
    toast({
      title: "Accessibility Features",
      description: "This app is designed for screen readers, keyboard navigation, and high contrast. Press Tab to navigate and Enter to activate elements.",
      duration: 5000,
    });
  };

  return (
    <footer className="w-full bg-background/80 backdrop-blur-sm border-t py-4 mt-auto" aria-label="Page footer">
      <div className="container mx-auto px-4 flex justify-between items-center flex-wrap gap-y-2">
        <div className="flex gap-2 items-center">
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-1"
                  onClick={() => window.history.back()}
                  aria-label="Go back to previous page"
                >
                  <ArrowLeft size={16} aria-hidden="true" />
                  <span className="sr-only sm:not-sr-only">Back</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Navigate to previous page</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-1"
                  onClick={onReset}
                  aria-label="Reset the application"
                >
                  <RefreshCcw size={16} aria-hidden="true" />
                  <span className="sr-only sm:not-sr-only">Reset</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Clear all data and start fresh</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-1"
                  onClick={() => window.history.forward()}
                  aria-label="Go forward to next page"
                >
                  <span className="sr-only sm:not-sr-only">Forward</span>
                  <ArrowRight size={16} aria-hidden="true" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Navigate to next page</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="flex gap-2 items-center">
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-1"
                  onClick={showAccessibilityInfo}
                  aria-label="View accessibility information"
                >
                  <Info size={16} aria-hidden="true" />
                  <span className="sr-only sm:not-sr-only">Accessibility</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Show accessibility information</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-1"
                  aria-label="View keyboard shortcuts"
                  onClick={() => {
                    toast({
                      title: "Keyboard Shortcuts",
                      description: "Ctrl+B: Toggle sidebar, Ctrl+Enter: Submit, Esc: Clear input",
                    });
                  }}
                >
                  <Lightbulb size={16} aria-hidden="true" />
                  <span className="sr-only sm:not-sr-only">Shortcuts</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Show keyboard shortcuts</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1"
                  onClick={() => {
                    window.open("https://github.com/yourusername/your-repo", "_blank");
                  }}
                  aria-label="View source code on GitHub"
                >
                  <Github size={16} aria-hidden="true" />
                  <span className="sr-only sm:not-sr-only">GitHub</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>View project on GitHub</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
