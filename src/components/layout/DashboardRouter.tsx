import { useState } from "react";
import { motion } from "framer-motion";
import { StartupDashboard } from "../startup/StartupDashboard";
import { SupportStructureDashboard } from "../support-structure/SupportStructureDashboard";
import { AdminPortal } from "../admin/AdminPortal";
import { Route } from "./NavigationBar";

type DashboardRouterProps = {
  user: any;
  currentRoute: Route;
  navigate: (route: Route) => void;
};

export function DashboardRouter({ user, currentRoute, navigate }: DashboardRouterProps) {
  const [loading, setLoading] = useState(false);

  // Simple animation for dashboard transitions
  const dashboardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.4,
        ease: "easeOut"
      } 
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { 
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  // Show appropriate dashboard based on route
  if (currentRoute === "startup-dashboard") {
    return (
      <motion.div
        variants={dashboardVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <StartupDashboard user={user} navigate={navigate} />
      </motion.div>
    );
  }

  if (currentRoute === "support-structure-dashboard") {
    return (
      <motion.div
        variants={dashboardVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <SupportStructureDashboard user={user} navigate={navigate} />
      </motion.div>
    );
  }

  if (currentRoute === "admin-portal") {
    return (
      <motion.div
        variants={dashboardVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <AdminPortal user={user} navigate={navigate} />
      </motion.div>
    );
  }

  // Fallback for unknown dashboard routes
  return (
    <div className="container py-8">
      <h1>Unknown Dashboard</h1>
      <p>The requested dashboard could not be found.</p>
    </div>
  );
}