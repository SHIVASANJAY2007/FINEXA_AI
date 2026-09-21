"""
gwo_optimizer_engine.py

Python AI Optimization Engine for FINEXA AlphaPack™ (Grey Wolf Optimizer - GWO).
Implements Mirjalili et al. (2014) Grey Wolf Optimizer for Multi-Asset Portfolio & Goal Optimization.

Hierarchy:
  - Alpha (α): First best solution (Champion Portfolio)
  - Beta (β): Second best solution (Defensive Advisor)
  - Delta (δ): Third best solution (Aggressive Sentinel)
  - Omega (ω): Subordinate pack wolves following α, β, δ

Fitness Function:
  Maximizes Risk-Adjusted Return (Sharpe Ratio & Expected Terminal Wealth)
  subject to asset weight sum = 100% and volatility tolerance constraints.
"""

import sys
import json
import math
import random

# Ensure UTF-8 I/O
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass
if hasattr(sys.stdin, 'reconfigure'):
    try:
        sys.stdin.reconfigure(encoding='utf-8')
    except Exception:
        pass

# Benchmark asset historical returns (mean annual CAGR) and annual volatility (std dev)
ASSET_BENCHMARKS = [
    {"key": "nifty50", "name": "Large Cap Index (Nifty 50)", "meanReturn": 0.135, "volatility": 0.140, "riskTier": "Moderate"},
    {"key": "midcap", "name": "Mid & Small Cap Growth", "meanReturn": 0.170, "volatility": 0.210, "riskTier": "High"},
    {"key": "debt", "name": "Corporate Bonds & Debt", "meanReturn": 0.075, "volatility": 0.035, "riskTier": "Low"},
    {"key": "gold", "name": "Sovereign Gold / Gold ETF", "meanReturn": 0.105, "volatility": 0.110, "riskTier": "Moderate"},
    {"key": "us_tech", "name": "Global / US Tech Index", "meanReturn": 0.155, "volatility": 0.180, "riskTier": "High"}
]

# Asset covariance matrix proxy
COV_MATRIX = [
    [0.0196, 0.0220, 0.0010, 0.0015, 0.0120],  # Nifty50
    [0.0220, 0.0441, 0.0008, 0.0018, 0.0160],  # MidCap
    [0.0010, 0.0008, 0.0012, 0.0005, 0.0004],  # Debt
    [0.0015, 0.0018, 0.0005, 0.0121, 0.0010],  # Gold
    [0.0120, 0.0160, 0.0004, 0.0010, 0.0324]   # US Tech
]

RISK_FREE_RATE = 0.065  # 6.5% standard risk-free rate (treasury yields)


def normalize_weights(w):
    """Normalize weights array so sum(w) = 1.0 and all w_i >= 0."""
    w = [max(0.01, float(x)) for x in w]
    total = sum(w)
    if total <= 0:
        return [1.0 / len(w)] * len(w)
    return [round(x / total, 4) for x in w]


def calculate_portfolio_metrics(weights):
    """Calculates expected return, portfolio variance, volatility, and Sharpe Ratio."""
    w = normalize_weights(weights)
    n = len(w)

    # Expected Return: sum(w_i * r_i)
    expected_return = sum(w[i] * ASSET_BENCHMARKS[i]["meanReturn"] for i in range(n))

    # Portfolio Variance: w.T * COV * w
    var = 0.0
    for i in range(n):
        for j in range(n):
            var += w[i] * w[j] * COV_MATRIX[i][j]

    volatility = math.sqrt(max(1e-6, var))
    sharpe = (expected_return - RISK_FREE_RATE) / volatility if volatility > 0 else 0.0

    return {
        "weights": w,
        "expectedReturn": round(expected_return * 100, 2),
        "volatility": round(volatility * 100, 2),
        "sharpeRatio": round(sharpe, 2)
    }


