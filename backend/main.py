# backend/main.py
from fastapi import FastAPI, UploadFile, File, HTTPException
from sklearn.ensemble import RandomForestRegressor
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

import pandas as pd
import numpy as np
import joblib
import os
import shap
import traceback
from io import BytesIO
import google.generativeai as genai
from typing import Dict, Any

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

app = FastAPI(
    title="AI-Driven Financial Health Scoring for SMEs",
    description="PS-9 Innovathon Project",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ========================= ADVANCED ML PREDICTOR =========================
class FinancialPredictor:
    def __init__(self):
        self.model_path = "ml_models/financial_health_model.joblib"
        self.model = None
        self.feature_names = None
        self._load_or_train_model()

    def _load_or_train_model(self):
        os.makedirs("ml_models", exist_ok=True)
        if os.path.exists(self.model_path):
            self.model = joblib.load(self.model_path)
            print("✅ Loaded pre-trained financial health model")
        else:
            print("⚙️  Training synthetic model for the first time...")
            self._train_synthetic_model()
            print("✅ Synthetic model trained and saved!")

    def _train_synthetic_model(self):
        np.random.seed(42)
        n_samples = 800
        data = {
            'current_ratio': np.random.uniform(0.3, 5.0, n_samples),
            'quick_ratio': np.random.uniform(0.2, 4.5, n_samples),
            'debt_to_equity': np.random.uniform(0.1, 4.0, n_samples),
            'debt_ratio': np.random.uniform(0.1, 0.9, n_samples),
            'gross_margin': np.random.uniform(-0.1, 0.55, n_samples),
            'net_margin': np.random.uniform(-0.2, 0.35, n_samples),
            'revenue_growth_yoy': np.random.uniform(-0.3, 0.6, n_samples),
            'profit_growth_yoy': np.random.uniform(-0.5, 1.0, n_samples),
            'opex_growth': np.random.uniform(-0.25, 0.5, n_samples),
            'asset_turnover': np.random.uniform(0.4, 3.5, n_samples),
            'roe': np.random.uniform(-0.3, 0.6, n_samples),
            'interest_coverage': np.random.uniform(0.1, 15.0, n_samples),
            'altman_z_approx': np.random.uniform(-2.0, 6.0, n_samples),
        }
        X = pd.DataFrame(data)
        base_score = (
            25 * np.clip(data['current_ratio'], 0, 3) +
            15 * np.clip(data['quick_ratio'], 0, 3) +
            -12 * data['debt_to_equity'] +
            -10 * data['debt_ratio'] +
            20 * data['gross_margin'] +
            18 * data['net_margin'] +
            22 * data['revenue_growth_yoy'] +
            12 * data['profit_growth_yoy'] +
            -8 * data['opex_growth'] +
            10 * data['asset_turnover'] +
            15 * data['roe'] +
            8 * np.clip(data['interest_coverage'], 0, 10) +
            18 * np.clip(data['altman_z_approx'], 0, 6)
        )
        health_score = np.clip(base_score + np.random.normal(0, 8, n_samples), 0, 100)

        self.model = RandomForestRegressor(n_estimators=120, max_depth=8, random_state=42)
        self.model.fit(X, health_score)
        joblib.dump(self.model, self.model_path)
        self.feature_names = list(X.columns)

    def extract_features(self, balance_df: pd.DataFrame, pandl_df: pd.DataFrame) -> Dict[str, float]:
        year_cols = [col for col in balance_df.columns if str(col).isdigit() and len(str(col)) == 4]
        year_cols.sort()
        latest = year_cols[-1]
        prev = year_cols[-2] if len(year_cols) > 1 else latest

        def get_value(df, keyword, year):
            mask = df['Item'].astype(str).str.contains(keyword, case=False, na=False)
            try:
                return float(df.loc[mask, year].iloc[0])
            except:
                return 0.0

        total_current_assets = get_value(balance_df, "Total Current Assets", latest)
        total_current_liab = get_value(balance_df, "Total Current Liabilities", latest)
        cash = get_value(balance_df, "Cash", latest)
        ar = get_value(balance_df, "Accounts Receivable", latest)
        total_assets = get_value(balance_df, "Total Assets", latest)
        total_liab = get_value(balance_df, "Total Liabilities", latest)
        equity = get_value(balance_df, "Equity", latest)

        revenue = get_value(pandl_df, "Revenue", latest)
        revenue_prev = get_value(pandl_df, "Revenue", prev)
        gross_profit = get_value(pandl_df, "Gross Profit", latest)
        net_profit = get_value(pandl_df, "Net Profit", latest)
        ebit = get_value(pandl_df, "EBIT", latest)
        interest = get_value(pandl_df, "Interest Expense", latest)
        opex = get_value(pandl_df, "Operating Expenses", latest)

        features = {
            'current_ratio': total_current_assets / total_current_liab if total_current_liab > 0 else 0.0,
            'quick_ratio': (cash + ar) / total_current_liab if total_current_liab > 0 else 0.0,
            'debt_to_equity': total_liab / equity if equity > 0 else 0.0,
            'debt_ratio': total_liab / total_assets if total_assets > 0 else 0.0,
            'gross_margin': gross_profit / revenue if revenue > 0 else 0.0,
            'net_margin': net_profit / revenue if revenue > 0 else 0.0,
            'revenue_growth_yoy': (revenue - revenue_prev) / revenue_prev if revenue_prev > 0 else 0.0,
            'profit_growth_yoy': (net_profit - get_value(pandl_df, "Net Profit", prev)) / get_value(pandl_df, "Net Profit", prev) if get_value(pandl_df, "Net Profit", prev) > 0 else 0.0,
            'opex_growth': (opex - get_value(pandl_df, "Operating Expenses", prev)) / get_value(pandl_df, "Operating Expenses", prev) if get_value(pandl_df, "Operating Expenses", prev) > 0 else 0.0,
            'asset_turnover': revenue / total_assets if total_assets > 0 else 0.0,
            'roe': net_profit / equity if equity > 0 else 0.0,
            'interest_coverage': ebit / interest if interest > 0 else 0.0,
            'altman_z_approx': (
                1.2 * ((total_current_assets - total_current_liab) / total_assets) +
                1.4 * (equity / total_assets) +
                3.3 * (ebit / total_assets) +
                0.6 * (equity / equity if equity > 0 else 1) +
                (revenue / total_assets)
            ) if total_assets > 0 else 0.0
        }
        self.feature_names = list(features.keys())
        return features

    def _get_year_columns(self, df: pd.DataFrame):
        year_cols = [str(col).strip() for col in df.columns if str(col).strip().isdigit() and len(str(col).strip()) == 4]
        year_cols.sort()
        return year_cols

    def _get_series_value(self, df: pd.DataFrame, keyword: str, year: str) -> float:
        mask = df['Item'].astype(str).str.contains(keyword, case=False, na=False)
        try:
            return float(df.loc[mask, year].iloc[0])
        except Exception:
            return 0.0

    def _build_metric_summary(self, balance_df: pd.DataFrame, pandl_df: pd.DataFrame, features_dict: Dict[str, float]):
        year_cols = self._get_year_columns(pandl_df)
        latest = year_cols[-1] if year_cols else None
        prev = year_cols[-2] if len(year_cols) > 1 else latest

        balance_years = self._get_year_columns(balance_df)
        balance_latest = balance_years[-1] if balance_years else latest
        balance_prev = balance_years[-2] if len(balance_years) > 1 else balance_latest

        revenue = self._get_series_value(pandl_df, "Revenue", latest) if latest else 0.0
        revenue_prev = self._get_series_value(pandl_df, "Revenue", prev) if prev else 0.0
        net_profit = self._get_series_value(pandl_df, "Net Profit", latest) if latest else 0.0
        net_profit_prev = self._get_series_value(pandl_df, "Net Profit", prev) if prev else 0.0
        total_liab = self._get_series_value(balance_df, "Total Liabilities", balance_latest) if balance_latest else 0.0
        total_liab_prev = self._get_series_value(balance_df, "Total Liabilities", balance_prev) if balance_prev else 0.0

        def pct_change(current: float, previous: float) -> float:
            if previous == 0:
                return 0.0
            return round(((current - previous) / abs(previous)) * 100, 1)

        return {
            "revenue": {
                "label": "Revenue",
                "value": revenue,
                "change_pct": pct_change(revenue, revenue_prev),
                "trend": "up" if revenue >= revenue_prev else "down",
            },
            "net_profit": {
                "label": "Net Profit",
                "value": net_profit,
                "change_pct": pct_change(net_profit, net_profit_prev),
                "trend": "up" if net_profit >= net_profit_prev else "down",
            },
            "debt_to_equity": {
                "label": "Debt-to-Eq",
                "value": round(features_dict.get("debt_to_equity", 0.0), 2),
                "change_pct": pct_change(total_liab, total_liab_prev),
                "trend": "down" if total_liab <= total_liab_prev else "up",
            },
            "liquidity": {
                "label": "Liquidity",
                "value": round(features_dict.get("current_ratio", 0.0), 2),
                "change_pct": round(features_dict.get("current_ratio", 0.0) * 3.5, 1),
                "trend": "up" if features_dict.get("current_ratio", 0.0) >= 1 else "down",
            },
        }

    def _build_risk_breakdown(self, features_dict: Dict[str, float]):
        financial_risk = min(55.0, max(18.0, features_dict.get("debt_ratio", 0.0) * 60 + (2 - min(features_dict.get("current_ratio", 0.0), 2)) * 10))
        operational_risk = min(45.0, max(20.0, 30 - features_dict.get("net_margin", 0.0) * 25 + max(features_dict.get("opex_growth", 0.0), 0) * 30))
        market_risk = max(10.0, 100.0 - financial_risk - operational_risk)

        total = financial_risk + operational_risk + market_risk
        return [
            {"name": "Financial Risk", "value": round(financial_risk / total * 100, 1), "color": "#22d3ee"},
            {"name": "Operational Risk", "value": round(operational_risk / total * 100, 1), "color": "#8b5cf6"},
            {"name": "Market Risk", "value": round(market_risk / total * 100, 1), "color": "#facc15"},
        ]

    def _build_trend_data(self, pandl_df: pd.DataFrame):
        year_cols = self._get_year_columns(pandl_df)
        trend = []

        for year in year_cols:
            trend.append({
                "period": year,
                "revenue": self._get_series_value(pandl_df, "Revenue", year),
                "profit": self._get_series_value(pandl_df, "Net Profit", year),
                "forecast": False,
            })

        if trend:
            last = trend[-1]
            second_last = trend[-2] if len(trend) > 1 else last
            revenue_step = last["revenue"] - second_last["revenue"]
            profit_step = last["profit"] - second_last["profit"]

            for offset in range(1, 3):
                trend.append({
                    "period": f"FY{int(last['period']) + offset}",
                    "revenue": round(last["revenue"] + revenue_step * offset * 0.9, 2),
                    "profit": round(last["profit"] + profit_step * offset * 0.85, 2),
                    "forecast": True,
                })

        return trend

    def predict(self, balance_df: pd.DataFrame, pandl_df: pd.DataFrame) -> Dict[str, Any]:
        features_dict = self.extract_features(balance_df, pandl_df)
        X = pd.DataFrame([features_dict])

        health_score = float(self.model.predict(X)[0])
        health_score = max(0, min(100, round(health_score, 1)))

        altman_z = features_dict.get('altman_z_approx', 0)
        bankruptcy_prob = max(0.0, min(1.0, (3.0 - altman_z) / 6.0))
        risk_level = "Low" if bankruptcy_prob < 0.15 else "Medium" if bankruptcy_prob < 0.40 else "High"

        investment_score = round(
            health_score * 0.65 +
            features_dict.get('net_margin', 0) * 100 * 0.15 +
            features_dict.get('revenue_growth_yoy', 0) * 100 * 0.20,
            1
        )
        investment_score = max(0, min(100, investment_score))

        explainer = shap.TreeExplainer(self.model)
        shap_values = explainer.shap_values(X)[0]

        explanations = []
        feature_list = list(features_dict.keys())
        for feat, impact in sorted(zip(feature_list, shap_values), key=lambda x: abs(x[1]), reverse=True)[:6]:
            direction = "positive" if impact > 0 else "negative"
            explanations.append({
                "feature": feat.replace("_", " ").title(),
                "impact": f"{impact:+.1f} points",
                "direction": direction,
                "description": self._get_feature_description(feat, features_dict[feat], impact > 0)
            })

        return {
            "financial_health_score": health_score,
            "bankruptcy_risk": {"probability": round(bankruptcy_prob, 3), "level": risk_level},
            "investment_attractiveness": investment_score,
            "key_ratios": {k: round(v, 3) for k, v in features_dict.items()},
            "key_metrics": self._build_metric_summary(balance_df, pandl_df, features_dict),
            "risk_breakdown": self._build_risk_breakdown(features_dict),
            "trend_data": self._build_trend_data(pandl_df),
            "explanations": explanations,
            "overall_assessment": self._generate_overall_assessment(health_score, risk_level, investment_score)
        }

    def _get_feature_description(self, feature: str, value: float, positive: bool) -> str:
        desc_map = {
            "current_ratio": f"Current Ratio of {value:.2f} shows {'strong' if positive else 'weak'} liquidity",
            "quick_ratio": f"Quick Ratio of {value:.2f} indicates {'excellent' if positive else 'tight'} short-term solvency",
            "debt_to_equity": f"Debt-to-Equity of {value:.2f} is {'healthy' if positive else 'high'}",
            "revenue_growth_yoy": f"Revenue grew {value*100:+.1f}% YoY - {'excellent momentum' if positive else 'declining trend'}",
            "net_margin": f"Net Margin of {value*100:+.1f}% is {'very profitable' if positive else 'under pressure'}",
            "altman_z_approx": f"Altman Z-Score suggests {'low' if positive else 'elevated'} bankruptcy risk",
        }
        return desc_map.get(feature, f"{feature} contributed {'positively' if positive else 'negatively'}")

    def _generate_overall_assessment(self, health: float, risk: str, invest: float) -> str:
        if health >= 80:
            return "Strong financial health with low risk and high investment potential."
        elif health >= 60:
            return "Moderate financial position. Good growth potential but monitor liquidity."
        else:
            return "Financial distress signals detected. High bankruptcy risk - caution advised."


predictor = FinancialPredictor()

# ========================= FILE PARSER =========================
async def parse_uploaded_files(balance_sheet: UploadFile, pandl: UploadFile):
    def read_file(file: UploadFile):
        content = BytesIO(file.file.read())
        if file.filename.endswith(".csv"):
            return pd.read_csv(content)
        return pd.read_excel(content)

    balance_df = read_file(balance_sheet)
    pandl_df = read_file(pandl)

    balance_df.columns = [str(c).strip() for c in balance_df.columns]
    pandl_df.columns = [str(c).strip() for c in pandl_df.columns]
    return balance_df, pandl_df

# ========================= ANALYZE ENDPOINT (Exact format you want) =========================
@app.post("/analyze")
async def analyze_financial_health(
    balance_sheet: UploadFile = File(...),
    pandl: UploadFile = File(...)
):
    try:
        balance_df, pandl_df = await parse_uploaded_files(balance_sheet, pandl)
        result = predictor.predict(balance_df, pandl_df)

        return {
            "status": "success",
            "company_name": "Uploaded SME",
            "analysis": result
        }

    except Exception as e:
        print(traceback.format_exc())
        raise HTTPException(status_code=400, detail=f"Error processing files: {str(e)}")

# ========================= OTHER ENDPOINTS =========================
chat_sessions = {}
chat_model = genai.GenerativeModel(
    "gemini-2.5-flash",
    system_instruction="You are an expert financial AI assistant for the CredMetric dashboard. Keep all your responses extremely concise, strictly point-to-point, and easy to read. Avoid long paragraphs. Use brief, bulleted summaries whenever possible."
)

class ChatRequest(BaseModel):
    session_id: str
    message: str

@app.post("/chat")
async def chat(req: ChatRequest):
    if req.session_id not in chat_sessions:
        chat_sessions[req.session_id] = []
    chat_sessions[req.session_id].append({"role": "user", "parts": [req.message]})
    response = chat_model.generate_content(chat_sessions[req.session_id])
    reply = response.text
    chat_sessions[req.session_id].append({"role": "model", "parts": [reply]})
    return {"reply": reply}

class WhatIfRequest(BaseModel):
    revenue_change: float = 0
    debt_change: float = 0

@app.post("/what-if")
async def what_if(data: WhatIfRequest):
    # Step 1: Partial input
    input_features = {
        "current_ratio": 1.5,
        "debt_ratio": 0.5 + data.debt_change/100,
        "net_margin": 0.2 + data.revenue_change/100,
    }

    # Step 2: Fill missing features with defaults
    full_features = {}

    for feature in predictor.feature_names:
        if feature in input_features:
            full_features[feature] = input_features[feature]
        else:
            full_features[feature] = 0.0   # default fallback

    # Step 3: Convert to DataFrame
    X = pd.DataFrame([full_features])

    # Step 4: Ensure correct order
    X = X[predictor.feature_names]

    score = float(predictor.model.predict(X)[0])
    score = round(max(0, min(100, score)), 1)

    return {
        "new_health_score": score
    }

@app.get("/")
async def root():
    return {"message": "🚀 API is running! Go to /docs"}

# ========================= RUN =========================
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
