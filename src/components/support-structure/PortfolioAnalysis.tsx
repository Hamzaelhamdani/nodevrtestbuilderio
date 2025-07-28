import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import {
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
  Cell,
  BarChart,
  Bar,
  RadialBarChart,
  RadialBar,
  ComposedChart,
  Area
} from "recharts";
import { 
  ArrowUpIcon, 
  ArrowDownIcon, 
  BarChart3Icon, 
  PieChartIcon,
  LineChartIcon, 
  TrendingUpIcon,
  FilterIcon,
  DownloadIcon,
  InfoIcon,
  CalendarIcon,
  PercentIcon,
  DollarSignIcon,
  UsersIcon,
  ArrowRightIcon,
  RefreshCwIcon
} from "lucide-react";

// Sample performance data for line chart
const performanceData = [
  { month: "Jan", value: 5400 },
  { month: "Feb", value: 6200 },
  { month: "Mar", value: 7800 },
  { month: "Apr", value: 7200 },
  { month: "May", value: 8400 },
  { month: "Jun", value: 9600 },
  { month: "Jul", value: 11200 },
  { month: "Aug", value: 12800 },
  { month: "Sep", value: 14200 },
];

// Sample industry breakdown data for pie chart
const industryData = [
  { name: "SaaS", value: 35, color: "#c1f17e" },
  { name: "FinTech", value: 25, color: "#FF6B00" },
  { name: "HealthTech", value: 15, color: "#8A4FFF" },
  { name: "EdTech", value: 10, color: "#0066FF" },
  { name: "Other", value: 15, color: "#5B6178" }
];

// Sample commission data for bar chart
const commissionData = [
  { month: "Jan", commissions: 540, transactions: 12 },
  { month: "Feb", commissions: 620, transactions: 15 },
  { month: "Mar", commissions: 780, transactions: 18 },
  { month: "Apr", commissions: 720, transactions: 16 },
  { month: "May", commissions: 840, transactions: 20 },
  { month: "Jun", commissions: 960, transactions: 24 },
  { month: "Jul", commissions: 1120, transactions: 28 },
  { month: "Aug", commissions: 1280, transactions: 32 },
  { month: "Sep", commissions: 1420, transactions: 36 },
];

// Sample startup performance data for horizontal bar chart
const startupPerformanceData = [
  { name: "TechFlow AI", revenue: 7800, growth: 32, performance: 95 },
  { name: "BlockVista", revenue: 6200, growth: 24, performance: 87 },
  { name: "MediConnect", revenue: 5400, growth: 18, performance: 82 },
  { name: "EduSpark", revenue: 4100, growth: 15, performance: 79 },
  { name: "GreenLoop", revenue: 3800, growth: 12, performance: 76 },
];

