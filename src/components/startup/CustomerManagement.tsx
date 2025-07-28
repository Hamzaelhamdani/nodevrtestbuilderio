import React, { useState } from "react";
import { 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal, 
  UserPlus, 
  Mail, 
  Calendar, 
  Tag, 
  Clock, 
  Briefcase, 
  Star,
  MessageSquare,
  PieChart,
  Users,
  Activity,
  DollarSign,
  Building,
  Phone,
  ArrowUpRight,
  ListFilter,
  UserCheck
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Progress } from "../ui/progress";
import { format } from 'date-fns';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";

// Customer types
type CustomerSegment = "enterprise" | "sme" | "startup" | "individual";
type CustomerStatus = "active" | "inactive" | "new" | "churned";

interface Order {
  id: string;
  date: string;
  amount: number;
  product: string;
  status: "delivered" | "processing" | "pending" | "refunded";
}

interface Communication {
  id: string;
  type: "email" | "call" | "meeting" | "chat";
  date: string;
  subject: string;
  summary?: string;
  sentiment?: "positive" | "neutral" | "negative";
}

// Customer type definition
interface Customer {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  company?: string;
  position?: string;
  segment: CustomerSegment;
  status: CustomerStatus;
  dateAdded: string;
  lastContact?: string;
  phone?: string;
  location?: string;
  totalSpend: number;
  ordersCount: number;
  tags: string[];
  notes?: string;
  engagementScore: number;
  orders: Order[];
  communications: Communication[];
}

