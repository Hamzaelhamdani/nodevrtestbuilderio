import { useState } from "react";
import { Button } from "./ui/button";
import { CheckCircleIcon, MoonIcon, SunIcon } from "lucide-react";

interface DarkModeFallbackProps {
  onContinue: () => void;
}

export function DarkModeFallback({ onContinue }: DarkModeFallbackProps) {
  const [animateOut, setAnimateOut] = useState(false);

  const handleContinue = () => {
    setAnimateOut(true);
    setTimeout(() => {
      onContinue();
    }, 500);
  };

  return (
    <div className={`fixed inset-0 z-50 bg-background flex flex-col items-center justify-center p-4 transition-opacity duration-500 ${animateOut ? 'opacity-0' : 'opacity-100'}`}>
      <div className="max-w-md text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-primary/10 p-5 rounded-full">
            <MoonIcon className="h-12 w-12 text-primary" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mb-4">Welcome to VenturesRoom</h2>
        
        <p className="text-muted-foreground mb-6">
          This platform uses a dark theme for optimal viewing experience in professional environments. 
          Please ensure your device supports dark mode for the best experience.
        </p>
        
        <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
          <div className="bg-background border border-border rounded-lg p-4 flex-1">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Best Experience</span>
              <CheckCircleIcon className="h-5 w-5 text-primary" />
            </div>
            <div className="bg-[#080f17] h-12 rounded flex items-center justify-center">
              <MoonIcon className="h-5 w-5 text-[#d6dde6]" />
            </div>
            <p className="text-sm text-muted-foreground mt-2">Dark Mode</p>
          </div>
          
          <div className="bg-background border border-border/50 rounded-lg p-4 flex-1 opacity-60">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Limited Support</span>
              <SunIcon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="bg-white h-12 rounded flex items-center justify-center">
              <SunIcon className="h-5 w-5 text-black" />
            </div>
            <p className="text-sm text-muted-foreground mt-2">Light Mode</p>
          </div>
        </div>
        
        <Button 
          onClick={handleContinue}
          className="w-full md:w-auto px-8"
        >
          Continue to VenturesRoom
        </Button>
      </div>
    </div>
  );
}