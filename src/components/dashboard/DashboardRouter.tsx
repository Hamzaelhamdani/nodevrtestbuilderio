import { Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import { StartupDashboard } from "../startup/StartupDashboard";
import { StructureDashboard } from "../structure/StructureDashboard";
import { AdminPortal } from "../admin/AdminPortal";
import { useAuth } from "../../contexts/AuthContext";

export function DashboardRouter() {
  const { user } = useAuth();

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
        {/* Admin Dashboard Routes */}
        <Route index element={user?.role === 'admin' ? <AdminPortal user={user} /> : user?.role === 'startup' ? <StartupDashboard user={user} /> : user?.role === 'structure' ? <StructureDashboard user={user} /> : <AdminPortal user={user} />} />
        <Route path="admin" element={<AdminPortal user={user} />} />
        <Route path="admin/*" element={<AdminPortal user={user} />} />

        {/* Startup Dashboard Routes */}
        <Route path="startup" element={<StartupDashboard user={user} />} />
        <Route path="startup/*" element={<StartupDashboard user={user} />} />

        {/* Structure Dashboard Routes */}
        <Route path="structure" element={<StructureDashboard user={user} />} />
        <Route path="structure/*" element={<StructureDashboard user={user} />} />
      </Routes>
    </motion.div>
  );
}
