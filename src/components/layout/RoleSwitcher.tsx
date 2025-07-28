import { useState } from "react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import {
  BriefcaseIcon,
  BuildingIcon,
  ShieldIcon,
  UserIcon,
  UserCogIcon,
  SparklesIcon
} from "lucide-react";
import { Badge } from "../ui/badge";

interface RoleSwitcherProps {
  onRoleSelect: (userData: any) => void;
}

export function RoleSwitcher({ onRoleSelect }: RoleSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Mock user data for each role
  const mockUsers = {
    startup: {
      id: "startup-123",
      name: "Innovate Tech",
      email: "founder@innovatetech.com",
      role: "startup",
      avatar: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=100&h=100&auto=format&fit=crop",
      joinDate: "2024-03-15T08:00:00.000Z",
      companyInfo: {
        name: "Innovate Tech",
        logo: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=100&h=100&auto=format&fit=crop",
        description: "AI-powered business solutions"
      }
    },
    support: {
      id: "support-456",
      name: "Venture Capital Partners",
      email: "partner@vcpartners.com",
      role: "support",
      avatar: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&h=100&auto=format&fit=crop",
      joinDate: "2024-01-10T08:00:00.000Z",
      companyInfo: {
        name: "Venture Capital Partners",
        logo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&h=100&auto=format&fit=crop",
        description: "Early-stage startup accelerator"
      }
    },
    admin: {
      id: "admin-789",
      name: "System Administrator",
      email: "admin@venturesroom.com",
      role: "admin",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&auto=format&fit=crop",
      joinDate: "2023-11-05T08:00:00.000Z",
      permissions: ["all"]
    },
    client: {
      id: "client-101",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "client",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&auto=format&fit=crop",
      joinDate: "2024-04-20T08:00:00.000Z",
      subscriptions: []
    }
  };

  const handleRoleSelect = (roleType: keyof typeof mockUsers) => {
    onRoleSelect(mockUsers[roleType]);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2 bg-background/50 border-border/50 hover:bg-background/70 min-w-40">
            <UserCogIcon className="h-4 w-4 text-primary" />
            <span>Role Switcher</span>
            <Badge variant="outline" className="ml-auto text-xs h-5 bg-primary/10 border-primary/20 text-primary">
              <SparklesIcon className="h-3 w-3 mr-1" />
              Test
            </Badge>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64 bg-card/95 backdrop-blur-sm border-border/60">
          <DropdownMenuLabel className="text-center text-primary">
            Switch User Role
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="p-1.5">
            <p className="text-xs text-muted-foreground mb-2 px-2">
              Log in directly to test different interfaces
            </p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => handleRoleSelect("startup")}
            className="py-2 cursor-pointer focus:bg-primary/10 focus:text-foreground"
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-md bg-tertiary/20 flex items-center justify-center">
                <BriefcaseIcon className="h-4 w-4 text-tertiary" />
              </div>
              <div>
                <div className="font-medium">Startup</div>
                <div className="text-xs text-muted-foreground">Product & service management</div>
              </div>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => handleRoleSelect("support")}
            className="py-2 cursor-pointer focus:bg-primary/10 focus:text-foreground"
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-md bg-chart-4/20 flex items-center justify-center">
                <BuildingIcon className="h-4 w-4 text-chart-4" />
              </div>
              <div>
                <div className="font-medium">Support Structure</div>
                <div className="text-xs text-muted-foreground">Incubator/accelerator dashboard</div>
              </div>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => handleRoleSelect("admin")}
            className="py-2 cursor-pointer focus:bg-primary/10 focus:text-foreground"
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-md bg-destructive/20 flex items-center justify-center">
                <ShieldIcon className="h-4 w-4 text-destructive" />
              </div>
              <div>
                <div className="font-medium">Admin</div>
                <div className="text-xs text-muted-foreground">Platform management</div>
              </div>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => handleRoleSelect("client")}
            className="py-2 cursor-pointer focus:bg-primary/10 focus:text-foreground"
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-md bg-chart-5/20 flex items-center justify-center">
                <UserIcon className="h-4 w-4 text-chart-5" />
              </div>
              <div>
                <div className="font-medium">Client</div>
                <div className="text-xs text-muted-foreground">Customer dashboard</div>
              </div>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}