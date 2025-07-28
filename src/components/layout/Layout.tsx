import { ReactNode, useRef } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { ResponsiveProvider } from "../ui/use-responsive";

interface LayoutProps {
  children: ReactNode;
}

function LayoutContent({ children }: LayoutProps) {
  // Reference to main content for keyboard navigation
  const mainContentRef = useRef<HTMLElement>(null);

  // Skip to main content functionality
  const handleSkipToContent = () => {
    if (mainContentRef.current) {
      mainContentRef.current.focus();
      mainContentRef.current.scrollIntoView();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Skip to content link - only visible on focus (for accessibility) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-background focus:text-foreground focus:top-0 focus:left-0"
        onClick={handleSkipToContent}
      >
        Skip to content
      </a>

      <Header />

      <main
        className="flex-1 relative w-full min-h-[calc(100vh-160px)]"
        ref={mainContentRef}
        tabIndex={-1}
        id="main-content"
        aria-live="polite"
      >
        {children}
      </main>

      <Footer />
    </div>
  );
}

export function Layout(props: LayoutProps) {
  // Wrap with ResponsiveProvider to provide responsive context to all components
  return (
    <ResponsiveProvider>
      <LayoutContent {...props} />
    </ResponsiveProvider>
  );
}
