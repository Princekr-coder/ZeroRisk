"use client";

import { motion } from "framer-motion";
import { useSettings } from "@/context/SettingsContext";

export function AppConfigSection() {
  const { currency, exportFormat, draftSettings, updateSetting } = useSettings();

  const isCurrencyStaged = draftSettings.currency !== currency;
  const isFormatStaged = draftSettings.exportFormat !== exportFormat;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="glass p-6 rounded-xl border border-border space-y-6"
    >
      <div className="flex items-center justify-between border-b border-border/50 pb-4">
        <h3 className="text-lg font-semibold text-foreground">Application Flow</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2 relative">
          <label className="text-sm font-medium text-muted-foreground flex items-center">
            Default Currency
            {isCurrencyStaged && <span className="ml-2 w-1.5 h-1.5 bg-primary rounded-full" />}
          </label>
          <select 
            value={draftSettings.currency}
            onChange={(e) => updateSetting("currency", e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-background border border-border focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan outline-none transition-all text-foreground appearance-none"
          >
            <option value="INR">INR (₹)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
          </select>
        </div>
        <div className="space-y-2 relative">
          <label className="text-sm font-medium text-muted-foreground flex items-center">
            Export Data Format
            {isFormatStaged && <span className="ml-2 w-1.5 h-1.5 bg-primary rounded-full" />}
          </label>
          <select 
            value={draftSettings.exportFormat}
            onChange={(e) => updateSetting("exportFormat", e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-background border border-border focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan outline-none transition-all text-foreground appearance-none"
          >
            <option value="CSV">CSV</option>
            <option value="XLSX">Excel</option>
            <option value="JSON">JSON Data</option>
          </select>
        </div>
      </div>
    </motion.div>
  );
}
