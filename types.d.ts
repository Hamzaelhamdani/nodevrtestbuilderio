
// types.d.ts - Global type declarations
import { Route } from "./src/components/layout/NavigationBar";

declare global {
  interface Window {
    navigateTo: (route: Route, params?: Record<string, string>) => void;
    setUser: (user: any) => void;
    handleLogin: (userData?: any) => void;
    handleLogout: () => void;
  }
}

export {};
