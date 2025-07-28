
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Avatar } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { 
  TrendingUp, 
  Users, 
  Activity, 
  DollarSign, 
  Calendar, 
  BarChart2, 
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Plus,
  MoreHorizontal,
  Download,
  Filter
} from "lucide-react";

// Sample data for incubator dashboard
const incubatorData = {
  name: "TechStars Accelerator",
  totalStartups: 24,
  activeStartups: 18,
  totalRevenue: 125680,
  commission: 8756,
  monthlySales: [
    { month: "Jan", sales: 14200 },
    { month: "Feb", sales: 16800 },
    { month: "Mar", sales: 15900 },
    { month: "Apr", sales: 18600 },
    { month: "May", sales: 21200 },
    { month: "Jun", sales: 19800 },
    { month: "Jul", sales: 22500 },
    { month: "Aug", sales: 25680 }
  ],
  startupPerformance: [
    { name: "Quantum Analytics", share: 32 },
    { name: "DevFlow", share: 28 },
    { name: "EcoPackage", share: 18 },
    { name: "MarketPulse", share: 12 },
    { name: "Others", share: 10 }
  ]
};

// Sample supported startups
const supportedStartups = [
  {
    id: 1,
    name: "Quantum Analytics",
    logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=300&h=300&fit=crop&q=80",
    category: "SaaS Tools",
    monthlyRevenue: 42560,
    monthlyGrowth: 12.5,
    status: "active"
  },
  {
    id: 2,
    name: "DevFlow",
    logo: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=300&h=300&fit=crop&q=80",
    category: "Development",
    monthlyRevenue: 38240,
    monthlyGrowth: 8.3,
    status: "active"
  },
  {
    id: 3,
    name: "EcoPackage",
    logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=300&h=300&fit=crop&q=80",
    category: "Packaging",
    monthlyRevenue: 24600,
    monthlyGrowth: -2.1,
    status: "active"
  },
  {
    id: 4,
    name: "MarketPulse",
    logo: "https://images.unsplash.com/photo-1669570094762-828f3dfaf675?w=300&h=300&fit=crop&q=80",
    category: "Marketing",
    monthlyRevenue: 16480,
    monthlyGrowth: 5.7,
    status: "active"
  },
  {
    id: 5,
    name: "Fintech Pro",
    logo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=300&fit=crop&q=80",
    category: "Finance",
    monthlyRevenue: 3800,
    monthlyGrowth: 22.4,
    status: "recent"
  },
  {
    id: 6,
    name: "HealthTrack",
    logo: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=300&h=300&fit=crop&q=80",
    category: "Health",
    monthlyRevenue: 0,
    monthlyGrowth: 0,
    status: "inactive"
  }
];

