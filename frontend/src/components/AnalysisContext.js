"use client";

import { createContext, useContext, useState } from "react";

const AnalysisContext = createContext({
  analysis: null,
  setAnalysis: () => {},
  loading: false,
  setLoading: () => {},
  error: null,
  setError: () => {},
});

export function AnalysisProvider({ children }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // We keep results and setResults alias to avoid breaking other files temporarily if they use it
  const results = analysis;
  const setResults = setAnalysis;

  return (
    <AnalysisContext.Provider value={{ analysis, setAnalysis, loading, setLoading, error, setError, results, setResults }}>
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  return useContext(AnalysisContext);
}
