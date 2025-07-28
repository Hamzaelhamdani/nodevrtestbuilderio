import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { AddStartupForm } from "./AddStartupForm";
import { PortfolioAnalysis } from "./PortfolioAnalysis";
import { StartupPortfolio } from "./StartupPortfolio";
import { CommissionTracking } from "./CommissionTracking";
import { SettingsPanel } from "./SettingsPanel";
import { 
  LayoutDashboardIcon, 
  RocketIcon, 
  BarChart3Icon, 
  UsersIcon,
  PlusIcon,
  BanknoteIcon,
  SettingsIcon,
  InfoIcon
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Route } from "../layout/NavigationBar";

interface SupportStructureDashboardProps {
  user: any;
  navigate?: (route: Route) => void;
}

export function SupportStructureDashboard({ 
  user,
  navigate
}: SupportStructureDashboardProps) {
  const [showAddStartupForm, setShowAddStartupForm] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("portfolio");
  
  const handleStartupSelect = (startupId: string) => {
    console.log(`Selected startup: ${startupId}`);
    // If navigate function is provided, you could navigate to a detailed view
    if (navigate) {
      navigate("startup-storefront");
    }
  };
  
  const handleAddStartupClick = () => {
    setShowAddStartupForm(true);
  };
  
  const handleAddStartupClose = (addedStartup?: any) => {
    setShowAddStartupForm(false);
    if (addedStartup) {
      // Refresh startups or show success message
      console.log("Added startup:", addedStartup);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-8">
        <div>
          <h1 className="mb-2">Support Structure Dashboard</h1>
          <p className="text-muted-foreground max-w-2xl">
            Manage your startup portfolio, track performance metrics, and optimize your support efforts.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => setActiveTab("analytics")}
          >
            <BarChart3Icon className="h-4 w-4" />
            Analytics
          </Button>
          
          <Button 
            className="gap-2 bg-chart-4 text-white hover:bg-chart-4/90"
            onClick={handleAddStartupClick}
          >
            <PlusIcon className="h-4 w-4" />
            Add Startup
          </Button>
        </div>
      </div>
      
      <Tabs 
        defaultValue="portfolio" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full space-y-6"
      >
        <TabsList className="grid grid-cols-3 md:grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="portfolio" className="flex items-center gap-2">
            <RocketIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Startup</span> Portfolio
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3Icon className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="commissions" className="flex items-center gap-2">
            <BanknoteIcon className="h-4 w-4" />
            Commissions
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="portfolio" className="space-y-8">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Startup Portfolio</CardTitle>
                  <CardDescription>
                    Manage the startups you support and promote
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-1.5"
                  onClick={handleAddStartupClick}
                >
                  <PlusIcon className="h-3.5 w-3.5" />
                  Add Startup
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <StartupPortfolio onStartupSelect={handleStartupSelect} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-8">
          <PortfolioAnalysis />
        </TabsContent>
        
        <TabsContent value="commissions" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Commission Tracking</CardTitle>
              <CardDescription>
                Monitor your earnings from startup partnerships
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CommissionTracking />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Support Structure Settings</CardTitle>
              <CardDescription>
                Manage your preferences and account settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SettingsPanel user={user} onSave={(data) => console.log("Settings saved:", data)} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Add Startup Form Dialog */}
      {showAddStartupForm && (
        <AddStartupForm onClose={handleAddStartupClose} />
      )}
    </div>
  );
}