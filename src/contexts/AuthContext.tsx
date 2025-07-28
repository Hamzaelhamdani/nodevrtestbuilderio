import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { AuthUser, UserRole } from "../types/database";

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  refreshUser: () => Promise<void>;
  updateProfile: (
    updates: Partial<AuthUser>,
  ) => Promise<{ success: boolean; message?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Get initial session
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      // Only log if it's not a backend unavailable error
      if (error instanceof Error && !error.message.includes('Backend unavailable')) {
        console.error("Error initializing auth:", error);
      }
      // In case of backend unavailability, set user to null and continue
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error("Error refreshing user:", error);
      setUser(null);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await authService.signIn(email, password);

      if (response.success && response.user) {
        setUser(response.user);

        // Auto-redirect based on role
        if (response.redirect_path) {
          navigate(response.redirect_path, { replace: true });
        }
      }

      return response;
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "An unexpected error occurred" };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authService.signOut();
      setUser(null);
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<AuthUser>) => {
    try {
      const response = await authService.updateProfile(updates);

      if (response.success) {
        // Update local user state
        setUser((current) => (current ? { ...current, ...updates } : null));
      }

      return response;
    } catch (error) {
      console.error("Update profile error:", error);
      return { success: false, message: "An unexpected error occurred" };
    }
  };

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    return authService.hasRole(user, roles);
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    hasRole,
    refreshUser,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Helper hooks for role-based access
export function useRequireAuth(roles?: UserRole | UserRole[]) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/auth", { replace: true });
      } else if (roles && !authService.hasRole(user, roles)) {
        // Redirect to appropriate dashboard based on user role
        const redirectPath = authService.getRedirectPath(user.role);
        navigate(redirectPath, { replace: true });
      }
    }
  }, [user, loading, roles, navigate]);

  return {
    user,
    loading,
    isAuthorized: !roles || authService.hasRole(user, roles),
  };
}

export function useRequireAdmin() {
  return useRequireAuth("admin");
}

export function useRequireStartup() {
  return useRequireAuth("startup");
}

export function useRequireStructure() {
  return useRequireAuth("structure");
}

export function useRequireClient() {
  return useRequireAuth("client");
}
