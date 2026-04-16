"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    theme: "dark",
    currency: "INR",
    notifications: true,
    exportFormat: "CSV",
  });

  const [draftSettings, setDraftSettings] = useState({
    theme: "dark",
    currency: "INR",
    notifications: true,
    exportFormat: "CSV",
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedSettings = localStorage.getItem("app_settings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
        setDraftSettings(parsed); // Sync draft on load
        applyTheme(parsed.theme);
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    } else {
      applyTheme("dark");
    }
    setIsLoading(false);
  }, []);

  const applyTheme = (theme) => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const updateSetting = (key, value) => {
    setDraftSettings(prev => ({ ...prev, [key]: value }));
  };

  const applySettings = () => {
    setSettings(draftSettings);
    applyTheme(draftSettings.theme);
    localStorage.setItem("app_settings", JSON.stringify(draftSettings));
  };

  const hasUnsavedChanges = JSON.stringify(settings) !== JSON.stringify(draftSettings);

  return (
    <SettingsContext.Provider value={{ 
      ...settings, 
      draftSettings, 
      updateSetting, 
      applySettings, 
      hasUnsavedChanges,
      isLoading 
    }}>
      {children}
    </SettingsContext.Provider>
  );
};
