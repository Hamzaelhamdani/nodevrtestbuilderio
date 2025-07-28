import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import { clientService } from "../../services/clientService";
import {
  ShoppingCart,
  Package,
  DollarSign,
  Star,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Eye,
  BarChart3,
  Heart,
  Percent,
  Calendar,
  ArrowUpRight,
  Settings,
  Download,
  RefreshCw,
  CheckCircle,
  Clock,
  XCircle,
  Truck,
  CreditCard,
  Gift,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { toast } from "sonner";

interface ClientDashboardProps {
  user?: any;
}

export function ClientDashboard({ user }: ClientDashboardProps) {
  const { user: authUser } = useAuth();
  const currentUser = user || authUser;
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [kpis, setKpis] = useState<any>(null);
  const [favoriteProducts, setFavoriteProducts] = useState<any[]>([]);

  // Mock data for demonstration
  const mockOrders = [
    {
      id: "1",
      product: { name: "Business Intelligence Dashboard", category: "Software" },
      startup: { name: "AI Analytics Pro" },
      quantity: 1,
      final_amount: 299.99,
      discount_amount: 0,
      status: "completed",
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "2",
      product: { name: "Carbon Footprint Tracker", category: "Software" },
      startup: { name: "EcoTrack Solutions" },
      quantity: 1,
      final_amount: 119.99,
      discount_amount: 30.00,
      status: "processing",
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "3",
      product: { name: "AI Prediction Engine", category: "Software" },
      startup: { name: "AI Analytics Pro" },
      quantity: 1,
      final_amount: 499.99,
      discount_amount: 0,
      status: "completed",
      created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  const mockKPIs = {
    totalOrders: 8,
    totalAmountSpent: 1847.92,
    discountsUsed: 3,
    totalSavings: 147.50,
    favoriteStartup: { name: "AI Analytics Pro" },
    averageBasketValue: 230.99,
    lastOrderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  };

  const mockFavoriteProducts = [
    {
      id: "1",
      name: "Business Intelligence Dashboard",
      startup: { name: "AI Analytics Pro" },
      price: 299.99,
      category: "Software",
      rating: 4.8,
    },
    {
      id: "2",
      name: "Carbon Footprint Tracker",
      startup: { name: "EcoTrack Solutions" },
      price: 149.99,
      category: "Software",
      rating: 4.6,
    },
  ];

  useEffect(() => {
    loadClientData();
  }, []);

  const loadClientData = async () => {
    try {
      setLoading(true);
      // Use mock data for demonstration
      setOrders(mockOrders);
      setKpis(mockKPIs);
      setFavoriteProducts(mockFavoriteProducts);
    } catch (error) {
      console.error("Error loading client data:", error);
      toast.error("Failed to load client data");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "processing":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "processing":
        return <Clock className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <ShoppingCart className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">My Dashboard</h1>
                <p className="text-slate-400">Welcome back, {currentUser?.full_name || "Valued Customer"}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                    Premium Member
                  </Badge>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    {kpis?.totalOrders || 0} Orders
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="border-slate-700 text-slate-300">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Browse Products
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
                value="orders" 
                className="bg-transparent border-none text-slate-400 data-[state=active]:text-blue-400 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-400 rounded-none pb-3"
              >
                <Package className="h-4 w-4 mr-2" />
                My Orders
              </TabsTrigger>
              <TabsTrigger 
                value="favorites" 
                className="bg-transparent border-none text-slate-400 data-[state=active]:text-blue-400 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-400 rounded-none pb-3"
              >
                <Heart className="h-4 w-4 mr-2" />
                Favorites
              </TabsTrigger>
              <TabsTrigger 
                value="savings" 
                className="bg-transparent border-none text-slate-400 data-[state=active]:text-blue-400 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-400 rounded-none pb-3"
              >
                <Gift className="h-4 w-4 mr-2" />
                Savings & Discounts
              </TabsTrigger>
              <TabsTrigger 
                value="profile" 
                className="bg-transparent border-none text-slate-400 data-[state=active]:text-blue-400 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-400 rounded-none pb-3"
              >
                <Settings className="h-4 w-4 mr-2" />
                Profile
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
                          <p className="text-sm text-slate-400 mb-1">Total Orders</p>
                          <p className="text-2xl font-bold text-white">{kpis?.totalOrders || 0}</p>
                        </div>
                        <Package className="h-8 w-8 text-blue-400" />
                      </div>
                      <p className="text-xs text-slate-500 mt-2">Lifetime purchases</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-400 mb-1">Total Spent</p>
                          <p className="text-2xl font-bold text-white">{formatCurrency(kpis?.totalAmountSpent || 0)}</p>
                        </div>
                        <DollarSign className="h-8 w-8 text-green-400" />
                      </div>
                      <p className="text-xs text-slate-500 mt-2">Across all purchases</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-400 mb-1">Total Savings</p>
                          <p className="text-2xl font-bold text-white">{formatCurrency(kpis?.totalSavings || 0)}</p>
                        </div>
                        <Gift className="h-8 w-8 text-purple-400" />
                      </div>
                      <p className="text-xs text-slate-500 mt-2">From discounts</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-400 mb-1">Avg. Order Value</p>
                          <p className="text-2xl font-bold text-white">{formatCurrency(kpis?.averageBasketValue || 0)}</p>
                        </div>
                        <BarChart3 className="h-8 w-8 text-orange-400" />
                      </div>
                      <p className="text-xs text-slate-500 mt-2">Per transaction</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Orders & Spending Chart */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                      <CardTitle className="text-white">Recent Orders</CardTitle>
                      <CardDescription className="text-slate-400">Your latest purchases</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {orders.slice(0, 3).map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                              <Package className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <p className="text-white font-medium">{order.product.name}</p>
                              <p className="text-sm text-slate-400">{order.startup.name} • {formatDate(order.created_at)}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-white font-medium">{formatCurrency(order.final_amount)}</p>
                            <Badge className={`text-xs ${getStatusColor(order.status)}`}>
                              {getStatusIcon(order.status)}
                              <span className="ml-1">{order.status}</span>
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                      <CardTitle className="text-white">Spending Overview</CardTitle>
                      <CardDescription className="text-slate-400">Your purchase activity</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-slate-400">Software Products</span>
                          <span className="text-sm text-blue-400">75%</span>
                        </div>
                        <Progress value={75} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-slate-400">Services</span>
                          <span className="text-sm text-green-400">20%</span>
                        </div>
                        <Progress value={20} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-slate-400">Hardware</span>
                          <span className="text-sm text-purple-400">5%</span>
                        </div>
                        <Progress value={5} className="h-2" />
                      </div>
                      
                      <div className="pt-4 border-t border-slate-800">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-400">Favorite Startup</span>
                          <span className="text-white font-medium">{kpis?.favoriteStartup?.name}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Orders Tab */}
              <TabsContent value="orders" className="space-y-6 mt-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white">Order History</h2>
                    <p className="text-slate-400">Track and manage your purchases</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input placeholder="Search orders..." className="pl-10 w-64 bg-slate-800 border-slate-700 text-white" />
                    </div>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-32 bg-slate-800 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Orders</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  {orders.map((order) => (
                    <Card key={order.id} className="bg-slate-900 border-slate-800">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                              <Package className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-white font-semibold">{order.product.name}</h3>
                              <p className="text-slate-400">{order.startup.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className="bg-slate-700 text-slate-300 text-xs">{order.product.category}</Badge>
                                <span className="text-xs text-slate-500">Ordered {formatDate(order.created_at)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-white font-semibold text-lg">{formatCurrency(order.final_amount)}</p>
                            {order.discount_amount > 0 && (
                              <p className="text-sm text-green-400">Saved {formatCurrency(order.discount_amount)}</p>
                            )}
                            <Badge className={`mt-1 ${getStatusColor(order.status)}`}>
                              {getStatusIcon(order.status)}
                              <span className="ml-1 capitalize">{order.status}</span>
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Favorites Tab */}
              <TabsContent value="favorites" className="space-y-6 mt-0">
                <div>
                  <h2 className="text-xl font-bold text-white">Favorite Products</h2>
                  <p className="text-slate-400">Products you've saved for later</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favoriteProducts.map((product) => (
                    <Card key={product.id} className="bg-slate-900 border-slate-800">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <Package className="h-6 w-6 text-white" />
                          </div>
                          <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-300">
                            <Heart className="h-4 w-4 fill-current" />
                          </Button>
                        </div>
                        <h3 className="text-white font-semibold mb-2">{product.name}</h3>
                        <p className="text-slate-400 text-sm mb-3">{product.startup.name}</p>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-2xl font-bold text-white">{formatCurrency(product.price)}</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-slate-300">{product.rating}</span>
                          </div>
                        </div>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Savings Tab */}
              <TabsContent value="savings" className="space-y-6 mt-0">
                <div>
                  <h2 className="text-xl font-bold text-white">Savings & Discounts</h2>
                  <p className="text-slate-400">Your discount history and available offers</p>
                </div>

                <Card className="bg-slate-900 border-slate-800">
                  <CardContent className="p-6">
                    <div className="text-center py-8 text-slate-400">
                      <Gift className="h-12 w-12 mx-auto mb-4" />
                      <p>Savings and discounts features coming soon</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-6 mt-0">
                <div>
                  <h2 className="text-xl font-bold text-white">Profile Settings</h2>
                  <p className="text-slate-400">Manage your account preferences</p>
                </div>

                <Card className="bg-slate-900 border-slate-800">
                  <CardContent className="p-6">
                    <div className="text-center py-8 text-slate-400">
                      <Settings className="h-12 w-12 mx-auto mb-4" />
                      <p>Profile management features coming soon</p>
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
