# 🏛️ FINEXA AI — Comprehensive Modules Specification & System Architecture Report

> **Confidential Document** | Version 2.4 | Enterprise System Specification  
> **Platform:** FINEXA AI (Autonomous Financial Intelligence & Portfolio Optimization Platform)  
> **Environment:** Staging / Production Architecture  
> **Generated:** September 19, 2026

---

## 📌 Executive Summary

**FINEXA AI** is a next-generation autonomous financial intelligence and portfolio optimization platform. Architected to bridge sophisticated quantitative finance algorithms with frictionless user interfaces, FINEXA AI provides retail investors, wealth managers, and corporate analysts with institutional-grade computational tools.

The system combines metaheuristic multi-asset optimization (AlphaPack Grey Wolf Optimizer), conversational large language model orchestration (Groq LLM streaming with rich multi-modal component rendering), live market intelligence harvesting, full-suite actuarial calculators, interactive business intelligence analytics, and an interactive gamified financial academy.

```
                                  ┌─────────────────────────────────────────────────────────────┐
                                  │                      FINEXA AI CLIENT                       │
                                  │      (React 18 + Vite + TailwindCSS + Motion + GSAP)        │
                                  └──────────────────────────────┬──────────────────────────────┘
                                                                 │
                                          HTTPS / REST / SSE / WebSocket IPC
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
     │  (GWO Metaheuristic Pack) │        │ (Llama 3.3 70B)  │ │ Feeds (4 APIs) │          │     Analytics Engines     │
     └───────────────────────────┘        └──────────────────┘ └────────────────┘          └───────────────────────────┘
```

---

## 📑 Complete System Modules Inventory

