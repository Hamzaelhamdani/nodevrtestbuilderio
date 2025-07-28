
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { ShieldCheckIcon, RocketIcon, BuildingIcon, UserIcon } from "lucide-react";

interface BackOfficeCredential {
  email: string;
  password: string;
  name: string;
  role: string;
  avatar?: string;
}

export function BackOfficeAccessGuide() {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Sample credentials for quick login
  const demoCredentials: Record<string, BackOfficeCredential> = {
    startup: {
      email: "startup@venturesroom.com",
      password: "startup123",
      name: "TechCrafter",
      role: "startup",
      avatar: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=400&h=400&auto=format&fit=crop&q=80"
    },
    support: {
      email: "accelerator@venturesroom.com",
      password: "support123",
      name: "LaunchPad Accelerator",
      role: "support",
      avatar: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400&h=400&auto=format&fit=crop&q=80"
    },
    admin: {
      email: "admin@venturesroom.com",
      password: "admin123",
      name: "Platform Admin",
      role: "admin",
      avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=400&h=400&auto=format&fit=crop&q=80"
    },
    client: {
      email: "client@venturesroom.com",
      password: "client123",
      name: "Enterprise Client",
      role: "client",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&auto=format&fit=crop&q=80"
    }
  };

  const handleQuickLogin = (credentialKey: string) => {
    const userData = demoCredentials[credentialKey];
    
    // Use the global login function defined in App.tsx
    if (typeof window !== "undefined" && window.handleLogin) {
      // @ts-ignore
      window.handleLogin(userData);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="border border-border/50 shadow-md">
        <CardHeader className="bg-primary/5">
          <CardTitle className="flex items-center gap-2">
            <span>VenturesRoom Back Office Access</span>
          </CardTitle>
          <CardDescription>
            Learn how to access different back office interfaces based on your role
          </CardDescription>
        </CardHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-6 p-1 bg-muted mx-4 mt-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="access-paths">Access Paths</TabsTrigger>
            <TabsTrigger value="quick-login">Quick Login</TabsTrigger>
          </TabsList>
          
          <CardContent>
            <TabsContent value="overview" className="space-y-4">
              <div className="space-y-4">
                <h3>Back Office Access Overview</h3>
                <p>VenturesRoom provides different back office interfaces based on your account role:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  <Card className="border border-primary/20 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <RocketIcon className="w-5 h-5 text-primary" />
                      <h4 className="text-lg">Startup Dashboard</h4>
                    </div>
                    <p className="text-sm">Manage your startup's products, inventory, and storefront</p>
                  </Card>
                  
                  <Card className="border border-tertiary/20 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <BuildingIcon className="w-5 h-5 text-tertiary" />
                      <h4 className="text-lg">Support Structure</h4>
                    </div>
                    <p className="text-sm">Manage your incubator/accelerator and supported startups</p>
                  </Card>
                  
                  <Card className="border border-destructive/20 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <ShieldCheckIcon className="w-5 h-5 text-destructive" />
                      <h4 className="text-lg">Admin Portal</h4>
                    </div>
                    <p className="text-sm">Platform administration, verification, and management</p>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="access-paths" className="space-y-4">
              <div className="space-y-4">
                <h3>Access Paths</h3>
                <p>There are multiple ways to access back office functions:</p>
                
                <div className="space-y-4 mt-4">
                  <div className="border border-border rounded-lg p-4">
                    <h4 className="text-lg mb-2">Navigation Bar</h4>
                    <p className="text-sm mb-2">The side navigation bar adapts based on your role to show relevant access points.</p>
                    <div className="flex flex-col gap-2 mt-4">
                      <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                        <RocketIcon className="w-4 h-4 text-primary" />
                        <span className="text-sm">Startup Dashboard</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                        <ShieldCheckIcon className="w-4 h-4 text-destructive" />
                        <span className="text-sm">Admin Portal</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border border-border rounded-lg p-4">
                    <h4 className="text-lg mb-2">Direct URL Navigation</h4>
                    <p className="text-sm mb-2">You can also access these areas via direct navigation (requires login):</p>
                    <div className="space-y-2 mt-4">
                      <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                        <span className="text-sm font-mono">/startup-dashboard</span>
                        <span className="text-xs bg-primary/20 text-primary-foreground px-2 py-1 rounded">Startup Role</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                        <span className="text-sm font-mono">/support-structure-dashboard</span>
                        <span className="text-xs bg-tertiary/20 text-tertiary-foreground px-2 py-1 rounded">Support Role</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                        <span className="text-sm font-mono">/admin-portal</span>
                        <span className="text-xs bg-destructive/20 text-destructive-foreground px-2 py-1 rounded">Admin Role</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="quick-login" className="space-y-4">
              <div className="space-y-4">
                <h3>Quick Login</h3>
                <p>For demonstration purposes, you can use these accounts to access different back offices:</p>
                
                <div className="grid grid-cols-1 gap-4 mt-4">
                  {Object.entries(demoCredentials).map(([key, credential]) => (
                    <Card key={key} className="border border-border p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                          {key === "startup" && <RocketIcon className="w-5 h-5 text-primary" />}
                          {key === "support" && <BuildingIcon className="w-5 h-5 text-tertiary" />}
                          {key === "admin" && <ShieldCheckIcon className="w-5 h-5 text-destructive" />}
                          {key === "client" && <UserIcon className="w-5 h-5 text-chart-5" />}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-base font-medium">{credential.name}</h4>
                          <p className="text-xs text-muted-foreground">{credential.email}</p>
                        </div>
                        <Button 
                          onClick={() => handleQuickLogin(key)}
                          variant="outline"
                          className="ml-auto"
                        >
                          Login as {key}
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
        
        <CardFooter className="border-t border-border/50 bg-muted/50 flex justify-between">
          <p className="text-xs text-muted-foreground">
            Authentication required for back office access
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
