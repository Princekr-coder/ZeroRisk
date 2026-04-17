"use client";

import { useState, useRef } from "react";
import { UploadCloud, FileSpreadsheet, X, Loader2, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { analyzeFinancialData } from "@/lib/api";
import { useAnalysis } from "@/components/AnalysisContext";

const FileBox = ({ label, file, setFile, inputRef }) => (
  <div className="relative group/box">
    <label className="block text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wider">{label}</label>
    <AnimatePresence mode="wait">
      {file ? (
        <motion.div 
          key="file-present"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
          className="flex items-center justify-between p-4 border border-neon-cyan/30 bg-neon-cyan/5 rounded-xl backdrop-blur-sm shadow-[0_0_15px_rgba(6,182,212,0.1)] relative overflow-hidden"
        >
          <div className="absolute left-0 top-0 w-1 h-full bg-neon-cyan" />
          <div className="flex items-center space-x-4 overflow-hidden pl-2">
            <FileSpreadsheet className="w-6 h-6 text-neon-cyan shrink-0" />
            <div className="flex flex-col truncate">
              <span className="text-sm font-medium text-foreground truncate">{file.name}</span>
            </div>
          </div>
          <button type="button" onClick={() => setFile(null)} className="p-1.5 hover:bg-white/10 rounded-full transition-colors shrink-0">
            <X className="w-4 h-4 text-muted-foreground hover:text-white" />
          </button>
        </motion.div>
      ) : (
        <motion.div 
          key="file-absent"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border/50 rounded-xl hover:border-neon-purple/50 hover:bg-white/5 transition-all cursor-pointer relative overflow-hidden group/upload"
        >
          <UploadCloud className="w-8 h-8 text-muted-foreground mb-3 group-hover/upload:text-neon-purple transition-colors drop-shadow-sm" />
          <p className="text-sm text-foreground font-medium mb-1">Click to upload or drag and drop</p>
          <p className="text-xs text-muted-foreground">Excel (.xlsx) or CSV</p>
        </motion.div>
      )}
    </AnimatePresence>
    <input type="file" className="hidden" accept=".csv, .xlsx, .xls" ref={inputRef} onChange={(e) => setFile(e.target.files?.[0])} />
  </div>
);

export function UploadForm({ onAnalyzeSuccess }) {
  const [balanceSheet, setBalanceSheet] = useState(null);
  const [pandl, setPandl] = useState(null);
  const { setAnalysis, loading, setLoading, setError, error } = useAnalysis();
  const bsInputRef = useRef(null);
  const plInputRef = useRef(null);

  const handleAnalyzeClick = async () => {
    if (!balanceSheet || !pandl) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await analyzeFinancialData(balanceSheet, pandl);
      if (response.status === "success" && response.analysis) {
        setAnalysis(response.analysis);
        if (onAnalyzeSuccess) onAnalyzeSuccess();
      } else {
        setError("Failed to analyze data.");
      }
    } catch (err) {
      setError(err?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const canAnalyze = balanceSheet && pandl && !loading;

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center">
      {error && (
        <div className="w-full p-4 mb-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 flex items-center justify-center">
           {error}
        </div>
      )}
      <motion.div className="glass p-8 w-full rounded-2xl border border-border transition-all duration-300 relative">
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <FileBox label="Balance Sheet" file={balanceSheet} setFile={setBalanceSheet} inputRef={bsInputRef} />
          <FileBox label="P&L Statement" file={pandl} setFile={setPandl} inputRef={plInputRef} />
        </div>
        <div className="flex pt-4 border-t border-border/50">
          <button
            onClick={handleAnalyzeClick}
            disabled={!canAnalyze}
            className={`w-full flex items-center justify-center py-4 px-6 rounded-xl transition-all duration-300 font-bold text-sm tracking-wide shadow-lg ${canAnalyze ? "bg-gradient-to-r from-primary to-neon-cyan text-white hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]" : "bg-white/5 text-muted-foreground cursor-not-allowed border border-border"}`}
          >
            {loading ? (
              <><Loader2 className="w-5 h-5 mr-3 animate-spin text-neon-cyan" /> Wait... Uploading and Processing</>
            ) : "RUN AI ANALYSIS"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
