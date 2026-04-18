# 🚀 CredMetric: AI-Driven Financial Health Scoring for SMEs

An AI-powered platform that evaluates the financial health of Small and Medium Enterprises (SMEs) using machine learning, financial analytics, and explainable AI.

---

## 📌 Problem Statement

### 🏢 SMEs Perspective
- Difficulty in assessing financial health due to unstructured data  
- Lack of advanced financial analysis tools  
- Manual evaluation is slow and error-prone  

### 🏦 Banks & Lenders Perspective
- Inaccurate credit risk assessment  
- Reliance on traditional scoring systems  
- High chances of loan defaults  

### 📊 Investors Perspective
- Limited visibility into financial performance  
- Risk of poor investment decisions  
- Lack of data-driven evaluation  

---

## 💡 Proposed Solution

**CredMetric** provides:

- 📊 Financial data analysis (Balance Sheet & P&L)
- 🎯 Financial Health Score (0–100)
- ⚠️ Risk Prediction (Low / Medium / High)
- 🤖 AI-driven insights & recommendations
- 🔍 Explainable AI using SHAP

---

## ⚙️ Technical Approach

### 🔄 Data Flow

### 📥 Input
- CSV Upload / Manual Entry

### ⚙️ Processing
- Data cleaning using Pandas

### 🤖 Model
- Random Forest / XGBoost (Scikit-learn)

### 📤 Output
- Financial Score  
- Risk Level  
- Insights  
- Visualizations  

---

## 🏗️ Tech Stack

| Layer | Technology |
|------|-----------|
| Backend | FastAPI |
| Frontend | Next.js + Tailwind CSS |
| Data Processing | Pandas |
| ML Models | Scikit-learn |
| Explainability | SHAP |
| AI Assistant | Gemini |

---

## 🧠 System Architecture

### 🔧 Backend
- `main.py` → FastAPI entry point  
- `ml_models/financial_health_model.joblib` → Trained ML model  
- `requirements.txt` → Dependencies  

### 🎨 Frontend
- `src/app/` → Routing & structure  
- `login/`, `signup/`, `profile/` → Auth modules  
- `globals.css` → Styling  
- `layout.js` → UI structure  

---

## 📁 Project Structure
CredMetric/
│
├── backend/
│ ├── main.py
│ ├── requirements.txt
│ ├── ml_models/
│ │ └── financial_health_model.joblib
│
├── frontend/
│ ├── public/
│ ├── src/
│ │ ├── app/
│ │ ├── components/
│ │ ├── context/
│ │ └── lib/
│ ├── package.json
│
└── README.md

---

## ✨ Key Features

- 📊 Financial Health Scoring  
- ⚠️ Risk Prediction System  
- 📈 Trend Analysis Dashboard  
- 🤖 AI Insights  
- 🔍 Explainable AI (SHAP)  
- 🔄 What-if Simulation  

---

## 🎯 Impact & Benefits

### 🏢 SMEs
- Better financial decision-making  
- Improved loan approval chances  
- Clear financial insights  

### 🏦 Banks
- Faster loan processing  
- Reduced default risk  
- Data-driven decisions  

### 📊 Investors
- Better investment insights  
- Reduced financial risk  
- Transparent evaluation  

---

## 🔮 Future Scope

- ☁️ Cloud deployment  
- 🔗 Integration with Tally & GST  
- 🤖 Advanced AI models  
- 💬 AI financial chatbot  
- 🌍 Multi-country support  

---

## 🌍 Vision

> “To build an AI-powered financial intelligence platform that democratizes access to smart financial decision-making for every SME.”

---

## 📚 References

1. Explainable Machine Learning in Credit Risk  
   https://link.springer.com/article/10.1007/s10614-020-10042-0  

2. Explainability in SME Credit Risk  
   https://journals.sagepub.com/doi/10.3233/FAIA240149  

---

## ⚡ Getting Started

###  Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```
### Frontend
```
cd frontend
npm install
npm run dev
```
