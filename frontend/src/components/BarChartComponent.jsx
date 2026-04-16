"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export function BarChartComponent({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="w-full h-[350px] mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} 
            dy={10}
            angle={-25}
            textAnchor="end"
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
          />
          <Tooltip
            cursor={{ fill: "var(--muted)", opacity: 0.1 }}
            contentStyle={{ 
              backgroundColor: "var(--card)", 
              border: "1px solid var(--border)", 
              borderRadius: "0.5rem",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
            }}
            itemStyle={{ color: "var(--foreground)" }}
            labelStyle={{ color: "var(--muted-foreground)", marginBottom: "0.25rem" }}
          />
          <Bar 
            dataKey="value" 
            fill="var(--primary)" 
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
