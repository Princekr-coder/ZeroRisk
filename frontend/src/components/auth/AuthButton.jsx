import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function AuthButton({ isLoading, children, ...props }) {
  return (
    <button
      disabled={isLoading}
      className={cn(
        "w-full flex items-center justify-center py-2.5 px-4 mt-6 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-primary-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all",
        isLoading ? "bg-primary/70 cursor-not-allowed" : "bg-primary hover:bg-primary/90"
      )}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Processing...
        </>
      ) : (
        children
      )}
    </button>
  );
}
