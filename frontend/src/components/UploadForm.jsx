"use client";

import { useState, useRef } from "react";
import { UploadCloud, FileSpreadsheet, X, Loader2, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FileBox = ({ label, file, setFile, inputRef }) => (
  <div className="relative group/box">
    <label className="block text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wider">{label}</label>
    <AnimatePresence mode="wait">
      {file ? (
        <motion.div 
          key="file-present"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="flex items-center justify-between p-4 border border-neon-cyan/30 bg-neon-cyan/5 rounded-xl backdrop-blur-sm shadow-[0_0_15px_rgba(6,182,212,0.1)] relative overflow-hidden"
        >
          <div className="absolute left-0 top-0 w-1 h-full bg-neon-cyan" />
          <div className="flex items-center space-x-4 overflow-hidden pl-2">
            <FileSpreadsheet className="w-6 h-6 text-neon-cyan shrink-0" />
            <div className="flex flex-col truncate">
              <span className="text-sm font-medium text-foreground truncate">{file.name}</span>
              <span className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</span>
            </div>
          </div>
          <button 
            type="button" 
            onClick={() => setFile(null)}
            className="p-1.5 hover:bg-white/10 rounded-full transition-colors shrink-0"
          >
            <X className="w-4 h-4 text-muted-foreground hover:text-white" />
          </button>
        </motion.div>
      ) : (
        <motion.div 
          key="file-absent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border/50 rounded-xl hover:border-neon-purple/50 hover:bg-white/5 transition-all cursor-pointer relative overflow-hidden group/upload"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/5 to-transparent opacity-0 group-hover/upload:opacity-100 transition-opacity duration-500" />
          <UploadCloud className="w-8 h-8 text-muted-foreground mb-3 group-hover/upload:text-neon-purple transition-colors drop-shadow-sm group-hover/upload:drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
          <p className="text-sm text-foreground font-medium mb-1">Click to upload or drag and drop</p>
          <p className="text-xs text-muted-foreground">Excel (.xlsx) or CSV</p>
        </motion.div>
      )}
    </AnimatePresence>
    <input 
      type="file" 
      className="hidden" 
      accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
      ref={inputRef}
      onChange={(e) => {
        if (e.target.files && e.target.files[0]) {
          setFile(e.target.files[0]);
        }
      }}
    />
  </div>
);

export function UploadForm({ onAnalyze, isLoading }) {
  const [balanceSheet, setBalanceSheet] = useState(null);
  const [pandl, setPandl] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const bsInputRef = useRef(null);
  const plInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (!balanceSheet) setBalanceSheet(file);
      else if (!pandl) setPandl(file);
      else setBalanceSheet(file);
    }
  };

  const handleAnalyzeClick = () => {
    if (balanceSheet && pandl) {
      onAnalyze(balanceSheet, pandl);
    }
  };

  const canAnalyze = balanceSheet && pandl && !isLoading;

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[70vh]">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10 w-full"
      >
        <div className="inline-block p-3 rounded-full bg-primary/10 mb-4 border border-primary/20 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
           <Zap className="w-6 h-6 text-neon-purple" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
          AI Financial Analysis
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Upload your latest financial statements to generate instantaneous, AI-driven risk models and predictive insights.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className={`glass p-8 w-full rounded-2xl border transition-all duration-300 relative ${dragActive ? "border-neon-cyan shadow-[0_0_30px_rgba(6,182,212,0.2)] scale-[1.02]" : "border-border"}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-neon-purple/5 blur-3xl -z-10 rounded-full" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-neon-cyan/5 blur-3xl -z-10 rounded-full" />

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <FileBox label="Balance Sheet" file={balanceSheet} setFile={setBalanceSheet} inputRef={bsInputRef} />
          <FileBox label="P&L Statement" file={pandl} setFile={setPandl} inputRef={plInputRef} />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-border/50">
          <button
            onClick={handleAnalyzeClick}
            disabled={!canAnalyze}
            className={`flex-1 flex items-center justify-center py-4 px-6 rounded-xl transition-all duration-300 font-bold text-sm tracking-wide shadow-lg ${canAnalyze ? "bg-gradient-to-r from-primary to-neon-cyan text-white hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]" : "bg-white/5 text-muted-foreground cursor-not-allowed border border-border"}`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-3 animate-spin text-neon-cyan" />
                <span className="animate-pulse">Analyzing Financial Data using AI...</span>
              </>
            ) : "RUN AI ANALYSIS"}
          </button>
          
          <button
            onClick={() => {
              const fakeFile = new File(["dummy"], "demo.csv", { type: "text/csv" });
              onAnalyze(fakeFile, fakeFile);
            }}
            disabled={isLoading}
            className="sm:w-auto w-full flex items-center justify-center py-4 px-6 border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-semibold text-foreground transition-all duration-300"
          >
             Use Demo Data
          </button>
        </div>
      </motion.div>
    </div>
  );
}
