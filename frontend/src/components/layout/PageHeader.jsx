"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

export function PageHeader({ title, description, children }) {
  const pathname = usePathname();
  const pathParts = pathname?.split('/').filter(p => p) || [];

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8">
      <div>
        <nav className="flex items-center space-x-1.5 text-xs text-muted-foreground mb-3 uppercase tracking-wider font-semibold">
          <Link href="/dashboard" className="hover:text-neon-cyan transition-colors flex items-center text-foreground/70">
            <Home className="w-3.5 h-3.5 mr-1 mb-0.5" />
            Home
          </Link>
          {pathParts.map((part, idx) => {
            const isLast = idx === pathParts.length - 1;
            const href = `/${pathParts.slice(0, idx + 1).join('/')}`;
            // Simple logic to format 'upload' as 'Upload & Analyze' or keep capitalized
            let label = part.charAt(0).toUpperCase() + part.slice(1);
            if (part === 'upload') label = 'Upload & Analyze';

            // Skip 'dashboard' since Home already routes there to avoid redundant Breadcrumbs.
            if (part === 'dashboard') return null;

            return (
              <div key={href} className="flex items-center space-x-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-border" />
                {isLast ? (
                  <span className="text-neon-cyan">{label}</span>
                ) : (
                  <Link href={href} className="hover:text-neon-cyan transition-colors text-foreground/70">
                    {label}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>
        
        <h1 className="text-3xl font-bold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
          {title}
        </h1>
        {description && <p className="text-muted-foreground mt-1.5 font-medium">{description}</p>}
      </div>
      
      {children && (
        <div className="mt-4 md:mt-0 flex items-center space-x-3 w-full md:w-auto">
          {children}
        </div>
      )}
    </div>
  );
}