| # | Module Name | Primary Domain | Core Technologies | Directory / Key Files |
|---|---|---|---|---|
| **1** | **AlphaPack Grey Wolf Optimizer (GWO)** | Quantitative Portfolio Allocation | Python, NumPy, SciPy, React, Lucide | [`backend/ai/gwo_optimizer_engine.py`](file:///d:/Zyvox%20&%20Finexa/Finexa%20AI/Finexa%20AI/backend/ai/gwo_optimizer_engine.py)<br>[`frontend/src/components/GWO/GreyWolfOptimizer.jsx`](file:///d:/Zyvox%20&%20Finexa/Finexa%20AI/Finexa%20AI/frontend/src/components/GWO/GreyWolfOptimizer.jsx) |
| **2** | **Conversational AI & Response Engine** | LLM Financial Companion | Groq API, Node.js, React, Recharts | [`backend/controllers/chatController.js`](file:///d:/Zyvox%20&%20Finexa/Finexa%20AI/Finexa%20AI/backend/controllers/chatController.js)<br>[`frontend/src/components/Chatbot.jsx`](file:///d:/Zyvox%20&%20Finexa/Finexa%20AI/Finexa%20AI/frontend/src/components/Chatbot.jsx)<br>[`frontend/src/components/ResponseRenderer.jsx`](file:///d:/Zyvox%20&%20Finexa/Finexa%20AI/Finexa%20AI/frontend/src/components/ResponseRenderer.jsx) |
| **3** | **Explore & Market Intelligence Hub** | Real-Time News & Market Discovery | Axios, Cheerio, Pexels API, React | [`backend/services/exploreService.js`](file:///d:/Zyvox%20&%20Finexa/Finexa%20AI/Finexa%20AI/backend/services/exploreService.js)<br>[`frontend/src/components/Explore/Explore.jsx`](file:///d:/Zyvox%20&%20Finexa/Finexa%20AI/Finexa%20AI/frontend/src/components/Explore/Explore.jsx) |
| **4** | **Business Intelligence Studio** | Corporate Analytics & Forecasting | React, Recharts, Lucide, Canvas | [`backend/controllers/biController.js`](file:///d:/Zyvox%20&%20Finexa/Finexa%20AI/Finexa%20AI/backend/controllers/biController.js)<br>[`frontend/src/components/BusinessIntelligence/BusinessIntelligence.jsx`](file:///d:/Zyvox%20&%20Finexa/Finexa%20AI/Finexa%20AI/frontend/src/components/BusinessIntelligence/BusinessIntelligence.jsx) |
| **5** | **Financial Calculator Suite** | Actuarial & Tax Calculations | JavaScript ES6 Modules, Recharts | [`frontend/src/components/Calculator/Calculator.jsx`](file:///d:/Zyvox%20&%20Finexa/Finexa%20AI/Finexa%20AI/frontend/src/components/Calculator/Calculator.jsx)<br>[`frontend/src/components/Calculator/calculations/`](file:///d:/Zyvox%20&%20Finexa/Finexa%20AI/Finexa%20AI/frontend/src/components/Calculator/calculations) (10 engines) |
| **6** | **Learn & Earn Academy** | Gamified FinTech Education & Certs | React, HTML5 Canvas 2D, Framer Motion | [`frontend/src/components/LearnEarn/LearnEarn.jsx`](file:///d:/Zyvox%20&%20Finexa/Finexa%20AI/Finexa%20AI/frontend/src/components/LearnEarn/LearnEarn.jsx)<br>[`frontend/src/components/LearnEarn/CertificateModal.jsx`](file:///d:/Zyvox%20&%20Finexa/Finexa%20AI/Finexa%20AI/frontend/src/components/LearnEarn/CertificateModal.jsx) |
| **7** | **Authentication & User Identity** | Security & Profile Management | Clerk SDK, JWT, Express Auth | [`backend/controllers/authController.js`](file:///d:/Zyvox%20&%20Finexa/Finexa%20AI/Finexa%20AI/backend/controllers/authController.js)<br>[`frontend/src/components/SignUp.jsx`](file:///d:/Zyvox%20&%20Finexa/Finexa%20AI/Finexa%20AI/frontend/src/components/SignUp.jsx) |
| **8** | **Travel & Lifestyle Expense Optimizer** | Budget & Itinerary Planning | Express Controller, React Visualizer | [`backend/controllers/travelController.js`](file:///d:/Zyvox%20&%20Finexa/Finexa%20AI/Finexa%20AI/backend/controllers/travelController.js)<br>[`frontend/src/components/ResponseRenderer.jsx`](file:///d:/Zyvox%20&%20Finexa/Finexa%20AI/Finexa%20AI/frontend/src/components/ResponseRenderer.jsx) |
| **9** | **UI/UX Design & Brand System** | High-Aesthetic Luxury Presentation | Tailwind CSS, Framer Motion, GSAP | [`frontend/src/components/LandingPage.jsx`](file:///d:/Zyvox%20&%20Finexa/Finexa%20AI/Finexa%20AI/frontend/src/components/LandingPage.jsx)<br>[`frontend/src/components/ui/GlobalMenu.jsx`](file:///d:/Zyvox%20&%20Finexa/Finexa%20AI/Finexa%20AI/frontend/src/components/ui/GlobalMenu.jsx)<br>[`frontend/src/components/ui/FlowingMenuPage.jsx`](file:///d:/Zyvox%20&%20Finexa/Finexa%20AI/Finexa%20AI/frontend/src/components/ui/FlowingMenuPage.jsx) |

---

## 🔬 Detailed Module Specifications

---

### Module 1: AlphaPack Grey Wolf Optimizer (GWO) AI Engine

#### 1.1 Purpose & Domain
The **AlphaPack Grey Wolf Optimizer** is a bio-inspired metaheuristic multi-asset allocation engine that solves high-dimensional, non-convex portfolio optimization problems. Unlike standard Mean-Variance Optimization (Markowitz MPT) which suffers from extreme weight concentration and matrix instability, GWO models the social hierarchy ($\alpha, \beta, \delta, \omega$) and collective encircling hunting strategies of grey wolf packs in nature.

```
                                  ┌───────────────────────┐
                                  │      Alpha (α) Wolf   │  ← Best Solution Found (Highest Sharpe / Fitness)
                                  └───────────┬───────────┘
                                              │
                                  ┌───────────▼───────────┐
                                  │      Beta (β) Wolf    │  ← Second Best Solution (Secondary Guide)
                                  └───────────┬───────────┘
                                              │
                                  ┌───────────▼───────────┐
                                  │     Delta (δ) Wolf    │  ← Third Best Solution (Exploration Anchor)
                                  └───────────┬───────────┘
                                              │
                                  ┌───────────▼───────────┐
                                  │     Omega (ω) Wolves  │  ← Swarm Candidate Portfolios Updated Continuously
                                  └───────────────────────┘
```

#### 1.2 Mathematical Formulation
Each wolf represents an allocation vector $\vec{X}_i = [w_1, w_2, \dots, w_D]$ across $D$ distinct asset classes subject to the simplex constraint $\sum_{k=1}^D w_k = 1.0$ and individual asset bounds $w_k \in [0.03, 0.45]$.

1. **Encircling Equations:**
   $$\vec{D} = |\vec{C} \cdot \vec{X}_p(t) - \vec{X}(t)|$$
   $$\vec{X}(t+1) = \vec{X}_p(t) - \vec{A} \cdot \vec{D}$$
   where $\vec{A} = 2a \cdot \vec{r}_1 - a$ and $\vec{C} = 2 \cdot \vec{r}_2$, with $a$ linearly decaying from $2.0 \to 0.0$ over iterations $t \in [1, \text{MaxIter}]$.

2. **Hunting Update Equation:**
   $$\vec{X}_1 = \vec{X}_\alpha - \vec{A}_1 \cdot |\vec{C}_1 \vec{X}_\alpha - \vec{X}|, \quad \vec{X}_2 = \vec{X}_\beta - \vec{A}_2 \cdot |\vec{C}_2 \vec{X}_\beta - \vec{X}|, \quad \vec{X}_3 = \vec{X}_\delta - \vec{A}_3 \cdot |\vec{C}_3 \vec{X}_\delta - \vec{X}|$$
   $$\vec{X}(t+1) = \frac{\vec{X}_1 + \vec{X}_2 + \vec{X}_3}{3}$$

3. **Multi-Objective Fitness Function:**
   $$f(\vec{w}) = \lambda_1 \cdot \text{Sharpe}(\vec{w}) + \lambda_2 \cdot R_p(\vec{w}) - \lambda_3 \cdot \sigma_p(\vec{w}) - \text{Penalty}(\vec{w})$$
   where the penalty term enforces minimum asset diversification and eliminates single-asset dominance.

#### 1.3 Key Features & Deliverables
* **Multi-Asset Universe:** Large-cap equities, mid/small-cap growth equities, government & corporate debt bonds, physical/digital gold, international index equities, REITs, and liquid cash equivalents.
* **Interactive Frontend Cockpit:** Real-time animated pack convergence visualizer, dynamic asset distribution donut chart, risk-return scatter plots, Sharpe ratio speedometer, and scenario comparison against 1/N equal weight and standard index benchmarks.
* **Resilient IPC Pipeline:** Node.js child-process execution with JSON serialization and automatic analytical fallback in event of Python environment unavailability.

---

### Module 2: Conversational AI & Rich Multi-Modal Response Engine

#### 2.1 Purpose & Domain
The **Conversational AI Agent** acts as an autonomous financial advisor and analytical copilot. Built on top of high-throughput Groq cloud infrastructure (utilizing LLaMA 3.3 70B Versatile), the agent delivers low-latency streaming responses enriched with interactive UI components.

```
       User Message ──► Express Route ──► Prompt Engineering ──► Groq Cloud LLM Stream
                                                                        │
       Visual UI Cockpit ◄── ResponseRenderer ◄── Token Parser ◄────────┘
       (Charts / Tables / Meters / Itineraries / Action Cards)
```

#### 2.2 Rich Response Component Registry
Unlike generic markdown chat interfaces, the FINEXA **`ResponseRenderer`** dynamically intercepts formatted markers and renders institutional visual components:
* **Interactive Stock & Crypto Charts:** Candlestick simulations, line charts with interval toggles (1D, 1W, 1M, 1Y, ALL), moving averages, volume bars, and percentage gain pill indicators.
* **Financial Comparison Tables:** Dual-column asset comparisons, fee comparisons, risk-grade matrices, and feature parity grids.
* **Portfolio Allocation Cards:** Visual progress bars, sector distributions, and target percentage rebalancing meters.
* **Actionable Financial Widgets:** Quick-action buttons to launch specific calculators, load GWO optimizations, or view real-time market news.
* **Multi-Day Travel & Expense Itineraries:** Structured day-by-day expense breakdowns with category pills, hotel/flight estimates, and budget tracking meters.

---

### Module 3: Explore & Real-Time Market Intelligence Hub

#### 3.1 Purpose & Domain
The **Explore Hub** aggregates, categorizes, and filters live financial news and market pulses across global and Indian macroeconomic ecosystems. It provides users with noise-free, strictly financial intelligence.

```
  NewsAPI / Marketaux / GNews / RSS
                 │
                 ▼
  ┌──────────────────────────────────────────────┐
  │  Strict Relevance & Anti-Noise Filter Engine │  ← Rejects sports, gossip, war, entertainment
  └──────────────────────┬───────────────────────┘
                         │
                         ▼
  ┌──────────────────────────────────────────────┐
  │  Pexels Financial Asset Thumbnail Curation   │  ← Assigns verified high-res editorial imagery
  └──────────────────────┬───────────────────────┘
                         │
                         ▼
  ┌──────────────────────────────────────────────┐
  │      In-Memory Cache (5-Minute TTL)          │  ← Sub-10ms response latency
  └──────────────────────────────────────────────┘
```

#### 3.2 Key Heuristics & Filters
* **Strict Non-Financial Exclusion Engine:** Automatically discards non-economic topics (celebrity news, political scandals, entertainment, lifestyle, non-economic crime) using a 50+ keyword exclusion filter.
* **Sector Classification:** Categorizes articles into Banking, Information Technology, Energy & Commodities, Auto & Manufacturing, Pharma, Real Estate, and Mutual Funds.
* **Sentiment Tagging:** Real-time sentiment classification (Bullish / Neutral / Bearish) with visual color accents.
* **Market Pulse & Movers:** Live monitoring cards showing major benchmark movements (Nifty 50, Sensex, S&P 500, Nasdaq, Gold, Crude Oil) with volume and delta tracking.

---

### Module 4: Business Intelligence & Financial Analytics Studio

#### 4.1 Purpose & Domain
The **Business Intelligence (BI) Studio** is tailored for corporate treasurers, startup founders, and enterprise analysts. It processes enterprise cashflow data to generate predictive financial health dashboards, cash runway forecasts, and operational efficiency metrics.

```
       Raw Financial Ledger / Inputs
                     │
                     ▼
  ┌──────────────────────────────────────────────┐
  │           BI Calculation Engine              │
  │  • EBITDA & Operating Margins                │
  │  • Quick Ratio, Current Ratio, D/E           │
  │  • Linear Regression Cash Burn Runway        │
  │  • Variance & Seasonality Analysis           │
  └──────────────────────┬───────────────────────┘
                         │
                         ▼
  ┌──────────────────────────────────────────────┐
  │       Interactive Analytics Dashboard        │
  │  • Interactive Waterfall & Area Charts       │
  │  • Working Capital & Liquidity Gauges        │
  │  • Scenario Stress-Testing Sliders           │
  │  • Instant CSV Financial Report Export       │
  └──────────────────────────────────────────────┘
```

#### 4.2 Analytical Metrics & Visualizations
* **EBITDA & Profitability Waterfall:** Breakdown from Gross Revenue $\to$ COGS $\to$ Operating Expenses $\to$ EBITDA $\to$ Net Income.
* **Cash Burn & Runway Forecasting:** Predicts runway longevity in months under multiple hiring, revenue growth, and capital expenditure scenarios.
* **Liquidity & Solvency Health Meters:** Real-time gauges evaluating Quick Ratio ($> 1.0$), Current Ratio ($> 1.5$), and Debt-to-Equity thresholds.
* **One-Click Data Portability:** Export full analytics summaries into structured CSV spreadsheets for executive reporting.

---

### Module 5: Financial Calculator & Actuarial Suite

#### 5.1 Purpose & Domain
The **Financial Calculator Suite** includes 10 standalone actuarial and tax calculation engines designed to assist individuals with precision wealth planning.

```
                                 ┌──────────────────────────────┐
                                 │   FINANCIAL CALCULATOR HUB   │
                                 └──────────────┬───────────────┘
                                                │
         ┌──────────────┬──────────────┬────────┴─────┬──────────────┬──────────────┐
         ▼              ▼              ▼              ▼              ▼              ▼
     ┌───────┐     ┌─────────┐    ┌──────────┐   ┌─────────┐    ┌─────────┐    ┌──────────┐
     │  SIP  │     │ Step-Up │    │ Lumpsum  │   │   SWP   │    │  CAGR   │    │   IRR    │
     │  FV   │     │   SIP   │    │ Compound │   │ Deplete │    │ Growth  │    │  Newton  │
     └───────┘     └─────────┘    └──────────┘   └─────────┘    └─────────┘    └──────────┘
         │              │              │              │
         ▼              ▼              ▼              ▼
     ┌───────────┐ ┌─────────┐    ┌──────────┐   ┌───────────────┐
     │  Capital  │ │Inflation│    │   Goal   │   │  Retirement   │
     │ Gains Tax │ │ Decay   │    │ Velocity │   │ Life Expect   │
     └───────────┘ └─────────┘    └──────────┘   └───────────────┘
```

#### 5.2 Mathematical Engines Breakdown

| Engine | File Path | Core Formula / Algorithm | Key Output |
|---|---|---|---|
| **SIP Calculator** | [`sip.js`](file:///d:/Zyvox%20&%20Finexa/Finexa%20AI/Finexa%20AI/frontend/src/components/Calculator/calculations/sip.js) | $FV = P \times \frac{(1+i)^n - 1}{i} \times (1+i)$ | Total Invested, Wealth Gained, Future Value |
| **Step-Up SIP** | [`stepUpSip.js`](file:///d:/Zyvox%20&%20Finexa/Finexa%20AI/Finexa%20AI/frontend/src/components/Calculator/calculations/stepUpSip.js) | Annual stepped contribution increments | Compounded growth with salary escalation curves |
| **Lumpsum** | [`lumpsum.js`](file:///d:/Zyvox%20&%20Finexa/Finexa%20AI/Finexa%20AI/frontend/src/components/Calculator/calculations/lumpsum.js) | $A = P(1 + \frac{r}{n})^{nt}$ | Multi-year nominal vs inflation-adjusted gains |
| **SWP Calculator** | [`swp.js`](file:///d:/Zyvox%20&%20Finexa/Finexa%20AI/Finexa%20AI/frontend/src/components/Calculator/calculations/swp.js) | Monthly capital deduction with residual yields | Capital longevity horizon & total payouts |
| **CAGR Engine** | [`cagr.js`](file:///d:/Zyvox%20&%20Finexa/Finexa%20AI/Finexa%20AI/frontend/src/components/Calculator/calculations/cagr.js) | $\text{CAGR} = \left(\frac{V_{\text{final}}}{V_{\text{initial}}}\right)^{\frac{1}{t}} - 1$ | Annualized multi-period compounding yield |
| **IRR Engine** | [`irr.js`](file:///d:/Zyvox%20&%20Finexa/Finexa%20AI/Finexa%20AI/frontend/src/components/Calculator/calculations/irr.js) | $\sum_{t=0}^N \frac{C_t}{(1 + \text{IRR})^t} = 0$ via Newton-Raphson | Exact internal rate of return for irregular cashflows |
| **Capital Gains** | [`capitalGains.js`](file:///d:/Zyvox%20&%20Finexa/Finexa%20AI/Finexa%20AI/frontend/src/components/Calculator/calculations/capitalGains.js) | STCG / LTCG tax schedules across asset categories | Net post-tax proceeds & tax liability |
| **Inflation Decay** | [`inflation.js`](file:///d:/Zyvox%20&%20Finexa/Finexa%20AI/Finexa%20AI/frontend/src/components/Calculator/calculations/inflation.js) | $PV = \frac{FV}{(1 + r)^t}$ | Purchasing power erosion & future cost of living |
| **Goal Planner** | [`goalPlanner.js`](file:///d:/Zyvox%20&%20Finexa/Finexa%20AI/Finexa%20AI/frontend/src/components/Calculator/calculations/goalPlanner.js) | Reverse Future Value Annuity | Required monthly savings to achieve financial goal |
| **Retirement** | [`retirement.js`](file:///d:/Zyvox%20&%20Finexa/Finexa%20AI/Finexa%20AI/frontend/src/components/Calculator/calculations/retirement.js) | Actuarial post-retirement withdrawal modeling | Target retirement corpus & monthly annuity |

---

### Module 6: Learn & Earn Academy & Certification Subsystem

#### 6.1 Purpose & Domain
The **Learn & Earn Academy** democratizes complex financial engineering topics into interactive, gamified learning modules with instant quiz evaluations and verified credential generation.

```
  6 Advanced Modules ──► Dynamic Quiz Engine ──► Reward Engine ──► HTML5 Canvas Certificate Generator
  • Foundations          • 4 MCQs per Module     • Badges Awarded  • Custom Typography, Seal & Serial
  • Equity Valuation     • Score Validation      • Points Accrual  • 300 DPI High-Res Download (.PNG)
  • Charting & TA        • Immediate Feedback
  • Risk Management
  • DeFi & AMMs
  • Quant AI
```

#### 6.2 Key Features
* **Structured Curriculum:** 6 comprehensive courses covering personal finance budgeting, DCF valuation, technical indicators (RSI, MACD, Bollinger Bands), hedging strategies, automated market makers (AMMs), and algorithmic machine learning.
* **Interactive Assessment Engine:** Dynamic state management evaluating user answers, explaining mathematical rationales, and calculating module completion percentages.
* **Official Certificate Generator:** Custom HTML5 Canvas 2D renderer applying luxury typography, gold leaf gradient borders, FINEXA guilloché seal, user's dynamic name, completion timestamp, and a unique cryptographic serial identifier for credential validation.

---

### Module 7: Authentication & User Identity Subsystem

#### 7.1 Purpose & Domain
Provides secure user authentication, onboarding workflows, session state management, and profile customization using Clerk authentication integrations and Express authorization middlewares.

#### 7.2 Security Highlights
* Token validation on protected REST endpoints.
* Safe password and credential handling with zero storage of raw secrets.
* Flexible session hydration supporting both guest exploration and authenticated persistent profiles.

---

### Module 8: Travel & Lifestyle Expense Optimizer

#### 8.1 Purpose & Domain
An autonomous budgetary assistant focused on travel cost engineering. It accepts destination parameters, trip duration, traveler count, and comfort tiers to generate optimized budget allocations, multi-day itineraries, flight/accommodation estimates, and real-time currency conversions.

---

### Module 9: UI/UX Design System & Luxury Presentation Suite

#### 9.1 Aesthetic Token Architecture
FINEXA AI adheres to a luxury financial aesthetic inspired by Swiss typography and elite private banking interfaces:

```
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │                        FINEXA COLOR PALETTE TOKENS                          │
  ├──────────────────┬──────────────────┬──────────────────┬────────────────────┤
  │ Deep Burgundy    │ Antique Gold     │ Emerald Pine     │ Soft Warm Ivory    │
  │ #6B1E2B          │ #C9A227          │ #0B4F4A          │ #FDF6ED            │
  └──────────────────┴──────────────────┴──────────────────┴────────────────────┘
```

#### 9.2 Kinetic Interactive Components
* **Global Floating Menu:** High-performance overlay menu with smooth backdrop blur, marquee animations on hover, and seamless page transitions.
* **Sticky Scroll Reveal:** Dynamic narrative sections that unroll features sequentially as the user scrolls.
* **Decrypted & Encrypted Kinetic Text:** Hacker/quant-inspired kinetic text decoding effects upon viewport entry.
* **Responsive SVG Arc Gauges & Micro-Charts:** Custom vector graphics optimized for high frame-rate rendering across desktop, tablet, and mobile displays.

---

## 🌐 API Endpoint Specification Matrix

```
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 FINEXA BACKEND REST API                                       │
├─────────┬───────────────────────────────┬───────────────────────┬────────────────────────────┤
│ METHOD  │ ENDPOINT                      │ CONTROLLER            │ PURPOSE                    │
├─────────┼───────────────────────────────┼───────────────────────┼────────────────────────────┤
│ GET     │ /healthz                      │ inline                │ System health verification │
│ GET     │ /api/health                   │ inline                │ Service discovery status   │
│ POST    │ /api/gwo/optimize             │ gwoController         │ Multi-asset GWO simulation │
│ POST    │ /api/chat/message             │ chatController        │ Groq LLM streaming chat   │
│ GET     │ /api/explore/news             │ exploreController     │ Curated financial news feed│
│ GET     │ /api/explore/pulse            │ exploreController     │ Global market pulse data   │
│ POST    │ /api/bi/analytics             │ biController          │ Enterprise BI calculations │
│ POST    │ /api/travel/plan              │ travelController      │ Travel budget optimization │
│ POST    │ /api/auth/profile             │ authController        │ User session verification  │
│ GET     │ /api/pexels/curate            │ pexelsController      │ Contextual finance photos  │
└─────────┴───────────────────────────────┴───────────────────────┴────────────────────────────┘
```

---

## 🔒 Security, Reliability & Operational Best Practices

1. **Zero Raw Secret Exposure:** All API keys (Groq, Clerk, Pexels, News APIs) are strictly managed via environment variables and never logged or serialized to client responses.
2. **Graceful Subprocess Degradation:** The GWO quantitative optimizer features automatic fallback logic that guarantees API availability even during temporary Python runtime anomalies.
3. **Resilient Client Caching:** News and media assets utilize in-memory TTL caching layers to prevent third-party rate limits and maintain sub-15ms client page load times.
4. **Clean Layered Architecture:** Strict separation of concerns between Controller request parsing, Service domain logic, and Frontend presentation components.

---

*Report certified by FINEXA AI Engineering Systems • Document stored in [`Reports/`](file:///d:/Zyvox%20&%20Finexa/Finexa%20AI/Finexa%20AI/Reports).*
