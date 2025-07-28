import React from "react";
import { cn } from "./utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl" | "full" | "fluid";
  centered?: boolean;
  as?: React.ElementType;
  padded?: boolean;
}

export function Container({
  children,
  className,
  size = "lg",
  centered = true,
  as: Component = "div",
  padded = true,
  ...props
}: ContainerProps) {
  const containerSizes = {
    sm: "max-w-screen-sm", // 640px
    md: "max-w-screen-md", // 768px
    lg: "max-w-screen-lg", // 1024px
    xl: "max-w-screen-xl", // 1280px
    full: "max-w-full",
    fluid: "max-w-none"
  };

  return (
    <Component
      className={cn(
        "w-full",
        containerSizes[size],
        centered && "mx-auto",
        padded && "px-4 sm:px-6 md:px-8",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  containerSize?: "sm" | "md" | "lg" | "xl" | "full" | "fluid";
  containerClassName?: string;
  spacing?: "none" | "sm" | "md" | "lg" | "xl";
  as?: React.ElementType;
}

export function Section({
  children,
  className,
  containerSize = "lg",
  containerClassName,
  spacing = "lg",
  as: Component = "section",
  ...props
}: SectionProps) {
  const spacingClasses = {
    none: "py-0",
    sm: "py-4 sm:py-6",
    md: "py-6 sm:py-10",
    lg: "py-12 sm:py-16",
    xl: "py-16 sm:py-24"
  };

  return (
    <Component
      className={cn(
        "w-full relative",
        spacingClasses[spacing],
        className
      )}
      {...props}
    >
      <Container size={containerSize} className={containerClassName}>
        {children}
      </Container>
    </Component>
  );
}

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: number | { base: number; sm?: number; md?: number; lg?: number; xl?: number };
  gap?: string;
  as?: React.ElementType;
}

export function Grid({
  children,
  className,
  cols = { base: 1, sm: 2, md: 3, lg: 4 },
  gap = "gap-6",
  as: Component = "div",
  ...props
}: GridProps) {
  // Handle numeric shorthand
  if (typeof cols === "number") {
    cols = { base: 1, md: cols };
  }

  // Generate responsive grid column classes
  const colClasses = [
    `grid-cols-${cols.base}`,
    cols.sm && `sm:grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`,
  ].filter(Boolean).join(" ");

  return (
    <Component
      className={cn(
        "grid",
        colClasses,
        gap,
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}