import { MoonIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useTheme } from "./ThemeProvider";

export function ThemeSwitcher() {
  const { isDarkModeOnly } = useTheme();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <MoonIcon
              className="size-5 text-primary/80"
              aria-hidden="true"
            />
            <span className="sr-only">Dark Mode</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>VenturesRoom uses dark mode only</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}