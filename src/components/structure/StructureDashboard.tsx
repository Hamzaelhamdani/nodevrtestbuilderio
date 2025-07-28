import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import { structureService } from "../../services/structureService";
import {
  Building2,
  Rocket,
  DollarSign,
  Users,
  TrendingUp,
  TrendingDown,
  Plus,
  Send,
  Eye,
  BarChart3,
  MessageSquare,
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
  Mail,
  Phone,
  Globe,
  MapPin,
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

interface StructureDashboardProps {
  user?: any;
}

export function StructureDashboard({ user }: StructureDashboardProps) {
  const { user: authUser } = useAuth();
  const currentUser = user || authUser;
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [structure, setStructure] = useState<any>(null);
  const [supportedStartups, setSupportedStartups] = useState<any[]>([]);
  const [kpis, setKpis] = useState<any>(null);
  const [pendingInvitations, setPendingInvitations] = useState<any[]>([]);

  // Mock data for demonstration
  const mockStructure = {
    id: "structure-1",
    name: "TechBoost Accelerator",
    description: "Leading technology accelerator focusing on AI and SaaS startups",
    logo_url: "",
    website: "https://techboost.com",
    structure_type: "accelerator",
    location: "London, UK",
    established_year: 2018,
    focus_areas: ["AI/ML", "SaaS", "Fintech", "IoT"],
    is_approved: true,
  };

  const mockSupportedStartups = [
    {
      id: "1",
      startup: {
        name: "AI Analytics Pro",
        description: "Advanced AI analytics platform",
        industry: "AI/ML",
        stage: "Seed",
        team_size: 12,
      },
      status: "accepted",
      commission_rate: 15,
      total_revenue: 12450,
      commission_earned: 1867.50,
    },
    {
      id: "2",
      startup: {
        name: "DataSphere",
        description: "Big data processing solutions",
        industry: "Data",
        stage: "Series A", 
        team_size: 25,
      },
      status: "accepted",
      commission_rate: 12,
      total_revenue: 8900,
      commission_earned: 1068,
    },
  ];

  const mockKPIs = {
    startupsSupported: 5,
    invitationsSent: 12,
    invitationsPending: 3,
    invitationsAccepted: 5,
    totalCommissionsEarned: 2340.50,
    totalProductsFromStartups: 18,
    ordersFromSupportedStartups: 87,
    averageCommissionRate: 12.5,
  };

  const mockPendingInvitations = [
    {
      id: "1",
      startup: {
        name: "BlockVista",
        description: "Blockchain analytics platform",
        industry: "Fintech",
        stage: "Seed",
      },
      invited_at: new Date().toISOString(),
      status: "pending",
    },
  ];

  useEffect(() => {
    loadStructureData();
  }, []);

  const loadStructureData = async () => {
    try {
      setLoading(true);
      // Use mock data for demonstration
      setStructure(mockStructure);
      setSupportedStartups(mockSupportedStartups);
      setKpis(mockKPIs);
      setPendingInvitations(mockPendingInvitations);
    } catch (error) {
      console.error("Error loading structure data:", error);
      toast.error("Failed to load structure data");
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
              <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{structure?.name || "My Structure"}</h1>
                <p className="text-slate-400">{structure?.description || "Loading..."}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                    {structure?.structure_type || "Accelerator"}
                  </Badge>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    <MapPin className="h-3 w-3 mr-1" />
                    {structure?.location || "Location"}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="border-slate-700 text-slate-300">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button className="bg-orange-600 hover:bg-orange-700">
                <Send className="h-4 w-4 mr-2" />
                Invite Startup
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
                value="startups" 
                className="bg-transparent border-none text-slate-400 data-[state=active]:text-blue-400 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-400 rounded-none pb-3"
              >
                <Rocket className="h-4 w-4 mr-2" />
                Supported Startups
              </TabsTrigger>
              <TabsTrigger 
                value="invitations" 
                className="bg-transparent border-none text-slate-400 data-[state=active]:text-blue-400 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-400 rounded-none pb-3"
              >
                <Send className="h-4 w-4 mr-2" />
                Invitations
              </TabsTrigger>
              <TabsTrigger 
                value="commissions" 
                className="bg-transparent border-none text-slate-400 data-[state=active]:text-blue-400 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-400 rounded-none pb-3"
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Commissions
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
                          <p className="text-sm text-slate-400 mb-1">Startups Supported</p>
                          <p className="text-2xl font-bold text-white">{kpis?.startupsSupported || 0}</p>
                        </div>
                        <Rocket className="h-8 w-8 text-blue-400" />
                      </div>
                      <p className="text-xs text-slate-500 mt-2">Active partnerships</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-400 mb-1">Commissions Earned</p>
                          <p className="text-2xl font-bold text-white">{formatCurrency(kpis?.totalCommissionsEarned || 0)}</p>
                        </div>
                        <DollarSign className="h-8 w-8 text-green-400" />
                      </div>
                      <p className="text-xs text-slate-500 mt-2">Total earnings</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-400 mb-1">Invitations Sent</p>
                          <p className="text-2xl font-bold text-white">{kpis?.invitationsSent || 0}</p>
                        </div>
                        <Send className="h-8 w-8 text-purple-400" />
                      </div>
                      <p className="text-xs text-slate-500 mt-2">{kpis?.invitationsPending || 0} pending</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-400 mb-1">Avg. Commission</p>
                          <p className="text-2xl font-bold text-white">{kpis?.averageCommissionRate || 0}%</p>
                        </div>
                        <Percent className="h-8 w-8 text-orange-400" />
                      </div>
                      <p className="text-xs text-slate-500 mt-2">Commission rate</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity & Performance */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                      <CardTitle className="text-white">Recent Activity</CardTitle>
                      <CardDescription className="text-slate-400">Latest startup interactions</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[
                        { action: "Commission Payment", startup: "AI Analytics Pro", amount: 450.75, time: "2 hours ago", type: "payment" },
                        { action: "New Order", startup: "DataSphere", amount: 299.99, time: "5 hours ago", type: "order" },
                        { action: "Invitation Accepted", startup: "BlockVista", amount: null, time: "1 day ago", type: "invitation" },
                      ].map((activity, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                              activity.type === 'payment' ? 'bg-green-500/20' :
                              activity.type === 'order' ? 'bg-blue-500/20' : 'bg-purple-500/20'
                            }`}>
                              {activity.type === 'payment' && <DollarSign className="h-4 w-4 text-green-400" />}
                              {activity.type === 'order' && <ShoppingCart className="h-4 w-4 text-blue-400" />}
                              {activity.type === 'invitation' && <Send className="h-4 w-4 text-purple-400" />}
                            </div>
                            <div>
                              <p className="text-white font-medium">{activity.action}</p>
                              <p className="text-sm text-slate-400">{activity.startup} • {activity.time}</p>
                            </div>
                          </div>
                          {activity.amount && (
                            <span className="text-white font-medium">{formatCurrency(activity.amount)}</span>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                      <CardTitle className="text-white">Performance Metrics</CardTitle>
                      <CardDescription className="text-slate-400">Structure performance indicators</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-slate-400">Startup Success Rate</span>
                          <span className="text-sm text-green-400">85%</span>
                        </div>
                        <Progress value={85} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-slate-400">Commission Growth</span>
                          <span className="text-sm text-blue-400">+32%</span>
                        </div>
                        <Progress value={68} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-slate-400">Response Rate</span>
                          <span className="text-sm text-purple-400">76%</span>
                        </div>
                        <Progress value={76} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Supported Startups Tab */}
              <TabsContent value="startups" className="space-y-6 mt-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white">Supported Startups</h2>
                    <p className="text-slate-400">Startups in your portfolio</p>
                  </div>
                  <Button className="bg-orange-600 hover:bg-orange-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Invite New Startup
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {supportedStartups.map((item) => (
                    <Card key={item.id} className="bg-slate-900 border-slate-800">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                              <Rocket className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-white font-semibold">{item.startup.name}</h3>
                              <p className="text-slate-400 text-sm">{item.startup.description}</p>
                            </div>
                          </div>
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            {item.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-slate-400">Industry</p>
                            <p className="text-white font-medium">{item.startup.industry}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-400">Stage</p>
                            <p className="text-white font-medium">{item.startup.stage}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-400">Team Size</p>
                            <p className="text-white font-medium">{item.startup.team_size}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-400">Commission Rate</p>
                            <p className="text-white font-medium">{item.commission_rate}%</p>
                          </div>
                        </div>

                        <div className="border-t border-slate-800 pt-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-slate-400">Total Revenue</span>
                            <span className="text-white font-medium">{formatCurrency(item.total_revenue)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-400">Commission Earned</span>
                            <span className="text-green-400 font-medium">{formatCurrency(item.commission_earned)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Invitations Tab */}
              <TabsContent value="invitations" className="space-y-6 mt-0">
                <div>
                  <h2 className="text-xl font-bold text-white">Startup Invitations</h2>
                  <p className="text-slate-400">Manage sent and pending invitations</p>
                </div>

                <Card className="bg-slate-900 border-slate-800">
                  <CardContent className="p-6">
                    <div className="text-center py-8 text-slate-400">
                      <Send className="h-12 w-12 mx-auto mb-4" />
                      <p>Invitation management features coming soon</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Commissions Tab */}
              <TabsContent value="commissions" className="space-y-6 mt-0">
                <div>
                  <h2 className="text-xl font-bold text-white">Commission Management</h2>
                  <p className="text-slate-400">Track earnings and manage commission rates</p>
                </div>

                <Card className="bg-slate-900 border-slate-800">
                  <CardContent className="p-6">
                    <div className="text-center py-8 text-slate-400">
                      <DollarSign className="h-12 w-12 mx-auto mb-4" />
                      <p>Commission management features coming soon</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-6 mt-0">
                <div>
                  <h2 className="text-xl font-bold text-white">Structure Analytics</h2>
                  <p className="text-slate-400">Detailed performance insights</p>
                </div>

                <Card className="bg-slate-900 border-slate-800">
                  <CardContent className="p-6">
                    <div className="text-center py-8 text-slate-400">
                      <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                      <p>Analytics dashboard coming soon</p>
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
