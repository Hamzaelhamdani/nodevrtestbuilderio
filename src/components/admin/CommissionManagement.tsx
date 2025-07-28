import { useState } from "react";
import { 
  DollarSignIcon, 
  PieChartIcon, 
  PercentIcon, 
  TrendingUpIcon, 
  ArrowDownIcon, 
  ArrowUpIcon, 
  SearchIcon, 
  FilterIcon,
  CalendarIcon,
  RefreshCwIcon,
  CheckIcon,
  XIcon,
  FileTextIcon,
  DownloadIcon,
  ArrowRightIcon,
  AlertCircleIcon
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Progress } from "../ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Separator } from "../ui/separator";
import { Switch } from "../ui/switch";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "../ui/dropdown-menu";

// Sample data for commission management
const commissionSummary = {
  totalCommissions: 192350,
  pendingPayouts: 52300,
  processedPayouts: 140050,
  commissionRate: 12.5,
  monthlyGrowth: 15.2,
  platformFee: 5
};

const supportStructures = [
  {
    id: "ss1",
    name: "FinTech Ventures",
    logo: "",
    type: "Accelerator",
    commissionRate: 12,
    pendingPayout: 18250,
    totalPaid: 68450,
    startups: 8,
    lastPayout: "2025-05-15T14:22:47Z"
  },
  {
    id: "ss2",
    name: "Green Innovations",
    logo: "",
    type: "Incubator",
    commissionRate: 10,
    pendingPayout: 12500,
    totalPaid: 25750,
    startups: 5,
    lastPayout: "2025-05-10T09:18:23Z"
  },
  {
    id: "ss3",
    name: "MedTech Accelerator",
    logo: "",
    type: "Accelerator",
    commissionRate: 15,
    pendingPayout: 9850,
    totalPaid: 22100,
    startups: 6,
    lastPayout: "2025-05-08T11:34:56Z"
  },
  {
    id: "ss4",
    name: "AI Catalyst",
    logo: "",
    type: "Incubator",
    commissionRate: 14,
    pendingPayout: 7200,
    totalPaid: 18750,
    startups: 4,
    lastPayout: "2025-05-05T16:45:30Z"
  },
  {
    id: "ss5",
    name: "Hardware Innovators",
    logo: "",
    type: "Accelerator",
    commissionRate: 11,
    pendingPayout: 4500,
    totalPaid: 5000,
    startups: 3,
    lastPayout: "2025-05-01T10:12:15Z"
  }
];

const recentTransactions = [
  {
    id: "tx1",
    supportStructure: "FinTech Ventures",
    startup: "BlockVista",
    product: "Blockchain Analysis Tool",
    amount: 2500,
    commissionAmount: 300,
    date: "2025-05-30T07:12:05Z",
    status: "completed"
  },
  {
    id: "tx2",
    supportStructure: "Green Innovations",
    startup: "EcoMetrics",
    product: "Sustainability Reporting Software",
    amount: 1800,
    commissionAmount: 180,
    date: "2025-05-29T14:35:12Z",
    status: "completed"
  },
  {
    id: "tx3",
    supportStructure: "MedTech Accelerator",
    startup: "HealthTrack",
    product: "Patient Monitoring System",
    amount: 3200,
    commissionAmount: 480,
    date: "2025-05-29T10:22:48Z",
    status: "completed"
  },
  {
    id: "tx4",
    supportStructure: "AI Catalyst",
    startup: "DataSphere",
    product: "AI Data Analysis Tool",
    amount: 1250,
    commissionAmount: 175,
    date: "2025-05-28T16:05:33Z",
    status: "completed"
  },
  {
    id: "tx5",
    supportStructure: "Hardware Innovators",
    startup: "SenseTech",
    product: "IoT Sensor Kit",
    amount: 950,
    commissionAmount: 104.5,
    date: "2025-05-28T11:48:19Z",
    status: "completed"
  }
];

interface CommissionManagementProps {
  user?: any;
}

