import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { LucideIcon, MenuIcon, XIcon } from "lucide-react";
import { useIsMobile, useBreakpoint } from "../ui/use-responsive";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";

// Define the possible routes
export type Route = 
  | "home" 
  | "auth" 
  | "startup-storefront" 
  | "support-structure-dashboard"
  | "marketplace" 
  | "startup-dashboard"
  | "admin-portal"
  | "payments"
  | "community-discounts"
  | "client-dashboard"
  | "purchase-history"
  | "venture-room-club"
  | "dashboard-overview";

// Define the nav item structure
export interface NavItem {
  route: Route;
  label: string;
  icon: LucideIcon;
  color: string;
  tooltip?: string;
}

interface NavigationBarProps {
  currentRoute: Route;
  navigate: (route: Route) => void;
  navItems: NavItem[];
  userRole?: string;
}

export function NavigationBar({ 
  currentRoute, 
  navigate, 
  navItems,
  userRole
}: NavigationBarProps) {
  const isMobile = useIsMobile();
  const isSmallMobile = !useBreakpoint('sm');
  const [isExpanded, setIsExpanded] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hideNav, setHideNav] = useState(false);

  // Scroll detection to hide navigation when scrolling down on mobile
  useEffect(() => {
    if (!isMobile) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Hide nav when scrolling down past a threshold
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setHideNav(true);
      } else {
        setHideNav(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isMobile]);

  // If we're on a large screen, show the desktop nav bar
  if (!isMobile) {
    return (
      <TooltipProvider>
        <motion.nav 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border p-2 flex justify-center"
        >
          <div className="flex items-center justify-between max-w-md w-full">
            {navItems.slice(0, 5).map((item) => (
              <Tooltip key={item.route}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`relative rounded-full ${currentRoute === item.route ? 'bg-accent shadow-sm' : ''}`}
                    onClick={() => navigate(item.route)}
                  >
                    <item.icon className={`h-5 w-5 ${currentRoute === item.route ? 'text-foreground' : 'text-muted-foreground'}`} />
                    
                    {/* Active indicator */}
                    {currentRoute === item.route && (
                      <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-primary"></span>
                    )}
                    
                    {/* Route badge */}
                    {(item.route === "startup-dashboard" || 
                      item.route === "support-structure-dashboard" || 
                      item.route === "admin-portal" || 
                      item.route === "client-dashboard" ||
                      item.route === "dashboard-overview") && (
                      <span className={`absolute top-0 right-0 w-2 h-2 rounded-full ${item.color}`}></span>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>{item.tooltip || item.label}</p>
                  {item.route === "dashboard-overview" && userRole && (
                    <p className="text-xs text-muted-foreground">Currently logged in as {userRole}</p>
                  )}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </motion.nav>
      </TooltipProvider>
    );
  }

  // Mobile navigation
  return (
    <AnimatePresence>
      {!hideNav && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-50"
        >
          <div className="bg-card border-t border-border p-2 flex flex-col">
            {/* Primary navigation items for smaller screens */}
            <div className="flex items-center justify-between">
              {/* Show just primary nav items on small screens */}
              {navItems.slice(0, isSmallMobile ? 4 : 5).map((item) => (
                <Button
                  key={item.route}
                  variant="ghost"
                  size="icon"
                  className={`relative rounded-full ${currentRoute === item.route ? 'bg-accent shadow-sm' : ''}`}
                  onClick={() => navigate(item.route)}
                >
                  <item.icon className={`h-5 w-5 ${currentRoute === item.route ? 'text-foreground' : 'text-muted-foreground'}`} />
                  
                  {/* Active indicator */}
                  {currentRoute === item.route && (
                    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-primary"></span>
                  )}
                  
                  {/* Add label below icon for better clarity on mobile */}
                  <span className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-[10px] text-muted-foreground">
                    {item.label}
                  </span>
                </Button>
              ))}
              
              {/* Add the more menu for mobile when we have more than the primary items */}
              {navItems.length > 5 && (
                <Sheet>
                  <SheetTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="relative rounded-full"
                    >
                      <MenuIcon className="h-5 w-5 text-muted-foreground" />
                      <span className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-[10px] text-muted-foreground">
                        More
                      </span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="h-auto max-h-[70vh] rounded-t-2xl pb-14">
                    <div className="grid grid-cols-4 gap-4 mt-6">
                      {navItems.slice(5).map((item) => (
                        <Button
                          key={item.route}
                          variant="ghost"
                          className="flex flex-col items-center justify-center h-auto py-4 gap-2 rounded-xl"
                          onClick={() => {
                            navigate(item.route);
                            // Close the sheet programmatically
                            document.body.click();
                          }}
                        >
                          <div className={`w-10 h-10 rounded-full ${item.color}/10 flex items-center justify-center mb-1`}>
                            <item.icon className={`h-5 w-5 ${currentRoute === item.route ? 'text-foreground' : 'text-muted-foreground'}`} />
                          </div>
                          <span className="text-xs font-medium text-center">{item.label}</span>
                        </Button>
                      ))}
                    </div>
                  </SheetContent>
                </Sheet>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}