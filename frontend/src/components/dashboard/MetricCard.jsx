"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export function MetricCard({ title, value, change, trend = "neutral", Icon }) {
  let trendColor = "text-muted-foreground";
  let TrendIcon = Minus;
  let bgGlow = "";

  if (trend === "up") {
    trendColor = "text-neon-green";
    TrendIcon = TrendingUp;
    bgGlow = "hover:shadow-[0_0_20px_rgba(34,197,94,0.15)]";
  } else if (trend === "down") {
    trendColor = "text-neon-red";
    TrendIcon = TrendingDown;
    bgGlow = "hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]";
  }

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`bg-white dark:bg-[#111827] p-5 rounded-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 ${bgGlow} group relative overflow-hidden shadow-sm hover:shadow-md dark:shadow-none`}
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-black/5 dark:from-white/5 to-transparent rounded-bl-full -z-10" />
      
      <div className="flex justify-between items-start mb-4">
        <div className="min-w-0 flex-1 pr-2">
          <p className="text-sm text-slate-500 dark:text-muted-foreground font-medium mb-1 truncate" title={title}>{title}</p>
          <h4 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white truncate" title={value}>{value}</h4>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 group-hover:bg-slate-100 dark:group-hover:bg-white/10 transition-colors flex-shrink-0">
          <Icon className="w-5 h-5 text-blue-600 dark:text-neon-blue" />
        </div>
      </div>

      <div className="flex items-center space-x-2 mt-4 text-sm font-medium">
        <span 
          className={`flex items-center px-2 py-0.5 rounded-md bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5`}
          style={{
            borderColor: trend === 'up' ? 'var(--neon-green)' : trend === 'down' ? 'var(--neon-red)' : undefined,
            color: trend === 'up' ? 'var(--neon-green)' : trend === 'down' ? 'var(--neon-red)' : 'var(--muted-foreground)'
          }}
        >
          <TrendIcon className="w-3.5 h-3.5 mr-1" />
          {change}
        </span>
        <span className="text-slate-400 dark:text-muted-foreground text-[10px] uppercase font-bold tracking-tight">vs prev</span>
      </div>
    </motion.div>
  );
}