// Mock data for customers
const mockCustomers: Customer[] = [
  {
    id: 'CUST-1001',
    name: 'Olivia Martinez',
    email: 'olivia.martinez@techinnovate.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop',
    company: 'Tech Innovate',
    position: 'CTO',
    segment: 'enterprise',
    status: 'active',
    dateAdded: '2024-12-10T14:30:00Z',
    lastContact: '2025-05-22T11:15:00Z',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    totalSpend: 12500,
    ordersCount: 8,
    tags: ['enterprise', 'tech', 'high-value'],
    notes: 'Interested in our AI integration services. Schedule quarterly check-ins.',
    engagementScore: 92,
    orders: [
      { id: 'ORD-1534', date: '2025-05-15T10:30:00Z', amount: 3500, product: 'AI Integration Service', status: 'delivered' },
      { id: 'ORD-1428', date: '2025-04-02T14:20:00Z', amount: 2500, product: 'Website Audit', status: 'delivered' },
      { id: 'ORD-1387', date: '2025-03-12T09:45:00Z', amount: 1500, product: 'Custom API Development', status: 'delivered' },
    ],
    communications: [
      { id: 'COM-2451', type: 'meeting', date: '2025-05-22T11:15:00Z', subject: 'Quarterly Review', summary: 'Discussed upcoming AI projects and integration timeline', sentiment: 'positive' },
      { id: 'COM-2328', type: 'email', date: '2025-05-10T08:30:00Z', subject: 'Follow-up on Implementation', sentiment: 'neutral' },
      { id: 'COM-2156', type: 'call', date: '2025-04-28T15:45:00Z', subject: 'Technical Support', summary: 'Resolved API integration issue', sentiment: 'positive' },
    ]
  },
  {
    id: 'CUST-1002',
    name: 'Ethan Lee',
    email: 'ethan@growthfunders.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop',
    company: 'Growth Funders',
    position: 'CEO',
    segment: 'sme',
    status: 'active',
    dateAdded: '2025-01-15T09:20:00Z',
    lastContact: '2025-05-18T14:30:00Z',
    phone: '+1 (555) 987-6543',
    location: 'Austin, TX',
    totalSpend: 7800,
    ordersCount: 5,
    tags: ['investor', 'finance', 'referrer'],
    notes: 'Has referred 3 other clients. Eligible for loyalty program.',
    engagementScore: 88,
    orders: [
      { id: 'ORD-1498', date: '2025-05-01T11:20:00Z', amount: 1750, product: 'Financial Dashboard Implementation', status: 'delivered' },
      { id: 'ORD-1432', date: '2025-04-03T16:15:00Z', amount: 2200, product: 'Custom Reports Package', status: 'delivered' },
      { id: 'ORD-1366', date: '2025-03-01T10:10:00Z', amount: 1500, product: 'Investor Portal Setup', status: 'delivered' },
    ],
    communications: [
      { id: 'COM-2442', type: 'email', date: '2025-05-18T14:30:00Z', subject: 'New Feature Request', sentiment: 'neutral' },
      { id: 'COM-2301', type: 'call', date: '2025-04-28T11:00:00Z', subject: 'Service Expansion Discussion', summary: 'Interest in adding portfolio tracking features', sentiment: 'positive' },
      { id: 'COM-2189', type: 'meeting', date: '2025-04-15T13:30:00Z', subject: 'Quarterly Business Review', sentiment: 'positive' },
    ]
  },
  {
    id: 'CUST-1003',
    name: 'Sofia Chang',
    email: 'sofia@innovatelabs.co',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop',
    company: 'Innovate Labs',
    position: 'Lead Developer',
    segment: 'startup',
    status: 'new',
    dateAdded: '2025-05-01T16:45:00Z',
    lastContact: '2025-05-25T10:30:00Z',
    phone: '+1 (555) 234-5678',
    location: 'Seattle, WA',
    totalSpend: 1250,
    ordersCount: 1,
    tags: ['startup', 'tech', 'new-client'],
    notes: 'Found us through marketplace. Interested in development tools.',
    engagementScore: 65,
    orders: [
      { id: 'ORD-1542', date: '2025-05-20T15:30:00Z', amount: 1250, product: 'UI Component Library', status: 'processing' },
    ],
    communications: [
      { id: 'COM-2460', type: 'chat', date: '2025-05-25T10:30:00Z', subject: 'Implementation Support', summary: 'Asked about integration with React framework', sentiment: 'neutral' },
      { id: 'COM-2453', type: 'email', date: '2025-05-22T08:45:00Z', subject: 'Order Confirmation', sentiment: 'positive' },
      { id: 'COM-2448', type: 'call', date: '2025-05-15T11:00:00Z', subject: 'Product Inquiry', summary: 'Initial discussion about component library', sentiment: 'positive' },
    ]
  },
  {
    id: 'CUST-1004',
    name: 'Marcus Johnson',
    email: 'marcus@healthtrackr.io',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=1780&auto=format&fit=crop',
    company: 'HealthTrackr',
    position: 'Product Manager',
    segment: 'startup',
    status: 'active',
    dateAdded: '2025-03-12T11:30:00Z',
    lastContact: '2025-05-10T15:45:00Z',
    phone: '+1 (555) 876-5432',
    location: 'Boston, MA',
    totalSpend: 3500,
    ordersCount: 3,
    tags: ['healthcare', 'product-focused', 'startup'],
    notes: 'Building healthcare analytics platform. Compliance is key concern.',
    engagementScore: 78,
    orders: [
      { id: 'ORD-1483', date: '2025-04-25T14:30:00Z', amount: 1500, product: 'HIPAA Compliance Review', status: 'delivered' },
      { id: 'ORD-1425', date: '2025-04-01T09:20:00Z', amount: 1250, product: 'Data Visualization Package', status: 'delivered' },
      { id: 'ORD-1394', date: '2025-03-15T16:45:00Z', amount: 750, product: 'Security Assessment', status: 'delivered' },
    ],
    communications: [
      { id: 'COM-2405', type: 'email', date: '2025-05-10T15:45:00Z', subject: 'Feature Request', sentiment: 'neutral' },
      { id: 'COM-2356', type: 'meeting', date: '2025-04-30T13:00:00Z', subject: 'Roadmap Discussion', summary: 'Reviewed upcoming security features', sentiment: 'positive' },
      { id: 'COM-2289', type: 'call', date: '2025-04-15T11:30:00Z', subject: 'Support Call', summary: 'Resolved data import issue', sentiment: 'positive' },
    ]
  },
  {
    id: 'CUST-1005',
    name: 'Riley Anderson',
    email: 'riley.a@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1888&auto=format&fit=crop',
    segment: 'individual',
    status: 'inactive',
    dateAdded: '2024-10-05T08:15:00Z',
    lastContact: '2025-03-01T09:30:00Z',
    phone: '+1 (555) 345-6789',
    location: 'Chicago, IL',
    totalSpend: 250,
    ordersCount: 1,
    tags: ['individual', 'dormant'],
    notes: 'One-time purchase. Follow up with discount offer to re-engage.',
    engagementScore: 30,
    orders: [
      { id: 'ORD-1255', date: '2025-02-15T10:45:00Z', amount: 250, product: 'Website Template', status: 'delivered' },
    ],
    communications: [
      { id: 'COM-2150', type: 'email', date: '2025-03-01T09:30:00Z', subject: 'Follow-up on Purchase', sentiment: 'neutral' },
      { id: 'COM-2085', type: 'email', date: '2025-02-20T14:15:00Z', subject: 'Order Delivery Confirmation', sentiment: 'neutral' },
      { id: 'COM-2054', type: 'email', date: '2025-02-15T10:50:00Z', subject: 'Purchase Receipt', sentiment: 'neutral' },
    ]
  },
  {
    id: 'CUST-1006',
    name: 'Alexandra Kim',
    email: 'akim@finchcapital.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1770&auto=format&fit=crop',
    company: 'Finch Capital',
    position: 'Investment Director',
    segment: 'enterprise',
    status: 'active',
    dateAdded: '2025-02-20T13:45:00Z',
    lastContact: '2025-05-24T16:30:00Z',
    phone: '+1 (555) 456-7890',
    location: 'New York, NY',
    totalSpend: 18500,
    ordersCount: 4,
    tags: ['finance', 'enterprise', 'high-value'],
    notes: 'VIP client. Interested in customized financial analytics tools.',
    engagementScore: 95,
    orders: [
      { id: 'ORD-1538', date: '2025-05-18T11:30:00Z', amount: 8500, product: 'Enterprise Analytics Suite', status: 'processing' },
      { id: 'ORD-1462', date: '2025-04-10T14:15:00Z', amount: 4500, product: 'Custom Dashboard Development', status: 'delivered' },
      { id: 'ORD-1375', date: '2025-03-05T10:30:00Z', amount: 3750, product: 'Data Integration Services', status: 'delivered' },
    ],
    communications: [
      { id: 'COM-2462', type: 'meeting', date: '2025-05-24T16:30:00Z', subject: 'Requirements Gathering', summary: 'Detailed discussion on enterprise analytics needs', sentiment: 'positive' },
      { id: 'COM-2447', type: 'email', date: '2025-05-20T09:15:00Z', subject: 'Implementation Timeline', sentiment: 'neutral' },
      { id: 'COM-2423', type: 'call', date: '2025-05-15T14:00:00Z', subject: 'Contract Discussion', summary: 'Negotiated enterprise license terms', sentiment: 'positive' },
    ]
  },
  {
    id: 'CUST-1007',
    name: 'Daniel Torres',
    email: 'daniel@ecodesigns.net',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1887&auto=format&fit=crop',
    company: 'Eco Designs',
    position: 'Creative Director',
    segment: 'sme',
    status: 'churned',
    dateAdded: '2024-11-10T09:30:00Z',
    lastContact: '2025-04-01T11:20:00Z',
    phone: '+1 (555) 567-8901',
    location: 'Portland, OR',
    totalSpend: 3200,
    ordersCount: 3,
    tags: ['design', 'creative', 'churned'],
    notes: 'Left for competitor. Pain point was limited design customization.',
    engagementScore: 45,
    orders: [
      { id: 'ORD-1352', date: '2025-02-25T13:45:00Z', amount: 1200, product: 'Branding Package', status: 'delivered' },
      { id: 'ORD-1258', date: '2025-01-15T15:30:00Z', amount: 1250, product: 'Website Redesign', status: 'delivered' },
      { id: 'ORD-1187', date: '2024-12-05T09:15:00Z', amount: 750, product: 'Logo Design', status: 'delivered' },
    ],
    communications: [
      { id: 'COM-2345', type: 'email', date: '2025-04-01T11:20:00Z', subject: 'Cancellation Notice', summary: 'Cited move to design-focused platform', sentiment: 'negative' },
      { id: 'COM-2287', type: 'call', date: '2025-03-25T10:15:00Z', subject: 'Retention Call', summary: 'Attempted to address concerns about customization', sentiment: 'negative' },
      { id: 'COM-2201', type: 'email', date: '2025-03-20T09:45:00Z', subject: 'Feature Request', summary: 'Asked for more design flexibility', sentiment: 'neutral' },
    ]
  },
  {
    id: 'CUST-1008',
    name: 'Jordan Williams',
    email: 'jwilliams@rapidgrowthsolutions.com',
    company: 'Rapid Growth Solutions',
    position: 'Marketing Director',
    segment: 'sme',
    status: 'active',
    dateAdded: '2025-04-05T14:15:00Z',
    lastContact: '2025-05-23T13:45:00Z',
    phone: '+1 (555) 678-9012',
    location: 'Miami, FL',
    totalSpend: 5250,
    ordersCount: 4,
    tags: ['marketing', 'growth', 'regular'],
    notes: 'Marketing agency with multiple clients. Looking for white-label solutions.',
    engagementScore: 82,
    orders: [
      { id: 'ORD-1535', date: '2025-05-15T14:30:00Z', amount: 1500, product: 'Analytics Dashboard', status: 'delivered' },
      { id: 'ORD-1511', date: '2025-05-01T10:15:00Z', amount: 1250, product: 'White-label Reporting Tool', status: 'delivered' },
      { id: 'ORD-1482', date: '2025-04-20T16:30:00Z', amount: 1250, product: 'Marketing Automation', status: 'delivered' },
      { id: 'ORD-1470', date: '2025-04-15T11:45:00Z', amount: 1250, product: 'SEO Toolkit', status: 'delivered' },
    ],
    communications: [
      { id: 'COM-2459', type: 'email', date: '2025-05-23T13:45:00Z', subject: 'New Requirements', sentiment: 'neutral' },
      { id: 'COM-2436', type: 'meeting', date: '2025-05-18T10:00:00Z', subject: 'Quarterly Review', summary: 'Discussed white-labeling options', sentiment: 'positive' },
      { id: 'COM-2412', type: 'call', date: '2025-05-10T14:30:00Z', subject: 'Technical Support', summary: 'Helped with API integration', sentiment: 'positive' },
    ]
  }
];

