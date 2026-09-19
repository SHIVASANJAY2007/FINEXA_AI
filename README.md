<div align="center">

# 🏛️ FINEXA AI — Autonomous Financial Intelligence & Quantitative Ecosystem

<p align="center">
  <strong>Institutional-Grade Wealth Intelligence • Metaheuristic Multi-Asset GWO Optimizer • Real-Time Market Discovery • Interactive Financial Studio</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 18" />
  <img src="https://img.shields.io/badge/Vite_6-646CFF?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
  <img src="https://img.shields.io/badge/Node.js_20-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Python_3.11-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python 3.11" />
  <img src="https://img.shields.io/badge/Groq_LLM-F55036?style=for-the-badge&logo=groq&logoColor=white" alt="Groq" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/License-MIT-0B4F4A?style=for-the-badge" alt="License" />
</p>

---

### 🌐 [Live Platform Preview](https://finexa-ai.vercel.app) • 📑 [Comprehensive Technical Reports](./Reports) • ⚡ [Quickstart Guide](#-quickstart-guide)

---

</div>

<br />

## 🌟 Overview

**FINEXA AI** is a state-of-the-art autonomous financial engineering and portfolio intelligence platform. Designed to democratize quantitative hedge-fund techniques for modern investors and corporate treasurers, FINEXA AI combines **nature-inspired metaheuristic swarm optimization**, **streaming conversational LLMs with live multi-modal component rendering**, **high-frequency market news aggregation**, **enterprise business intelligence**, and a **gamified quant academy**.

```
                                  ┌─────────────────────────────────────────────────────────────┐
                                  │                      FINEXA AI CLIENT                       │
                                  │      (React 18 • Vite • TailwindCSS • Motion • GSAP)        │
                                  └──────────────────────────────┬──────────────────────────────┘
                                                                 │
                                          HTTPS / REST / SSE / WebSockets
                                                                 │
                                  ┌──────────────────────────────▼──────────────────────────────┐
                                  │                 EXPRESS.JS PROXY & API GATEWAY              │
                                  │          (Node.js • Request Validation • Middleware)         │
                                  └──────┬──────────────┬──────────────┬──────────────┬─────────┘
                                         │              │              │              │
                   ┌─────────────────────┘              │              │              └──────────────────────┐
                   ▼                                    ▼              ▼                                     ▼
     ┌───────────────────────────┐        ┌──────────────────┐ ┌────────────────┐          ┌───────────────────────────┐
     │   Python AI Subprocess    │        │  Groq Cloud LLM  │ │ News & Market  │          │   Actuarial & Business    │
     │ (AlphaPack GWO Optimizer) │        │ (Llama 3.3 70B)  │ │ Feeds (4 APIs) │          │     Analytics Engines     │
     └───────────────────────────┘        └──────────────────┘ └────────────────┘          └───────────────────────────┘
```

---

## ⚡ Core Feature Modules

<br />

<table width="100%">
<tr>
<td width="50%" valign="top">

### 🐺 1. AlphaPack Grey Wolf Optimizer (GWO)
* **Metaheuristic Multi-Asset Swarm Optimization** across 7 asset classes (Large-Cap, Mid/Small, Govt Bonds, Gold, Global Equities, REITs, Cash).
* Models **$\alpha, \beta, \delta, \omega$ wolf hierarchy** with dynamic parameter decay $a(t)$ to escape local minima and maximize Sharpe Ratio.
* **Interactive 2D Live Convergence Radar**, asset allocation donut charts, and Pareto frontier scatter plots.

</td>
<td width="50%" valign="top">

### 💬 2. Conversational Agent & Rich Multi-Modal UI
* Low-latency streaming powered by **Groq Cloud (LLaMA 3.3 70B)**.
* Dynamic **`ResponseRenderer`** compiles AI stream into **live interactive stock charts, comparison tables, portfolio meters, and travel itineraries**.
* Financial domain system prompting with context-aware memory.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 📰 3. Explore & Market Intelligence Hub
* Aggregates real-time news from **NewsAPI, Marketaux, GNews, and RSS feeds**.
* **50+ Keyword Anti-Noise Filter** rejects gossip, sports, and non-financial noise.
* Sector categorization, sentiment tagging (Bullish / Neutral / Bearish), and live market pulse tickers.

</td>
<td width="50%" valign="top">

### 📊 4. Business Intelligence & Financial Studio
* Corporate financial diagnostics: **EBITDA waterfalls, Gross/Net margins, Working Capital, and Quick/Current ratios**.
* **Linear Cash Burn Runway Forecasting** under dynamic hiring and revenue growth scenarios.
* One-click **CSV Financial Report Export** for executive reporting.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 🧮 5. Actuarial Calculator Suite (10 Engines)
* **SIP & Step-Up SIP** with annual step-up compounding curves.
* **Lump-Sum, SWP, CAGR, and Newton-Raphson IRR** engines.
* **Capital Gains Tax (STCG / LTCG)** for equities, debt, and real estate.
* **Inflation Purchasing Power Decay, Goal Velocity, & Retirement Planner**.

