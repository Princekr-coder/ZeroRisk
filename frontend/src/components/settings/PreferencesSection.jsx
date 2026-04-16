"use client";

import { motion } from "framer-motion";
import { useSettings } from "@/context/SettingsContext";

export function PreferencesSection() {
  const { theme, notifications, draftSettings, updateSetting } = useSettings();

  const isThemeStaged = draftSettings.theme !== theme;
  const isNotificationsStaged = draftSettings.notifications !== notifications;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="glass p-6 rounded-xl border border-border space-y-6"
    >
      <div className="flex items-center justify-between border-b border-border/50 pb-4">
        <h3 className="text-lg font-semibold text-foreground">User Preferences</h3>
      </div>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-foreground">System Theme</p>
            <p className="text-sm text-muted-foreground leading-relaxed mt-0.5">Toggle between dark and light interfaces</p>
          </div>
          <button 
            onClick={() => updateSetting("theme", draftSettings.theme === 'dark' ? 'light' : 'dark')}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${draftSettings.theme === 'dark' ? 'bg-neon-purple' : 'bg-slate-300 dark:bg-white/20'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${draftSettings.theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
            {isThemeStaged && <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full border border-white" title="Unsaved changes" />}
          </button>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-foreground">Email Notifications</p>
            <p className="text-sm text-muted-foreground leading-relaxed mt-0.5">Receive alerts for completed analyses</p>
          </div>
          <button 
            onClick={() => updateSetting("notifications", !draftSettings.notifications)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full shadow-inner transition-colors ${draftSettings.notifications ? 'bg-neon-cyan' : 'bg-slate-300 dark:bg-white/20'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${draftSettings.notifications ? 'translate-x-6' : 'translate-x-1'}`} />
            {isNotificationsStaged && <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full border border-white" title="Unsaved changes" />}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
