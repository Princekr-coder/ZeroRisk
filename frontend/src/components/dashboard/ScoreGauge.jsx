"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function ScoreGauge({ score = 75, riskLevel = "Medium Risk", subtext = "Based on key AI signals" }) {
  const [currentScore, setCurrentScore] = useState(0);
  
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (currentScore / 100) * circumference;

  // Colors for Dark Mode
  let darkColor = "#eab308"; // yellow
  let darkGlow = "rgba(234, 179, 8, 0.5)";
  
  if (score >= 80) {
    darkColor = "#22c55e"; // green
    darkGlow = "rgba(34, 197, 94, 0.5)";
  } else if (score < 50) {
    darkColor = "#ef4444"; // red
    darkGlow = "rgba(239, 68, 68, 0.5)";
  }

  // Colors for Light Mode (Requested: Professional Blue)
  const lightColor = "#2563eb"; 

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentScore(score);
    }, 300);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-700 p-6 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden h-full shadow-md hover:shadow-lg dark:shadow-none transition-all duration-300 group">
      <div className="absolute top-0 right-0 p-4">
        <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border bg-blue-50 dark:bg-transparent border-blue-100 dark:border-current text-blue-600 dark:text-inherit" 
              style={{ 
                borderColor: typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? darkColor : undefined, 
                color: typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? darkColor : undefined 
              }}>
          {riskLevel}
        </span>
      </div>
      
      <h3 className="text-lg font-bold text-slate-900 dark:text-white w-full text-left mb-6 absolute top-4 left-6">AI Health Score</h3>
      
      <div className="relative mt-8 mb-4 w-40 h-40">
        {/* Gauge Background */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            className="text-gray-100 dark:text-white/10"
          />
          {/* Progress Circle (Light Mode) */}
          <motion.circle
            cx="80"
            cy="80"
            r={radius}
            stroke={lightColor}
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
            className="block dark:hidden"
          />
          {/* Progress Circle (Dark Mode) */}
          <motion.circle
            cx="80"
            cy="80"
            r={radius}
            stroke={darkColor}
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
            className="hidden dark:block drop-shadow-[0_0_8px_var(--glow)]"
            style={{ "--glow": darkGlow }}
          />
        </svg>

        {/* Center Score */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <motion.span 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="text-4xl font-bold text-slate-900 dark:text-white"
          >
            {score}
          </motion.span>
          <span className="text-[10px] text-slate-400 dark:text-muted-foreground uppercase tracking-widest mt-0.5 font-bold">Points</span>
        </div>
      </div>
      
      {/* Visual Accent */}
      <div className="w-full flex justify-center mt-2 relative h-4 overflow-hidden">
        <div className="px-4 text-center">
          <p className="text-sm text-slate-500 dark:text-muted-foreground font-medium mb-4">
            {subtext}
          </p>
          <button className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all bg-blue-50 dark:bg-white/5 text-blue-600 dark:text-neon-cyan border border-blue-100 dark:border-white/10 hover:bg-blue-100 dark:hover:bg-white/10">
            Monitor Trends
          </button>
        </div>
      </div>
    </div>
  );
}
