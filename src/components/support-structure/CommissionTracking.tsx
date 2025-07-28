import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  BanknoteIcon, 
  CalendarIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  DownloadIcon, 
  FilterIcon, 
  LineChartIcon, 
  PercentIcon, 
  TrendingUpIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ClipboardListIcon,
  SearchIcon,
  RefreshCwIcon,
  ExternalLinkIcon,
  SlidersIcon,
  PieChartIcon,
  BarChart3Icon
} from "lucide-react";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

// Sample data for commission summary
const commissionSummary = {
  totalEarned: 15750,
  pendingAmount: 3250,
  projectedEarnings: 5800,
  averageRate: 12.5,
  transactionCount: 48,
  totalStartups: 7
};

// Sample data for commission by startup
const commissionByStartup = [
  { name: "TechFlow AI", amount: 4200, percentage: 26.7, change: 12, color: "#c1f17e" },
  { name: "BlockVista", amount: 3850, percentage: 24.4, change: 8, color: "#8A4FFF" },
  { name: "MediConnect", amount: 2950, percentage: 18.7, change: -3, color: "#0066FF" },
  { name: "EduSpark", amount: 1950, percentage: 12.4, change: 15, color: "#FF6B00" },
  { name: "GreenLoop", amount: 1650, percentage: 10.5, change: 5, color: "#4CAF50" },
  { name: "DataPulse", amount: 750, percentage: 4.8, change: -2, color: "#FF5722" },
  { name: "CloudMate", amount: 400, percentage: 2.5, change: 6, color: "#607D8B" }
];

// Sample data for monthly commission trends
const monthlyCommissionTrends = [
  { month: "Jan", commissions: 1200, transactions: 8, rate: 10 },
  { month: "Feb", commissions: 1450, transactions: 10, rate: 10 },
  { month: "Mar", commissions: 1800, transactions: 12, rate: 11.5 },
  { month: "Apr", commissions: 1650, transactions: 11, rate: 12 },
  { month: "May", commissions: 2100, transactions: 14, rate: 12.5 },
  { month: "Jun", commissions: 2400, transactions: 16, rate: 12.5 },
  { month: "Jul", commissions: 2750, transactions: 18, rate: 13 },
  { month: "Aug", commissions: 3200, transactions: 20, rate: 13.5 },
  { month: "Sep", commissions: 3800, transactions: 22, rate: 14 }
];

// Sample data for recent transactions
const recentTransactions = [
  { 
    id: "TX-9851",
    startup: "TechFlow AI",
    product: "AI Analytics Suite",
    date: "2025-05-28T14:30:00Z",
    amount: 2750,
    commission: 385,
    rate: 14,
    status: "paid"
  },
  { 
    id: "TX-9845",
    startup: "BlockVista",
    product: "Smart Contract Toolkit",
    date: "2025-05-26T09:45:00Z",
    amount: 1850,
    commission: 240.5,
    rate: 13,
    status: "paid"
  },
  { 
    id: "TX-9832",
    startup: "MediConnect",
    product: "Healthcare API Integration",
    date: "2025-05-24T16:20:00Z",
    amount: 3200,
    commission: 384,
    rate: 12,
    status: "paid"
  },
  { 
    id: "TX-9821",
    startup: "EduSpark",
    product: "Learning Management System",
    date: "2025-05-22T11:15:00Z",
    amount: 1450,
    commission: 188.5,
    rate: 13,
    status: "paid"
  },
  { 
    id: "TX-9810",
    startup: "TechFlow AI",
    product: "Predictive Analytics Add-on",
    date: "2025-05-20T13:40:00Z",
    amount: 950,
    commission: 123.5,
    rate: 13,
    status: "paid"
  },
  {
    id: "TX-9873",
    startup: "GreenLoop",
    product: "Sustainability Assessment",
    date: "2025-05-29T10:15:00Z",
    amount: 2100,
    commission: 273,
    rate: 13,
    status: "pending"
  },
  {
    id: "TX-9866",
    startup: "DataPulse",
    product: "Data Visualization Platform",
    date: "2025-05-28T15:30:00Z",
    amount: 1750,
    commission: 227.5,
    rate: 13,
    status: "pending"
  }
];

