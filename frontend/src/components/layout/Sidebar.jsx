"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  UploadCloud, 
  Lightbulb, 
  TrendingUp, 
  FileText, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Activity,
  LogOut
} from "lucide-react";
import { LogoutButton } from "./LogoutButton";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Upload & Analyze", href: "/upload", icon: UploadCloud },
  { name: "Insights", href: "/insights", icon: Lightbulb },
  { name: "Forecast", href: "/forecast", icon: TrendingUp },
  { name: "Reports", href: "/reports", icon: FileText },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside 
      initial={{ width: 260 }}
      animate={{ width: collapsed ? 80 : 260 }}
      className="h-screen sticky top-0 border-r border-border bg-background/50 backdrop-blur-xl flex flex-col z-20"
    >
      <div className="flex items-center justify-between p-4 h-16 border-b border-border/50">
        {!collapsed && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="flex items-center space-x-2 text-primary font-bold text-xl tracking-tight"
          >
            <Activity className="w-6 h-6 text-neon-cyan drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan to-neon-purple drop-shadow-sm">CredMetric</span>
          </motion.div>
        )}
        {collapsed && (
          <Activity className="w-6 h-6 text-neon-cyan mx-auto drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-muted-foreground absolute -right-3 top-5 bg-background border border-border shrink-0"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-2">
        <p className={`text-xs uppercase text-muted-foreground font-semibold mb-2 px-3 ${collapsed ? 'text-center' : ''}`}>
          {collapsed ? 'Menu' : 'Main Menu'}
        </p>
        
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname === '/' && item.href === '/dashboard');
          
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`relative flex items-center ${collapsed ? 'justify-center' : 'space-x-3 px-3'} py-3 rounded-xl transition-all duration-300 group`}
            >
              {isActive && (
                <motion.div 
                  layoutId="active-nav"
                  className="absolute inset-0 bg-primary/20 border border-primary/30 rounded-xl"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              
              <item.icon className={`w-5 h-5 relative z-10 transition-colors duration-300 ${isActive ? 'text-neon-cyan drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]' : 'text-muted-foreground group-hover:text-foreground'}`} />
              
              {!collapsed && (
                <span className={`font-medium relative z-10 transition-colors duration-300 ${isActive ? 'text-foreground drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]' : 'text-muted-foreground group-hover:text-foreground'}`}>
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-border/50">
        {!collapsed && <p className="text-xs uppercase text-muted-foreground font-semibold mb-3 px-1">SME Accounts</p>}
        <div className={`p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center ${collapsed ? 'justify-center' : 'justify-between'} cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 transition-colors`}>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-neon-purple/20 border border-neon-purple/30 flex items-center justify-center">
              <span className="text-neon-purple font-bold text-xs">AC</span>
            </div>
            {!collapsed && (
              <div>
                <p className="text-sm font-medium text-foreground">Acme Corp.</p>
                <p className="text-xs text-neon-green/80 flex items-center mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-neon-green mr-1.5 shadow-[0_0_6px_rgba(34,197,94,0.8)]" /> 
                  Health: Good
                </p>
              </div>
            )}
          </div>
        </div>
        
        <Link href="/settings" className={`mt-4 flex items-center ${collapsed ? 'justify-center' : 'space-x-3 px-3'} py-3 text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors`}>
          <Settings className="w-5 h-5" />
          {!collapsed && <span className="font-medium">Settings</span>}
        </Link>
        <LogoutButton collapsed={collapsed} />
      </div>
    </motion.aside>
  );
}