export function CommissionManagement({ user }: CommissionManagementProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("30d");
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState("all");
  
  // Format currency helper
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  };
  
  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  // Function to handle payout approval
  const handleProcessPayout = (id: string) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      console.log(`Processed payout for ${id}`);
    }, 1000);
  };
  
  // Function to refresh data
  const refreshData = () => {
    setLoading(true);
    
    // Simulate API refresh
    setTimeout(() => {
      setLoading(false);
      console.log("Data refreshed");
    }, 800);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex justify-between items-center">
          <TabsList className="h-11">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <PieChartIcon className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="payouts" className="flex items-center gap-2">
              <DollarSignIcon className="h-4 w-4" />
              <span>Payouts</span>
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center gap-2">
              <ArrowRightIcon className="h-4 w-4" />
              <span>Transactions</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <PercentIcon className="h-4 w-4" />
              <span>Commission Settings</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-3">
            <Select 
              defaultValue={timeRange} 
              onValueChange={setTimeRange}
            >
              <SelectTrigger className="w-[150px]">
                <CalendarIcon className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last quarter</SelectItem>
                <SelectItem value="ytd">Year to date</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={refreshData}
              disabled={loading}
            >
              <RefreshCwIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Commissions</p>
                    <h3 className="text-2xl font-bold mt-1">{formatCurrency(commissionSummary.totalCommissions)}</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-chart-4/20 flex items-center justify-center">
                    <DollarSignIcon className="h-6 w-6 text-chart-4" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-xs">
                  <Badge variant="outline" className="bg-chart-1/20 text-chart-1 border-chart-1/30 flex items-center gap-1">
                    <TrendingUpIcon className="h-3 w-3" />
                    +{commissionSummary.monthlyGrowth}% from last month
                  </Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Payouts</p>
                    <h3 className="text-2xl font-bold mt-1">{formatCurrency(commissionSummary.pendingPayouts)}</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-chart-5/20 flex items-center justify-center">
                    <ArrowUpIcon className="h-6 w-6 text-chart-5" />
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <Progress className="h-1.5" value={commissionSummary.pendingPayouts / commissionSummary.totalCommissions * 100} />
                  <span className="text-xs text-muted-foreground ml-2">
                    {Math.round(commissionSummary.pendingPayouts / commissionSummary.totalCommissions * 100)}%
                  </span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Processed Payouts</p>
                    <h3 className="text-2xl font-bold mt-1">{formatCurrency(commissionSummary.processedPayouts)}</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-chart-1/20 flex items-center justify-center">
                    <ArrowDownIcon className="h-6 w-6 text-chart-1" />
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <Progress className="h-1.5" value={commissionSummary.processedPayouts / commissionSummary.totalCommissions * 100} />
                  <span className="text-xs text-muted-foreground ml-2">
                    {Math.round(commissionSummary.processedPayouts / commissionSummary.totalCommissions * 100)}%
                  </span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg. Commission Rate</p>
                    <h3 className="text-2xl font-bold mt-1">{commissionSummary.commissionRate}%</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-chart-3/20 flex items-center justify-center">
                    <PercentIcon className="h-6 w-6 text-chart-3" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-xs">
                  <Badge variant="outline" className="bg-muted text-muted-foreground">
                    Platform fee: {commissionSummary.platformFee}%
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Support Structure Commissions</CardTitle>
                <CardDescription>
                  Commission earnings by support structure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-muted/30">
                      <tr>
                        <th scope="col" className="px-4 py-3 rounded-l-md">Support Structure</th>
                        <th scope="col" className="px-4 py-3">Rate</th>
                        <th scope="col" className="px-4 py-3">Pending</th>
                        <th scope="col" className="px-4 py-3">Total Paid</th>
                        <th scope="col" className="px-4 py-3 rounded-r-md">Last Payout</th>
                      </tr>
                    </thead>
                    <tbody>
                      {supportStructures.map((structure, index) => (
                        <tr 
                          key={structure.id} 
                          className={`border-b border-border/30 hover:bg-muted/20 ${
                            index % 2 === 0 ? 'bg-muted/10' : ''
                          }`}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                {structure.logo ? (
                                  <AvatarImage src={structure.logo} alt={structure.name} />
                                ) : (
                                  <AvatarFallback className="bg-muted text-primary">
                                    {structure.name.substring(0, 2).toUpperCase()}
                                  </AvatarFallback>
                                )}
                              </Avatar>
                              <div>
                                <p className="font-medium">{structure.name}</p>
                                <p className="text-xs text-muted-foreground">{structure.type}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-medium">{structure.commissionRate}%</td>
                          <td className="px-4 py-3 font-medium">{formatCurrency(structure.pendingPayout)}</td>
                          <td className="px-4 py-3">{formatCurrency(structure.totalPaid)}</td>
                          <td className="px-4 py-3 text-xs">{formatDate(structure.lastPayout)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-border/30 pt-4">
                <p className="text-sm text-muted-foreground">
                  Showing 5 of {supportStructures.length} support structures
                </p>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>
                  Latest commission-generating transactions
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-0">
                  {recentTransactions.map((transaction, index) => (
                    <div 
                      key={transaction.id} 
                      className={`flex items-start justify-between p-4 ${
                        index !== recentTransactions.length - 1 ? 'border-b border-border/30' : ''
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{transaction.startup}</p>
                          <Badge 
                            variant="outline" 
                            className={
                              transaction.status === 'completed' 
                                ? 'bg-chart-1/20 text-chart-1 border-chart-1/30' 
                                : 'bg-chart-5/20 text-chart-5 border-chart-5/30'
                            }
                          >
                            {transaction.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{transaction.product}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs">Support: {transaction.supportStructure}</p>
                          <p className="text-xs">
                            <span className="text-muted-foreground">Commission:</span> {formatCurrency(transaction.commissionAmount)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{formatCurrency(transaction.amount)}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(transaction.date)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t border-border/30 pt-4">
                <Button variant="outline" className="w-full justify-center">
                  View All Transactions
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        {/* Payouts Tab */}
        <TabsContent value="payouts" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Pending Payouts</CardTitle>
                  <CardDescription>
                    Manage commission payouts to support structures
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search support structures..." 
                      className="pl-10 w-[250px]" 
                    />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[160px]">
                      <FilterIcon className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Structures</SelectItem>
                      <SelectItem value="high">High Value (&gt;$10K)</SelectItem>
                      <SelectItem value="medium">Medium Value ($1K-$10K)</SelectItem>
                      <SelectItem value="low">Low Value (&lt;$1K)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Support Structure</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Startups</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {supportStructures.map((structure) => (
                    <TableRow key={structure.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            {structure.logo ? (
                              <AvatarImage src={structure.logo} alt={structure.name} />
                            ) : (
                              <AvatarFallback className="bg-muted text-primary">
                                {structure.name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <p className="font-medium">{structure.name}</p>
                            <p className="text-xs text-muted-foreground">{structure.type}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-muted/20">
                          Bank Transfer
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{formatCurrency(structure.pendingPayout)}</span>
                      </TableCell>
                      <TableCell>{structure.startups} startups</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className="bg-chart-5/20 text-chart-5 border-chart-5/30"
                        >
                          Ready for payment
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="default"
                          size="sm"
                          className="bg-chart-1 text-chart-1-foreground hover:bg-chart-1/90 h-8"
                          onClick={() => handleProcessPayout(structure.id)}
                          disabled={loading}
                        >
                          <CheckIcon className="h-3.5 w-3.5 mr-1" />
                          Process
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between border-t border-border/30 pt-4">
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <FileTextIcon className="h-4 w-4" />
                  Generate Report
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <DownloadIcon className="h-4 w-4" />
                  Export CSV
                </Button>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="destructive" size="sm">
                  Reject All
                </Button>
                <Button className="bg-chart-4 text-white hover:bg-chart-4/90">
                  Process All Payouts
                </Button>
              </div>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Payout History</CardTitle>
              <CardDescription>
                View past commission payouts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4">
                <AlertCircleIcon className="h-4 w-4" />
                <AlertTitle>Payout Schedule</AlertTitle>
                <AlertDescription>
                  Commission payouts are processed on the 1st and 15th of each month for balances over $100.
                </AlertDescription>
              </Alert>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Support Structure</TableHead>
                    <TableHead>Payout Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { id: "p1", supportStructure: "FinTech Ventures", date: "2025-05-15T14:22:47Z", amount: 12500, transactionId: "tx-58fd92a1", status: "completed" },
                    { id: "p2", supportStructure: "Green Innovations", date: "2025-05-15T14:15:32Z", amount: 8750, transactionId: "tx-a7cb143d", status: "completed" },
                    { id: "p3", supportStructure: "MedTech Accelerator", date: "2025-05-15T14:10:21Z", amount: 7200, transactionId: "tx-2db49f85", status: "completed" },
                    { id: "p4", supportStructure: "AI Catalyst", date: "2025-05-01T09:45:18Z", amount: 9500, transactionId: "tx-b3e72c6f", status: "completed" },
                    { id: "p5", supportStructure: "Hardware Innovators", date: "2025-05-01T09:38:52Z", amount: 5000, transactionId: "tx-4fa91e28", status: "completed" }
                  ].map((payout) => (
                    <TableRow key={payout.id}>
                      <TableCell>
                        <p className="font-medium">{payout.supportStructure}</p>
                      </TableCell>
                      <TableCell>{formatDate(payout.date)}</TableCell>
                      <TableCell>
                        <span className="font-medium">{formatCurrency(payout.amount)}</span>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted p-1 rounded">{payout.transactionId}</code>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className="bg-chart-1/20 text-chart-1 border-chart-1/30"
                        >
                          {payout.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <span className="sr-only">View details</span>
                          <FileTextIcon className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-center border-t border-border/30 pt-4">
              <Button variant="outline">View All History</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Commission Transactions</CardTitle>
                  <CardDescription>
                    All transactions that generated commissions
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search transactions..." 
                      className="pl-10 w-[250px]" 
                    />
                  </div>
                  <Select 
                    defaultValue={filterType} 
                    onValueChange={setFilterType}
                  >
                    <SelectTrigger className="w-[180px]">
                      <FilterIcon className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter transactions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Transactions</SelectItem>
                      <SelectItem value="pending">Pending Commissions</SelectItem>
                      <SelectItem value="paid">Paid Commissions</SelectItem>
                      <SelectItem value="disputed">Disputed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction</TableHead>
                      <TableHead>Support Structure</TableHead>
                      <TableHead>Startup</TableHead>
                      <TableHead>Sale Amount</TableHead>
                      <TableHead>Commission</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...recentTransactions, 
                      {
                        id: "tx6",
                        supportStructure: "FinTech Ventures",
                        startup: "PayTrack",
                        product: "Payment Gateway Integration",
                        amount: 1750,
                        commissionAmount: 210,
                        date: "2025-05-27T14:05:22Z",
                        status: "completed"
                      },
                      {
                        id: "tx7",
                        supportStructure: "Green Innovations",
                        startup: "SolarMetrics",
                        product: "Energy Monitoring Suite",
                        amount: 2200,
                        commissionAmount: 220,
                        date: "2025-05-26T11:32:48Z",
                        status: "completed"
                      },
                      {
                        id: "tx8",
                        supportStructure: "MedTech Accelerator",
                        startup: "BioDataAI",
                        product: "Medical Image Analysis",
                        amount: 4500,
                        commissionAmount: 675,
                        date: "2025-05-25T09:15:33Z",
                        status: "completed"
                      }
                    ].map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium truncate max-w-[200px]">{transaction.product}</p>
                            <p className="text-xs text-muted-foreground">ID: {transaction.id}</p>
                          </div>
                        </TableCell>
                        <TableCell>{transaction.supportStructure}</TableCell>
                        <TableCell>{transaction.startup}</TableCell>
                        <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                        <TableCell>
                          <span className="font-medium text-chart-4">
                            {formatCurrency(transaction.commissionAmount)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">{formatDate(transaction.date)}</p>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={
                              transaction.status === 'completed' 
                                ? 'bg-chart-1/20 text-chart-1 border-chart-1/30' 
                                : 'bg-chart-5/20 text-chart-5 border-chart-5/30'
                            }
                          >
                            {transaction.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t border-border/30 pt-4">
              <p className="text-sm text-muted-foreground">
                Showing 8 of 248 transactions
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">Previous</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Commission Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Commission</CardTitle>
                  <CardDescription>
                    Configure global commission settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Platform Fee</p>
                      <div className="flex items-center gap-2">
                        <Input 
                          type="number" 
                          min="0" 
                          max="100" 
                          defaultValue="5"
                          className="w-20 h-9" 
                        />
                        <span className="text-lg">%</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Base fee charged on all marketplace transactions
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Minimum Commission</p>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">$</span>
                        <Input 
                          type="number" 
                          min="0"
                          defaultValue="2"
                          className="w-20 h-9" 
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Minimum commission amount per transaction
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Payment Threshold</p>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">$</span>
                        <Input 
                          type="number" 
                          min="0"
                          defaultValue="100"
                          className="w-20 h-9" 
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Minimum amount required for payout
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-chart-4 text-white hover:bg-chart-4/90">
                    Save Settings
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Payout Schedule</CardTitle>
                  <CardDescription>
                    Configure when payouts are processed
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Payout Frequency</p>
                    <Select defaultValue="biweekly">
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="biweekly">Bi-Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Payout Days</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center space-x-2">
                        <Switch id="first" defaultChecked />
                        <label htmlFor="first" className="text-sm">1st of month</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="fifteenth" defaultChecked />
                        <label htmlFor="fifteenth" className="text-sm">15th of month</label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Auto-Process Payouts</p>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Commission Rate Structure</CardTitle>
                  <CardDescription>
                    Configure tiered commission rates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Commission Model</p>
                      <Select defaultValue="tiered">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="flat">Flat Rate</SelectItem>
                          <SelectItem value="tiered">Tiered (Volume-Based)</SelectItem>
                          <SelectItem value="category">Category-Based</SelectItem>
                          <SelectItem value="custom">Custom per Structure</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="rounded-md border p-4">
                      <p className="text-sm font-medium mb-3">Tiered Commission Rates</p>
                      
                      <div className="space-y-2">
                        <div className="grid grid-cols-3 gap-4 p-2 bg-muted/30 rounded-md">
                          <div>
                            <p className="text-sm font-medium">Monthly Volume</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Support Structure %</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Platform %</p>
                          </div>
                        </div>
                        
                        {[
                          { tier: "$0 - $10,000", support: 8, platform: 5 },
                          { tier: "$10,001 - $50,000", support: 10, platform: 4 },
                          { tier: "$50,001 - $100,000", support: 12, platform: 3 },
                          { tier: "$100,001+", support: 15, platform: 2 }
                        ].map((tier, index) => (
                          <div key={index} className="grid grid-cols-3 gap-4 p-2 border-b border-border/30 last:border-0">
                            <div>
                              <p className="text-sm">{tier.tier}</p>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <Input 
                                  type="number" 
                                  defaultValue={tier.support}
                                  min="0" 
                                  max="100" 
                                  className="h-8"
                                />
                                <span>%</span>
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <Input 
                                  type="number" 
                                  defaultValue={tier.platform}
                                  min="0" 
                                  max="100" 
                                  className="h-8"
                                />
                                <span>%</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex justify-end mt-4">
                        <Button variant="outline" size="sm">
                          + Add Tier
                        </Button>
                      </div>
                    </div>
                    
                    <div className="rounded-md border p-4">
                      <p className="text-sm font-medium mb-3">Category-Based Rates</p>
                      
                      <div className="space-y-2">
                        <div className="grid grid-cols-3 gap-4 p-2 bg-muted/30 rounded-md">
                          <div>
                            <p className="text-sm font-medium">Category</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Support Structure %</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Platform %</p>
                          </div>
                        </div>
                        
                        {[
                          { category: "SaaS & Software", support: 10, platform: 5 },
                          { category: "Services & Consulting", support: 12, platform: 3 },
                          { category: "Hardware & IoT", support: 8, platform: 4 },
                          { category: "Digital Content", support: 15, platform: 5 }
                        ].map((category, index) => (
                          <div key={index} className="grid grid-cols-3 gap-4 p-2 border-b border-border/30 last:border-0">
                            <div>
                              <p className="text-sm">{category.category}</p>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <Input 
                                  type="number" 
                                  defaultValue={category.support}
                                  min="0" 
                                  max="100" 
                                  className="h-8"
                                />
                                <span>%</span>
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <Input 
                                  type="number" 
                                  defaultValue={category.platform}
                                  min="0" 
                                  max="100" 
                                  className="h-8"
                                />
                                <span>%</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex justify-end mt-4">
                        <Button variant="outline" size="sm">
                          + Add Category
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t border-border/30 pt-4">
                  <Button variant="outline">Reset to Defaults</Button>
                  <Button className="bg-chart-4 text-white hover:bg-chart-4/90">
                    Save Commission Structure
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Custom Support Structure Rates</CardTitle>
                  <CardDescription>
                    Configure special rates for specific support structures
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Support Structure</TableHead>
                        <TableHead>Standard Rate</TableHead>
                        <TableHead>Custom Rate</TableHead>
                        <TableHead>Effective Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        { id: "cr1", name: "FinTech Ventures", standardRate: 10, customRate: 12, effectiveDate: "2025-04-01", status: "active" },
                        { id: "cr2", name: "MedTech Accelerator", standardRate: 10, customRate: 15, effectiveDate: "2025-03-15", status: "active" },
                        { id: "cr3", name: "AI Catalyst", standardRate: 10, customRate: 14, effectiveDate: "2025-05-01", status: "active" }
                      ].map((rate) => (
                        <TableRow key={rate.id}>
                          <TableCell>
                            <p className="font-medium">{rate.name}</p>
                          </TableCell>
                          <TableCell>{rate.standardRate}%</TableCell>
                          <TableCell>
                            <span className="font-medium text-chart-4">{rate.customRate}%</span>
                          </TableCell>
                          <TableCell>{new Date(rate.effectiveDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline" 
                              className="bg-chart-1/20 text-chart-1 border-chart-1/30"
                            >
                              {rate.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <FilterIcon className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>Edit rate</DropdownMenuItem>
                                <DropdownMenuItem>View history</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive focus:text-destructive">
                                  Remove custom rate
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="flex justify-end border-t border-border/30 pt-4">
                  <Button>
                    Add Custom Rate
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}