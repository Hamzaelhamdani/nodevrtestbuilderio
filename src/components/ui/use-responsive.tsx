import * as React from "react";

// Tailwind-like breakpoints
export const breakpoints = {
  xs: 320,   // Extra small devices (phones)
  sm: 640,   // Small devices (large phones, small tablets)
  md: 768,   // Medium devices (tablets)
  lg: 1024,  // Large devices (laptops/desktops)
  xl: 1280,  // Extra large devices (large desktops)
  "2xl": 1536 // XXL devices (ultra-wide screens)
};

// Global state to track the current breakpoints
let currentBreakpoints = {
  xs: false,
  sm: false,
  md: false,
  lg: false,
  xl: false,
  "2xl": false
};

// Initialize breakpoint listeners once
function initializeBreakpointListeners() {
  if (typeof window === 'undefined') return;

  // Create media query listeners for each breakpoint
  Object.entries(breakpoints).forEach(([key, width]) => {
    const mediaQuery = window.matchMedia(`(min-width: ${width}px)`);
    
    // Initial check
    currentBreakpoints[key as keyof typeof breakpoints] = mediaQuery.matches;
    
    // Set up listener
    const handleChange = (e: MediaQueryListEvent) => {
      currentBreakpoints[key as keyof typeof breakpoints] = e.matches;
    };
    
    // Add listener
    mediaQuery.addEventListener('change', handleChange);
  });
}

// Initialize on client-side
if (typeof window !== 'undefined') {
  initializeBreakpointListeners();
}

// Hook to check if viewport matches a specific breakpoint
export function useBreakpoint(breakpoint: keyof typeof breakpoints) {
  const [matches, setMatches] = React.useState(false);
  
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Initial check
    const mediaQuery = window.matchMedia(`(min-width: ${breakpoints[breakpoint]}px)`);
    setMatches(mediaQuery.matches);
    
    // Handler for changes
    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };
    
    // Add listener
    mediaQuery.addEventListener('change', handleChange);
    
    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [breakpoint]);
  
  return matches;
}

// Hook to get all breakpoint states at once
export function useBreakpoints() {
  const [breakpointStates, setBreakpointStates] = React.useState({
    xs: false,
    sm: false,
    md: false,
    lg: false,
    xl: false,
    "2xl": false
  });
  
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Set initial state
    setBreakpointStates({...currentBreakpoints});
    
    // Function to check all breakpoints
    const checkAllBreakpoints = () => {
      const newStates = Object.entries(breakpoints).reduce((acc, [key, width]) => {
        const mediaQuery = window.matchMedia(`(min-width: ${width}px)`);
        acc[key as keyof typeof breakpoints] = mediaQuery.matches;
        return acc;
      }, {...breakpointStates});
      
      setBreakpointStates(newStates);
    };
    
    // Check on resize
    window.addEventListener('resize', checkAllBreakpoints);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkAllBreakpoints);
    };
  }, []);
  
  return breakpointStates;
}

// Hook to get current device type
export function useDeviceType() {
  const breakpointStates = useBreakpoints();
  
  if (breakpointStates["2xl"]) return 'desktop-large';
  if (breakpointStates.xl) return 'desktop';
  if (breakpointStates.lg) return 'laptop';
  if (breakpointStates.md) return 'tablet';
  if (breakpointStates.sm) return 'mobile-large';
  if (breakpointStates.xs) return 'mobile';
  return 'mobile-small';
}

// Hook for responsive values based on breakpoint
export function useResponsiveValue<T>(values: {
  base: T;
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  "2xl"?: T;
}): T {
  const breakpointStates = useBreakpoints();
  
  // Return the appropriate value based on current breakpoints
  if (breakpointStates["2xl"] && values["2xl"] !== undefined) return values["2xl"];
  if (breakpointStates.xl && values.xl !== undefined) return values.xl;
  if (breakpointStates.lg && values.lg !== undefined) return values.lg;
  if (breakpointStates.md && values.md !== undefined) return values.md;
  if (breakpointStates.sm && values.sm !== undefined) return values.sm;
  if (breakpointStates.xs && values.xs !== undefined) return values.xs;
  
  return values.base;
}

// Simple mobile check
export function useIsMobile() {
  const isSmallScreen = !useBreakpoint('md');
  const [isMobileDevice, setIsMobileDevice] = React.useState(false);
  
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Check for mobile user agent
    const userAgent = window.navigator.userAgent;
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    setIsMobileDevice(mobileRegex.test(userAgent));
  }, []);
  
  // Consider it mobile if either the screen is small or it's a mobile device
  return isSmallScreen || isMobileDevice;
}

// Detect touch device
export function useIsTouchDevice() {
  const [isTouch, setIsTouch] = React.useState(false);
  
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const detectTouch = () => {
      setIsTouch(
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        (navigator as any).msMaxTouchPoints > 0
      );
    };
    
    detectTouch();
    
    // No need for event listener as this doesn't change during session
  }, []);
  
  return isTouch;
}

// Orientation detection (portrait vs landscape)
export function useOrientation() {
  const [orientation, setOrientation] = React.useState<'portrait' | 'landscape'>(
    typeof window !== 'undefined' && window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
  );
  
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
    };
    
    // Check on resize
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return orientation;
}

// Create a component that provides all responsive information to children
export const ResponsiveContext = React.createContext<{
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouch: boolean;
  orientation: 'portrait' | 'landscape';
  deviceType: string;
}>({
  isMobile: false,
  isTablet: false,
  isDesktop: false,
  isTouch: false,
  orientation: 'portrait',
  deviceType: 'desktop',
});

export function ResponsiveProvider({ children }: { children: React.ReactNode }) {
  // Use the consolidated hook to get all breakpoint states
  const breakpointStates = useBreakpoints();
  const isTouch = useIsTouchDevice();
  const orientation = useOrientation();
  
  // Calculate derived values based on breakpoint states
  const isMobile = !breakpointStates.sm;
  const isTablet = breakpointStates.md && !breakpointStates.lg;
  const isDesktop = breakpointStates.lg;
  
  // Determine device type based on breakpoint states
  const deviceType = 
    breakpointStates["2xl"] ? 'desktop-large' :
    breakpointStates.xl ? 'desktop' :
    breakpointStates.lg ? 'laptop' :
    breakpointStates.md ? 'tablet' :
    breakpointStates.sm ? 'mobile-large' :
    breakpointStates.xs ? 'mobile' : 'mobile-small';
  
  // Create memoized context value to prevent unnecessary renders
  const contextValue = React.useMemo(() => ({
    isMobile,
    isTablet,
    isDesktop,
    isTouch,
    orientation,
    deviceType,
  }), [
    isMobile,
    isTablet,
    isDesktop,
    isTouch,
    orientation,
    deviceType
  ]);
  
  return (
    <ResponsiveContext.Provider value={contextValue}>
      {children}
    </ResponsiveContext.Provider>
  );
}

export function useResponsive() {
  return React.useContext(ResponsiveContext);
}
