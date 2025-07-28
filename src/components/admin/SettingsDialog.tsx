import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle
} from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { 
  UserIcon, 
  SettingsIcon, 
  BellIcon, 
  MoonIcon, 
  SunIcon, 
  ComputerIcon, 
  KeyIcon, 
  LogOutIcon,
  MailIcon,
  PaletteIcon,
  CheckIcon
} from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Separator } from "../ui/separator";
import { toast } from "sonner";

interface SettingsDialogProps {
  user?: any;
  onClose: () => void;
}

export function SettingsDialog({ user, onClose }: SettingsDialogProps) {
  const [activeTab, setActiveTab] = useState("account");
  const [theme, setTheme] = useState("dark");
  const [loading, setLoading] = useState(false);
  const [userSettings, setUserSettings] = useState({
    name: user?.name || "Admin User",
    email: user?.email || "admin@venturesroom.com",
    notifications: {
      email: true,
      browser: true,
      approvals: true,
      transactions: true,
      systemUpdates: true
    },
    appearance: {
      theme: "dark",
      reducedMotion: false,
      highContrast: false
    },
    security: {
      twoFactorAuth: true,
      sessionTimeout: "60"
    }
  });
  
  // Handle save settings
  const handleSaveSettings = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Settings saved successfully", {
        description: "Your preferences have been updated",
      });
      setLoading(false);
      onClose();
    }, 1000);
  };
  
  // Update notification settings
  const updateNotificationSetting = (key: string, value: boolean) => {
    setUserSettings({
      ...userSettings,
      notifications: {
        ...userSettings.notifications,
        [key]: value
      }
    });
  };
  
  // Update appearance settings
  const updateAppearanceSetting = (key: string, value: any) => {
    setUserSettings({
      ...userSettings,
      appearance: {
        ...userSettings.appearance,
        [key]: value
      }
    });
  };
  
  // Update security settings
  const updateSecuritySetting = (key: string, value: any) => {
    setUserSettings({
      ...userSettings,
      security: {
        ...userSettings.security,
        [key]: value
      }
    });
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>User Settings</DialogTitle>
          <DialogDescription>
            Update your personal preferences and settings
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="account" className="flex flex-col items-center gap-1 py-2">
              <UserIcon className="h-4 w-4" />
              <span className="text-xs">Account</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex flex-col items-center gap-1 py-2">
              <BellIcon className="h-4 w-4" />
              <span className="text-xs">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex flex-col items-center gap-1 py-2">
              <PaletteIcon className="h-4 w-4" />
              <span className="text-xs">Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex flex-col items-center gap-1 py-2">
              <KeyIcon className="h-4 w-4" />
              <span className="text-xs">Security</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="account" className="space-y-4 mt-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
              <Avatar className="h-20 w-20">
                {user?.avatar ? (
                  <AvatarImage src={user.avatar} alt={userSettings.name} />
                ) : (
                  <AvatarFallback className="text-lg bg-destructive text-destructive-foreground">
                    {userSettings.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="space-y-3 flex-1">
                <div className="space-y-1">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    value={userSettings.name} 
                    onChange={(e) => setUserSettings({...userSettings, name: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={userSettings.email} 
                    onChange={(e) => setUserSettings({...userSettings, email: e.target.value})}
                  />
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm">Admin Access</span>
                  <span className="text-xs bg-destructive/20 text-destructive py-1 px-2 rounded-full">
                    Full Access
                  </span>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Support Contact</h4>
              <p className="text-xs text-muted-foreground">
                For account issues, contact platform support at support@venturesroom.com
              </p>
            </div>
            
            <div className="flex justify-end">
              <Button
                variant="destructive"
                className="gap-1.5"
              >
                <LogOutIcon className="h-3.5 w-3.5" />
                Sign Out
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4 mt-4">
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Notification Channels</h4>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-xs text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch 
                  id="email-notifications" 
                  checked={userSettings.notifications.email} 
                  onCheckedChange={(checked) => updateNotificationSetting('email', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="browser-notifications">Browser Notifications</Label>
                  <p className="text-xs text-muted-foreground">
                    Show desktop notifications in browser
                  </p>
                </div>
                <Switch 
                  id="browser-notifications" 
                  checked={userSettings.notifications.browser} 
                  onCheckedChange={(checked) => updateNotificationSetting('browser', checked)}
                />
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Notification Types</h4>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="approval-notifications">Approval Requests</Label>
                  <p className="text-xs text-muted-foreground">
                    New startups and support structure approvals
                  </p>
                </div>
                <Switch 
                  id="approval-notifications" 
                  checked={userSettings.notifications.approvals} 
                  onCheckedChange={(checked) => updateNotificationSetting('approvals', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="transaction-notifications">Transactions</Label>
                  <p className="text-xs text-muted-foreground">
                    High-value transactions and commission events
                  </p>
                </div>
                <Switch 
                  id="transaction-notifications" 
                  checked={userSettings.notifications.transactions} 
                  onCheckedChange={(checked) => updateNotificationSetting('transactions', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="system-notifications">System Updates</Label>
                  <p className="text-xs text-muted-foreground">
                    Platform maintenance and updates
                  </p>
                </div>
                <Switch 
                  id="system-notifications" 
                  checked={userSettings.notifications.systemUpdates} 
                  onCheckedChange={(checked) => updateNotificationSetting('systemUpdates', checked)}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="appearance" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    type="button" 
                    variant={theme === "light" ? "default" : "outline"} 
                    className="flex flex-col items-center justify-center p-3 h-auto"
                    onClick={() => {
                      setTheme("light");
                      updateAppearanceSetting('theme', 'light');
                    }}
                  >
                    <SunIcon className="h-4 w-4 mb-1" />
                    <span className="text-xs">Light</span>
                  </Button>
                  <Button 
                    type="button" 
                    variant={theme === "dark" ? "default" : "outline"} 
                    className="flex flex-col items-center justify-center p-3 h-auto"
                    onClick={() => {
                      setTheme("dark");
                      updateAppearanceSetting('theme', 'dark');
                    }}
                  >
                    <MoonIcon className="h-4 w-4 mb-1" />
                    <span className="text-xs">Dark</span>
                  </Button>
                  <Button 
                    type="button" 
                    variant={theme === "system" ? "default" : "outline"} 
                    className="flex flex-col items-center justify-center p-3 h-auto"
                    onClick={() => {
                      setTheme("system");
                      updateAppearanceSetting('theme', 'system');
                    }}
                  >
                    <ComputerIcon className="h-4 w-4 mb-1" />
                    <span className="text-xs">System</span>
                  </Button>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Accessibility</h4>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="reduced-motion">Reduced Motion</Label>
                    <p className="text-xs text-muted-foreground">
                      Minimize animations and transitions
                    </p>
                  </div>
                  <Switch 
                    id="reduced-motion" 
                    checked={userSettings.appearance.reducedMotion} 
                    onCheckedChange={(checked) => updateAppearanceSetting('reducedMotion', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="high-contrast">High Contrast</Label>
                    <p className="text-xs text-muted-foreground">
                      Increase color contrast for better visibility
                    </p>
                  </div>
                  <Switch 
                    id="high-contrast" 
                    checked={userSettings.appearance.highContrast} 
                    onCheckedChange={(checked) => updateAppearanceSetting('highContrast', checked)}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-4 mt-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="two-factor-auth">Two-Factor Authentication</Label>
                  <p className="text-xs text-muted-foreground">
                    Enhance your account security with 2FA
                  </p>
                </div>
                <Switch 
                  id="two-factor-auth" 
                  checked={userSettings.security.twoFactorAuth} 
                  onCheckedChange={(checked) => updateSecuritySetting('twoFactorAuth', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="session-timeout">Session Timeout</Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically log out after period of inactivity
                  </p>
                </div>
                <Select 
                  value={userSettings.security.sessionTimeout}
                  onValueChange={(value) => updateSecuritySetting('sessionTimeout', value)}
                >
                  <SelectTrigger id="session-timeout" className="w-[120px]">
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
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Password</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" placeholder="••••••••" />
                </div>
                <div></div>
                <div className="space-y-1">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input id="confirm-password" type="password" placeholder="••••••••" />
                </div>
              </div>
              <div className="flex justify-end mt-2">
                <Button
                  variant="outline"
                  size="sm"
                >
                  Change Password
                </Button>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Security Log</h4>
              <p className="text-xs text-muted-foreground">
                Last login: May 30, 2025 at 08:10 AM from 192.168.1.1
              </p>
              <div className="flex justify-end">
                <Button
                  variant="link"
                  size="sm"
                  className="h-auto p-0 text-xs"
                >
                  View full security log
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex items-center justify-between border-t border-border/30 pt-4 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveSettings}
            disabled={loading}
            className="gap-1.5 bg-chart-4 text-white hover:bg-chart-4/90"
          >
            {loading ? "Saving..." : (
              <>
                <CheckIcon className="h-3.5 w-3.5" />
                Save Settings
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}