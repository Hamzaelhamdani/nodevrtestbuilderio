// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "./components/theme/ThemeProvider";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Layout } from "./components/layout/Layout";
import { HomePage } from "./components/home/HomePage";
import AuthenticationFlow from "./components/auth/AuthenticationFlow";
import { Marketplace } from "./components/marketplace/Marketplace";
import { StartupStorefront } from "./components/startup/StartupStorefront";
import { ClientDashboard } from "./components/client/ClientDashboard";
import { VentureRoomClub } from "./components/club/VentureRoomClub";
import { PaymentSystem } from "./components/payments/PaymentSystem";
import { CommunityDiscounts } from "./components/community/CommunityDiscounts";
import { AdminPortal } from "./components/admin/AdminPortal";
import { StartupDashboard } from "./components/startup/StartupDashboard";
import { SupportStructureDashboard } from "./components/support-structure/SupportStructureDashboard";


// Role-based wrappers
import {
  AdminRoute,
  StartupRoute,
  StructureRoute,
  ClientRoute,
  AuthenticatedRoute,
} from "./components/auth/RoleBasedRoute";

import { motion, AnimatePresence } from "framer-motion";
import { StartupStorefrontListing } from "./components/startup/StartupStorefrontListing";
import { AllStartupsPage } from "./components/startup/AllStartupsPage";
import { StartupDetailPage } from "./components/startup/StartupDetailPage";
import { AllSupportStructuresPage } from "./components/support-structure/AllSupportStructuresPage";

import { useEffect, useState } from "react";
import { startupService } from "./services/startupService";

// Animation variants for page transitions
const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeInOut" }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3, ease: "easeInOut" }
  },
};

function AnimatedRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={pageVariants}
        className="min-h-[calc(100vh-80px)]"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

function StartupsPage() {
  const [startups, setStartups] = useState<any[]>([]);
  useEffect(() => {
    startupService.getStartups().then(setStartups);
  }, []);
  return <StartupStorefrontListing startups={startups} />;
}

function RedirectToOwnDashboard() {
  const { user } = useAuth();
  const role = user?.role.toLowerCase();
  const map: Record<string,string> = {
    startup:        "/dashboard/startup",
    supportstructure: "/dashboard/structure",
    admin:          "/dashboard/admin",
    client:         "/dashboard/client",
  };
  return <Navigate to={map[role!] ?? "/"} replace />;
}

function AppRoutesWithUser() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<AnimatedRoute><HomePage /></AnimatedRoute>} />
      <Route path="/auth/*" element={<AnimatedRoute><AuthenticationFlow /></AnimatedRoute>} />

      {/* Generic /dashboard redirects to role-specific */}
      <Route path="/dashboard" element={<RedirectToOwnDashboard />} />

      {/* Startup storefront */}
      <Route path="/startup/:id" element={<AnimatedRoute><StartupStorefront /></AnimatedRoute>} />
      <Route path="/marketplace" element={<AnimatedRoute><Marketplace /></AnimatedRoute>} />
      <Route path="/club" element={<AnimatedRoute><VentureRoomClub user={user!} onLogin={()=>{}} onSignup={()=>{}}/></AnimatedRoute>} />

      {/* Client */}
      <Route path="/dashboard/client/*" element={
        <ClientRoute>
          <AnimatedRoute><ClientDashboard user={user!} /></AnimatedRoute>
        </ClientRoute>
      } />

      {/* Startup */}
      <Route path="/dashboard/startup/*" element={
        <StartupRoute>
          <AnimatedRoute><StartupDashboard user={user!} /></AnimatedRoute>
        </StartupRoute>
      } />

      {/* Support Structure */}
      <Route path="/dashboard/structure/*" element={
        <StructureRoute>
          <AnimatedRoute><SupportStructureDashboard user={user!} /></AnimatedRoute>
        </StructureRoute>
      } />

      {/* Admin */}
      <Route path="/dashboard/admin/*" element={
        <AdminRoute>
          <AnimatedRoute><AdminPortal user={user!} /></AnimatedRoute>
        </AdminRoute>
      } />

      {/* Authenticated-only extras */}
      <Route path="/payments" element={
        <AuthenticatedRoute>
          <AnimatedRoute><PaymentSystem user={user!} /></AnimatedRoute>
        </AuthenticatedRoute>
      } />
      <Route path="/community" element={
        <AuthenticatedRoute>
          <AnimatedRoute><CommunityDiscounts user={user!} /></AnimatedRoute>
        </AuthenticatedRoute>
      } />

      {/* List & detail pages */}
      <Route path="/startups" element={<AnimatedRoute><AllStartupsPage /></AnimatedRoute>} />
      <Route path="/startups/:id" element={<AnimatedRoute><StartupDetailPage /></AnimatedRoute>} />
      <Route path="/structures" element={<AnimatedRoute><AllSupportStructuresPage /></AnimatedRoute>} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <Layout>
            <AppRoutesWithUser />
          </Layout>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
