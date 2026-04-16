"use client";

import { createContext, useContext, useState } from "react";

const AnalysisContext = createContext({
  results: null,
  setResults: () => {},
});

export function AnalysisProvider({ children }) {
  const [results, setResults] = useState(null);

  return (
    <AnalysisContext.Provider value={{ results, setResults }}>
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  return useContext(AnalysisContext);
}
