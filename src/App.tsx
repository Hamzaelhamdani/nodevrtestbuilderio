// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ThemeProvider } from "./components/theme/ThemeProvider";
import { AuthProvider } from "./contexts/AuthContext";
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

// Role‑based wrappers
import {
  AdminRoute,
  StartupRoute,
  StructureRoute,
  ClientRoute,
  AuthenticatedRoute,
} from "./components/auth/RoleBasedRoute";

import { motion, AnimatePresence } from "framer-motion";
import { DemoModeIndicator } from "./components/DemoModeIndicator";

import { StartupStorefrontListing } from "./components/startup/StartupStorefrontListing";
import { AllStartupsPage } from "./components/startup/AllStartupsPage";
import { StartupDetailPage } from "./components/startup/StartupDetailPage";
import { AllSupportStructuresPage } from "./components/support-structure/AllSupportStructuresPage";

import { useEffect, useState } from "react";
import { startupService } from "./services/startupService";
import { structureService } from "./services/structureService";
import { useAuth } from "./contexts/AuthContext";

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

function StructuresPage() {
  const { user } = useAuth();
  return <SupportStructureDashboard user={user} />;
}

function AppRoutesWithUser() {
  const { user } = useAuth();
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={
          <AnimatedRoute>
            <HomePage />
          </AnimatedRoute>
        }
      />
      <Route
        path="/auth/*"
        element={
          <AnimatedRoute>
            <AuthenticationFlow />
          </AnimatedRoute>
        }
      />
      <Route
        path="/startup/:id"
        element={
          <AnimatedRoute>
            <StartupStorefront />
          </AnimatedRoute>
        }
      />

      {/* Marketplace */}
      <Route
        path="/marketplace"
        element={
          <AnimatedRoute>
            <Marketplace />
          </AnimatedRoute>
        }
      />

      {/* VIP Club */}
      <Route
        path="/club"
        element={
          <AnimatedRoute>
            <VentureRoomClub user={user} onLogin={() => {}} onSignup={() => {}} />
          </AnimatedRoute>
        }
      />

      {/* Client Routes */}
      <Route
        path="/dashboard/client"
        element={
          <ClientRoute>
            <AnimatedRoute>
              <ClientDashboard user={user} />
            </AnimatedRoute>
          </ClientRoute>
        }
      />
      <Route
        path="/client/dashboard"
        element={
          <ClientRoute>
            <AnimatedRoute>
              <ClientDashboard user={user} />
            </AnimatedRoute>
          </ClientRoute>
        }
      />
      <Route
        path="/client/orders"
        element={
          <ClientRoute>
            <AnimatedRoute>
              <ClientDashboard user={user} />
            </AnimatedRoute>
          </ClientRoute>
        }
      />
      <Route
        path="/client/*"
        element={<Navigate to="/client/dashboard" replace />}
      />

      {/* Startup Routes */}
      <Route
        path="/dashboard/startup/*"
        element={
          <StartupRoute>
            <AnimatedRoute>
              <StartupDashboard user={user} navigate={(route: string) => useNavigate()(route)} />
            </AnimatedRoute>
          </StartupRoute>
        }
      />

      {/* Support Structure Routes */}
      <Route
        path="/dashboard/structure/*"
        element={
          <StructureRoute>
            <AnimatedRoute>
              <StructuresPage />
            </AnimatedRoute>
          </StructureRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/dashboard/admin/*"
        element={
          <AdminRoute>
            <AnimatedRoute>
              <AdminPortal user={user} />
            </AnimatedRoute>
          </AdminRoute>
        }
      />

      {/* Authenticated-only Routes */}
      <Route
        path="/payments"
        element={
          <AuthenticatedRoute>
            <AnimatedRoute>
              <PaymentSystem user={user} />
            </AnimatedRoute>
          </AuthenticatedRoute>
        }
      />
      <Route
        path="/community"
        element={
          <AuthenticatedRoute>
            <AnimatedRoute>
              <CommunityDiscounts user={user} />
            </AnimatedRoute>
          </AuthenticatedRoute>
        }
      />

      {/* Legacy redirects */}
      <Route path="/startup-dashboard" element={<Navigate to="/dashboard/startup" replace />} />
      <Route path="/structure-dashboard" element={<Navigate to="/dashboard/structure" replace />} />
      <Route path="/admin-portal" element={<Navigate to="/dashboard/admin" replace />} />
      <Route path="/client-dashboard" element={<Navigate to="/client/dashboard" replace />} />

      {/* New list/detail pages */}
      <Route
        path="/startups"
        element={
          <AnimatedRoute>
            <AllStartupsPage />
          </AnimatedRoute>
        }
      />
      <Route
        path="/startups/:id"
        element={
          <AnimatedRoute>
            <StartupDetailPage />
          </AnimatedRoute>
        }
      />
      <Route
        path="/structures"
        element={
          <AnimatedRoute>
            <AllSupportStructuresPage />
          </AnimatedRoute>
        }
      />

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
