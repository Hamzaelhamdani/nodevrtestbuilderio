
import { useState } from "react";
import { 
  Tabs, TabsContent, TabsList, TabsTrigger,
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
  Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
  Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow,
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
  Popover, PopoverContent, PopoverTrigger,
  Label
} from "../ui";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { 
  BanknoteIcon, 
  WalletIcon, 
  ArrowDownIcon, 
  ArrowUpIcon, 
  HistoryIcon, 
  SearchIcon, 
  FilterIcon, 
  DollarSignIcon, 
  CalendarIcon, 
  ChevronDownIcon, 
  FileTextIcon, 
  ExternalLinkIcon, 
  CheckIcon, 
  ClockIcon, 
  XIcon,
  ArrowRightIcon,
  ChevronRightIcon,
  ReceiptIcon,
  DownloadIcon,
  AlertCircleIcon,
  LineChartIcon,
  PieChartIcon
} from "lucide-react";
import { Badge } from "../ui/badge";

// Interfaces
interface Transaction {
  id: string;
  type: "sale" | "commission" | "payout";
  amount: number;
  status: "completed" | "pending" | "failed";
  date: string;
  entity: {
    id: string;
    name: string;
    logo: string;
    type: "startup" | "support" | "platform";
  };
  reference: string;
  details?: string;
}

interface Balance {
  available: number;
  pending: number;
  currency: string;
}

// Mock data
const mockTransactions: Transaction[] = [
  {
    id: "txn_1",
    type: "sale",
    amount: 299.99,
    status: "completed",
    date: "2025-05-18T14:32:00Z",
    entity: {
      id: "ent_1",
      name: "TechInnovate",
      logo: "https://images.unsplash.com/photo-1567446537708-ac4aa75c9c28?q=80&w=1974&auto=format&fit=crop",
      type: "startup"
    },
    reference: "ORD12345",
    details: "AI Customer Service Chatbot"
  },
  {
    id: "txn_2",
    type: "commission",
    amount: 15.00,
    status: "completed",
    date: "2025-05-18T14:32:00Z",
    entity: {
      id: "ent_3",
      name: "TechBoost Accelerator",
      logo: "https://images.unsplash.com/photo-1596720426673-e4e14290f0cc?q=80&w=1974&auto=format&fit=crop",
      type: "support"
    },
    reference: "ORD12345",
    details: "Commission from TechInnovate sale"
  },
  {
    id: "txn_3",
    type: "payout",
    amount: 450.00,
    status: "completed",
    date: "2025-05-16T10:15:00Z",
    entity: {
      id: "ent_1",
      name: "TechInnovate",
      logo: "https://images.unsplash.com/photo-1567446537708-ac4aa75c9c28?q=80&w=1974&auto=format&fit=crop",
      type: "startup"
    },
    reference: "PYT98765",
    details: "Weekly automatic payout"
  },
  {
    id: "txn_4",
    type: "sale",
    amount: 129.99,
    status: "completed",
    date: "2025-05-15T16:42:00Z",
    entity: {
      id: "ent_2",
      name: "EcoStart",
      logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=1974&auto=format&fit=crop",
      type: "startup"
    },
    reference: "ORD12346",
    details: "EcoFriendly Packaging Solution"
  },
  {
    id: "txn_5",
    type: "commission",
    amount: 6.50,
    status: "completed",
    date: "2025-05-15T16:42:00Z",
    entity: {
      id: "ent_4",
      name: "GreenVentures Fund",
      logo: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop",
      type: "support"
    },
    reference: "ORD12346",
    details: "Commission from EcoStart sale"
  },
  {
    id: "txn_6",
    type: "payout",
    amount: 125.00,
    status: "pending",
    date: "2025-05-19T09:00:00Z",
    entity: {
      id: "ent_4",
      name: "GreenVentures Fund",
      logo: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop",
      type: "support"
    },
    reference: "PYT98766",
    details: "Monthly commission payout"
  },
  {
    id: "txn_7",
    type: "sale",
    amount: 499.99,
    status: "pending",
    date: "2025-05-19T11:23:00Z",
    entity: {
      id: "ent_1",
      name: "TechInnovate",
      logo: "https://images.unsplash.com/photo-1567446537708-ac4aa75c9c28?q=80&w=1974&auto=format&fit=crop",
      type: "startup"
    },
    reference: "ORD12347",
    details: "Marketing Strategy Session"
  },
  {
    id: "txn_8",
    type: "payout",
    amount: 175.00,
    status: "failed",
    date: "2025-05-14T08:30:00Z",
    entity: {
      id: "ent_2",
      name: "EcoStart",
      logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=1974&auto=format&fit=crop",
      type: "startup"
    },
    reference: "PYT98767",
    details: "Failed due to invalid bank account details"
  }
];

