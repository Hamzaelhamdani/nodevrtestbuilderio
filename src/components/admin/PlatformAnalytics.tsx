import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";

const COLORS = ['#c1f17e', '#8A4FFF', '#FF6B00', '#0066FF', '#a7ee43'];

// Sample data for charts
const revenueData = [
  { name: 'Jan', total: 18200 },
  { name: 'Feb', total: 22100 },
  { name: 'Mar', total: 19500 },
  { name: 'Apr', total: 25300 },
  { name: 'May', total: 28900 },
  { name: 'Jun', total: 34800 },
  { name: 'Jul', total: 42100 },
  { name: 'Aug', total: 39500 },
  { name: 'Sep', total: 47300 },
  { name: 'Oct', total: 52100 },
  { name: 'Nov', total: 58900 },
  { name: 'Dec', total: 67400 }
];

const categoryData = [
  { name: 'SaaS & Technology', value: 35 },
  { name: 'Health & Biotech', value: 20 },
  { name: 'Fintech', value: 18 },
  { name: 'E-commerce', value: 15 },
  { name: 'Other', value: 12 }
];

const userGrowthData = [
  { name: 'Jan', startups: 18, clients: 45, supports: 7 },
  { name: 'Feb', startups: 24, clients: 52, supports: 9 },
  { name: 'Mar', startups: 31, clients: 61, supports: 12 },
  { name: 'Apr', startups: 38, clients: 77, supports: 13 },
  { name: 'May', startups: 42, clients: 91, supports: 15 },
  { name: 'Jun', startups: 51, clients: 105, supports: 18 }
];

const platformUsageData = [
  { subject: 'Marketplace', A: 92, fullMark: 100 },
  { subject: 'Chat', A: 78, fullMark: 100 },
  { subject: 'Payments', A: 86, fullMark: 100 },
  { subject: 'Storefront', A: 89, fullMark: 100 },
  { subject: 'Analytics', A: 65, fullMark: 100 },
  { subject: 'Community', A: 72, fullMark: 100 }
];

const quarterlyConversionsData = [
  { name: 'Q1', freeTrial: 85, directPurchase: 35, referral: 20 },
  { name: 'Q2', freeTrial: 102, directPurchase: 48, referral: 28 },
  { name: 'Q3', freeTrial: 125, directPurchase: 52, referral: 32 },
  { name: 'Q4', freeTrial: 150, directPurchase: 61, referral: 41 }
];

