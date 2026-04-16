"use client";

import { use, useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Download, ArrowLeft, Printer, Calendar, ShieldCheck, FileText, Loader2 } from "lucide-react";
import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";

import { MOCK_REPORTS } from "@/lib/reports";
import { ScoreGauge } from "@/components/dashboard/ScoreGauge";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { RiskDonutChart } from "@/components/dashboard/RiskDonutChart";
import { InsightsPanel } from "@/components/dashboard/InsightsPanel";
import { XAIBarChart } from "@/components/dashboard/XAIBarChart";
import { useSettings } from "@/context/SettingsContext";
import { formatCurrency } from "@/lib/format";
import { DollarSign, Activity, Wallet, Percent } from "lucide-react";

import { ReportTemplate } from "@/components/reports/ReportTemplate";

export default function ReportDetailPage({ params }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isGenerating, setIsGenerating] = useState(false);
  const reportRef = useRef(null);
  const autoDownloadTriggered = useRef(false);

  const report = MOCK_REPORTS.find(r => r.id === resolvedParams.id) || MOCK_REPORTS[0];

  const handleDownload = async () => {
    if (!reportRef.current) return;
    setIsGenerating(true);

    try {
      const element = reportRef.current;
      
      const dataUrl = await htmlToImage.toPng(element, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: document.documentElement.classList.contains('dark') ? '#0B0F1A' : '#ffffff',
      });
      
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(dataUrl, "PNG", 0, 0, 210, 0); 
      pdf.save(`report-${report.id}-${report.date}.pdf`);
    } catch (error) {
      console.error("PDF Generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (searchParams.get("download") === "true" && !autoDownloadTriggered.current) {
      autoDownloadTriggered.current = true;
      const timer = setTimeout(() => {
        handleDownload();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  return (
    <div className="space-y-6 pb-20">
      {/* Action Header */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium text-sm">Back to Reports</span>
        </button>

        <div className="flex items-center space-x-3">
          <button 
            disabled={isGenerating}
            onClick={handleDownload}
            className="flex items-center space-x-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-xl text-sm font-bold transition-all disabled:opacity-50"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span>{isGenerating ? "Generating..." : "Download PDF"}</span>
          </button>
          <button 
            onClick={() => window.print()}
            className="p-2 bg-white/5 border border-white/10 rounded-xl text-muted-foreground hover:text-white transition-all shadow-sm"
            title="Print Page"
          >
            <Printer className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Report View */}
      <ReportTemplate report={report} reportRef={reportRef} />
    </div>
  );
}
