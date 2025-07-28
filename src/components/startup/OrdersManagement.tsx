import React, { useState } from "react";
import { 
  Search, 
  Filter, 
  Download, 
  Upload, 
  ChevronDown, 
  ChevronUp, 
  MoreHorizontal, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  Truck,
  Calendar,
  RefreshCw
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { format } from 'date-fns';

// Order status types
type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";

// Order type definition
interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
    avatar?: string;
  };
  product: string;
  date: string;
  amount: number;
  status: OrderStatus;
  paymentMethod: string;
  address?: string;
  trackingId?: string;
  notes?: string;
  history: {
    status: OrderStatus;
    date: string;
    note?: string;
  }[];
}

// Mock data for orders
const mockOrders: Order[] = [
  { 
    id: 'ORD-1234', 
    customer: { 
      name: 'Jane Cooper', 
      email: 'jane.cooper@example.com',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop'
    }, 
    product: 'Website Audit', 
    date: '2025-05-25T14:30:00Z', 
    status: 'delivered', 
    amount: 250,
    paymentMethod: 'Credit Card',
    address: '123 Main St, San Francisco, CA 94105',
    trackingId: 'TRK-7890',
    notes: 'Customer requested expedited delivery',
    history: [
      { status: 'pending', date: '2025-05-25T10:30:00Z' },
      { status: 'processing', date: '2025-05-25T11:45:00Z', note: 'Payment confirmed' },
      { status: 'shipped', date: '2025-05-25T13:15:00Z', note: 'Sent digital delivery' },
      { status: 'delivered', date: '2025-05-25T14:30:00Z', note: 'Client confirmed receipt' }
    ]
  },
  { 
    id: 'ORD-1235', 
    customer: { 
      name: 'Wade Warren', 
      email: 'wade.warren@example.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop'
    }, 
    product: 'AI Integration', 
    date: '2025-05-26T09:15:00Z', 
    status: 'processing', 
    amount: 1250,
    paymentMethod: 'Bank Transfer',
    address: '456 Market St, San Francisco, CA 94105',
    notes: 'Client requested detailed documentation',
    history: [
      { status: 'pending', date: '2025-05-26T08:00:00Z' },
      { status: 'processing', date: '2025-05-26T09:15:00Z', note: 'Started integration' }
    ]
  },
  { 
    id: 'ORD-1236', 
    customer: { 
      name: 'Esther Howard', 
      email: 'esther.howard@example.com',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop'
    }, 
    product: 'UI Component Library', 
    date: '2025-05-26T11:45:00Z', 
    status: 'pending', 
    amount: 350,
    paymentMethod: 'PayPal',
    address: '789 Market St, San Francisco, CA 94103',
    history: [
      { status: 'pending', date: '2025-05-26T11:45:00Z', note: 'Awaiting payment confirmation' }
    ]
  },
  { 
    id: 'ORD-1237', 
    customer: { 
      name: 'Cameron Williamson', 
      email: 'cameron.w@example.com',
      avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=1780&auto=format&fit=crop'
    }, 
    product: 'Website Audit', 
    date: '2025-05-27T15:10:00Z', 
    status: 'pending', 
    amount: 250,
    paymentMethod: 'Credit Card',
    address: '1010 Pine St, San Francisco, CA 94109',
    history: [
      { status: 'pending', date: '2025-05-27T15:10:00Z' }
    ]
  },
  { 
    id: 'ORD-1238', 
    customer: { 
      name: 'Brooklyn Simmons', 
      email: 'brooklyn.s@example.com',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1888&auto=format&fit=crop'
    }, 
    product: 'Marketing Strategy', 
    date: '2025-05-24T10:30:00Z', 
    status: 'shipped', 
    amount: 850,
    paymentMethod: 'Bank Transfer',
    address: '2020 Market St, San Francisco, CA 94114',
    trackingId: 'TRK-4567',
    history: [
      { status: 'pending', date: '2025-05-24T08:15:00Z' },
      { status: 'processing', date: '2025-05-24T09:20:00Z', note: 'Payment confirmed' },
      { status: 'shipped', date: '2025-05-24T10:30:00Z', note: 'Initial draft sent' }
    ]
  },
  { 
    id: 'ORD-1239', 
    customer: { 
      name: 'Leslie Alexander', 
      email: 'leslie.a@example.com',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1770&auto=format&fit=crop'
    }, 
    product: 'Custom API Integration', 
    date: '2025-05-23T14:20:00Z', 
    status: 'cancelled', 
    amount: 1100,
    paymentMethod: 'Credit Card',
    address: '3030 Mission St, San Francisco, CA 94110',
    notes: 'Client changed requirements after initial consultation',
    history: [
      { status: 'pending', date: '2025-05-23T09:10:00Z' },
      { status: 'processing', date: '2025-05-23T10:30:00Z', note: 'Started project setup' },
      { status: 'cancelled', date: '2025-05-23T14:20:00Z', note: 'Client requested cancellation' }
    ]
  },
  { 
    id: 'ORD-1240', 
    customer: { 
      name: 'Robert Fox', 
      email: 'robert.fox@example.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1887&auto=format&fit=crop'
    }, 
    product: 'Website Redesign', 
    date: '2025-05-22T16:40:00Z', 
    status: 'refunded', 
    amount: 1500,
    paymentMethod: 'PayPal',
    address: '4040 Jackson St, San Francisco, CA 94118',
    notes: 'Client dissatisfied with initial design direction',
    history: [
      { status: 'pending', date: '2025-05-20T13:15:00Z' },
      { status: 'processing', date: '2025-05-20T15:30:00Z', note: 'Payment confirmed' },
      { status: 'shipped', date: '2025-05-22T10:20:00Z', note: 'Initial designs delivered' },
      { status: 'refunded', date: '2025-05-22T16:40:00Z', note: 'Full refund processed' }
    ]
  }
];

