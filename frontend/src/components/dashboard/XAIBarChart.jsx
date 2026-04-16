"use client";

import { motion } from "framer-motion";

export function XAIBarChart({ data }) {
  // If no data provided, use dummy mock data
  const chartData = data || [
    { factor: "Operating Margin", impact: 15, explanation: "Strong operating margins contributing positively to health score." },
    { factor: "Debt-to-Equity", impact: -8, explanation: "Above average leverage increasing financial risk slightly." },
    { factor: "Revenue Growth", impact: 12, explanation: "Consistent quarter-over-quarter growth." },
    { factor: "Liquidity Ratio", impact: 5, explanation: "Adequate short-term liquidity reserves." },
    { factor: "Customer Churn", impact: -4, explanation: "Recent increase in churn rate negatively impacting score." }
  ];

  const maxImpact = Math.max(...chartData.map(d => Math.abs(d.impact)));

  return (
    <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-700 p-6 rounded-2xl h-full flex flex-col relative overflow-hidden shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Explainable AI Drivers</h3>
        <p className="text-xs text-slate-500 dark:text-muted-foreground mt-0.5">Factors impacting your financial score (+/-)</p>
      </div>
      
      <div className="flex-1 flex flex-col justify-center space-y-5">
        {chartData.map((item, index) => {
          const isPositive = item.impact > 0;
          const percentage = (Math.abs(item.impact) / maxImpact) * 100;
          
          return (
            <div key={index} className="flex items-center space-x-4">
              {/* Factor Label - Fixed Width 1/3 */}
              <div className="w-1/3 min-w-0" title={item.factor}>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
                  {item.factor}
                </p>
              </div>

              {/* Bar Column - 2/3 */}
              <div className="w-2/3 flex items-center group relative">
                <div className="flex-1 h-3 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
                    className={`h-full rounded-full relative z-10 ${
                      isPositive 
                        ? 'bg-blue-600 dark:bg-emerald-500 shadow-[0_0_10px_rgba(37,99,235,0.2)] dark:shadow-[0_0_10px_rgba(16,185,129,0.2)]' 
                        : 'bg-rose-500 dark:bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.2)]'
                    }`}
                  />
                </div>
                
                {/* Impact Value */}
                <div className="ml-3 min-w-[30px] text-right">
                  <span className={`text-[10px] font-bold ${isPositive ? 'text-blue-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {isPositive ? '+' : ''}{item.impact}
                  </span>
                </div>

                {/* Tooltip Overlay */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-slate-800 text-white text-[10px] px-2 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-normal w-48 shadow-xl z-20 border border-white/10 text-center">
                  {item.explanation}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 flex justify-between items-center">
         <div className="flex items-center space-x-3">
           <div className="flex items-center space-x-1.5">
             <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-emerald-500" />
             <span className="text-[10px] text-slate-500 dark:text-muted-foreground uppercase font-bold tracking-tighter">Positive</span>
           </div>
           <div className="flex items-center space-x-1.5">
             <div className="w-2 h-2 rounded-full bg-rose-500" />
             <span className="text-[10px] text-slate-500 dark:text-muted-foreground uppercase font-bold tracking-tighter">Negative</span>
           </div>
         </div>
         <span className="text-[10px] text-slate-400 dark:text-slate-500 italic">Live AI Drivers</span>
      </div>
    </div>
  );
}
