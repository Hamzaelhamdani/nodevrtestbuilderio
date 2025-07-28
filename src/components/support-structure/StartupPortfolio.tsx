import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ScrollArea } from "../ui/scroll-area";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { 
  SearchIcon, 
  ArrowUpRightIcon, 
  TrendingUpIcon, 
  TrendingDownIcon, 
  FilterIcon,
  SlidersHorizontalIcon,
  BriefcaseIcon,
  BarChart3Icon,
  PieChartIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertCircleIcon,
  ClockIcon,
  CalendarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowRightIcon,
  EyeIcon,
  UserPlusIcon,
  LineChartIcon,
  BellIcon,
  SendIcon,
  MoreVerticalIcon,
  BanknoteIcon
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

// Define types for startup data
interface StartupMetrics {
  revenue: number;
  growthRate: number;
  salesCount: number;
  commissionsEarned: number;
  trend: 'up' | 'down' | 'neutral';
  performance: 'excellent' | 'good' | 'average' | 'poor';
}

interface Startup {
  id: string;
  name: string;
  logo: string;
  description: string;
  category: string;
  stage: 'seed' | 'early' | 'growth' | 'scale';
  joinDate: string;
  metrics: StartupMetrics;
  status: 'active' | 'pending' | 'inactive';
  tags: string[];
  productCount: number;
}

// Sample data for demo purposes
const SAMPLE_STARTUPS: Startup[] = [
  {
    id: "startup-1",
    name: "TechNova AI",
    logo: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    description: "AI-powered business automation tools for enterprise customers.",
    category: "SaaS",
    stage: "growth",
    joinDate: "2024-01-15",
    metrics: {
      revenue: 78500,
      growthRate: 23.5,
      salesCount: 187,
      commissionsEarned: 7850,
      trend: 'up',
      performance: 'excellent'
    },
    status: 'active',
    tags: ["AI", "automation", "enterprise"],
    productCount: 5
  },
  {
    id: "startup-2",
    name: "GreenLeaf Energy",
    logo: "https://images.unsplash.com/photo-1473181488821-2d23949a045a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    description: "Sustainable energy solutions for residential and commercial applications.",
    category: "CleanTech",
    stage: "early",
    joinDate: "2024-03-10",
    metrics: {
      revenue: 32400,
      growthRate: 15.2,
      salesCount: 48,
      commissionsEarned: 3240,
      trend: 'up',
      performance: 'good'
    },
    status: 'active',
    tags: ["renewable", "energy", "sustainability"],
    productCount: 3
  },
  {
    id: "startup-3",
    name: "MediTrack Health",
    logo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    description: "Healthcare monitoring and analytics platform for hospitals and clinics.",
    category: "HealthTech",
    stage: "seed",
    joinDate: "2024-04-05",
    metrics: {
      revenue: 12800,
      growthRate: 8.7,
      salesCount: 24,
      commissionsEarned: 1280,
      trend: 'neutral',
      performance: 'average'
    },
    status: 'pending',
    tags: ["healthcare", "monitoring", "data"],
    productCount: 2
  },
  {
    id: "startup-4",
    name: "FinFlow Solutions",
    logo: "https://images.unsplash.com/photo-1559526324-593bc073d938?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    description: "Financial management tools for small businesses and startups.",
    category: "FinTech",
    stage: "growth",
    joinDate: "2023-11-22",
    metrics: {
      revenue: 92300,
      growthRate: 31.8,
      salesCount: 215,
      commissionsEarned: 9230,
      trend: 'up',
      performance: 'excellent'
    },
    status: 'active',
    tags: ["finance", "accounting", "SMB"],
    productCount: 4
  },
  {
    id: "startup-5",
    name: "CodeWave Dev",
    logo: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    description: "Developer tools and code optimization solutions.",
    category: "DevTools",
    stage: "early",
    joinDate: "2024-02-18",
    metrics: {
      revenue: 41200,
      growthRate: 12.3,
      salesCount: 156,
      commissionsEarned: 4120,
      trend: 'up',
      performance: 'good'
    },
    status: 'active',
    tags: ["development", "tools", "optimization"],
    productCount: 6
  },
  {
    id: "startup-6",
    name: "Quantum Security",
    logo: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    description: "Next-generation cybersecurity solutions using quantum cryptography.",
    category: "Security",
    stage: "scale",
    joinDate: "2023-09-30",
    metrics: {
      revenue: 128500,
      growthRate: 18.9,
      salesCount: 302,
      commissionsEarned: 12850,
      trend: 'down',
      performance: 'good'
    },
    status: 'active',
    tags: ["security", "quantum", "enterprise"],
    productCount: 3
  },
  {
    id: "startup-7",
    name: "EduSpark Learning",
    logo: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    description: "Educational technology platform for K-12 and higher education.",
    category: "EdTech",
    stage: "early",
    joinDate: "2024-01-05",
    metrics: {
      revenue: 28700,
      growthRate: 9.2,
      salesCount: 134,
      commissionsEarned: 2870,
      trend: 'up',
      performance: 'average'
    },
    status: 'inactive',
    tags: ["education", "learning", "technology"],
    productCount: 4
  }
];

// Filter options
type FilterOption = 'all' | 'active' | 'pending' | 'inactive';
type SortOption = 'revenue' | 'growth' | 'date' | 'performance';
type ViewOption = 'grid' | 'list' | 'table';
type StageFilter = 'all' | 'seed' | 'early' | 'growth' | 'scale';

interface StartupPortfolioProps {
  onStartupSelect?: (startupId: string) => void;
}

export function StartupPortfolio({ onStartupSelect }: StartupPortfolioProps) {
  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterOption>('all');
  const [stageFilter, setStageFilter] = useState<StageFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('revenue');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<ViewOption>('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter and sort startups
  const filteredStartups = SAMPLE_STARTUPS.filter(startup => {
    // Filter by search query
    if (searchQuery && !startup.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !startup.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !startup.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false;
    }
    
    // Filter by status
    if (statusFilter !== 'all' && startup.status !== statusFilter) {
      return false;
    }
    
    // Filter by stage
    if (stageFilter !== 'all' && startup.stage !== stageFilter) {
      return false;
    }
    
    return true;
  }).sort((a, b) => {
    // Sort by selected option
    if (sortBy === 'revenue') {
      return sortOrder === 'asc' 
        ? a.metrics.revenue - b.metrics.revenue 
        : b.metrics.revenue - a.metrics.revenue;
    } else if (sortBy === 'growth') {
      return sortOrder === 'asc' 
        ? a.metrics.growthRate - b.metrics.growthRate 
        : b.metrics.growthRate - a.metrics.growthRate;
    } else if (sortBy === 'date') {
      return sortOrder === 'asc' 
        ? new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime() 
        : new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
    } else if (sortBy === 'performance') {
      const performanceRank = { 'excellent': 4, 'good': 3, 'average': 2, 'poor': 1 };
      return sortOrder === 'asc' 
        ? performanceRank[a.metrics.performance] - performanceRank[b.metrics.performance] 
        : performanceRank[b.metrics.performance] - performanceRank[a.metrics.performance];
    }
    return 0;
  });
  
  // Helper functions for rendering
  const getStatusBadge = (status: Startup['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-success text-success-foreground">Active</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">Pending</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">Inactive</Badge>;
      default:
        return null;
    }
  };
  
  const getStageBadge = (stage: Startup['stage']) => {
    switch (stage) {
      case 'seed':
        return <Badge variant="outline" className="bg-chart-3/10 text-chart-3 border-chart-3/20">Seed</Badge>;
      case 'early':
        return <Badge variant="outline" className="bg-chart-4/10 text-chart-4 border-chart-4/20">Early</Badge>;
      case 'growth':
        return <Badge variant="outline" className="bg-chart-5/10 text-chart-5 border-chart-5/20">Growth</Badge>;
      case 'scale':
        return <Badge variant="outline" className="bg-tertiary/10 text-tertiary border-tertiary/20">Scale</Badge>;
      default:
        return null;
    }
  };
  
  const getTrendIcon = (trend: StartupMetrics['trend']) => {
    switch (trend) {
      case 'up':
        return <TrendingUpIcon className="h-4 w-4 text-success" />;
      case 'down':
        return <TrendingDownIcon className="h-4 w-4 text-destructive" />;
      case 'neutral':
        return <ArrowRightIcon className="h-4 w-4 text-muted-foreground" />;
      default:
        return null;
    }
  };
  
  const getPerformanceIndicator = (performance: StartupMetrics['performance']) => {
    switch (performance) {
      case 'excellent':
        return (
          <div className="flex items-center gap-1.5">
            <div className="flex">
              <div className="h-2 w-2 rounded-full bg-success"></div>
              <div className="h-2 w-2 rounded-full bg-success"></div>
              <div className="h-2 w-2 rounded-full bg-success"></div>
              <div className="h-2 w-2 rounded-full bg-success"></div>
            </div>
            <span className="text-xs text-success">Excellent</span>
          </div>
        );
      case 'good':
        return (
          <div className="flex items-center gap-1.5">
            <div className="flex">
              <div className="h-2 w-2 rounded-full bg-chart-4"></div>
              <div className="h-2 w-2 rounded-full bg-chart-4"></div>
              <div className="h-2 w-2 rounded-full bg-chart-4"></div>
              <div className="h-2 w-2 rounded-full bg-muted"></div>
            </div>
            <span className="text-xs text-chart-4">Good</span>
          </div>
        );
      case 'average':
        return (
          <div className="flex items-center gap-1.5">
            <div className="flex">
              <div className="h-2 w-2 rounded-full bg-warning"></div>
              <div className="h-2 w-2 rounded-full bg-warning"></div>
              <div className="h-2 w-2 rounded-full bg-muted"></div>
              <div className="h-2 w-2 rounded-full bg-muted"></div>
            </div>
            <span className="text-xs text-warning">Average</span>
          </div>
        );
      case 'poor':
        return (
          <div className="flex items-center gap-1.5">
            <div className="flex">
              <div className="h-2 w-2 rounded-full bg-destructive"></div>
              <div className="h-2 w-2 rounded-full bg-muted"></div>
              <div className="h-2 w-2 rounded-full bg-muted"></div>
              <div className="h-2 w-2 rounded-full bg-muted"></div>
            </div>
            <span className="text-xs text-destructive">Poor</span>
          </div>
        );
      default:
        return null;
    }
  };
  
  // Handle click on a startup
  const handleStartupClick = (startupId: string) => {
    if (onStartupSelect) {
      onStartupSelect(startupId);
    }
  };
  
  // Toggle sort order
  const handleSortToggle = (option: SortOption) => {
    if (sortBy === option) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(option);
      setSortOrder('desc'); // Default to descending when changing sort option
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with search and filters */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
          <div className="relative w-full md:w-72">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search startups, tags, categories..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <Tabs 
              value={statusFilter} 
              onValueChange={(value) => setStatusFilter(value as FilterOption)}
              className="w-auto"
            >
              <TabsList className="h-9">
                <TabsTrigger value="all" className="text-xs h-7">All</TabsTrigger>
                <TabsTrigger value="active" className="text-xs h-7">Active</TabsTrigger>
                <TabsTrigger value="pending" className="text-xs h-7">Pending</TabsTrigger>
                <TabsTrigger value="inactive" className="text-xs h-7">Inactive</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-9 gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FilterIcon className="h-4 w-4" />
                Filters
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 gap-2">
                    <SlidersHorizontalIcon className="h-4 w-4" />
                    Sort
                    {sortOrder === 'asc' ? (
                      <ArrowUpIcon className="h-3 w-3 ml-1" />
                    ) : (
                      <ArrowDownIcon className="h-3 w-3 ml-1" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    className={sortBy === 'revenue' ? 'bg-accent text-accent-foreground' : ''} 
                    onClick={() => handleSortToggle('revenue')}
                  >
                    <BanknoteIcon className="h-4 w-4 mr-2" />
                    Revenue
                    {sortBy === 'revenue' && (
                      sortOrder === 'asc' ? (
                        <ArrowUpIcon className="h-3 w-3 ml-2" />
                      ) : (
                        <ArrowDownIcon className="h-3 w-3 ml-2" />
                      )
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className={sortBy === 'growth' ? 'bg-accent text-accent-foreground' : ''} 
                    onClick={() => handleSortToggle('growth')}
                  >
                    <TrendingUpIcon className="h-4 w-4 mr-2" />
                    Growth Rate
                    {sortBy === 'growth' && (
                      sortOrder === 'asc' ? (
                        <ArrowUpIcon className="h-3 w-3 ml-2" />
                      ) : (
                        <ArrowDownIcon className="h-3 w-3 ml-2" />
                      )
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className={sortBy === 'date' ? 'bg-accent text-accent-foreground' : ''} 
                    onClick={() => handleSortToggle('date')}
                  >
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Join Date
                    {sortBy === 'date' && (
                      sortOrder === 'asc' ? (
                        <ArrowUpIcon className="h-3 w-3 ml-2" />
                      ) : (
                        <ArrowDownIcon className="h-3 w-3 ml-2" />
                      )
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className={sortBy === 'performance' ? 'bg-accent text-accent-foreground' : ''} 
                    onClick={() => handleSortToggle('performance')}
                  >
                    <BarChart3Icon className="h-4 w-4 mr-2" />
                    Performance
                    {sortBy === 'performance' && (
                      sortOrder === 'asc' ? (
                        <ArrowUpIcon className="h-3 w-3 ml-2" />
                      ) : (
                        <ArrowDownIcon className="h-3 w-3 ml-2" />
                      )
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 px-2">
                    {viewMode === 'grid' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="7" height="7" x="3" y="3" rx="1" />
                        <rect width="7" height="7" x="14" y="3" rx="1" />
                        <rect width="7" height="7" x="14" y="14" rx="1" />
                        <rect width="7" height="7" x="3" y="14" rx="1" />
                      </svg>
                    ) : viewMode === 'list' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="3" x2="21" y1="6" y2="6" />
                        <line x1="3" x2="21" y1="12" y2="12" />
                        <line x1="3" x2="21" y1="18" y2="18" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 3h18v18H3z" />
                        <path d="M21 9H3" />
                        <path d="M21 15H3" />
                        <path d="M12 3v18" />
                      </svg>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    className={viewMode === 'grid' ? 'bg-accent text-accent-foreground' : ''} 
                    onClick={() => setViewMode('grid')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                      <rect width="7" height="7" x="3" y="3" rx="1" />
                      <rect width="7" height="7" x="14" y="3" rx="1" />
                      <rect width="7" height="7" x="14" y="14" rx="1" />
                      <rect width="7" height="7" x="3" y="14" rx="1" />
                    </svg>
                    Grid View
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className={viewMode === 'list' ? 'bg-accent text-accent-foreground' : ''} 
                    onClick={() => setViewMode('list')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                      <line x1="3" x2="21" y1="6" y2="6" />
                      <line x1="3" x2="21" y1="12" y2="12" />
                      <line x1="3" x2="21" y1="18" y2="18" />
                    </svg>
                    List View
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className={viewMode === 'table' ? 'bg-accent text-accent-foreground' : ''} 
                    onClick={() => setViewMode('table')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                      <path d="M3 3h18v18H3z" />
                      <path d="M21 9H3" />
                      <path d="M21 15H3" />
                      <path d="M12 3v18" />
                    </svg>
                    Table View
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        
        {/* Additional filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pt-2 pb-1 flex flex-wrap gap-4 items-center">
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Stage</label>
                  <Tabs 
                    value={stageFilter} 
                    onValueChange={(value) => setStageFilter(value as StageFilter)}
                    className="w-auto"
                  >
                    <TabsList className="h-8">
                      <TabsTrigger value="all" className="text-xs h-6">All</TabsTrigger>
                      <TabsTrigger value="seed" className="text-xs h-6">Seed</TabsTrigger>
                      <TabsTrigger value="early" className="text-xs h-6">Early</TabsTrigger>
                      <TabsTrigger value="growth" className="text-xs h-6">Growth</TabsTrigger>
                      <TabsTrigger value="scale" className="text-xs h-6">Scale</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                
                <div className="flex-1"></div>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                    setStageFilter("all");
                    setSortBy("revenue");
                    setSortOrder("desc");
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Startup count and summary */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{filteredStartups.length}</span> {filteredStartups.length === 1 ? 'startup' : 'startups'}
            {statusFilter !== 'all' && ` with status "${statusFilter}"`}
            {stageFilter !== 'all' && ` in "${stageFilter}" stage`}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>
      </div>
      
      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStartups.map(startup => (
            <Card 
              key={startup.id} 
              className="overflow-hidden transition-all hover:border-chart-4/60 hover:shadow-md cursor-pointer"
              onClick={() => handleStartupClick(startup.id)}
            >
              <div className="h-36 relative">
                <ImageWithFallback
                  src={startup.logo}
                  alt={startup.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 left-0 right-0 p-3 flex justify-between items-start">
                  <div className="flex gap-1.5">
                    {getStatusBadge(startup.status)}
                    {getStageBadge(startup.stage)}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-black/30 hover:bg-black/40 text-white rounded-full" onClick={e => e.stopPropagation()}>
                        <MoreVerticalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={e => e.stopPropagation()}>
                        <EyeIcon className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={e => e.stopPropagation()}>
                        <BellIcon className="h-4 w-4 mr-2" />
                        Set Alerts
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={e => e.stopPropagation()}>
                        <SendIcon className="h-4 w-4 mr-2" />
                        Contact
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={e => e.stopPropagation()}>
                        <CheckCircleIcon className="h-4 w-4 mr-2" />
                        {startup.status === 'active' ? 'Set as Inactive' : 'Set as Active'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base">{startup.name}</CardTitle>
                  <div className="flex items-center">
                    {getTrendIcon(startup.metrics.trend)}
                    <span className={`text-sm ml-1 ${
                      startup.metrics.trend === 'up' ? 'text-success' : 
                      startup.metrics.trend === 'down' ? 'text-destructive' : 
                      'text-muted-foreground'
                    }`}>
                      {startup.metrics.growthRate}%
                    </span>
                  </div>
                </div>
                <CardDescription className="line-clamp-1">{startup.category}</CardDescription>
              </CardHeader>
              
              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {startup.description}
                </p>
                
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Revenue</p>
                    <p className="font-medium">${startup.metrics.revenue.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Commissions</p>
                    <p className="font-medium">${startup.metrics.commissionsEarned.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="mt-3">
                  <p className="text-xs text-muted-foreground mb-1">Performance</p>
                  {getPerformanceIndicator(startup.metrics.performance)}
                </div>
              </CardContent>
              
              <CardFooter className="pt-0">
                <div className="flex justify-between items-center w-full">
                  <div className="text-xs text-muted-foreground flex items-center">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    Joined {new Date(startup.joinDate).toLocaleDateString()}
                  </div>
                  <div className="flex gap-1">
                    <Badge variant="outline" className="text-xs h-5">
                      <BriefcaseIcon className="h-3 w-3 mr-1" />
                      {startup.productCount}
                    </Badge>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-3">
          {filteredStartups.map(startup => (
            <Card 
              key={startup.id} 
              className="overflow-hidden transition-all hover:border-chart-4/60 hover:shadow-md cursor-pointer"
              onClick={() => handleStartupClick(startup.id)}
            >
              <div className="flex">
                <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
                  <ImageWithFallback
                    src={startup.logo}
                    alt={startup.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1 p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{startup.name}</h3>
                      <div className="flex gap-1.5">
                        {getStatusBadge(startup.status)}
                        {getStageBadge(startup.stage)}
                      </div>
                    </div>
                    
                    <div className="flex items-center mt-2 sm:mt-0">
                      {getTrendIcon(startup.metrics.trend)}
                      <span className={`text-sm ml-1 ${
                        startup.metrics.trend === 'up' ? 'text-success' : 
                        startup.metrics.trend === 'down' ? 'text-destructive' : 
                        'text-muted-foreground'
                      }`}>
                        {startup.metrics.growthRate}%
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {startup.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Revenue</p>
                      <p className="font-medium">${startup.metrics.revenue.toLocaleString()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Commissions</p>
                      <p className="font-medium">${startup.metrics.commissionsEarned.toLocaleString()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Products</p>
                      <p className="font-medium">{startup.productCount}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Performance</p>
                      {getPerformanceIndicator(startup.metrics.performance)}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col justify-between p-2 border-l border-border bg-muted/10 hidden sm:flex">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle view details
                    }}
                  >
                    <EyeIcon className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle contact
                    }}
                  >
                    <SendIcon className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle set alerts
                    }}
                  >
                    <BellIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      
      {/* Table View */}
      {viewMode === 'table' && (
        <div className="border rounded-md overflow-hidden">
          <ScrollArea className="h-[calc(100vh-310px)] min-h-[400px]">
            <table className="w-full">
              <thead className="bg-muted/30">
                <tr>
                  <th className="text-left p-3 font-medium text-sm">Startup</th>
                  <th className="text-left p-3 font-medium text-sm">Status</th>
                  <th className="text-left p-3 font-medium text-sm">Stage</th>
                  <th className="text-right p-3 font-medium text-sm">Revenue</th>
                  <th className="text-right p-3 font-medium text-sm">Growth</th>
                  <th className="text-right p-3 font-medium text-sm">Commissions</th>
                  <th className="text-center p-3 font-medium text-sm">Performance</th>
                  <th className="text-center p-3 font-medium text-sm">Products</th>
                  <th className="text-right p-3 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStartups.map(startup => (
                  <tr 
                    key={startup.id} 
                    className="border-t border-border hover:bg-muted/10 cursor-pointer transition-colors"
                    onClick={() => handleStartupClick(startup.id)}
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={startup.logo} alt={startup.name} />
                          <AvatarFallback>{startup.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{startup.name}</p>
                          <p className="text-xs text-muted-foreground">{startup.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">{getStatusBadge(startup.status)}</td>
                    <td className="p-3">{getStageBadge(startup.stage)}</td>
                    <td className="p-3 text-right">${startup.metrics.revenue.toLocaleString()}</td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end">
                        {getTrendIcon(startup.metrics.trend)}
                        <span className={`text-sm ml-1 ${
                          startup.metrics.trend === 'up' ? 'text-success' : 
                          startup.metrics.trend === 'down' ? 'text-destructive' : 
                          'text-muted-foreground'
                        }`}>
                          {startup.metrics.growthRate}%
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-right">${startup.metrics.commissionsEarned.toLocaleString()}</td>
                    <td className="p-3">
                      <div className="flex justify-center">
                        {getPerformanceIndicator(startup.metrics.performance)}
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <Badge variant="outline" className="text-xs">
                        {startup.productCount}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            // View details
                          }}
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Contact
                          }}
                        >
                          <SendIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollArea>
        </div>
      )}
      
      {/* Empty state */}
      {filteredStartups.length === 0 && (
        <div className="border border-dashed rounded-lg p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <BuildingIcon className="h-6 w-6 text-muted-foreground" />
            </div>
          </div>
          <h3 className="text-lg font-medium mb-2">No startups found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery 
              ? `No startups match your search "${searchQuery}"`
              : statusFilter !== 'all' || stageFilter !== 'all'
                ? "No startups match the selected filters"
                : "Add startups to your portfolio to see them here"}
          </p>
          <Button className="gap-2">
            <UserPlusIcon className="h-4 w-4" />
            Add New Startup
          </Button>
        </div>
      )}
    </div>
  );
}