// Summary stats calculation
const getOrderStats = (orders: Order[]) => {
  const totalSales = orders.reduce((sum, order) => {
    // Only count completed orders (delivered or shipped)
    if (order.status === 'delivered' || order.status === 'shipped') {
      return sum + order.amount;
    }
    return sum;
  }, 0);

  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const processingOrders = orders.filter(order => order.status === 'processing').length;
  const completedOrders = orders.filter(order => order.status === 'delivered').length;
  const shippedOrders = orders.filter(order => order.status === 'shipped').length;
  
  return {
    totalSales,
    pendingOrders,
    processingOrders,
    completedOrders,
    shippedOrders,
    totalOrders: orders.length
  };
};

// Status badge configuration
const getStatusConfig = (status: OrderStatus) => {
  switch (status) {
    case 'pending':
      return { 
        color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        icon: Clock
      };
    case 'processing':
      return { 
        color: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        icon: RefreshCw
      };
    case 'shipped':
      return { 
        color: 'bg-tertiary/10 text-tertiary border-tertiary/20',
        icon: Truck 
      };
    case 'delivered':
      return { 
        color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
        icon: CheckCircle
      };
    case 'cancelled':
      return { 
        color: 'bg-destructive/10 text-destructive border-destructive/20',
        icon: XCircle
      };
    case 'refunded':
      return { 
        color: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
        icon: AlertTriangle
      };
    default:
      return { 
        color: 'bg-muted text-muted-foreground',
        icon: Clock
      };
  }
};

// Format date from ISO string
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return format(date, 'MMM d, yyyy') + ' at ' + format(date, 'h:mm a');
  } catch (e) {
    return dateString;
  }
};

interface OrdersManagementProps {
  limit?: number;
  showHeader?: boolean;
  total?: number;
  pending?: number;
  change?: string;
  trend?: string;
}