export function IncubatorDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  
  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">{incubatorData.name} Dashboard</h1>
            <p className="text-foreground/70">
              Manage your startups and track their performance
            </p>
          </div>
          
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button variant="outline" className="gap-1">
              <Download size={16} />
              Export
            </Button>
            <Button className="gap-1 bg-electricBlue hover:bg-electricBlue/90">
              <Plus size={16} />
              Add Startup
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="startups">Startups</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="promotion">Promotion</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Startups</CardTitle>
                  <Users size={16} className="text-foreground/70" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{incubatorData.totalStartups}</div>
                  <p className="text-xs text-foreground/70 mt-1">
                    <span className="text-limeGreen font-medium">+2</span> from last month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Active Startups</CardTitle>
                  <Activity size={16} className="text-foreground/70" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{incubatorData.activeStartups}</div>
                  <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                    <div 
                      className="bg-electricBlue h-1.5 rounded-full" 
                      style={{ width: `${(incubatorData.activeStartups / incubatorData.totalStartups) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-foreground/70 mt-1">
                    {Math.round((incubatorData.activeStartups / incubatorData.totalStartups) * 100)}% active rate
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign size={16} className="text-foreground/70" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${incubatorData.totalRevenue.toLocaleString()}</div>
                  <p className="text-xs text-foreground/70 mt-1">
                    <span className="text-limeGreen font-medium">+14.2%</span> from last month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Your Commission</CardTitle>
                  <TrendingUp size={16} className="text-foreground/70" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${incubatorData.commission.toLocaleString()}</div>
                  <p className="text-xs text-foreground/70 mt-1">
                    <span className="text-limeGreen font-medium">+8.5%</span> from last month
                  </p>
                </CardContent>
              </Card>
            </div>
            
            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="md:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base font-medium">Monthly Sales</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Calendar size={14} className="mr-1" />
                      This Year
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal size={16} />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-64 relative">
                    {/* Simple chart visualization */}
                    <div className="absolute inset-0 flex items-end">
                      {incubatorData.monthlySales.map((month, index) => (
                        <div 
                          key={index} 
                          className="flex-1 flex flex-col items-center"
                        >
                          <div 
                            className="w-5/6 bg-electricBlue/15 rounded-t-sm hover:bg-electricBlue/25 transition-colors cursor-pointer relative group"
                            style={{ 
                              height: `${(month.sales / Math.max(...incubatorData.monthlySales.map(m => m.sales))) * 100}%` 
                            }}
                          >
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                              ${month.sales.toLocaleString()}
                            </div>
                          </div>
                          <span className="text-xs mt-2 text-foreground/70">{month.month}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base font-medium">Startup Performance</CardTitle>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal size={16} />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="h-64 relative flex items-center justify-center">
                    {/* Simple pie chart visualization */}
                    <div className="w-40 h-40 rounded-full bg-muted relative overflow-hidden">
                      {incubatorData.startupPerformance.map((startup, index) => {
                        const previousSegments = incubatorData.startupPerformance
                          .slice(0, index)
                          .reduce((acc, curr) => acc + curr.share, 0);
                        
                        return (
                          <div
                            key={index}
                            className="absolute inset-0 origin-center"
                            style={{
                              backgroundColor: [
                                'rgb(0, 102, 255)', // electricBlue
                                'rgb(142, 36, 170)', // warmPurple
                                'rgb(0, 230, 118)', // limeGreen
                                'rgb(255, 159, 64)',
                                'rgb(128, 128, 128)'
                              ][index],
                              clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos(2 * Math.PI * (previousSegments + startup.share) / 100)}% ${50 - 50 * Math.sin(2 * Math.PI * (previousSegments + startup.share) / 100)}%, ${50 + 50 * Math.cos(2 * Math.PI * previousSegments / 100)}% ${50 - 50 * Math.sin(2 * Math.PI * previousSegments / 100)}%)`
                            }}
                          ></div>
                        );
                      })}
                    </div>
                    
                    <div className="absolute bottom-0 w-full">
                      <div className="grid grid-cols-2 gap-2">
                        {incubatorData.startupPerformance.map((startup, index) => (
                          <div key={index} className="flex items-center gap-1">
                            <div 
                              className="w-2 h-2 rounded-full" 
                              style={{ 
                                backgroundColor: [
                                  'rgb(0, 102, 255)', // electricBlue
                                  'rgb(142, 36, 170)', // warmPurple
                                  'rgb(0, 230, 118)', // limeGreen
                                  'rgb(255, 159, 64)',
                                  'rgb(128, 128, 128)'
                                ][index] 
                              }}
                            ></div>
                            <span className="text-xs truncate">{startup.name}</span>
                            <span className="text-xs text-foreground/70">{startup.share}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Recent Startups */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base font-medium">Top Performing Startups</CardTitle>
                <Button variant="ghost">View All</Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {supportedStartups.slice(0, 4).map((startup) => (
                    <div key={startup.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-border">
                          <ImageWithFallback
                            src={startup.logo}
                            alt={startup.name}
                            width={36}
                            height={36}
                          />
                        </Avatar>
                        <div>
                          <div className="font-medium">{startup.name}</div>
                          <div className="text-xs text-foreground/70">{startup.category}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="font-medium">${startup.monthlyRevenue.toLocaleString()}</div>
                          <div className="text-xs flex items-center justify-end gap-1">
                            {startup.monthlyGrowth > 0 ? (
                              <>
                                <ArrowUpRight size={12} className="text-limeGreen" />
                                <span className="text-limeGreen">{startup.monthlyGrowth}%</span>
                              </>
                            ) : (
                              <>
                                <ArrowDownRight size={12} className="text-destructive" />
                                <span className="text-destructive">{Math.abs(startup.monthlyGrowth)}%</span>
                              </>
                            )}
                          </div>
                        </div>
                        
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="startups">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div className="relative w-full md:w-64">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50" />
                <input 
                  type="text" 
                  placeholder="Search startups..." 
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-electricBlue"
                />
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" className="gap-1">
                  <Filter size={16} />
                  Filter
                </Button>
                <Button variant="outline">Sort By: Revenue</Button>
                <Button className="bg-electricBlue hover:bg-electricBlue/90">
                  <Plus size={16} className="mr-1" />
                  Add Startup
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {supportedStartups.map((startup) => (
                <Card key={startup.id} className="overflow-hidden">
                  <div className="bg-gradient-to-r from-electricBlue/10 to-warmPurple/10 p-4 flex items-center gap-4">
                    <Avatar className="h-14 w-14 rounded-xl border-2 border-white">
                      <ImageWithFallback
                        src={startup.logo}
                        alt={startup.name}
                        width={56}
                        height={56}
                      />
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{startup.name}</h3>
                      <Badge variant="outline">{startup.category}</Badge>
                    </div>
                    
                    <Button variant="ghost" size="icon" className="h-8 w-8 ml-auto">
                      <MoreHorizontal size={16} />
                    </Button>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-foreground/70 mb-1">Monthly Revenue</p>
                        <p className="font-semibold">
                          ${startup.monthlyRevenue.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-foreground/70 mb-1">Growth</p>
                        <div className="flex items-center gap-1">
                          {startup.monthlyGrowth > 0 ? (
                            <>
                              <ArrowUpRight size={16} className="text-limeGreen" />
                              <span className="text-limeGreen font-semibold">{startup.monthlyGrowth}%</span>
                            </>
                          ) : startup.monthlyGrowth < 0 ? (
                            <>
                              <ArrowDownRight size={16} className="text-destructive" />
                              <span className="text-destructive font-semibold">{Math.abs(startup.monthlyGrowth)}%</span>
                            </>
                          ) : (
                            <span className="text-foreground/70">0%</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            startup.status === 'active' 
                              ? 'bg-limeGreen' 
                              : startup.status === 'recent' 
                                ? 'bg-electricBlue' 
                                : 'bg-foreground/30'
                          }`}
                          style={{ width: startup.status === 'inactive' ? '10%' : '70%' }}
                        ></div>
                      </div>
                      <Badge 
                        className={`${
                          startup.status === 'active' 
                            ? 'bg-limeGreen/10 text-limeGreen hover:bg-limeGreen/20' 
                            : startup.status === 'recent' 
                              ? 'bg-electricBlue/10 text-electricBlue hover:bg-electricBlue/20' 
                              : 'bg-foreground/10 text-foreground/70 hover:bg-foreground/20'
                        }`}
                      >
                        {startup.status === 'active' 
                          ? 'Active' 
                          : startup.status === 'recent' 
                            ? 'Recent' 
                            : 'Inactive'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Button variant="outline" size="sm">
                        Analytics
                      </Button>
                      <Button size="sm" className="bg-electricBlue hover:bg-electricBlue/90">
                        Promote
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="analytics">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Performance Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-foreground/70">
                  <BarChart2 size={64} className="mx-auto mb-4 opacity-30" />
                  <p>Advanced analytics dashboard coming soon.</p>
                  <Button className="mt-4 bg-electricBlue hover:bg-electricBlue/90">
                    Join Waitlist
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="promotion">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Promotional Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-foreground/70">
                  <PieChart size={64} className="mx-auto mb-4 opacity-30" />
                  <p>Promotional tools and campaign management coming soon.</p>
                  <Button className="mt-4 bg-electricBlue hover:bg-electricBlue/90">
                    Join Waitlist
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
