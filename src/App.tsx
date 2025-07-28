import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./components/theme/ThemeProvider";
import { AuthProvider } from "./contexts/AuthContext";
import { Layout } from "./components/layout/Layout";
import { HomePage } from "./components/home/HomePage";
import { AuthenticationFlow } from "./components/auth/AuthenticationFlow";
import { Marketplace } from "./components/marketplace/Marketplace";
import { StartupStorefront } from "./components/startup/StartupStorefront";
import { ClientDashboard } from "./components/client/ClientDashboard";
import { VentureRoomClub } from "./components/club/VentureRoomClub";
import { PaymentSystem } from "./components/payments/PaymentSystem";
import { CommunityDiscounts } from "./components/community/CommunityDiscounts";
import { DashboardRouter } from "./components/dashboard/DashboardRouter";
import {
  AdminRoute,
  StartupRoute,
  StructureRoute,
  ClientRoute,
  AuthenticatedRoute,
} from "./components/auth/RoleBasedRoute";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { DemoModeIndicator } from "./components/DemoModeIndicator";
import { StartupStorefrontListing } from "./components/startup/StartupStorefrontListing";
import { SupportStructureDashboard } from "./components/support-structure/SupportStructureDashboard";
import { useEffect, useState } from "react";
import { startupService } from "./services/startupService";
import { structureService } from "./services/structureService";
import { useAuth } from "./contexts/AuthContext";
import { AllStartupsPage } from "./components/startup/AllStartupsPage";
import { AllSupportStructuresPage } from "./components/support-structure/AllSupportStructuresPage";
import { StartupDetailPage } from "./components/startup/StartupDetailPage";

// Animation variants for page transitions
const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeInOut" },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3, ease: "easeInOut" },
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
  const [startups, setStartups] = useState([]);
  useEffect(() => {
    startupService.getStartups().then(setStartups);
  }, []);
  return <StartupStorefrontListing startups={startups} />;
}

function StructuresPage() {
  const [structures, setStructures] = useState([]);
  const { user } = useAuth();
  useEffect(() => {
    structureService.getStructures().then(setStructures);
  }, []);
  return <SupportStructureDashboard user={user} structures={structures} />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <DemoModeIndicator />
          <Layout>
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
                path="/auth"
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

              {/* Marketplace - accessible to all but enhanced for authenticated users */}
              <Route
                path="/marketplace"
                element={
                  <AnimatedRoute>
                    <Marketplace />
                  </AnimatedRoute>
                }
              />

              {/* VIP Club - accessible to all */}
              <Route
                path="/club"
                element={
                  <AnimatedRoute>
                    <VentureRoomClub />
                  </AnimatedRoute>
                }
              />

              {/* Client Routes */}
              <Route
                path="/client/*"
                element={
                  <ClientRoute>
                    <AnimatedRoute>
                      <Routes>
                        <Route path="dashboard" element={<ClientDashboard />} />
                        <Route path="orders" element={<ClientDashboard />} />
                        <Route
                          path="*"
                          element={<Navigate to="/client/dashboard" replace />}
                        />
                      </Routes>
                    </AnimatedRoute>
                  </ClientRoute>
                }
              />

              {/* Startup Routes */}
              <Route
                path="/dashboard/startup/*"
                element={
                  <StartupRoute>
                    <AnimatedRoute>
                      <DashboardRouter />
                    </AnimatedRoute>
                  </StartupRoute>
                }
              />

              {/* Structure Routes */}
              <Route
                path="/dashboard/structure/*"
                element={
                  <StructureRoute>
                    <AnimatedRoute>
                      <DashboardRouter />
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
                      <DashboardRouter />
                    </AnimatedRoute>
                  </AdminRoute>
                }
              />

              {/* Authenticated Routes */}
              <Route
                path="/payments"
                element={
                  <AuthenticatedRoute>
                    <AnimatedRoute>
                      <PaymentSystem />
                    </AnimatedRoute>
                  </AuthenticatedRoute>
                }
              />

              <Route
                path="/community"
                element={
                  <AuthenticatedRoute>
                    <AnimatedRoute>
                      <CommunityDiscounts />
                    </AnimatedRoute>
                  </AuthenticatedRoute>
                }
              />

              {/* Redirect old routes to new structure */}
              <Route
                path="/startup-dashboard"
                element={<Navigate to="/dashboard/startup" replace />}
              />
              <Route
                path="/structure-dashboard"
                element={<Navigate to="/dashboard/structure" replace />}
              />
              <Route
                path="/admin-portal"
                element={<Navigate to="/dashboard/admin" replace />}
              />
              <Route
                path="/client-dashboard"
                element={<Navigate to="/client/dashboard" replace />}
              />

              {/* New Routes */}
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

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
