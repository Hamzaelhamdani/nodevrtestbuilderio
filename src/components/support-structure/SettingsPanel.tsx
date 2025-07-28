import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Slider } from "../ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { 
  UserIcon, 
  BellIcon, 
  KeyIcon, 
  MonitorIcon, 
  RefreshCwIcon, 
  PencilIcon,
  BanknoteIcon,
  LinkIcon,
  ChevronsUpDownIcon,
  ShieldIcon,
  PaletteIcon,
  EyeIcon,
  SaveIcon,
  CheckIcon,
  AlertCircleIcon,
  LogOutIcon,
  TrashIcon,
  Upload,
  PlusIcon
} from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface SettingsPanelProps {
  user?: any;
  onSave?: (settingsData: any) => void;
}

export function SettingsPanel({ user, onSave }: SettingsPanelProps) {
  const [activeTab, setActiveTab] = useState("account");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "Sarah Johnson",
    email: user?.email || "sarah@supportstructure.com",
    role: user?.role || "support",
    bio: user?.bio || "Support structure manager with 5+ years experience helping startups scale in the fintech space.",
    avatar: user?.avatar || "",
    phone: user?.phone || "+1 (555) 123-4567",
    company: user?.company || "FinTech Ventures",
    website: user?.website || "fintechventures.co",
    location: user?.location || "San Francisco, CA"
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: user?.twoFactorEnabled || false,
    loginNotifications: user?.loginNotifications || true,
    sessionTimeout: user?.sessionTimeout || "60",
    deviceHistory: user?.deviceHistory || true
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: user?.emailNotifications || true,
    pushNotifications: user?.pushNotifications || true,
    startupUpdates: user?.startupUpdates || true,
    commissionAlerts: user?.commissionAlerts || true,
    weeklyReports: user?.weeklyReports || true,
    marketplaceUpdates: user?.marketplaceUpdates || false,
    newStartupNotifications: user?.newStartupNotifications || true
  });

  const [displaySettings, setDisplaySettings] = useState({
    theme: user?.theme || "dark",
    density: user?.density || "comfortable",
    animationsEnabled: user?.animationsEnabled || true,
    chartStyle: user?.chartStyle || "default"
  });

  const [commissionSettings, setCommissionSettings] = useState({
    defaultRate: user?.defaultRate || 10,
    minimumCommission: user?.minimumCommission || 5,
    payoutMethod: user?.payoutMethod || "bank_transfer",
    autoReinvest: user?.autoReinvest || false,
    payoutThreshold: user?.payoutThreshold || 100
  });

  const [integrationSettings, setIntegrationSettings] = useState({
    apiEnabled: user?.apiEnabled || false,
    webhooksEnabled: user?.webhooksEnabled || false,
    crmIntegration: user?.crmIntegration || "none",
    calendarSync: user?.calendarSync || false,
    slackNotifications: user?.slackNotifications || false
  });

  // Submit handler
  const handleSaveSettings = () => {
    setLoading(true);
    
    // Combine all settings
    const combinedSettings = {
      ...profileData,
      ...securitySettings,
      ...notificationSettings,
      ...displaySettings,
      ...commissionSettings,
      ...integrationSettings,
      lastUpdated: new Date().toISOString()
    };
    
    // Simulate API call
    setTimeout(() => {
      if (onSave) {
        onSave(combinedSettings);
      }
      setLoading(false);
      setSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">Support Structure Settings</h2>
        <p className="text-muted-foreground">
          Manage your account, preferences, and platform settings
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="overflow-x-auto pb-2">
          <TabsList className="w-full sm:w-auto inline-flex">
            <TabsTrigger value="account" className="flex items-center gap-2">
              <UserIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Account</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <ShieldIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <BellIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="display" className="flex items-center gap-2">
              <PaletteIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Display</span>
            </TabsTrigger>
            <TabsTrigger value="commissions" className="flex items-center gap-2">
              <BanknoteIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Commissions</span>
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Integrations</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Account Settings */}
        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal and business information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="flex flex-col items-center gap-3">
                  <Avatar className="h-28 w-28">
                    {profileData.avatar ? (
                      <AvatarImage src={profileData.avatar} alt={profileData.name} />
                    ) : (
                      <AvatarFallback className="text-2xl bg-tertiary text-tertiary-foreground">
                        {profileData.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Photo
                  </Button>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Full Name
                      </label>
                      <Input 
                        id="name" 
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                        className="h-10"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email Address
                      </label>
                      <Input 
                        id="email" 
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        className="h-10"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium">
                        Phone Number
                      </label>
                      <Input 
                        id="phone" 
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        className="h-10"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="location" className="text-sm font-medium">
                        Location
                      </label>
                      <Input 
                        id="location" 
                        value={profileData.location}
                        onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                        className="h-10"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="bio" className="text-sm font-medium">
                    Professional Bio
                  </label>
                  <Textarea 
                    id="bio" 
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    rows={4}
                    placeholder="Tell us about your experience and expertise"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="company" className="text-sm font-medium">
                      Company Name
                    </label>
                    <Input 
                      id="company" 
                      value={profileData.company}
                      onChange={(e) => setProfileData({...profileData, company: e.target.value})}
                      className="h-10"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="website" className="text-sm font-medium">
                      Website
                    </label>
                    <Input 
                      id="website" 
                      value={profileData.website}
                      onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                      className="h-10"
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-tertiary/10 text-tertiary border-tertiary/20">
                    Support Structure
                  </Badge>
                  <Badge variant="outline" className="bg-chart-4/10 text-chart-4 border-chart-4/20">
                    Verified
                  </Badge>
                  <Badge variant="outline" className="bg-muted text-muted-foreground">
                    Since 2023
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Account Preferences</CardTitle>
              <CardDescription>
                Update your account settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-medium">Language</h4>
                      <p className="text-xs text-muted-foreground">
                        Choose your preferred language
                      </p>
                    </div>
                    <Select defaultValue="en">
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="ja">Japanese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-medium">Time Zone</h4>
                      <p className="text-xs text-muted-foreground">
                        Set your local time zone
                      </p>
                    </div>
                    <Select defaultValue="pst">
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pst">Pacific (PST)</SelectItem>
                        <SelectItem value="mst">Mountain (MST)</SelectItem>
                        <SelectItem value="cst">Central (CST)</SelectItem>
                        <SelectItem value="est">Eastern (EST)</SelectItem>
                        <SelectItem value="utc">UTC</SelectItem>
                        <SelectItem value="gmt">GMT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-medium">Account Visibility</h4>
                      <p className="text-xs text-muted-foreground">
                        Control your profile visibility
                      </p>
                    </div>
                    <Select defaultValue="public">
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                        <SelectItem value="startups-only">Startups Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-medium">Marketing Emails</h4>
                      <p className="text-xs text-muted-foreground">
                        Receive platform updates and offers
                      </p>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Password & Authentication</CardTitle>
              <CardDescription>
                Manage your password and authentication settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="current-password" className="text-sm font-medium">
                      Current Password
                    </label>
                    <Input 
                      id="current-password" 
                      type="password"
                      placeholder="••••••••"
                      className="h-10"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="new-password" className="text-sm font-medium">
                      New Password
                    </label>
                    <Input 
                      id="new-password" 
                      type="password"
                      placeholder="••••••••"
                      className="h-10"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="confirm-password" className="text-sm font-medium">
                      Confirm New Password
                    </label>
                    <Input 
                      id="confirm-password" 
                      type="password"
                      placeholder="••••••••"
                      className="h-10"
                    />
                  </div>
                </div>
                
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-muted-foreground">Password strength: Strong</p>
                  <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                    <div className="bg-chart-1 h-full rounded-full" style={{ width: '80%' }}></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Strong passwords include a mix of letters, numbers, and symbols.
                  </p>
                </div>
                
                <div className="flex justify-end">
                  <Button className="bg-chart-4 text-white hover:bg-chart-4/90">
                    Update Password
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-medium">Two-Factor Authentication</h4>
                    <p className="text-xs text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch 
                    checked={securitySettings.twoFactorEnabled}
                    onCheckedChange={(checked) => setSecuritySettings({
                      ...securitySettings,
                      twoFactorEnabled: checked
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-medium">Login Notifications</h4>
                    <p className="text-xs text-muted-foreground">
                      Receive alerts for new sign-ins to your account
                    </p>
                  </div>
                  <Switch 
                    checked={securitySettings.loginNotifications}
                    onCheckedChange={(checked) => setSecuritySettings({
                      ...securitySettings,
                      loginNotifications: checked
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-medium">Session Timeout</h4>
                    <p className="text-xs text-muted-foreground">
                      Automatically log out after period of inactivity
                    </p>
                  </div>
                  <Select 
                    value={securitySettings.sessionTimeout}
                    onValueChange={(value) => setSecuritySettings({
                      ...securitySettings,
                      sessionTimeout: value
                    })}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                      <SelectItem value="0">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-medium">Device Management</h4>
                    <p className="text-xs text-muted-foreground">
                      View and manage devices that have accessed your account
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Manage Devices
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Account Actions</CardTitle>
              <CardDescription>
                Manage account-wide security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-medium">API Access</h4>
                    <p className="text-xs text-muted-foreground">
                      Manage your API keys and access
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Manage API Keys
                  </Button>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-medium text-destructive">Deactivate Account</h4>
                    <p className="text-xs text-muted-foreground">
                      Temporarily disable your account
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="text-destructive border-destructive/30 hover:bg-destructive/10">
                    Deactivate
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-medium text-destructive">Delete Account</h4>
                    <p className="text-xs text-muted-foreground">
                      Permanently delete your account and all data
                    </p>
                  </div>
                  <Button variant="destructive" size="sm">
                    <TrashIcon className="h-3.5 w-3.5 mr-1.5" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-medium">Email Notifications</h4>
                    <p className="text-xs text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch 
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => setNotificationSettings({
                      ...notificationSettings,
                      emailNotifications: checked
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-medium">Push Notifications</h4>
                    <p className="text-xs text-muted-foreground">
                      Receive browser and mobile push notifications
                    </p>
                  </div>
                  <Switch 
                    checked={notificationSettings.pushNotifications}
                    onCheckedChange={(checked) => setNotificationSettings({
                      ...notificationSettings,
                      pushNotifications: checked
                    })}
                  />
                </div>
                
                <Separator className="my-2" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Startup Activity</h4>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="text-sm">Startup Updates</p>
                        <p className="text-xs text-muted-foreground">
                          Changes to startups in your portfolio
                        </p>
                      </div>
                      <Switch 
                        checked={notificationSettings.startupUpdates}
                        onCheckedChange={(checked) => setNotificationSettings({
                          ...notificationSettings,
                          startupUpdates: checked
                        })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="text-sm">New Startups</p>
                        <p className="text-xs text-muted-foreground">
                          When new startups join the platform
                        </p>
                      </div>
                      <Switch 
                        checked={notificationSettings.newStartupNotifications}
                        onCheckedChange={(checked) => setNotificationSettings({
                          ...notificationSettings,
                          newStartupNotifications: checked
                        })}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Financial Updates</h4>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="text-sm">Commission Alerts</p>
                        <p className="text-xs text-muted-foreground">
                          New commissions and payment updates
                        </p>
                      </div>
                      <Switch 
                        checked={notificationSettings.commissionAlerts}
                        onCheckedChange={(checked) => setNotificationSettings({
                          ...notificationSettings,
                          commissionAlerts: checked
                        })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="text-sm">Weekly Reports</p>
                        <p className="text-xs text-muted-foreground">
                          Weekly summary of financial activity
                        </p>
                      </div>
                      <Switch 
                        checked={notificationSettings.weeklyReports}
                        onCheckedChange={(checked) => setNotificationSettings({
                          ...notificationSettings,
                          weeklyReports: checked
                        })}
                      />
                    </div>
                  </div>
                </div>
                
                <Separator className="my-2" />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-medium">Marketplace Updates</h4>
                    <p className="text-xs text-muted-foreground">
                      News about platform updates and features
                    </p>
                  </div>
                  <Switch 
                    checked={notificationSettings.marketplaceUpdates}
                    onCheckedChange={(checked) => setNotificationSettings({
                      ...notificationSettings,
                      marketplaceUpdates: checked
                    })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Notification Schedule</CardTitle>
              <CardDescription>
                Set when you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-medium">Quiet Hours</h4>
                    <p className="text-xs text-muted-foreground">
                      No notifications during these hours
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select defaultValue="22">
                      <SelectTrigger className="w-[80px]">
                        <SelectValue placeholder="From" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }).map((_, i) => (
                          <SelectItem key={i} value={i.toString()}>
                            {i < 10 ? `0${i}:00` : `${i}:00`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span className="text-muted-foreground">—</span>
                    <Select defaultValue="7">
                      <SelectTrigger className="w-[80px]">
                        <SelectValue placeholder="To" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }).map((_, i) => (
                          <SelectItem key={i} value={i.toString()}>
                            {i < 10 ? `0${i}:00` : `${i}:00`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-medium">Digest Mode</h4>
                    <p className="text-xs text-muted-foreground">
                      Combine multiple notifications into a single update
                    </p>
                  </div>
                  <Select defaultValue="daily">
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realtime">Real Time</SelectItem>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Display Settings */}
        <TabsContent value="display" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how the platform looks for you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-medium">Theme</h4>
                    <p className="text-xs text-muted-foreground">
                      Select your preferred color theme
                    </p>
                  </div>
                  <Select 
                    value={displaySettings.theme}
                    onValueChange={(value) => setDisplaySettings({
                      ...displaySettings,
                      theme: value
                    })}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-medium">Animation</h4>
                    <p className="text-xs text-muted-foreground">
                      Toggle UI animations and transitions
                    </p>
                  </div>
                  <Switch 
                    checked={displaySettings.animationsEnabled}
                    onCheckedChange={(checked) => setDisplaySettings({
                      ...displaySettings,
                      animationsEnabled: checked
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-medium">Density</h4>
                    <p className="text-xs text-muted-foreground">
                      Control the spacing between UI elements
                    </p>
                  </div>
                  <Select 
                    value={displaySettings.density}
                    onValueChange={(value) => setDisplaySettings({
                      ...displaySettings,
                      density: value
                    })}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compact">Compact</SelectItem>
                      <SelectItem value="comfortable">Comfortable</SelectItem>
                      <SelectItem value="spacious">Spacious</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Dashboard Layout</CardTitle>
              <CardDescription>
                Customize your dashboard experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-medium">Chart Style</h4>
                    <p className="text-xs text-muted-foreground">
                      Set your preferred visualization style
                    </p>
                  </div>
                  <Select 
                    value={displaySettings.chartStyle}
                    onValueChange={(value) => setDisplaySettings({
                      ...displaySettings,
                      chartStyle: value
                    })}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                      <SelectItem value="detailed">Detailed</SelectItem>
                      <SelectItem value="accessible">Accessible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Default View</h4>
                    <Select defaultValue="portfolio">
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="portfolio">Portfolio</SelectItem>
                        <SelectItem value="analytics">Analytics</SelectItem>
                        <SelectItem value="commissions">Commissions</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Choose which tab to show when you first open the dashboard
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Dashboard Cards</h4>
                  <p className="text-xs text-muted-foreground mb-3">
                    Drag to reorder your dashboard widgets
                  </p>
                  
                  <div className="space-y-2">
                    {["Portfolio Overview", "Recent Activity", "Commission Tracking", "Top Startups"].map((item, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-md border border-border"
                      >
                        <div className="flex items-center gap-2">
                          <ChevronsUpDownIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{item}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch defaultChecked={true} />
                          <EyeIcon className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Commission Settings */}
        <TabsContent value="commissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Commission Configuration</CardTitle>
              <CardDescription>
                Manage your commission rates and payment settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Default Commission Rate</h4>
                    <span className="text-sm font-medium">{commissionSettings.defaultRate}%</span>
                  </div>
                  <Slider 
                    value={[commissionSettings.defaultRate]} 
                    min={1}
                    max={30}
                    step={0.5}
                    onValueChange={(value) => setCommissionSettings({
                      ...commissionSettings,
                      defaultRate: value[0]
                    })}
                    className="py-2"
                  />
                  <p className="text-xs text-muted-foreground">
                    Default rate applied to new startup partnerships
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Minimum Commission</h4>
                    <span className="text-sm font-medium">${commissionSettings.minimumCommission}</span>
                  </div>
                  <Slider 
                    value={[commissionSettings.minimumCommission]} 
                    min={0}
                    max={50}
                    step={1}
                    onValueChange={(value) => setCommissionSettings({
                      ...commissionSettings,
                      minimumCommission: value[0]
                    })}
                    className="py-2"
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimum commission amount per transaction
                  </p>
                </div>
                
                <Separator className="my-2" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h4 className="text-sm font-medium">Payout Method</h4>
                        <p className="text-xs text-muted-foreground">
                          How you receive your commissions
                        </p>
                      </div>
                      <Select 
                        value={commissionSettings.payoutMethod}
                        onValueChange={(value) => setCommissionSettings({
                          ...commissionSettings,
                          payoutMethod: value
                        })}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                          <SelectItem value="paypal">PayPal</SelectItem>
                          <SelectItem value="stripe">Stripe</SelectItem>
                          <SelectItem value="crypto">Cryptocurrency</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h4 className="text-sm font-medium">Auto-Reinvest</h4>
                        <p className="text-xs text-muted-foreground">
                          Automatically reinvest a portion of your commissions
                        </p>
                      </div>
                      <Switch 
                        checked={commissionSettings.autoReinvest}
                        onCheckedChange={(checked) => setCommissionSettings({
                          ...commissionSettings,
                          autoReinvest: checked
                        })}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h4 className="text-sm font-medium">Payout Threshold</h4>
                        <p className="text-xs text-muted-foreground">
                          Minimum amount required for payout
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">$</span>
                        <Input 
                          value={commissionSettings.payoutThreshold}
                          onChange={(e) => setCommissionSettings({
                            ...commissionSettings,
                            payoutThreshold: parseInt(e.target.value) || 0
                          })}
                          type="number"
                          min="0"
                          className="w-[80px] h-9"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h4 className="text-sm font-medium">Payout Schedule</h4>
                        <p className="text-xs text-muted-foreground">
                          Frequency of commission payouts
                        </p>
                      </div>
                      <Select defaultValue="monthly">
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="biweekly">Bi-Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Startup-Specific Rates</CardTitle>
              <CardDescription>
                Set custom commission rates for specific startups
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="relative overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-muted/30">
                      <tr>
                        <th scope="col" className="px-4 py-3 rounded-l-md">Startup</th>
                        <th scope="col" className="px-4 py-3">Current Rate</th>
                        <th scope="col" className="px-4 py-3">Min Commission</th>
                        <th scope="col" className="px-4 py-3 rounded-r-md">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: "TechFlow AI", rate: 15, min: 10 },
                        { name: "BlockVista", rate: 12, min: 7 },
                        { name: "MediConnect", rate: 14, min: 5 },
                        { name: "EduSpark", rate: 10, min: 0 }
                      ].map((startup, index) => (
                        <tr 
                          key={index} 
                          className={`border-b border-border/30 hover:bg-muted/20 ${
                            index % 2 === 0 ? 'bg-muted/10' : ''
                          }`}
                        >
                          <td className="px-4 py-3 font-medium">{startup.name}</td>
                          <td className="px-4 py-3">{startup.rate}%</td>
                          <td className="px-4 py-3">${startup.min}</td>
                          <td className="px-4 py-3">
                            <Button variant="ghost" size="sm" className="h-8 px-2">
                              <PencilIcon className="h-3.5 w-3.5" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="flex justify-end">
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <PlusIcon className="h-3.5 w-3.5" />
                    Add Custom Rate
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integration Settings */}
        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Access</CardTitle>
              <CardDescription>
                Manage API access and integrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-medium">API Access</h4>
                    <p className="text-xs text-muted-foreground">
                      Enable API access for external integrations
                    </p>
                  </div>
                  <Switch 
                    checked={integrationSettings.apiEnabled}
                    onCheckedChange={(checked) => setIntegrationSettings({
                      ...integrationSettings,
                      apiEnabled: checked
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-medium">Webhooks</h4>
                    <p className="text-xs text-muted-foreground">
                      Send event notifications to external URLs
                    </p>
                  </div>
                  <Switch 
                    checked={integrationSettings.webhooksEnabled}
                    onCheckedChange={(checked) => setIntegrationSettings({
                      ...integrationSettings,
                      webhooksEnabled: checked
                    })}
                  />
                </div>
                
                <div className="p-3 bg-muted/20 rounded-md border border-border/50">
                  <div className="flex flex-col gap-2">
                    <h4 className="text-sm font-medium">API Keys</h4>
                    <div className="flex items-center gap-2">
                      <Input
                        value="••••••••••••••••••••••••••••••"
                        className="font-mono"
                        readOnly
                      />
                      <Button variant="outline" size="sm" className="whitespace-nowrap">
                        Reveal Key
                      </Button>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-xs text-muted-foreground">Created: May 15, 2025</p>
                      <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                        Regenerate Key
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Connected Services</CardTitle>
              <CardDescription>
                Manage third-party service connections
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 bg-muted rounded-md flex items-center justify-center">
                      <div className="bg-chart-4 h-5 w-5 rounded"></div>
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-medium">CRM Integration</h4>
                      <p className="text-xs text-muted-foreground">
                        Connect to your favorite CRM
                      </p>
                    </div>
                  </div>
                  <Select 
                    value={integrationSettings.crmIntegration}
                    onValueChange={(value) => setIntegrationSettings({
                      ...integrationSettings,
                      crmIntegration: value
                    })}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="salesforce">Salesforce</SelectItem>
                      <SelectItem value="hubspot">HubSpot</SelectItem>
                      <SelectItem value="zoho">Zoho CRM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 bg-muted rounded-md flex items-center justify-center">
                      <div className="bg-chart-3 h-5 w-5 rounded"></div>
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-medium">Calendar Sync</h4>
                      <p className="text-xs text-muted-foreground">
                        Sync platform events with your calendar
                      </p>
                    </div>
                  </div>
                  <Switch 
                    checked={integrationSettings.calendarSync}
                    onCheckedChange={(checked) => setIntegrationSettings({
                      ...integrationSettings,
                      calendarSync: checked
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 bg-muted rounded-md flex items-center justify-center">
                      <div className="bg-chart-5 h-5 w-5 rounded"></div>
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-medium">Slack Notifications</h4>
                      <p className="text-xs text-muted-foreground">
                        Receive notifications in your Slack workspace
                      </p>
                    </div>
                  </div>
                  <Switch 
                    checked={integrationSettings.slackNotifications}
                    onCheckedChange={(checked) => setIntegrationSettings({
                      ...integrationSettings,
                      slackNotifications: checked
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 bg-muted rounded-md flex items-center justify-center">
                      <div className="bg-chart-1 h-5 w-5 rounded"></div>
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-medium">Analytics Integration</h4>
                      <p className="text-xs text-muted-foreground">
                        Connect to external analytics platforms
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Save Settings Button */}
      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center gap-2">
          {success && (
            <div className="flex items-center gap-2 text-chart-1 bg-chart-1/10 px-3 py-1.5 rounded-md border border-chart-1/20">
              <CheckIcon className="h-4 w-4" />
              <span className="text-sm">Settings saved successfully</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-1.5">
            <RefreshCwIcon className="h-3.5 w-3.5" />
            Reset
          </Button>
          <Button 
            onClick={handleSaveSettings}
            disabled={loading}
            className="gap-1.5 bg-chart-4 text-white hover:bg-chart-4/90"
          >
            {loading ? (
              <>
                <RefreshCwIcon className="h-3.5 w-3.5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <SaveIcon className="h-3.5 w-3.5" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}