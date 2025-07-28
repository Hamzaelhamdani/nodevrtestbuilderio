
// Theme configuration for VenturesRoom
export const theme = {
  colors: {
    // Vibrant colors as requested
    electricBlue: "#0066FF",
    limeGreen: "#00E676",
    warmPurple: "#8E24AA",
    
    // UI colors
    background: "#FFFFFF",
    foreground: "#1A1A2E",
    primary: "#0066FF", // Electric blue as primary
    secondary: "#8E24AA", // Warm purple as secondary
    accent: "#00E676", // Lime green as accent
    muted: "#F5F5F7",
    border: "rgba(0, 0, 0, 0.1)",
  },
  radius: {
    sm: "8px",
    md: "12px", // As requested (12-16px rounded corners)
    lg: "16px",
    xl: "24px",
  },
  fonts: {
    sans: "Inter, system-ui, sans-serif",
  }
};

// User types for the platform
export const userTypes = {
  STARTUP: "startup",
  INCUBATOR: "incubator",
  CLIENT: "client"
};

// Product categories for marketplace
export const productCategories = [
  { id: "saas", name: "SaaS Tools", icon: "code" },
  { id: "services", name: "Services", icon: "briefcase" },
  { id: "hardware", name: "Tech Gadgets", icon: "cpu" },
  { id: "marketing", name: "Marketing", icon: "trending-up" },
  { id: "design", name: "Design", icon: "layers" },
  { id: "development", name: "Development", icon: "terminal" }
];

// Add custom CSS variables
if (typeof document !== "undefined") {
  document.documentElement.style.setProperty("--electric-blue", theme.colors.electricBlue);
  document.documentElement.style.setProperty("--lime-green", theme.colors.limeGreen);
  document.documentElement.style.setProperty("--warm-purple", theme.colors.warmPurple);
}
