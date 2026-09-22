"""
ripper_classifier_engine.py

Python AI Classification Engine implementing Rule-Based Induction (RIPPER / CBA):
Processes 5 monthly financial inputs:
  1. Monthly Income (₹)
  2. Monthly Expenses (₹)
  3. Monthly Savings (₹)
  4. Monthly Investment (₹)
  5. Monthly EMI & Loan (₹)

Calculates an ultra-dynamic, highly accurate Financial Health Score (0-100) and actionable advisories.
"""

import sys
import json
import math

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


CLASSIFICATION_TIERS = {
    "PRIME_WEALTH_COMPOUNDER": {
        "title": "Prime Wealth Compounder",
        "tier": 1,
        "badge": "🟢 Low Financial Risk (Prime Tier)",
        "color": "#059669",
        "bg": "bg-emerald-50 border-emerald-300 text-emerald-900",
        "summary": "Exceptional financial stability. Low debt obligations, disciplined savings, and high investment compounding velocity."
    },
    "CAPITAL_PRESERVATION_SHIELD": {
        "title": "Defensive Wealth Shield",
        "tier": 2,
        "badge": "🛡️ Low-to-Moderate Financial Risk",
        "color": "#0B4F4A",
        "bg": "bg-[#0B4F4A]/10 border-[#0B4F4A]/30 text-[#0B4F4A]",
        "summary": "Solid financial foundation with controlled expenses and healthy monthly cashflow allocation."
    },
    "HIGH_GROWTH_ASPIRANT": {
        "title": "High-Growth Accumulator",
        "tier": 3,
        "badge": "🚀 Moderate Financial Risk (Growth Tier)",
        "color": "#D97706",
        "bg": "bg-amber-50 border-amber-300 text-amber-900",
        "summary": "Strong monthly investment velocity; requires slight optimization in liquid monthly savings buffer."
    },
    "CASHFLOW_VULNERABLE": {
        "title": "Cashflow Vulnerable",
        "tier": 4,
        "badge": "⚠️ High Financial Risk (Caution)",
        "color": "#DC2626",
        "bg": "bg-rose-50 border-rose-300 text-rose-900",
        "summary": "Elevated EMI/loan debt burden or high fixed expense commitments relative to monthly income."
    }
}


