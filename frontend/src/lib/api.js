import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const analyzeFinancialData = async (balanceSheetFile, pandlFile) => {
  const formData = new FormData();
  formData.append("balance_sheet", balanceSheetFile);
  formData.append("pandl", pandlFile);

  try {
    const response = await api.post("/analyze", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Analysis API Error:", error);
    throw error;
  }
};

export const chatWithAI = async (sessionId, message) => {
  try {
    const response = await api.post("/chat", {
      session_id: sessionId,
      message: message,
    });
    return response.data;
  } catch (error) {
    console.error("Chat API Error:", error);
    throw error;
  }
};

export const simulateWhatIf = async (revenueChange, debtChange, baseFeatures = {}) => {
  try {
    const response = await api.post("/what-if", {
      revenue_change: Number(revenueChange),
      debt_change: Number(debtChange),
      base_features: baseFeatures,
    });
    return response.data;
  } catch (error) {
    console.error("What-If API Error:", error);
    throw error;
  }
};

export default api;
