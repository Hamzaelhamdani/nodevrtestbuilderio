import { cn } from "../ui/utils";

interface LogoProps {
  className?: string;
  size?: "small" | "medium" | "large";
  onClick?: () => void;
}

export function Logo({ className = "", size = "medium", onClick }: LogoProps) {
  // Smaller text size for header
  const sizeClasses = {
    small: "text-base font-extrabold",
    medium: "text-xl font-extrabold",
    large: "text-2xl font-extrabold",
  };

  return (
    <span
      onClick={onClick}
      className={`cursor-pointer select-none flex items-center ${sizeClasses[size]} ${className}`}
      style={{ lineHeight: 1 }}
    >
      <span style={{ color: "#A7EE43" }}>VENTURES</span>
      <span style={{ color: "#fff" }}>ROOM</span>
    </span>
  );
}
