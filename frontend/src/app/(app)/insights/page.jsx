"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, TrendingUp, Lightbulb, Clock, Filter, AlertTriangle } from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
import { useSettings } from "@/context/SettingsContext";
import { formatCurrency } from "@/lib/format";

const MOCK_INSIGHTS = (currency) => [
  { id: 1, type: "opportunity", priority: "high", title: "Revenue Growth Trajectory", desc: "Your year-over-year revenue growth is tracking 15% above the industry median. Continue investment in the Enterprise sales channel.", time: "10 mins ago" },
  { id: 2, type: "risk", priority: "high", title: "Cash Flow Alert", desc: "Operating expenses grew by 8% last quarter while cash reserves dipped. Consider postponing capital expenditure for Q3.", time: "2 hours ago" },
  { id: 3, type: "financial", priority: "medium", title: "Debt-to-Equity Optimization", desc: "Current leverage ratio of 1.2 is healthy, but restructuring short-term debt to long-term bonds could save 12% in interest.", time: "Yesterday" },
  { id: 4, type: "opportunity", priority: "low", title: "Vendor Consolidation", desc: `Consolidating cloud providers could reduce monthly IT infrastructure costs by roughly ${formatCurrency(125000, currency, true)}.`, time: "2 days ago" },
  { id: 5, type: "risk", priority: "medium", title: "Customer Concentation", desc: "Top 3 clients account for 40% of revenue. Diversifying your client base is recommended to reduce dependency risks.", time: "1 week ago" }
];

export default function InsightsPage() {
  const { currency } = useSettings();
  const [filter, setFilter] = useState("all");

  const insights = MOCK_INSIGHTS(currency);
  const filteredInsights = insights.filter(insight => filter === "all" || insight.priority === filter);

  const getIcon = (type) => {
    switch(type) {
      case "opportunity": return <Lightbulb className="w-5 h-5 text-neon-cyan" />;
      case "risk": return <AlertTriangle className="w-5 h-5 text-neon-red" />;
      case "financial": return <TrendingUp className="w-5 h-5 text-neon-purple" />;
      default: return <AlertCircle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getBorderColor = (priority) => {
    switch(priority) {
      case "high": return "border-l-neon-red";
      case "medium": return "border-l-neon-yellow";
      case "low": return "border-l-neon-cyan";
      default: return "border-l-border";
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <PageHeader
        title="AI Intelligence"
        description="Real-time monitoring and deep financial insights."
      >
        <div className="flex items-center space-x-2 mt-4 sm:mt-0 glass-panel p-1 rounded-lg border-border">
          <Filter className="w-4 h-4 text-muted-foreground ml-2 mr-1" />
          {["all", "high", "medium", "low"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold capitalize transition-all ${filter === f ? 'bg-primary/20 text-foreground dark:text-white shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </PageHeader>

      <div className="space-y-4">
        <AnimatePresence>
          {filteredInsights.map((insight) => (
            <motion.div
              key={insight.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className={`glass p-6 rounded-xl border border-border border-l-4 ${getBorderColor(insight.priority)} hover:bg-black/5 dark:hover:bg-white/5 transition-colors relative group`}
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-black/5 dark:bg-white/5 rounded-xl border border-black/10 dark:border-white/10 shrink-0 shadow-sm group-hover:bg-black/10 dark:group-hover:bg-white/10 transition-colors">
                  {getIcon(insight.type)}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-1">
                    <h3 className="text-lg font-bold text-foreground">{insight.title}</h3>
                    <div className="flex items-center text-xs text-muted-foreground mt-1 sm:mt-0">
                      <Clock className="w-3 h-3 mr-1" />
                      {insight.time}
                    </div>
                  </div>
                  <div className="flex items-center mt-1 mb-3 space-x-2">
                     <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-sm bg-white/5 border border-white/10 ${insight.priority === 'high' ? 'text-neon-red' : insight.priority === 'medium' ? 'text-neon-yellow' : 'text-neon-cyan'}`}>
                       {insight.priority} Priority
                     </span>
                     <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-sm bg-white/5 border border-white/10 text-muted-foreground">
                       {insight.type}
                     </span>
                  </div>
                  <p className="text-foreground/80 text-sm leading-relaxed">
                    {insight.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredInsights.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            No insights found for the selected filter.
          </div>
        )}
      </div>
    </div>
  );
}
