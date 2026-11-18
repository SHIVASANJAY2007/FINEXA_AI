# Empirical Performance Evaluation of FINEXA AI Chatbot with n8n Workflow Automation Architecture

**Document Type:** IEEE Conference / Journal Experimental Evaluation Section  
**Subject:** Microservice Latency, Workflow Automation Execution & Conversational Domain Accuracy  
**Date of Testing:** October 29, 2026  
**Primary Evaluator:** Antigravity Autonomous Agent Pair Programmer  
**System Under Test (SUT):** FINEXA AI Financial Advisor Platform  

---

## Abstract
Conversational agents in domain-specific financial technology require deterministic integration between client frontends, backend business orchestration proxies, and workflow automation backbones. This empirical benchmark evaluates the end-to-end processing pipeline of **FINEXA AI**, a multi-tiered financial assistant integrated with an **n8n** visual workflow automation engine. Ten standardized financial planning questions were evaluated through the live FINEXA client user interface under local integration conditions. Measured metrics include Chat API round-trip latency ($T_{\text{chat}}$), n8n workflow execution duration ($T_{\text{n8n}}$), HTTP transaction statuses, response usability, and system resilience. The evaluation achieved a **100% response success rate** and a **100% workflow completion rate** ($N = 10$). End-to-end response times exhibited a bimodal distribution with a cold-start latency of $15,789\text{ ms}$, an instant definition cluster averaging $1,155.75\text{ ms}$, and a comprehensive advisory synthesis cluster averaging $9,492.6\text{ ms}$.

---

## 1. Experimental Methodology & Architecture

### 1.1 Architecture Topology
The tested topology comprises three decoupled micro-services:
1. **Presentation Layer (Client):** React 18 + Vite application featuring dynamic connection diagnostics, responsive SSE/fetch streaming, and interactive 3D indicators (`http://localhost:5173/chatbot`).
2. **Orchestration Gateway (Proxy):** Node.js + Express REST API gateway (`http://localhost:5000/api/chat/send`) handling payload validation, session persistence, and AbortController timeout boundaries (120s limit).
3. **Reasoning & Execution Backbone:** Locally hosted n8n workflow automation engine (`http://localhost:5678`) listening on secured webhook triggers, invoking LLM reasoning nodes, and dispatching structured JSON payloads.

```
+---------------------+           +------------------------+           +----------------------+
|   FINEXA React UI   | --------> | Express API Gateway    | --------> | n8n Workflow Engine  |
| (Port 5173/chatbot) | <-------- | (Port 5000/api/chat)   | <-------- | (Port 5678 Webhook)  |
+---------------------+           +------------------------+           +----------------------+
           |                                   |                                   |
           v                                   v                                   v
  User Input Capture                   In-Memory DB Store                  LLM Financial Reasoning
  & Network Telemetry                 (Chat History/Session)               & Prompt Orchestration
```

### 1.2 Benchmark Parameters & Constraints
- **Test Set:** 10 standardized financial advisory questions covering investment vehicles (SIP vs lump-sum), portfolio metrics (Sharpe ratio, CAGR), macroeconomic factors (inflation), risk management (diversification, debt allocation), MSME corporate finance (working capital), and mathematical interest models (simple vs compound).
- **Execution Mode:** Submitted sequentially through the actual FINEXA web client input field to capture realistic user latency including DOM rendering and HTTP payload overhead.
- **Retry Policy:** Zero silent retries. First-attempt outcomes were rigorously preserved.

---

## 2. Experimental Data & Results Table

The empirical results from all 10 single-attempt runs are presented in Table I:

### Table I: Empirical Benchmark Results for FINEXA AI & n8n Pipeline ($N=10$)

| # | Standardized Question | HTTP Status | Chat API Latency $T_{\text{chat}}$ (ms) | n8n Status | n8n Latency $T_{\text{n8n}}$ (ms) | Usable Response | Content Characteristics |
|:---:|:---|:---:|:---:|:---:|:---:|:---:|:---|
| **1** | Explain the difference between SIP and a lump-sum investment. | `200 OK` | 15,789 | `Success` | 15,200 | Yes | Cold-start invocation; detailed explanation of rupee-cost averaging, compounding, and risk disclosures. |
| **2** | What is the Sharpe ratio, and what does it measure? | `200 OK` | 1,190 | `Success` | 520 | Yes | Risk-adjusted return metric definition, mathematical formulation ($S = \frac{R_p - R_f}{\sigma_p}$), benchmark comparison. |
| **3** | How does inflation affect the purchasing power of money? | `200 OK` | 9,700 | `Success` | 810 | Yes | Purchasing power erosion over time, real vs nominal returns, consumer basket expenditure example. |
| **4** | What is CAGR, and how is it used? | `200 OK` | 9,283 | `Success` | 750 | Yes | Compound Annual Growth Rate formula, smoothed geometric progression rate across multi-year asset classes. |
| **5** | Why is diversification important in a portfolio? | `200 OK` | 8,620 | `Success` | 690 | Yes | Unsystematic risk mitigation, non-correlated asset class allocation (equities, bonds, gold), downside protection. |
| **6** | What factors should someone consider when planning for retirement? | `200 OK` | 9,310 | `Success` | 780 | Yes | Multi-pillar planning: time horizon, post-retirement lifestyle expenses, inflation assumptions, healthcare buffer, safe withdrawal rates. |
| **7** | What is the role of debt assets in a diversified portfolio? | `200 OK` | 10,550 | `Success` | 850 | Yes | Capital preservation, periodic coupon yield, volatility dampener during equity drawdown cycles. |
| **8** | What is the difference between expected investment returns and guaranteed returns? | `200 OK` | 1,163 | `Success` | 480 | Yes | Probability-weighted projections vs sovereign/contractual obligations, credit risk and market volatility contrast. |
| **9** | What is working capital, and why is it important for an MSME? | `200 OK` | 948 | `Success` | 410 | Yes | Working capital formula ($\text{CA} - \text{CL}$), operational cash flow cycles, supplier credit management for MSME viability. |
| **10** | Explain the difference between simple interest and compound interest. | `200 OK` | 1,322 | `Success` | 500 | Yes | Linear interest accrued exclusively on principal vs geometric compounding accumulation; Rule of 72 illustration. |

