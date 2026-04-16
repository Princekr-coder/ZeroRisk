"use client";

import { useState, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { Radar, Crosshair, ArrowUpRight } from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
import { useSettings } from "@/context/SettingsContext";
import { convertValue } from "@/lib/currency";
import { formatCurrency } from "@/lib/format";

// Mock Data generation based on scenario
const getMockData = (scenario) => {
  const baseData = [
    { name: 'Q1', revenue: 420000, profit: 84000 },
    { name: 'Q2', revenue: 450000, profit: 91000 },
    { name: 'Q3', revenue: 480000, profit: 96000 },
  ];
  
  if (scenario === 'best') return [...baseData, { name: 'Q4 (Est)', revenue: 600000, profit: 140000 }, { name: 'Q1 Nxt (Est)', revenue: 750000, profit: 190000 }];
  if (scenario === 'worst') return [...baseData, { name: 'Q4 (Est)', revenue: 470000, profit: 80000 }, { name: 'Q1 Nxt (Est)', revenue: 450000, profit: 75000 }];
  
  // expected
  return [...baseData, { name: 'Q4 (Est)', revenue: 520000, profit: 110000 }, { name: 'Q1 Nxt (Est)', revenue: 580000, profit: 130000 }];
};

const CustomTooltip = ({ active, payload, label, currency }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-3 rounded-lg border border-border shadow-xl backdrop-blur-md">
        <p className="text-foreground font-semibold mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="text-sm font-medium flex items-center mb-1">
            <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: entry.color }}></span>
            {entry.name}: <span className="ml-2 text-foreground">{formatCurrency(entry.value, currency)}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function ForecastPage() {
  const { currency } = useSettings();
  const [scenario, setScenario] = useState("expected"); // best, expected, worst
  const [timeframe, setTimeframe] = useState("quarterly"); 
  
  const rawData = useMemo(() => getMockData(scenario), [scenario]);
  
  const data = useMemo(() => {
    return rawData.map(item => ({
      ...item,
      revenue: convertValue(item.revenue, "INR", currency),
      profit: convertValue(item.profit, "INR", currency)
    }));
  }, [rawData, currency]);

  return (
    <div className="space-y-8 pb-10">
      <PageHeader
        title="Predictive Analytics"
        description="Future projections based on current data modeling."
      >
        <div className="glass-panel p-1 rounded-lg flex space-x-1">
          {["monthly", "quarterly", "yearly"].map((t) => (
            <button 
              key={t} onClick={() => setTimeframe(t)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all ${timeframe === t ? 'bg-primary/20 text-foreground dark:text-white' : 'text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Scenario Selector & KPIs */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass p-5 rounded-xl border border-border">
            <h3 className="text-sm font-semibold text-foreground flex items-center mb-4">
              <Crosshair className="w-4 h-4 mr-2 text-neon-cyan" /> 
              Simulation Scenario
            </h3>
            <div className="space-y-2">
              {[
                { id: "best", label: "Best Case", desc: "Optimistic market conditions", color: "text-neon-green", border: "border-neon-green/30" },
                { id: "expected", label: "Expected", desc: "Current run-rate baseline", color: "text-neon-cyan", border: "border-neon-cyan/30" },
                { id: "worst", label: "Worst Case", desc: "Stress test parameters", color: "text-neon-red", border: "border-neon-red/30" }
              ].map(s => (
                <div 
                  key={s.id} 
                  onClick={() => setScenario(s.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${scenario === s.id ? `bg-black/10 dark:bg-white/10 ${s.border}` : 'bg-transparent border-transparent hover:bg-black/5 dark:hover:bg-white/5'}`}
                >
                  <p className={`text-sm font-bold ${scenario === s.id ? s.color : 'text-foreground'}`}>{s.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="glass p-5 rounded-xl border border-border relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-neon-purple/10 blur-xl -z-10 rounded-full" />
            <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-2">Projected Q4 Revenue</p>
            <div className="flex items-end space-x-2">
              <h2 className="text-3xl font-bold text-foreground drop-shadow-sm">
                {formatCurrency(data[3].revenue, currency)}
              </h2>
              <span className={`text-sm font-semibold mb-1 flex items-center ${scenario === 'worst' ? 'text-neon-yellow' : 'text-neon-green'}`}>
                <ArrowUpRight className="w-4 h-4 mr-0.5" />
                {scenario === 'best' ? '25%' : scenario === 'worst' ? '4%' : '15%'}
              </span>
            </div>
          </div>
        </div>

        {/* Main Chart */}
        <div className="lg:col-span-3 glass p-6 rounded-2xl border border-border flex flex-col min-h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-foreground flex items-center">
              <Radar className="w-5 h-5 mr-2 text-neon-purple" />
              Revenue & Profit Trajectory
            </h3>
            <div className="flex space-x-4 text-xs font-medium text-muted-foreground">
               <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-neon-purple mr-1.5" /> Revenue</span>
               <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-neon-cyan mr-1.5" /> Profit</span>
            </div>
          </div>
          
          <div className="flex-1 w-full relative">
             <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <RechartsTooltip 
                  content={<CustomTooltip currency={currency} />}
                />
                <Area type="monotone" dataKey="revenue" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="profit" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorProf)" />
              </AreaChart>
            </ResponsiveContainer>
            
            {/* Visual separator for projection start */}
            <div className="absolute top-0 bottom-6 right-[45%] border-r-2 border-dashed border-white/20 z-0 pointer-events-none" />
            <div className="absolute top-2 right-[25%] bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 px-2 py-1 rounded text-[10px] text-muted-foreground uppercase tracking-wider backdrop-blur-sm">
              Projection Zone
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