// Customer lifecycle stages
const lifecycleStages = {
  acquisition: ['CUST-1003'],
  engagement: ['CUST-1001', 'CUST-1006', 'CUST-1008'],
  retention: ['CUST-1002', 'CUST-1004'],
  atRisk: ['CUST-1005'],
  churned: ['CUST-1007']
};

// Customer segments colors
const getSegmentConfig = (segment: CustomerSegment) => {
  switch (segment) {
    case 'enterprise':
      return { color: 'bg-tertiary/10 text-tertiary border-tertiary/20' };
    case 'sme':
      return { color: 'bg-primary/10 text-primary border-primary/20' };
    case 'startup':
      return { color: 'bg-chart-4/10 text-chart-4 border-chart-4/20' };
    case 'individual':
      return { color: 'bg-chart-5/10 text-chart-5 border-chart-5/20' };
    default:
      return { color: 'bg-muted text-muted-foreground' };
  }
};

// Status styling
const getStatusConfig = (status: CustomerStatus) => {
  switch (status) {
    case 'active':
      return { 
        color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
        icon: UserCheck
      };
    case 'inactive':
      return { 
        color: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
        icon: Clock
      };
    case 'new':
      return { 
        color: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        icon: UserPlus
      };
    case 'churned':
      return { 
        color: 'bg-destructive/10 text-destructive border-destructive/20',
        icon: Users
      };
    default:
      return { 
        color: 'bg-muted text-muted-foreground',
        icon: Users
      };
  }
};

// Format date from ISO string
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return format(date, 'MMM d, yyyy');
  } catch (e) {
    return dateString;
  }
};

// Format short date (month/day only)
const formatShortDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return format(date, 'MMM d');
  } catch (e) {
    return dateString;
  }
};

