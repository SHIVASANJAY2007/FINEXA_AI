import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Sparkles, TrendingUp,
  RefreshCw, Zap, Award,
  Info, Edit3, Shield, Crown, Target, CheckCircle2
} from 'lucide-react';
import { getApiBaseUrl } from '../../utils/api';

const RISK_PRESETS = [
  {
    id: 'safe',
    title: 'Safe & Steady',
    emoji: '🛡️',
    tagline: 'Capital protection first. Heavy bonds & gold shield.',
    desc: 'Best for 1–3 yrs or lower risk tolerance.'
  },
  {
    id: 'balanced',
    title: 'Balanced Growth',
    emoji: '⚖️',
    tagline: 'Optimal risk-to-reward. Highest Sharpe ratio.',
    desc: 'Best for 3–7 yrs and steady compounding.'
  },
  {
    id: 'aggressive',
    title: 'Aggressive Wealth',
    emoji: '🚀',
    tagline: 'High equity & tech upside. Maximum growth.',
    desc: 'Best for 7–15+ yrs targeting wealth creation.'
  }
];

const ASSET_COLORS = {
  nifty50: { bar: '#059669', name: 'Large Cap (Nifty 50)', tier: 'Moderate' },
  midcap: { bar: '#E11D48', name: 'Mid & Small Cap Growth', tier: 'High' },
  debt: { bar: '#D97706', name: 'Corporate Bonds & Debt', tier: 'Low' },
  gold: { bar: '#CA8A04', name: 'Sovereign Gold / ETF', tier: 'Moderate' },
  us_tech: { bar: '#4F46E5', name: 'Global Tech Index', tier: 'High' }
};

