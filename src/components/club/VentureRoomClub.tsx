import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TagIcon, 
  SearchIcon, 
  FilterIcon, 
  PercentIcon, 
  ArrowRightIcon, 
  CheckIcon, 
  InfoIcon, 
  ShoppingBagIcon,
  CopyIcon,
  ExternalLinkIcon,
  StarIcon,
  CheckCircleIcon,
  RocketIcon,
  RefreshCwIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  LayoutGridIcon,
  ListIcon,
  ClipboardCopyIcon,
  CheckSquareIcon,
  ChevronRightIcon
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";
import { Slider } from "../ui/slider";
import { Label } from "../ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from "../ui/hover-card";
import { toast } from "sonner";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { copyToClipboard } from "../utils/clipboard";

// Types for the VentureRoomClub component
interface VentureRoomClubProps {
  user: any; // User data with role, etc.
  onLogin: (userData?: any) => void;
  onSignup: () => void;
}

interface StartupDiscount {
  id: string;
  companyName: string;
  logo: string;
  industry: string;
  description: string;
  discountPercentage: number;
  promoCode: string;
  websiteUrl: string;
  joinedDate: string;
  expiryDate: string;
  popularity: number; // 1-10 scale for sorting
  featured?: boolean;
}

// Mock data for startups offering discounts
const MOCK_STARTUPS: StartupDiscount[] = [
  {
    id: "s1",
    companyName: "CloudStack",
    logo: "https://images.unsplash.com/photo-1569017388730-020b5f80a004?q=80&w=100&auto=format&fit=crop",
    industry: "Cloud Infrastructure",
    description: "Enterprise-grade cloud infrastructure platform with advanced security features.",
    discountPercentage: 25,
    promoCode: "VENTURES25",
    websiteUrl: "https://cloudstack-example.com",
    joinedDate: "2025-01-15",
    expiryDate: "2025-12-31",
    popularity: 9,
    featured: true
  },
  {
    id: "s2",
    companyName: "DataNova",
    logo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=100&auto=format&fit=crop",
    industry: "Analytics",
    description: "AI-powered data analytics platform for business intelligence.",
    discountPercentage: 30,
    promoCode: "DATANOVA30",
    websiteUrl: "https://datanova-example.com",
    joinedDate: "2025-02-10",
    expiryDate: "2025-11-15",
    popularity: 8
  },
  {
    id: "s3",
    companyName: "Marketo",
    logo: "https://images.unsplash.com/photo-1600003263720-95b45a4035d5?q=80&w=100&auto=format&fit=crop",
    industry: "Marketing",
    description: "All-in-one marketing automation tools for startups and small businesses.",
    discountPercentage: 20,
    promoCode: "MARKETO20",
    websiteUrl: "https://marketo-example.com",
    joinedDate: "2025-01-20",
    expiryDate: "2025-10-30",
    popularity: 7
  },
  {
    id: "s4",
    companyName: "Techly",
    logo: "https://images.unsplash.com/photo-1560415755-bd80d06eda60?q=80&w=100&auto=format&fit=crop",
    industry: "Development Tools",
    description: "Developer tools suite with integrated CI/CD pipelines.",
    discountPercentage: 35,
    promoCode: "TECHDEV35",
    websiteUrl: "https://techly-example.com",
    joinedDate: "2025-03-05",
    expiryDate: "2025-09-15",
    popularity: 8
  },
  {
    id: "s5",
    companyName: "FinEdge",
    logo: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=100&auto=format&fit=crop",
    industry: "Fintech",
    description: "Financial management platform for startups with automated bookkeeping.",
    discountPercentage: 15,
    promoCode: "FINEDGE15",
    websiteUrl: "https://finedge-example.com",
    joinedDate: "2025-02-25",
    expiryDate: "2025-08-30",
    popularity: 6
  },
  {
    id: "s6",
    companyName: "Recruit AI",
    logo: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?q=80&w=100&auto=format&fit=crop",
    industry: "HR",
    description: "AI-powered recruitment platform for talent acquisition and management.",
    discountPercentage: 40,
    promoCode: "RECRUITAI40",
    websiteUrl: "https://recruitai-example.com",
    joinedDate: "2025-03-20",
    expiryDate: "2025-12-15",
    popularity: 7,
    featured: true
  }
];

