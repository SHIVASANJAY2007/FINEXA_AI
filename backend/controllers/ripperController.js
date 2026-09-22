/**
 * ripperController.js
 * 
 * Express Controller for FINEXA Rule Induction Classifier (RIPPER / CBA Decision Engine).
 * Executes Python RIPPER ML engine with zero-downtime JavaScript fallback classifier.
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PYTHON_RIPPER_ENGINE = join(__dirname, '../ai/ripper_classifier_engine.py');

/**
 * Spawns the Python RIPPER engine via subprocess IPC.
 */
const executePythonRIPPER = (payload) => {
  return new Promise((resolve, reject) => {
    const pythonCommands = process.platform === 'win32' ? ['python', 'py', 'python3'] : ['python3', 'python'];

    const tryCommand = (index) => {
      if (index >= pythonCommands.length) {
        return reject(new Error('No compatible Python interpreter found for RIPPER.'));
      }

      const cmd = pythonCommands[index];
      let stdout = '';
      let stderr = '';
      let hasError = false;

      const py = spawn(cmd, [PYTHON_RIPPER_ENGINE], {
        env: { ...process.env, PYTHONIOENCODING: 'utf-8' }
      });

      py.stdout.setEncoding('utf8');
      py.stderr.setEncoding('utf8');

      py.stdout.on('data', (data) => {
        stdout += data;
      });

      py.stderr.on('data', (data) => {
        stderr += data;
      });

      py.on('error', () => {
        hasError = true;
        tryCommand(index + 1);
      });

      py.on('close', (code) => {
        if (hasError) return;
        if (code !== 0) {
          return reject(new Error(`Python RIPPER exited with code ${code}: ${stderr}`));
        }
        try {
          const parsed = JSON.parse(stdout);
          resolve(parsed);
        } catch (err) {
          reject(new Error(`Failed to parse RIPPER output: ${err.message}`));
        }
      });

      py.stdin.write(JSON.stringify(payload || {}));
      py.stdin.end();
    };

    tryCommand(0);
  });
};

/**
 * Pure JavaScript Resilient Fallback RIPPER Classifier.
 */