// Customer analytics calculation
const getAnalytics = (customers: Customer[]) => {
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'active').length;
  const newCustomers = customers.filter(c => c.status === 'new').length;
  const totalRevenue = customers.reduce((sum, customer) => sum + customer.totalSpend, 0);
  const avgLifetimeValue = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;
  
  // Retention rate - for example's sake, just use a calculated value
  const retentionRate = 85;
  
  // Customer distribution by segment
  const segments = customers.reduce((acc, customer) => {
    acc[customer.segment] = (acc[customer.segment] || 0) + 1;
    return acc;
  }, {} as Record<CustomerSegment, number>);
  
  return {
    totalCustomers,
    activeCustomers,
    newCustomers,
    totalRevenue,
    avgLifetimeValue,
    retentionRate,
    segments
  };
};

// Filter communication style based on type
const getCommunicationStyle = (type: string) => {
  switch (type) {
    case 'email':
      return { 
        color: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        icon: Mail
      };
    case 'call':
      return { 
        color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
        icon: Phone
      };
    case 'meeting':
      return { 
        color: 'bg-tertiary/10 text-tertiary border-tertiary/20',
        icon: Calendar
      };
    case 'chat':
      return { 
        color: 'bg-chart-4/10 text-chart-4 border-chart-4/20',
        icon: MessageSquare
      };
    default:
      return { 
        color: 'bg-muted text-muted-foreground',
        icon: Mail
      };
  }
};