export function OrdersManagement(props: OrdersManagementProps) {
  // State for filter/search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [currentTab, setCurrentTab] = useState('all');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  
  // Filter orders based on search and status
  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.product.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    const matchesTab = currentTab === 'all' || 
      (currentTab === 'recent' && new Date(order.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
      (currentTab === 'highValue' && order.amount >= 1000);
    
    return matchesSearch && matchesStatus && matchesTab;
  });

  // Order stats
  const stats = getOrderStats(mockOrders);

  const handleOrderRowClick = (orderId: string) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
    }
  };

  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailDialogOpen(true);
  };

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    // In a real app, this would update the status in your backend
    console.log(`Changing order ${orderId} status to ${newStatus}`);
  };

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <div className="text-xs text-muted-foreground mt-1">
              <span className="text-primary">{stats.pendingOrders} pending, </span> 
              <span className="text-blue-500">{stats.processingOrders} processing</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalSales.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground mt-1">
              From {stats.completedOrders + stats.shippedOrders} completed orders
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Avg. Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${ stats.totalOrders > 0 
                ? (mockOrders.reduce((sum, order) => sum + order.amount, 0) / stats.totalOrders).toFixed(0) 
                : 0 }
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Calculated from all orders
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalOrders > 0 
                ? (((stats.completedOrders + stats.shippedOrders) / stats.totalOrders) * 100).toFixed(0) 
                : 0}%
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Excludes cancelled orders
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Orders Management</CardTitle>
              <CardDescription>
                View and manage all customer orders
              </CardDescription>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search orders..." 
                  className="pl-9 w-full sm:w-[200px] lg:w-[250px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select 
                value={statusFilter} 
                onValueChange={(value) => setStatusFilter(value as OrderStatus | 'all')}
              >
                <SelectTrigger className="w-full sm:w-[160px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-between mt-2">
            <Tabs defaultValue="all" className="w-full" onValueChange={setCurrentTab}>
              <TabsList>
                <TabsTrigger value="all">All Orders</TabsTrigger>
                <TabsTrigger value="recent">Recent</TabsTrigger>
                <TabsTrigger value="highValue">High Value</TabsTrigger>
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
                      <h4 className="font-medium leading-none">Filter Orders</h4>
                      <p className="text-sm text-muted-foreground">
                        Customize which orders to display
                      </p>
                    </div>
                    <div className="grid gap-2">
                      <div className="grid grid-cols-3 items-center gap-4">
                        <label htmlFor="date">Date Range</label>
                        <Select defaultValue="week">
                          <SelectTrigger id="date" className="col-span-2 h-8">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="today">Today</SelectItem>
                            <SelectItem value="week">This Week</SelectItem>
                            <SelectItem value="month">This Month</SelectItem>
                            <SelectItem value="year">This Year</SelectItem>
                            <SelectItem value="all">All Time</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-3 items-center gap-4">
                        <label htmlFor="amount">Min Amount</label>
                        <Input 
                          id="amount" 
                          defaultValue="0" 
                          className="col-span-2 h-8" 
                        />
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

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
                    Export for Accounting
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button variant="outline" size="icon" className="sm:hidden">
                <Filter className="h-4 w-4" />
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
                    <th className="h-10 px-4 text-left align-middle font-medium">Order</th>
                    <th className="h-10 px-4 text-left align-middle font-medium">Customer</th>
                    <th className="h-10 px-4 text-left align-middle font-medium">Product</th>
                    <th className="h-10 px-4 text-left align-middle font-medium">Date</th>
                    <th className="h-10 px-4 text-left align-middle font-medium">Status</th>
                    <th className="h-10 px-4 text-right align-middle font-medium">Amount</th>
                    <th className="h-10 px-4 text-right align-middle font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => {
                      const isExpanded = expandedOrderId === order.id;
                      const StatusIcon = getStatusConfig(order.status).icon;

                      return (
                        <React.Fragment key={order.id}>
                          <tr 
                            className={`border-b transition-colors hover:bg-muted/10 cursor-pointer ${isExpanded ? 'bg-muted/5' : ''}`}
                            onClick={() => handleOrderRowClick(order.id)}
                          >
                            <td className="p-4 align-middle font-medium">{order.id}</td>
                            <td className="p-4 align-middle">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  {order.customer.avatar && (
                                    <AvatarImage src={order.customer.avatar} alt={order.customer.name} />
                                  )}
                                  <AvatarFallback>{order.customer.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span>{order.customer.name}</span>
                              </div>
                            </td>
                            <td className="p-4 align-middle">{order.product}</td>
                            <td className="p-4 align-middle">{format(new Date(order.date), 'MMM dd, yyyy')}</td>
                            <td className="p-4 align-middle">
                              <Badge 
                                variant="outline" 
                                className={`flex gap-1 items-center w-fit ${getStatusConfig(order.status).color}`}
                              >
                                <StatusIcon className="h-3 w-3" />
                                <span className="capitalize">{order.status}</span>
                              </Badge>
                            </td>
                            <td className="p-4 align-middle text-right">${order.amount}</td>
                            <td className="p-4 align-middle text-right">
                              <div className="flex justify-end">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openOrderDetails(order);
                                  }}
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                          {isExpanded && (
                            <tr className="bg-muted/5">
                              <td colSpan={7} className="p-4">
                                <div className="rounded-lg bg-card p-4 shadow-sm">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                      <h4 className="text-sm font-medium mb-2">Order Details</h4>
                                      <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                          <span className="text-muted-foreground">Payment Method:</span>
                                          <span>{order.paymentMethod}</span>
                                        </div>
                                        {order.address && (
                                          <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Address:</span>
                                            <span className="text-right">{order.address}</span>
                                          </div>
                                        )}
                                        {order.trackingId && (
                                          <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Tracking ID:</span>
                                            <span>{order.trackingId}</span>
                                          </div>
                                        )}
                                        {order.notes && (
                                          <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Notes:</span>
                                            <span className="text-right">{order.notes}</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <h4 className="text-sm font-medium mb-2">Order History</h4>
                                      <div className="space-y-2">
                                        {order.history.map((event, index) => (
                                          <div key={`${order.id}-history-${index}`} className="flex gap-2 text-sm">
                                            <div className="w-24 flex-shrink-0 text-muted-foreground">
                                              {format(new Date(event.date), 'MMM dd, HH:mm')}
                                            </div>
                                            <div className="flex-1">
                                              <Badge 
                                                variant="outline" 
                                                className={`mr-2 ${getStatusConfig(event.status).color}`}
                                              >
                                                <span className="capitalize">{event.status}</span>
                                              </Badge>
                                              {event.note && <span>{event.note}</span>}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="mt-4 flex justify-end gap-2">
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm">
                                          Update Status
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent>
                                        <DropdownMenuLabel>Set Order Status</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={() => handleStatusChange(order.id, "pending")}>
                                          <Clock className="mr-2 h-4 w-4" /> Pending
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleStatusChange(order.id, "processing")}>
                                          <RefreshCw className="mr-2 h-4 w-4" /> Processing
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleStatusChange(order.id, "shipped")}>
                                          <Truck className="mr-2 h-4 w-4" /> Shipped
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleStatusChange(order.id, "delivered")}>
                                          <CheckCircle className="mr-2 h-4 w-4" /> Delivered
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleStatusChange(order.id, "cancelled")}>
                                          <XCircle className="mr-2 h-4 w-4" /> Cancelled
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleStatusChange(order.id, "refunded")}>
                                          <AlertTriangle className="mr-2 h-4 w-4" /> Refunded
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                    
                                    <Button 
                                      variant="default" 
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openOrderDetails(order);
                                      }}
                                    >
                                      View Full Details
                                    </Button>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <Calendar className="h-10 w-10 mb-2 opacity-40" />
                          <div className="text-lg font-medium">No orders found</div>
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
            Showing {filteredOrders.length} of {mockOrders.length} orders
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

      {/* Order Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              {selectedOrder?.id} • {selectedOrder && formatDate(selectedOrder.date)}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="grid gap-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    {selectedOrder.customer.avatar && (
                      <AvatarImage src={selectedOrder.customer.avatar} alt={selectedOrder.customer.name} />
                    )}
                    <AvatarFallback>{selectedOrder.customer.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{selectedOrder.customer.name}</h4>
                    <p className="text-sm text-muted-foreground">{selectedOrder.customer.email}</p>
                  </div>
                </div>

                <Badge 
                  variant="outline" 
                  className={`flex gap-1 items-center ${getStatusConfig(selectedOrder.status).color}`}
                >
                  {React.createElement(getStatusConfig(selectedOrder.status).icon, { className: "h-3 w-3" })}
                  <span className="capitalize">{selectedOrder.status}</span>
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Product</div>
                  <div className="font-medium">{selectedOrder.product}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Amount</div>
                  <div className="font-medium">${selectedOrder.amount}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Payment Method</div>
                  <div>{selectedOrder.paymentMethod}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Order Date</div>
                  <div>{format(new Date(selectedOrder.date), 'MMM dd, yyyy')}</div>
                </div>
              </div>

              {selectedOrder.address && (
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Shipping Address</div>
                  <div>{selectedOrder.address}</div>
                </div>
              )}

              {selectedOrder.trackingId && (
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Tracking ID</div>
                  <div>{selectedOrder.trackingId}</div>
                </div>
              )}

              {selectedOrder.notes && (
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Notes</div>
                  <div>{selectedOrder.notes}</div>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium mb-2">Order History</h4>
                <div className="space-y-3 border rounded-lg p-3">
                  {selectedOrder.history.map((event, index) => (
                    <div key={`detail-history-${index}`} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm">
                      <div className="text-muted-foreground min-w-[150px]">
                        {format(new Date(event.date), 'MMM dd, yyyy HH:mm')}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline" 
                          className={getStatusConfig(event.status).color}
                        >
                          <span className="capitalize">{event.status}</span>
                        </Badge>
                        {event.note && <span className="text-sm">{event.note}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Update Status</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Set Order Status</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => selectedOrder && handleStatusChange(selectedOrder.id, "pending")}>
                  <Clock className="mr-2 h-4 w-4" /> Pending
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => selectedOrder && handleStatusChange(selectedOrder.id, "processing")}>
                  <RefreshCw className="mr-2 h-4 w-4" /> Processing
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => selectedOrder && handleStatusChange(selectedOrder.id, "shipped")}>
                  <Truck className="mr-2 h-4 w-4" /> Shipped
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => selectedOrder && handleStatusChange(selectedOrder.id, "delivered")}>
                  <CheckCircle className="mr-2 h-4 w-4" /> Delivered
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => selectedOrder && handleStatusChange(selectedOrder.id, "cancelled")}>
                  <XCircle className="mr-2 h-4 w-4" /> Cancelled
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => selectedOrder && handleStatusChange(selectedOrder.id, "refunded")}>
                  <AlertTriangle className="mr-2 h-4 w-4" /> Refunded
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button 
              variant="default" 
              onClick={() => setIsDetailDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}