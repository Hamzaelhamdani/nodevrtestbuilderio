import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "../ui/tabs";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "../ui/card";
import {
  BriefcaseIcon,
  BuildingIcon,
  ShieldIcon,
  UserIcon,
  ChartBarIcon,
  LineChartIcon,
  BarChart3Icon,
  PieChartIcon,
  UsersIcon,
  PackageIcon,
  LayersIcon,
  PercentIcon,
  BellIcon,
  SettingsIcon,
  CreditCardIcon,
  MessageSquareIcon,
  ActivityIcon,
  ListIcon,
  CheckSquareIcon,
  ClipboardIcon
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";

export function DashboardOverview() {
  const [activeTab, setActiveTab] = useState("startup");

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <h1 className="mb-3">VenturesRoom Dashboard Features</h1>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Explore the powerful features available across different user roles in the VenturesRoom platform.
          Each dashboard is tailored to the specific needs of startups, support structures, administrators, and clients.
        </p>
      </div>

      <Tabs
        defaultValue="startup"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-4 mb-8 w-full max-w-3xl mx-auto">
          <TabsTrigger value="startup" className="flex items-center gap-2">
            <BriefcaseIcon className="h-4 w-4 text-tertiary" />
            Startup
          </TabsTrigger>
          <TabsTrigger value="support" className="flex items-center gap-2">
            <BuildingIcon className="h-4 w-4 text-chart-4" />
            Support Structure
          </TabsTrigger>
          <TabsTrigger value="admin" className="flex items-center gap-2">
            <ShieldIcon className="h-4 w-4 text-destructive" />
            Admin
          </TabsTrigger>
          <TabsTrigger value="client" className="flex items-center gap-2">
            <UserIcon className="h-4 w-4 text-chart-5" />
            Client
          </TabsTrigger>
        </TabsList>

        {/* Startup Dashboard Features */}
        <TabsContent value="startup" className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Data Visualization */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <ChartBarIcon className="h-5 w-5 text-tertiary" />
                    Data Visualization
                  </CardTitle>
                  <Badge variant="outline" className="bg-tertiary/10 text-tertiary border-tertiary/20">
                    Analytics
                  </Badge>
                </div>
                <CardDescription>
                  Track your business performance with interactive charts and metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-muted/20">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">Revenue Summary</h4>
                        <LineChartIcon className="h-4 w-4 text-primary" />
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-xs text-muted-foreground">
                        View revenue trends, sales forecasts, and financial metrics in the SalesChart and RevenueSummary components
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-muted/20">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">Product Analytics</h4>
                        <BarChart3Icon className="h-4 w-4 text-chart-4" />
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-xs text-muted-foreground">
                        Monitor product performance, view ratings, and track engagement metrics
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="relative h-32 w-full rounded-md overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-tertiary/20 to-primary/10 flex items-center justify-center">
                    <div className="text-center">
                      <PieChartIcon className="h-8 w-8 text-tertiary/50 mx-auto mb-2" />
                      <p className="text-sm">Interactive dashboard charts</p>
                      <p className="text-xs text-muted-foreground">Sales, orders, and customer metrics</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-xs text-muted-foreground w-full">
                  Located in: <code className="bg-muted/30 px-1 py-0.5 rounded text-xs">/components/startup/SalesChart.tsx</code> and <code className="bg-muted/30 px-1 py-0.5 rounded text-xs">/components/startup/RevenueSummary.tsx</code>
                </p>
              </CardFooter>
            </Card>

            {/* Product Management */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <PackageIcon className="h-5 w-5 text-primary" />
                    Product Management
                  </CardTitle>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    Core Feature
                  </Badge>
                </div>
                <CardDescription>
                  Create and manage your products and services
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <LayersIcon className="h-3 w-3 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Multi-step Product Creation</p>
                      <p className="text-xs text-muted-foreground">Create physical, digital, service, or subscription products with detailed attributes</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <PercentIcon className="h-3 w-3 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Commission Management</p>
                      <p className="text-xs text-muted-foreground">Set commission rates for support structures that promote your products</p>
                    </div>
                  </li>
                </ul>

                <div className="relative h-32 w-full rounded-md overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-chart-4/10 flex items-center justify-center">
                    <div className="text-center">
                      <div className="flex justify-center gap-2 mb-2">
                        <div className="h-6 w-6 rounded-md bg-background/80 flex items-center justify-center">
                          <PackageIcon className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <div className="h-6 w-6 rounded-md bg-background/80 flex items-center justify-center">
                          <CreditCardIcon className="h-3.5 w-3.5 text-chart-4" />
                        </div>
                        <div className="h-6 w-6 rounded-md bg-background/80 flex items-center justify-center">
                          <MessageSquareIcon className="h-3.5 w-3.5 text-tertiary" />
                        </div>
                      </div>
                      <p className="text-sm">Complete Product Lifecycle</p>
                      <p className="text-xs text-muted-foreground">Creation, management, analytics, and customer feedback</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-xs text-muted-foreground w-full">
                  Located in: <code className="bg-muted/30 px-1 py-0.5 rounded text-xs">/components/startup/ProductServiceCreation.tsx</code> and related files
                </p>
              </CardFooter>
            </Card>

            {/* Support Structure Management */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BuildingIcon className="h-5 w-5 text-chart-4" />
                    Support Structure Management
                  </CardTitle>
                  <Badge variant="outline" className="bg-chart-4/10 text-chart-4 border-chart-4/20">
                    Partnership
                  </Badge>
                </div>
                <CardDescription>
                  Manage relationships with incubators and accelerators
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-md bg-muted/20 border border-border/50">
                    <div className="flex items-center gap-2 mb-1.5">
                      <CheckSquareIcon className="h-4 w-4 text-chart-4" />
                      <h4 className="text-sm font-medium">Approval Workflow</h4>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Approve support structures to represent your startup and earn commissions
                    </p>
                  </div>
                  
                  <div className="p-3 rounded-md bg-muted/20 border border-border/50">
                    <div className="flex items-center gap-2 mb-1.5">
                      <ActivityIcon className="h-4 w-4 text-chart-5" />
                      <h4 className="text-sm font-medium">Commission Splitting</h4>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Configure commission percentages across multiple support partners
                    </p>
                  </div>
                </div>
                
                <div className="relative h-24 w-full rounded-md overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-chart-4/20 to-chart-5/10 flex items-center justify-center">
                    <p className="text-xs text-center">
                      <span className="block font-medium mb-1">Interactive Partner Management</span>
                      Visualize and manage all your support structure partnerships
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-xs text-muted-foreground w-full">
                  Located in: <code className="bg-muted/30 px-1 py-0.5 rounded text-xs">/components/startup/SupportStructureManagement.tsx</code>
                </p>
              </CardFooter>
            </Card>

            {/* Other Features */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <LayersIcon className="h-5 w-5 text-chart-5" />
                    Additional Features
                  </CardTitle>
                </div>
                <CardDescription>
                  Other key features in the startup dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-md bg-muted/20 border border-border/50">
                    <div className="h-8 w-8 rounded-md bg-chart-3/20 flex items-center justify-center flex-shrink-0">
                      <BellIcon className="h-4 w-4 text-chart-3" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Notifications Panel</h4>
                      <p className="text-xs text-muted-foreground">
                        Receive and manage notifications about orders, partnerships, and platform updates
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 rounded-md bg-muted/20 border border-border/50">
                    <div className="h-8 w-8 rounded-md bg-chart-5/20 flex items-center justify-center flex-shrink-0">
                      <UsersIcon className="h-4 w-4 text-chart-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Customer Management</h4>
                      <p className="text-xs text-muted-foreground">
                        View and manage customer relationships, track engagement, and handle communications
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 rounded-md bg-muted/20 border border-border/50">
                    <div className="h-8 w-8 rounded-md bg-tertiary/20 flex items-center justify-center flex-shrink-0">
                      <ClipboardIcon className="h-4 w-4 text-tertiary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Orders Management</h4>
                      <p className="text-xs text-muted-foreground">
                        Track, process, and fulfill customer orders with status tracking and history
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-xs text-muted-foreground w-full">
                  Located in: <code className="bg-muted/30 px-1 py-0.5 rounded text-xs">/components/startup/</code> directory
                </p>
              </CardFooter>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Support Structure Dashboard Features */}
        <TabsContent value="support" className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Portfolio Management */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BriefcaseIcon className="h-5 w-5 text-chart-4" />
                    Startup Portfolio
                  </CardTitle>
                  <Badge variant="outline" className="bg-chart-4/10 text-chart-4 border-chart-4/20">
                    Core Feature
                  </Badge>
                </div>
                <CardDescription>
                  Manage the startups you support and promote
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-md bg-muted/20 border border-border/50">
                    <div className="flex items-center gap-2 mb-1.5">
                      <UsersIcon className="h-4 w-4 text-chart-4" />
                      <h4 className="text-sm font-medium">Startup Onboarding</h4>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Add new startups to your portfolio with the AddStartupForm component
                    </p>
                  </div>
                  
                  <div className="p-3 rounded-md bg-muted/20 border border-border/50">
                    <div className="flex items-center gap-2 mb-1.5">
                      <BarChart3Icon className="h-4 w-4 text-chart-5" />
                      <h4 className="text-sm font-medium">Performance Tracking</h4>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Monitor startup performance, sales, and growth metrics
                    </p>
                  </div>
                </div>
                
                <div className="relative h-32 w-full rounded-md overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-chart-4/20 to-chart-3/10 flex items-center justify-center">
                    <div className="text-center">
                      <div className="flex justify-center gap-2 mb-2">
                        <div className="h-6 w-6 rounded-full bg-background/80 flex items-center justify-center">
                          <BriefcaseIcon className="h-3.5 w-3.5 text-chart-4" />
                        </div>
                        <div className="h-6 w-6 rounded-full bg-background/80 flex items-center justify-center">
                          <ActivityIcon className="h-3.5 w-3.5 text-chart-3" />
                        </div>
                      </div>
                      <p className="text-sm">Comprehensive Startup Management</p>
                      <p className="text-xs text-muted-foreground">Add, track, and promote startups in your portfolio</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-xs text-muted-foreground w-full">
                  Located in: <code className="bg-muted/30 px-1 py-0.5 rounded text-xs">/components/support-structure/AddStartupForm.tsx</code>
                </p>
              </CardFooter>
            </Card>

            {/* Portfolio Analytics */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <ChartBarIcon className="h-5 w-5 text-chart-5" />
                    Portfolio Analytics
                  </CardTitle>
                  <Badge variant="outline" className="bg-chart-5/10 text-chart-5 border-chart-5/20">
                    Analytics
                  </Badge>
                </div>
                <CardDescription>
                  Visualize performance data across your startup portfolio
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-chart-5/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <PieChartIcon className="h-3 w-3 text-chart-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Portfolio Distribution</p>
                      <p className="text-xs text-muted-foreground">View distribution of startups by industry, stage, and performance</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-chart-5/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <LineChartIcon className="h-3 w-3 text-chart-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Growth Trends</p>
                      <p className="text-xs text-muted-foreground">Track performance trends across your portfolio over time</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-chart-5/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <BarChart3Icon className="h-3 w-3 text-chart-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Commission Analytics</p>
                      <p className="text-xs text-muted-foreground">Monitor revenue and commission earnings from startups</p>
                    </div>
                  </li>
                </ul>

                <div className="relative h-24 w-full rounded-md overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-chart-5/20 to-chart-4/10 flex items-center justify-center">
                    <p className="text-xs text-center">
                      <span className="block font-medium mb-1">Interactive Data Visualizations</span>
                      Comprehensive charts and performance metrics
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-xs text-muted-foreground w-full">
                  Located in: <code className="bg-muted/30 px-1 py-0.5 rounded text-xs">/components/support-structure/PortfolioAnalysis.tsx</code>
                </p>
              </CardFooter>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Admin Dashboard Features */}
        <TabsContent value="admin" className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Platform Analytics */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <ChartBarIcon className="h-5 w-5 text-destructive" />
                    Platform Analytics
                  </CardTitle>
                  <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                    Admin Only
                  </Badge>
                </div>
                <CardDescription>
                  Comprehensive analytics across the entire platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-md bg-muted/20 border border-border/50">
                    <div className="flex items-center gap-2 mb-1.5">
                      <UsersIcon className="h-4 w-4 text-destructive" />
                      <h4 className="text-sm font-medium">User Analytics</h4>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Track user growth, engagement, and conversion metrics
                    </p>
                  </div>
                  
                  <div className="p-3 rounded-md bg-muted/20 border border-border/50">
                    <div className="flex items-center gap-2 mb-1.5">
                      <BarChart3Icon className="h-4 w-4 text-chart-5" />
                      <h4 className="text-sm font-medium">Revenue Metrics</h4>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Monitor platform revenue, commissions, and financial performance
                    </p>
                  </div>
                </div>
                
                <div className="relative h-32 w-full rounded-md overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-destructive/20 to-tertiary/10 flex items-center justify-center">
                    <div className="text-center">
                      <PieChartIcon className="h-8 w-8 text-destructive/50 mx-auto mb-2" />
                      <p className="text-sm">Advanced Analytics Dashboard</p>
                      <p className="text-xs text-muted-foreground">Comprehensive data visualization for platform administrators</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-xs text-muted-foreground w-full">
                  Located in: <code className="bg-muted/30 px-1 py-0.5 rounded text-xs">/components/admin/PlatformAnalytics.tsx</code>
                </p>
              </CardFooter>
            </Card>

            {/* Approval Workflows */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CheckSquareIcon className="h-5 w-5 text-tertiary" />
                    Approval Workflows
                  </CardTitle>
                  <Badge variant="outline" className="bg-tertiary/10 text-tertiary border-tertiary/20">
                    Moderation
                  </Badge>
                </div>
                <CardDescription>
                  Manage and approve startups and support structures
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-tertiary/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <BriefcaseIcon className="h-3 w-3 text-tertiary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Startup Approval</p>
                      <p className="text-xs text-muted-foreground">Review and approve new startup applications</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-tertiary/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <BuildingIcon className="h-3 w-3 text-tertiary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Support Structure Approval</p>
                      <p className="text-xs text-muted-foreground">Verify and approve incubators and accelerators</p>
                    </div>
                  </li>
                </ul>

                <div className="relative h-24 w-full rounded-md overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-tertiary/20 to-chart-4/10 flex items-center justify-center">
                    <p className="text-xs text-center">
                      <span className="block font-medium mb-1">Streamlined Approval Workflow</span>
                      Efficient review and moderation tools for platform governance
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-xs text-muted-foreground w-full">
                  Located in: <code className="bg-muted/30 px-1 py-0.5 rounded text-xs">/components/admin/StartupApproval.tsx</code> and <code className="bg-muted/30 px-1 py-0.5 rounded text-xs">/components/admin/SupportStructureApproval.tsx</code>
                </p>
              </CardFooter>
            </Card>

            {/* Commission Management */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <PercentIcon className="h-5 w-5 text-chart-4" />
                    Commission Management
                  </CardTitle>
                  <Badge variant="outline" className="bg-chart-4/10 text-chart-4 border-chart-4/20">
                    Financial
                  </Badge>
                </div>
                <CardDescription>
                  Manage platform commissions and payment rules
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-md bg-muted/20 border border-border/50">
                    <div className="flex items-center gap-2 mb-1.5">
                      <SettingsIcon className="h-4 w-4 text-chart-4" />
                      <h4 className="text-sm font-medium">Commission Rules</h4>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Configure global commission rates and rules
                    </p>
                  </div>
                  
                  <div className="p-3 rounded-md bg-muted/20 border border-border/50">
                    <div className="flex items-center gap-2 mb-1.5">
                      <CreditCardIcon className="h-4 w-4 text-chart-5" />
                      <h4 className="text-sm font-medium">Payment Processing</h4>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Manage payment processing and disbursement settings
                    </p>
                  </div>
                </div>
                
                <div className="relative h-24 w-full rounded-md overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-chart-4/20 to-destructive/10 flex items-center justify-center">
                    <p className="text-xs text-center">
                      <span className="block font-medium mb-1">Financial Control Center</span>
                      Complete tools for managing the platform's financial operations
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-xs text-muted-foreground w-full">
                  Located in: <code className="bg-muted/30 px-1 py-0.5 rounded text-xs">/components/admin/CommissionManagement.tsx</code>
                </p>
              </CardFooter>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Client Dashboard Features */}
        <TabsContent value="client" className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Purchase History */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <ListIcon className="h-5 w-5 text-chart-5" />
                    Purchase History
                  </CardTitle>
                  <Badge variant="outline" className="bg-chart-5/10 text-chart-5 border-chart-5/20">
                    Client Feature
                  </Badge>
                </div>
                <CardDescription>
                  Track and manage your purchases from startups
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative h-32 w-full rounded-md overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-chart-5/20 to-chart-3/10 flex items-center justify-center">
                    <div className="text-center">
                      <CreditCardIcon className="h-8 w-8 text-chart-5/50 mx-auto mb-2" />
                      <p className="text-sm">Order History Dashboard</p>
                      <p className="text-xs text-muted-foreground">View and manage your past purchases and subscriptions</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 rounded-md bg-muted/20 border border-border/50">
                  <div className="flex items-center gap-2 mb-1.5">
                    <PackageIcon className="h-4 w-4 text-chart-5" />
                    <h4 className="text-sm font-medium">Order Tracking</h4>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Track order status, download digital products, and manage subscriptions
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-xs text-muted-foreground w-full">
                  Located in: <code className="bg-muted/30 px-1 py-0.5 rounded text-xs">/components/client/ClientDashboard.tsx</code>
                </p>
              </CardFooter>
            </Card>

            {/* VentureRoom Club */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <PercentIcon className="h-5 w-5 text-tertiary" />
                    VentureRoom Club
                  </CardTitle>
                  <Badge variant="outline" className="bg-tertiary/10 text-tertiary border-tertiary/20">
                    Premium Feature
                  </Badge>
                </div>
                <CardDescription>
                  Access exclusive startup discounts and perks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative h-32 w-full rounded-md overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-tertiary/20 to-primary/10 flex items-center justify-center">
                    <div className="text-center">
                      <div className="h-8 w-8 rounded-full bg-tertiary/30 flex items-center justify-center mx-auto mb-2">
                        <PercentIcon className="h-4 w-4 text-primary" />
                      </div>
                      <p className="text-sm">Exclusive Discounts Dashboard</p>
                      <p className="text-xs text-muted-foreground">Browse and redeem startup offers and promotions</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 rounded-md bg-muted/20 border border-border/50">
                  <div className="flex items-center gap-2 mb-1.5">
                    <ClipboardIcon className="h-4 w-4 text-tertiary" />
                    <h4 className="text-sm font-medium">Discount Management</h4>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Copy promo codes, track usage, and manage your discount benefits
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-xs text-muted-foreground w-full">
                  Located in: <code className="bg-muted/30 px-1 py-0.5 rounded text-xs">/components/club/VentureRoomClub.tsx</code>
                </p>
              </CardFooter>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>

      <div className="mt-12 max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCogIcon className="h-5 w-5 text-primary" />
              Role Switcher Navigation
            </CardTitle>
            <CardDescription>
              Use the role switcher in the header to instantly access different dashboard interfaces
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 py-4">
              <Button variant="outline" className="flex items-center gap-2 min-w-40" onClick={() => setActiveTab("startup")}>
                <BriefcaseIcon className="h-4 w-4 text-tertiary" />
                Startup Dashboard
              </Button>
              <Button variant="outline" className="flex items-center gap-2 min-w-40" onClick={() => setActiveTab("support")}>
                <BuildingIcon className="h-4 w-4 text-chart-4" />
                Support Structure Dashboard
              </Button>
              <Button variant="outline" className="flex items-center gap-2 min-w-40" onClick={() => setActiveTab("admin")}>
                <ShieldIcon className="h-4 w-4 text-destructive" />
                Admin Portal
              </Button>
              <Button variant="outline" className="flex items-center gap-2 min-w-40" onClick={() => setActiveTab("client")}>
                <UserIcon className="h-4 w-4 text-chart-5" />
                Client Dashboard
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-6">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Access All Dashboard Features
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}