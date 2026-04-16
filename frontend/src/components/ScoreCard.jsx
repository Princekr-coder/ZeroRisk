import { cn } from "@/lib/utils";

export function ScoreCard({ title, value, status, description, icon: Icon }) {
  const statusColors = {
    Good: "text-green-500",
    Medium: "text-yellow-500",
    Risky: "text-red-500",
    High: "text-green-500",
    Low: "text-red-500",
  };

  const borderColors = {
    Good: "border-green-500/20",
    Medium: "border-yellow-500/20",
    Risky: "border-red-500/20",
    High: "border-green-500/20",
    Low: "border-red-500/20",
  };

  const bgColors = {
    Good: "bg-green-50/50 dark:bg-green-950/20",
    Medium: "bg-yellow-50/50 dark:bg-yellow-950/20",
    Risky: "bg-red-50/50 dark:bg-red-950/20",
    High: "bg-green-50/50 dark:bg-green-950/20",
    Low: "bg-red-50/50 dark:bg-red-950/20",
  };

  return (
    <div className={cn(
      "relative flex flex-col p-6 rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md",
      borderColors[status] || "border-border"
    )}>
      <div className="flex items-center justify-between space-x-2 pb-2">
        <h3 className="tracking-tight text-sm font-medium text-muted-foreground">{title}</h3>
        {Icon && <Icon className={cn("h-4 w-4", statusColors[status] || "text-muted-foreground")} />}
      </div>
      <div className="flex flex-col gap-1 mt-2">
        <div className="text-3xl font-bold">{value}</div>
        <div className="flex items-center space-x-2 mt-2">
          {status && (
            <span className={cn(
              "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
              statusColors[status],
              borderColors[status],
              bgColors[status]
            )}>
              {status}
            </span>
          )}
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