// Industries for filtering
const INDUSTRIES = [
  "All Industries",
  "Cloud Infrastructure",
  "Analytics",
  "Marketing",
  "Development Tools",
  "Fintech",
  "HR",
  "SaaS",
  "Security",
  "Productivity"
];

export function VentureRoomClub({ user, onLogin, onSignup }: VentureRoomClubProps) {
  // State management
  const [startups, setStartups] = useState<StartupDiscount[]>(MOCK_STARTUPS);
  const [filteredStartups, setFilteredStartups] = useState<StartupDiscount[]>(MOCK_STARTUPS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("All Industries");
  const [minDiscount, setMinDiscount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(true);
  const [joinFormData, setJoinFormData] = useState({
    companyName: "",
    industry: "SaaS",
    description: "",
    discountPercentage: 15, // Initial discount percentage
    websiteUrl: ""
  });

  // Track which promo codes were successfully copied (for visual feedback)
  const [copiedCodes, setCopiedCodes] = useState<{[key: string]: boolean}>({});

  // Track expanded states for mobile accordion list view
  const [expandedRows, setExpandedRows] = useState<{[key: string]: boolean}>({});

  // Check if screen is mobile (for responsive design)
  const [isMobile, setIsMobile] = useState(false);
  const [isSmallMobile, setIsSmallMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsSmallMobile(width < 480);
      
      // Auto collapse filters on mobile
      if (width < 768) {
        setFiltersExpanded(false);
      } else {
        setFiltersExpanded(true);
      }
    };
    
    // Check on mount
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Filter startups based on search term, industry and minimum discount
  useEffect(() => {
    let results = [...startups];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        startup => 
          startup.companyName.toLowerCase().includes(term) ||
          startup.industry.toLowerCase().includes(term) ||
          startup.description.toLowerCase().includes(term)
      );
    }
    
    if (selectedIndustry !== "All Industries") {
      results = results.filter(startup => startup.industry === selectedIndustry);
    }
    
    if (minDiscount > 0) {
      results = results.filter(startup => startup.discountPercentage >= minDiscount);
    }
    
    setFilteredStartups(results);
  }, [searchTerm, selectedIndustry, minDiscount, startups]);

  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle industry filter change
  const handleIndustryChange = (industry: string) => {
    setSelectedIndustry(industry);
  };

  // Handle discount slider change
  const handleDiscountChange = (value: number[]) => {
    setMinDiscount(value[0]);
  };

  // Toggle expanded row in mobile list view
  const toggleRowExpanded = (id: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Handle copying promo code using our utility with fallback mechanism
  const handleCopyPromoCode = (promoCode: string) => {
    // Attempt to copy with improved utility that handles permissions errors
    copyToClipboard(promoCode)
      .then((success) => {
        if (success) {
          // Add to copied codes for visual feedback
          setCopiedCodes(prev => ({ ...prev, [promoCode]: true }));
          
          // Reset the copied status after 2 seconds
          setTimeout(() => {
            setCopiedCodes(prev => ({ ...prev, [promoCode]: false }));
          }, 2000);
          
          // Success notification when copy was successful
          toast.success("Promo code copied!", {
            description: `Use ${promoCode} during checkout`,
            duration: 3000
          });
        } else {
          // When copy fails, show the promo code for manual copying
          toast({
            description: (
              <div className="flex flex-col gap-2">
                <p>Please copy this code manually:</p>
                <div className="bg-muted/30 p-2 rounded-md font-mono text-center select-all">
                  {promoCode}
                </div>
              </div>
            ),
            duration: 5000,
          });
        }
      });
  };

  // Refresh startups list (simulating data fetch)
  const refreshStartups = () => {
    setIsLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Shuffle the order a bit to simulate refresh
      const shuffled = [...MOCK_STARTUPS].sort(() => Math.random() - 0.5);
      setStartups(shuffled);
      setIsLoading(false);
      
      toast.success("Club discounts refreshed!", {
        description: "Latest startup discounts loaded",
      });
    }, 800);
  };

  // Handle form input changes for join dialog
  const handleJoinFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setJoinFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle discount slider change in join form
  const handleJoinDiscountChange = (value: number[]) => {
    setJoinFormData(prev => ({ ...prev, discountPercentage: value[0] }));
  };

  // Handle register button in dialog
  const handleRegister = () => {
    // Validate form
    if (!joinFormData.companyName || !joinFormData.description || !joinFormData.websiteUrl) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (joinFormData.discountPercentage < 10) {
      toast.error("Minimum discount must be at least 10%");
      return;
    }
    
    // Close dialog
    setIsRegisterDialogOpen(false);
    
    // Show success message
    toast.success("Registration successful!", {
      description: "Your application has been submitted for review",
    });
    
    // If user is not logged in, redirect to signup
    if (!user) {
      setTimeout(() => {
        onSignup();
      }, 1500);
    }
  };

  // Sort startups with featured first, then by popularity
  const sortedStartups = [...filteredStartups].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return b.popularity - a.popularity;
  });

  // Toggle filters visibility on mobile
  const toggleFilters = () => {
    setFiltersExpanded(!filtersExpanded);
  };

  // Non-authenticated view component
  const NonAuthView = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-3xl mx-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="bg-primary/10 p-6 rounded-full inline-block mb-6">
          <TagIcon className="h-12 w-12 text-primary" />
        </div>
        <h1 className="mb-4">VentureRoom Club</h1>
        <p className="mb-8 text-muted-foreground">
          Exclusive discounts from top startups, only for VentureRoom members. 
          Sign in to browse available offers or register your startup to offer discounts.
        </p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 w-full max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Browse Discounts</CardTitle>
            <CardDescription>
              Access exclusive deals from our startup community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-6">
              <PercentIcon className="h-12 w-12 text-primary/70" />
            </div>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-primary" />
                <span>Up to 40% off on startup services</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-primary" />
                <span>Exclusive member-only promotions</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-primary" />
                <span>Direct access to startup founders</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button onClick={() => onLogin()} className="w-full">
              Sign In to Access
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Register Your Startup</CardTitle>
            <CardDescription>
              Offer exclusive discounts to the VentureRoom community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-6">
              <RocketIcon className="h-12 w-12 text-primary/70" />
            </div>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-primary" />
                <span>Reach new potential customers</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-primary" />
                <span>Build relationships with other startups</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-primary" />
                <span>Increase visibility in the ecosystem</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button onClick={() => setIsRegisterDialogOpen(true)} className="w-full" variant="outline">
              Register Your Startup
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );

  // Main authenticated view with startup discounts
  const AuthenticatedView = () => (
    <div className="min-h-screen">
      <div className="container py-6 md:py-8 px-4 md:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8">
          <div className="flex-1">
            <h1 className="flex items-center gap-3 mb-2 text-2xl md:text-3xl">
              <TagIcon className="h-6 w-6 md:h-8 md:w-8 text-primary" />
              VentureRoom Club
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Exclusive discounts from the startup community, for the startup community
            </p>
          </div>
          
          <div className="flex flex-row flex-wrap gap-3 justify-end">
            {user?.role === "startup" && (
              <Button 
                onClick={() => setIsRegisterDialogOpen(true)} 
                variant="outline"
                size={isMobile ? "sm" : "default"}
                className="whitespace-nowrap"
              >
                <span className="hidden sm:inline">Offer a </span>Discount
              </Button>
            )}
            <Button 
              onClick={refreshStartups} 
              disabled={isLoading}
              size={isMobile ? "sm" : "default"}
              className="whitespace-nowrap"
            >
              {isLoading ? (
                <>
                  <RefreshCwIcon className="mr-2 h-4 w-4 animate-spin" />
                  <span className="hidden sm:inline">Refreshing...</span>
                  <span className="sm:hidden">...</span>
                </>
              ) : (
                <>
                  <RefreshCwIcon className="mr-2 h-4 w-4" />
                  <span>Refresh</span>
                </>
              )}
            </Button>
          </div>
        </div>
        
        {/* Search and filters */}
        <div className="mb-6 md:mb-8">
          {/* Search with toggle filters button on mobile */}
          <div className="relative mb-4">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search startups, industries, or services..."
              className="pl-10 pr-12 md:pr-3"
              value={searchTerm}
              onChange={handleSearch}
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 md:hidden"
              onClick={toggleFilters}
              aria-label={filtersExpanded ? "Hide filters" : "Show filters"}
            >
              <FilterIcon className="h-4 w-4 mr-1" />
              <span className="text-xs">Filters</span>
              {filtersExpanded ? (
                <ChevronUpIcon className="h-3 w-3 ml-1" />
              ) : (
                <ChevronDownIcon className="h-3 w-3 ml-1" />
              )}
            </Button>
          </div>
          
          {/* Responsive grid layout */}
          <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
            {/* Filters panel with animation */}
            <AnimatePresence>
              {filtersExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="bg-muted/20 rounded-lg p-4 border border-border">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <FilterIcon className="h-4 w-4 text-muted-foreground" />
                        <Label className="text-muted-foreground">Filters</Label>
                      </div>
                      
                      {filteredStartups.length > 0 && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-xs h-7 px-2 py-1"
                          onClick={() => {
                            setSearchTerm("");
                            setSelectedIndustry("All Industries");
                            setMinDiscount(0);
                          }}
                        >
                          Reset
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="industry">Industry</Label>
                        <select
                          id="industry"
                          className="w-full rounded-md border-border bg-background px-3 py-2 text-sm"
                          value={selectedIndustry}
                          onChange={(e) => handleIndustryChange(e.target.value)}
                        >
                          {INDUSTRIES.map(industry => (
                            <option key={industry} value={industry}>
                              {industry}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="discountRange">Min. Discount</Label>
                          <Badge variant="outline" className="text-xs px-2 py-0 h-5">
                            {minDiscount}%
                          </Badge>
                        </div>
                        <Slider
                          id="discountRange"
                          min={0}
                          max={50}
                          step={5}
                          value={[minDiscount]}
                          onValueChange={handleDiscountChange}
                          className="py-2"
                        />
                        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                          <span>0%</span>
                          <span>25%</span>
                          <span>50%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Benefits card - visible on larger screens, moves below on mobile */}
            <div className={`${!filtersExpanded ? 'col-span-full' : ''} ${isMobile ? 'order-2 mt-4' : ''}`}>
              <Card className="bg-primary/5 border-primary/20 h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <StarIcon className="h-4 w-4 mr-2 text-primary" />
                    Club Benefits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircleIcon className="h-4 w-4 shrink-0 text-primary" />
                      <span className="text-sm">Exclusive startup discounts</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircleIcon className="h-4 w-4 shrink-0 text-primary" />
                      <span className="text-sm">Connect with other founders</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircleIcon className="h-4 w-4 shrink-0 text-primary" />
                      <span className="text-sm">Early access to new features</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircleIcon className="h-4 w-4 shrink-0 text-primary" />
                      <span className="text-sm">Member-only events</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        {/* Results count and tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <p className="text-sm text-muted-foreground order-2 sm:order-1">
            Showing <span className="font-semibold text-foreground">{filteredStartups.length}</span> startups
            {selectedIndustry !== "All Industries" ? ` in ${selectedIndustry}` : ""}
            {minDiscount > 0 ? ` with at least ${minDiscount}% discount` : ""}
          </p>
          
          {/* Tabs component with improved mobile layout */}
          <Tabs defaultValue="grid" className="w-full sm:w-auto order-1 sm:order-2">
            <TabsList className="grid w-full sm:w-auto grid-cols-2 h-9">
              <TabsTrigger value="grid" className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm">
                <LayoutGridIcon className="h-3.5 w-3.5" />
                <span>Grid</span>
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm">
                <ListIcon className="h-3.5 w-3.5" />
                <span>List</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Startup discount cards - Grid View */}
            <TabsContent value="grid" className="mt-6">
              {filteredStartups.length === 0 ? (
                <div className="text-center py-8 md:py-12 px-4">
                  <div className="bg-muted/20 inline-flex p-4 rounded-full mb-4">
                    <SearchIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="mb-2">No startups found</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Try adjusting your filters or search terms to find what you're looking for
                  </p>
                  <Button onClick={() => {
                    setSearchTerm("");
                    setSelectedIndustry("All Industries");
                    setMinDiscount(0);
                    setFiltersExpanded(true);
                  }}>
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {sortedStartups.map((startup) => (
                    <StartupDiscountCard 
                      key={startup.id} 
                      startup={startup} 
                      onCopyPromoCode={handleCopyPromoCode}
                      isCopied={!!copiedCodes[startup.promoCode]}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            
            {/* Startup discount list - List View */}
            <TabsContent value="list" className="mt-6">
              {filteredStartups.length === 0 ? (
                <div className="text-center py-8 md:py-12 px-4">
                  <div className="bg-muted/20 inline-flex p-4 rounded-full mb-4">
                    <SearchIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="mb-2">No startups found</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Try adjusting your filters or search terms to find what you're looking for
                  </p>
                  <Button onClick={() => {
                    setSearchTerm("");
                    setSelectedIndustry("All Industries");
                    setMinDiscount(0);
                    setFiltersExpanded(true);
                  }}>
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedStartups.map((startup) => (
                    <StartupDiscountRow 
                      key={startup.id} 
                      startup={startup} 
                      onCopyPromoCode={handleCopyPromoCode}
                      isCopied={!!copiedCodes[startup.promoCode]}
                      isExpanded={!!expandedRows[startup.id]}
                      onToggleExpand={() => toggleRowExpanded(startup.id)}
                      isMobile={isMobile}
                      isSmallMobile={isSmallMobile}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Registration dialog */}
      <Dialog open={isRegisterDialogOpen} onOpenChange={setIsRegisterDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Register Your Startup</DialogTitle>
            <DialogDescription>
              Offer exclusive discounts to other VentureRoom startups and increase your visibility.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                name="companyName"
                placeholder="Your Startup Name"
                value={joinFormData.companyName}
                onChange={handleJoinFormChange}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="industrySelect">Industry *</Label>
              <select
                id="industrySelect"
                name="industry"
                className="w-full rounded-md border-border bg-background px-3 py-2"
                value={joinFormData.industry}
                onChange={handleJoinFormChange}
              >
                {INDUSTRIES.filter(i => i !== "All Industries").map(industry => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description *</Label>
              <textarea
                id="description"
                name="description"
                placeholder="Brief description of your products or services"
                className="min-h-[100px] w-full rounded-md border-border bg-background px-3 py-2"
                value={joinFormData.description}
                onChange={handleJoinFormChange}
              />
            </div>
            
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label>Discount Percentage *</Label>
                <Badge variant="outline">{joinFormData.discountPercentage}%</Badge>
              </div>
              <div className="py-4">
                <Slider
                  min={10}
                  max={50}
                  step={5}
                  value={[joinFormData.discountPercentage]}
                  onValueChange={handleJoinDiscountChange}
                />
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>10%</span>
                  <span>30%</span>
                  <span>50%</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Minimum 10% discount required for club membership
              </p>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="websiteUrl">Website URL *</Label>
              <Input
                id="websiteUrl"
                name="websiteUrl"
                placeholder="https://your-startup.com"
                value={joinFormData.websiteUrl}
                onChange={handleJoinFormChange}
              />
            </div>
          </div>
          
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsRegisterDialogOpen(false)}
              className="sm:order-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleRegister}
              className="sm:order-2"
            >
              Register
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );

  return user ? <AuthenticatedView /> : <NonAuthView />;
}

// StartupDiscountCard Component for Grid View
function StartupDiscountCard({ 
  startup, 
  onCopyPromoCode,
  isCopied
}: { 
  startup: StartupDiscount, 
  onCopyPromoCode: (code: string) => void,
  isCopied?: boolean
}) {
  return (
    <Card className="overflow-hidden transition-all hover:border-primary/50 hover:shadow-md h-full flex flex-col">
      {startup.featured && (
        <div className="bg-primary text-primary-foreground px-4 py-1 text-xs text-center font-medium">
          Featured Offer
        </div>
      )}
      
      <CardHeader className="space-y-0 pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 rounded-md">
              <AvatarImage src={startup.logo} alt={startup.companyName} />
              <AvatarFallback className="rounded-md">
                {startup.companyName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base md:text-lg font-semibold">
                {startup.companyName}
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">{startup.industry}</CardDescription>
            </div>
          </div>
          <Badge 
            className="text-sm md:text-base px-2 md:px-3" 
            variant="secondary"
          >
            {startup.discountPercentage}% off
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-2 flex-1">
        <p className="text-xs md:text-sm mb-4 line-clamp-3">
          {startup.description}
        </p>
        
        {/* Enhanced Promo Code Box */}
        <div 
          className={`rounded-md p-3 flex items-center justify-between mb-4 cursor-pointer transition-all duration-300 select-none ${
            isCopied 
              ? "bg-primary/20 border border-primary" 
              : "bg-muted/30 hover:bg-primary/10 hover:border-primary/30 border border-transparent"
          }`}
          onClick={() => onCopyPromoCode(startup.promoCode)}
        >
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground">Promo Code</span>
              <span className={`text-xs ${isCopied ? "text-primary" : "text-muted-foreground/70"} transition-colors duration-300`}>
                {isCopied ? "• Copied!" : "• Click to copy"}
              </span>
            </div>
            <div className="font-mono text-sm font-medium select-all">{startup.promoCode}</div>
          </div>
          <div className="flex items-center justify-center h-8 w-8">
            {isCopied ? (
              <CheckIcon className="h-4 w-4 text-primary" />
            ) : (
              <ClipboardCopyIcon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div>Valid until {new Date(startup.expiryDate).toLocaleDateString()}</div>
          
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="link" size="sm" className="text-xs h-auto p-0">
                <InfoIcon className="h-3 w-3 mr-1" />
                Details
              </Button>
            </HoverCardTrigger>
            <HoverCardContent side="top" className="w-80">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Offer Details</h4>
                <Separator />
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Company:</span> 
                    <span>{startup.companyName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Discount:</span> 
                    <span>{startup.discountPercentage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Code:</span> 
                    <span>{startup.promoCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Valid until:</span> 
                    <span>{new Date(startup.expiryDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Member since:</span> 
                    <span>{new Date(startup.joinedDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 flex gap-2 mt-auto">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1 h-8"
          onClick={() => onCopyPromoCode(startup.promoCode)}
        >
          {isCopied ? (
            <>
              <CheckIcon className="h-3 w-3 mr-1 text-primary" />
              Copied!
            </>
          ) : (
            <>
              <CopyIcon className="h-3 w-3 mr-1" />
              Copy Code
            </>
          )}
        </Button>
        <Button 
          size="sm" 
          className="flex-1 h-8"
          onClick={() => window.open(startup.websiteUrl, '_blank')}
        >
          <ExternalLinkIcon className="h-3 w-3 mr-1" />
          Visit Site
        </Button>
      </CardFooter>
    </Card>
  );
}

// StartupDiscountRow Component for List View
function StartupDiscountRow({ 
  startup, 
  onCopyPromoCode,
  isCopied,
  isExpanded,
  onToggleExpand,
  isMobile,
  isSmallMobile
}: { 
  startup: StartupDiscount, 
  onCopyPromoCode: (code: string) => void,
  isCopied?: boolean,
  isExpanded?: boolean,
  onToggleExpand?: () => void,
  isMobile?: boolean,
  isSmallMobile?: boolean
}) {
  // Determine if we should render in "extra small" mode (very small screens)
  const isExtraSmall = isSmallMobile;
  
  // Helper for rendering the discount badge in different layouts
  const DiscountBadge = () => (
    <Badge 
      variant={isExtraSmall ? "secondary" : "outline"} 
      className={`text-sm ${isExtraSmall ? 'px-1.5 py-0 h-5' : 'px-2 h-6'}`}
    >
      {startup.discountPercentage}% off
    </Badge>
  );
  
  // Helper for rendering the promo code section in different layouts
  const PromoCodeSection = () => (
    <div 
      className={`rounded-md flex items-center cursor-pointer transition-all duration-300 ${
        isCopied 
          ? "bg-primary/20 border border-primary" 
          : "bg-muted/30 hover:bg-primary/10 hover:border-primary/30 border border-transparent"
      } ${isExtraSmall ? 'px-2 py-1 mt-2 w-full' : 'px-3 py-1.5'}`}
      onClick={(e) => {
        e.stopPropagation();
        onCopyPromoCode(startup.promoCode);
      }}
    >
      <div className="font-mono text-sm mr-2 select-all truncate">
        {startup.promoCode}
      </div>
      <div className="flex items-center justify-center h-6 w-6 flex-shrink-0">
        {isCopied ? (
          <CheckIcon className="h-3.5 w-3.5 text-primary" />
        ) : (
          <ClipboardCopyIcon className="h-3.5 w-3.5 text-muted-foreground" />
        )}
      </div>
    </div>
  );
  
  // Helper for rendering the action buttons in different layouts
  const ActionButtons = () => (
    <div className="flex gap-2 mt-3 sm:mt-0">
      <Button 
        size="sm"
        className={`h-8 ${isExtraSmall ? 'w-full px-2' : 'px-3'}`}
        onClick={(e) => {
          e.stopPropagation();
          window.open(startup.websiteUrl, '_blank');
        }}
      >
        <span className="sm:hidden">Visit</span>
        <span className="hidden sm:inline">Visit Site</span>
        <ExternalLinkIcon className="h-3 w-3 ml-1.5" />
      </Button>
      
      {!isExtraSmall && (
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={(e) => e.stopPropagation()}
            >
              <InfoIcon className="h-4 w-4" />
            </Button>
          </HoverCardTrigger>
          <HoverCardContent side="top" className="w-80">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Offer Details</h4>
              <p className="text-xs">{startup.description}</p>
              <Separator />
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Valid until:</span> 
                  <span>{new Date(startup.expiryDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Member since:</span> 
                  <span>{new Date(startup.joinedDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      )}
    </div>
  );

  // Extra small screen layout (mobile accordion style)
  if (isExtraSmall) {
    return (
      <div className="border border-border rounded-lg overflow-hidden transition-colors">
        <div 
          className={`p-3 ${
            isExpanded ? 'bg-muted/10' : 'hover:bg-muted/5'
          } cursor-pointer transition-colors`}
          onClick={onToggleExpand}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Avatar className="h-10 w-10 rounded-md flex-shrink-0">
                <AvatarImage src={startup.logo} alt={startup.companyName} />
                <AvatarFallback className="rounded-md">
                  {startup.companyName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="font-medium text-base truncate mr-1">
                    {startup.companyName}
                  </h3>
                  {startup.featured && (
                    <Badge variant="secondary" className="text-xs h-5 px-1.5 py-0">Featured</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-sm text-muted-foreground truncate">{startup.industry}</span>
                  <DiscountBadge />
                </div>
              </div>
              <ChevronRightIcon 
                className={`h-5 w-5 text-muted-foreground transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
              />
            </div>
          </div>
        </div>
        
        {/* Expanded content - mobile only */}
        {isExpanded && (
          <div className="p-3 pt-0 border-t border-border/50">
            <p className="text-xs text-muted-foreground mb-3">
              {startup.description}
            </p>
            
            <div className="space-y-3">
              <PromoCodeSection />
              <ActionButtons />
            </div>
            
            <div className="mt-3 pt-3 border-t border-border/50 text-xs text-muted-foreground">
              <div className="flex justify-between items-center">
                <span>Valid until:</span>
                <span>{new Date(startup.expiryDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Mobile but not extra small layout
  if (isMobile && !isExtraSmall) {
    return (
      <div className="border border-border rounded-lg overflow-hidden hover:border-primary/50 hover:bg-muted/5 transition-colors">
        <div className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 rounded-md flex-shrink-0">
              <AvatarImage src={startup.logo} alt={startup.companyName} />
              <AvatarFallback className="rounded-md">
                {startup.companyName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h3 className="font-medium text-base">{startup.companyName}</h3>
                {startup.featured && (
                  <Badge variant="secondary" className="text-xs h-5">Featured</Badge>
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground">{startup.industry}</span>
                <DiscountBadge />
              </div>
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground mt-2 mb-3">
            {startup.description}
          </p>
          
          <div className="space-y-1">
            <PromoCodeSection />
            <ActionButtons />
          </div>
        </div>
      </div>
    );
  }

  // Desktop layout (default)
  return (
    <div className="flex flex-row gap-4 p-4 border border-border rounded-lg hover:border-primary/50 hover:bg-muted/5 transition-colors">
      <div className="flex items-center gap-4 flex-1">
        <Avatar className="h-12 w-12 rounded-md">
          <AvatarImage src={startup.logo} alt={startup.companyName} />
          <AvatarFallback className="rounded-md">
            {startup.companyName.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-medium text-base">{startup.companyName}</h3>
            {startup.featured && (
              <Badge variant="secondary" className="text-xs h-5">Featured</Badge>
            )}
          </div>
          <div className="text-sm text-muted-foreground">{startup.industry}</div>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs line-clamp-2">
            {startup.description}
          </p>
        </div>
      </div>
      
      <div className="flex flex-shrink-0 items-center gap-3">
        <DiscountBadge />
        <PromoCodeSection />
        <ActionButtons />
      </div>
    </div>
  );
}