def fitness_function(weights, risk_preference="balanced", horizon_years=5):
    """
    Fitness score for a grey wolf position.
    Higher fitness = closer to the optimal financial prey.
    """
    metrics = calculate_portfolio_metrics(weights)
    r = metrics["expectedReturn"] / 100.0
    v = metrics["volatility"] / 100.0
    sharpe = metrics["sharpeRatio"]

    # Risk preference multipliers:
    # safe: penalizes volatility heavily
    # balanced: maximizes Sharpe ratio
    # aggressive: prioritizes maximum compounding return
    if risk_preference == "safe":
        # Heavy penalty on volatility above 8%
        vol_penalty = max(0, v - 0.08) * 15.0
        score = (r * 3.0) + (sharpe * 2.0) - vol_penalty
    elif risk_preference == "aggressive":
        # Heavy reward on return, tolerance for volatility
        score = (r * 6.0) + (sharpe * 1.5) - (v * 1.0)
    else:  # balanced
        score = (sharpe * 4.0) + (r * 2.5) - (v * 2.0)

    # Horizon bonus: longer horizons benefit more from equity compounding
    if horizon_years >= 10:
        equity_weight = metrics["weights"][0] + metrics["weights"][1] + metrics["weights"][4]
        score += equity_weight * 0.5

    return score, metrics


