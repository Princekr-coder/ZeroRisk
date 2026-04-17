import { cn } from "@/lib/utils";

export function ScoreCard({ title, value, status, description, icon: Icon }) {
  const statusConfig = {
    Good: { text: "text-neon-cyan", border: "border-neon-cyan/30", bg: "bg-neon-cyan/10" },
    High: { text: "text-neon-cyan", border: "border-neon-cyan/30", bg: "bg-neon-cyan/10" },
    Low:  { text: "text-green-500", border: "border-green-500/30", bg: "bg-green-500/10" },
    Medium: { text: "text-yellow-500", border: "border-yellow-500/30", bg: "bg-yellow-500/10" },
    Risky: { text: "text-red-500", border: "border-red-500/30", bg: "bg-red-500/10" },
  };

  const currentConfig = statusConfig[status] || statusConfig.Medium;

  return (
    <div className={cn("relative flex flex-col p-6 rounded-xl border bg-card/60 backdrop-blur-md transition-all hover:shadow-md", currentConfig.border)}>
      <div className="flex items-center justify-between space-x-2 pb-2">
        <h3 className="tracking-tight text-sm font-medium text-muted-foreground">{title}</h3>
        {Icon && <Icon className={cn("h-4 w-4", currentConfig.text)} />}
      </div>
      <div className="flex flex-col gap-1 mt-2">
        <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
           {value}
        </div>
        <div className="flex items-center space-x-2 mt-2">
          {status && (
            <span className={cn("inline-flex items-center rounded-md px-2.5 py-1 text-xs font-bold", currentConfig.text, currentConfig.bg)}>
              {status}
            </span>
          )}
          {description && <p className="text-xs text-muted-foreground line-clamp-1">{description}</p>}
        </div>
      </div>
    </div>
  );
}
