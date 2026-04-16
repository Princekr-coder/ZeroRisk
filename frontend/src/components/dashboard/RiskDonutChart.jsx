"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  { name: 'Financial Risk', value: 35, color: '#06b6d4' },
  { name: 'Operational Risk', value: 45, color: '#8b5cf6' },
  { name: 'Market Risk', value: 20, color: '#eab308' },
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel px-4 py-2 rounded-lg border border-border shadow-lg">
        <p className="text-sm font-semibold text-foreground flex items-center">
          <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: payload[0].payload.color }}></span>
          {payload[0].name}: {payload[0].value}%
        </p>
      </div>
    );
  }
  return null;
};

export function RiskDonutChart() {
  return (
    <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-700 p-6 rounded-2xl flex flex-col items-center relative overflow-hidden h-full shadow-sm">
      <div className="w-full mb-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Risk Breakdown</h3>
        <p className="text-xs text-slate-500 dark:text-muted-foreground mt-0.5">Distribution of identified risks</p>
      </div>

      <div className="flex-1 w-full flex flex-col items-center justify-center relative min-h-0">
        <div className="w-full h-full max-w-[240px] max-h-[220px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius="65%"
                outerRadius="90%"
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    className="dark:drop-shadow-[0_0_4px_var(--glow)]"
                    style={{ "--glow": `${entry.color}80` }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Center Text (Absolute centered within the chart container) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
             <span className="text-slate-400 dark:text-muted-foreground text-[10px] uppercase tracking-widest font-bold">Total</span>
             <span className="text-slate-900 dark:text-white text-xl font-bold">100%</span>
          </div>
        </div>

        {/* Legend (Moved out of ResponsiveContainer for better control) */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 w-full">
          {data.map((item, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-[11px] font-medium text-slate-500 dark:text-muted-foreground whitespace-nowrap">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
