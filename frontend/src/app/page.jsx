"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Activity } from "lucide-react";

const Spline = dynamic(() => import("@splinetool/react-spline"), { ssr: false });

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="relative w-full h-screen overflow-hidden">
      <Spline
        scene="https://prod.spline.design/CwxQjnEnKvxkd3-e/scene.splinecode"
        className="w-full h-full"
      />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-8 left-8 z-10">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">
            CredMetric
          </h1>
          <p className="text-white/80 mt-2 text-lg">
            AI-Powered Financial Credit Analysis
          </p>
        </div>
        <div className="absolute bottom-8 left-8 z-10 space-y-4">
          <a
            href="/dashboard"
            className="inline-block px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all pointer-events-auto"
          >
            Enter Dashboard
          </a>
        </div>
      </div>
    </main>
  );
}
