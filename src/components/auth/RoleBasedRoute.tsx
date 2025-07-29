import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getRedirectPath } from "../../services/authService";
import { authService } from "../../services/authService";
import { UserRole, AuthUser } from "../../types/database";

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallbackPath?: string;
}

export function RoleBasedRoute({
  children,
  allowedRoles,
  fallbackPath = "/auth",
}: RoleBasedRouteProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080f17]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Case-insensitive role check
  const userRoleLower = user.role.toLowerCase();
  const allowedRolesLower = allowedRoles.map(r => r.toLowerCase());
  console.log('[RoleBasedRoute] allowedRoles:', allowedRoles, '| allowedRolesLower:', allowedRolesLower, '| user.role:', user.role, '| userRoleLower:', userRoleLower);
  if (!allowedRolesLower.includes(userRoleLower)) {
    console.log('[RoleBasedRoute] BLOCKED: userRoleLower not in allowedRolesLower, redirecting to', getRedirectPath(user.role));
    // Redirect to appropriate dashboard based on role
    const redirectPath = getRedirectPath(user.role);
    return <Navigate to={redirectPath} replace />;
  }
  console.log('[RoleBasedRoute] ALLOWED: rendering children for userRoleLower', userRoleLower);

  return <>{children}</>;
}

// Higher-order component for role-based access
export function withRoleGuard(allowedRoles: UserRole[], fallbackPath?: string) {
  return function <T extends {}>(Component: React.ComponentType<T>) {
    return function GuardedComponent(props: T) {
      return (
        <RoleBasedRoute allowedRoles={allowedRoles} fallbackPath={fallbackPath}>
          <Component {...props} />
        </RoleBasedRoute>
      );
    };
  };
}

// Specific role guards for common use cases
export const AdminRoute = ({ children }: { children: React.ReactNode }) => (
  <RoleBasedRoute allowedRoles={["admin"]}>{children}</RoleBasedRoute>
);

export const StartupRoute = ({ children }: { children: React.ReactNode }) => (
  <RoleBasedRoute allowedRoles={["startup", "admin"]}>
    {children}
  </RoleBasedRoute>
);

export const StructureRoute = ({ children }: { children: React.ReactNode }) => (
  <RoleBasedRoute allowedRoles={["structure", "admin"]}>
    {children}
  </RoleBasedRoute>
);

export const ClientRoute = ({ children }: { children: React.ReactNode }) => (
  <RoleBasedRoute allowedRoles={["client", "admin"]}>{children}</RoleBasedRoute>
);

export const AuthenticatedRoute = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <RoleBasedRoute allowedRoles={["client", "startup", "structure", "admin"]}>
    {children}
  </RoleBasedRoute>
);
