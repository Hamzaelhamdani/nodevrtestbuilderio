import { useState, useEffect } from "react";
import { ThemeProvider } from "./src/components/theme/ThemeProvider";
import { Layout } from "./src/components/layout/Layout";
import { HomePage } from "./src/components/home/HomePage";
import { AuthenticationFlow } from "./src/components/auth/AuthenticationFlow";
import { StartupStorefront } from "./src/components/startup/StartupStorefront";
import { Marketplace } from "./src/components/marketplace/Marketplace";
import { PaymentSystem } from "./src/components/payments/PaymentSystem";
import { CommunityDiscounts } from "./src/components/community/CommunityDiscounts";
import { NavigationBar, Route } from "./src/components/layout/NavigationBar";
import { DashboardRouter } from "./src/components/dashboard/DashboardRouter";
import { DarkModeFallback } from "./src/components/DarkModeFallback";
import { ClientDashboard } from "./src/components/client/ClientDashboard";
import { VentureRoomClub } from "./src/components/club/VentureRoomClub";
import { createInitialBackup } from "./src/components/utils/createInitialBackup";
import { 
  HomeIcon, 
  ShoppingCartIcon, 
  RocketIcon, 
  BuildingIcon, 
  UserIcon, 
  LayoutDashboardIcon, 
  ShieldCheckIcon, 
  BanknoteIcon, 
  TagsIcon,
  HistoryIcon,
  TagIcon,
  LayoutGridIcon
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

// Animation variants
const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.4, ease: "easeInOut" } 
  },
  exit: { 
    opacity: 0, 
    y: -20, 
    transition: { duration: 0.3, ease: "easeInOut" } 
  }
};

// Valid routes for type safety
const validRoutes: Route[] = [
  "home", 
  "auth", 
  "startup-storefront", 
  "support-structure-dashboard", 
  "marketplace",
  "startup-dashboard",
  "admin-portal",
  "payments",
  "community-discounts",
  "client-dashboard",
  "purchase-history",
  "venture-room-club",
  "dashboard-overview" // Add new dashboard overview route
];

// Window interface is defined in types.d.ts

