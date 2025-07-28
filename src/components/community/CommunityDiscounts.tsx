
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { 
  TagIcon, 
  PercentIcon, 
  SearchIcon, 
  PlusIcon, 
  ShoppingBagIcon, 
  CalendarIcon, 
  ChevronRightIcon, 
  ExternalLinkIcon, 
  CheckCircle2, 
  MoreHorizontalIcon, 
  FilterIcon, 
  ArrowUpRightIcon,
  UsersIcon,
  BarChart3Icon,
  BarChart2Icon,
  TrendingUpIcon,
  StarIcon,
  LinkIcon,
  AlertCircleIcon,
  InfoIcon,
  LineChartIcon,
  PieChartIcon,
  HandshakeIcon,
  PackageIcon,
  CircleDollarSignIcon,
  PanelRightIcon,
  HeartIcon,
  ThumbsUpIcon,
  BellIcon,
  PencilIcon,
  TrashIcon,
  Copy,
  BanknoteIcon,
  PauseIcon,
  XIcon
} from "lucide-react";

// Define interfaces
interface Discount {
  id: string;
  title: string;
  description: string;
  provider: {
    id: string;
    name: string;
    logo: string;
  };
  discountType: "percentage" | "fixed" | "freemium";
  discountValue: number;
  category: string;
  tags: string[];
  validFrom: string;
  validUntil: string;
  redemptionCount: number;
  maxRedemptions: number | null; // null means unlimited
  status: "active" | "draft" | "expired" | "paused";
  termsAndConditions: string;
  exclusiveFor?: string[];
  code?: string;
  featured: boolean;
}

interface RedemptionRequest {
  id: string;
  discountId: string;
  discountTitle: string;
  requester: {
    id: string;
    name: string;
    logo: string;
  };
  provider: {
    id: string;
    name: string;
    logo: string;
  };
  requestDate: string;
  status: "pending" | "approved" | "rejected";
  notes?: string;
}

