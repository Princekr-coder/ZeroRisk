"use client";

import { User, Bell, Palette, Database, Save, CheckCircle2, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSettings } from "@/context/SettingsContext";

import { PageHeader } from "@/components/layout/PageHeader";
import { ProfileSection } from "@/components/settings/ProfileSection";
import { PreferencesSection } from "@/components/settings/PreferencesSection";
import { AppConfigSection } from "@/components/settings/AppConfigSection";

const TABS = [
  { id: "profile", label: "Profile", icon: User, color: "text-neon-blue" },
  { id: "preferences", label: "Preferences", icon: Palette, color: "text-neon-purple" },
  { id: "config", label: "App Configuration", icon: Database, color: "text-neon-cyan" },
];

export default function SettingsPage() {
  const { 
    applySettings,
    hasUnsavedChanges,
    isLoading 
  } = useSettings();

  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState({ name: "Jane Doe", email: "jane@company.com" });
  const [showToast, setShowToast] = useState(false);

  // Load last active tab
  useEffect(() => {
    const savedTab = localStorage.getItem("settings_active_tab");
    if (savedTab) setActiveTab(savedTab);
  }, []);

  const handleTabChange = (id) => {
    setActiveTab(id);
    localStorage.setItem("settings_active_tab", id);
  };

  const handleSave = () => {
    applySettings();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  if (isLoading) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <PageHeader
        title="Account Settings"
        description="Manage your profile, preferences, and application parameters."
      />

      <div className="grid gap-8 md:grid-cols-3">
         {/* Sidebar Navigation for Settings */}
         <div className="md:col-span-1 space-y-2">
            {TABS.map((tab) => (
              <button 
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`w-full flex items-center justify-start space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 border ${
                  activeTab === tab.id 
                    ? "bg-black/5 dark:bg-white/10 text-foreground dark:text-white border-black/10 dark:border-white/10 shadow-sm" 
                    : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground dark:hover:text-white border-transparent"
                }`}
              >
                <tab.icon className={`w-4 h-4 ${tab.color}`} />
                <span>{tab.label}</span>
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="active-settings-tab"
                    className="ml-auto w-1 h-4 bg-primary rounded-full"
                  />
                )}
              </button>
            ))}
         </div>

         {/* Settings Content Area */}
         <div className="md:col-span-2 space-y-6">
            <AnimatePresence mode="wait">
              {hasUnsavedChanges && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-center space-x-3"
                >
                  <AlertTriangle className="w-5 h-5 text-primary" />
                  <p className="text-sm font-medium text-primary">You have unsaved changes. Apply them to see the updates.</p>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {activeTab === "profile" && (
                <ProfileSection key="profile" profile={profile} setProfile={setProfile} />
              )}
              {activeTab === "preferences" && (
                <PreferencesSection key="preferences" />
              )}
              {activeTab === "config" && (
                <AppConfigSection key="config" />
              )}
            </AnimatePresence>

            <div className="flex justify-end pt-4">
              <button 
                onClick={handleSave}
                disabled={!hasUnsavedChanges}
                className={`flex items-center space-x-2 px-6 py-2.5 rounded-lg font-bold transition-all ${
                  hasUnsavedChanges 
                    ? "bg-primary hover:bg-primary/90 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]" 
                    : "bg-muted text-muted-foreground cursor-not-allowed border border-border"
                }`}
              >
                 <Save className="w-4 h-4" />
                 <span>Save Changes</span>
              </button>
            </div>
         </div>
      </div>

      {/* Success Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 p-4 rounded-xl bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 shadow-lg animate-in slide-in-from-bottom-5 duration-300 z-50">
          <div className="flex items-center">
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-500 mr-3" />
            <p className="text-sm font-medium text-green-800 dark:text-green-300">Settings saved successfully</p>
          </div>
        </div>
      )}
    </div>
  );
}