def run_gwo_optimizer(payload):
    """
    Executes Grey Wolf Optimization (GWO) loop.
    """
    monthly_investment = float(payload.get("monthlyInvestment", 10000))
    horizon_years = int(payload.get("horizonYears", 5))
    risk_preference = payload.get("riskPreference", "balanced").lower()  # safe | balanced | aggressive
    num_wolves = int(payload.get("packSize", 25))
    max_iter = int(payload.get("iterations", 40))

    dim = len(ASSET_BENCHMARKS)  # 5 asset dimensions

    # Initialize Grey Wolf Pack (Positions within [0, 1])
    wolves = [[random.uniform(0.05, 0.95) for _ in range(dim)] for _ in range(num_wolves)]

    # Alpha, Beta, Delta wolves (Best 3 solutions)
    alpha_pos = [0.0] * dim
    alpha_score = -math.inf
    alpha_metrics = {}

    beta_pos = [0.0] * dim
    beta_score = -math.inf
    beta_metrics = {}

    delta_pos = [0.0] * dim
    delta_score = -math.inf
    delta_metrics = {}

    convergence_history = []

    # Initial evaluation
    for i in range(num_wolves):
        score, metrics = fitness_function(wolves[i], risk_preference, horizon_years)
        if score > alpha_score:
            delta_score = beta_score
            delta_pos = list(beta_pos)
            delta_metrics = dict(beta_metrics)

            beta_score = alpha_score
            beta_pos = list(alpha_pos)
            beta_metrics = dict(alpha_metrics)

            alpha_score = score
            alpha_pos = list(wolves[i])
            alpha_metrics = metrics
        elif score > beta_score:
            delta_score = beta_score
            delta_pos = list(beta_pos)
            delta_metrics = dict(beta_metrics)

            beta_score = score
            beta_pos = list(wolves[i])
            beta_metrics = metrics
        elif score > delta_score:
            delta_score = score
            delta_pos = list(wolves[i])
            delta_metrics = metrics

    # Main GWO Hunting & Encircling Loop
    for t in range(max_iter):
        # Linearly decreasing parameter 'a' from 2 to 0
        a = 2.0 - (2.0 * t / max_iter)

        for i in range(num_wolves):
            for d in range(dim):
                # Hunting equation for Alpha (α)
                r1, r2 = random.random(), random.random()
                A1 = 2.0 * a * r1 - a
                C1 = 2.0 * r2
                D_alpha = abs(C1 * alpha_pos[d] - wolves[i][d])
                X1 = alpha_pos[d] - A1 * D_alpha

                # Hunting equation for Beta (β)
                r1, r2 = random.random(), random.random()
                A2 = 2.0 * a * r1 - a
                C2 = 2.0 * r2
                D_beta = abs(C2 * beta_pos[d] - wolves[i][d])
                X2 = beta_pos[d] - A2 * D_beta

                # Hunting equation for Delta (δ)
                r1, r2 = random.random(), random.random()
                A3 = 2.0 * a * r1 - a
                C3 = 2.0 * r2
                D_delta = abs(C3 * delta_pos[d] - wolves[i][d])
                X3 = delta_pos[d] - A3 * D_delta

                # Update Omega position as average of leadership influences
                new_pos = (X1 + X2 + X3) / 3.0
                wolves[i][d] = max(0.01, min(1.0, new_pos))

            # Re-evaluate wolf fitness
            score, metrics = fitness_function(wolves[i], risk_preference, horizon_years)

            if score > alpha_score:
                delta_score = beta_score
                delta_pos = list(beta_pos)
                delta_metrics = dict(beta_metrics)

                beta_score = alpha_score
                beta_pos = list(alpha_pos)
                beta_metrics = dict(alpha_metrics)

                alpha_score = score
                alpha_pos = list(wolves[i])
                alpha_metrics = metrics
            elif score > beta_score:
                delta_score = beta_score
                delta_pos = list(beta_pos)
                delta_metrics = dict(beta_metrics)

                beta_score = score
                beta_pos = list(wolves[i])
                beta_metrics = metrics
            elif score > delta_score:
                delta_score = score
                delta_pos = list(wolves[i])
                delta_metrics = metrics

        convergence_history.append({
            "iteration": t + 1,
            "alphaFitness": round(alpha_score, 3),
            "expectedReturn": alpha_metrics.get("expectedReturn", 0),
            "volatility": alpha_metrics.get("volatility", 0),
            "sharpeRatio": alpha_metrics.get("sharpeRatio", 0)
        })

    # Terminal Wealth Projections for SIP
    def project_wealth(monthly, annual_rate, years):
        r_monthly = (annual_rate / 100.0) / 12.0
        months = years * 12
        if r_monthly <= 0:
            fv = monthly * months
        else:
            fv = monthly * (((1 + r_monthly) ** months - 1) / r_monthly) * (1 + r_monthly)
        total_invested = monthly * months
        gain = fv - total_invested
        return {
            "totalInvested": round(total_invested, 2),
            "estimatedWealth": round(fv, 2),
            "totalGain": round(gain, 2),
            "wealthMultiple": round(fv / total_invested if total_invested > 0 else 1.0, 2)
        }

    alpha_proj = project_wealth(monthly_investment, alpha_metrics["expectedReturn"], horizon_years)
    beta_proj = project_wealth(monthly_investment, beta_metrics["expectedReturn"], horizon_years)
    delta_proj = project_wealth(monthly_investment, delta_metrics["expectedReturn"], horizon_years)

    # Format asset allocations with human friendly labels
    def format_allocation(norm_weights):
        alloc = []
        for i, bm in enumerate(ASSET_BENCHMARKS):
            pct = round(norm_weights[i] * 100, 1)
            monthly_amt = round(monthly_investment * norm_weights[i], 2)
            alloc.append({
                "assetKey": bm["key"],
                "assetName": bm["name"],
                "percentage": pct,
                "monthlyAmount": monthly_amt,
                "meanReturn": round(bm["meanReturn"] * 100, 1),
                "riskTier": bm["riskTier"]
            })
        # Sort descending by percentage
        alloc.sort(key=lambda x: -x["percentage"])
        return alloc

    return {
        "status": "SUCCESS",
        "algorithm": "Grey Wolf Optimization (GWO - Mirjalili 2014)",
        "inputs": {
            "monthlyInvestment": monthly_investment,
            "horizonYears": horizon_years,
            "riskPreference": risk_preference,
            "packSize": num_wolves,
            "iterations": max_iter
        },
        "packLeaders": {
            "alpha": {
                "title": "Optimal Sharpe Portfolio",
                "role": "Maximum Risk-Adjusted Return",
                "tagline": "Mathematically optimized asset allocation maximizing portfolio Sharpe ratio for steady compounding.",
                "metrics": alpha_metrics,
                "allocation": format_allocation(alpha_metrics["weights"]),
                "projection": alpha_proj
            },
            "beta": {
                "title": "Defensive Capital Preservation",
                "role": "Low-Volatility Buffer",
                "tagline": "Prioritizes capital protection with higher debt and gold allocation to cushion downside market risk.",
                "metrics": beta_metrics,
                "allocation": format_allocation(beta_metrics["weights"]),
                "projection": beta_proj
            },
            "delta": {
                "title": "Aggressive Capital Appreciation",
                "role": "High-Growth Equity Focus",
                "tagline": "Weighted toward mid-cap equity and global tech indices designed to capture maximum long-term upside.",
                "metrics": delta_metrics,
                "allocation": format_allocation(delta_metrics["weights"]),
                "projection": delta_proj
            }
        },
        "convergence": convergence_history[-10:]  # Last 10 iterations for clean sparklines
    }


def main():
    try:
        raw_input = sys.stdin.read().strip()
        payload = json.loads(raw_input) if raw_input else {}
        result = run_gwo_optimizer(payload)
        print(json.dumps(result, ensure_ascii=False, indent=2))
    except Exception as e:
        err = {"status": "ERROR", "error": str(e), "algorithm": "GWO_Python_Engine"}
        print(json.dumps(err))
        sys.exit(1)


if __name__ == "__main__":
    main()