</td>
<td width="50%" valign="top">

### 🎓 6. Learn & Earn Academy & Certifications
* 6 advanced course modules: *Foundations, Equity Valuation, Charting & TA, Risk & Hedging, DeFi, and Quant AI*.
* Interactive quiz engine with real-time score verification.
* **Dynamic HTML5 Canvas 2D Certificate Generator** with gold seal and unique verification serial.

</td>
</tr>
</table>

---

## 🔬 Deep Dive: AlphaPack Grey Wolf Optimizer (GWO)

The **AlphaPack Grey Wolf Optimizer** solves the classical Mean-Variance Optimization fragility by preventing extreme corner-weight concentrations and navigating non-convex asset boundaries.

```
                                  ┌───────────────────────┐
                                  │      Alpha (α) Wolf   │  ← Dominant Portfolio (Highest Sharpe / Return)
                                  └───────────┬───────────┘
                                              │
                                  ┌───────────▼───────────┐
                                  │      Beta (β) Wolf    │  ← Secondary Guide Portfolio
                                  └───────────┬───────────┘
                                              │
                                  ┌───────────▼───────────┐
                                  │     Delta (δ) Wolf    │  ← Third Best Portfolio (Exploration Anchor)
                                  └───────────┬───────────┘
                                              │
                                  ┌───────────▼───────────┐
                                  │     Omega (ω) Wolves  │  ← Swarm Candidate Allocations
                                  └───────────────────────┘
```

### 📐 Mathematical Formulation

1. **Encircling Equations:**
   $$\vec{D} = |\vec{C} \cdot \vec{X}_p(t) - \vec{X}(t)|, \quad \vec{X}(t+1) = \vec{X}_p(t) - \vec{A} \cdot \vec{D}$$
   where $\vec{A} = 2a \cdot \vec{r}_1 - a$ and $\vec{C} = 2 \cdot \vec{r}_2$, with $a$ decaying from $2.0 \to 0.0$.

2. **Hunting Vector Updates:**
   $$\vec{X}_1 = \vec{X}_\alpha - \vec{A}_1 \cdot |\vec{C}_1 \vec{X}_\alpha - \vec{X}|, \quad \vec{X}_2 = \vec{X}_\beta - \vec{A}_2 \cdot |\vec{C}_2 \vec{X}_\beta - \vec{X}|, \quad \vec{X}_3 = \vec{X}_\delta - \vec{A}_3 \cdot |\vec{C}_3 \vec{X}_\delta - \vec{X}|$$
   $$\vec{X}(t+1) = \frac{\vec{X}_1 + \vec{X}_2 + \vec{X}_3}{3}$$

3. **Multi-Objective Fitness Function:**
   $$f(\vec{w}) = \lambda_1 \cdot \text{Sharpe}(\vec{w}) + \lambda_2 \cdot R_p(\vec{w}) - \lambda_3 \cdot \sigma_p(\vec{w}) - \text{Penalty}(\vec{w})$$

---

## 🎨 UI/UX Design System & Aesthetics

FINEXA AI is crafted with a Swiss-inspired private banking visual language:

| Token | Hex Code | Visual Swatch | Usage |
|---|---|---|---|
| **Deep Burgundy** | `#6B1E2B` | ![#6B1E2B](https://placehold.co/15x15/6B1E2B/6B1E2B.png) | Primary brand accents, badges, and headers |
| **Emerald Pine** | `#0B4F4A` | ![#0B4F4A](https://placehold.co/15x15/0B4F4A/0B4F4A.png) | Quantitative cockpit borders and status indicators |
| **Antique Gold** | `#C9A227` | ![#C9A227](https://placehold.co/15x15/C9A227/C9A227.png) | Highlights, seals, and typography accents |
| **Warm Ivory** | `#FDF6ED` | ![#FDF6ED](https://placehold.co/15x15/FDF6ED/FDF6ED.png) | Background canvas and card containers |
| **Dark Espresso** | `#3A2E25` | ![#3A2E25](https://placehold.co/15x15/3A2E25/3A2E25.png) | High-contrast typography and borders |

---

## 📁 Repository Structure

```
FINEXA_AI/
├── backend/                             # Express.js API Gateway & Services
│   ├── ai/                              # Python Machine Learning Subprocesses
│   │   ├── gwo_optimizer_engine.py      # AlphaPack Grey Wolf Optimizer Engine
│   │   └── evaluate_gwo.py              # Statistical Benchmark Evaluator
│   ├── controllers/                     # REST API Controllers (Chat, GWO, BI, Explore, Auth)
│   ├── routes/                          # Express Endpoint Routers
│   ├── services/                        # Market Intelligence & Pexels Services
│   └── server.js                        # Main Backend Entry Point & Middleware
│
├── frontend/                            # React 18 + Vite Modern SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── BusinessIntelligence/    # BI Studio & Cashflow Waterfall
│   │   │   ├── Calculator/              # 10 Standalone Actuarial Calculators
│   │   │   │   └── calculations/        # Pure Math & Tax Engines (SIP, SWP, IRR, etc.)
│   │   │   ├── Explore/                 # Market Pulse & Verified News Hub
│   │   │   ├── GWO/                     # AlphaPack GWO Interactive Cockpit
│   │   │   ├── LearnEarn/               # Academy & HTML5 Canvas Certificate Generator
│   │   │   ├── ui/                      # Floating Menus, Marquee & Micro-Interactions
│   │   │   ├── Chatbot.jsx              # Conversational Financial Copilot
│   │   │   └── ResponseRenderer.jsx     # Multi-Modal Rich Visual Block Engine
│   │   ├── App.jsx                      # Client Router & Suspense Providers
│   │   └── main.jsx                     # Vite DOM Mount
│   └── package.json
│
├── Reports/                             # Centralized Architecture & Algorithm Documentation
│   ├── Finexa_AI_Modules_Description_Report.pdf
│   ├── Finexa_AI_Modules_Description_Report.md
│   ├── GWO_Evaluation_and_Accuracy_Report.pdf
│   └── GWO_Technical_Report.pdf
│
├── convert_reports.py                   # Automated Markdown-to-PDF/DOCX/HTML Converter
└── README.md                            # Main Project Documentation
```

---

## ⚡ Quickstart Guide

### 1. Prerequisites
* **Node.js** v18.0 or higher
* **Python** 3.9+ with `numpy`, `scipy`, `scikit-learn`
* **Git**

### 2. Backend Setup
```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env

# Start development server
npm run dev
```

### 3. Frontend Setup
```bash
# In a separate terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

Platform will be live at `http://localhost:5173`.

---

## 🌐 API Reference Matrix

| Method | Endpoint | Description | Controller |
|---|---|---|---|
| `POST` | `/api/gwo/optimize` | Executes Multi-Asset Grey Wolf Optimization | `gwoController.js` |
| `POST` | `/api/chat/message` | Groq LLM streaming chat with financial reasoning | `chatController.js` |
| `GET` | `/api/explore/news` | Curated, anti-noise financial news stream | `exploreController.js` |
| `GET` | `/api/explore/pulse` | Global benchmark movements & volume metrics | `exploreController.js` |
| `POST` | `/api/bi/analytics` | Calculates EBITDA, margins, and cash burn | `biController.js` |
| `POST` | `/api/travel/plan` | Autonomous travel budget allocation | `travelController.js` |
| `GET` | `/api/health` | Service discovery and gateway health check | `server.js` |

---

## 🚀 Production Deployment

### Backend (Render / Railway / AWS ECS)
1. Set Root Directory to `backend`
2. Build Command: `npm install`
3. Start Command: `npm start`
4. Set Environment Variables: `GROQ_API_KEY`, `PEXELS_API_KEY`, `NEWS_API_KEY`, `PORT=5000`

### Frontend (Vercel / Netlify / Cloudflare Pages)
1. Set Root Directory to `frontend`
2. Framework Preset: `Vite`
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Environment Variable: `VITE_API_BASE_URL=https://your-backend-domain.com/api`

---

## 📜 Official Reports & Whitepapers

All official technical specifications and benchmark evaluations are available in the [`Reports/`](./Reports) directory:
* 📄 [**FINEXA AI Modules Specification & Architecture Report**](./Reports/Finexa_AI_Modules_Description_Report.md) ([PDF](./Reports/Finexa_AI_Modules_Description_Report.pdf) | [DOCX](./Reports/Finexa_AI_Modules_Description_Report.docx))
* 📄 [**GWO Algorithm Optimization & Technical Report**](./Reports/GWO_Technical_Report.md) ([PDF](./Reports/GWO_Technical_Report.pdf))
* 📄 [**GWO Statistical Accuracy & Benchmark Evaluation**](./Reports/GWO_Evaluation_and_Accuracy_Report.md) ([PDF](./Reports/GWO_Evaluation_and_Accuracy_Report.pdf))

---

<div align="center">

**Built with precision for the future of Autonomous Financial Intelligence.**  
© 2026 FINEXA AI Systems • Confidential Technical Ecosystem

</div>