// Sample data for commission rates
const commissionRates = [
  { range: "0-5%", count: 2, color: "#FF5722" },
  { range: "6-10%", count: 10, color: "#FF6B00" },
  { range: "11-15%", count: 28, color: "#c1f17e" },
  { range: "16-20%", count: 8, color: "#8A4FFF" }
];

// Custom tooltip component for charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card/95 backdrop-blur-sm p-3 rounded-md border border-border shadow-md">
        <p className="font-medium text-sm">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`item-${index}`} className="text-sm" style={{ color: entry.color || entry.fill || entry.stroke }}>
            <span className="font-medium">{entry.name}: </span>
            {entry.name === "Commissions" ? `$${entry.value.toLocaleString()}` : 
             entry.name === "Rate" ? `${entry.value}%` : 
             entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Time period options
const timePeriods = [
  { label: "Last 30 Days", value: "30d" },
  { label: "Last Quarter", value: "quarter" },
  { label: "Last 6 Months", value: "6m" },
  { label: "Year to Date", value: "ytd" },
  { label: "Last Year", value: "1y" },
  { label: "All Time", value: "all" }
];

export function CommissionTracking() {
  const [timeRange, setTimeRange] = useState("6m");
  const [viewMode, setViewMode] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Select time period handler
  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
    // In a real app, this would fetch data for the selected time range
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };
  
  // Filter transactions by search query
  const filteredTransactions = recentTransactions.filter(transaction => 
    transaction.startup.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.id.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      {/* Commission summary metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Earned */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Commissions</p>
                <h3 className="text-2xl font-bold mt-1">${commissionSummary.totalEarned.toLocaleString()}</h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-chart-4/20 flex items-center justify-center">
                <BanknoteIcon className="h-5 w-5 text-chart-4" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-xs">
              <Badge variant="outline" className="bg-chart-4/20 text-chart-4 border-chart-4/30 flex items-center gap-1">
                <ArrowUpIcon className="h-3 w-3" />
                18% from last period
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        {/* Pending Commissions */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Commissions</p>
                <h3 className="text-2xl font-bold mt-1">${commissionSummary.pendingAmount.toLocaleString()}</h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-chart-5/20 flex items-center justify-center">
                <ClockIcon className="h-5 w-5 text-chart-5" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-xs">
              <Badge variant="outline" className="bg-muted text-muted-foreground border-muted/30">
                {recentTransactions.filter(tx => tx.status === "pending").length} pending transactions
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        {/* Projected Earnings */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Projected (30 days)</p>
                <h3 className="text-2xl font-bold mt-1">${commissionSummary.projectedEarnings.toLocaleString()}</h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-chart-1/20 flex items-center justify-center">
                <TrendingUpIcon className="h-5 w-5 text-chart-1" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-xs">
              <Badge variant="outline" className="bg-chart-1/20 text-chart-1 border-chart-1/30 flex items-center gap-1">
                <ArrowUpIcon className="h-3 w-3" />
                12% growth projection
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        {/* Average Commission Rate */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Rate</p>
                <h3 className="text-2xl font-bold mt-1">{commissionSummary.averageRate}%</h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-chart-3/20 flex items-center justify-center">
                <PercentIcon className="h-5 w-5 text-chart-3" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-xs">
              <Badge variant="outline" className="bg-chart-3/20 text-chart-3 border-chart-3/30 flex items-center gap-1">
                <ArrowUpIcon className="h-3 w-3" />
                0.5% increase
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Time period selector and view mode tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Tabs value={viewMode} onValueChange={setViewMode} className="w-full sm:w-auto">
          <TabsList className="grid grid-cols-3 w-full sm:w-auto">
            <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
            <TabsTrigger value="transactions" className="text-xs">Transactions</TabsTrigger>
            <TabsTrigger value="rates" className="text-xs">Rates</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center gap-3">
          <CalendarIcon className="h-4 w-4 text-muted-foreground hidden sm:block" />
          <Select 
            value={timeRange}
            onValueChange={handleTimeRangeChange}
          >
            <SelectTrigger className="w-[160px] h-9 text-sm">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              {timePeriods.map((period) => (
                <SelectItem key={period.value} value={period.value}>
                  {period.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm" className="h-9">
            <RefreshCwIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Main content based on selected view */}
      <TabsContent value="overview" className="mt-0 space-y-6">
        {/* Commission trends chart */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base">Commission Trends</CardTitle>
              <LineChartIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardDescription>
              Monthly commission earnings and transaction volume
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={monthlyCommissionTrends}
                  margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="colorCommission" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#c1f17e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#c1f17e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(214, 221, 230, 0.1)" />
                  <XAxis dataKey="month" tick={{ fill: 'rgba(214, 221, 230, 0.62)' }} />
                  <YAxis yAxisId="left" tick={{ fill: 'rgba(214, 221, 230, 0.62)' }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fill: 'rgba(214, 221, 230, 0.62)' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="commissions" 
                    name="Commissions" 
                    stroke="#c1f17e" 
                    fillOpacity={1}
                    fill="url(#colorCommission)"
                    strokeWidth={2}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="rate" 
                    name="Rate" 
                    stroke="#FF6B00" 
                    strokeWidth={2}
                    dot={{ fill: '#FF6B00', stroke: '#FF6B00', strokeWidth: 2, r: 4 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-chart-1"></div>
                <span className="text-xs text-muted-foreground">Commission Amount ($)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-chart-4"></div>
                <span className="text-xs text-muted-foreground">Commission Rate (%)</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Commission breakdown by startup */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Commission by startup chart */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">Commission by Startup</CardTitle>
                <PieChartIcon className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardDescription>
                Distribution of earnings across portfolio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={commissionByStartup}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="amount"
                      nameKey="name"
                    >
                      {commissionByStartup.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-2 mt-4 justify-center">
                {commissionByStartup.slice(0, 5).map((startup, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="flex items-center gap-1"
                    style={{ backgroundColor: `${startup.color}20`, color: startup.color, borderColor: `${startup.color}30` }}
                  >
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: startup.color }}></div>
                    {startup.name}: {startup.percentage}%
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Top earning startups */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">Top Earning Startups</CardTitle>
                <ClipboardListIcon className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardDescription>
                Ranked by commission generated
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {commissionByStartup.slice(0, 5).map((startup, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-card text-xs font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">{startup.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {startup.percentage}% of total commissions
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">${startup.amount.toLocaleString()}</p>
                      <div className="flex items-center gap-1 text-xs">
                        {startup.change >= 0 ? (
                          <ArrowUpIcon className="h-3 w-3 text-chart-1" />
                        ) : (
                          <ArrowDownIcon className="h-3 w-3 text-destructive" />
                        )}
                        <span className={startup.change >= 0 ? "text-chart-1" : "text-destructive"}>
                          {Math.abs(startup.change)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Button variant="ghost" size="sm" className="text-xs gap-1">
                  View All Startups
                  <ExternalLinkIcon className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      
      <TabsContent value="transactions" className="mt-0 space-y-6">
        {/* Recent transactions */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>Recent Commission Transactions</CardTitle>
                <CardDescription>
                  Track earnings from individual sales
                </CardDescription>
              </div>
              <div className="w-full sm:w-auto">
                <div className="relative">
                  <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search transactions..."
                    className="pl-9 h-9 w-full sm:w-[250px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-muted/30">
                  <tr>
                    <th scope="col" className="px-4 py-3 rounded-l-md">ID</th>
                    <th scope="col" className="px-4 py-3">Startup</th>
                    <th scope="col" className="px-4 py-3">Product</th>
                    <th scope="col" className="px-4 py-3">Date</th>
                    <th scope="col" className="px-4 py-3">Sale Amount</th>
                    <th scope="col" className="px-4 py-3">Commission</th>
                    <th scope="col" className="px-4 py-3">Rate</th>
                    <th scope="col" className="px-4 py-3 rounded-r-md">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((transaction, index) => (
                      <tr 
                        key={transaction.id} 
                        className={`border-b border-border/30 hover:bg-muted/20 ${
                          index % 2 === 0 ? 'bg-muted/10' : ''
                        }`}
                      >
                        <td className="px-4 py-3">{transaction.id}</td>
                        <td className="px-4 py-3 font-medium">{transaction.startup}</td>
                        <td className="px-4 py-3">{transaction.product}</td>
                        <td className="px-4 py-3">{formatDate(transaction.date)}</td>
                        <td className="px-4 py-3">${transaction.amount.toLocaleString()}</td>
                        <td className="px-4 py-3 font-medium text-chart-4">
                          ${transaction.commission.toLocaleString()}
                        </td>
                        <td className="px-4 py-3">{transaction.rate}%</td>
                        <td className="px-4 py-3">
                          <Badge 
                            variant="outline" 
                            className={transaction.status === "paid" 
                              ? "bg-chart-1/20 text-chart-1 border-chart-1/30" 
                              : "bg-chart-5/20 text-chart-5 border-chart-5/30"}
                          >
                            {transaction.status === "paid" ? (
                              <CheckCircleIcon className="h-3 w-3 mr-1" />
                            ) : (
                              <ClockIcon className="h-3 w-3 mr-1" />
                            )}
                            {transaction.status === "paid" ? "Paid" : "Pending"}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-4 py-6 text-center text-muted-foreground">
                        No transactions found matching your search
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {filteredTransactions.length > 0 && (
              <div className="flex justify-between items-center mt-4">
                <p className="text-xs text-muted-foreground">
                  Showing {filteredTransactions.length} of {recentTransactions.length} transactions
                </p>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <DownloadIcon className="h-3.5 w-3.5" />
                  Export
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="rates" className="mt-0 space-y-6">
        {/* Commission rates analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Rate distribution */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">Rate Distribution</CardTitle>
                <BarChart3Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardDescription>
                Distribution of commission rates across products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={commissionRates}
                    margin={{ top: 20, right: 10, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(214, 221, 230, 0.1)" vertical={false} />
                    <XAxis dataKey="range" tick={{ fill: 'rgba(214, 221, 230, 0.62)' }} />
                    <YAxis tick={{ fill: 'rgba(214, 221, 230, 0.62)' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="count" 
                      name="Products" 
                      radius={[4, 4, 0, 0]}
                    >
                      {commissionRates.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-4 mt-4 justify-center">
                {commissionRates.map((rate, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: rate.color }}></div>
                    <span className="text-xs">
                      {rate.range}: {rate.count} products
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Rate optimization suggestions */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">Rate Optimization</CardTitle>
                <SlidersIcon className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardDescription>
                Suggestions to maximize commission earnings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 rounded-md bg-chart-4/10 border border-chart-4/20">
                  <h4 className="text-sm font-medium flex items-center gap-2 text-chart-4">
                    <TrendingUpIcon className="h-4 w-4" />
                    Growth Opportunity
                  </h4>
                  <p className="text-xs mt-1 text-muted-foreground">
                    TechFlow AI's premium products have potential for a 2% rate increase based on market analysis.
                  </p>
                  <div className="mt-3">
                    <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                      View Proposal
                      <ExternalLinkIcon className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="p-3 rounded-md bg-chart-1/10 border border-chart-1/20">
                  <h4 className="text-sm font-medium flex items-center gap-2 text-chart-1">
                    <PercentIcon className="h-4 w-4" />
                    Rate Benchmark
                  </h4>
                  <p className="text-xs mt-1 text-muted-foreground">
                    Your average rate of 12.5% is 1.2% higher than the platform average for similar support structures.
                  </p>
                </div>
                
                <div className="p-3 rounded-md bg-chart-3/10 border border-chart-3/20">
                  <h4 className="text-sm font-medium flex items-center gap-2 text-chart-3">
                    <LineChartIcon className="h-4 w-4" />
                    Rate Trends
                  </h4>
                  <p className="text-xs mt-1 text-muted-foreground">
                    Your commission rates have shown steady growth of 0.5% per quarter over the past year.
                  </p>
                </div>
                
                <div className="p-3 rounded-md bg-muted/30 border border-muted/50">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <FilterIcon className="h-4 w-4" />
                    Optimization Tool
                  </h4>
                  <p className="text-xs mt-1 text-muted-foreground">
                    Use our commission rate optimizer to analyze your portfolio and identify opportunities.
                  </p>
                  <div className="mt-3">
                    <Button size="sm" className="h-7 text-xs gap-1 bg-chart-4 text-white hover:bg-chart-4/90">
                      Launch Optimizer
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      
      {/* Actions footer */}
      <div className="flex justify-between items-center mt-6">
        <Button variant="outline" size="sm" className="gap-1.5">
          <CalendarIcon className="h-3.5 w-3.5" />
          Schedule Report
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <FilterIcon className="h-3.5 w-3.5" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5">
            <DownloadIcon className="h-3.5 w-3.5" />
            Export
          </Button>
          <Button className="gap-1.5 bg-chart-4 text-white hover:bg-chart-4/90">
            Commission Settings
          </Button>
        </div>
      </div>
    </div>
  );
}