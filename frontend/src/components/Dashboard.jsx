"use client";

import { motion } from "framer-motion";
import { RefreshCw, LayoutTemplate, Activity, DollarSign, Wallet, Percent, AlertTriangle, Zap } from "lucide-react";
import { ScoreGauge } from "./dashboard/ScoreGauge";
import { MetricCard } from "./dashboard/MetricCard";
import { TrendChart } from "./dashboard/TrendChart";
import { XAIBarChart } from "./dashboard/XAIBarChart";
import { RiskDonutChart } from "./dashboard/RiskDonutChart";
import { InsightsPanel } from "./dashboard/InsightsPanel";
import { PageHeader } from "@/components/layout/PageHeader";
import { useSettings } from "@/context/SettingsContext";
import { convertValue } from "@/lib/currency";
import { formatCurrency } from "@/lib/format";

export function Dashboard({ results, onReset }) {
  const { currency } = useSettings();
  if (!results) return null;

  // Base values in INR
  const baseRevenue = 4200000;
  const baseProfit = 840000;

  const currentRevenue = convertValue(baseRevenue, "INR", currency);
  const currentProfit = convertValue(baseProfit, "INR", currency);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="w-full">
      <PageHeader 
        title="Financial Overview"
        description={`Comprehensive analysis of your fiscal health (Currency: ${currency})`}
      >
        <motion.button 
          whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(139, 92, 246, 0.4)" }}
          whileTap={{ scale: 0.95 }}
          onClick={onReset}
          title="Start a new financial analysis"
          className="bg-gradient-to-r from-primary to-neon-cyan text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center space-x-2 shadow-[0_4px_14px_rgba(139, 92, 246, 0.4)] transition-all"
        >
          <Zap className="w-4 h-4" />
          <span>New Analysis</span>
        </motion.button>
      </PageHeader>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-full overflow-x-hidden"
      >
        {/* Left Column: Gauge and Risk */}
        <motion.div variants={itemVariants} className="lg:col-span-4 flex flex-col gap-6">
          <div className="h-64 sm:h-72 lg:h-64">
            <ScoreGauge 
              score={results.healthScore?.value || 75} 
              riskLevel={results.bankruptcyRisk?.status || "Medium Risk"}
              subtext={`Based on ${results.keyRatios?.length || 5} key AI signals`}
            />
          </div>
          <div className="h-[300px] lg:h-72">
            <RiskDonutChart />
          </div>
        </motion.div>

        {/* Right Column: Metrics and Trend */}
        <motion.div variants={itemVariants} className="lg:col-span-8 flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
             <MetricCard title="Revenue" value={formatCurrency(currentRevenue, currency, true)} change="+12%" trend="up" Icon={DollarSign} />
             <MetricCard title="Net Profit" value={formatCurrency(currentProfit, currency, true)} change="+5%" trend="up" Icon={Activity} />
             <MetricCard title="Debt-to-Eq" value="1.2" change="-2%" trend="down" Icon={Wallet} />
             <MetricCard title="Liquidity" value="2.4" change="+8%" trend="up" Icon={Percent} />
          </div>
          <div className="flex-1 min-h-[350px] lg:min-h-[400px]">
             <TrendChart />
          </div>
        </motion.div>

        {/* Bottom Left: XAI */}
        <motion.div variants={itemVariants} className="lg:col-span-6 min-h-[350px]">
          <XAIBarChart />
        </motion.div>

        {/* Bottom Right: Insights */}
        <motion.div variants={itemVariants} className="lg:col-span-6 min-h-[350px]">
          <InsightsPanel />
        </motion.div>

        {/* Benchmark Card */}
        <motion.div variants={itemVariants} className="lg:col-span-12 glass p-6 rounded-2xl border border-border relative overflow-hidden group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-purple to-neon-cyan opacity-20 blur group-hover:opacity-30 transition-opacity" />
          <div className="relative flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
               <div className="p-3 bg-neon-yellow/10 border border-neon-yellow/20 rounded-xl text-neon-yellow">
                 <AlertTriangle className="w-6 h-6" />
               </div>
               <div>
                 <h4 className="text-lg font-bold text-foreground">SME Industry Benchmark</h4>
                 <p className="text-sm text-foreground/80 mt-1">Your company is performing <strong className="text-neon-cyan">+14% better</strong> than the median SaaS sector average concerning Operational Efficiency.</p>
               </div>
            </div>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
