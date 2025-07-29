// src/components/auth/RoleBasedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface Props { children: React.ReactNode; }

export function AuthenticatedRoute({ children }: Props) {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/auth" replace />;
}

export function AdminRoute({ children }: Props) {
  const { user } = useAuth();
  if (!user)   return <Navigate to="/auth" replace />;
  if (user.role!=='admin') return <Navigate to="/" replace />;
  return <>{children}</>;
}

export function StartupRoute({ children }: Props) {
  const { user } = useAuth();
  if (!user)      return <Navigate to="/auth" replace />;
  if (user.role!=='startup') return <Navigate to="/" replace />;
  return <>{children}</>;
}

export function StructureRoute({ children }: Props) {
  const { user } = useAuth();
  if (!user)        return <Navigate to="/auth" replace />;
  if (user.role!=='structure') return <Navigate to="/" replace />;
  return <>{children}</>;
}

export function ClientRoute({ children }: Props) {
  const { user } = useAuth();
  if (!user)     return <Navigate to="/auth" replace />;
  if (user.role!=='client') return <Navigate to="/" replace />;
  return <>{children}</>;
}
