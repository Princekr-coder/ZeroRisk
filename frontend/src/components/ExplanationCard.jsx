import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export function ExplanationCard({ feature, description, impactValue }) {
  // Defensive typing checks inside case backend returns raw strings
  const impactNum = parseFloat(impactValue);
  const isPositive = impactNum > 0;
  const displayValue = isNaN(impactNum) ? impactValue : (isPositive ? `+${impactNum}` : `${impactNum}`);

  return (
    <div className="flex flex-col p-5 rounded-xl border border-white/10 bg-white/5 shadow-sm hover:border-white/20 transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h4 className="text-sm font-bold text-foreground capitalize">{feature?.replace(/_/g, ' ')}</h4>
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{description}</p>
        </div>
        <div className={cn(
          "flex items-center space-x-1 px-2.5 py-1.5 rounded-md text-xs font-bold shrink-0",
          isPositive 
            ? "bg-neon-cyan/20 text-neon-cyan" 
            : "bg-red-500/20 text-red-400"
        )}>
          {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          <span>{displayValue} Pts</span>
        </div>
      </div>
    </div>
  );
}
