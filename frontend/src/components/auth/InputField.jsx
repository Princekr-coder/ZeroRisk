import { cn } from "@/lib/utils";

export function InputField({ label, id, error, ...props }) {
  return (
    <div className="space-y-1.5 mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={id}
        name={id}
        className={cn(
          "w-full px-3 py-2 text-sm bg-background border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all",
          error 
            ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" 
            : "border-border focus:ring-primary/20 focus:border-primary"
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}
