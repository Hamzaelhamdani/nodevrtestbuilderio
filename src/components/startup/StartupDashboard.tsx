
import React, { useState, useEffect } from "react";
import apiClient from '../../utils/apiClient';
import { Button } from "../ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Badge } from "../ui/badge";
import {
  RocketIcon,
  SettingsIcon,
  PlusIcon,
  BarChart3Icon,
  PackageIcon,
  Building2Icon,
  ShoppingCartIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  DollarSignIcon,
  EditIcon,
  EyeIcon,
  Trash2Icon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent
} from "../ui/card";
import { Progress } from "../ui/progress";
import { SettingsPanel } from "./SettingsPanel";
import { NotificationsPanel } from "./NotificationsPanel";
import { SupportStructureManagement } from "./SupportStructureManagement";
import { CustomerManagement } from "./CustomerManagement";
import { OrdersManagement } from "./OrdersManagement";
import { ProductServiceCreation } from "./ProductServiceCreation";
import { ProductServiceEdit } from "./ProductServiceEdit";
import { ProductServiceView } from "./ProductServiceView";
import { RevenueSummary } from "./RevenueSummary";
import { SalesChart } from "./SalesChart";

// Utility function for formatting currency
function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(amount);
}

// Log when StartupDashboard mounts and receives user
export function StartupDashboard({ user, navigate }: any) {
  useEffect(() => {
    console.log('[StartupDashboard] mounted, user:', user);
  }, [user]);



// ...existing code...

  const [activeTab, setActiveTab] = useState("overview");
  const [startup, setStartup] = useState<any>(null);
  const [kpis, setKpis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [supportStructures, setSupportStructures] = useState<any[]>([]);

  useEffect(() => {
    console.log('[StartupDashboard] mounted, user:', user);
  }, [user]);
  useEffect(() => {
    setStartup(user);
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const [kpiData, productData, structureData] = await Promise.all([
          apiClient.get('/startups/dashboard/kpis'),
          apiClient.get('/startups/products'),
          apiClient.get('/startups/support-structures'),
        ]);
        setKpis(kpiData);
        setProducts(productData);
        setSupportStructures(structureData);
      } catch (err: any) {
        setError(err?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [user]);

  if (loading) {
    return <div className="container max-w-7xl mx-auto px-4 py-8">Loading dashboard...</div>;
  }
  if (error) {
    return <div className="container max-w-7xl mx-auto px-4 py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">{kpis?.startupName || startup?.name || "My Startup"}</h1>
          <p className="text-muted-foreground mt-1">
            Manage your products, orders and customers
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Button variant="outline" onClick={() => navigate("community-discounts")}>Manage Discounts</Button>
          <Button onClick={() => navigate("startup-storefront")}>View Storefront</Button>
        </div>
      </div>
      {/* Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="support-structures">Support Structures</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <RevenueSummary totalRevenue={kpis?.totalRevenue || 0} percentageChange={12.5} comparisonPeriod="last month" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Products</CardTitle>
              </CardHeader>
              <CardContent>
                <span className="text-2xl font-bold">{kpis?.totalProducts ?? 0}</span>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <span className="text-2xl font-bold">{kpis?.totalOrders ?? 0}</span>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <span className="text-2xl font-bold">${kpis?.totalRevenue ?? 0}</span>
              </CardContent>
            </Card>
          </div>
          <SalesChart />
        </TabsContent>
        <TabsContent value="products">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-white">Product Management</h2>
              <p className="text-slate-400">Manage your products and services</p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.length === 0 ? (
              <div className="col-span-full text-slate-400">No products found.</div>
            ) : (
              products.map((product: any) => (
                <Card key={product.id} className="bg-slate-900 border-slate-800">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <PackageIcon className="h-6 w-6 text-white" />
                      </div>
                      <Badge className={product.is_active ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'}>
                        {product.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <h3 className="text-white font-semibold mb-2">{product.name}</h3>
                    <p className="text-slate-400 text-sm mb-4">{product.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-white">{formatCurrency(product.price)}</span>
                      <span className="text-sm text-slate-400">{product.inventory ?? 0} in stock</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 border-slate-700 text-slate-300">
                        <EditIcon className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="border-slate-700 text-slate-300">
                        <EyeIcon className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm" className="border-red-500/50 text-red-400">
                        <Trash2Icon className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        <TabsContent value="orders">
          <OrdersManagement />
        </TabsContent>
        <TabsContent value="customers">
          <CustomerManagement />
        </TabsContent>
        <TabsContent value="support-structures">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-white">Support Structure Partnerships</h2>
            <p className="text-slate-400">Manage relationships with incubators and accelerators</p>
          </div>
          <div className="space-y-4">
            {supportStructures.length === 0 ? (
              <div className="text-slate-400">No support structure partnerships found.</div>
            ) : (
              supportStructures.map((link: any) => (
                <Card key={link.id} className="bg-slate-900 border-slate-800">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                          <Building2Icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">{link.supportStructure?.name}</h3>
                          <p className="text-slate-400 text-sm capitalize">{link.supportStructure?.structure_type || ''}</p>
                          <p className="text-xs text-slate-500 mt-1">{link.invitation_message}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={
                          link.status === 'accepted' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                          link.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                          'bg-red-500/20 text-red-400 border-red-500/30'
                        }>
                          {link.status === 'accepted' ? <CheckCircleIcon className="h-3 w-3 mr-1" /> :
                            link.status === 'pending' ? <ClockIcon className="h-3 w-3 mr-1" /> :
                              <XCircleIcon className="h-3 w-3 mr-1" />}
                          {link.status}
                        </Badge>
                        {link.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10">
                              Reject
                            </Button>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              Accept
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        <TabsContent value="notifications">
          <NotificationsPanel userId={startup?.id} />
        </TabsContent>
        <TabsContent value="settings">
          <SettingsPanel user={startup} />
        </TabsContent>
      </Tabs>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <RocketIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{startup?.name || "My Startup"}</h1>
                <p className="text-slate-400">{startup?.description || "Loading..."}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    {startup?.stage || "Seed"}
                  </Badge>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    {startup?.industry || "AI/ML"}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="border-slate-700 text-slate-300">
                <SettingsIcon className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-800 bg-slate-900/30">
        <div className="container mx-auto px-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="h-12 bg-transparent border-none p-0 space-x-8">
              <TabsTrigger 
                value="overview" 
                className="bg-transparent border-none text-slate-400 data-[state=active]:text-blue-400 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-400 rounded-none pb-3"
              >
                  <BarChart3Icon className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="products" 
                className="bg-transparent border-none text-slate-400 data-[state=active]:text-blue-400 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-400 rounded-none pb-3"
              >
                  <PackageIcon className="h-4 w-4 mr-2" />
                Products
              </TabsTrigger>
              <TabsTrigger 
                value="partnerships" 
                className="bg-transparent border-none text-slate-400 data-[state=active]:text-blue-400 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-400 rounded-none pb-3"
              >
                  <Building2Icon className="h-4 w-4 mr-2" />
                Partnerships
              </TabsTrigger>
              <TabsTrigger 
                value="orders" 
                className="bg-transparent border-none text-slate-400 data-[state=active]:text-blue-400 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-400 rounded-none pb-3"
              >
                  <ShoppingCartIcon className="h-4 w-4 mr-2" />
                Orders
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="bg-transparent border-none text-slate-400 data-[state=active]:text-blue-400 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-400 rounded-none pb-3"
              >
                  <TrendingUpIcon className="h-4 w-4 mr-2" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <div className="container mx-auto px-6 py-6">
              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6 mt-0">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-400 mb-1">Total Products</p>
                          <p className="text-2xl font-bold text-white">{kpis?.totalProducts || 0}</p>
                        </div>
                        <PackageIcon className="h-8 w-8 text-blue-400" />
                      </div>
                      <p className="text-xs text-slate-500 mt-2">Active listings</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-400 mb-1">Total Revenue</p>
                          <p className="text-2xl font-bold text-white">{formatCurrency(kpis?.totalRevenue || 0)}</p>
                        </div>
                        <DollarSignIcon className="h-8 w-8 text-green-400" />
                      </div>
                      <p className="text-xs text-slate-500 mt-2">All-time earnings</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-400 mb-1">Total Orders</p>
                          <p className="text-2xl font-bold text-white">{kpis?.totalOrders || 0}</p>
                        </div>
                        <ShoppingCartIcon className="h-8 w-8 text-purple-400" />
                      </div>
                      <p className="text-xs text-slate-500 mt-2">Completed orders</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-400 mb-1">Support Structures</p>
                          <p className="text-2xl font-bold text-white">{kpis?.structuresLinked || 0}</p>
                        </div>
                        <Building2Icon className="h-8 w-8 text-orange-400" />
                      </div>
                      <p className="text-xs text-slate-500 mt-2">Active partnerships</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity & Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                      <CardTitle className="text-white">Recent Orders</CardTitle>
                      <CardDescription className="text-slate-400">Latest customer orders</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[
                        { id: "1", product: "BI Dashboard", customer: "TechCorp", amount: 299.99, status: "completed", date: "2 hours ago" },
                        { id: "2", product: "AI Engine", customer: "DataFlow", amount: 499.99, status: "processing", date: "5 hours ago" },
                        { id: "3", product: "BI Dashboard", customer: "StartupX", amount: 299.99, status: "completed", date: "1 day ago" },
                      ].map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                          <div>
                            <p className="text-white font-medium">{order.product}</p>
                            <p className="text-sm text-slate-400">{order.customer} • {order.date}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-white font-medium">{formatCurrency(order.amount)}</p>
                            <Badge className={order.status === 'completed' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'}>
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                      <CardTitle className="text-white">Performance Metrics</CardTitle>
                      <CardDescription className="text-slate-400">Key business indicators</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-slate-400">Revenue Growth</span>
                          <span className="text-sm text-green-400">+24.5%</span>
                        </div>
                        <Progress value={75} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-slate-400">Product Sales</span>
                          <span className="text-sm text-blue-400">+18.2%</span>
                        </div>
                        <Progress value={62} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-slate-400">Customer Satisfaction</span>
                          <span className="text-sm text-purple-400">94%</span>
                        </div>
                        <Progress value={94} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Products Tab */}
              <TabsContent value="products" className="space-y-6 mt-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white">Product Management</h2>
                    <p className="text-slate-400">Manage your products and services</p>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.length === 0 ? (
                    <div className="col-span-full text-slate-400">No products found.</div>
                  ) : (
                    products.map((product: any) => (
                      <Card key={product.id} className="bg-slate-900 border-slate-800">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                              <PackageIcon className="h-6 w-6 text-white" />
                            </div>
                            <Badge className={product.is_active ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'}>
                              {product.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <h3 className="text-white font-semibold mb-2">{product.name}</h3>
                          <p className="text-slate-400 text-sm mb-4">{product.description}</p>
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-2xl font-bold text-white">{formatCurrency(product.price)}</span>
                            <span className="text-sm text-slate-400">{product.inventory ?? product.stock_quantity ?? 0} in stock</span>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1 border-slate-700 text-slate-300">
                              <EditIcon className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                            <Button variant="outline" size="sm" className="border-slate-700 text-slate-300">
                              <EyeIcon className="h-3 w-3" />
                            </Button>
                            <Button variant="outline" size="sm" className="border-red-500/50 text-red-400">
                              <Trash2Icon className="h-3 w-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              {/* Partnerships Tab */}
              <TabsContent value="partnerships" className="space-y-6 mt-0">
                <div>
                  <h2 className="text-xl font-bold text-white">Support Structure Partnerships</h2>
                  <p className="text-slate-400">Manage relationships with incubators and accelerators</p>
                </div>

                <div className="space-y-4">
                  {supportStructures.length === 0 ? (
                    <div className="text-slate-400">No support structure partnerships found.</div>
                  ) : (
                    supportStructures.map((link: any) => (
                      <Card key={link.id} className="bg-slate-900 border-slate-800">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                                <Building2Icon className="h-6 w-6 text-white" />
                              </div>
                              <div>
                                <h3 className="text-white font-semibold">{link.supportStructure?.name}</h3>
                                <p className="text-slate-400 text-sm capitalize">{link.supportStructure?.structure_type || ''}</p>
                                <p className="text-xs text-slate-500 mt-1">{link.invitation_message}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge className={
                                link.status === 'accepted' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                                link.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                                'bg-red-500/20 text-red-400 border-red-500/30'
                              }>
                                {link.status === 'accepted' ? <CheckCircleIcon className="h-3 w-3 mr-1" /> :
                                  link.status === 'pending' ? <ClockIcon className="h-3 w-3 mr-1" /> :
                                    <XCircleIcon className="h-3 w-3 mr-1" />}
                                {link.status}
                              </Badge>
                              {link.status === 'pending' && (
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10">
                                    Reject
                                  </Button>
                                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                    Accept
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              {/* Orders Tab */}
              <TabsContent value="orders" className="space-y-6 mt-0">
                <div>
                  <h2 className="text-xl font-bold text-white">Order Management</h2>
                  <p className="text-slate-400">Track and manage customer orders</p>
                </div>

                <Card className="bg-slate-900 border-slate-800">
                  <CardContent className="p-6">
                    <div className="text-center py-8 text-slate-400">
                      <ShoppingCartIcon className="h-12 w-12 mx-auto mb-4" />
                      <p>Order management features coming soon</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-6 mt-0">
                <div>
                  <h2 className="text-xl font-bold text-white">Business Analytics</h2>
                  <p className="text-slate-400">Detailed insights and performance metrics</p>
                </div>

                <Card className="bg-slate-900 border-slate-800">
                  <CardContent className="p-6">
                    <div className="text-center py-8 text-slate-400">
                      <BarChart3Icon className="h-12 w-12 mx-auto mb-4" />
                      <p>Advanced analytics dashboard coming soon</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