const mockBalances: Record<string, Balance> = {
  "startup": {
    available: 1250.50,
    pending: 499.99,
    currency: "USD"
  },
  "support": {
    available: 145.75,
    pending: 25.00,
    currency: "USD"
  },
  "admin": {
    available: 7250.35,
    pending: 1250.40,
    currency: "USD"
  }
};

interface PaymentManagementProps {
  user: any;
}

export function PaymentManagement({ user }: PaymentManagementProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState<string>("");
  
  // Get balance based on user role
  const balance = mockBalances[user?.role || "startup"] || mockBalances.startup;
  
  // Filter transactions based on role
  const userTransactions = transactions.filter(transaction => {
    if (user?.role === "admin") return true;
    if (user?.role === "startup") {
      return transaction.entity.type === "startup";
    }
    if (user?.role === "support") {
      return transaction.entity.type === "support";
    }
    return true;
  });
  
  // Apply filters
  const filteredTransactions = userTransactions.filter(transaction => {
    const matchesSearch = 
      transaction.entity.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (transaction.details && transaction.details.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = typeFilter === "all" || transaction.type === typeFilter;
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter;
    
    // Date filtering
    let matchesDate = true;
    const txnDate = new Date(transaction.date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (dateFilter === "today") {
      matchesDate = txnDate.toDateString() === today.toDateString();
    } else if (dateFilter === "yesterday") {
      matchesDate = txnDate.toDateString() === yesterday.toDateString();
    } else if (dateFilter === "week") {
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      matchesDate = txnDate >= weekAgo;
    } else if (dateFilter === "month") {
      const monthAgo = new Date(today);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      matchesDate = txnDate >= monthAgo;
    }
    
    return matchesSearch && matchesType && matchesStatus && matchesDate;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleRequestPayout = () => {
    if (!payoutAmount || isNaN(parseFloat(payoutAmount)) || parseFloat(payoutAmount) <= 0) {
      return;
    }
    
    const amount = parseFloat(payoutAmount);
    if (amount > balance.available) {
      return;
    }
    
    // Create a new payout transaction
    const newPayout: Transaction = {
      id: `txn_${Date.now()}`,
      type: "payout",
      amount: amount,
      status: "pending",
      date: new Date().toISOString(),
      entity: {
        id: user?.id || "user_1",
        name: user?.name || "Current User",
        logo: user?.avatar || "https://images.unsplash.com/photo-1568952433726-3896e3881c65?q=80&w=2070&auto=format&fit=crop",
        type: user?.role || "startup"
      },
      reference: `PYT${Math.floor(100000 + Math.random() * 900000)}`,
      details: "Manual payout request"
    };
    
    setTransactions([newPayout, ...transactions]);
    setIsPayoutModalOpen(false);
    setPayoutAmount("");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
            <CheckIcon className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
            <ClockIcon className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
            <XIcon className="h-3 w-3 mr-1" />
            Failed
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

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "sale":
        return (
          <Badge variant="outline" className="bg-tertiary/10 text-tertiary border-tertiary/20">
            <ArrowUpIcon className="h-3 w-3 mr-1" />
            Sale
          </Badge>
        );
      case "commission":
        return (
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            <DollarSignIcon className="h-3 w-3 mr-1" />
            Commission
          </Badge>
        );
      case "payout":
        return (
          <Badge variant="outline" className="bg-chart-4/10 text-chart-4 border-chart-4/20">
            <ArrowDownIcon className="h-3 w-3 mr-1" />
            Payout
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {type}
          </Badge>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            {user?.role === "admin" ? "Payment Management" : 
             user?.role === "support" ? "Commission Management" : 
             "Payment Management"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {user?.role === "admin" ? "Manage platform payments, transactions, and payouts" : 
             user?.role === "support" ? "Track commissions and request payouts" : 
             "Manage your earnings, transactions, and request payouts"}
          </p>
        </div>
        
        {(user?.role === "startup" || user?.role === "support") && (
          <Button 
            className="bg-primary text-primary-foreground"
            onClick={() => setIsPayoutModalOpen(true)}
          >
            <BanknoteIcon className="h-4 w-4 mr-2" />
            Request Payout
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            <WalletIcon className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${balance.available.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Available for withdrawal
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Balance</CardTitle>
            <ClockIcon className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${balance.pending.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              In processing period
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <DollarSignIcon className="h-5 w-5 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(balance.available + balance.pending).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total funds
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-transparent border-b w-full rounded-none p-0 h-auto justify-start gap-6">
          <TabsTrigger value="overview" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary px-1 py-3">
            <WalletIcon className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="transactions" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary px-1 py-3">
            <HistoryIcon className="h-4 w-4 mr-2" />
            Transactions
          </TabsTrigger>
          <TabsTrigger value="payouts" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary px-1 py-3">
            <BanknoteIcon className="h-4 w-4 mr-2" />
            Payouts
          </TabsTrigger>
          {user?.role === "admin" && (
            <TabsTrigger value="settings" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary px-1 py-3">
              <FileTextIcon className="h-4 w-4 mr-2" />
              Payment Settings
            </TabsTrigger>
          )}
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>Recent transactions and earnings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <LineChartIcon className="h-20 w-20 text-muted-foreground opacity-30" />
                  <span className="ml-2 text-muted-foreground">Transaction Chart Placeholder</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Transaction Breakdown</CardTitle>
                <CardDescription>By transaction type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[180px] flex items-center justify-center mb-4">
                  <PieChartIcon className="h-20 w-20 text-muted-foreground opacity-30" />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-tertiary mr-2"></div>
                      <span className="text-sm">Sales</span>
                    </div>
                    <div className="text-sm font-medium">
                      ${filteredTransactions
                        .filter(t => t.type === "sale")
                        .reduce((acc, t) => acc + t.amount, 0)
                        .toFixed(2)}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
                      <span className="text-sm">Commissions</span>
                    </div>
                    <div className="text-sm font-medium">
                      ${filteredTransactions
                        .filter(t => t.type === "commission")
                        .reduce((acc, t) => acc + t.amount, 0)
                        .toFixed(2)}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-chart-4 mr-2"></div>
                      <span className="text-sm">Payouts</span>
                    </div>
                    <div className="text-sm font-medium">
                      ${filteredTransactions
                        .filter(t => t.type === "payout")
                        .reduce((acc, t) => acc + t.amount, 0)
                        .toFixed(2)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Latest activity on your account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTransactions.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                        <ImageWithFallback
                          src={transaction.entity.logo}
                          alt={transaction.entity.name}
                          width={40}
                          height={40}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{transaction.entity.name}</p>
                          {getTypeBadge(transaction.type)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(transaction.date).toLocaleDateString()} {new Date(transaction.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        transaction.type === "payout" ? "text-chart-4" : 
                        transaction.type === "sale" ? "text-tertiary" : "text-primary"
                      }`}>
                        {transaction.type === "payout" ? "-" : "+"}${transaction.amount.toFixed(2)}
                      </p>
                      <div className="mt-1">
                        {getStatusBadge(transaction.status)}
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredTransactions.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
                    <AlertCircleIcon className="h-8 w-8 mb-2" />
                    <p>No transactions found</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => setActiveTab("transactions")}>
                View All Transactions
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>View and filter all transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search transactions..." 
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="sale">Sales</SelectItem>
                      <SelectItem value="commission">Commissions</SelectItem>
                      <SelectItem value="payout">Payouts</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="yesterday">Yesterday</SelectItem>
                      <SelectItem value="week">Last 7 days</SelectItem>
                      <SelectItem value="month">Last 30 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Transaction</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <AlertCircleIcon className="h-8 w-8 mb-2" />
                            <p>No transactions found</p>
                            <Button 
                              variant="link" 
                              onClick={() => {
                                setSearchTerm("");
                                setTypeFilter("all");
                                setStatusFilter("all");
                                setDateFilter("all");
                              }}
                            >
                              Reset filters
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTransactions.map((transaction) => (
                        <TableRow 
                          key={transaction.id} 
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => setSelectedTransaction(transaction)}
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full overflow-hidden">
                                <ImageWithFallback
                                  src={transaction.entity.logo}
                                  alt={transaction.entity.name}
                                  width={40}
                                  height={40}
                                  className="object-cover w-full h-full"
                                />
                              </div>
                              <div>
                                <p className="font-medium">{transaction.entity.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {transaction.reference} {transaction.details ? `• ${transaction.details}` : ''}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getTypeBadge(transaction.type)}
                          </TableCell>
                          <TableCell>
                            {new Date(transaction.date).toLocaleDateString()} 
                            <br />
                            <span className="text-xs text-muted-foreground">
                              {new Date(transaction.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(transaction.status)}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            <span className={
                              transaction.type === "payout" ? "text-chart-4" : 
                              transaction.type === "sale" ? "text-tertiary" : "text-primary"
                            }>
                              {transaction.type === "payout" ? "-" : "+"}${transaction.amount.toFixed(2)}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          
          {/* Transaction Details Dialog */}
          {selectedTransaction && (
            <Dialog open={!!selectedTransaction} onOpenChange={(open) => !open && setSelectedTransaction(null)}>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Transaction Details</DialogTitle>
                  <DialogDescription>
                    Complete information about this transaction
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden">
                        <ImageWithFallback
                          src={selectedTransaction.entity.logo}
                          alt={selectedTransaction.entity.name}
                          width={48}
                          height={48}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{selectedTransaction.entity.name}</p>
                        <div className="flex items-center gap-2">
                          {getTypeBadge(selectedTransaction.type)}
                          {getStatusBadge(selectedTransaction.status)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-xl font-bold ${
                        selectedTransaction.type === "payout" ? "text-chart-4" : 
                        selectedTransaction.type === "sale" ? "text-tertiary" : "text-primary"
                      }`}>
                        {selectedTransaction.type === "payout" ? "-" : "+"}${selectedTransaction.amount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-md space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Transaction ID</span>
                      <span className="text-sm font-medium">{selectedTransaction.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Reference</span>
                      <span className="text-sm font-medium">{selectedTransaction.reference}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Date & Time</span>
                      <span className="text-sm font-medium">
                        {new Date(selectedTransaction.date).toLocaleDateString()} {new Date(selectedTransaction.date).toLocaleTimeString()}
                      </span>
                    </div>
                    {selectedTransaction.details && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Details</span>
                        <span className="text-sm font-medium">{selectedTransaction.details}</span>
                      </div>
                    )}
                  </div>
                  
                  {selectedTransaction.status === "failed" && (
                    <div className="bg-destructive/10 p-4 rounded-md flex items-start gap-2">
                      <AlertCircleIcon className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-destructive">Transaction Failed</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {selectedTransaction.details || "This transaction could not be completed. Please check your payment details or contact support."}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                <DialogFooter className="flex items-center justify-between">
                  <Button variant="outline" size="sm" className="gap-1">
                    <DownloadIcon className="h-4 w-4" />
                    Download Receipt
                  </Button>
                  <Button onClick={() => setSelectedTransaction(null)}>
                    Close
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </TabsContent>
        
        {/* Payouts Tab */}
        <TabsContent value="payouts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Request Payout</CardTitle>
              <CardDescription>
                Withdraw available funds to your connected payment account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between bg-muted p-4 rounded-md">
                <div>
                  <p className="text-sm font-medium">Available for payout</p>
                  <p className="text-2xl font-bold">${balance.available.toFixed(2)}</p>
                </div>
                <Button 
                  className="bg-primary text-primary-foreground"
                  onClick={() => setIsPayoutModalOpen(true)}
                  disabled={balance.available <= 0}
                >
                  <BanknoteIcon className="h-4 w-4 mr-2" />
                  Request Payout
                </Button>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Payout History</h3>
                
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Reference</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions
                        .filter(t => t.type === "payout")
                        .length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="h-24 text-center">
                            <div className="flex flex-col items-center justify-center text-muted-foreground">
                              <BanknoteIcon className="h-8 w-8 mb-2 opacity-40" />
                              <p>No payout history</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredTransactions
                          .filter(t => t.type === "payout")
                          .map((payout) => (
                            <TableRow key={payout.id}>
                              <TableCell>
                                {new Date(payout.date).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                {payout.reference}
                              </TableCell>
                              <TableCell>
                                {getStatusBadge(payout.status)}
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                ${payout.amount.toFixed(2)}
                              </TableCell>
                            </TableRow>
                          ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Payout Settings</CardTitle>
              <CardDescription>
                Manage your payout methods and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-4 border rounded-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center">
                    <BanknoteIcon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">Bank Account (Default)</p>
                    <p className="text-xs text-muted-foreground">••••3456 - Last used on {new Date().toLocaleDateString()}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-payout">Automatic Payouts</Label>
                  <Switch id="auto-payout" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="payout-threshold">Payout Threshold</Label>
                    <p className="text-xs text-muted-foreground">
                      Minimum amount required for automatic payouts
                    </p>
                  </div>
                  <div className="w-32">
                    <Input 
                      id="payout-threshold" 
                      type="number" 
                      defaultValue={100} 
                      className="text-right" 
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="payout-frequency">Payout Frequency</Label>
                    <p className="text-xs text-muted-foreground">
                      How often automatic payouts should be processed
                    </p>
                  </div>
                  <Select defaultValue="monthly">
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Bi-Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Save Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Payment Settings Tab (Admin Only) */}
        {user?.role === "admin" && (
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Payment Settings</CardTitle>
                <CardDescription>
                  Configure global payment settings for the platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Commission Rates</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Standard Commission Rate</p>
                      <p className="text-xs text-muted-foreground">
                        Applied to all transactions by default
                      </p>
                    </div>
                    <div className="w-32">
                      <Input 
                        type="number" 
                        defaultValue={5} 
                        className="text-right" 
                        min={0}
                        max={100}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Support Structure Commission</p>
                      <p className="text-xs text-muted-foreground">
                        Commission paid to support structures
                      </p>
                    </div>
                    <div className="w-32">
                      <Input 
                        type="number" 
                        defaultValue={2.5} 
                        className="text-right" 
                        min={0}
                        max={100}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Payment Processing</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Processing Period (Days)</p>
                      <p className="text-xs text-muted-foreground">
                        Days before funds become available for withdrawal
                      </p>
                    </div>
                    <div className="w-32">
                      <Input 
                        type="number" 
                        defaultValue={3} 
                        className="text-right" 
                        min={0}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Minimum Payout Amount</p>
                      <p className="text-xs text-muted-foreground">
                        Minimum amount required to request a payout
                      </p>
                    </div>
                    <div className="w-32">
                      <Input 
                        type="number" 
                        defaultValue={50} 
                        className="text-right" 
                        min={0}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Payment Providers</h3>
                  
                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center">
                        <CreditCardIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">Stripe</p>
                        <p className="text-xs text-muted-foreground">Primary payment processor</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500">
                      Active
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center">
                        <BanknoteIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">PayPal</p>
                        <p className="text-xs text-muted-foreground">Secondary payment processor</p>
                      </div>
                    </div>
                    <Badge variant="outline">
                      Inactive
                    </Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Save Settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        )}
      </Tabs>
      
      {/* Request Payout Modal */}
      <Dialog open={isPayoutModalOpen} onOpenChange={setIsPayoutModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Request Payout</DialogTitle>
            <DialogDescription>
              Withdraw funds to your connected payment account
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="payout-amount">Payout Amount</Label>
              <div className="relative">
                <DollarSignIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="payout-amount"
                  type="number"
                  placeholder="0.00"
                  className="pl-9"
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  min={1}
                  max={balance.available}
                />
              </div>
              <p className="text-xs text-muted-foreground flex justify-between">
                <span>Available: ${balance.available.toFixed(2)}</span>
                <Button 
                  variant="link" 
                  className="h-auto p-0 text-xs"
                  onClick={() => setPayoutAmount(balance.available.toString())}
                >
                  Max amount
                </Button>
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="payout-method">Payout Method</Label>
              <Select defaultValue="bank">
                <SelectTrigger id="payout-method">
                  <SelectValue placeholder="Select a payout method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank">Bank Account (••••3456)</SelectItem>
                  <SelectItem value="paypal">PayPal (example@email.com)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="bg-muted p-4 rounded-md space-y-3">
              <div className="flex justify-between text-sm">
                <span>Amount</span>
                <span>${payoutAmount || "0.00"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Processing Fee</span>
                <span>$0.00</span>
              </div>
              <div className="border-t border-border pt-2 mt-2 flex justify-between font-medium">
                <span>Total</span>
                <span>${payoutAmount || "0.00"}</span>
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground">
              Payouts typically process in 1-3 business days depending on your bank.
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPayoutModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleRequestPayout}
              disabled={!payoutAmount || parseFloat(payoutAmount) <= 0 || parseFloat(payoutAmount) > balance.available}
            >
              Confirm Payout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Additional icon component used in the admin settings tab
function CreditCardIcon(props: React.ComponentProps<typeof BanknoteIcon>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  );
}