const runJsRipperFallback = (payload) => {
  const income = Math.max(1, Number(payload.monthlyIncome || payload.netMonthlyIncome || 100000));
  const expenses = Math.max(0, Number(payload.monthlyExpenses || payload.fixedExpenses || 35000));
  const savings = Math.max(0, Number(payload.monthlySavings || payload.liquidEmergencySavings || 20000));
  const investment = Math.max(0, Number(payload.monthlyInvestment || payload.monthlySip || 20000));
  const emi = Math.max(0, Number(payload.monthlyEmi || payload.debtEmi || 15000));

  const emiRatio = Math.round((emi / income) * 1000) / 1000;
  const expenseRatio = Math.round((expenses / income) * 1000) / 1000;
  const commitmentRatio = Math.round(((expenses + emi) / income) * 1000) / 1000;
  const savingsRate = Math.round((savings / income) * 1000) / 1000;
  const investmentRate = Math.round((investment / income) * 1000) / 1000;
  const totalOutflows = expenses + emi + investment + savings;
  const surplusCashflow = Math.round((income - totalOutflows) * 100) / 100;

  const tiers = {
    PRIME_WEALTH_COMPOUNDER: {
      title: "Prime Wealth Compounder",
      tier: 1,
      badge: "🟢 Low Financial Risk (Prime Tier)",
      color: "#059669",
      bg: "bg-emerald-50 border-emerald-300 text-emerald-900",
      summary: "Exceptional financial stability. Low debt obligations, disciplined savings, and high investment compounding velocity."
    },
    CAPITAL_PRESERVATION_SHIELD: {
      title: "Defensive Wealth Shield",
      tier: 2,
      badge: "🛡️ Low-to-Moderate Financial Risk",
      color: "#0B4F4A",
      bg: "bg-[#0B4F4A]/10 border-[#0B4F4A]/30 text-[#0B4F4A]",
      summary: "Solid financial foundation with controlled expenses and healthy monthly cashflow allocation."
    },
    HIGH_GROWTH_ASPIRANT: {
      title: "High-Growth Accumulator",
      tier: 3,
      badge: "🚀 Moderate Financial Risk (Growth Tier)",
      color: "#D97706",
      bg: "bg-amber-50 border-amber-300 text-amber-900",
      summary: "Strong monthly investment velocity; requires slight optimization in liquid monthly savings buffer."
    },
    CASHFLOW_VULNERABLE: {
      title: "Cashflow Vulnerable",
      tier: 4,
      badge: "⚠️ High Financial Risk (Caution)",
      color: "#DC2626",
      bg: "bg-rose-50 border-rose-300 text-rose-900",
      summary: "Elevated EMI/loan debt burden or high fixed expense commitments relative to monthly income."
    }
  };

  let matchedTierKey = "CAPITAL_PRESERVATION_SHIELD";

  if (emiRatio > 0.40 || commitmentRatio > 0.75 || (savingsRate < 0.05 && investmentRate < 0.10)) {
    matchedTierKey = "CASHFLOW_VULNERABLE";
  } else if (emiRatio <= 0.20 && commitmentRatio <= 0.50 && (savingsRate + investmentRate) >= 0.30) {
    matchedTierKey = "PRIME_WEALTH_COMPOUNDER";
  } else if (investmentRate >= 0.25 && emiRatio <= 0.30) {
    matchedTierKey = "HIGH_GROWTH_ASPIRANT";
  } else {
    matchedTierKey = "CAPITAL_PRESERVATION_SHIELD";
  }

  const tierInfo = tiers[matchedTierKey];

  // Ultra-Dynamic Continuous Financial Health Score Math (0-100)
  const emiScore = emiRatio <= 0.15 ? 100 : Math.max(0, 100 - ((emiRatio - 0.15) / 0.35) * 100);
  const expenseScore = expenseRatio <= 0.35 ? 100 : Math.max(0, 100 - ((expenseRatio - 0.35) / 0.35) * 100);
  const savingsScore = Math.min(100, (savingsRate / 0.20) * 100);
  const investmentScore = Math.min(100, (investmentRate / 0.25) * 100);

  const rawHealth = (emiScore * 0.30) + (expenseScore * 0.25) + (savingsScore * 0.20) + (investmentScore * 0.25);

  let deficitPenalty = 0;
  if (surplusCashflow < 0) {
    deficitPenalty = Math.min(30, (Math.abs(surplusCashflow) / income) * 50);
  }

  const healthScore = Math.round(Math.max(0, Math.min(100, rawHealth - deficitPenalty)));

  let healthVerdict = "";
  if (healthScore >= 90) {
    healthVerdict = "🟢 Exceptional Financial Health: Low debt obligations, strong liquid savings, and high investment compounding rate.";
  } else if (healthScore >= 75) {
    healthVerdict = "🔵 Good Financial Health: Balanced monthly living expenses and healthy savings/investment rates.";
  } else if (healthScore >= 50) {
    healthVerdict = "🟡 Fair Financial Health: Moderate cashflow stability; room to reduce monthly EMI drag or increase savings.";
  } else {
    healthVerdict = "🔴 High Financial Risk: Heavy EMI obligations or cashflow deficit requiring immediate budget optimization.";
  }

  const advisories = [];
  if (emiRatio > 0.30) {
    const targetEmi = Math.round(income * 0.30);
    advisories.push({
      title: "Reduce Monthly EMI Obligations",
      desc: `Your EMI burden (₹${emi.toLocaleString('en-IN')}/mo) consumes ${Math.round(emiRatio * 100)}% of monthly income. Target reducing EMIs to below ₹${targetEmi.toLocaleString('en-IN')}/mo (<= 30% of income).`
    });
  }
  if (savingsRate < 0.15) {
    const targetSav = Math.round(income * 0.15);
    const deltaSav = Math.max(0, targetSav - Math.round(savings));
    advisories.push({
      title: "Boost Monthly Liquid Savings",
      desc: `Your savings rate is currently ${Math.round(savingsRate * 100)}% (₹${savings.toLocaleString('en-IN')}/mo). Increase monthly savings by ₹${deltaSav.toLocaleString('en-IN')}/mo to build a 15% emergency cushion.`
    });
  }
  if (investmentRate < 0.20) {
    const targetInv = Math.round(income * 0.20);
    const deltaInv = Math.max(0, targetInv - Math.round(investment));
    advisories.push({
      title: "Increase Monthly Investment SIP",
      desc: `Your investment allocation is currently ${Math.round(investmentRate * 100)}% (₹${investment.toLocaleString('en-IN')}/mo). Increase monthly investments by ₹${deltaInv.toLocaleString('en-IN')}/mo to hit a 20% compounding velocity.`
    });
  }
  if (surplusCashflow < 0) {
    advisories.push({
      title: "Monthly Cashflow Deficit Alert",
      desc: `Your total monthly commitments (₹${totalOutflows.toLocaleString('en-IN')}) exceed your monthly income by ₹${Math.abs(surplusCashflow).toLocaleString('en-IN')}. Immediately trim non-essential expenses.`
    });
  } else if (advisories.length === 0) {
    advisories.push({
      title: "Maintain Optimal Wealth Allocation",
      desc: "Your 5 monthly inputs exhibit excellent balance across debt management, liquid reserves, and wealth compounding."
    });
  }

  return {
    status: "SUCCESS",
    algorithm: "RIPPER Rule Induction Engine (JS Fallback)",
    healthScore,
    healthVerdict,
    classification: { tierKey: matchedTierKey, tierInfo },
    ratios: {
      monthlyIncome: income,
      monthlyExpenses: expenses,
      monthlySavings: savings,
      monthlyInvestment: investment,
      monthlyEmi: emi,
      emiRatioPct: Math.round(emiRatio * 100),
      expenseRatioPct: Math.round(expenseRatio * 100),
      savingsRatePct: Math.round(savingsRate * 100),
      investmentRatePct: Math.round(investmentRate * 100),
      surplusCashflow
    },
    advisories
  };
};

export const classifyWithRIPPER = async (req, res, next) => {
  try {
    const payload = req.body || {};
    let result;
    try {
      result = await executePythonRIPPER(payload);
    } catch (pyErr) {
      console.warn('Python RIPPER execution failed, running JS fallback:', pyErr.message);
      result = runJsRipperFallback(payload);
    }
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
