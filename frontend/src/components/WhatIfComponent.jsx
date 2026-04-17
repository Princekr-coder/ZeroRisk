"use client";

import { useState } from "react";
import { simulateWhatIf } from "@/lib/api";
import { Loader2, TrendingUp } from "lucide-react";

export function WhatIfComponent() {
  const [revenueChange, setRevenueChange] = useState(0);
  const [debtChange, setDebtChange] = useState(0);
  const [newScore, setNewScore] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSimulate = async () => {
    setLoading(true);
    try {
      const response = await simulateWhatIf(revenueChange, debtChange);
      if(response.new_health_score !== undefined) {
         setNewScore(response.new_health_score);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass p-6 rounded-2xl border border-border">
       <div className="flex items-center space-x-2 mb-4">
         <TrendingUp className="w-5 h-5 text-neon-purple" />
         <h3 className="font-bold text-lg">What-If Simulator</h3>
       </div>
       <p className="text-xs text-muted-foreground mb-6">Drag the sliders to simulate how changes in revenue or debt could affect your health score.</p>

       <div className="space-y-6">
         <div>
           <div className="flex justify-between text-sm mb-2">
             <span>Revenue Trajectory</span>
             <span className="font-bold text-neon-cyan">{revenueChange}%</span>
           </div>
           <input 
             type="range" min="-50" max="50" value={revenueChange} 
             onChange={(e) => setRevenueChange(e.target.value)} 
             className="w-full accent-neon-cyan"
           />
         </div>

         <div>
           <div className="flex justify-between text-sm mb-2">
             <span>Debt Restructuring</span>
             <span className="font-bold text-red-400">{debtChange}%</span>
           </div>
           <input 
             type="range" min="-50" max="50" value={debtChange} 
             onChange={(e) => setDebtChange(e.target.value)} 
             className="w-full accent-red-400"
           />
         </div>

         <button 
           onClick={handleSimulate} 
           disabled={loading}
           className="w-full bg-primary/20 hover:bg-primary/30 border border-primary/50 text-white font-medium py-2 rounded-lg transition"
         >
           {loading ? <Loader2 className="w-4 h-4 mx-auto animate-spin" /> : "Simulate Score"}
         </button>

         {newScore && (
           <div className="mt-4 p-4 text-center bg-white/5 border border-white/10 rounded-xl">
             <span className="block text-sm text-muted-foreground mb-1">Simulated Health Score</span>
             <span className="text-3xl font-bold text-neon-cyan">{newScore.toFixed(1)}</span>
           </div>
         )}
       </div>
    </div>
  );
}