export function CustomerManagement() {
  // State for filter/search
  const [searchQuery, setSearchQuery] = useState('');
  const [segmentFilter, setSegmentFilter] = useState<CustomerSegment | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<CustomerStatus | 'all'>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('all');
  const [activeCommunicationTab, setActiveCommunicationTab] = useState('all');
  const [expandedCustomerId, setExpandedCustomerId] = useState<string | null>(null);
  
  // Filter customers based on search and filters
  const filteredCustomers = mockCustomers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSegment = segmentFilter === 'all' || customer.segment === segmentFilter;
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    
    const matchesTab = currentTab === 'all' || 
      (currentTab === 'highValue' && customer.totalSpend > 5000) ||
      (currentTab === 'recent' && new Date(customer.dateAdded) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) ||
      (currentTab === 'atRisk' && customer.engagementScore < 50 && customer.status !== 'churned');
    
    return matchesSearch && matchesSegment && matchesStatus && matchesTab;
  });

  // Customer analytics
  const analytics = getAnalytics(mockCustomers);
  
  // Open customer details
  const openCustomerDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDetailDialogOpen(true);
  };
  
  // Handle row expansion
  const toggleRowExpansion = (customerId: string) => {
    if (expandedCustomerId === customerId) {
      setExpandedCustomerId(null);
    } else {
      setExpandedCustomerId(customerId);
    }
  };

  // Filter communication history based on active tab
  const getFilteredCommunications = (communications: Communication[]) => {
    if (activeCommunicationTab === 'all') {
      return communications;
    }
    return communications.filter(comm => comm.type === activeCommunicationTab);
  };

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalCustomers}</div>
            <div className="text-xs text-muted-foreground mt-1">
              <span className="text-primary">{analytics.newCustomers} new </span> 
              this month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Retention Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.retentionRate}%</div>
            <div className="text-xs text-muted-foreground mt-1">
              Customer loyalty score
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Average LTV</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${analytics.avgLifetimeValue.toFixed(0)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Lifetime customer value
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${analytics.totalRevenue.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              From {analytics.activeCustomers} active customers
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Customer Segments and Lifecycle Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-sm">Customer Segments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-tertiary"></div>
                  <p className="text-sm">Enterprise</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {analytics.segments?.enterprise || 0}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({Math.round(((analytics.segments?.enterprise || 0) / analytics.totalCustomers) * 100)}%)
                  </span>
                </div>
              </div>
              <Progress 
                value={((analytics.segments?.enterprise || 0) / analytics.totalCustomers) * 100} 
                className="h-1.5 bg-muted"
                indicatorClassName="bg-tertiary"
              />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <p className="text-sm">SME</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {analytics.segments?.sme || 0}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({Math.round(((analytics.segments?.sme || 0) / analytics.totalCustomers) * 100)}%)
                  </span>
                </div>
              </div>
              <Progress 
                value={((analytics.segments?.sme || 0) / analytics.totalCustomers) * 100} 
                className="h-1.5 bg-muted"
                indicatorClassName="bg-primary"
              />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-chart-4"></div>
                  <p className="text-sm">Startup</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {analytics.segments?.startup || 0}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({Math.round(((analytics.segments?.startup || 0) / analytics.totalCustomers) * 100)}%)
                  </span>
                </div>
              </div>
              <Progress 
                value={((analytics.segments?.startup || 0) / analytics.totalCustomers) * 100} 
                className="h-1.5 bg-muted"
                indicatorClassName="bg-chart-4"
              />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-chart-5"></div>
                  <p className="text-sm">Individual</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {analytics.segments?.individual || 0}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({Math.round(((analytics.segments?.individual || 0) / analytics.totalCustomers) * 100)}%)
                  </span>
                </div>
              </div>
              <Progress 
                value={((analytics.segments?.individual || 0) / analytics.totalCustomers) * 100} 
                className="h-1.5 bg-muted"
                indicatorClassName="bg-chart-5"
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm">Customer Lifecycle</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-2 h-[200px]">
              {/* Acquisition Stage */}
              <div className="flex flex-col">
                <div className="text-xs text-muted-foreground mb-2 text-center">Acquisition</div>
                <div className="bg-muted/40 rounded-lg flex-1 flex flex-col justify-end p-2 relative">
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-2xl font-bold text-blue-500">
                      {lifecycleStages.acquisition.length}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {Math.round((lifecycleStages.acquisition.length / analytics.totalCustomers) * 100)}%
                    </div>
                  </div>
                  <div className="relative z-10 w-full bg-blue-500/30 rounded-md h-[20%]"></div>
                </div>
              </div>
              
              {/* Engagement Stage */}
              <div className="flex flex-col">
                <div className="text-xs text-muted-foreground mb-2 text-center">Engagement</div>
                <div className="bg-muted/40 rounded-lg flex-1 flex flex-col justify-end p-2 relative">
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-2xl font-bold text-primary">
                      {lifecycleStages.engagement.length}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {Math.round((lifecycleStages.engagement.length / analytics.totalCustomers) * 100)}%
                    </div>
                  </div>
                  <div className="relative z-10 w-full bg-primary/30 rounded-md h-[40%]"></div>
                </div>
              </div>
              
              {/* Retention Stage */}
              <div className="flex flex-col">
                <div className="text-xs text-muted-foreground mb-2 text-center">Retention</div>
                <div className="bg-muted/40 rounded-lg flex-1 flex flex-col justify-end p-2 relative">
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-2xl font-bold text-tertiary">
                      {lifecycleStages.retention.length}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {Math.round((lifecycleStages.retention.length / analytics.totalCustomers) * 100)}%
                    </div>
                  </div>
                  <div className="relative z-10 w-full bg-tertiary/30 rounded-md h-[25%]"></div>
                </div>
              </div>
              
              {/* At Risk Stage */}
              <div className="flex flex-col">
                <div className="text-xs text-muted-foreground mb-2 text-center">At Risk</div>
                <div className="bg-muted/40 rounded-lg flex-1 flex flex-col justify-end p-2 relative">
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-2xl font-bold text-amber-500">
                      {lifecycleStages.atRisk.length}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {Math.round((lifecycleStages.atRisk.length / analytics.totalCustomers) * 100)}%
                    </div>
                  </div>
                  <div className="relative z-10 w-full bg-amber-500/30 rounded-md h-[15%]"></div>
                </div>
              </div>
              
              {/* Churned Stage */}
              <div className="flex flex-col">
                <div className="text-xs text-muted-foreground mb-2 text-center">Churned</div>
                <div className="bg-muted/40 rounded-lg flex-1 flex flex-col justify-end p-2 relative">
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-2xl font-bold text-destructive">
                      {lifecycleStages.churned.length}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {Math.round((lifecycleStages.churned.length / analytics.totalCustomers) * 100)}%
                    </div>
                  </div>
                  <div className="relative z-10 w-full bg-destructive/30 rounded-md h-[15%]"></div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 text-xs text-muted-foreground text-center">
              Customers at each stage of the customer journey
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Customer Management</CardTitle>
              <CardDescription>
                View and manage your customer relationships
              </CardDescription>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search customers..." 
                  className="pl-9 w-full sm:w-[200px] lg:w-[250px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Select 
                  value={segmentFilter} 
                  onValueChange={(value) => setSegmentFilter(value as CustomerSegment | 'all')}
                >
                  <SelectTrigger className="w-full sm:w-[140px]">
                    <SelectValue placeholder="All segments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Segments</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                    <SelectItem value="sme">SME</SelectItem>
                    <SelectItem value="startup">Startup</SelectItem>
                    <SelectItem value="individual">Individual</SelectItem>
                  </SelectContent>
                </Select>

                <Select 
                  value={statusFilter} 
                  onValueChange={(value) => setStatusFilter(value as CustomerStatus | 'all')}
                >
                  <SelectTrigger className="w-full sm:w-[140px]">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="churned">Churned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-2">
            <Tabs defaultValue="all" className="w-full" onValueChange={setCurrentTab}>
              <TabsList>
                <TabsTrigger value="all">All Customers</TabsTrigger>
                <TabsTrigger value="highValue">High Value</TabsTrigger>
                <TabsTrigger value="recent">Recently Added</TabsTrigger>
                <TabsTrigger value="atRisk">At Risk</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="hidden sm:flex gap-1">
                    <Filter className="h-4 w-4" />
                    <span>Filter</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">Advanced Filters</h4>
                      <p className="text-sm text-muted-foreground">
                        Customize which customers to display
                      </p>
                    </div>
                    <div className="grid gap-2">
                      <div className="grid grid-cols-3 items-center gap-4">
                        <label htmlFor="date">Join Date</label>
                        <Select defaultValue="all">
                          <SelectTrigger id="date" className="col-span-2 h-8">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="recent">Last 30 Days</SelectItem>
                            <SelectItem value="quarter">This Quarter</SelectItem>
                            <SelectItem value="year">This Year</SelectItem>
                            <SelectItem value="all">All Time</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-3 items-center gap-4">
                        <label htmlFor="amount">Min. Spend</label>
                        <Input 
                          id="amount" 
                          defaultValue="0" 
                          className="col-span-2 h-8" 
                        />
                      </div>
                      <div className="grid grid-cols-3 items-center gap-4">
                        <label htmlFor="tags">Tags</label>
                        <Input 
                          id="tags" 
                          placeholder="e.g. enterprise, tech"
                          className="col-span-2 h-8" 
                        />
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              
              <Button variant="outline" size="sm" className="hidden sm:flex gap-1">
                <UserPlus className="h-4 w-4 mr-1" />
                Add Customer
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="hidden sm:flex gap-1">
                    <Download className="h-4 w-4" />
                    <span>Export</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    Export as CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Export as PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Export for CRM
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button variant="outline" size="icon" className="sm:hidden">
                <ListFilter className="h-4 w-4" />
              </Button>
              
              <Button variant="outline" size="icon" className="sm:hidden">
                <UserPlus className="h-4 w-4" />
              </Button>
              
              <Button variant="outline" size="icon" className="sm:hidden">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead>
                  <tr className="border-b transition-colors hover:bg-muted/10">
                    <th className="h-10 px-4 text-left align-middle font-medium">Customer</th>
                    <th className="h-10 px-4 text-left align-middle font-medium hidden md:table-cell">Company</th>
                    <th className="h-10 px-4 text-left align-middle font-medium hidden lg:table-cell">Date Added</th>
                    <th className="h-10 px-4 text-left align-middle font-medium">Segment</th>
                    <th className="h-10 px-4 text-left align-middle font-medium hidden md:table-cell">Status</th>
                    <th className="h-10 px-4 text-right align-middle font-medium">Engagement</th>
                    <th className="h-10 px-4 text-right align-middle font-medium">Spend</th>
                    <th className="h-10 px-4 text-right align-middle font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((customer) => {
                      const isExpanded = expandedCustomerId === customer.id;
                      const StatusIcon = getStatusConfig(customer.status).icon;
                      
                      return (
                        <React.Fragment key={customer.id}>
                          <tr 
                            className={`border-b transition-colors hover:bg-muted/10 cursor-pointer ${isExpanded ? 'bg-muted/5' : ''}`}
                            onClick={() => toggleRowExpansion(customer.id)}
                          >
                            <td className="p-4 align-middle">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  {customer.avatar && (
                                    <AvatarImage src={customer.avatar} alt={customer.name} />
                                  )}
                                  <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{customer.name}</div>
                                  <div className="text-xs text-muted-foreground">{customer.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 align-middle hidden md:table-cell">
                              {customer.company || '—'}
                            </td>
                            <td className="p-4 align-middle hidden lg:table-cell">
                              {formatDate(customer.dateAdded)}
                            </td>
                            <td className="p-4 align-middle">
                              <Badge 
                                variant="outline" 
                                className={`${getSegmentConfig(customer.segment).color}`}
                              >
                                <span className="capitalize">{customer.segment}</span>
                              </Badge>
                            </td>
                            <td className="p-4 align-middle hidden md:table-cell">
                              <Badge 
                                variant="outline" 
                                className={`flex gap-1 items-center ${getStatusConfig(customer.status).color}`}
                              >
                                <StatusIcon className="h-3 w-3" />
                                <span className="capitalize">{customer.status}</span>
                              </Badge>
                            </td>
                            <td className="p-4 align-middle text-right">
                              <div className="flex flex-col items-end">
                                <div className={`text-sm font-medium ${
                                  customer.engagementScore >= 80 ? 'text-emerald-500' : 
                                  customer.engagementScore >= 60 ? 'text-primary' : 
                                  customer.engagementScore >= 40 ? 'text-amber-500' : 
                                  'text-destructive'
                                }`}>
                                  {customer.engagementScore}%
                                </div>
                                <Progress 
                                  value={customer.engagementScore} 
                                  className="h-1 w-16 mt-1" 
                                  indicatorClassName={
                                    customer.engagementScore >= 80 ? 'bg-emerald-500' : 
                                    customer.engagementScore >= 60 ? 'bg-primary' : 
                                    customer.engagementScore >= 40 ? 'bg-amber-500' : 
                                    'bg-destructive'
                                  }
                                />
                              </div>
                            </td>
                            <td className="p-4 align-middle text-right font-medium">
                              ${customer.totalSpend.toLocaleString()}
                            </td>
                            <td className="p-4 align-middle text-right">
                              <div className="flex justify-end">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openCustomerDetails(customer);
                                  }}
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                          {isExpanded && (
                            <tr className="bg-muted/5">
                              <td colSpan={8} className="p-0">
                                <Collapsible 
                                  open={isExpanded} 
                                  className="w-full"
                                >
                                  <CollapsibleContent className="px-4 py-4">
                                    <div className="rounded-lg bg-card p-4 shadow-sm">
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Customer Quick Info */}
                                        <div className="space-y-4">
                                          <div className="flex items-center gap-3">
                                            <Avatar className="h-14 w-14">
                                              {customer.avatar && (
                                                <AvatarImage src={customer.avatar} alt={customer.name} />
                                              )}
                                              <AvatarFallback className="text-lg">{customer.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                              <h3 className="font-medium text-base">{customer.name}</h3>
                                              <p className="text-sm text-muted-foreground">{customer.email}</p>
                                              {customer.position && customer.company && (
                                                <p className="text-sm">
                                                  {customer.position} at {customer.company}
                                                </p>
                                              )}
                                            </div>
                                          </div>
                                          
                                          <div className="space-y-1">
                                            <h4 className="text-sm text-muted-foreground mb-2">Contact Information</h4>
                                            <div className="grid grid-cols-2 gap-y-2 text-sm">
                                              <div className="flex items-center gap-2">
                                                <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                                                <span>{customer.phone || 'Not available'}</span>
                                              </div>
                                              <div className="flex items-center gap-2">
                                                <Building className="h-3.5 w-3.5 text-muted-foreground" />
                                                <span>{customer.company || 'Not available'}</span>
                                              </div>
                                              <div className="flex items-center gap-2">
                                                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                                                <span>{customer.email}</span>
                                              </div>
                                              <div className="flex items-center gap-2">
                                                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                                <span>Joined {formatDate(customer.dateAdded)}</span>
                                              </div>
                                            </div>
                                          </div>
                                        
                                          <div className="space-y-1">
                                            <h4 className="text-sm text-muted-foreground mb-2">Tags</h4>
                                            <div className="flex flex-wrap gap-2">
                                              {customer.tags.map((tag, i) => (
                                                <Badge key={`${customer.id}-tag-${i}`} variant="outline" className="bg-muted/50">
                                                  {tag}
                                                </Badge>
                                              ))}
                                              <Button variant="ghost" size="sm" className="h-6 text-xs">
                                                <PlusCircleIcon className="h-3 w-3 mr-1" />
                                                Add
                                              </Button>
                                            </div>
                                          </div>
                                        </div>
                                        
                                        {/* Orders and Communications */}
                                        <div className="space-y-4">
                                          <div>
                                            <h4 className="text-sm font-medium mb-3">Recent Orders</h4>
                                            <div className="space-y-2">
                                              {customer.orders.slice(0, 3).map((order, i) => (
                                                <div key={`${customer.id}-order-${i}`} className="flex items-center justify-between p-2 bg-muted/20 rounded-md">
                                                  <div>
                                                    <div className="text-sm font-medium">{order.product}</div>
                                                    <div className="text-xs text-muted-foreground">
                                                      {formatShortDate(order.date)} • {order.id}
                                                    </div>
                                                  </div>
                                                  <div className="text-right">
                                                    <div className="text-sm font-medium">${order.amount}</div>
                                                    <Badge 
                                                      variant="outline" 
                                                      className={`text-xs ${
                                                        order.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                                                        order.status === 'processing' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 
                                                        order.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                                        'bg-destructive/10 text-destructive border-destructive/20'
                                                      }`}
                                                    >
                                                      {order.status}
                                                    </Badge>
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                          
                                          <div>
                                            <h4 className="text-sm font-medium mb-3">Recent Communications</h4>
                                            <div className="space-y-2">
                                              {customer.communications.slice(0, 2).map((comm, i) => {
                                                const commStyle = getCommunicationStyle(comm.type);
                                                const CommIcon = commStyle.icon;
                                                
                                                return (
                                                  <div key={`${customer.id}-comm-${i}`} className="flex items-start gap-3 p-2 bg-muted/20 rounded-md">
                                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center ${commStyle.color}`}>
                                                      <CommIcon className="h-3.5 w-3.5" />
                                                    </div>
                                                    <div className="flex-1">
                                                      <div className="flex items-center justify-between">
                                                        <div className="text-sm font-medium">{comm.subject}</div>
                                                        <div className="text-xs text-muted-foreground">
                                                          {formatShortDate(comm.date)}
                                                        </div>
                                                      </div>
                                                      {comm.summary && (
                                                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{comm.summary}</p>
                                                      )}
                                                    </div>
                                                  </div>
                                                );
                                              })}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div className="mt-4 flex justify-end gap-2">
                                        <Button variant="outline" size="sm">
                                          <Mail className="mr-2 h-4 w-4" />
                                          Contact
                                        </Button>
                                        <Button 
                                          variant="default" 
                                          size="sm"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            openCustomerDetails(customer);
                                          }}
                                        >
                                          View Full Profile
                                        </Button>
                                      </div>
                                    </div>
                                  </CollapsibleContent>
                                </Collapsible>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={8} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <Users className="h-10 w-10 mb-2 opacity-40" />
                          <div className="text-lg font-medium">No customers found</div>
                          <p className="text-sm">Try adjusting your search or filter criteria</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {filteredCustomers.length} of {mockCustomers.length} customers
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Customer Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Customer Profile</DialogTitle>
            <DialogDescription>
              {selectedCustomer?.id} • Member since {selectedCustomer && formatDate(selectedCustomer.dateAdded)}
            </DialogDescription>
          </DialogHeader>

          {selectedCustomer && (
            <div className="grid gap-6">
              {/* Customer Header */}
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  {selectedCustomer.avatar && (
                    <AvatarImage src={selectedCustomer.avatar} alt={selectedCustomer.name} />
                  )}
                  <AvatarFallback className="text-xl">{selectedCustomer.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-bold">{selectedCustomer.name}</h2>
                      <p className="text-muted-foreground">{selectedCustomer.email}</p>
                      {selectedCustomer.position && selectedCustomer.company && (
                        <p className="text-sm">
                          {selectedCustomer.position} at {selectedCustomer.company}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={`${getSegmentConfig(selectedCustomer.segment).color}`}
                      >
                        <span className="capitalize">{selectedCustomer.segment}</span>
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={`${getStatusConfig(selectedCustomer.status).color}`}
                      >
                        {React.createElement(getStatusConfig(selectedCustomer.status).icon, { className: "h-3 w-3 mr-1" })}
                        <span className="capitalize">{selectedCustomer.status}</span>
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="text-muted-foreground text-sm">Lifetime Value</div>
                      <DollarSign className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-2xl font-bold mt-2">${selectedCustomer.totalSpend}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      From {selectedCustomer.ordersCount} orders
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="text-muted-foreground text-sm">Engagement</div>
                      <Activity className="h-4 w-4 text-tertiary" />
                    </div>
                    <div className="text-2xl font-bold mt-2">{selectedCustomer.engagementScore}%</div>
                    <div className="mt-1">
                      <Progress 
                        value={selectedCustomer.engagementScore} 
                        className="h-1.5" 
                        indicatorClassName={
                          selectedCustomer.engagementScore >= 80 ? 'bg-emerald-500' : 
                          selectedCustomer.engagementScore >= 60 ? 'bg-primary' : 
                          selectedCustomer.engagementScore >= 40 ? 'bg-amber-500' : 
                          'bg-destructive'
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="text-muted-foreground text-sm">Last Contact</div>
                      <Calendar className="h-4 w-4 text-chart-4" />
                    </div>
                    <div className="text-base font-medium mt-2">
                      {selectedCustomer.lastContact ? formatDate(selectedCustomer.lastContact) : 'No recent contact'}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {selectedCustomer.lastContact ? 
                        `${Math.round((new Date().getTime() - new Date(selectedCustomer.lastContact).getTime()) / (1000 * 60 * 60 * 24))} days ago` : 
                        'No interaction recorded'}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Customer Details and Communication History */}
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-3 lg:col-span-1 space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Contact Information</h3>
                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                      <div className="text-muted-foreground">Email</div>
                      <div>{selectedCustomer.email}</div>
                      
                      <div className="text-muted-foreground">Phone</div>
                      <div>{selectedCustomer.phone || '—'}</div>
                      
                      <div className="text-muted-foreground">Location</div>
                      <div>{selectedCustomer.location || '—'}</div>
                      
                      <div className="text-muted-foreground">Company</div>
                      <div>{selectedCustomer.company || '—'}</div>
                      
                      <div className="text-muted-foreground">Position</div>
                      <div>{selectedCustomer.position || '—'}</div>
                      
                      <div className="text-muted-foreground">Customer Since</div>
                      <div>{formatDate(selectedCustomer.dateAdded)}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCustomer.tags.map((tag, i) => (
                        <Badge key={`detail-tag-${i}`} variant="outline" className="bg-muted/50">
                          {tag}
                        </Badge>
                      ))}
                      <Button variant="ghost" size="sm" className="h-6 text-xs">
                        <PlusCircleIcon className="h-3 w-3 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Notes</h3>
                    <div className="p-3 bg-muted/20 rounded-md text-sm">
                      {selectedCustomer.notes || 'No notes available for this customer.'}
                    </div>
                  </div>
                </div>

                <div className="col-span-3 lg:col-span-2">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium">Communication History</h3>
                      <Button variant="outline" size="sm">
                        <Mail className="h-4 w-4 mr-2" />
                        New Message
                      </Button>
                    </div>
                    
                    <Tabs defaultValue="all" onValueChange={setActiveCommunicationTab}>
                      <TabsList className="w-full">
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="email">Emails</TabsTrigger>
                        <TabsTrigger value="call">Calls</TabsTrigger>
                        <TabsTrigger value="meeting">Meetings</TabsTrigger>
                        <TabsTrigger value="chat">Chats</TabsTrigger>
                      </TabsList>
                    </Tabs>
                    
                    <div className="space-y-4">
                      {getFilteredCommunications(selectedCustomer.communications).map((comm, i) => {
                        const commStyle = getCommunicationStyle(comm.type);
                        const CommIcon = commStyle.icon;
                        
                        return (
                          <div key={`comm-history-${i}`} className="flex items-start gap-4 p-3 bg-muted/20 rounded-md">
                            <div className={`min-w-8 h-8 rounded-full flex items-center justify-center ${commStyle.color}`}>
                              <CommIcon className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div className="font-medium">{comm.subject}</div>
                                <div className="text-sm text-muted-foreground">
                                  {formatDate(comm.date)}
                                </div>
                              </div>
                              {comm.summary && (
                                <p className="text-sm text-muted-foreground mt-1">{comm.summary}</p>
                              )}
                              <div className="flex items-center gap-2 mt-2">
                                {comm.sentiment && (
                                  <Badge variant="outline" className={`
                                    ${comm.sentiment === 'positive' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                                      comm.sentiment === 'neutral' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 
                                      'bg-destructive/10 text-destructive border-destructive/20'
                                    }
                                  `}>
                                    {comm.sentiment}
                                  </Badge>
                                )}
                                <div className="text-xs text-muted-foreground">
                                  {comm.type.charAt(0).toUpperCase() + comm.type.slice(1)}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Order History */}
              <div>
                <h3 className="text-sm font-medium mb-4">Order History</h3>
                <div className="rounded-md border">
                  <table className="w-full caption-bottom text-sm">
                    <thead>
                      <tr className="border-b transition-colors hover:bg-muted/10">
                        <th className="h-10 px-4 text-left align-middle font-medium">Order ID</th>
                        <th className="h-10 px-4 text-left align-middle font-medium">Product</th>
                        <th className="h-10 px-4 text-left align-middle font-medium">Date</th>
                        <th className="h-10 px-4 text-left align-middle font-medium">Status</th>
                        <th className="h-10 px-4 text-right align-middle font-medium">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedCustomer.orders.map((order, i) => (
                        <tr key={`detail-order-${i}`} className="border-b transition-colors hover:bg-muted/10">
                          <td className="p-3 align-middle font-medium">{order.id}</td>
                          <td className="p-3 align-middle">{order.product}</td>
                          <td className="p-3 align-middle">{formatDate(order.date)}</td>
                          <td className="p-3 align-middle">
                            <Badge 
                              variant="outline" 
                              className={`
                                ${order.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : ''}
                                ${order.status === 'processing' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : ''}
                                ${order.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : ''}
                                ${order.status === 'refunded' ? 'bg-destructive/10 text-destructive border-destructive/20' : ''}
                              `}
                            >
                              {order.status}
                            </Badge>
                          </td>
                          <td className="p-3 align-middle text-right">${order.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline">
              <Star className="h-4 w-4 mr-2" />
              Add to VIP
            </Button>
            <Button variant="outline">
              <Tag className="h-4 w-4 mr-2" />
              Edit Tags
            </Button>
            <Button variant="default">
              <Mail className="h-4 w-4 mr-2" />
              Contact Customer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}