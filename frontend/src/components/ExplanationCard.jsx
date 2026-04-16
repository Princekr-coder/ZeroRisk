import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export function ExplanationCard({ feature, description, impactValue }) {
  const isPositive = impactValue > 0;
  // Let's assume we format the impact value appropriately
  const displayValue = isPositive ? `+${impactValue}` : `${impactValue}`;

  return (
    <div className="flex flex-col p-4 rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="text-sm font-semibold text-foreground">{feature}</h4>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{description}</p>
        </div>
        <div className={cn(
          "flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-semibold shrink-0 ml-4",
          isPositive 
            ? "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400" 
            : "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400"
        )}>
          {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          <span>{displayValue} Pts</span>
        </div>
      </div>
    </div>
  );
}
