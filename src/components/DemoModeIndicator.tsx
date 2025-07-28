import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from './ui/alert';
import { Info, X } from 'lucide-react';
import { Button } from './ui/button';

export function DemoModeIndicator() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if any network errors have occurred (indicating demo mode)
    const checkDemoMode = () => {
      const hasNetworkErrors = sessionStorage.getItem('network_error_/auth/me') || 
                              sessionStorage.getItem('network_error_/startups') ||
                              sessionStorage.getItem('network_error_/products');
      
      if (hasNetworkErrors && !isDismissed) {
        setIsVisible(true);
      }
    };

    // Check immediately and then every 2 seconds for the first 10 seconds
    checkDemoMode();
    const interval = setInterval(checkDemoMode, 2000);
    
    setTimeout(() => {
      clearInterval(interval);
    }, 10000);

    return () => clearInterval(interval);
  }, [isDismissed]);

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
    sessionStorage.setItem('demo_mode_dismissed', 'true');
  };

  useEffect(() => {
    const dismissed = sessionStorage.getItem('demo_mode_dismissed');
    if (dismissed) {
      setIsDismissed(true);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <Alert className="bg-blue-50 border-blue-200 text-blue-800">
        <Info className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span className="text-sm">
            <strong>Demo Mode Active</strong> - Backend server not available. 
            Using sample data for demonstration.
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="ml-2 h-6 w-6 p-0 text-blue-600 hover:text-blue-800"
          >
            <X className="h-3 w-3" />
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
}