export function PlatformAnalytics() {
  const [timeRange, setTimeRange] = useState('year');
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold mb-1">Platform Analytics</h2>
          <p className="text-muted-foreground">
            Track platform metrics, user activity, and financial performance
          </p>
        </div>
        
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">Last 30 Days</SelectItem>
            <SelectItem value="quarter">Last Quarter</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 h-auto p-1">
          <TabsTrigger value="revenue" className="py-2">Revenue</TabsTrigger>
          <TabsTrigger value="users" className="py-2">User Growth</TabsTrigger>
          <TabsTrigger value="engagement" className="py-2">Engagement</TabsTrigger>
          <TabsTrigger value="categories" className="py-2">Categories</TabsTrigger>
        </TabsList>
        
        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Monthly platform revenue in USD</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={revenueData}
                      margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                    >
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#c1f17e" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#c1f17e" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(214, 221, 230, 0.1)" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fill: 'rgba(214, 221, 230, 0.62)' }} 
                        tickLine={{ stroke: 'rgba(214, 221, 230, 0.1)' }}
                        axisLine={{ stroke: 'rgba(214, 221, 230, 0.1)' }}
                      />
                      <YAxis 
                        tick={{ fill: 'rgba(214, 221, 230, 0.62)' }}
                        tickFormatter={(value) => `$${value}`}
                        tickLine={{ stroke: 'rgba(214, 221, 230, 0.1)' }}
                        axisLine={{ stroke: 'rgba(214, 221, 230, 0.1)' }}
                      />
                      <Tooltip 
                        formatter={(value) => [`$${value}`, 'Revenue']}
                        contentStyle={{ 
                          backgroundColor: '#1e1e1e', 
                          borderColor: 'rgba(214, 221, 230, 0.2)',
                          color: '#d6dde6' 
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="total" 
                        stroke="#c1f17e" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorRevenue)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Conversion Channels</CardTitle>
                <CardDescription>Revenue sources by quarter</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={quarterlyConversionsData}
                      margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(214, 221, 230, 0.1)" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fill: 'rgba(214, 221, 230, 0.62)' }}
                        tickLine={{ stroke: 'rgba(214, 221, 230, 0.1)' }}
                        axisLine={{ stroke: 'rgba(214, 221, 230, 0.1)' }}
                      />
                      <YAxis 
                        tick={{ fill: 'rgba(214, 221, 230, 0.62)' }}
                        tickLine={{ stroke: 'rgba(214, 221, 230, 0.1)' }}
                        axisLine={{ stroke: 'rgba(214, 221, 230, 0.1)' }}
                      />
                      <Tooltip
                        contentStyle={{ 
                          backgroundColor: '#1e1e1e', 
                          borderColor: 'rgba(214, 221, 230, 0.2)',
                          color: '#d6dde6' 
                        }}
                      />
                      <Legend />
                      <Bar dataKey="freeTrial" name="Free Trial" stackId="a" fill="#c1f17e" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="directPurchase" name="Direct" stackId="a" fill="#8A4FFF" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="referral" name="Referral" stackId="a" fill="#FF6B00" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* User Growth Tab */}
        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>New users by category</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={userGrowthData}
                      margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                    >
                      <defs>
                        <linearGradient id="colorStartups" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#c1f17e" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#c1f17e" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="colorClients" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8A4FFF" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8A4FFF" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="colorSupports" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#FF6B00" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(214, 221, 230, 0.1)" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fill: 'rgba(214, 221, 230, 0.62)' }}
                        tickLine={{ stroke: 'rgba(214, 221, 230, 0.1)' }}
                        axisLine={{ stroke: 'rgba(214, 221, 230, 0.1)' }}
                      />
                      <YAxis 
                        tick={{ fill: 'rgba(214, 221, 230, 0.62)' }}
                        tickLine={{ stroke: 'rgba(214, 221, 230, 0.1)' }}
                        axisLine={{ stroke: 'rgba(214, 221, 230, 0.1)' }}
                      />
                      <Tooltip
                        contentStyle={{ 
                          backgroundColor: '#1e1e1e', 
                          borderColor: 'rgba(214, 221, 230, 0.2)',
                          color: '#d6dde6' 
                        }}
                      />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="startups" 
                        name="Startups"
                        stroke="#c1f17e" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorStartups)" 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="clients" 
                        name="Clients"
                        stroke="#8A4FFF" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorClients)" 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="supports" 
                        name="Support Structures"
                        stroke="#FF6B00" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorSupports)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Platform Usage</CardTitle>
                <CardDescription>Feature usage metrics</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart 
                      cx="50%" 
                      cy="50%" 
                      outerRadius="80%" 
                      data={platformUsageData}
                    >
                      <PolarGrid stroke="rgba(214, 221, 230, 0.1)" />
                      <PolarAngleAxis 
                        dataKey="subject" 
                        tick={{ fill: 'rgba(214, 221, 230, 0.8)' }} 
                      />
                      <PolarRadiusAxis 
                        angle={30} 
                        domain={[0, 100]} 
                        tick={{ fill: 'rgba(214, 221, 230, 0.62)' }} 
                      />
                      <Radar 
                        name="Usage %" 
                        dataKey="A" 
                        stroke="#c1f17e" 
                        fill="#c1f17e" 
                        fillOpacity={0.5} 
                      />
                      <Tooltip
                        formatter={(value) => [`${value}%`, 'Usage']}
                        contentStyle={{ 
                          backgroundColor: '#1e1e1e', 
                          borderColor: 'rgba(214, 221, 230, 0.2)',
                          color: '#d6dde6' 
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Engagement Tab */}
        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>User Engagement</CardTitle>
                <CardDescription>Daily active users by type</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { date: '1', startups: 32, structures: 12, clients: 53 },
                        { date: '5', startups: 40, structures: 14, clients: 61 },
                        { date: '10', startups: 38, structures: 11, clients: 59 },
                        { date: '15', startups: 45, structures: 15, clients: 67 },
                        { date: '20', startups: 52, structures: 18, clients: 72 },
                        { date: '25', startups: 49, structures: 16, clients: 70 },
                        { date: '30', startups: 55, structures: 19, clients: 78 }
                      ]}
                      margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(214, 221, 230, 0.1)" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fill: 'rgba(214, 221, 230, 0.62)' }}
                        tickLine={{ stroke: 'rgba(214, 221, 230, 0.1)' }}
                        axisLine={{ stroke: 'rgba(214, 221, 230, 0.1)' }}
                        label={{ value: 'Day of Month', position: 'insideBottom', offset: -15, fill: 'rgba(214, 221, 230, 0.62)' }}
                      />
                      <YAxis 
                        tick={{ fill: 'rgba(214, 221, 230, 0.62)' }}
                        tickLine={{ stroke: 'rgba(214, 221, 230, 0.1)' }}
                        axisLine={{ stroke: 'rgba(214, 221, 230, 0.1)' }}
                        label={{ value: 'Active Users', angle: -90, position: 'insideLeft', fill: 'rgba(214, 221, 230, 0.62)' }}
                      />
                      <Tooltip
                        contentStyle={{ 
                          backgroundColor: '#1e1e1e', 
                          borderColor: 'rgba(214, 221, 230, 0.2)',
                          color: '#d6dde6' 
                        }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="startups" 
                        name="Startups" 
                        stroke="#c1f17e" 
                        activeDot={{ r: 8 }} 
                        strokeWidth={2} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="structures" 
                        name="Support Structures" 
                        stroke="#FF6B00" 
                        strokeWidth={2} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="clients" 
                        name="Clients" 
                        stroke="#8A4FFF" 
                        strokeWidth={2} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Session Metrics</CardTitle>
                <CardDescription>Average time spent</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    { label: 'Startups', value: '12m 30s', change: '+18%', color: '#c1f17e' },
                    { label: 'Support Structures', value: '15m 45s', change: '+5%', color: '#FF6B00' },
                    { label: 'Clients', value: '8m 15s', change: '+12%', color: '#8A4FFF' },
                  ].map((item) => (
                    <div key={item.label} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{item.label}</span>
                        <div className="flex items-center">
                          <span className="font-medium mr-2">{item.value}</span>
                          <span className="text-xs text-success">{item.change}</span>
                        </div>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all" 
                          style={{ 
                            width: item.label === 'Startups' 
                              ? '65%' 
                              : item.label === 'Support Structures'
                                ? '82%'
                                : '42%',
                            backgroundColor: item.color
                          }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 pt-4 border-t border-border">
                  <h4 className="font-medium mb-3">Feature Engagement</h4>
                  <div className="space-y-4">
                    {[
                      { label: 'Marketplace Browsing', value: '85%' },
                      { label: 'Chat Usage', value: '62%' },
                      { label: 'Storefront Customization', value: '74%' },
                      { label: 'Analytics Dashboard', value: '58%' },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between">
                        <span className="text-sm">{item.label}</span>
                        <span className="text-sm font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Startup Categories</CardTitle>
                <CardDescription>Distribution by industry</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[350px] w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={120}
                        fill="#8884d8"
                        paddingAngle={2}
                        dataKey="value"
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`${value}%`, 'Percentage']}
                        contentStyle={{ 
                          backgroundColor: '#1e1e1e', 
                          borderColor: 'rgba(214, 221, 230, 0.2)',
                          color: '#d6dde6' 
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Category</CardTitle>
                <CardDescription>Revenue distribution</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'SaaS & Tech', value: 42500 },
                        { name: 'Health & Bio', value: 31200 },
                        { name: 'Fintech', value: 38700 },
                        { name: 'E-commerce', value: 25600 },
                        { name: 'Other', value: 18900 }
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(214, 221, 230, 0.1)" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fill: 'rgba(214, 221, 230, 0.62)' }}
                        tickLine={{ stroke: 'rgba(214, 221, 230, 0.1)' }}
                        axisLine={{ stroke: 'rgba(214, 221, 230, 0.1)' }}
                      />
                      <YAxis 
                        tick={{ fill: 'rgba(214, 221, 230, 0.62)' }}
                        tickFormatter={(value) => `$${value}`}
                        tickLine={{ stroke: 'rgba(214, 221, 230, 0.1)' }}
                        axisLine={{ stroke: 'rgba(214, 221, 230, 0.1)' }}
                      />
                      <Tooltip
                        formatter={(value) => [`$${value}`, 'Revenue']}
                        contentStyle={{ 
                          backgroundColor: '#1e1e1e', 
                          borderColor: 'rgba(214, 221, 230, 0.2)',
                          color: '#d6dde6' 
                        }}
                      />
                      <Bar 
                        dataKey="value" 
                        name="Revenue" 
                        fill="#8A4FFF" 
                        radius={[4, 4, 0, 0]} 
                        barSize={50}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}