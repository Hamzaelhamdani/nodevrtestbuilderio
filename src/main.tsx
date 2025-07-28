// Initialize error handling FIRST, before any other imports
import { errorHandler } from "./utils/errorHandler";
errorHandler.init();

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "../styles/index.css";

// Add error boundary for development
if (process.env.NODE_ENV === "development") {
  window.addEventListener("error", (event) => {
    // Prevent Chrome extension errors from showing
    if (event.filename?.startsWith("chrome-extension://")) {
      event.preventDefault();
      return;
    }
    // Prevent fetch errors from showing
    if (event.message?.includes("Failed to fetch")) {
      event.preventDefault();
      return;
    }
  });

  // Handle unhandled promise rejections (including fetch errors)
  window.addEventListener("unhandledrejection", (event) => {
    if (
      event.reason instanceof Error &&
      (event.reason.message.includes("Failed to fetch") ||
       event.reason.message.includes("Backend unavailable"))
    ) {
      event.preventDefault();
      return;
    }
    console.error("Unhandled promise rejection:", event.reason);
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
