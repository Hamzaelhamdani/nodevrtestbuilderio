import { useState, useEffect } from "react";
import { 
  Bell, 
  Check, 
  ShoppingBag, 
  MessageSquare, 
  AlertCircle, 
  Clock, 
  Info,
  Trash,
  CheckCheck,
  ChevronRight,
  X,
  Settings
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "../ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Separator } from "../ui/separator";
import { cn } from "../ui/utils";
import { format, formatDistanceToNow } from "date-fns";
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

// Notification types
type NotificationType = "order" | "message" | "alert" | "info";

// Notification interface
interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: Date;
  read: boolean;
  link?: string;
}

interface NotificationsPanelProps {
  userId: string;
  showHeader?: boolean;
}

export function NotificationsPanel({ userId, showHeader = false }: NotificationsPanelProps) {
  // State hooks
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "order" | "message" | "alert" | "info">("all");
  const [isOpen, setIsOpen] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  
  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !notification.read;
    return notification.type === activeTab;
  });
  
  // Generate notification counts
  const unreadCount = notifications.filter(n => !n.read).length;
  const orderCount = notifications.filter(n => n.type === "order").length;
  const messageCount = notifications.filter(n => n.type === "message").length;
  const alertCount = notifications.filter(n => n.type === "alert").length;
  const infoCount = notifications.filter(n => n.type === "info").length;
  
  // Load notifications
  useEffect(() => {
    // In a real app, this would be an API call
    const mockNotifications: Notification[] = [
      {
        id: "n1",
        type: "order",
        title: "New order received",
        message: "You have received a new order for Premium SaaS License",
        time: new Date(2025, 4, 29, 9, 30), // May 29, 2025 9:30 AM
        read: false,
        link: "/startup-dashboard/orders"
      },
      {
        id: "n2",
        type: "message",
        title: "New message from client",
        message: "Hi, I'm interested in your API integration service. Can we schedule a call?",
        time: new Date(2025, 4, 29, 8, 45), // May 29, 2025 8:45 AM
        read: false,
        link: "/startup-dashboard/messages"
      },
      {
        id: "n3",
        type: "alert",
        title: "Payment failed",
        message: "The subscription payment for AcmeInc has failed. Please update your payment method.",
        time: new Date(2025, 4, 28, 14, 15), // May 28, 2025 2:15 PM
        read: true,
        link: "/startup-dashboard/payments"
      },
      {
        id: "n4",
        type: "info",
        title: "Platform Update",
        message: "VenturesRoom has been updated with new features. Check out our blog post to learn more.",
        time: new Date(2025, 4, 28, 10, 0), // May 28, 2025 10:00 AM
        read: false,
        link: "/blog/platform-update"
      },
      {
        id: "n5",
        type: "order",
        title: "Order status update",
        message: "Order #12345 has been delivered successfully.",
        time: new Date(2025, 4, 27, 16, 30), // May 27, 2025 4:30 PM
        read: true,
        link: "/startup-dashboard/orders/12345"
      },
      {
        id: "n6",
        type: "message",
        title: "Support request resolved",
        message: "Your support ticket #54321 has been resolved. Please let us know if you require further assistance.",
        time: new Date(2025, 4, 27, 14, 0), // May 27, 2025 2:00 PM
        read: true,
        link: "/startup-dashboard/support/54321"
      },
      {
        id: "n7",
        type: "info",
        title: "New discount opportunity",
        message: "TechAcme is offering a 20% discount on their services for VenturesRoom members.",
        time: new Date(2025, 4, 27, 11, 20), // May 27, 2025 11:20 AM
        read: false,
        link: "/marketplace/discounts/techacme"
      },
      {
        id: "n8",
        type: "alert",
        title: "Security alert",
        message: "We detected a login from an unfamiliar location. Please verify your account security.",
        time: new Date(2025, 4, 26, 23, 45), // May 26, 2025 11:45 PM
        read: false,
        link: "/settings/security"
      },
      {
        id: "n9",
        type: "order",
        title: "Order feedback requested",
        message: "Please provide feedback on your recent delivery of Cloud Hosting Services.",
        time: new Date(2025, 4, 26, 16, 0), // May 26, 2025 4:00 PM
        read: true,
        link: "/startup-dashboard/orders/feedback/67890"
      },
      {
        id: "n10",
        type: "info",
        title: "Community event invitation",
        message: "You're invited to our monthly startup networking event on June 5th, 2025.",
        time: new Date(2025, 4, 26, 9, 15), // May 26, 2025 9:15 AM
        read: false,
        link: "/community/events/june-networking"
      }
    ];
    
    setNotifications(mockNotifications);
  }, [userId]);
  
  // Mark a notification as read
  const markAsRead = (id: string) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
  };
  
  // Clear notifications based on active tab
  const clearAllNotifications = () => {
    setShowClearDialog(false);
    
    if (activeTab === "all") {
      setNotifications([]);
    } else if (activeTab === "unread") {
      setNotifications(prevNotifications => 
        prevNotifications.filter(notification => notification.read)
      );
    } else {
      setNotifications(prevNotifications => 
        prevNotifications.filter(notification => notification.type !== activeTab)
      );
    }
  };
  
  // Get icon based on notification type
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "order":
        return <ShoppingBag className="h-4 w-4 text-primary" />;
      case "message":
        return <MessageSquare className="h-4 w-4 text-tertiary" />;
      case "alert":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case "info":
        return <Info className="h-4 w-4 text-chart-5" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };
  
  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                {unreadCount}
              </span>
            )}
          </Button>
        </SheetTrigger>
        
        <SheetContent side="right" className="w-full max-w-sm border-l border-border sm:max-w-md">
          <SheetHeader className="border-b border-border pb-4">
            <SheetTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Notifications
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {unreadCount} unread
                </Badge>
              )}
            </SheetTitle>
            <SheetDescription>
              View and manage your notifications
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-4">
            <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
              <div className="space-y-4">
                {/* First TabsList with main notification filters */}
                <div className="flex items-center justify-between">
                  <TabsList className="grid grid-cols-3 w-auto">
                    <TabsTrigger value="all" className="text-xs px-3">
                      All
                      <Badge variant="outline" className="ml-1 h-4 min-w-4 px-1">
                        {notifications.length}
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="unread" className="text-xs px-3">
                      Unread
                      <Badge variant="outline" className="ml-1 h-4 min-w-4 px-1">
                        {unreadCount}
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="order" className="text-xs px-3">
                      Orders
                      <Badge variant="outline" className="ml-1 h-4 min-w-4 px-1">
                        {orderCount}
                      </Badge>
                    </TabsTrigger>
                  </TabsList>
                  
                  <div className="flex items-center gap-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={markAllAsRead}
                            disabled={unreadCount === 0}
                          >
                            <CheckCheck className="h-4 w-4" />
                            <span className="sr-only">Mark all as read</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Mark all as read</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => setShowClearDialog(true)}
                      disabled={filteredNotifications.length === 0}
                    >
                      <Trash className="h-3.5 w-3.5 mr-1" />
                      Clear {activeTab === "all" ? "all" : activeTab}
                    </Button>
                  </div>
                </div>
                
                {/* Second TabsList with more specific notification types */}
                <TabsList className="grid grid-cols-3 gap-1 text-xs w-full">
                  <TabsTrigger value="message" className="text-xs">
                    <MessageSquare className="h-3.5 w-3.5 mr-1 text-tertiary" />
                    Messages
                    <Badge variant="outline" className="ml-1 h-4 min-w-4 px-1">
                      {messageCount}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="alert" className="text-xs">
                    <AlertCircle className="h-3.5 w-3.5 mr-1 text-destructive" />
                    Alerts
                    <Badge variant="outline" className="ml-1 h-4 min-w-4 px-1">
                      {alertCount}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="info" className="text-xs">
                    <Info className="h-3.5 w-3.5 mr-1 text-chart-5" />
                    Info
                    <Badge variant="outline" className="ml-1 h-4 min-w-4 px-1">
                      {infoCount}
                    </Badge>
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <ScrollArea className="h-[calc(100vh-240px)] mt-4">
                <TabsContent value="all" className="m-0">
                  {notifications.length > 0 ? (
                    <NotificationList 
                      notifications={notifications} 
                      markAsRead={markAsRead}
                      getNotificationIcon={getNotificationIcon}
                    />
                  ) : (
                    <EmptyState message="No notifications" />
                  )}
                </TabsContent>
                
                <TabsContent value="unread" className="m-0">
                  {unreadCount > 0 ? (
                    <NotificationList 
                      notifications={notifications.filter(n => !n.read)} 
                      markAsRead={markAsRead}
                      getNotificationIcon={getNotificationIcon}
                    />
                  ) : (
                    <EmptyState message="No unread notifications" />
                  )}
                </TabsContent>
                
                <TabsContent value="order" className="m-0">
                  {orderCount > 0 ? (
                    <NotificationList 
                      notifications={notifications.filter(n => n.type === "order")} 
                      markAsRead={markAsRead}
                      getNotificationIcon={getNotificationIcon}
                    />
                  ) : (
                    <EmptyState message="No order notifications" />
                  )}
                </TabsContent>
                
                <TabsContent value="message" className="m-0">
                  {messageCount > 0 ? (
                    <NotificationList 
                      notifications={notifications.filter(n => n.type === "message")} 
                      markAsRead={markAsRead}
                      getNotificationIcon={getNotificationIcon}
                    />
                  ) : (
                    <EmptyState message="No message notifications" />
                  )}
                </TabsContent>
                
                <TabsContent value="alert" className="m-0">
                  {alertCount > 0 ? (
                    <NotificationList 
                      notifications={notifications.filter(n => n.type === "alert")} 
                      markAsRead={markAsRead}
                      getNotificationIcon={getNotificationIcon}
                    />
                  ) : (
                    <EmptyState message="No alert notifications" />
                  )}
                </TabsContent>
                
                <TabsContent value="info" className="m-0">
                  {infoCount > 0 ? (
                    <NotificationList 
                      notifications={notifications.filter(n => n.type === "info")} 
                      markAsRead={markAsRead}
                      getNotificationIcon={getNotificationIcon}
                    />
                  ) : (
                    <EmptyState message="No info notifications" />
                  )}
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </div>
          
          <SheetFooter className="absolute bottom-0 left-0 right-0 border-t border-border bg-card p-4">
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2"
              onClick={() => {
                setIsOpen(false);
                // In a real app, navigate to notification settings
              }}
            >
              <Settings className="h-4 w-4" />
              Notification Settings
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      
      {/* Clear Notifications Confirmation Dialog */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent 
          className="border-border bg-card"
          aria-describedby="clear-notification-description"
        >
          <AlertDialogHeader>
            <AlertDialogTitle>Clear Notifications</AlertDialogTitle>
            <AlertDialogDescription id="clear-notification-description">
              {activeTab === "all" 
                ? "Are you sure you want to clear all notifications? This action cannot be undone."
                : activeTab === "unread"
                ? "Are you sure you want to clear all unread notifications? This action cannot be undone."
                : `Are you sure you want to clear all ${activeTab} notifications? This action cannot be undone.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={clearAllNotifications}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              <Trash className="h-4 w-4 mr-2" />
              Clear Notifications
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// Notification List Component
interface NotificationListProps {
  notifications: Notification[];
  markAsRead: (id: string) => void;
  getNotificationIcon: (type: NotificationType) => JSX.Element;
}

function NotificationList({ notifications, markAsRead, getNotificationIcon }: NotificationListProps) {
  return (
    <div className="space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={cn(
            "flex cursor-pointer items-start rounded-md p-3 hover:bg-accent",
            !notification.read && "bg-muted"
          )}
          onClick={() => {
            markAsRead(notification.id);
            // In a real app, navigate to notification link
          }}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
            {getNotificationIcon(notification.type)}
          </div>
          
          <div className="ml-3 flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <p className={cn("text-sm", !notification.read && "font-medium")}>
                {notification.title}
              </p>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(notification.time, { addSuffix: true })}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {notification.message}
            </p>
          </div>
          
          {!notification.read && (
            <div className="ml-2 h-2 w-2 rounded-full bg-primary"></div>
          )}
        </div>
      ))}
    </div>
  );
}

// Empty State Component
interface EmptyStateProps {
  message: string;
}

function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex h-32 flex-col items-center justify-center rounded-md border border-dashed text-center">
      <Bell className="h-8 w-8 text-muted-foreground/50" />
      <p className="mt-2 text-sm text-muted-foreground">{message}</p>
    </div>
  );
}