// Sample growth metrics for radial bars
const growthMetricsData = [
  { name: "Revenue", value: 86, fill: "#c1f17e" },
  { name: "Customers", value: 73, fill: "#FF6B00" },
  { name: "Expansion", value: 64, fill: "#8A4FFF" },
  { name: "Retention", value: 92, fill: "#0066FF" },
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
            {entry.name === "Revenue" || entry.name === "Commissions" ? `$${entry.value.toLocaleString()}` : entry.value}
            {entry.name === "Growth" || entry.name === "Performance" ? "%" : ""}
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

export function PortfolioAnalysis() {
  const [timeRange, setTimeRange] = useState("6m");
  const [activeMetric, setActiveMetric] = useState("revenue");
  
  // Select time period handler
  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
    // In a real app, this would fetch data for the selected time range
  };
  
  // Metric selection handler
  const handleMetricChange = (value: string) => {
    setActiveMetric(value);
  };
  
  // Calculate total metrics
  const totalRevenue = performanceData.reduce((sum, item) => sum + item.value, 0);
  const totalCommissions = commissionData.reduce((sum, item) => sum + item.commissions, 0);
  const totalTransactions = commissionData.reduce((sum, item) => sum + item.transactions, 0);
  const averageCommissionRate = Math.round((totalCommissions / totalRevenue) * 100);
  
  // Revenue change percentage (last two months)
  const lastMonth = performanceData[performanceData.length - 1].value;
  const previousMonth = performanceData[performanceData.length - 2].value;
  const revenueChange = Math.round(((lastMonth - previousMonth) / previousMonth) * 100);
  
  return (
    <div className="space-y-6">
      {/* Top metrics cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue Card */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <h3 className="text-2xl font-bold mt-1">${totalRevenue.toLocaleString()}</h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-chart-1/20 flex items-center justify-center">
                <DollarSignIcon className="h-5 w-5 text-chart-1" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-xs">
              <Badge 
                variant="outline" 
                className={`flex items-center gap-1 ${revenueChange >= 0 ? 'bg-chart-1/20 text-chart-1 border-chart-1/30' : 'bg-destructive/20 text-destructive border-destructive/30'}`}
              >
                {revenueChange >= 0 ? (
                  <ArrowUpIcon className="h-3 w-3" />
                ) : (
                  <ArrowDownIcon className="h-3 w-3" />
                )}
                {Math.abs(revenueChange)}% from last month
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        {/* Commissions Card */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Commissions</p>
                <h3 className="text-2xl font-bold mt-1">${totalCommissions.toLocaleString()}</h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-chart-4/20 flex items-center justify-center">
                <PercentIcon className="h-5 w-5 text-chart-4" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-xs">
              <Badge variant="outline" className="bg-muted text-muted-foreground border-muted/30">
                Avg. Commission Rate: {averageCommissionRate}%
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        {/* Startups Card */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Startups</p>
                <h3 className="text-2xl font-bold mt-1">{startupPerformanceData.length}</h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-chart-3/20 flex items-center justify-center">
                <UsersIcon className="h-5 w-5 text-chart-3" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-xs">
              <Badge variant="outline" className="bg-chart-3/20 text-chart-3 border-chart-3/30 flex items-center gap-1">
                <TrendingUpIcon className="h-3 w-3" />
                2 new this month
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        {/* Transactions Card */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Transactions</p>
                <h3 className="text-2xl font-bold mt-1">{totalTransactions}</h3>
              </div>
              <div className="h-10 w-10 rounded-full bg-chart-5/20 flex items-center justify-center">
                <BarChart3Icon className="h-5 w-5 text-chart-5" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-xs">
              <Badge variant="outline" className="bg-chart-5/20 text-chart-5 border-chart-5/30 flex items-center gap-1">
                <ArrowUpIcon className="h-3 w-3" />
                12% increase
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Time period selector */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-medium">Portfolio Analytics</h3>
        <div className="flex gap-2 items-center">
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          <select 
            value={timeRange}
            onChange={(e) => handleTimeRangeChange(e.target.value)}
            className="bg-muted text-sm py-1 px-2 rounded-md border-border outline-none"
          >
            {timePeriods.map((period) => (
              <option key={period.value} value={period.value}>
                {period.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Main performance chart card */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Performance Analysis</CardTitle>
          <CardDescription>
            Comprehensive analytics for your startup portfolio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={performanceData}
                margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(214, 221, 230, 0.1)" />
                <XAxis dataKey="month" tick={{ fill: 'rgba(214, 221, 230, 0.62)' }} />
                <YAxis tick={{ fill: 'rgba(214, 221, 230, 0.62)' }} />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  name="Revenue"
                  stroke="#c1f17e" 
                  strokeWidth={2} 
                  dot={{ stroke: '#c1f17e', strokeWidth: 2, r: 4 }} 
                  activeDot={{ stroke: '#c1f17e', strokeWidth: 2, r: 6, fill: '#c1f17e' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {/* Metrics tabs for interactive filtering */}
          <div className="mt-6">
            <Tabs defaultValue="revenue" onValueChange={handleMetricChange} className="w-full">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="revenue" className="text-xs">Revenue</TabsTrigger>
                <TabsTrigger value="commissions" className="text-xs">Commissions</TabsTrigger>
                <TabsTrigger value="growth" className="text-xs">Growth Rates</TabsTrigger>
                <TabsTrigger value="startups" className="text-xs">Startups</TabsTrigger>
              </TabsList>
              
              <TabsContent value="revenue" className="mt-0">
                <p className="text-sm text-muted-foreground mb-2">
                  Revenue breakdown shows your portfolio's financial performance over time
                </p>
              </TabsContent>
              
              <TabsContent value="commissions" className="mt-0">
                <p className="text-sm text-muted-foreground mb-2">
                  Commission data shows your earnings from startup sales
                </p>
              </TabsContent>
              
              <TabsContent value="growth" className="mt-0">
                <p className="text-sm text-muted-foreground mb-2">
                  Growth metrics track the percentage increase in key areas
                </p>
              </TabsContent>
              
              <TabsContent value="startups" className="mt-0">
                <p className="text-sm text-muted-foreground mb-2">
                  Startup performance compares individual companies in your portfolio
                </p>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
      
      {/* Additional charts grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Industry Breakdown Pie Chart */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base">Portfolio by Industry</CardTitle>
              <PieChartIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardDescription>
              Revenue distribution across industry segments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={industryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    innerRadius={40}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {industryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-2 mt-2 justify-center">
              {industryData.map((industry, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="flex items-center gap-1"
                  style={{ backgroundColor: `${industry.color}20`, color: industry.color, borderColor: `${industry.color}30` }}
                >
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: industry.color }}></div>
                  {industry.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Commission Trends Bar Chart */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base">Commission Trends</CardTitle>
              <BarChart3Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardDescription>
              Monthly commission earnings and transaction volume
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={commissionData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(214, 221, 230, 0.1)" />
                  <XAxis dataKey="month" tick={{ fill: 'rgba(214, 221, 230, 0.62)' }} />
                  <YAxis yAxisId="left" tick={{ fill: 'rgba(214, 221, 230, 0.62)' }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fill: 'rgba(214, 221, 230, 0.62)' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    yAxisId="left" 
                    dataKey="commissions" 
                    name="Commissions" 
                    fill="#FF6B00" 
                    barSize={20} 
                    radius={[4, 4, 0, 0]} 
                  />
                  <Line 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="transactions" 
                    name="Transactions" 
                    stroke="#8A4FFF" 
                    strokeWidth={2} 
                    dot={{ fill: '#8A4FFF', stroke: '#8A4FFF', r: 4 }} 
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-chart-4"></div>
                <span className="text-xs text-muted-foreground">Commissions ($)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-chart-3"></div>
                <span className="text-xs text-muted-foreground">Transactions (count)</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Startup Performance Horizontal Bar Chart */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base">Top Performing Startups</CardTitle>
              <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardDescription>
              Revenue and growth metrics by startup
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={startupPerformanceData}
                  margin={{ top: 10, right: 10, left: 70, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(214, 221, 230, 0.1)" horizontal={true} vertical={false} />
                  <XAxis type="number" tick={{ fill: 'rgba(214, 221, 230, 0.62)' }} />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    tick={{ fill: 'rgba(214, 221, 230, 0.62)' }} 
                    width={70}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="performance" 
                    name="Performance" 
                    fill="#c1f17e" 
                    barSize={8} 
                    radius={4}
                  />
                  <Bar 
                    dataKey="revenue" 
                    name="Revenue" 
                    fill="#0066FF" 
                    barSize={8} 
                    radius={4}
                  />
                  <Bar 
                    dataKey="growth" 
                    name="Growth" 
                    fill="#FF6B00" 
                    barSize={8} 
                    radius={4}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-chart-1"></div>
                <span className="text-xs text-muted-foreground">Performance Score</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-chart-5"></div>
                <span className="text-xs text-muted-foreground">Revenue ($K)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-chart-4"></div>
                <span className="text-xs text-muted-foreground">Growth Rate (%)</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Growth Metrics Radial Chart */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base">Growth Metrics</CardTitle>
              <LineChartIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardDescription>
              Key performance indicators for your portfolio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart 
                  cx="50%" 
                  cy="50%" 
                  innerRadius="20%" 
                  outerRadius="80%" 
                  barSize={12} 
                  data={growthMetricsData}
                  startAngle={180} 
                  endAngle={0}
                >
                  <RadialBar
                    background
                    clockWise
                    dataKey="value"
                    cornerRadius={10}
                    label={{ fill: '#d6dde6', position: 'insideStart', offset: 10 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-2 mt-2 justify-center">
              {growthMetricsData.map((metric, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="flex items-center gap-1"
                  style={{ backgroundColor: `${metric.fill}20`, color: metric.fill, borderColor: `${metric.fill}30` }}
                >
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: metric.fill }}></div>
                  {metric.name}: {metric.value}%
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Action buttons for the portfolio analysis */}
      <div className="flex justify-between items-center mt-6">
        <Button variant="outline" size="sm" className="gap-1.5">
          <RefreshCwIcon className="h-3.5 w-3.5" />
          Refresh Data
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
            Full Analysis
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}