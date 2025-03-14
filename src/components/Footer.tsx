
import React from 'react';
import { ArrowLeft, RefreshCcw, ArrowRight, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

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
    <footer className="w-full bg-background/80 backdrop-blur-sm border-t py-4 mt-auto">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
            onClick={() => window.history.back()}
            aria-label="Go back to previous page"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
            onClick={onReset}
            aria-label="Reset the application"
          >
            <RefreshCcw size={16} />
            <span>Reset</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
            onClick={() => window.history.forward()}
            aria-label="Go forward to next page"
          >
            <span>Forward</span>
            <ArrowRight size={16} />
          </Button>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-1"
          onClick={showAccessibilityInfo}
          aria-label="View accessibility information"
        >
          <Info size={16} />
          <span>Accessibility Info</span>
        </Button>
      </div>
    </footer>
  );
};

export default Footer;
