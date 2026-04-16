"use client";

import { motion } from "framer-motion";

export function ProfileSection({ profile, setProfile }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="glass p-6 rounded-xl border border-border space-y-6"
    >
      <div className="flex items-center justify-between border-b border-border/50 pb-4">
        <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Full Name</label>
          <input 
            type="text" 
            value={profile.name}
            onChange={(e) => setProfile({...profile, name: e.target.value})}
            className="w-full px-4 py-2.5 rounded-lg bg-background border border-border focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none transition-all text-foreground"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Email Address</label>
          <input 
            type="email" 
            value={profile.email}
            onChange={(e) => setProfile({...profile, email: e.target.value})}
            className="w-full px-4 py-2.5 rounded-lg bg-background border border-border focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none transition-all text-foreground"
          />
        </div>
      </div>
    </motion.div>
  );
}
