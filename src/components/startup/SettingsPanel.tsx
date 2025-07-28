import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { 
  AlertCircleIcon, 
  CheckIcon, 
  SettingsIcon, 
  UserIcon, 
  BellIcon, 
  ShieldIcon, 
  LockIcon, 
  CreditCardIcon, 
  GlobeIcon, 
  BuildingIcon, 
  PercentIcon,
  TagIcon,
  PencilIcon,
  EyeIcon,
  EyeOffIcon,
  KeyIcon,
  BriefcaseIcon,
  WalletIcon,
  LinkIcon,
  UnlinkIcon,
  BanknoteIcon
} from "lucide-react";
import { toast } from "sonner";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "../ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { SupportStructureManagement } from "./SupportStructureManagement";

interface SettingsPanelProps {
  user: any;
}

export function SettingsPanel({ user }: SettingsPanelProps) {
  // State for all settings
  const [generalSettings, setGeneralSettings] = useState({
    companyName: user?.name || "Your Startup",
    email: user?.email || "contact@startup.com",
    website: "https://yourstartup.com",
    logo: user?.avatar || "https://images.unsplash.com/photo-1568952433726-3896e3881c65?q=80&w=100&auto=format&fit=crop",
    description: "A revolutionary startup changing the industry with innovative solutions.",
    category: "SaaS",
    foundedYear: "2023",
    location: "San Francisco, CA"
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    orderNotifications: true,
    marketingEmails: false,
    supportStructureUpdates: true,
    securityAlerts: true,
    productUpdates: true,
    commissionPayouts: true
  });
  
  const [privacySettings, setPrivacySettings] = useState({
    publicProfile: true,
    showRevenue: false,
    showCustomerCount: true,
    allowMessaging: true,
    showPartnershipDetails: true,
    discloseSupportStructures: true
  });
  
  const [commissionSettings, setCommissionSettings] = useState({
    autoApprovePartners: false,
    minimumCommission: 5,
    maximumCommission: 15,
    autoRejectAboveMaximum: true,
    allowMultiplePartners: true,
    equalSplitBetweenPartners: false
  });
  
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [deleteAccountDialogOpen, setDeleteAccountDialogOpen] = useState(false);
  
  // Handler for general settings
  const handleGeneralSettingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setGeneralSettings(prev => ({ ...prev, [name]: value }));
  };
  
  // Handler for notification toggles
  const handleNotificationToggle = (key: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };
  
  // Handler for privacy toggles
  const handlePrivacyToggle = (key: keyof typeof privacySettings) => {
    setPrivacySettings(prev => ({ ...prev, [key]: !prev[key] }));
  };
  
  // Handler for commission settings
  const handleCommissionSettingChange = (key: keyof typeof commissionSettings, value: any) => {
    setCommissionSettings(prev => ({ ...prev, [key]: value }));
  };
  
  // Handler for saving settings
  const handleSaveSettings = () => {
    toast.success("Settings saved successfully");
  };
  
  // Handler for changing password
  const handleChangePassword = (oldPassword: string, newPassword: string) => {
    // Implement password change logic here
    toast.success("Password changed successfully");
    setPasswordDialogOpen(false);
  };
  
  // Handler for deleting account
  const handleDeleteAccount = () => {
    // Implement account deletion logic here
    toast.success("Account deletion process initiated");
    setDeleteAccountDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
          <TabsTrigger value="general" className="flex items-center gap-1">
            <SettingsIcon className="h-3.5 w-3.5 md:mr-1" />
            <span className="hidden md:inline">General</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-1">
            <BellIcon className="h-3.5 w-3.5 md:mr-1" />
            <span className="hidden md:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="partnerships" className="flex items-center gap-1">
            <BuildingIcon className="h-3.5 w-3.5 md:mr-1" />
            <span className="hidden md:inline">Partnerships</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-1">
            <LockIcon className="h-3.5 w-3.5 md:mr-1" />
            <span className="hidden md:inline">Privacy</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-1">
            <CreditCardIcon className="h-3.5 w-3.5 md:mr-1" />
            <span className="hidden md:inline">Billing</span>
          </TabsTrigger>
        </TabsList>
        
        {/* General Settings */}
        <TabsContent value="general" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Manage your startup profile and basic information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="space-y-2 md:w-1/4">
                  <Label htmlFor="avatar">Company Logo</Label>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 rounded-md">
                      <AvatarImage src={generalSettings.logo} alt={generalSettings.companyName} />
                      <AvatarFallback className="rounded-md bg-primary/10 text-primary">
                        {generalSettings.companyName.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <Button size="sm" variant="outline">
                        <PencilIcon className="h-3.5 w-3.5 mr-1.5" />
                        Change Logo
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG or SVG (max. 2MB)
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-3/4 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        name="companyName"
                        value={generalSettings.companyName}
                        onChange={handleGeneralSettingChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={generalSettings.email}
                        onChange={handleGeneralSettingChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        name="website"
                        value={generalSettings.website}
                        onChange={handleGeneralSettingChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <select
                        id="category"
                        name="category"
                        className="w-full h-10 px-3 py-2 rounded-md border border-input bg-transparent text-sm"
                        value={generalSettings.category}
                        onChange={handleGeneralSettingChange}
                      >
                        <option value="SaaS">SaaS</option>
                        <option value="Fintech">Fintech</option>
                        <option value="Health Tech">Health Tech</option>
                        <option value="E-commerce">E-commerce</option>
                        <option value="AI">AI</option>
                        <option value="Hardware">Hardware</option>
                        <option value="Consumer">Consumer</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="foundedYear">Founded Year</Label>
                      <Input
                        id="foundedYear"
                        name="foundedYear"
                        value={generalSettings.foundedYear}
                        onChange={handleGeneralSettingChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        name="location"
                        value={generalSettings.location}
                        onChange={handleGeneralSettingChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Company Description</Label>
                    <textarea
                      id="description"
                      name="description"
                      className="w-full min-h-[100px] rounded-md border border-input p-3 text-sm"
                      value={generalSettings.description}
                      onChange={handleGeneralSettingChange}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveSettings}>
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account security and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Password</h4>
                    <p className="text-sm text-muted-foreground">
                      Change your account password
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setPasswordDialogOpen(true)}
                  >
                    <KeyIcon className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                </div>
                <Separator />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-destructive">Danger Zone</h4>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all of your data
                    </p>
                  </div>
                  <Button 
                    variant="destructive" 
                    onClick={() => setDeleteAccountDialogOpen(true)}
                  >
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Notification Settings */}
        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Control how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Order Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications when you get new orders
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.orderNotifications}
                    onCheckedChange={() => handleNotificationToggle('orderNotifications')}
                  />
                </div>
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive marketing and promotional emails
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.marketingEmails}
                    onCheckedChange={() => handleNotificationToggle('marketingEmails')}
                  />
                </div>
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Support Structure Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified about new support structure proposals
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.supportStructureUpdates}
                    onCheckedChange={() => handleNotificationToggle('supportStructureUpdates')}
                  />
                </div>
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Security Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive important security notifications
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.securityAlerts}
                    onCheckedChange={() => handleNotificationToggle('securityAlerts')}
                  />
                </div>
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Product Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified about VentureRoom platform updates
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.productUpdates}
                    onCheckedChange={() => handleNotificationToggle('productUpdates')}
                  />
                </div>
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Commission Payouts</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications about commission payments
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.commissionPayouts}
                    onCheckedChange={() => handleNotificationToggle('commissionPayouts')}
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveSettings}>
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Partnership Settings */}
        <TabsContent value="partnerships" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PercentIcon className="h-5 w-5 text-primary" />
                Commission Settings
              </CardTitle>
              <CardDescription>
                Configure how commissions are handled with support structures
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Auto-Approve Partners</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically approve support structure proposals if they meet your criteria
                    </p>
                  </div>
                  <Switch
                    checked={commissionSettings.autoApprovePartners}
                    onCheckedChange={() => handleCommissionSettingChange('autoApprovePartners', !commissionSettings.autoApprovePartners)}
                  />
                </div>
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Auto-Reject Above Maximum</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically reject proposals with commission requests above your maximum
                    </p>
                  </div>
                  <Switch
                    checked={commissionSettings.autoRejectAboveMaximum}
                    onCheckedChange={() => handleCommissionSettingChange('autoRejectAboveMaximum', !commissionSettings.autoRejectAboveMaximum)}
                  />
                </div>
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Allow Multiple Partners</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow multiple support structures to claim commission on sales
                    </p>
                  </div>
                  <Switch
                    checked={commissionSettings.allowMultiplePartners}
                    onCheckedChange={() => handleCommissionSettingChange('allowMultiplePartners', !commissionSettings.allowMultiplePartners)}
                  />
                </div>
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Equal Commission Split</Label>
                    <p className="text-sm text-muted-foreground">
                      Split commission equally between all approved partners (instead of manual allocation)
                    </p>
                  </div>
                  <Switch
                    checked={commissionSettings.equalSplitBetweenPartners}
                    onCheckedChange={() => handleCommissionSettingChange('equalSplitBetweenPartners', !commissionSettings.equalSplitBetweenPartners)}
                    disabled={!commissionSettings.allowMultiplePartners}
                  />
                </div>
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="minimumCommission">Minimum Commission (%)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="minimumCommission"
                        type="number"
                        min="0"
                        max="20"
                        step="0.5"
                        value={commissionSettings.minimumCommission}
                        onChange={(e) => handleCommissionSettingChange('minimumCommission', parseFloat(e.target.value))}
                      />
                      <span className="text-muted-foreground">%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Minimum commission you're willing to offer to support structures
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maximumCommission">Maximum Commission (%)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="maximumCommission"
                        type="number"
                        min="0"
                        max="20"
                        step="0.5"
                        value={commissionSettings.maximumCommission}
                        onChange={(e) => handleCommissionSettingChange('maximumCommission', parseFloat(e.target.value))}
                      />
                      <span className="text-muted-foreground">%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Maximum commission you're willing to offer to support structures
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveSettings}>
                  Save Commission Settings
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <SupportStructureManagement user={user} />
        </TabsContent>
        
        {/* Privacy Settings */}
        <TabsContent value="privacy" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>
                Control what information is visible to others
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Public Profile</Label>
                    <p className="text-sm text-muted-foreground">
                      Make your startup profile visible on the platform
                    </p>
                  </div>
                  <Switch
                    checked={privacySettings.publicProfile}
                    onCheckedChange={() => handlePrivacyToggle('publicProfile')}
                  />
                </div>
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Show Revenue Statistics</Label>
                    <p className="text-sm text-muted-foreground">
                      Display your revenue statistics publicly
                    </p>
                  </div>
                  <Switch
                    checked={privacySettings.showRevenue}
                    onCheckedChange={() => handlePrivacyToggle('showRevenue')}
                  />
                </div>
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Show Customer Count</Label>
                    <p className="text-sm text-muted-foreground">
                      Display your customer count publicly
                    </p>
                  </div>
                  <Switch
                    checked={privacySettings.showCustomerCount}
                    onCheckedChange={() => handlePrivacyToggle('showCustomerCount')}
                  />
                </div>
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Allow Direct Messaging</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow other users to send you direct messages
                    </p>
                  </div>
                  <Switch
                    checked={privacySettings.allowMessaging}
                    onCheckedChange={() => handlePrivacyToggle('allowMessaging')}
                  />
                </div>
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Show Partnership Details</Label>
                    <p className="text-sm text-muted-foreground">
                      Display details about your partnerships and collaborations
                    </p>
                  </div>
                  <Switch
                    checked={privacySettings.showPartnershipDetails}
                    onCheckedChange={() => handlePrivacyToggle('showPartnershipDetails')}
                  />
                </div>
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Disclose Support Structures</Label>
                    <p className="text-sm text-muted-foreground">
                      Publicly show which support structures you're affiliated with
                    </p>
                  </div>
                  <Switch
                    checked={privacySettings.discloseSupportStructures}
                    onCheckedChange={() => handlePrivacyToggle('discloseSupportStructures')}
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveSettings}>
                  Save Privacy Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Billing Settings */}
        <TabsContent value="billing" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Billing & Payments</CardTitle>
              <CardDescription>
                Manage your payment methods and billing information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-medium">Payment Methods</h3>
                    <p className="text-sm text-muted-foreground">
                      Manage your payment methods for receiving commissions
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <WalletIcon className="h-4 w-4 mr-2" />
                    Add Payment Method
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 px-3 bg-muted/30 rounded-md">
                    <div className="flex items-center gap-3">
                      <BanknoteIcon className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Bank Account (Primary)</div>
                        <div className="text-xs text-muted-foreground">
                          Ending in ****6789
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <PencilIcon className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between py-2 px-3 bg-muted/30 rounded-md">
                    <div className="flex items-center gap-3">
                      <CreditCardIcon className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Credit Card</div>
                        <div className="text-xs text-muted-foreground">
                          Visa ending in ****4242
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <PencilIcon className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-medium">Billing Information</h3>
                    <p className="text-sm text-muted-foreground">
                      Your billing details for invoices and receipts
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <PencilIcon className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-muted-foreground">Company Name</div>
                      <div>{generalSettings.companyName}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Email</div>
                      <div>{generalSettings.email}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Address</div>
                      <div>123 Startup Street, {generalSettings.location}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Tax ID</div>
                      <div>US123456789</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-medium">Invoice History</h3>
                    <p className="text-sm text-muted-foreground">
                      View and download your past invoices
                    </p>
                  </div>
                </div>
                
                <div className="text-center py-6 text-muted-foreground">
                  <p>No invoices found</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Change Password Dialog */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and a new password
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input id="confirm-password" type="password" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPasswordDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => handleChangePassword("old", "new")}>
              Update Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Account Dialog */}
      <AlertDialog open={deleteAccountDialogOpen} onOpenChange={setDeleteAccountDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account and remove all of your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 border border-destructive/20 mb-4">
              <AlertCircleIcon className="h-5 w-5 text-destructive" />
              <div className="text-sm text-destructive">
                All your products, orders, and customer data will be permanently deleted.
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-delete">Type "DELETE" to confirm</Label>
              <Input id="confirm-delete" placeholder="DELETE" />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDeleteAccount}
            >
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}