export default function GreyWolfOptimizer() {
  // Goal inputs with manual text entry + slider sync
  const [monthlyInvestment, setMonthlyInvestment] = useState(15000);
  const [horizonYears, setHorizonYears] = useState(5);
  const [riskPreference, setRiskPreference] = useState('balanced');
  const [selectedLeader, setSelectedLeader] = useState('alpha');
  const [loading, setLoading] = useState(false);
  const [gwoData, setGwoData] = useState(null);

  // Fetch GWO Optimization from Backend
  const runGWOHunt = useCallback(async (amount, years, risk) => {
    setLoading(true);
    try {
      const apiBase = getApiBaseUrl();
      const res = await fetch(`${apiBase}/gwo/optimize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          monthlyInvestment: Number(amount) || 10000,
          horizonYears: Number(years) || 5,
          riskPreference: risk,
          packSize: 25,
          iterations: 40
        })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setGwoData(data);
    } catch (err) {
      console.error('GWO optimization error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      runGWOHunt(monthlyInvestment, horizonYears, riskPreference);
    }, 200);
    return () => clearTimeout(timer);
  }, [monthlyInvestment, horizonYears, riskPreference, runGWOHunt]);

  const activeLeader = gwoData?.packLeaders?.[selectedLeader] || gwoData?.packLeaders?.alpha;

  return (
    <div className="min-h-screen bg-[#FDF6ED] text-[#3A2E25] font-sans pt-10 sm:pt-16 pb-20 sm:pb-24 px-4 sm:px-6 lg:px-8 dot-grid">
      <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">

        {/* Top Header & Navigation */}
        <div className="space-y-4 pb-6 border-b border-[#3A2E25]/10">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center gap-2 text-taupe hover:text-ink transition-colors text-xs font-bold uppercase tracking-widest cursor-pointer group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>

            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-[#3A2E25]/60 bg-stone-100/90 px-3 py-1 rounded-full border border-stone-200">
              FINEXA Engine v2.4
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pr-12 sm:pr-0">
            <div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#1A1615]">
                  FINEXA <span className="text-[#6B1E2B]">Asset Allocation™</span>
                </h1>
                <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-[#6B1E2B]/10 text-[#6B1E2B] border border-[#6B1E2B]/20">
                  ⚡ Swarm Asset Allocation
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#3A2E25]/80 mt-1 max-w-2xl font-serif italic">
                Advanced quantitative swarm optimization engineered to discover maximum Sharpe ratio asset allocations customized for your financial horizon.
              </p>
            </div>

            <button
              onClick={() => runGWOHunt(monthlyInvestment, horizonYears, riskPreference)}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl bg-[#6B1E2B] text-[#FDF6ED] font-semibold text-xs tracking-wider uppercase hover:bg-[#521620] active:scale-95 transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50 self-start sm:self-auto shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Optimizing...' : 'Recalculate'}
            </button>
          </div>
        </div>

        {/* Step 1: Goal Inputs (Direct Manual Input & Sliders) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Monthly Investment Input Card */}
          <div className="p-6 rounded-3xl bg-white border border-[#3A2E25]/10 shadow-sm space-y-4">
            <div className="flex justify-between items-start gap-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#6B1E2B]">Step 1</span>
                <h3 className="text-lg font-serif font-bold text-[#1A1615] flex items-center gap-1.5">
                  Monthly Investment
                  <Edit3 className="w-3.5 h-3.5 text-stone-400" />
                </h3>
              </div>

              {/* Editable Manual Number Badge */}
              <div className="flex items-center gap-1 bg-[#0B4F4A]/10 border border-[#0B4F4A]/20 px-3 py-1.5 rounded-2xl focus-within:ring-2 focus-within:ring-[#0B4F4A]/30 focus-within:border-[#0B4F4A] transition-all">
                <span className="text-lg font-serif font-bold text-[#0B4F4A]">₹</span>
                <input
                  type="number"
                  min="500"
                  max="5000000"
                  step="500"
                  value={monthlyInvestment || ''}
                  onChange={(e) => setMonthlyInvestment(Math.max(0, Number(e.target.value)))}
                  placeholder="15000"
                  className="w-28 text-xl font-serif font-bold text-[#0B4F4A] bg-transparent outline-none"
                />
                <span className="text-xs text-[#0B4F4A]/70 font-normal">/mo</span>
              </div>
            </div>

            <input
              type="range"
              min="1000"
              max={Math.max(100000, Number(monthlyInvestment) || 100000)}
              step="1000"
              value={monthlyInvestment || 0}
              onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
              className="w-full h-2.5 bg-[#DCCFC0] rounded-lg appearance-none cursor-pointer accent-[#6B1E2B]"
            />

            <div className="flex items-center gap-2 pt-2 border-t border-stone-100 flex-wrap">
              <span className="text-xs text-stone-500 font-medium">Quick Select:</span>
              {[5000, 10000, 15000, 25000, 50000, 100000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setMonthlyInvestment(amt)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    monthlyInvestment === amt
                      ? 'bg-[#3A2E25] text-white'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  ₹{amt >= 100000 ? `${amt / 100000}L` : amt.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Time Horizon Input Card */}
          <div className="p-6 rounded-3xl bg-white border border-[#3A2E25]/10 shadow-sm space-y-4">
            <div className="flex justify-between items-start gap-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#6B1E2B]">Step 2</span>
                <h3 className="text-lg font-serif font-bold text-[#1A1615] flex items-center gap-1.5">
                  Target Time Horizon
                  <Edit3 className="w-3.5 h-3.5 text-stone-400" />
                </h3>
              </div>

              {/* Editable Manual Years Badge */}
              <div className="flex items-center gap-1 bg-stone-100 border border-stone-200 px-3 py-1.5 rounded-2xl focus-within:ring-2 focus-within:ring-[#0B4F4A]/30 focus-within:border-[#0B4F4A] transition-all">
                <input
                  type="number"
                  min="1"
                  max="40"
                  step="1"
                  value={horizonYears || ''}
                  onChange={(e) => setHorizonYears(Math.max(1, Math.min(40, Number(e.target.value))))}
                  placeholder="5"
                  className="w-12 text-xl font-serif font-bold text-[#1A1615] bg-transparent outline-none text-right"
                />
                <span className="text-xs font-serif font-bold text-[#1A1615] ml-1">Years</span>
              </div>
            </div>

            <input
              type="range"
              min="1"
              max="30"
              step="1"
              value={horizonYears || 1}
              onChange={(e) => setHorizonYears(Number(e.target.value))}
              className="w-full h-2.5 bg-[#DCCFC0] rounded-lg appearance-none cursor-pointer accent-[#0B4F4A]"
            />

            <div className="flex items-center gap-2 pt-2 border-t border-stone-100 flex-wrap">
              <span className="text-xs text-stone-500 font-medium">Goals:</span>
              {[
                { yrs: 3, label: '3y Vacation' },
                { yrs: 5, label: '5y Downpayment' },
                { yrs: 10, label: '10y Education' },
                { yrs: 15, label: '15y Early Retirement' }
              ].map((g) => (
                <button
                  key={g.yrs}
                  onClick={() => setHorizonYears(g.yrs)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    horizonYears === g.yrs
                      ? 'bg-[#0B4F4A] text-white'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Step 3: Choose Risk Preference */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#3A2E25]/70 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-[#C9A227]" /> Step 3: Select Your Risk Comfort Level
          </span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {RISK_PRESETS.map((p) => {
              const isSelected = riskPreference === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setRiskPreference(p.id)}
                  className={`p-4 rounded-2xl text-left transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-white shadow-md border-[#6B1E2B] ring-2 ring-[#6B1E2B]/15 scale-[1.01]'
                      : 'bg-white/60 hover:bg-white/90 border-[#3A2E25]/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-2xl">{p.emoji}</span>
                    {isSelected && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#6B1E2B] text-white">
                        Selected
                      </span>
                    )}
                  </div>
                  <h4 className="font-serif font-bold text-sm text-[#1A1615]">{p.title}</h4>
                  <p className="text-xs text-stone-600 mt-1">{p.tagline}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 4: Quantitative Strategy Cards */}
        {gwoData?.packLeaders && (
          <div className="space-y-4 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#6B1E2B]">Step 4</span>
                <h3 className="font-serif font-bold text-xl text-[#1A1615] flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#C9A227]" /> Select Quantitative Strategy
                </h3>
              </div>
              <p className="text-xs text-stone-500 italic">Compare Sharpe ratios & portfolio characteristics</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
              {Object.entries(gwoData.packLeaders).map(([key, leader]) => {
                const isSelected = selectedLeader === key;
                const iconMeta = key === 'alpha' 
                  ? { icon: Crown, bg: 'bg-amber-500/10 text-amber-700 border-amber-200' }
                  : key === 'beta'
                  ? { icon: Shield, bg: 'bg-emerald-500/10 text-emerald-700 border-emerald-200' }
                  : { icon: Target, bg: 'bg-rose-500/10 text-rose-700 border-rose-200' };
                
                const IconComponent = iconMeta.icon;

                return (
                  <motion.div
                    key={key}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setSelectedLeader(key)}
                    className={`p-6 rounded-3xl transition-all duration-300 cursor-pointer relative flex flex-col justify-between h-full ${
                      isSelected
                        ? 'bg-white border-2 border-[#6B1E2B] shadow-xl ring-4 ring-[#6B1E2B]/10'
                        : 'bg-white/80 backdrop-blur-md border border-[#3A2E25]/10 shadow-sm hover:border-[#6B1E2B]/40 hover:bg-white hover:shadow-md'
                    }`}
                  >
                    {/* Selected Active Indicator Badge */}
                    {isSelected && (
                      <div className="absolute -top-3 right-5 px-3 py-0.5 rounded-full bg-[#6B1E2B] text-white text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Active Strategy
                      </div>
                    )}

                    <div>
                      {/* Top Header Row inside Card */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className={`p-2 rounded-2xl border ${iconMeta.bg} flex items-center justify-center shrink-0`}>
                          <IconComponent className="w-4.5 h-4.5" />
                        </div>
                        {key === 'alpha' ? (
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 shrink-0">
                            ⭐ Recommended
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200 shrink-0">
                            Sharpe {leader.metrics.sharpeRatio}
                          </span>
                        )}
                      </div>

                      {/* Strategy Role Label */}
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                        {leader.role}
                      </span>

                      <h4 className="font-serif font-bold text-lg text-[#1A1615] leading-snug">{leader.title}</h4>
                      <p className="text-xs text-stone-600 mt-2 leading-relaxed font-normal min-h-[36px]">{leader.tagline}</p>
                    </div>

                    {/* Footer Metrics Grid */}
                    <div className="mt-6 pt-4 border-t border-stone-100/80 space-y-3">
                      <div className="grid grid-cols-2 gap-2 bg-stone-50/80 p-3 rounded-2xl border border-stone-100">
                        <div>
                          <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block">Expected CAGR</span>
                          <span className="text-base font-serif font-bold text-[#0B4F4A]">
                            {leader.metrics.expectedReturn}%<span className="text-[10px] font-normal text-stone-500">/yr</span>
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block">Est. ({horizonYears}y)</span>
                          <span className="text-base font-serif font-bold text-[#6B1E2B]">
                            ₹{(leader.projection.estimatedWealth / 100000).toFixed(2)}L
                          </span>
                        </div>
                      </div>

                      {/* Detailed Metric Badges */}
                      <div className="flex items-center justify-between text-[11px] text-stone-500 px-1">
                        <span>Risk Volatility: <strong className="text-stone-800 font-semibold">{leader.metrics.volatility}%</strong></span>
                        <span>Sharpe: <strong className="text-stone-800 font-semibold">{leader.metrics.sharpeRatio}</strong></span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Selected Strategy Deep-Dive & Wealth Growth Projection */}
        {activeLeader && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Left: Asset Allocation Breakdown (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="p-6 rounded-3xl bg-white border border-[#3A2E25]/10 shadow-sm space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#1A1615] flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#C9A227]" /> Asset Allocation Breakdown
                    </h3>
                    <p className="text-xs text-stone-500">Monthly breakdown for ₹{monthlyInvestment.toLocaleString()}/mo:</p>
                  </div>
                  <span className="text-xs font-bold text-[#0B4F4A] bg-[#0B4F4A]/10 px-3 py-1 rounded-full">
                    {activeLeader.metrics.expectedReturn}% Expected Return
                  </span>
                </div>

                {/* Asset Percentage Bars */}
                <div className="space-y-3.5">
                  {activeLeader.allocation.map((item) => {
                    const colorMeta = ASSET_COLORS[item.assetKey] || { bar: '#78716C', name: item.assetName, tier: item.riskTier };
                    return (
                      <div key={item.assetKey} className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#1A1615]">{colorMeta.name}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-stone-200 text-stone-700">
                              {colorMeta.tier}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="font-serif font-bold text-sm text-[#1A1615]">
                              ₹{Math.round(item.monthlyAmount).toLocaleString()}
                            </span>
                            <span className="text-xs text-stone-500 ml-1">({item.percentage}%)</span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.percentage}%` }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: colorMeta.bar }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Practical Advice Box */}
                <div className="p-4 rounded-2xl bg-[#0B4F4A]/5 border border-[#0B4F4A]/20 flex items-start gap-3">
                  <Info className="w-5 h-5 text-[#0B4F4A] shrink-0 mt-0.5" />
                  <p className="text-xs text-[#0B4F4A] leading-relaxed">
                    <strong>💡 AI Strategy Note: </strong>
                    This allocation is dynamically balanced to safeguard capital during volatile markets while capturing compounding growth of {activeLeader.metrics.expectedReturn}% CAGR over your {horizonYears}-year horizon.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Projected Wealth Growth Card (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 rounded-3xl bg-white border border-[#3A2E25]/10 shadow-sm space-y-5">
                <h3 className="font-serif font-bold text-lg text-[#1A1615] flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#6B1E2B]" /> {horizonYears}-Year Wealth Growth
                </h3>

                {/* Big Number Wealth Display */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-[#1A1615] to-[#3A2E25] text-white space-y-3">
                  <div className="text-xs text-[#C9A227] font-bold uppercase tracking-wider">Estimated Total Value</div>
                  <div className="text-3xl sm:text-4xl font-serif font-bold text-white">
                    ₹{activeLeader.projection.estimatedWealth.toLocaleString()}
                  </div>
                  <div className="text-xs text-emerald-300 flex items-center gap-1 font-semibold">
                    <TrendingUp className="w-4 h-4" />
                    +{activeLeader.projection.wealthMultiple}x Multiplier (+₹{activeLeader.projection.totalGain.toLocaleString()} profit)
                  </div>
                </div>

                {/* Breakdown List */}
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between p-3 rounded-xl bg-stone-50 border border-stone-200">
                    <span className="text-stone-600">Total Money You Invest</span>
                    <span className="font-bold text-[#1A1615]">₹{activeLeader.projection.totalInvested.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-xl bg-emerald-50/50 border border-emerald-200">
                    <span className="text-emerald-800 font-semibold">Estimated Net Profit</span>
                    <span className="font-bold text-emerald-700">+₹{activeLeader.projection.totalGain.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-xl bg-stone-50 border border-stone-200">
                    <span className="text-stone-600">Expected Annual Return</span>
                    <span className="font-bold text-[#0B4F4A]">{activeLeader.metrics.expectedReturn}% / yr</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-xl bg-stone-50 border border-stone-200">
                    <span className="text-stone-600">Risk Level (Volatility)</span>
                    <span className="font-bold text-[#1A1615]">{activeLeader.metrics.volatility}%</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
