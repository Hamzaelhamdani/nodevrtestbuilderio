import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { adminService } from "../../services/adminService";
import { startupService } from "../../services/startupService";
import { structureService } from "../../services/structureService";
import {
  Shield,
  Users,
  Building2,
  Rocket,
  CheckCircle,
  XCircle,
  Search,
  Settings,
  RefreshCw,
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Calendar,
  Clock,
  ArrowUpRight,
  Plus,
  Filter,
  MoreHorizontal,
  Bell,
  User,
  Star,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Separator } from "../ui/separator";
import { toast } from "sonner";

interface AdminPortalProps {
  user?: any;
}

export function AdminPortal({ user }: AdminPortalProps) {
  const { user: authUser } = useAuth();
  const currentUser = user || authUser;
  const navigate = useNavigate();

  // State management
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showRefresh, setShowRefresh] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [timeRange, setTimeRange] = useState("7d");

  // Real data state
  const [platformStats, setPlatformStats] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [pendingStartups, setPendingStartups] = useState<any[]>([]);
  const [pendingStructures, setPendingStructures] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [allStartups, setAllStartups] = useState<any[]>([]);
  const [allStructures, setAllStructures] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [allOrders, setAllOrders] = useState<any[]>([]);

  // Load admin data on component mount
  useEffect(() => {
    loadAdminData();
  }, []);

  // Load all admin data
  const loadAdminData = async () => {
    try {
      setLoading(true);
      
      const [
        kpis,
        users,
        startups,
        structures,
        products,
        orders
      ] = await Promise.all([
        adminService.getAdminKPIs(),
        adminService.getAllUsers(),
        adminService.getAllStartups(),
        adminService.getAllStructures(),
        adminService.getAllProducts(),
        adminService.getAllOrders()
      ]);

      setPlatformStats(kpis);
      setAllUsers(users);
      setAllStartups(startups);
      setAllStructures(structures);
      setAllProducts(products);
      setAllOrders(orders);

      // Filter pending items
      setPendingStartups(startups.filter(s => !s.is_approved));
      setPendingStructures(structures.filter(s => !s.is_approved));

      // Generate recent activity from real data
      generateRecentActivity(users, startups, structures, orders);

    } catch (error) {
      console.error("Error loading admin data:", error);
      toast.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  // Generate recent activity from real data
  const generateRecentActivity = (users: any[], startups: any[], structures: any[], orders: any[]) => {
    const activities = [];
    
    // Recent signups
    const recentUsers = users.slice(-3).map(user => ({
      id: `user-${user.id}`,
      type: "signup",
      user: user.full_name,
      role: user.role,
      timestamp: user.created_at,
      status: user.is_approved ? "approved" : "pending",
      details: `New ${user.role} registration`,
    }));

    // Recent orders
    const recentOrders = orders.slice(-3).map(order => ({
      id: `order-${order.id}`,
      type: "transaction",
      user: `Order #${order.id.substring(0, 8)}`,
      role: "order",
      timestamp: order.created_at,
      status: order.status,
      amount: order.final_amount,
      details: `Product purchase`,
    }));

    activities.push(...recentUsers, ...recentOrders);
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    setRecentActivity(activities.slice(0, 6));
  };

  // Function to handle startup approvals
  const handleApproveStartup = async (id: string) => {
    try {
      setLoading(true);
      const result = await adminService.approveStartup(id);
      
      if (result.success) {
        toast.success("Startup approved successfully");
        setPendingStartups(prev => prev.filter(s => s.id !== id));
        setAllStartups(prev => prev.map(s => s.id === id ? { ...s, is_approved: true } : s));
      } else {
        toast.error(result.message || "Failed to approve startup");
      }
    } catch (error) {
      console.error("Error approving startup:", error);
      toast.error("Failed to approve startup");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle startup rejections
  const handleRejectStartup = async (id: string) => {
    try {
      setLoading(true);
      setPendingStartups(prev => prev.filter(s => s.id !== id));
      toast.success("Startup rejected");
    } catch (error) {
      console.error("Error rejecting startup:", error);
      toast.error("Failed to reject startup");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle structure approvals
  const handleApproveStructure = async (id: string) => {
    try {
      setLoading(true);
      const result = await adminService.approveStructure(id);
      
      if (result.success) {
        toast.success("Structure approved successfully");
        setPendingStructures(prev => prev.filter(s => s.id !== id));
        setAllStructures(prev => prev.map(s => s.id === id ? { ...s, is_approved: true } : s));
      } else {
        toast.error(result.message || "Failed to approve structure");
      }
    } catch (error) {
      console.error("Error approving structure:", error);
      toast.error("Failed to approve structure");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle user approvals
  const handleApproveUser = async (id: string) => {
    try {
      setLoading(true);
      const result = await adminService.approveUser(id);
      
      if (result.success) {
        toast.success("User approved successfully");
        setAllUsers(prev => prev.map(u => u.id === id ? { ...u, is_approved: true } : u));
      } else {
        toast.error(result.message || "Failed to approve user");
      }
    } catch (error) {
      console.error("Error approving user:", error);
      toast.error("Failed to approve user");
    } finally {
      setLoading(false);
    }
  };

  // Function to refresh data
  const refreshData = () => {
    setShowRefresh(true);
    loadAdminData().finally(() => {
      setShowRefresh(false);
      toast.success("Data refreshed successfully", {
        description: `Last updated: ${new Date().toLocaleTimeString()}`,
      });
    });
  };

  // Helper functions
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercent = (value: number, showSign = true) => {
    const sign = showSign && value > 0 ? "+" : "";
    return `${sign}${value.toFixed(1)}%`;
  };

  const getBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
      case "completed":
      case "paid":
        return "bg-chart-1/20 text-chart-1 border-chart-1/30";
      case "pending":
        return "bg-chart-5/20 text-chart-5 border-chart-5/30";
      case "rejected":
        return "bg-destructive/20 text-destructive border-destructive/30";
      case "resolved":
        return "bg-chart-3/20 text-chart-3 border-chart-3/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getBadgeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "signup":
        return <User className="h-3 w-3" />;
      case "approval":
        return <CheckCircle className="h-3 w-3" />;
      case "transaction":
        return <DollarSign className="h-3 w-3" />;
      case "commission":
        return <BarChart3 className="h-3 w-3" />;
      case "report":
        return <Settings className="h-3 w-3" />;
      default:
        return <Bell className="h-3 w-3" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch(role) {
      case 'admin': return 'bg-red-500/20 text-red-400';
      case 'startup': return 'bg-green-500/20 text-green-400';
      case 'structure': return 'bg-orange-500/20 text-orange-400';
      case 'client': return 'bg-purple-500/20 text-purple-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusColor = (isApproved: boolean) => {
    return isApproved ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-red-500" />
                <div>
                  <h1 className="text-xl font-bold text-white">Admin Portal</h1>
                  <p className="text-sm text-slate-400">Manage platform, users, and approvals</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search admin portal..."
                  className="pl-10 w-80 bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white" onClick={refreshData}>
                <RefreshCw className={`h-4 w-4 ${showRefresh ? "animate-spin" : ""}`} />
              </Button>
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                <Bell className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2 text-sm">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-red-500 text-white text-xs">SA</AvatarFallback>
                </Avatar>
                <span className="text-slate-300">System Administrator</span>
              </div>
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
                value="dashboard" 
                className="bg-transparent border-none text-slate-400 data-[state=active]:text-blue-400 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-400 rounded-none pb-3"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger 
                value="startups" 
                className="bg-transparent border-none text-slate-400 data-[state=active]:text-blue-400 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-400 rounded-none pb-3"
              >
                <Rocket className="h-4 w-4 mr-2" />
                Startups
              </TabsTrigger>
              <TabsTrigger 
                value="support" 
                className="bg-transparent border-none text-slate-400 data-[state=active]:text-blue-400 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-400 rounded-none pb-3"
              >
                <Building2 className="h-4 w-4 mr-2" />
                Support Structures
              </TabsTrigger>
              <TabsTrigger 
                value="users" 
                className="bg-transparent border-none text-slate-400 data-[state=active]:text-blue-400 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-400 rounded-none pb-3"
              >
                <Users className="h-4 w-4 mr-2" />
                Users
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="bg-transparent border-none text-slate-400 data-[state=active]:text-blue-400 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-400 rounded-none pb-3"
              >
                <PieChart className="h-4 w-4 mr-2" />
                Analytics
              </TabsTrigger>
              <TabsTrigger 
                value="commissions" 
                className="bg-transparent border-none text-slate-400 data-[state=active]:text-blue-400 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-400 rounded-none pb-3"
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Commissions
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="bg-transparent border-none text-slate-400 data-[state=active]:text-blue-400 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-400 rounded-none pb-3"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>

            <div className="container mx-auto px-6 py-6">
              {/* Dashboard Tab */}
              <TabsContent value="dashboard" className="space-y-6 mt-0">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-400 mb-1">Total Users</p>
                          <p className="text-2xl font-bold text-white">{platformStats?.totalUsers?.toLocaleString() || "0"}</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                          <Users className="h-6 w-6 text-purple-400" />
                        </div>
                      </div>
                      <div className="mt-4">
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          +12.4% from last month
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-400 mb-1">Total Revenue</p>
                          <p className="text-2xl font-bold text-white">{formatCurrency(platformStats?.globalRevenue || 0)}</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                          <DollarSign className="h-6 w-6 text-orange-400" />
                        </div>
                      </div>
                      <div className="mt-4">
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          +15.2% from last month
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-400 mb-1">Startups</p>
                          <p className="text-2xl font-bold text-white">{platformStats?.totalStartups?.toLocaleString() || "0"}</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
                          <Rocket className="h-6 w-6 text-green-400" />
                        </div>
                      </div>
                      <div className="mt-4">
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                          <Clock className="h-3 w-3 mr-1" />
                          {pendingStartups.length} pending approvals
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-400 mb-1">Support Structures</p>
                          <p className="text-2xl font-bold text-white">{platformStats?.totalStructures?.toLocaleString() || "0"}</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-blue-400" />
                        </div>
                      </div>
                      <div className="mt-4">
                        <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                          <DollarSign className="h-3 w-3 mr-1" />
                          {formatCurrency(platformStats?.globalCommissions || 0)} in commissions
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity & Pending Startups */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                      <CardTitle className="text-white">Recent Activity</CardTitle>
                      <CardDescription className="text-slate-400">Latest platform events and transactions</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {recentActivity.length > 0 ? recentActivity.map((activity, index) => (
                        <div key={activity.id} className="flex items-start justify-between p-3 bg-slate-800/50 rounded-lg">
                          <div className="flex items-start gap-3">
                            <div className={`mt-0.5 p-1.5 rounded-full ${
                              activity.type === "signup" ? "bg-chart-3/20" :
                              activity.type === "approval" ? "bg-chart-1/20" :
                              activity.type === "transaction" ? "bg-chart-4/20" :
                              activity.type === "commission" ? "bg-chart-5/20" : "bg-muted/50"
                            }`}>
                              {getBadgeIcon(activity.type)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium">{activity.user}</p>
                                <Badge variant="outline" className={`text-xs ${getBadgeVariant(activity.status)}`}>
                                  {activity.status}
                                </Badge>
                              </div>
                              <p className="text-xs text-slate-400 mt-1">{activity.details}</p>
                              {activity.amount && (
                                <p className="text-xs font-medium mt-1">{formatCurrency(activity.amount)}</p>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-slate-500">{formatDate(activity.timestamp)}</p>
                        </div>
                      )) : (
                        <div className="text-center py-8 text-slate-400">
                          <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>No recent activity</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle>Pending Startups</CardTitle>
                        <Badge variant="outline" className="bg-chart-5/20 text-chart-5 border-chart-5/30">
                          {pendingStartups.length} pending
                        </Badge>
                      </div>
                      <CardDescription>New startups waiting for approval</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="space-y-0">
                        {pendingStartups.length > 0 ? pendingStartups.slice(0, 3).map((startup, index) => (
                          <div key={startup.id} className={`flex items-center justify-between p-4 ${
                            index !== Math.min(3, pendingStartups.length) - 1 ? "border-b border-border/30" : ""
                          }`}>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-muted text-primary">
                                  {startup.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">{startup.name}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className="text-xs bg-muted/30">
                                    {startup.industry || startup.stage || "Startup"}
                                  </Badge>
                                  <p className="text-xs text-muted-foreground">{formatDate(startup.created_at)}</p>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-destructive/50 text-destructive hover:bg-destructive/10 h-8"
                                onClick={() => handleRejectStartup(startup.id)}
                                disabled={loading}
                              >
                                <XCircle className="h-3.5 w-3.5 mr-1" />
                                Reject
                              </Button>
                              <Button
                                variant="default"
                                size="sm"
                                className="bg-chart-1 text-chart-1-foreground hover:bg-chart-1/90 h-8"
                                onClick={() => handleApproveStartup(startup.id)}
                                disabled={loading}
                              >
                                <CheckCircle className="h-3.5 w-3.5 mr-1" />
                                Approve
                              </Button>
                            </div>
                          </div>
                        )) : (
                          <div className="p-8 text-center text-muted-foreground">
                            <Rocket className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p>No pending startup approvals</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Startups Tab */}
              <TabsContent value="startups" className="space-y-6 mt-0">
                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white">Startup Management</CardTitle>
                    <CardDescription className="text-slate-400">Approve, manage, and monitor platform startups</CardDescription>
                  </CardHeader>
                </Card>
                
                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-white">Startup Registration Approval</CardTitle>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="border-slate-700 text-slate-300">
                          Swipe right to approve
                        </Button>
                        <Button variant="outline" size="sm" className="border-slate-700 text-slate-300">
                          Swipe left to reject
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {pendingStartups.length > 0 ? pendingStartups.map((startup) => (
                      <div key={startup.id} className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg">
                        <div className="h-12 w-12 rounded-lg bg-slate-700 flex items-center justify-center text-white font-bold">
                          {startup.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-white font-medium">{startup.name}</h3>
                            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">{startup.industry || startup.stage || "Startup"}</Badge>
                          </div>
                          <p className="text-sm text-slate-400">{startup.location || "Location not specified"}</p>
                        </div>
                        <div className="text-right mr-4">
                          <p className="text-sm text-white">{startup.founded_date ? `Founded ${startup.founded_date.split('-')[0]}` : "Founded recently"}</p>
                          <p className="text-xs text-slate-400">Submitted {formatDate(startup.created_at)}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10" onClick={() => handleRejectStartup(startup.id)} disabled={loading}>
                            <XCircle className="h-3 w-3 mr-1" />
                            Reject
                          </Button>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleApproveStartup(startup.id)} disabled={loading}>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Approve
                          </Button>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-8 text-slate-400">
                        <Rocket className="h-12 w-12 mx-auto mb-4" />
                        <p>No pending startup approvals</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Support Structures Tab */}
              <TabsContent value="support" className="space-y-6 mt-0">
                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white">Support Structure Management</CardTitle>
                    <CardDescription className="text-slate-400">Approve and manage incubators, accelerators, and other support structures</CardDescription>
                  </CardHeader>
                </Card>
                
                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-white">Support Structure Verification</CardTitle>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="border-slate-700 text-slate-300">
                          Swipe right to approve
                        </Button>
                        <Button variant="outline" size="sm" className="border-slate-700 text-slate-300">
                          Swipe left to reject
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {pendingStructures.length > 0 ? pendingStructures.map((structure) => (
                      <div key={structure.id} className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg">
                        <div className="h-12 w-12 rounded-lg bg-slate-700 flex items-center justify-center text-white font-bold">
                          {structure.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-white font-medium">{structure.name}</h3>
                            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs capitalize">{structure.structure_type}</Badge>
                          </div>
                          <p className="text-sm text-slate-400">Last active: Recently</p>
                        </div>
                        <div className="text-right mr-4">
                          <p className="text-sm text-white">{structure.location || "Location not specified"}</p>
                          <p className="text-xs text-slate-400">{structure.established_year ? `Est. ${structure.established_year}` : "Recently established"}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10" onClick={() => handleRejectStartup(structure.id)} disabled={loading}>
                            <XCircle className="h-3 w-3 mr-1" />
                            Reject
                          </Button>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleApproveStructure(structure.id)} disabled={loading}>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Approve
                          </Button>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-8 text-slate-400">
                        <Building2 className="h-12 w-12 mx-auto mb-4" />
                        <p>No pending structure approvals</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Users Tab */}
              <TabsContent value="users" className="space-y-6 mt-0">
                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white">User Management</CardTitle>
                        <CardDescription className="text-slate-400">View and manage platform users</CardDescription>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input placeholder="Search users..." className="pl-10 w-64 bg-slate-800 border-slate-700 text-white" />
                        </div>
                        <Button variant="outline" className="border-slate-700 text-slate-300">All Users</Button>
                        <Button className="bg-orange-600 hover:bg-orange-700">Add User</Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-slate-800">
                            <th className="text-left py-3 px-4 text-slate-400 font-medium">User</th>
                            <th className="text-left py-3 px-4 text-slate-400 font-medium">Role</th>
                            <th className="text-left py-3 px-4 text-slate-400 font-medium">Status</th>
                            <th className="text-left py-3 px-4 text-slate-400 font-medium">Joined</th>
                            <th className="text-left py-3 px-4 text-slate-400 font-medium">Last Active</th>
                            <th className="text-left py-3 px-4 text-slate-400 font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {allUsers.slice(0, 10).map((user) => (
                            <tr key={user.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 rounded-lg bg-slate-700 flex items-center justify-center text-white font-bold text-sm">
                                    {user.full_name.substring(0, 2).toUpperCase()}
                                  </div>
                                  <div>
                                    <p className="text-white font-medium">{user.full_name}</p>
                                    <p className="text-xs text-slate-400">{user.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <Badge className={`${getRoleColor(user.role)} border-none`}>{user.role}</Badge>
                              </td>
                              <td className="py-3 px-4">
                                <Badge className={`${getStatusColor(user.is_approved)} border-none`}>{user.is_approved ? 'active' : 'pending'}</Badge>
                              </td>
                              <td className="py-3 px-4 text-slate-300 text-sm">{formatDate(user.created_at)}</td>
                              <td className="py-3 px-4 text-slate-300 text-sm">Recently</td>
                              <td className="py-3 px-4">
                                {!user.is_approved && (
                                  <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white mr-2" onClick={() => handleApproveUser(user.id)} disabled={loading}>
                                    Approve
                                  </Button>
                                )}
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800">
                      <p className="text-sm text-slate-400">Showing {Math.min(10, allUsers.length)} of {allUsers.length} users</p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="border-slate-700 text-slate-300">Previous</Button>
                        <Button variant="outline" size="sm" className="border-slate-700 text-slate-300">Next</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-6 mt-0">
                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white">Platform Analytics</CardTitle>
                    <CardDescription className="text-slate-400">Track platform growth, user behavior, and financial metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-slate-400">
                      <PieChart className="h-12 w-12 mx-auto mb-4" />
                      <p>Advanced analytics dashboard coming soon</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Commissions Tab */}
              <TabsContent value="commissions" className="space-y-6 mt-0">
                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white">Commission Management</CardTitle>
                    <CardDescription className="text-slate-400">Manage commission rates, payouts, and financial oversight</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-slate-400">
                      <DollarSign className="h-12 w-12 mx-auto mb-4" />
                      <p>Commission management features coming soon</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-6 mt-0">
                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white">Platform Settings</CardTitle>
                    <CardDescription className="text-slate-400">Configure global platform settings and preferences</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-slate-400">
                      <Settings className="h-12 w-12 mx-auto mb-4" />
                      <p>Settings panel coming soon</p>
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
