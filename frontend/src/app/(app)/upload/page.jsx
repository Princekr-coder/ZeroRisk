"use client";

import { useRouter } from "next/navigation";
import { UploadForm } from "@/components/UploadForm";
import { PageHeader } from "@/components/layout/PageHeader";

export default function UploadPage() {
  const router = useRouter();

  return (
    <div className="w-full h-full flex flex-col">
      <div className="pb-4">
        <PageHeader 
          title="Upload & Analyze" 
          description="Provide your financial statements for AI processing and credit health analysis."
        />
      </div>
      <div className="flex-1 flex items-center justify-center pb-16">
        <UploadForm onAnalyzeSuccess={() => router.push("/dashboard")} />
      </div>
    </div>
  );
}
