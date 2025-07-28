import { Badge } from "./ui/badge";
import { Database, Zap } from "lucide-react";

export function DataSourceIndicator() {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Badge 
        variant="secondary" 
        className="bg-green-500/10 text-green-400 border-green-500/20 flex items-center gap-2 px-3 py-2"
      >
        <Database className="h-4 w-4" />
        <span className="text-sm font-medium">Real Database Data</span>
        <Zap className="h-3 w-3" />
      </Badge>
    </div>
  );
}
