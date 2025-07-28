import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import { startupService } from "../../services/startupService";
import {
  Rocket,
  Package,
  DollarSign,
  Users,
  TrendingUp,
  TrendingDown,
  Plus,
  Edit,
  Trash2,
  Eye,
  BarChart3,
  Building2,
  Star,
  ShoppingCart,
  Percent,
  Calendar,
  ArrowUpRight,
  Settings,
  FileText,
  Link2,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { toast } from "sonner";

interface StartupDashboardProps {
  user?: any;
}

export function StartupDashboard({ user }: StartupDashboardProps) {
  const { user: authUser } = useAuth();
  const currentUser = user || authUser;
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [startup, setStartup] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [kpis, setKpis] = useState<any>(null);
  const [structureLinks, setStructureLinks] = useState<any[]>([]);

  // Mock data for demonstration
  const mockStartup = {
    id: "startup-1",
    name: "AI Analytics Pro",
    description: "Advanced AI-powered analytics platform for businesses",
    logo_url: "",
    website: "https://aianalytics.com",
    founded_date: "2023-01-15",
    industry: "AI/ML",
    stage: "Seed",
    location: "San Francisco, CA",
    team_size: 12,
    total_funding: 500000,
    is_approved: true,
  };

  const mockProducts = [
    {
      id: "1",
      name: "Business Intelligence Dashboard",
      description: "Comprehensive BI dashboard with real-time analytics",
      price: 299.99,
      category: "Software",
      is_active: true,
      stock_quantity: 100,
    },
    {
      id: "2", 
      name: "AI Prediction Engine",
      description: "Machine learning models for business forecasting",
      price: 499.99,
      category: "Software",
      is_active: true,
      stock_quantity: 50,
    },
  ];

  const mockKPIs = {
    totalProducts: 4,
    totalOrders: 23,
    totalRevenue: 12450.75,
    commissionPaid: 1867.61,
    structuresLinked: 2,
    activeDiscounts: 1,
    averageProductPrice: 312.25,
  };

  const mockStructureLinks = [
    {
      id: "1",
      structure: { name: "TechBoost Accelerator", structure_type: "accelerator" },
      status: "accepted",
      invited_at: new Date().toISOString(),
      invitation_message: "We're excited to support your AI platform",
    },
    {
      id: "2", 
      structure: { name: "AI Ventures Fund", structure_type: "investor" },
      status: "pending",
      invited_at: new Date().toISOString(),
      invitation_message: "Investment opportunity discussion",
    },
  ];

  useEffect(() => {
    loadStartupData();
  }, []);

  const loadStartupData = async () => {
    try {
      setLoading(true);
      // Use mock data for demonstration
      setStartup(mockStartup);
      setProducts(mockProducts);
      setKpis(mockKPIs);
      setStructureLinks(mockStructureLinks);
    } catch (error) {
      console.error("Error loading startup data:", error);
      toast.error("Failed to load startup data");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Rocket className="h-8 w-8 text-white" />
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
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
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
                <BarChart3 className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="products" 
                className="bg-transparent border-none text-slate-400 data-[state=active]:text-blue-400 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-400 rounded-none pb-3"
              >
                <Package className="h-4 w-4 mr-2" />
                Products
              </TabsTrigger>
              <TabsTrigger 
                value="partnerships" 
                className="bg-transparent border-none text-slate-400 data-[state=active]:text-blue-400 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-400 rounded-none pb-3"
              >
                <Building2 className="h-4 w-4 mr-2" />
                Partnerships
              </TabsTrigger>
              <TabsTrigger 
                value="orders" 
                className="bg-transparent border-none text-slate-400 data-[state=active]:text-blue-400 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-400 rounded-none pb-3"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Orders
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="bg-transparent border-none text-slate-400 data-[state=active]:text-blue-400 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-400 rounded-none pb-3"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
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
                        <Package className="h-8 w-8 text-blue-400" />
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
                        <DollarSign className="h-8 w-8 text-green-400" />
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
                        <ShoppingCart className="h-8 w-8 text-purple-400" />
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
                        <Building2 className="h-8 w-8 text-orange-400" />
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
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <Card key={product.id} className="bg-slate-900 border-slate-800">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <Package className="h-6 w-6 text-white" />
                          </div>
                          <Badge className={product.is_active ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'}>
                            {product.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <h3 className="text-white font-semibold mb-2">{product.name}</h3>
                        <p className="text-slate-400 text-sm mb-4">{product.description}</p>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-2xl font-bold text-white">{formatCurrency(product.price)}</span>
                          <span className="text-sm text-slate-400">{product.stock_quantity} in stock</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1 border-slate-700 text-slate-300">
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" className="border-slate-700 text-slate-300">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm" className="border-red-500/50 text-red-400">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Partnerships Tab */}
              <TabsContent value="partnerships" className="space-y-6 mt-0">
                <div>
                  <h2 className="text-xl font-bold text-white">Support Structure Partnerships</h2>
                  <p className="text-slate-400">Manage relationships with incubators and accelerators</p>
                </div>

                <div className="space-y-4">
                  {structureLinks.map((link) => (
                    <Card key={link.id} className="bg-slate-900 border-slate-800">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                              <Building2 className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-white font-semibold">{link.structure.name}</h3>
                              <p className="text-slate-400 text-sm capitalize">{link.structure.structure_type}</p>
                              <p className="text-xs text-slate-500 mt-1">{link.invitation_message}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className={
                              link.status === 'accepted' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                              link.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                              'bg-red-500/20 text-red-400 border-red-500/30'
                            }>
                              {link.status === 'accepted' ? <CheckCircle className="h-3 w-3 mr-1" /> :
                               link.status === 'pending' ? <Clock className="h-3 w-3 mr-1" /> :
                               <XCircle className="h-3 w-3 mr-1" />}
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
                  ))}
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
                      <ShoppingCart className="h-12 w-12 mx-auto mb-4" />
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
                      <BarChart3 className="h-12 w-12 mx-auto mb-4" />
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
