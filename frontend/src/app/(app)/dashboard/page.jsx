"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dashboard } from "@/components/Dashboard";
import { useAnalysis } from "@/components/AnalysisContext";
import { motion } from "framer-motion";
import { FileSpreadsheet, Eye, Download } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { results, setResults } = useAnalysis();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="space-y-8 pb-8">
      {/* If we have active analysis results dynamically loaded from Context, show Dashboard, otherwise show the empty / mock Dashboard */}
      <Dashboard 
        results={results || {
          healthScore: { value: 68, status: "Medium Risk" },
          bankruptcyRisk: { value: "Medium", status: "Monitor" },
          investmentScore: { value: 72, status: "Good" },
        }} 
        onReset={() => {
          setResults(null);
          router.push("/upload");
        }} 
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass p-6 rounded-2xl border border-border mt-8"
      >
        <h3 className="text-lg font-bold text-foreground mb-4">Recent Uploads & History</h3>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-sm text-left text-muted-foreground">
            <thead className="text-xs uppercase bg-white/5 text-foreground">
              <tr>
                <th scope="col" className="px-6 py-3 rounded-tl-lg">Date</th>
                <th scope="col" className="px-6 py-3">Document Type</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3">Risk Score</th>
                <th scope="col" className="px-6 py-3 rounded-tr-lg text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[{ date: '2026-04-14', type: 'Q1 Balance Sheet & P&L', status: 'Completed', score: 72 }, { date: '2026-01-10', type: '2025 Annual Report', status: 'Completed', score: 81 }].map((row, idx) => (
                <tr key={idx} className="border-b border-border hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">{row.date}</td>
                  <td className="px-6 py-4 flex items-center space-x-2">
                    <FileSpreadsheet className="w-4 h-4 text-neon-cyan" />
                    <span>{row.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-neon-green/10 text-neon-green rounded-md text-xs font-medium">
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-foreground">{row.score}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-muted-foreground hover:text-white mr-3 transition-colors"><Eye className="w-4 h-4" /></button>
                    <button className="text-muted-foreground hover:text-neon-cyan transition-colors"><Download className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
