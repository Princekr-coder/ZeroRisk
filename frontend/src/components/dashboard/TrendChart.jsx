"use client";

import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useSettings } from "@/context/SettingsContext";
import { convertValue } from "@/lib/currency";
import { formatCurrency } from "@/lib/format";

const RAW_DATA = [
  { name: 'Jan', revenue: 400000, profit: 240000 },
  { name: 'Feb', revenue: 300000, profit: 139800 },
  { name: 'Mar', revenue: 200000, profit: 980000 },
  { name: 'Apr', revenue: 278000, profit: 390800 },
  { name: 'May', revenue: 189000, profit: 480000 },
  { name: 'Jun', revenue: 239000, profit: 380000 },
  { name: 'Jul', revenue: 349000, profit: 430000 },
  { name: 'Aug', revenue: 500000, profit: 530000, isPrediction: true },
  { name: 'Sep', revenue: 650000, profit: 620000, isPrediction: true },
];

const CustomTooltip = ({ active, payload, label, currency }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-3 rounded-lg border border-border shadow-xl">
        <p className="text-foreground font-semibold mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="text-sm font-medium flex items-center mb-1">
            <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: entry.color }}></span>
            {entry.name}: <span className="ml-2 text-foreground">{formatCurrency(entry.value, currency)}</span>
            {entry.payload.isPrediction && <span className="ml-2 text-xs opacity-70">(Forecast)</span>}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function TrendChart() {
  const { currency } = useSettings();

  const data = useMemo(() => {
    return RAW_DATA.map(item => ({
      ...item,
      revenue: convertValue(item.revenue, "INR", currency),
      profit: convertValue(item.profit, "INR", currency)
    }));
  }, [currency]);
  return (
    <div className="glass p-6 rounded-2xl border border-border h-full flex flex-col relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-neon-blue/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-neon-purple/5 rounded-full blur-3xl -z-10" />

      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-foreground">Revenue vs Profit Trend</h3>
          <p className="text-sm text-muted-foreground mt-1">Historical data and AI forecasts</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-xs text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-neon-purple mr-2 shadow-[0_0_5px_#a855f7]" /> Revenue
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-neon-cyan mr-2 shadow-[0_0_5px_#06b6d4]" /> Profit
          </div>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} 
            />
            <Tooltip content={<CustomTooltip currency={currency} />} />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#a855f7" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorRevenue)" 
              activeDot={{ r: 6, fill: "#a855f7", stroke: "#fff", strokeWidth: 2 }}
            />
            <Area 
              type="monotone" 
              dataKey="profit" 
              stroke="#06b6d4" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorProfit)" 
              activeDot={{ r: 6, fill: "#06b6d4", stroke: "#fff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