export default function App() {
  // App state
  const [showFallback, setShowFallback] = useState(true);
  const [currentRoute, setCurrentRoute] = useState<Route>("home");
  const [user, setUser] = useState<any>(null);
  const [pageTransition, setPageTransition] = useState(false);

  // SEO route titles mapping
  const routeTitles: Record<Route, string> = {
    "home": "VenturesRoom | The Future of Startup Ecosystems",
    "auth": "Sign In or Sign Up | VenturesRoom",
    "startup-storefront": "Startup Storefront | VenturesRoom",
    "support-structure-dashboard": "Support Structure Dashboard | VenturesRoom",
    "marketplace": "Discover Startups & Products | VenturesRoom Marketplace",
    "startup-dashboard": "Startup Dashboard | VenturesRoom",
    "admin-portal": "Admin Portal | VenturesRoom",
    "payments": "Payments & Commissions | VenturesRoom",
    "community-discounts": "Community & Discounts | VenturesRoom",
    "client-dashboard": "Client Dashboard | VenturesRoom",
    "purchase-history": "Purchase History | VenturesRoom",
    "venture-room-club": "VenturesRoom Club | Exclusive Benefits",
    "dashboard-overview": "Platform Features | VenturesRoom"
  };

  // SEO route descriptions mapping
  const routeDescriptions: Record<Route, string> = {
    "home": "VenturesRoom connects startups, support structures, and clients in one powerful marketplace. Discover, collaborate, and scale in our digital venture space.",
    "auth": "Sign in to your VenturesRoom account or create a new one. Connect with startups, incubators, and clients in our ecosystem.",
    "startup-storefront": "Explore innovative startups, their products and services on the VenturesRoom platform.",
    "support-structure-dashboard": "Manage your support structure, track startups, and analyze performance on VenturesRoom.",
    "marketplace": "Discover and purchase products and services from innovative startups on the VenturesRoom marketplace.",
    "startup-dashboard": "Manage your startup, track performance, and grow your business on VenturesRoom.",
    "admin-portal": "Administrative tools and platform management for VenturesRoom.",
    "payments": "Secure payment processing and commission tracking for the VenturesRoom ecosystem.",
    "community-discounts": "Exclusive discounts and community benefits for VenturesRoom members.",
    "client-dashboard": "Manage your purchases and interact with startups as a client on VenturesRoom.",
    "purchase-history": "Track your purchase history and manage orders on VenturesRoom.",
    "venture-room-club": "Join the exclusive VenturesRoom Club for premium benefits and opportunities.",
    "dashboard-overview": "Explore all features and capabilities of the VenturesRoom platform."
  };

  // Viewport detection helper function (defined before any conditional returns)
  const handleViewportChanges = () => {
    // Update CSS variables based on viewport width
    // This approach allows for more fine-grained control than media queries alone
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    // Adjust for iOS safari address bar
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    
    if (isIOS && isSafari) {
      document.documentElement.classList.add('ios-safari');
    } else {
      document.documentElement.classList.remove('ios-safari');
    }
  };

  // Update document title, meta description, and canonical URL based on current route
  useEffect(() => {
    // Update document title
    document.title = routeTitles[currentRoute];
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', routeDescriptions[currentRoute]);
    }
    
    // Update canonical URL
    const baseUrl = 'https://venturesroom.com';
    let canonicalPath = '/';
    
    // Map routes to paths
    switch (currentRoute) {
      case 'home':
        canonicalPath = '/';
        break;
      case 'auth':
        canonicalPath = '/auth';
        break;
      case 'marketplace':
        canonicalPath = '/marketplace';
        break;
      case 'startup-storefront':
        // For dynamic routes, we can add IDs from sessionStorage
        const startupId = sessionStorage.getItem(`startup-storefront-params`) 
          ? JSON.parse(sessionStorage.getItem(`startup-storefront-params`) || '{}').startupId
          : undefined;
        canonicalPath = startupId ? `/startup/${startupId}` : '/startup';
        break;
      // Add other routes as needed
      default:
        canonicalPath = `/${currentRoute.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
    }
    
    // Update canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', `${baseUrl}${canonicalPath}`);
    }
    
    // Also update OG and Twitter URLs
    const ogUrl = document.querySelector('meta[property="og:url"]');
    const twitterUrl = document.querySelector('meta[name="twitter:url"]');
    
    if (ogUrl) {
      ogUrl.setAttribute('content', `${baseUrl}${canonicalPath}`);
    }
    
    if (twitterUrl) {
      twitterUrl.setAttribute('content', `${baseUrl}${canonicalPath}`);
    }
  }, [currentRoute]);

  // Apply saved theme and restore session state
  useEffect(() => {
    // Try to restore last visited route
    const savedRoute = sessionStorage.getItem("currentRoute");
    if (savedRoute && isValidRoute(savedRoute)) {
      setCurrentRoute(savedRoute as Route);
    }

    // Restore user if available
    const savedUser = sessionStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse saved user data");
      }
    }
    
    // Hide fallback after short delay
    const timer = setTimeout(() => {
      setShowFallback(false);
      
      // Create initial backup of the landing page after the app has loaded
      // Only do this when we're on the home route
      if (currentRoute === "home") {
        createInitialBackup();
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [currentRoute]);

  // Initialize viewport height variable and add resize listener
  // IMPORTANT: This hook must be defined before any conditional returns
  useEffect(() => {
    handleViewportChanges();
    window.addEventListener('resize', handleViewportChanges);
    window.addEventListener('orientationchange', handleViewportChanges);
    
    return () => {
      window.removeEventListener('resize', handleViewportChanges);
      window.removeEventListener('orientationchange', handleViewportChanges);
    };
  }, []);

  // Make navigation available globally - with proper types now
  useEffect(() => {
    window.navigateTo = navigate;
    window.setUser = setUser;
    window.handleLogin = handleLogin;
    window.handleLogout = handleLogout;
    
    return () => {
      // Clean up global functions on unmount
      window.navigateTo = undefined as any;
      window.setUser = undefined as any;
      window.handleLogin = undefined as any;
      window.handleLogout = undefined as any;
    };
  }, []);

  // Validate routes
  const isValidRoute = (route: string): route is Route => {
    return validRoutes.includes(route as Route);
  };

  // Navigation with transition animation and optional parameters
  const navigate = (route: Route, params?: Record<string, string>) => {
    if (route === currentRoute && !params) return;
    
    setPageTransition(true);
    
    // Delay to allow exit animation
    setTimeout(() => {
      setCurrentRoute(route);
      sessionStorage.setItem("currentRoute", route);
      
      // Store parameters in session storage if provided
      if (params) {
        sessionStorage.setItem(`${route}-params`, JSON.stringify(params));
      }
      
      window.scrollTo(0, 0);
      setPageTransition(false);
    }, 300);
  };

  // Authentication handlers
  const handleLogin = (userData?: any) => {
    if (userData) {
      const enhancedUserData = {
        ...userData,
        id: userData.id || `user-${Date.now()}`,
        joinDate: userData.joinDate || new Date().toISOString()
      };
      
      setUser(enhancedUserData);
      sessionStorage.setItem("user", JSON.stringify(enhancedUserData));
      
      // Navigate based on user role
      if (userData.role === "startup") {
        navigate("startup-dashboard");
      } else if (userData.role === "Accelerateur/Incubateur") {
        navigate("support-structure-dashboard");
      } else if (userData.role === "admin") {
        navigate("admin-portal");
      } else if (userData.role === "client") {
        navigate("client-dashboard");
      } else {
        navigate("home");
      }
    } else {
      navigate("auth");
    }
  };

  const handleSignup = () => {
    navigate("auth");
  };

  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
    navigate("home");
  };

  // Role-based navigation items
  const getNavItems = () => {
    // Common nav items for all users
    const commonItems = [
      { 
        route: "home" as Route, 
        label: "Home", 
        icon: HomeIcon, 
        color: "bg-primary",
        tooltip: "Return to homepage"
      },
      { 
        route: "marketplace" as Route, 
        label: "Marketplace", 
        icon: ShoppingCartIcon, 
        color: "bg-secondary",
        tooltip: "Browse startup products and services"
      },
      { 
        route: "auth" as Route, 
        label: user ? "Profile" : "Sign In", 
        icon: UserIcon, 
        color: "bg-chart-5",
        tooltip: user ? "View your profile" : "Sign in or create account"
      },
      {
        route: "venture-room-club" as Route,
        label: "Club",
        icon: TagIcon,
        color: "bg-chart-3",
        tooltip: "Explore VentureRoom Club for startup discounts"
      },
      // Add the dashboard overview to common items
      {
        route: "dashboard-overview" as Route,
        label: "Features",
        icon: LayoutGridIcon,
        color: "bg-chart-5",
        tooltip: "Explore all dashboard features"
      }
    ];

    // Role-specific nav items
    if (user?.role === "startup") {
      return [
        ...commonItems,
        { 
          route: "startup-dashboard" as Route, 
          label: "Dashboard", 
          icon: LayoutDashboardIcon, 
          color: "bg-tertiary",
          tooltip: "Manage your startup"
        },
        { 
          route: "startup-storefront" as Route, 
          label: "Storefront", 
          icon: RocketIcon, 
          color: "bg-tertiary",
          tooltip: "View your public storefront"
        },
        { 
          route: "community-discounts" as Route, 
          label: "Community", 
          icon: TagsIcon, 
          color: "bg-chart-3",
          tooltip: "Manage startup community discounts"
        },
        { 
          route: "payments" as Route, 
          label: "Payments", 
          icon: BanknoteIcon, 
          color: "bg-chart-4",
          tooltip: "Manage payments and payouts"
        }
      ];
    } else if (user?.role === "Accelerateur/Incubateur") {
      return [
        ...commonItems,
        { 
          route: "support-structure-dashboard" as Route, 
          label: "Dashboard", 
          icon: BuildingIcon, 
          color: "bg-chart-4",
          tooltip: "Access support structure dashboard"
        },
        { 
          route: "payments" as Route, 
          label: "Commissions", 
          icon: BanknoteIcon, 
          color: "bg-chart-4",
          tooltip: "Track your commission earnings"
        }
      ];
    } else if (user?.role === "admin") {
      return [
        ...commonItems,
        { 
          route: "admin-portal" as Route, 
          label: "Admin", 
          icon: ShieldCheckIcon, 
          color: "bg-destructive",
          tooltip: "Admin portal for platform management"
        },
        { 
          route: "payments" as Route, 
          label: "Payments", 
          icon: BanknoteIcon, 
          color: "bg-chart-4",
          tooltip: "Manage platform payments"
        }
      ];
    } else if (user?.role === "client") {
      return [
        ...commonItems,
        { 
          route: "client-dashboard" as Route, 
          label: "Dashboard", 
          icon: LayoutDashboardIcon, 
          color: "bg-tertiary",
          tooltip: "Access your client dashboard"
        },
        { 
          route: "purchase-history" as Route, 
          label: "Purchases", 
          icon: HistoryIcon, 
          color: "bg-chart-3",
          tooltip: "View your purchase history"
        },
        { 
          route: "payments" as Route, 
          label: "Payments", 
          icon: BanknoteIcon, 
          color: "bg-chart-4",
          tooltip: "Manage your payment methods"
        },
        { 
          route: "startup-storefront" as Route, 
          label: "Startups", 
          icon: RocketIcon, 
          color: "bg-tertiary",
          tooltip: "Explore startup storefronts"
        }
      ];
    } else {
      // Default for logged out users
      return [
        ...commonItems,
        { 
          route: "startup-storefront" as Route, 
          label: "Startups", 
          icon: RocketIcon, 
          color: "bg-tertiary",
          tooltip: "Explore startup storefronts"
        },
        { 
          route: "support-structure-dashboard" as Route, 
          label: "Support", 
          icon: BuildingIcon, 
          color: "bg-chart-4",
          tooltip: "Learn about support structures"
        }
      ];
    }
  };

  // Helper to determine if the current route is a dashboard route
  const isDashboardRoute = (route: string): boolean => {
    return ["startup-dashboard", "support-structure-dashboard", "admin-portal"].includes(route);
  };

  // If showing fallback, only render that
  if (showFallback) {
    return (
      <DarkModeFallback onContinue={() => setShowFallback(false)} />
    );
  }

  return (
    <div className="bg-background text-foreground relative">
      <ThemeProvider>
        <Layout 
          user={user} 
          onLogin={handleLogin} 
          onSignup={handleSignup} 
          onLogout={handleLogout}
          currentRoute={currentRoute}
          navigate={navigate}
        >
          {/* Route-based content with page transitions */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentRoute}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={pageVariants}
              className="min-h-[calc(100vh-80px)] min-h-[calc(var(--vh, 1vh) * 100 - 80px)]"
            >
              {currentRoute === "home" && <HomePage />}
              {currentRoute === "auth" && <AuthenticationFlow onLogin={handleLogin} />}
              {currentRoute === "startup-storefront" && (
                <StartupStorefront 
                  startupId={
                    sessionStorage.getItem(`startup-storefront-params`) 
                      ? JSON.parse(sessionStorage.getItem(`startup-storefront-params`) || '{}').startupId
                      : undefined
                  } 
                />
              )}
              {currentRoute === "marketplace" && <Marketplace />}
              {currentRoute === "payments" && <PaymentSystem user={user} />}
              {currentRoute === "community-discounts" && <CommunityDiscounts user={user} />}
              {currentRoute === "client-dashboard" && <ClientDashboard user={user} />}
              {currentRoute === "purchase-history" && <ClientDashboard user={user} />}
              {currentRoute === "venture-room-club" && (
                <VentureRoomClub 
                  user={user}
                  onLogin={handleLogin}
                  onSignup={handleSignup}
                />
              )}
              
              {/* Use DashboardRouter for all dashboard routes */}
              {isDashboardRoute(currentRoute) && (
                <DashboardRouter 
                  user={user} 
                  currentRoute={currentRoute}
                  navigate={navigate}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation bar */}
          <NavigationBar 
            currentRoute={currentRoute} 
            navigate={navigate} 
            navItems={getNavItems()} 
            userRole={user?.role}
          />
        </Layout>
      </ThemeProvider>
    </div>
  );
}