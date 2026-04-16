"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function LogoutButton({ collapsed }) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <div className="relative w-full">
      <button 
        onClick={() => setShowConfirm(true)}
        className={`w-full flex items-center ${collapsed ? 'justify-center' : 'space-x-3 px-3'} py-3 mt-2 rounded-xl transition-all duration-300 group
          text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200
          dark:text-red-400 dark:hover:text-red-300 dark:bg-red-500/10 dark:hover:bg-red-500/20`}
      >
        <LogOut className="w-5 h-5 flex-shrink-0" />
        {!collapsed && <span className="font-semibold">Logout</span>}
      </button>

      <AnimatePresence>
        {showConfirm && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className={`absolute bottom-full left-0 right-0 mb-4 p-4 rounded-2xl border shadow-2xl z-50
              bg-white border-slate-200 text-slate-900
              dark:bg-slate-900 dark:border-red-500/30 dark:text-white`}
          >
            <p className="text-sm font-bold mb-4 text-center">Are you sure you want to logout?</p>
            <div className="flex gap-2">
              <button 
                onClick={handleLogout}
                className="flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-bold transition-colors text-xs"
              >
                <Check className="w-3 h-3" />
                <span>Logout</span>
              </button>
              <button 
                onClick={() => setShowConfirm(false)}
                className="flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-700 dark:text-slate-300 font-bold transition-colors text-xs"
              >
                <X className="w-3 h-3" />
                <span>Cancel</span>
              </button>
            </div>
            
            {/* Pointer for the popup */}
            <div className="absolute -bottom-1.5 left-1/2 -ms-2 w-3 h-3 rotate-45 border-r border-b z-[-1]
              bg-white border-slate-200 dark:bg-slate-900 dark:border-red-500/30" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
