"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadForm } from "@/components/UploadForm";
import { useAnalysis } from "@/components/AnalysisContext";
import { PageHeader } from "@/components/layout/PageHeader";

export default function UploadPage() {
  const router = useRouter();
  const { setResults } = useAnalysis();
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async (balanceSheet, pandl) => {
    setIsLoading(true);

    try {
      // Simulate complex AI backend processing based on files
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const isMock = balanceSheet?.name === "demo.csv" || !balanceSheet;

      // Mock Data Payload for testing
      setResults({
        healthScore: { value: isMock ? 85 : 78, status: isMock ? "Excellent" : "Good" },
        bankruptcyRisk: { value: "Low", status: "Low Risk" },
        investmentScore: { value: isMock ? 92 : 85, status: "High" },
        keyRatios: [
          { name: "Current Ratio", value: isMock ? 2.1 : 1.5 },
          { name: "Quick Ratio", value: isMock ? 1.8 : 1.2 },
          { name: "Debt to Equity", value: isMock ? 0.4 : 0.8 },
          { name: "Net Profit Margin", value: isMock ? 18.5 : 12.4 },
          { name: "ROA", value: isMock ? 12.0 : 8.5 },
        ],
        explanations: [
          { feature: "Operating Cash Flow", description: "Strong operating cash flow indicates healthy core operations and ability to cover short-term liabilities.", impactValue: 12 },
          { feature: "Debt to Equity Ratio", description: "Healthy leverage compared to industry standard, showing responsible borrowing.", impactValue: 8 },
          { feature: "Days Sales Outstanding", description: "Slightly longer time to collect receivables compared to competitors.", impactValue: -4 },
          { feature: "Gross Margin", description: "Consistent gross margins suggest pricing power and stable cost of goods sold.", impactValue: 5 },
        ]
      });

      // Redirect into dashboard viewing state
      router.push("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="pb-4">
        <PageHeader 
          title="Upload & Analyze" 
          description="Provide your financial statements for AI processing and credit health analysis."
        />
      </div>
      <div className="flex-1 flex items-center justify-center pb-16">
        <UploadForm onAnalyze={handleAnalyze} isLoading={isLoading} />
      </div>
    </div>
  );
}
