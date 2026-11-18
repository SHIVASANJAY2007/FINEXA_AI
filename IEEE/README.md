# FINEXA AI & n8n IEEE Research Paper Package

This folder contains all artifacts, empirical measurements, high-resolution figures, LaTeX snippets, screenshots, video evidence, and datasets required for writing and submitting the IEEE research paper on the **FINEXA AI Chatbot & n8n Workflow Automation Architecture**.

---

## Directory Contents

| File / Folder | Description | Intended Use in Paper |
|---|---|---|
| [`finexa_n8n_test_results.csv`](./finexa_n8n_test_results.csv) | Raw dataset containing all 10 test inquiries, timings, HTTP statuses, and observations. | Supplementary dataset / Data availability section |
| [`latency_benchmark_figure.png`](./latency_benchmark_figure.png) | 300 DPI publication-quality comparative bar chart showing $T_{\text{chat}}$ vs $T_{\text{n8n}}$ across all 10 queries. | **Figure 1 / Figure 2 in Results section** |
| [`IEEE_RESEARCH_PAPER_BENCHMARK_REPORT.md`](./IEEE_RESEARCH_PAPER_BENCHMARK_REPORT.md) | Comprehensive markdown benchmark report containing executive summary, methodology, mathematical latency formulations, and discussion. | Complete draft reference for paper writing |
| [`IEEE_PAPER_SECTION_DRAFT.tex`](./IEEE_PAPER_SECTION_DRAFT.tex) | Ready-to-use LaTeX snippet formatted for the `IEEEtran` document class, including Table I and mathematical equations. | Copy-paste directly into your Overleaf / LaTeX manuscript |
| [`generate_charts.py`](./generate_charts.py) | Standalone Python script (Matplotlib) used to generate the IEEE publication figure. | Reproducibility & custom chart adjustments |
| [`screenshots/`](./screenshots/) | Folder containing 18 full-resolution screenshots taken during the live browser test session. | Visual evidence for system architecture & demo figures |
| [`recordings/`](./recordings/) | Full WebP session video recording capturing the live execution across questions. | Archival empirical validation & demo materials |

---

## Summary of Empirical Results

- **Total Invocations ($N$):** 10
- **Chatbot Response Success Rate:** **100.0%** ($10/10$)
- **n8n Workflow Execution Rate:** **100.0%** ($10/10$)
- **Failures / Dropouts / Timeouts:** **0.0%** ($0/10$)
- **Mean Chat API End-to-End Latency ($\mu_{\text{chat}}$):** **6,787.5 ms** (~6.79 s)
- **Median Chat API Latency ($\tilde{T}_{\text{chat}}$):** **8,951.5 ms** (~8.95 s)
- **Mean n8n Execution Duration ($\mu_{\text{n8n}}$):** **2,099.0 ms** (~2.10 s)
- **Median n8n Execution Duration ($\tilde{T}_{\text{n8n}}$):** **720.0 ms** (~0.72 s)
- **Warm Steady-State n8n Mean (Q2–Q10):** **643.3 ms** (~0.64 s)

---

## Key Screenshots Index

- [`screenshots/q1_answered_1793259717832.png`](./screenshots/q1_answered_1793259717832.png): Question 1 (SIP vs Lump-sum) with detailed response and risk disclaimers.
- [`screenshots/q10_answered_1793260491989.png`](./screenshots/q10_answered_1793260491989.png): Question 10 (Simple vs Compound Interest) with live connection pill showing `● n8n Connected (92ms)`.
- [`screenshots/chatbot_page_1793259673898.png`](./screenshots/chatbot_page_1793259673898.png): FINEXA AI chat interface and readiness state.

---

## How to Regenerate the Chart
If you make any changes to `finexa_n8n_test_results.csv`, re-run the chart generation script:
```bash
python generate_charts.py
```
This will automatically refresh `latency_benchmark_figure.png` with 300 DPI resolution.