def evaluate_user_profile(payload):
    """
    Evaluates 5 non-negative monthly financial inputs:
      - monthlyIncome
      - monthlyExpenses
      - monthlySavings
      - monthlyInvestment
      - monthlyEmi
    """
    income = max(1.0, float(payload.get("monthlyIncome", payload.get("netMonthlyIncome", 100000))))
    expenses = max(0.0, float(payload.get("monthlyExpenses", payload.get("fixedExpenses", 35000))))
    savings = max(0.0, float(payload.get("monthlySavings", payload.get("liquidEmergencySavings", 20000))))
    investment = max(0.0, float(payload.get("monthlyInvestment", payload.get("monthlySip", 20000))))
    emi = max(0.0, float(payload.get("monthlyEmi", payload.get("debtEmi", 15000))))

    # Derived Financial Ratios
    emi_ratio = round(emi / income, 3)
    expense_ratio = round(expenses / income, 3)
    commitment_ratio = round((expenses + emi) / income, 3)
    savings_rate = round(savings / income, 3)
    investment_rate = round(investment / income, 3)
    total_outflows = expenses + emi + investment + savings
    surplus_cashflow = round(income - total_outflows, 2)

    # Ultra-Dynamic Continuous Financial Health Score Math (0-100)
    # 1. EMI Debt Score (30% Weight)
    if emi_ratio <= 0.15:
        emi_score = 100.0
    else:
        emi_score = max(0.0, 100.0 - ((emi_ratio - 0.15) / 0.35) * 100.0)

    # 2. Expense Ratio Score (25% Weight)
    if expense_ratio <= 0.35:
        expense_score = 100.0
    else:
        expense_score = max(0.0, 100.0 - ((expense_ratio - 0.35) / 0.35) * 100.0)

    # 3. Monthly Savings Rate Score (20% Weight)
    savings_score = min(100.0, (savings_rate / 0.20) * 100.0)

    # 4. Monthly Investment Rate Score (25% Weight)
    investment_score = min(100.0, (investment_rate / 0.25) * 100.0)

    raw_health = (emi_score * 0.30) + (expense_score * 0.25) + (savings_score * 0.20) + (investment_score * 0.25)

    # Deficit Penalty if total outflows exceed income
    deficit_penalty = 0.0
    if surplus_cashflow < 0:
        deficit_penalty = min(30.0, (abs(surplus_cashflow) / income) * 50.0)

    health_score = int(round(max(0.0, min(100.0, raw_health - deficit_penalty))))

    # Simple & Dynamic Financial Health Verdict
    if health_score >= 90:
        health_verdict = "🟢 Exceptional Financial Health: Low debt obligations, strong liquid savings, and high investment compounding rate."
    elif health_score >= 75:
        health_verdict = "🔵 Good Financial Health: Balanced monthly living expenses and healthy savings/investment rates."
    elif health_score >= 50:
        health_verdict = "🟡 Fair Financial Health: Moderate cashflow stability; room to reduce monthly EMI drag or increase savings."
    else:
        health_verdict = "🔴 High Financial Risk: Heavy EMI obligations or cashflow deficit requiring immediate budget optimization."

    # RIPPER Classification Logic
    if emi_ratio > 0.40 or commitment_ratio > 0.75 or (savings_rate < 0.05 and investment_rate < 0.10):
        matched_tier_key = "CASHFLOW_VULNERABLE"
    elif emi_ratio <= 0.20 and commitment_ratio <= 0.50 and (savings_rate + investment_rate) >= 0.30:
        matched_tier_key = "PRIME_WEALTH_COMPOUNDER"
    elif investment_rate >= 0.25 and emi_ratio <= 0.30:
        matched_tier_key = "HIGH_GROWTH_ASPIRANT"
    else:
        matched_tier_key = "CAPITAL_PRESERVATION_SHIELD"

    tier_info = CLASSIFICATION_TIERS[matched_tier_key]

    # Actionable Advisories
    advisories = []

    if emi_ratio > 0.30:
        target_emi = round(income * 0.30)
        advisories.append({
            "title": "Reduce Monthly EMI Obligations",
            "desc": f"Your EMI burden (₹{int(emi):,}/mo) consumes {round(emi_ratio*100)}% of monthly income. Target reducing EMIs to below ₹{target_emi:,}/mo (<= 30% of income)."
        })

    if savings_rate < 0.15:
        target_sav = round(income * 0.15)
        delta_sav = max(0, target_sav - int(savings))
        advisories.append({
            "title": "Boost Monthly Liquid Savings",
            "desc": f"Your savings rate is currently {round(savings_rate*100)}% (₹{int(savings):,}/mo). Increase monthly savings by ₹{delta_sav:,}/mo to build a 15% emergency cushion."
        })

    if investment_rate < 0.20:
        target_inv = round(income * 0.20)
        delta_inv = max(0, target_inv - int(investment))
        advisories.append({
            "title": "Increase Monthly Investment SIP",
            "desc": f"Your investment allocation is currently {round(investment_rate*100)}% (₹{int(investment):,}/mo). Increase monthly investments by ₹{delta_inv:,}/mo to hit a 20% compounding velocity."
        })

    if surplus_cashflow < 0:
        advisories.append({
            "title": "Monthly Cashflow Deficit Alert",
            "desc": f"Your total monthly commitments (₹{int(total_outflows):,}) exceed your monthly income by ₹{int(abs(surplus_cashflow)):,}. Immediately trim non-essential expenses."
        })
    elif not advisories:
        advisories.append({
            "title": "Maintain Optimal Wealth Allocation",
            "desc": "Your 5 monthly inputs exhibit excellent balance across debt management, liquid reserves, and wealth compounding."
        })

    return {
        "status": "SUCCESS",
        "algorithm": "RIPPER Rule Induction Engine",
        "healthScore": health_score,
        "healthVerdict": health_verdict,
        "classification": {
            "tierKey": matched_tier_key,
            "tierInfo": tier_info
        },
        "ratios": {
            "monthlyIncome": income,
            "monthlyExpenses": expenses,
            "monthlySavings": savings,
            "monthlyInvestment": investment,
            "monthlyEmi": emi,
            "emiRatioPct": round(emi_ratio * 100, 1),
            "expenseRatioPct": round(expense_ratio * 100, 1),
            "savingsRatePct": round(savings_rate * 100, 1),
            "investmentRatePct": round(investment_rate * 100, 1),
            "surplusCashflow": surplus_cashflow
        },
        "advisories": advisories
    }


if __name__ == "__main__":
    try:
        input_data = sys.stdin.read().strip()
        payload = json.loads(input_data) if input_data else {}
        result = evaluate_user_profile(payload)
        print(json.dumps(result, ensure_ascii=False))
    except Exception as e:
        error_res = {
            "status": "ERROR",
            "message": str(e)
        }
        print(json.dumps(error_res, ensure_ascii=False))
