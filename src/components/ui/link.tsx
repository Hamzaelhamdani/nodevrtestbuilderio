import { forwardRef } from "react";
import { Link as RouterLink, To } from "react-router-dom";
import { cn } from "../../utils/cn"; // Fix the import path

export interface LinkProps {
  href: To;
  asChild?: boolean;
  external?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, children, external, href, ...props }, ref) => {
    if (external) {
      return (
        <a
          ref={ref}
          href={href.toString()}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            className
          )}
          target="_blank"
          rel="noopener noreferrer"
          {...props}
        >
          {children}
        </a>
      );
    }

    return (
      <RouterLink
        ref={ref}
        to={href}
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          className
        )}
        {...props}
      >
        {children}
      </RouterLink>
    );
  }
);

Link.displayName = "Link";

export { Link };