// The DiscountCard component 
const DiscountCard = ({ discount, onClick }: { discount: Discount; onClick: () => void }) => {
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg border-border/50 hover:border-primary/50">
      <div className="relative">
        {/* Provider logo & category */}
        <div className="flex items-center justify-between p-4 bg-card/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-border/50">
              <ImageWithFallback 
                src={discount.provider.logo} 
                alt={discount.provider.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="text-sm font-medium">{discount.provider.name}</h4>
              <span className="text-xs text-muted-foreground">{discount.category}</span>
            </div>
          </div>
          {discount.featured && (
            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 text-xs">
              <StarIcon className="h-3 w-3 mr-1 fill-yellow-500" />
              Featured
            </Badge>
          )}
        </div>
        
        {/* Discount value highlight */}
        <div className="p-3 bg-primary/10">
          <div className="flex items-center justify-between">
            <Badge 
              className="bg-primary text-primary-foreground px-3 py-1 text-sm font-semibold"
            >
              {discount.discountType === "percentage" ? (
                <span>{discount.discountValue}% OFF</span>
              ) : discount.discountType === "fixed" ? (
                <span>${discount.discountValue} OFF</span>
              ) : (
                <span>FREE</span>
              )}
            </Badge>
            
            <div className="flex items-center text-xs text-muted-foreground">
              <CalendarIcon className="h-3 w-3 mr-1" />
              <span>
                {new Date(discount.validUntil).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{discount.title}</h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{discount.description}</p>
        
        {/* Tags */}
        {discount.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {discount.tags.map((tag, idx) => (
              <span 
                key={idx}
                className="text-xs py-0.5 px-2 rounded-full bg-muted text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between items-center p-4 pt-0">
        <div className="text-xs text-muted-foreground">
          <span>{discount.redemptionCount} redeemed</span>
          {discount.maxRedemptions && (
            <span> of {discount.maxRedemptions}</span>
          )}
        </div>
        
        <Button 
          variant="outline" 
          className="text-primary border-primary/30 hover:border-primary hover:bg-primary/10"
          onClick={onClick}
        >
          <span>Request</span>
          <ChevronRightIcon className="h-4 w-4 ml-1" />
        </Button>
      </CardFooter>
    </Card>
  );
};

// Mock data for discounts
const mockDiscounts: Discount[] = [
  {
    id: "disc_1",
    title: "50% Off AI Customer Service Chatbot",
    description: "Get half off our enterprise AI chatbot for the first 3 months. Perfect for startups looking to automate customer support.",
    provider: {
      id: "startup_1",
      name: "TechInnovate",
      logo: "https://images.unsplash.com/photo-1567446537708-ac4aa75c9c28?q=80&w=1974&auto=format&fit=crop"
    },
    discountType: "percentage",
    discountValue: 50,
    category: "SaaS",
    tags: ["AI", "Customer Service", "Automation"],
    validFrom: "2025-04-01T00:00:00Z",
    validUntil: "2025-07-31T23:59:59Z",
    redemptionCount: 12,
    maxRedemptions: 50,
    status: "active",
    termsAndConditions: "Valid for new customers only. Discount applies to the first 3 months of service.",
    code: "STARTUPAI50",
    featured: true
  },
  {
    id: "disc_2",
    title: "Free Packaging Design Consultation",
    description: "1-hour consultation with our design team to create eco-friendly packaging tailored to your product.",
    provider: {
      id: "startup_2",
      name: "EcoStart",
      logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=1974&auto=format&fit=crop"
    },
    discountType: "freemium",
    discountValue: 0,
    category: "Services",
    tags: ["Design", "Eco-Friendly", "Packaging"],
    validFrom: "2025-04-15T00:00:00Z",
    validUntil: "2025-12-31T23:59:59Z",
    redemptionCount: 8,
    maxRedemptions: 20,
    status: "active",
    termsAndConditions: "One consultation per startup. Additional design work charged at standard rates.",
    featured: false
  },
  {
    id: "disc_3",
    title: "$100 Credit for Health Analytics Platform",
    description: "Get a $100 credit toward any subscription plan of our health data analytics platform.",
    provider: {
      id: "startup_3",
      name: "HealthTech Solutions",
      logo: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2069&auto=format&fit=crop"
    },
    discountType: "fixed",
    discountValue: 100,
    category: "Health Tech",
    tags: ["Analytics", "Healthcare", "Data"],
    validFrom: "2025-05-01T00:00:00Z",
    validUntil: "2025-08-31T23:59:59Z",
    redemptionCount: 5,
    maxRedemptions: null,
    status: "active",
    termsAndConditions: "Credit must be used within 30 days of redemption. Cannot be combined with other offers.",
    code: "HEALTHDATA100",
    featured: true
  },
  {
    id: "disc_4",
    title: "20% Off Mobile App UI Kit",
    description: "Premium UI components for iOS and Android app development at 20% off for VenturesRoom startups.",
    provider: {
      id: "startup_4",
      name: "DesignPro",
      logo: "https://images.unsplash.com/photo-1616469829581-73993eb86b02?q=80&w=2070&auto=format&fit=crop"
    },
    discountType: "percentage",
    discountValue: 20,
    category: "Design",
    tags: ["UI/UX", "Mobile", "Development"],
    validFrom: "2025-04-10T00:00:00Z",
    validUntil: "2025-10-10T23:59:59Z",
    redemptionCount: 15,
    maxRedemptions: null,
    status: "active",
    termsAndConditions: "Discount applies to the full UI kit only, not individual components.",
    code: "VENTURESMOBILE20",
    featured: false
  },
  {
    id: "disc_5",
    title: "3 Months Free Financial Management Software",
    description: "Get our financial management solution free for 3 months to help manage your startup's finances efficiently.",
    provider: {
      id: "startup_5",
      name: "FinFlow",
      logo: "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?q=80&w=2187&auto=format&fit=crop"
    },
    discountType: "freemium",
    discountValue: 0,
    category: "FinTech",
    tags: ["Finance", "Management", "Software"],
    validFrom: "2025-04-01T00:00:00Z",
    validUntil: "2025-06-30T23:59:59Z",
    redemptionCount: 7,
    maxRedemptions: 30,
    status: "active",
    termsAndConditions: "After the 3-month period, standard subscription rates apply. No credit card required to start.",
    code: "FINFLOW3FREE",
    featured: true
  },
  {
    id: "disc_6",
    title: "25% Off Solar Efficiency Consulting",
    description: "Consultation and implementation plan for optimizing solar energy solutions for your office or production facility.",
    provider: {
      id: "startup_6",
      name: "SolarSys",
      logo: "https://images.unsplash.com/photo-1548373319-4c76f43c5fb9?q=80&w=2065&auto=format&fit=crop"
    },
    discountType: "percentage",
    discountValue: 25,
    category: "Green Tech",
    tags: ["Renewable", "Energy", "Consulting"],
    validFrom: "2025-05-01T00:00:00Z",
    validUntil: "2025-09-30T23:59:59Z",
    redemptionCount: 3,
    maxRedemptions: 15,
    status: "active",
    termsAndConditions: "Discount applies to consulting fee only. Implementation costs are separate.",
    code: "STARTUPSOLAR25",
    featured: false
  },
  {
    id: "disc_7",
    title: "Free Educational Webinar Series",
    description: "Access to our premium educational webinar series for startups, covering marketing, finance, and operations.",
    provider: {
      id: "startup_7",
      name: "EdTech Pro",
      logo: "https://images.unsplash.com/photo-1616469829581-73993eb86b02?q=80&w=2070&auto=format&fit=crop"
    },
    discountType: "freemium",
    discountValue: 0,
    category: "EdTech",
    tags: ["Education", "Webinars", "Training"],
    validFrom: "2025-04-15T00:00:00Z",
    validUntil: "2025-12-31T23:59:59Z",
    redemptionCount: 20,
    maxRedemptions: null,
    status: "active",
    termsAndConditions: "Registration required for each webinar. Limited to 2 participants per startup.",
    code: "LEARNANDGROW",
    featured: false
  },
  {
    id: "disc_8",
    title: "30% Off Website Security Audit",
    description: "Comprehensive security audit for your website and web applications with detailed vulnerability report.",
    provider: {
      id: "startup_8",
      name: "SecureTech",
      logo: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1470&auto=format&fit=crop"
    },
    discountType: "percentage",
    discountValue: 30,
    category: "Cybersecurity",
    tags: ["Security", "Audit", "Web"],
    validFrom: "2025-05-01T00:00:00Z",
    validUntil: "2025-07-31T23:59:59Z",
    redemptionCount: 6,
    maxRedemptions: 25,
    status: "active",
    termsAndConditions: "Audit report delivered within 10 business days. Remediation services available at additional cost.",
    code: "SECURESITES30",
    featured: false
  }
];

// Mock data for redemption requests
const mockRedemptionRequests: RedemptionRequest[] = [
  {
    id: "req_1",
    discountId: "disc_1",
    discountTitle: "50% Off AI Customer Service Chatbot",
    requester: {
      id: "startup_5",
      name: "FinFlow",
      logo: "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?q=80&w=2187&auto=format&fit=crop"
    },
    provider: {
      id: "startup_1",
      name: "TechInnovate",
      logo: "https://images.unsplash.com/photo-1567446537708-ac4aa75c9c28?q=80&w=1974&auto=format&fit=crop"
    },
    requestDate: "2025-05-18T14:32:00Z",
    status: "pending",
    notes: "We're looking to improve our customer service automation for our financial software."
  },
  {
    id: "req_2",
    discountId: "disc_3",
    discountTitle: "$100 Credit for Health Analytics Platform",
    requester: {
      id: "startup_2",
      name: "EcoStart",
      logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=1974&auto=format&fit=crop"
    },
    provider: {
      id: "startup_3",
      name: "HealthTech Solutions",
      logo: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2069&auto=format&fit=crop"
    },
    requestDate: "2025-05-17T09:45:00Z",
    status: "approved",
    notes: "Approved for tracking environmental health impacts of our packaging solutions."
  },
  {
    id: "req_3",
    discountId: "disc_2",
    discountTitle: "Free Packaging Design Consultation",
    requester: {
      id: "startup_7",
      name: "EdTech Pro",
      logo: "https://images.unsplash.com/photo-1616469829581-73993eb86b02?q=80&w=2070&auto=format&fit=crop"
    },
    provider: {
      id: "startup_2",
      name: "EcoStart",
      logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=1974&auto=format&fit=crop"
    },
    requestDate: "2025-05-16T11:20:00Z",
    status: "rejected",
    notes: "Not applicable for digital-only products. Recommended to explore our digital packaging solutions instead."
  },
  {
    id: "req_4",
    discountId: "disc_5",
    discountTitle: "3 Months Free Financial Management Software",
    requester: {
      id: "startup_8",
      name: "SecureTech",
      logo: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1470&auto=format&fit=crop"
    },
    provider: {
      id: "startup_5",
      name: "FinFlow",
      logo: "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?q=80&w=2187&auto=format&fit=crop"
    },
    requestDate: "2025-05-15T15:50:00Z",
    status: "approved",
    notes: "Welcome aboard! Your free 3-month access has been activated."
  }
];

interface CommunityDiscountsProps {
  user: any;
}

export function CommunityDiscounts({ user }: CommunityDiscountsProps) {
  const [activeTab, setActiveTab] = useState("discover");
  const [discounts, setDiscounts] = useState<Discount[]>(mockDiscounts);
  const [redemptionRequests, setRedemptionRequests] = useState<RedemptionRequest[]>(mockRedemptionRequests);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("active");
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(null);
  const [isAddDiscountOpen, setIsAddDiscountOpen] = useState(false);
  const [newDiscountData, setNewDiscountData] = useState({
    title: "",
    description: "",
    discountType: "percentage",
    discountValue: 0,
    category: "SaaS",
    validUntil: "",
    maxRedemptions: "",
    termsAndConditions: "",
    code: ""
  });
  const [discountRequestMessage, setDiscountRequestMessage] = useState("");
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  // Filter discounts based on search and filters
  const filteredDiscounts = discounts.filter(discount => {
    const matchesSearch = 
      discount.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      discount.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      discount.provider.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || discount.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || discount.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Get a list of unique categories from all discounts
  const categories = Array.from(new Set(discounts.map(discount => discount.category)));

  // Handle new discount creation
  const handleAddDiscount = () => {
    const currentDate = new Date().toISOString();
    const newDiscount: Discount = {
      id: `disc_${Date.now()}`,
      title: newDiscountData.title,
      description: newDiscountData.description,
      provider: {
        id: user?.id || "current_user",
        name: user?.name || "Your Startup",
        logo: user?.avatar || "https://images.unsplash.com/photo-1567446537708-ac4aa75c9c28?q=80&w=1974&auto=format&fit=crop"
      },
      discountType: newDiscountData.discountType as "percentage" | "fixed" | "freemium",
      discountValue: parseFloat(newDiscountData.discountValue.toString()),
      category: newDiscountData.category,
      tags: [], // Would be populated from a tag input
      validFrom: currentDate,
      validUntil: newDiscountData.validUntil || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // Default to 90 days
      redemptionCount: 0,
      maxRedemptions: newDiscountData.maxRedemptions ? parseInt(newDiscountData.maxRedemptions) : null,
      status: "active",
      termsAndConditions: newDiscountData.termsAndConditions || "Standard terms apply.",
      code: newDiscountData.code || `VENTURES${Math.floor(1000 + Math.random() * 9000)}`,
      featured: false
    };
    
    setDiscounts([newDiscount, ...discounts]);
    setIsAddDiscountOpen(false);
    
    // Reset form
    setNewDiscountData({
      title: "",
      description: "",
      discountType: "percentage",
      discountValue: 0,
      category: "SaaS",
      validUntil: "",
      maxRedemptions: "",
      termsAndConditions: "",
      code: ""
    });
  };

  // Handle discount request
  const handleRequestDiscount = () => {
    if (!selectedDiscount) return;
    
    const newRequest: RedemptionRequest = {
      id: `req_${Date.now()}`,
      discountId: selectedDiscount.id,
      discountTitle: selectedDiscount.title,
      requester: {
        id: user?.id || "current_user",
        name: user?.name || "Your Startup",
        logo: user?.avatar || "https://images.unsplash.com/photo-1567446537708-ac4aa75c9c28?q=80&w=1974&auto=format&fit=crop"
      },
      provider: selectedDiscount.provider,
      requestDate: new Date().toISOString(),
      status: "pending",
      notes: discountRequestMessage
    };
    
    setRedemptionRequests([newRequest, ...redemptionRequests]);
    setIsRequestModalOpen(false);
    setDiscountRequestMessage("");
  };

  // Handle request response (approve or reject)
  const handleRedemptionResponse = (requestId: string, status: "approved" | "rejected") => {
    const updatedRequests = redemptionRequests.map(request => 
      request.id === requestId ? { ...request, status } : request
    );
    
    setRedemptionRequests(updatedRequests);
    
    // If approved, increment redemption count
    if (status === "approved") {
      const request = redemptionRequests.find(r => r.id === requestId);
      if (request) {
        const updatedDiscounts = discounts.map(discount => 
          discount.id === request.discountId 
            ? { ...discount, redemptionCount: discount.redemptionCount + 1 } 
            : discount
        );
        
        setDiscounts(updatedDiscounts);
      }
    }
  };

  // Function to format discount value
  const formatDiscountValue = (discount: Discount) => {
    switch (discount.discountType) {
      case "percentage":
        return `${discount.discountValue}% off`;
      case "fixed":
        return `$${discount.discountValue} off`;
      case "freemium":
        return "Free";
      default:
        return `${discount.discountValue}`;
    }
  };

  // Function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Active
          </Badge>
        );
      case "draft":
        return (
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            <PencilIcon className="h-3 w-3 mr-1" />
            Draft
          </Badge>
        );
      case "expired":
        return (
          <Badge variant="outline" className="bg-muted text-muted-foreground">
            <AlertCircleIcon className="h-3 w-3 mr-1" />
            Expired
          </Badge>
        );
      case "paused":
        return (
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
            <PauseIcon className="h-3 w-3 mr-1" />
            Paused
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };

  // Function to get request status badge
  const getRequestStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
            <AlertCircleIcon className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
            <XIcon className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Startup Community</h1>
          <p className="text-muted-foreground mt-1">
            Discover and offer exclusive discounts to fellow startups in the VenturesRoom community
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            className="bg-primary text-primary-foreground"
            onClick={() => setIsAddDiscountOpen(true)}
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Offer Discount
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Available Discounts</CardTitle>
            <TagIcon className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{discounts.filter(d => d.status === "active").length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active offers from startups
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Your Offers</CardTitle>
            <PercentIcon className="h-5 w-5 text-tertiary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {discounts.filter(d => d.provider.id === (user?.id || "current_user")).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Discounts you're offering
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Redemptions</CardTitle>
            <HandshakeIcon className="h-5 w-5 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {redemptionRequests.filter(r => r.status === "approved").length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Successful collaborations
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="discover" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-transparent border-b w-full rounded-none p-0 h-auto justify-start gap-6">
          <TabsTrigger value="discover" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary px-1 py-3">
            <ShoppingBagIcon className="h-4 w-4 mr-2" />
            Discover Discounts
          </TabsTrigger>
          <TabsTrigger value="manage" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary px-1 py-3">
            <PanelRightIcon className="h-4 w-4 mr-2" />
            Manage Your Offers
          </TabsTrigger>
          <TabsTrigger value="redemptions" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary px-1 py-3">
            <CircleDollarSignIcon className="h-4 w-4 mr-2" />
            Redemption Requests
          </TabsTrigger>
          <TabsTrigger value="analytics" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary px-1 py-3">
            <BarChart2Icon className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>
        
        {/* Discover Discounts Tab */}
        <TabsContent value="discover" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between items-start sm:items-center">
            <div className="relative flex-1 max-w-md">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search discounts..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap sm:flex-nowrap">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Featured Discounts */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <StarIcon className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              Featured Offers
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDiscounts
                .filter(discount => discount.featured && discount.status === "active")
                .map(discount => (
                  <DiscountCard 
                    key={discount.id} 
                    discount={discount} 
                    onClick={() => {
                      setSelectedDiscount(discount);
                      setIsRequestModalOpen(true);
                    }}
                  />
                ))}
                
              {filteredDiscounts.filter(discount => discount.featured && discount.status === "active").length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <StarIcon className="h-8 w-8 mb-2 opacity-40" />
                  <p>No featured offers available</p>
                </div>
              )}
            </div>
          </div>
          
          {/* All Discounts */}
          <div className="space-y-4 mt-8">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <TagIcon className="h-5 w-5 text-primary" />
              All Available Discounts
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDiscounts
                .filter(discount => discount.status === "active")
                .map(discount => (
                  <DiscountCard 
                    key={discount.id} 
                    discount={discount} 
                    onClick={() => {
                      setSelectedDiscount(discount);
                      setIsRequestModalOpen(true);
                    }}
                  />
                ))}
                
              {filteredDiscounts.filter(discount => discount.status === "active").length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <PackageIcon className="h-8 w-8 mb-2 opacity-40" />
                  <p>No discounts available with the current filters</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        {/* Manage Offers Tab */}
        <TabsContent value="manage" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between items-start sm:items-center">
            <h2 className="text-xl font-semibold">Your Discount Offers</h2>
            <Button 
              className="bg-primary text-primary-foreground"
              onClick={() => setIsAddDiscountOpen(true)}
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              New Discount
            </Button>
          </div>
          
          <div className="space-y-4">
            {discounts
              .filter(discount => discount.provider.id === (user?.id || "current_user"))
              .length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {discounts
                    .filter(discount => discount.provider.id === (user?.id || "current_user"))
                    .map(discount => (
                      <Card key={discount.id} className="overflow-hidden">
                        <CardHeader className="bg-card/60 pb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="line-clamp-1">{discount.title}</CardTitle>
                              <CardDescription className="line-clamp-2 mt-1">
                                {discount.description}
                              </CardDescription>
                            </div>
                            {getStatusBadge(discount.status)}
                          </div>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <div className="grid grid-cols-2 gap-4 mb-3">
                            <div>
                              <p className="text-xs text-muted-foreground">Discount</p>
                              <p className="font-medium">{formatDiscountValue(discount)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Category</p>
                              <p className="font-medium">{discount.category}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Redemptions</p>
                              <p className="font-medium">
                                {discount.redemptionCount}
                                {discount.maxRedemptions !== null && ` / ${discount.maxRedemptions}`}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Valid Until</p>
                              <p className="font-medium">
                                {new Date(discount.validUntil).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          
                          {discount.code && (
                            <div className="flex items-center p-2 rounded bg-muted/50 mb-3">
                              <div className="flex-1">
                                <p className="text-xs text-muted-foreground">Discount Code</p>
                                <p className="font-medium font-mono">{discount.code}</p>
                              </div>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Copy code">
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="flex justify-between border-t pt-4">
                          <p className="text-xs text-muted-foreground">
                            Created {new Date(discount.validFrom).toLocaleDateString()}
                          </p>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">Edit</Button>
                            {discount.status === "active" ? (
                              <Button variant="outline" size="sm" className="text-yellow-500 border-yellow-500/30">
                                Pause
                              </Button>
                            ) : discount.status === "paused" ? (
                              <Button variant="outline" size="sm" className="text-emerald-500 border-emerald-500/30">
                                Activate
                              </Button>
                            ) : null}
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg bg-muted/5 border-dashed">
                  <PercentIcon className="h-12 w-12 mb-4 opacity-40 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No Discounts Created Yet</h3>
                  <p className="text-muted-foreground max-w-md mb-6">
                    Offer exclusive discounts to other startups in the VenturesRoom community to increase visibility and build partnerships.
                  </p>
                  <Button 
                    className="bg-primary text-primary-foreground"
                    onClick={() => setIsAddDiscountOpen(true)}
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Create Your First Discount
                  </Button>
                </div>
              )}
          </div>
        </TabsContent>
        
        {/* Redemption Requests Tab */}
        <TabsContent value="redemptions" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between items-start sm:items-center">
            <h2 className="text-xl font-semibold">Redemption Requests</h2>
            
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Tabs defaultValue="incoming" className="space-y-4">
            <TabsList>
              <TabsTrigger value="incoming">Incoming Requests</TabsTrigger>
              <TabsTrigger value="outgoing">Your Requests</TabsTrigger>
            </TabsList>
            
            {/* Incoming Requests Tab */}
            <TabsContent value="incoming" className="space-y-4">
              {redemptionRequests
                .filter(request => request.provider.id === (user?.id || "current_user"))
                .length > 0 ? (
                  <div className="space-y-4">
                    {redemptionRequests
                      .filter(request => request.provider.id === (user?.id || "current_user"))
                      .map(request => (
                        <Card key={request.id}>
                          <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full overflow-hidden border border-border">
                                  <ImageWithFallback 
                                    src={request.requester.logo} 
                                    alt={request.requester.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <CardTitle className="text-base">{request.requester.name}</CardTitle>
                                  <CardDescription>
                                    Requested {new Date(request.requestDate).toLocaleDateString()} at{" "}
                                    {new Date(request.requestDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </CardDescription>
                                </div>
                              </div>
                              {getRequestStatusBadge(request.status)}
                            </div>
                          </CardHeader>
                          <CardContent className="pb-3">
                            <div className="mb-3">
                              <p className="text-sm font-medium mb-1">
                                Requesting: <span className="text-primary">{request.discountTitle}</span>
                              </p>
                              {request.notes && (
                                <div className="p-3 rounded bg-muted/50 text-sm">
                                  <p className="text-muted-foreground line-clamp-3">{request.notes}</p>
                                </div>
                              )}
                            </div>
                          </CardContent>
                          
                          {request.status === "pending" && (
                            <CardFooter className="border-t pt-3 flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                className="text-destructive border-destructive/30 hover:bg-destructive/10"
                                onClick={() => handleRedemptionResponse(request.id, "rejected")}
                              >
                                Decline
                              </Button>
                              <Button 
                                className="bg-primary text-primary-foreground"
                                onClick={() => handleRedemptionResponse(request.id, "approved")}
                              >
                                Approve
                              </Button>
                            </CardFooter>
                          )}
                        </Card>
                      ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg bg-muted/5 border-dashed">
                    <BellIcon className="h-12 w-12 mb-4 opacity-40 text-muted-foreground" />
                    <h3 className="text-xl font-semibold mb-2">No Incoming Requests</h3>
                    <p className="text-muted-foreground max-w-md">
                      You haven't received any discount redemption requests yet. Create attractive offers to get more visibility.
                    </p>
                  </div>
                )}
            </TabsContent>
            
            {/* Outgoing Requests Tab */}
            <TabsContent value="outgoing" className="space-y-4">
              {redemptionRequests
                .filter(request => request.requester.id === (user?.id || "current_user"))
                .length > 0 ? (
                  <div className="space-y-4">
                    {redemptionRequests
                      .filter(request => request.requester.id === (user?.id || "current_user"))
                      .map(request => (
                        <Card key={request.id}>
                          <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full overflow-hidden border border-border">
                                  <ImageWithFallback 
                                    src={request.provider.logo} 
                                    alt={request.provider.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <CardTitle className="text-base">{request.provider.name}</CardTitle>
                                  <CardDescription>
                                    Requested on {new Date(request.requestDate).toLocaleDateString()}
                                  </CardDescription>
                                </div>
                              </div>
                              {getRequestStatusBadge(request.status)}
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="mb-3">
                              <p className="text-sm font-medium mb-1">
                                Discount: <span className="text-primary">{request.discountTitle}</span>
                              </p>
                              {request.notes && (
                                <div className="p-3 rounded bg-muted/50 text-sm mt-2">
                                  <p className="text-muted-foreground">{request.notes}</p>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg bg-muted/5 border-dashed">
                    <CircleDollarSignIcon className="h-12 w-12 mb-4 opacity-40 text-muted-foreground" />
                    <h3 className="text-xl font-semibold mb-2">No Outgoing Requests</h3>
                    <p className="text-muted-foreground max-w-md mb-6">
                      You haven't requested any discounts yet. Browse available offers in the Discover tab.
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => setActiveTab("discover")}
                    >
                      Browse Discounts
                    </Button>
                  </div>
                )}
            </TabsContent>
          </Tabs>
        </TabsContent>
        
        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between items-start sm:items-center">
            <h2 className="text-xl font-semibold">Discount Analytics</h2>
            
            <div className="flex gap-2">
              <Select defaultValue="lastMonth">
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Time Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lastWeek">Last 7 Days</SelectItem>
                  <SelectItem value="lastMonth">Last 30 Days</SelectItem>
                  <SelectItem value="lastQuarter">Last 90 Days</SelectItem>
                  <SelectItem value="thisYear">This Year</SelectItem>
                  <SelectItem value="allTime">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Redemptions</CardTitle>
                <TrendingUpIcon className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {discounts
                    .filter(d => d.provider.id === (user?.id || "current_user"))
                    .reduce((total, discount) => total + discount.redemptionCount, 0)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  +12% from previous period
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <BarChart3Icon className="h-5 w-5 text-tertiary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">43.2%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Request-to-redemption rate
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Discounts</CardTitle>
                <TagIcon className="h-5 w-5 text-chart-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {discounts
                    .filter(d => d.provider.id === (user?.id || "current_user") && d.status === "active")
                    .length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Out of {discounts.filter(d => d.provider.id === (user?.id || "current_user")).length} total offers
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Redemption Trends</CardTitle>
                <CardDescription>
                  Redemption activity over time
                </CardDescription>
              </CardHeader>
              <CardContent className="h-64 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <LineChartIcon className="h-16 w-16 mx-auto mb-4 opacity-40" />
                  <p>Analytics charts will appear here as you collect more data</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Discounts</CardTitle>
                <CardDescription>
                  Discounts with highest redemption rates
                </CardDescription>
              </CardHeader>
              <CardContent className="h-64 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <PieChartIcon className="h-16 w-16 mx-auto mb-4 opacity-40" />
                  <p>Analytics charts will appear here as you collect more data</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Request Discount Dialog */}
      <Dialog open={isRequestModalOpen} onOpenChange={setIsRequestModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Request Discount</DialogTitle>
            <DialogDescription>
              Submit a request to use this discount for your startup
            </DialogDescription>
          </DialogHeader>
          
          {selectedDiscount && (
            <div className="py-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-border">
                  <ImageWithFallback 
                    src={selectedDiscount.provider.logo} 
                    alt={selectedDiscount.provider.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-medium">{selectedDiscount.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    Offered by {selectedDiscount.provider.name}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="message" className="text-sm">
                    Why are you interested in this offer?
                  </Label>
                  <Textarea 
                    id="message"
                    placeholder="Tell the provider how you plan to use their product or service..."
                    className="mt-1.5"
                    value={discountRequestMessage}
                    onChange={(e) => setDiscountRequestMessage(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRequestModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRequestDiscount} className="bg-primary text-primary-foreground">
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Discount Dialog */}
      <Dialog open={isAddDiscountOpen} onOpenChange={setIsAddDiscountOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Discount</DialogTitle>
            <DialogDescription>
              Offer a discount or free service to other startups in the VenturesRoom community
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="title">Discount Title</Label>
              <Input 
                id="title" 
                placeholder="e.g. 30% Off Premium Plan" 
                value={newDiscountData.title}
                onChange={(e) => setNewDiscountData({...newDiscountData, title: e.target.value})}
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                placeholder="Describe your offer in detail..." 
                value={newDiscountData.description}
                onChange={(e) => setNewDiscountData({...newDiscountData, description: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="discountType">Discount Type</Label>
                <Select 
                  value={newDiscountData.discountType}
                  onValueChange={(value) => setNewDiscountData({...newDiscountData, discountType: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                    <SelectItem value="freemium">Free</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="discountValue">
                  {newDiscountData.discountType === "percentage" ? "Percentage" : 
                   newDiscountData.discountType === "fixed" ? "Amount ($)" : "Value"}
                </Label>
                <Input 
                  id="discountValue" 
                  type="number"
                  placeholder={newDiscountData.discountType === "percentage" ? "e.g. 25" : "e.g. 100"}
                  value={newDiscountData.discountValue}
                  onChange={(e) => setNewDiscountData({...newDiscountData, discountValue: parseFloat(e.target.value) || 0})}
                  disabled={newDiscountData.discountType === "freemium"}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={newDiscountData.category}
                  onValueChange={(value) => setNewDiscountData({...newDiscountData, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SaaS">SaaS</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="FinTech">FinTech</SelectItem>
                    <SelectItem value="Health Tech">Health Tech</SelectItem>
                    <SelectItem value="EdTech">EdTech</SelectItem>
                    <SelectItem value="Green Tech">Green Tech</SelectItem>
                    <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
                    <SelectItem value="Services">Services</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="validUntil">Valid Until</Label>
                <Input 
                  id="validUntil" 
                  type="date" 
                  value={newDiscountData.validUntil}
                  onChange={(e) => setNewDiscountData({...newDiscountData, validUntil: e.target.value})}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="maxRedemptions">Max Redemptions</Label>
                <Input 
                  id="maxRedemptions" 
                  type="number" 
                  placeholder="Leave empty for unlimited"
                  value={newDiscountData.maxRedemptions}
                  onChange={(e) => setNewDiscountData({...newDiscountData, maxRedemptions: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="code">Discount Code (Optional)</Label>
                <Input 
                  id="code" 
                  placeholder="e.g. STARTUP2025"
                  value={newDiscountData.code}
                  onChange={(e) => setNewDiscountData({...newDiscountData, code: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="terms">Terms & Conditions</Label>
              <Textarea 
                id="terms" 
                placeholder="Any conditions or limitations for this offer..."
                value={newDiscountData.termsAndConditions}
                onChange={(e) => setNewDiscountData({...newDiscountData, termsAndConditions: e.target.value})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDiscountOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddDiscount} className="bg-primary text-primary-foreground">
              Create Discount
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
