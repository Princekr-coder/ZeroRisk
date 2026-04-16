"use client";

import { motion } from "framer-motion";
import { Download, Eye, FileText, Plus, Loader2 } from "lucide-react";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";
import { MOCK_REPORTS } from "@/lib/reports";

import { PageHeader } from "@/components/layout/PageHeader";
import { ReportTemplate } from "@/components/reports/ReportTemplate";

export default function ReportsPage() {
  const router = useRouter();
  const [downloadingId, setDownloadingId] = useState(null);
  const [reportToRender, setReportToRender] = useState(null);
  const hiddenReportRef = useRef(null);

  const handleDownload = async (e, report) => {
    e.stopPropagation();
    if (downloadingId) return;

    setDownloadingId(report.id);
    setReportToRender(report);

    // Give React a moment to render the hidden component
    setTimeout(async () => {
      try {
        if (!hiddenReportRef.current) throw new Error("Template not rendered");

        const dataUrl = await htmlToImage.toPng(hiddenReportRef.current, {
          quality: 1,
          pixelRatio: 2,
          backgroundColor: document.documentElement.classList.contains('dark') ? '#0B0F1A' : '#ffffff',
        });

        const pdf = new jsPDF("p", "mm", "a4");
        pdf.addImage(dataUrl, "PNG", 0, 0, 210, 0);
        pdf.save(`report-${report.id}-${report.date}.pdf`);
      } catch (err) {
        console.error("Download failed:", err);
      } finally {
        setDownloadingId(null);
        setReportToRender(null);
      }
    }, 1000); // Wait for charts to initialize
  };

  const handleView = (e, id) => {
    e.stopPropagation();
    router.push(`/report/${id}`);
  };

  return (
    <div className="space-y-8 pb-10">
      <PageHeader
        title="Analysis Reports"
        description="Historical archive of generated financial assessments."
      >
        <button className="flex items-center space-x-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/20 rounded-lg text-sm font-bold tracking-wide transition-colors">
          <Plus className="w-4 h-4" />
          <span>Generate New Report</span>
        </button>
      </PageHeader>

      <div className="bg-white dark:bg-[#111827] rounded-xl border border-gray-100 dark:border-white/5 mt-8 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-500 dark:text-muted-foreground">
            <thead className="text-xs uppercase bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white border-b border-gray-100 dark:border-white/10">
              <tr>
                <th scope="col" className="px-6 py-4">Report ID</th>
                <th scope="col" className="px-6 py-4">Date</th>
                <th scope="col" className="px-6 py-4">Company Name</th>
                <th scope="col" className="px-6 py-4">Risk Profile</th>
                <th scope="col" className="px-6 py-4">Status</th>
                <th scope="col" className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_REPORTS.map((report, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={report.id} 
                  className="border-b border-gray-50 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                  onClick={(e) => handleView(e, report.id)}
                >
                  <td className="px-6 py-4 font-mono text-[10px] font-bold text-slate-400 dark:text-muted-foreground">{report.id}</td>
                  <td className="px-6 py-4 font-medium">{report.date}</td>
                  <td className="px-6 py-4 font-bold text-slate-900 dark:text-white flex items-center">
                    <FileText className="w-4 h-4 mr-2 text-blue-600 dark:text-neon-blue" />
                    {report.company}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2 font-semibold">
                       <span className={`w-2 h-2 rounded-full ${report.risk === 'Low' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : report.risk === 'Medium' ? 'bg-amber-500' : 'bg-rose-500'}`} />
                       <span className="text-slate-700 dark:text-slate-300">{report.risk} ({report.score})</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${report.status === 'Finalized' ? 'bg-blue-50 dark:bg-primary/10 text-blue-600 dark:text-primary' : 'bg-gray-100 dark:bg-white/10 text-slate-500 dark:text-muted-foreground'}`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button 
                      onClick={(e) => handleView(e, report.id)}
                      className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors hover:bg-blue-50 dark:hover:bg-white/5 rounded-lg" 
                      title="View Detailed Report"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={(e) => handleDownload(e, report)}
                      disabled={downloadingId === report.id}
                      className={`p-2 transition-colors rounded-lg ${downloadingId === report.id ? 'text-primary animate-pulse' : 'text-slate-400 hover:text-emerald-600 dark:hover:text-neon-cyan hover:bg-emerald-50 dark:hover:bg-white/5'}`} 
                      title="Download PDF Archive"
                    >
                      {downloadingId === report.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hidden container for background PDF generation */}
      <div className="fixed left-[-9999px] top-0 w-full max-w-[1200px] pointer-events-none opacity-0 -z-50">
        {reportToRender && (
          <ReportTemplate report={reportToRender} reportRef={hiddenReportRef} />
        )}
      </div>
    </div>
  );
}
