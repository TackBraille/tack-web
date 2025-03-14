
import { useState, useEffect } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Toggle } from '@/components/ui/toggle';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Badge } from '@/components/ui/badge';

export function ThemeToggle({ variant = 'dropdown' }: { variant?: 'dropdown' | 'toggleGroup' }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure the component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (variant === 'toggleGroup') {
    return (
      <div className="flex flex-col items-center gap-2">
        <span id="theme-toggle-group-label" className="text-sm font-medium sr-only">
          Choose theme
        </span>
        <ToggleGroup 
          type="single" 
          value={theme} 
          onValueChange={(value) => {
            if (value) setTheme(value as 'light' | 'dark' | 'system');
          }}
          aria-labelledby="theme-toggle-group-label"
          className="justify-start"
        >
          <ToggleGroupItem 
            value="light" 
            aria-label="Light mode"
            className="gap-1 data-[state=on]:bg-secondary data-[state=on]:text-secondary-foreground"
          >
            <Sun className="h-4 w-4" />
            <span className="sr-only md:not-sr-only">Light</span>
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="dark" 
            aria-label="Dark mode"
            className="gap-1 data-[state=on]:bg-secondary data-[state=on]:text-secondary-foreground"
          >
            <Moon className="h-4 w-4" />
            <span className="sr-only md:not-sr-only">Dark</span>
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="system" 
            aria-label="System theme"
            className="gap-1 data-[state=on]:bg-secondary data-[state=on]:text-secondary-foreground"
          >
            <Monitor className="h-4 w-4" />
            <span className="sr-only md:not-sr-only">System</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-md" aria-label="Select theme">
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
          {theme === 'light' && <Badge variant="success" className="ml-2">Active</Badge>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
          {theme === 'dark' && <Badge variant="success" className="ml-2">Active</Badge>}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setTheme('system')}>
          <Monitor className="mr-2 h-4 w-4" />
          <span>System</span>
          {theme === 'system' && <Badge variant="success" className="ml-2">Active</Badge>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
