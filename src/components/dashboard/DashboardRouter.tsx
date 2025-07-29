import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { StartupDashboard } from "../startup/StartupDashboard";
import { StructureDashboard } from "../structure/StructureDashboard";
import { AdminPortal } from "../admin/AdminPortal";
import { useAuth } from "../../contexts/AuthContext";

export function DashboardRouter() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Simple animation for dashboard transitions
  const dashboardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  return (
    <motion.div
      variants={dashboardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Routes>
        {/* Directly render the correct dashboard for each role at the index route */}
        <Route
          index
          element={
            user?.role === 'admin' ? (
              <AdminPortal user={user} />
            ) : user?.role === 'startup' ? (
              <StartupDashboard user={user} navigate={(route: string) => navigate(route)} />
            ) : user?.role === 'structure' ? (
              <StructureDashboard user={user} />
            ) : (
              <div>No dashboard available for your role.</div>
            )
          }
        />
        <Route path="admin" element={<AdminPortal user={user} />} />
        <Route path="admin/*" element={<AdminPortal user={user} />} />

        {/* Startup Dashboard Routes */}
        <Route path="startup" element={<StartupDashboard user={user} navigate={(route: string) => navigate(route)} />} />
        <Route path="startup/*" element={<StartupDashboard user={user} navigate={(route: string) => navigate(route)} />} />

        {/* Structure Dashboard Routes */}
        <Route path="structure" element={<StructureDashboard user={user} />} />
        <Route path="structure/*" element={<StructureDashboard user={user} />} />
      </Routes>
    </motion.div>
  );
}