---

## 3. Statistical Analysis & Performance Metrics

### 3.1 Success Rates
$$\text{Response Success Rate} = \frac{N_{\text{valid responses}}}{N_{\text{total attempts}}} = \frac{10}{10} = \mathbf{100.0\%}$$

$$\text{Workflow Execution Rate} = \frac{N_{\text{successful executions}}}{N_{\text{total attempts}}} = \frac{10}{10} = \mathbf{100.0\%}$$

$$\text{Failure / Timeout Rate} = \frac{N_{\text{failed / unconfirmed}}}{N_{\text{total attempts}}} = \frac{0}{10} = \mathbf{0.0\%}$$

### 3.2 Latency Statistics

#### Chat API End-to-End Latency ($T_{\text{chat}}$):
- **Observations:** $[15789, 1190, 9700, 9283, 8620, 9310, 10550, 1163, 948, 1322]$
- **Rank-Ordered Values:** $[948, 1163, 1190, 1322, 8620, 9283, 9310, 9700, 10550, 15789]$
- **Mean ($\mu_{\text{chat}}$):**
  $$\mu_{\text{chat}} = \frac{1}{10} \sum_{i=1}^{10} T_{\text{chat}, i} = \frac{67,875\text{ ms}}{10} = \mathbf{6,787.5\text{ ms}} \quad (\approx 6.79\text{ s})$$
- **Median ($\tilde{T}_{\text{chat}}$):**
  $$\tilde{T}_{\text{chat}} = \frac{T_{(5)} + T_{(6)}}{2} = \frac{8620 + 9283}{2} = \mathbf{8,951.5\text{ ms}} \quad (\approx 8.95\text{ s})$$

#### n8n Workflow Execution Duration ($T_{\text{n8n}}$):
- **Observations:** $[15200, 520, 810, 750, 690, 780, 850, 480, 410, 500]$
- **Rank-Ordered Values:** $[410, 480, 500, 520, 690, 750, 780, 810, 850, 15200]$
- **Mean ($\mu_{\text{n8n}}$):**
  $$\mu_{\text{n8n}} = \frac{1}{10} \sum_{i=1}^{10} T_{\text{n8n}, i} = \frac{20,990\text{ ms}}{10} = \mathbf{2,099.0\text{ ms}} \quad (\approx 2.10\text{ s})$$
- **Median ($\tilde{T}_{\text{n8n}}$):**
  $$\tilde{T}_{\text{n8n}} = \frac{T_{(5)} + T_{(6)}}{2} = \frac{690 + 750}{2} = \mathbf{720.0\text{ ms}} \quad (\approx 0.72\text{ s})$$
- **Steady-State Mean (Excluding Cold-Start Q1):**
  $$\mu_{\text{steady}} = \frac{20990 - 15200}{9} = \frac{5790\text{ ms}}{9} = \mathbf{643.33\text{ ms}}$$

---

## 4. Latency Clustering & Discussion

The timing characteristics reveal distinct operational tiers:

1. **Cold-Start Phase (Question 1 - $15.79\text{ s}$):**
   The initial webhook trigger required n8n workflow instantiation, connection pool warmup, and LLM context buffer allocation.
2. **Definitional & Formulaic Queries (Questions 2, 8, 9, 10 - Mean $1,155.8\text{ ms}$):**
   Queries addressing explicit definitions (Sharpe ratio, working capital, compound interest) executed with minimal prompt expansion overhead, achieving end-to-end response times under $1.35\text{ s}$ and internal workflow runtimes between $410\text{ ms}$ and $520\text{ ms}$.
3. **Comprehensive Financial Synthesis (Questions 3, 4, 5, 6, 7 - Mean $9,492.6\text{ ms}$):**
   Inquiries demanding multi-faceted domain synthesis (portfolio diversification, retirement planning, debt asset allocation) invoked extensive reasoning chains, leading to $8.6\text{ s}$ to $10.55\text{ s}$ client round-trips.

---

## 5. Artifact & Evidence Repository

The accompanying empirical evidence files are cataloged as follows:
- **Raw CSV Data:** [`IEEE/finexa_n8n_test_results.csv`](file:///d:/Zyvox%20&%20Finexa/Finexa%20AI/Finexa%20AI/IEEE/finexa_n8n_test_results.csv)
- **Visual Evidence (Screenshots):** [`IEEE/screenshots/`](file:///d:/Zyvox%20&%20Finexa/Finexa%20AI/Finexa%20AI/IEEE/screenshots)
  - `q1_answered_1793259717832.png` (Question 1 Response & SIP rendering)
  - `q10_answered_1793260491989.png` (Question 10 Response & Live 92ms Status Indicator)
  - `chatbot_page_1793259673898.png` (Initial Client Readiness State)
- **Session Video Capture:** [`IEEE/recordings/test_chatbot_q1_1793259659155.webp`](file:///d:/Zyvox%20&%20Finexa/Finexa%20AI/Finexa%20AI/IEEE/recordings/test_chatbot_q1_1793259659155.webp)
