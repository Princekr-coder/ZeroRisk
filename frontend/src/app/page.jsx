"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Activity } from "lucide-react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/dashboard");
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-t-2 border-neon-cyan animate-spin absolute inset-0" />
        <div className="w-16 h-16 rounded-full border-b-2 border-neon-purple animate-spin absolute inset-0" style={{ animationDirection: 'reverse' }} />
        <Activity className="w-8 h-8 text-neon-blue absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
      <p className="mt-6 text-sm text-muted-foreground font-medium uppercase tracking-widest animate-pulse">
        Initializing CredMetric...
      </p>
    </div>
  );
}
