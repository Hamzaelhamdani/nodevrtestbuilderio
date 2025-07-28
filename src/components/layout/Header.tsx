import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "./Logo";
import { Button } from "../ui/button";
import {
  LogOutIcon,
  LogInIcon,
  UserPlusIcon,
  HomeIcon,
  LayoutDashboardIcon,
  UserIcon,
  MenuIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useState, useEffect } from "react";
import { RoleSwitcher } from "./RoleSwitcher";
import { useAuth } from "../../contexts/AuthContext";

interface HeaderProps {
  children?: ReactNode;
}

export function Header({ children }: HeaderProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Determine which dashboard path based on user role
  const getDashboardPath = () => {
    if (!user) return "/auth";
    switch (user.role) {
      case "startup":
        return "/dashboard/startup";
      case "structure":
        return "/dashboard/structure";
      case "admin":
        return "/dashboard/admin";
      case "client":
        return "/client/dashboard";
      default:
        return "/";
    }
  };

  const isAuthenticated = !!user;

  // Close mobile menu when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileMenuOpen]);

  const handleLogout = async () => {
    setIsMobileMenuOpen(false);
    await logout();
    navigate("/");
  };

  return (
    <header className="border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between w-full">
            {/* Logo */}
  <div className="flex items-center h-full">
    <Logo onClick={() => navigate("/")} size="large" />
  </div>

  {/* Desktop navigation links - center */}
  <nav className="hidden md:flex items-center gap-6 flex-1 justify-center">
    <Button
      variant="link"
      onClick={() => navigate("/marketplace")}
      className="text-foreground/80 hover:text-primary"
    >
      Marketplace
    </Button>
    <Button
      variant="link"
      onClick={() => navigate("/startups")}
      className="text-foreground/80 hover:text-primary"
    >
      Startups
    </Button>
    <Button
      variant="link"
      onClick={() => navigate("/structures")}
      className="text-foreground/80 hover:text-primary"
    >
      Support Structures
    </Button>
    <Button
      variant="link"
      onClick={() => navigate("/club")}
      className="text-foreground/80 hover:text-primary"
    >
      Club
    </Button>
          </nav>

          {/* Pass children (including BackupManager) */}
          {children}

          {/* Authentication actions - right */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {/* Desktop view */}
                <div className="hidden md:flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(getDashboardPath())}
                    className="flex gap-2 items-center"
                  >
                    <LayoutDashboardIcon className="h-4 w-4" />
                    Dashboard
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="relative">
                        <UserIcon className="h-4 w-4 mr-2" />
                        {user.full_name || "Account"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem>
                        <UserIcon className="h-4 w-4 mr-2" />
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOutIcon className="h-4 w-4 mr-2" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Mobile menu button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <MenuIcon className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <>
                {/* Desktop view */}
                <div className="hidden md:flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/auth")}
                    className="flex gap-2 items-center"
                  >
                    <LogInIcon className="h-4 w-4" />
                    Sign In
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => navigate("/auth")}
                    className="flex gap-2 items-center"
                  >
                    <UserPlusIcon className="h-4 w-4" />
                    Sign Up
                  </Button>
                </div>

                {/* Mobile menu button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <MenuIcon className="h-5 w-5" />
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pt-4 pb-2 border-t border-border mt-4">
            <nav className="flex flex-col gap-3">
              {/* Home button removed */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  navigate("/marketplace");
                  setIsMobileMenuOpen(false);
                }}
                className="justify-start"
              >
                <HomeIcon className="h-4 w-4 mr-2" />
                Marketplace
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  navigate("/startups");
                  setIsMobileMenuOpen(false);
                }}
                className="justify-start"
              >
                <HomeIcon className="h-4 w-4 mr-2" />
                Startups
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  navigate("/structures");
                  setIsMobileMenuOpen(false);
                }}
                className="justify-start"
              >
                <HomeIcon className="h-4 w-4 mr-2" />
                Support Structures
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  navigate("/club");
                  setIsMobileMenuOpen(false);
                }}
                className="justify-start"
              >
                <HomeIcon className="h-4 w-4 mr-2" />
                Club
              </Button>

              {isAuthenticated ? (
                <>
                  <div className="pt-2 border-t border-border">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        navigate(getDashboardPath());
                        setIsMobileMenuOpen(false);
                      }}
                      className="justify-start w-full"
                    >
                      <LayoutDashboardIcon className="h-4 w-4 mr-2" />
                      Dashboard
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="justify-start w-full text-destructive"
                    >
                      <LogOutIcon className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="pt-2 border-t border-border">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        navigate("/auth");
                        setIsMobileMenuOpen(false);
                      }}
                      className="justify-start w-full"
                    >
                      <LogInIcon className="h-4 w-4 mr-2" />
                      Sign In
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => {
                        navigate("/auth");
                        setIsMobileMenuOpen(false);
                      }}
                      className="justify-start w-full"
                    >
                      <UserPlusIcon className="h-4 w-4 mr-2" />
                      Sign Up
                    </Button>
                  </div>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}