"use client";

import { motion } from "framer-motion";
import { RefreshCw, LayoutTemplate, Activity, DollarSign, Wallet, Percent, AlertTriangle, Zap } from "lucide-react";
import { ScoreCard } from "./ScoreCard";
import { MetricCard } from "./dashboard/MetricCard";
import { TrendChart } from "./dashboard/TrendChart";
import { ExplanationCard } from "./ExplanationCard";
import { WhatIfComponent } from "./WhatIfComponent";
import { RiskDonutChart } from "./dashboard/RiskDonutChart";
import { InsightsPanel } from "./dashboard/InsightsPanel";
import { PageHeader } from "@/components/layout/PageHeader";
import { useSettings } from "@/context/SettingsContext";
import { convertValue } from "@/lib/currency";
import { formatCurrency } from "@/lib/format";
import { useAnalysis } from "./AnalysisContext";

export function Dashboard({ onReset }) {
  const { currency } = useSettings();
  const { analysis, loading, error } = useAnalysis();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-16 h-16 border-t-2 border-neon-cyan animate-spin rounded-full"></div>
        <p className="mt-4 text-neon-cyan animate-pulse">Running AI Analysis...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-10">
        <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
        <p>{error}</p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="w-full relative z-10">
        <PageHeader 
          title="Financial Overview"
          description="Awaiting financial data for analysis."
        >
          <motion.button 
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(139, 92, 246, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            onClick={onReset}
            className="bg-gradient-to-r from-primary to-neon-cyan text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center space-x-2 shadow-[0_4px_14px_rgba(139, 92, 246, 0.4)] transition-all cursor-pointer"
          >
            <Zap className="w-4 h-4" />
            <span>New Analysis</span>
          </motion.button>
        </PageHeader>
        
        <div className="flex flex-col items-center justify-center p-12 mt-6 glass rounded-2xl border-2 border-dashed border-border/60 text-center">
          <div className="w-16 h-16 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
            <LayoutTemplate className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">No active analysis</h2>
          <p className="text-muted-foreground max-w-md mb-6">
            Upload your company's financial statements to generate an AI-driven credit risk assessment and deep financial insights.
          </p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReset}
            className="bg-primary hover:bg-primary/90 text-white border border-primary px-6 py-3 rounded-lg text-sm font-bold shadow-lg transition-colors cursor-pointer"
          >
            Upload Data Now
          </motion.button>
        </div>
      </div>
    );
  }

  // Base values for metrics mock UI (could be replaced by backend data if available)
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
        {/* Left Column: Scores */}
        <motion.div variants={itemVariants} className="lg:col-span-4 flex flex-col gap-6">
          <ScoreCard 
            title="Financial Health Score"
            value={analysis.financial_health_score}
            status={analysis.financial_health_score >= 80 ? "Good" : analysis.financial_health_score >= 50 ? "Medium" : "Risky"}
            description={analysis.overall_assessment || "Main AI assessment score"}
            icon={Activity}
          />
          <ScoreCard 
            title="Investment Attractiveness"
            value={analysis.investment_attractiveness}
            status={analysis.investment_attractiveness >= 75 ? "High" : "Low"}
            description="Attractiveness to potential investors"
            icon={Zap}
          />
          <ScoreCard 
            title="Bankruptcy Risk"
            value={`${(analysis.bankruptcy_risk.probability * 100).toFixed(1)}%`}
            status={analysis.bankruptcy_risk.level}
            description="AI Probability of default"
            icon={AlertTriangle}
          />
        </motion.div>

        {/* Right Column: Metrics */}
        <motion.div variants={itemVariants} className="lg:col-span-8 flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(analysis.key_ratios || {}).slice(0,4).map(([key, value]) => (
              <MetricCard key={key} title={key.replace(/_/g, ' ')} value={typeof value === 'number' ? value.toFixed(2) : value} change="0%" trend="up" Icon={Percent} />
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {analysis.explanations?.slice(0, 4).map((expl, idx) => (
              <ExplanationCard key={idx} feature={expl.feature} description={expl.description} impactValue={expl.impact} />
            ))}
          </div>
          <div className="mt-2">
            <WhatIfComponent />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
