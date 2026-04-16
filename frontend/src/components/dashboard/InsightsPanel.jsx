"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Lightbulb, AlertTriangle } from "lucide-react";

export function InsightsPanel({ insights }) {
  const defaultInsights = [
    { type: 'positive', text: "Revenue growth is strong, outperforming industry averages by +12%." },
    { type: 'warning', text: "Optimize operating expenses. They have grown faster than revenue over the last 2 quarters." },
    { type: 'positive', text: "Liquidity ratio is excellent, providing a strong buffer against short-term liabilities." },
    { type: 'recommendation', text: "Consider restructuring short-term debt to long-term to improve working capital." }
  ];

  const displayInsights = insights || defaultInsights;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <div className="glass p-6 rounded-2xl border border-border h-full flex flex-col relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-neon-cyan/5 rounded-full blur-2xl -z-10 group-hover:bg-neon-cyan/10 transition-colors duration-700" />
      
      <div className="flex items-center space-x-2 mb-6">
        <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-neon-purple shadow-[0_0_10px_rgba(139,92,246,0.2)]">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">AI-Generated Insights</h3>
          <p className="text-sm text-muted-foreground">Actionable intelligence from your data</p>
        </div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar"
      >
        {displayInsights.map((insight, index) => {
          let Icon = ArrowRight;
          let iconColor = "text-muted-foreground";
          let bgColor = "bg-white/5";

          if (insight.type === 'positive') {
            iconColor = "text-neon-green";
            bgColor = "bg-neon-green/5";
          } else if (insight.type === 'warning') {
            Icon = AlertTriangle;
            iconColor = "text-neon-yellow";
            bgColor = "bg-neon-yellow/5";
          } else if (insight.type === 'recommendation') {
            Icon = Lightbulb;
            iconColor = "text-neon-cyan";
            bgColor = "bg-neon-cyan/5";
          }

          return (
            <motion.div 
              key={index} 
              variants={itemVariants}
              className={`p-4 rounded-xl border border-black/5 dark:border-white/5 ${bgColor} flex items-start space-x-3 hover:bg-black/5 dark:hover:bg-white/10 transition-colors duration-300`}
            >
              <Icon className={`w-5 h-5 ${iconColor} mt-0.5 flex-shrink-0 drop-shadow-sm`} />
              <p className="text-sm text-foreground/90 leading-relaxed">
                {insight.text}
              </p>
            </motion.div>
          );
        })}
      </motion.div>
      
      <div className="mt-4 pt-4 border-t border-border/50 flex justify-end">
        <button className="text-xs font-semibold text-neon-blue hover:text-neon-cyan transition-colors flex items-center">
          Generate Detailed Report <ArrowRight className="w-3 h-3 ml-1" />
        </button>
      </div>
    </div>
  );
}
