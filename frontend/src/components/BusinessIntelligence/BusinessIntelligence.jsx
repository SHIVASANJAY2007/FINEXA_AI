/**
 * BusinessIntelligence.jsx
 *
 * Single-file module for the FINEXA AI Business Intelligence feature.
 * Contains all sub-components inline to keep the folder clean:
 *   • Markdown renderer (formerly BIResponseRenderer)
 *   • 7-step MSME wizard (formerly BizraManual)
 *   • Page shell with header + two-stage reset (formerly BusinessIntelligence)
 *
 * Route: /business-intelligence
 */

import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { marked } from 'marked';
import {
  ArrowLeft, AlertTriangle, RotateCcw,
  MapPin, Check, ChevronRight, Shield, MessageSquare,
  Sparkles, Map, Building2, Coins, Briefcase, Layers,
  Globe, Loader2, Download, Printer, CheckCircle2, RefreshCw,
  AlertCircle, Copy, ExternalLink, Minus,
} from 'lucide-react';
import { getApiBaseUrl } from '../../utils/api';
import { t, getLangCode } from './biTranslations';

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 1 — Markdown Renderer
// ─────────────────────────────────────────────────────────────────────────────

const ListContext = createContext({ ordered: false, counter: { val: 0 } });

function CodeBlock({ children, className }) {
  const [copied, setCopied] = useState(false);
  const language = (className || '').replace('language-', '') || 'code';
  const code = String(children).replace(/\n$/, '');
  return (
    <div className="my-4 rounded-xl bg-ivory border border-beige/60 overflow-hidden shadow-md">
      <div className="flex items-center justify-between px-4 py-2 bg-cream/60 border-b border-beige/40">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-teal">{language}</span>
        <button
          onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
          className="flex items-center gap-1.5 text-[11px] text-taupe hover:text-ink transition-colors cursor-pointer"
        >
          {copied ? <><Check size={12} className="text-teal" /><span className="text-teal">Copied</span></> : <><Copy size={12} /><span>Copy</span></>}
        </button>
      </div>
      <pre className="p-4 text-xs font-mono text-ink overflow-x-auto whitespace-pre leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

const BI_H1 = ({ children }) => (
  <div className="mt-6 mb-3 pb-3 border-b-2 border-teal/30">
    <h1 className="text-lg sm:text-xl font-black tracking-tight text-ink flex items-center gap-2.5">
      <span className="w-1.5 h-6 rounded-full bg-gradient-to-b from-teal to-camel inline-block shrink-0" />
      {children}
    </h1>
  </div>
);
const BI_H2 = ({ children }) => (
  <div className="mt-5 mb-2">
    <h2 className="text-base sm:text-lg font-extrabold text-ink flex items-center gap-2">
      <span className="w-5 h-5 rounded-md bg-teal/10 border border-teal/20 flex items-center justify-center shrink-0">
        <ChevronRight size={12} className="text-teal" />
      </span>
      {children}
    </h2>
  </div>
);
const BI_H3 = ({ children }) => (
  <h3 className="mt-4 mb-1.5 text-sm sm:text-base font-bold text-teal flex items-center gap-1.5">
    <span className="w-2 h-2 rounded-full bg-teal/50 inline-block shrink-0" />{children}
  </h3>
);
const BI_H4 = ({ children }) => <h4 className="mt-3 mb-1 text-xs sm:text-sm font-bold text-taupe uppercase tracking-wide">{children}</h4>;
const BI_H5 = ({ children }) => <h5 className="mt-2 mb-1 text-xs font-bold text-taupe/80">{children}</h5>;
const BI_H6 = ({ children }) => <h6 className="mt-1 mb-1 text-xs font-semibold text-taupe/60">{children}</h6>;
const BI_P  = ({ children }) => <p className="text-xs sm:text-sm leading-relaxed text-ink my-1.5">{children}</p>;
const BI_Strong = ({ children }) => <strong className="font-extrabold text-ink">{children}</strong>;
const BI_Em     = ({ children }) => <em className="italic text-taupe">{children}</em>;
const BI_A      = ({ href, children }) => (
  <a href={href} target="_blank" rel="noopener noreferrer"
    className="inline-flex items-center gap-1 text-teal hover:text-camel font-semibold underline underline-offset-2 transition-colors mx-0.5">
    {children}<ExternalLink size={11} />
  </a>
);
const BI_Blockquote = ({ children }) => (
  <blockquote className="my-4 pl-4 border-l-[3px] border-teal bg-teal/[0.06] rounded-r-xl py-3 pr-4 text-taupe italic text-sm">{children}</blockquote>
);
const BI_Hr = () => (
  <div className="my-5 flex items-center gap-3">
    <div className="flex-grow h-px bg-gradient-to-r from-transparent via-beige to-transparent" />
    <Minus size={12} className="text-beige shrink-0" />
    <div className="flex-grow h-px bg-gradient-to-r from-transparent via-beige to-transparent" />
  </div>
);
const BI_Ul = ({ children }) => (
  <ListContext.Provider value={{ ordered: false, counter: { val: 0 } }}>
    <ul className="my-2 space-y-1.5 pl-1">{children}</ul>
  </ListContext.Provider>
);
const BI_Ol = ({ children, start }) => {
  const counter = { val: (start ?? 1) - 1 };
  return (
    <ListContext.Provider value={{ ordered: true, counter }}>
      <ol className="my-2 space-y-1.5 pl-1 list-none">{children}</ol>
    </ListContext.Provider>
  );
};
const BI_Li = ({ children }) => {
  const { ordered, counter } = useContext(ListContext);
  if (ordered) {
    counter.val += 1;
    const num = counter.val;
    return (
      <li className="flex items-start gap-3 p-2.5 rounded-xl bg-cream/60 border border-beige/60 hover:border-teal/30 transition-colors">
        <span className="w-6 h-6 rounded-lg bg-teal/10 border border-teal/20 text-teal font-extrabold text-[11px] flex items-center justify-center shrink-0 mt-0.5">{num}</span>
        <div className="flex-grow text-xs sm:text-sm text-ink leading-relaxed pt-0.5">{children}</div>
      </li>
    );
  }
  return (
    <li className="flex items-start gap-2.5 text-ink">
      <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-teal shrink-0 flex-none" />
      <span className="text-xs sm:text-sm leading-relaxed flex-grow">{children}</span>
    </li>
  );
};
const BI_Table  = ({ children }) => (
  <div className="my-5 rounded-xl border border-beige/60 overflow-hidden shadow-sm">
    <div className="overflow-x-auto" data-lenis-prevent>
      <table className="w-full text-xs sm:text-sm border-collapse min-w-[400px]">{children}</table>
    </div>
  </div>
);
const BI_Thead = ({ children }) => <thead className="bg-cream/60">{children}</thead>;
const BI_Tbody = ({ children }) => <tbody className="divide-y divide-beige/40">{children}</tbody>;
const BI_Tr   = ({ children }) => <tr className="transition-colors even:bg-cream/30">{children}</tr>;
const BI_Th   = ({ children }) => <th className="px-4 py-2.5 text-left text-xs font-bold text-ink border-b border-beige/40">{children}</th>;
const BI_Td   = ({ children }) => <td className="px-4 py-2.5 text-ink text-xs sm:text-sm border-b border-beige/30">{children}</td>;

const mdComponents = {
  h1: BI_H1, h2: BI_H2, h3: BI_H3, h4: BI_H4, h5: BI_H5, h6: BI_H6,
  p: BI_P, strong: BI_Strong, em: BI_Em, a: BI_A,
  blockquote: BI_Blockquote, hr: BI_Hr,
  ul: BI_Ul, ol: BI_Ol, li: BI_Li,
  table: BI_Table, thead: BI_Thead, tbody: BI_Tbody, tr: BI_Tr, th: BI_Th, td: BI_Td,
  code({ node, className, children }) {
    const isBlock = node?.parent?.tagName === 'pre';
    if (isBlock) return <CodeBlock className={className}>{children}</CodeBlock>;
    return <code className="bg-teal/10 text-taupe font-mono text-[11px] px-1.5 py-0.5 rounded border border-teal/20 mx-0.5">{children}</code>;
  },
  pre({ children }) { return <>{children}</>; },
};

function ReportRenderer({ text }) {
  if (!text) return null;
  const normalised = text
    .split('\n')
    .filter(line => {
      const t = line.trim();
      const stripped = t.replace(/^[#*\-.\s\d>•◦▪]+/, '').replace(/[*]+$/, '').trim();
      if (/^PANEL\s*[-_]\s*[\d\-]+$/i.test(stripped)) return false;
      if (/^\{\{.*\}\}\s*$/.test(t)) return false;
      return true;
    })
    .map(line => {
      const t = line.trim();
      if (/^-{3,}$/.test(t) || /^={3,}$/.test(t) || /^\*{3,}$/.test(t)) return '---';
      return line.replace(/PANEL\s*[-_]\s*[\d\-]+/gi, '').replace(/\s{2,}/g, ' ');
    })
    .join('\n');
  return (
    <div className="bi-markdown space-y-0.5 font-sans">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents} skipHtml={false}>
        {normalised}
      </ReactMarkdown>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 2 — Static Data
// ─────────────────────────────────────────────────────────────────────────────

const getSteps = (lang) => [
  { id: 1, label: t(lang, 'step1Label'), icon: Globe },
  { id: 2, label: t(lang, 'step2Label'), icon: MapPin },
  { id: 3, label: t(lang, 'step3Label'), icon: Layers },
  { id: 4, label: t(lang, 'step4Label'), icon: Building2 },
  { id: 5, label: t(lang, 'step5Label'), icon: Coins },
  { id: 6, label: t(lang, 'step6Label'), icon: Briefcase },
  { id: 7, label: t(lang, 'step7Label'), icon: Sparkles },
];

const LANGUAGES = [
  'English', 'हिन्दी (Hindi)', 'தமிழ் (Tamil)', 'मराठी (Marathi)',
  'বাংলা (Bengali)', 'తెలుగు (Telugu)', 'ಕನ್ನಡ (Kannada)',
  'മലയാളം (Malayalam)', 'ગુજરાતી (Gujarati)', 'ଓଡ଼ିଆ (Odia)',
  'ਪੰਜਾਬੀ (Punjabi)', 'অসমীয়া (Assamese)', 'Other Language',
];

const getScales = (lang) => [
  { id: 'nano',   label: t(lang, 'scale_nano_label'),   desc: t(lang, 'scale_nano_desc') },
  { id: 'micro',  label: t(lang, 'scale_micro_label'),  desc: t(lang, 'scale_micro_desc') },
  { id: 'small',  label: t(lang, 'scale_small_label'),  desc: t(lang, 'scale_small_desc') },
  { id: 'medium', label: t(lang, 'scale_medium_label'), desc: t(lang, 'scale_medium_desc') },
  { id: 'large',  label: t(lang, 'scale_large_label'),  desc: t(lang, 'scale_large_desc') },
  { id: 'export', label: t(lang, 'scale_export_label'), desc: t(lang, 'scale_export_desc') },
  { id: 'other',  label: t(lang, 'scale_other_label'),  desc: t(lang, 'scale_other_desc') },
];

const getBusinesses = (lang) => [
  { id: 'dairy',      label: t(lang, 'biz_dairy_label'),      desc: t(lang, 'biz_dairy_desc') },
  { id: 'agri',       label: t(lang, 'biz_agri_label'),       desc: t(lang, 'biz_agri_desc') },
  { id: 'solar',      label: t(lang, 'biz_solar_label'),      desc: t(lang, 'biz_solar_desc') },
  { id: 'organic',    label: t(lang, 'biz_organic_label'),    desc: t(lang, 'biz_organic_desc') },
  { id: 'poultry',    label: t(lang, 'biz_poultry_label'),    desc: t(lang, 'biz_poultry_desc') },
  { id: 'food',       label: t(lang, 'biz_food_label'),       desc: t(lang, 'biz_food_desc') },
  { id: 'logistics',  label: t(lang, 'biz_logistics_label'),  desc: t(lang, 'biz_logistics_desc') },
  { id: 'retail',     label: t(lang, 'biz_retail_label'),     desc: t(lang, 'biz_retail_desc') },
  { id: 'tech',       label: t(lang, 'biz_tech_label'),       desc: t(lang, 'biz_tech_desc') },
  { id: 'handicraft', label: t(lang, 'biz_handicraft_label'), desc: t(lang, 'biz_handicraft_desc') },
  { id: 'herbal',     label: t(lang, 'biz_herbal_label'),     desc: t(lang, 'biz_herbal_desc') },
  { id: 'tourism',    label: t(lang, 'biz_tourism_label'),    desc: t(lang, 'biz_tourism_desc') },
  { id: 'other',      label: t(lang, 'biz_other_label'),      desc: t(lang, 'biz_other_desc') },
];

const getInvestments = (lang) => [
  { id: 'seed',       label: t(lang, 'inv_seed_label'),       note: t(lang, 'inv_seed_note') },
  { id: 'low',        label: t(lang, 'inv_low_label'),        note: t(lang, 'inv_low_note') },
  { id: 'mid1',       label: t(lang, 'inv_mid1_label'),       note: t(lang, 'inv_mid1_note') },
  { id: 'mid2',       label: t(lang, 'inv_mid2_label'),       note: t(lang, 'inv_mid2_note') },
  { id: 'high',       label: t(lang, 'inv_high_label'),       note: t(lang, 'inv_high_note') },
  { id: 'growth',     label: t(lang, 'inv_growth_label'),     note: t(lang, 'inv_growth_note') },
  { id: 'enterprise', label: t(lang, 'inv_enterprise_label'), note: t(lang, 'inv_enterprise_note') },
  { id: 'other',      label: t(lang, 'inv_other_label'),      note: t(lang, 'inv_other_note') },
];

const getExperiences = (lang) => [
  { id: 'first',       label: t(lang, 'exp_first_label'),       desc: t(lang, 'exp_first_desc') },
  { id: 'family',      label: t(lang, 'exp_family_label'),      desc: t(lang, 'exp_family_desc') },
  { id: 'skilled',     label: t(lang, 'exp_skilled_label'),     desc: t(lang, 'exp_skilled_desc') },
  { id: 'exservice',   label: t(lang, 'exp_exservice_label'),   desc: t(lang, 'exp_exservice_desc') },
  { id: 'farmer',      label: t(lang, 'exp_farmer_label'),      desc: t(lang, 'exp_farmer_desc') },
  { id: 'experienced', label: t(lang, 'exp_experienced_label'), desc: t(lang, 'exp_experienced_desc') },
  { id: 'other',       label: t(lang, 'exp_other_label'),       desc: t(lang, 'exp_other_desc') },
];

const getLoadingPhrases = (lang) => [
  t(lang, 'phrase1'),
  t(lang, 'phrase2'),
  t(lang, 'phrase3'),
  t(lang, 'phrase4'),
  t(lang, 'phrase5'),
  t(lang, 'phrase6'),
  t(lang, 'phrase7'),
];

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 3 — Session storage helpers
// ─────────────────────────────────────────────────────────────────────────────

const SK = {
  STEP: 'BI_STEP', LOC_MODE: 'BI_LOC_MODE', PIN: 'BI_PIN',
  LOC_INPUT: 'BI_LOC_INPUT', CUSTOM: 'BI_CUSTOM',
  SEL: 'BI_SEL', R_STATE: 'BI_R_STATE', R_TEXT: 'BI_R_TEXT',
};
const ss   = (k)    => { try { return sessionStorage.getItem(k);    } catch { return null; } };
const sset = (k, v) => { try { sessionStorage.setItem(k, v);        } catch { /* noop */ } };
const srem = (k)    => { try { sessionStorage.removeItem(k);        } catch { /* noop */ } };

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 4 — Wizard (inner component, not exported)
// ─────────────────────────────────────────────────────────────────────────────

function Wizard({ goIdleTick = 0, hardResetTick = 0, onLangSelect }) {
  const scrollRef = useRef(null);

  const [currentStep,   setCurrentStep]   = useState(() => { const s = ss(SK.STEP); return s ? parseInt(s, 10) : 1; });
  const [locationMode,  setLocationMode]  = useState(() => ss(SK.LOC_MODE) || 'auto');
  const [pinCodeInput,  setPinCodeInput]  = useState(() => ss(SK.PIN)       || '');
  const [manualInput,   setManualInput]   = useState(() => ss(SK.LOC_INPUT) || '');
  const [customInputs,  setCustomInputs]  = useState(() => { const s = ss(SK.CUSTOM); return s ? JSON.parse(s) : { language: '', scale: '', business: '', investment: '', experience: '' }; });
  const [selections,    setSelections]    = useState(() => { const s = ss(SK.SEL); return s ? JSON.parse(s) : { language: 'English', location: '', scale: '', business: '', investment: '', experience: '' }; });
  const [reportState,   setReportState]   = useState(() => ss(SK.R_STATE) || 'idle');
  const [reportText,    setReportText]    = useState(() => ss(SK.R_TEXT)  || '');
  const [reportError,   setReportError]   = useState('');
  const [phraseIdx,     setPhraseIdx]     = useState(0);
  const [sessionId]                       = useState(() => 'BI-' + Math.random().toString(36).substring(2, 9) + '-' + Date.now());

  const lang = selections.language || 'English';
  const STEPS = getSteps(lang);
  const SCALES = getScales(lang);
  const BUSINESSES = getBusinesses(lang);
  const INVESTMENTS = getInvestments(lang);
  const EXPERIENCES = getExperiences(lang);
  const LOADING_PHRASES = getLoadingPhrases(lang);

  useEffect(() => {
    if (onLangSelect) onLangSelect(lang);
  }, [lang, onLangSelect]);

  // Scroll to top on step change
  useEffect(() => { scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' }); }, [currentStep]);

  // Persist state
  useEffect(() => {
    sset(SK.STEP,     currentStep.toString());
    sset(SK.LOC_MODE, locationMode);
    sset(SK.PIN,      pinCodeInput);
    sset(SK.LOC_INPUT,manualInput);
    sset(SK.CUSTOM,   JSON.stringify(customInputs));
    sset(SK.SEL,      JSON.stringify(selections));
  }, [currentStep, locationMode, pinCodeInput, manualInput, customInputs, selections]);
  useEffect(() => { sset(SK.R_STATE, reportState); }, [reportState]);
  useEffect(() => { sset(SK.R_TEXT,  reportText);  }, [reportText]);

  // Loading phrase rotation
  useEffect(() => {
    if (reportState !== 'loading') return;
    const t = setInterval(() => setPhraseIdx(p => (p + 1) % LOADING_PHRASES.length), 2400);
    return () => clearInterval(t);
  }, [reportState]);

  // Signal: first Reset click → go to form, keep selections
  useEffect(() => {
    if (goIdleTick === 0) return;
    setReportState('idle');
    setReportError('');
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goIdleTick]);

  // Signal: second Reset click → full wipe
  useEffect(() => {
    if (hardResetTick === 0) return;
    setCurrentStep(1);
    setReportState('idle'); setReportText(''); setReportError('');
    srem(SK.R_STATE); srem(SK.R_TEXT);
    setSelections({ language: 'English', location: '', scale: '', business: '', investment: '', experience: '' });
    setPinCodeInput(''); setManualInput('');
    setCustomInputs({ language: '', scale: '', business: '', investment: '', experience: '' });
    setLocationMode('auto');
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hardResetTick]);

  // Helpers
  const updateSel = (k, v) => setSelections(p => ({ ...p, [k]: v }));
  const handleCustomChange = (k, v) => {
    setCustomInputs(p => ({ ...p, [k]: v }));
    setSelections(p => ({ ...p, [k]: v ? `Custom: ${v}` : 'Custom / Other' }));
  };

  // Generate report via backend proxy
  const handleGenerateReport = async () => {
    setReportState('loading'); setReportError(''); setPhraseIdx(0);
    const loc = selections.location || 'India';
    const targetLanguage = selections.language || 'English';
    const prompt = `CRITICAL LANGUAGE REQUIREMENT: You MUST generate the ENTIRE MSME Business Feasibility Report and Market Analysis STRICTLY in the following language: ${targetLanguage}.
Do NOT write in English unless ${targetLanguage} is English. All headings, subheadings, explanations, metrics, bullet points, recommendations, checklists, and tables MUST be translated into and written in ${targetLanguage}.

Venture Profile & Setup:
- Target Language: ${targetLanguage}
- Target Location: ${loc}
- Scale of Business: ${selections.scale || 'Micro Enterprise'}
- Proposed Business Sector / Idea: ${selections.business || 'Dairy Processing & Livestock'}
- Estimated Investment Budget: ${selections.investment || '₹1 – ₹3 Lakhs'}
- Prior Entrepreneurial Experience: ${selections.experience || 'First-Time Entrepreneur'}

Please structure the feasibility report with clear headings, bullet points, and key metrics covering:
1. Executive Summary & Market Opportunity in ${loc}
2. Required Setup, Machinery & Daily Operations
3. Financial Projections, Unit Economics & Payback Period
4. Applicable Government Loan Schemes & Subsidies (e.g. Mudra, PMEGP, CGTMSE)
5. Mandatory Licenses & Regulatory Compliance Checklist (FSSAI, GST, MSME Udyam)
6. Key Risk Factors & Actionable 90-Day Execution Roadmap
7. Local Competitor Landscape in ${loc}

Format all tables using clean Markdown tables with proper header rows, separator rows, and aligned data columns.
REMEMBER: The entire report MUST be written 100% in ${targetLanguage}.`;
    try {
      const res = await fetch(`${getApiBaseUrl()}/bi/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ sessionId, message: prompt, personId: '' }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `n8n BI backend responded with HTTP ${res.status}`);
      }
      const data = await res.json();
      setReportText(data.output || data.response || data.text || data.message || JSON.stringify(data) || 'Report generation complete.');
      setReportState('success');
    } catch (err) {
      setReportError(err.message || 'Failed to generate report via n8n. Please check your n8n workflow and try again.');
      setReportState('error');
    }
  };

  // PDF export
  const handleDownloadPDF = () => {
    const win = window.open('', '_blank');
    if (!win) return;
    const clean = reportText
      .split('\n')
      .filter(l => {
        const t = l.trim();
        const s = t.replace(/^[#*\-.\s\d>•◦▪]+/, '').replace(/[*]+$/, '').trim();
        if (/^PANEL\s*[-_]\s*[\d\-]+$/i.test(s)) return false;
        if (/^\{\{.*\}\}\s*$/.test(t)) return false;
        return true;
      })
      .map(l => {
        const t = l.trim();
        if (/^-{3,}$/.test(t) || /^={3,}$/.test(t) || /^\*{3,}$/.test(t)) return '---';
        return l.replace(/PANEL\s*[-_]\s*[\d\-]+/gi, '').replace(/\s{2,}/g, ' ');
      })
      .join('\n');
    const html = marked.parse(clean);
    win.document.write(`<!DOCTYPE html><html><head>
      <title>BI_Report_${(selections.business || 'Venture').replace(/\s+/g,'_')}</title>
      <style>
        @page{size:A4;margin:18mm}
        body{font-family:'Segoe UI',sans-serif;color:#3A2E25;line-height:1.6;font-size:13px;margin:0;padding:0}
        .wrap{max-width:820px;margin:0 auto;padding:40px 48px}
        .hdr{border-bottom:3px solid #0B4F4A;padding-bottom:12px;margin-bottom:20px;display:flex;justify-content:space-between;align-items:center}
        .logo{font-size:22px;font-weight:900;color:#3A2E25}.logo span{color:#C9A227}
        .meta{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;background:#FDF6ED;border:1px solid #DCCFC0;padding:14px;border-radius:8px;margin-bottom:24px}
        .ml{font-size:9px;text-transform:uppercase;color:#9A8678;font-weight:700;display:block;margin-bottom:2px}
        .mv{font-weight:700;color:#3A2E25}
        h1,h2,h3{color:#3A2E25;font-weight:800;margin-top:24px;margin-bottom:10px}
        h1{font-size:18px;border-bottom:2px solid #DCCFC0;padding-bottom:6px}
        h2{font-size:16px;border-left:4px solid #0B4F4A;padding-left:10px}
        h3{font-size:14px} strong{color:#3A2E25}
        table{width:100%;border-collapse:collapse;margin:16px 0;font-size:12px}
        th,td{border:1px solid #DCCFC0;padding:8px 12px;text-align:left}
        th{background:#F6F3EB;font-weight:700;text-transform:uppercase;font-size:10px}
        tr:nth-child(even){background:#FDF6ED}
        ul,ol{padding-left:24px;margin-bottom:14px} li{margin-bottom:6px}
        hr{border:0;border-top:1px solid #DCCFC0;margin:24px 0}
        .ft{margin-top:40px;padding-top:12px;border-top:1px solid #DCCFC0;text-align:center;font-size:10px;color:#9A8678}
        @media print{.wrap{max-width:100%;padding:0}}
      </style></head><body><div class="wrap">
      <div class="hdr"><div class="logo">FINEXA <span>AI</span></div><div style="font-size:11px;color:#9A8678;font-weight:600;text-transform:uppercase">MSME Feasibility Blueprint</div></div>
      <div class="meta">
        <div><span class="ml">Location</span><span class="mv">${selections.location||'N/A'}</span></div>
        <div><span class="ml">Language</span><span class="mv">${selections.language}</span></div>
        <div><span class="ml">Business</span><span class="mv">${selections.business||'N/A'}</span></div>
        <div><span class="ml">Scale</span><span class="mv">${selections.scale||'N/A'}</span></div>
        <div><span class="ml">Investment</span><span class="mv">${selections.investment||'N/A'}</span></div>
        <div><span class="ml">Experience</span><span class="mv">${selections.experience||'N/A'}</span></div>
      </div>
      <div>${html}</div>
      <div class="ft">Generated by FINEXA AI Business Intelligence • ${new Date().toLocaleDateString()}</div>
      </div><script>window.onload=()=>setTimeout(()=>window.print(),300)</script></body></html>`);
    win.document.close();
  };

  const selectionItems = [
    { icon: Globe,     label: t(lang, 'step1Label'), val: selections.language   },
    { icon: MapPin,    label: t(lang, 'step2Label'), val: selections.location   },
    { icon: Layers,    label: t(lang, 'step3Label'), val: selections.scale      },
    { icon: Building2, label: t(lang, 'step4Label'), val: selections.business   },
    { icon: Coins,     label: t(lang, 'step5Label'), val: selections.investment  },
    { icon: Briefcase, label: t(lang, 'step6Label'), val: selections.experience  },
  ];

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div ref={scrollRef} className="w-full overflow-y-auto">

      {/* LOADING */}
      {reportState === 'loading' && (
        <div className="flex flex-col items-center justify-center min-h-[70vh] py-16 px-6 text-center space-y-8 max-w-xl mx-auto">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-burgundy to-teal animate-pulse blur-2xl opacity-30 absolute -inset-3" />
            <div className="w-20 h-20 rounded-2xl bg-ivory border-2 border-teal/50 flex items-center justify-center shadow-xl relative z-10">
              <Sparkles size={36} className="text-teal animate-bounce" />
            </div>
          </div>
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-teal px-3 py-1 rounded-full bg-teal/10 border border-teal/20">
              {t(lang, 'loadingTitle')}
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-extrabold text-ink tracking-tight min-h-[3rem] flex items-center justify-center">
              {LOADING_PHRASES[phraseIdx]}
            </h2>
            <p className="text-sm text-taupe font-medium max-w-md mx-auto">
              {t(lang, 'prepAnalysis')} <span className="text-burgundy font-bold">{selections.business || 'your venture'}</span>
              {selections.location && <> {t(lang, 'inLocation')} <span className="text-teal font-bold">{selections.location}</span></>}
            </p>
          </div>
          <div className="w-full bg-beige/40 h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-burgundy via-teal to-gold h-full w-2/3 animate-pulse rounded-full" />
          </div>
          <div className="grid grid-cols-2 gap-3 w-full text-left pt-4 border-t border-beige/60">
            {[t(lang, 'loadingTask1'), t(lang, 'loadingTask2'), t(lang, 'loadingTask3'), t(lang, 'loadingTask4')].map((taskText, i) => (
              <div key={taskText} className="flex items-center gap-2 text-sm text-taupe">
                {i < 2 ? <CheckCircle2 size={15} className="text-teal shrink-0" /> : i === 2 ? <Loader2 size={15} className="text-burgundy animate-spin shrink-0" /> : <div className="w-3.5 h-3.5 rounded-full border border-beige shrink-0" />}
                <span>{taskText}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUCCESS */}
      {reportState === 'success' && (
        <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 space-y-6">
          <div className="p-5 rounded-2xl bg-white border border-beige/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-teal/10 border border-teal/20 text-teal text-[10px] font-mono font-bold uppercase">{t(lang, 'officialBlueprint')}</span>
                {selections.location && <span className="text-xs text-taupe font-mono">{selections.location}</span>}
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-extrabold text-ink tracking-tight">
                {t(lang, 'feasibilityAnalysis')} {selections.business || 'Custom Business Venture'}
              </h2>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button onClick={handleDownloadPDF} className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-teal text-ivory font-black text-xs uppercase tracking-wider hover:bg-teal/90 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer">
                <Download size={14} /><span>{t(lang, 'downloadPdf')}</span>
              </button>
              <button onClick={() => setReportState('idle')} className="px-3 py-2.5 rounded-xl bg-ivory border border-beige text-taupe hover:text-ink hover:bg-beige/30 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer">
                <RefreshCw size={14} /><span className="hidden sm:inline">{t(lang, 'modify')}</span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {selectionItems.map(({ icon: Icon, label, val }) => (
              <div key={label} className="p-2.5 rounded-xl bg-white border border-beige/60">
                <span className="text-[9px] uppercase font-mono text-taupe/60 block">{label}</span>
                <strong className="text-xs text-ink block mt-0.5 truncate">{val || '—'}</strong>
              </div>
            ))}
          </div>
          <div className="p-6 rounded-2xl bg-white border border-beige/60 shadow-md">
            <ReportRenderer text={reportText} />
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-beige/60">
            <div className="flex items-center gap-2 text-sm text-taupe">
              <CheckCircle2 size={16} className="text-teal" />
              <span>{t(lang, 'verifiedBy')}</span>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button onClick={handleDownloadPDF} className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-teal/10 border border-teal/20 text-teal hover:bg-teal/20 font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer">
                <Printer size={14} /><span>{t(lang, 'printPdf')}</span>
              </button>
              <Link to="/chatbot" className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-ivory border border-beige text-taupe hover:text-ink font-bold text-xs transition-all flex items-center justify-center gap-2">
                <MessageSquare size={14} /><span>{t(lang, 'askChatbot')}</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ERROR */}
      {reportState === 'error' && (
        <div className="max-w-md mx-auto px-6 py-16 text-center space-y-4">
          <AlertCircle size={40} className="text-burgundy/60 mx-auto" />
          <div>
            <h3 className="font-serif font-extrabold text-lg text-ink">{t(lang, 'reportFailed')}</h3>
            <p className="text-sm text-taupe mt-1">{reportError}</p>
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={handleGenerateReport} className="flex-1 py-2.5 rounded-xl bg-burgundy text-ivory font-bold text-xs uppercase tracking-wider hover:bg-burgundy/90 transition-all cursor-pointer">{t(lang, 'retry')}</button>
            <Link to="/chatbot" className="flex-1 py-2.5 rounded-xl bg-ivory border border-beige text-taupe hover:text-ink font-bold text-xs text-center transition-all">{t(lang, 'openChatbot')}</Link>
          </div>
        </div>
      )}

      {/* IDLE — Questionnaire */}
      {reportState === 'idle' && (
        <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-8 pb-16">

          {/* Stepper */}
          <div className="mb-10 overflow-x-auto no-scrollbar">
            <div className="flex items-center justify-between min-w-[560px]">
              {STEPS.map((step, idx) => {
                const done   = step.id < currentStep;
                const active = step.id === currentStep;
                return (
                  <React.Fragment key={step.id}>
                    <button onClick={() => setCurrentStep(step.id)} className="flex flex-col items-center gap-1.5 cursor-pointer focus:outline-none group">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${done ? 'bg-teal text-ivory shadow-md' : active ? 'bg-ivory border-2 border-teal text-teal shadow-lg ring-4 ring-teal/10' : 'bg-ivory border border-beige text-taupe/50'}`}>
                        {done ? <Check size={15} className="stroke-[3]" /> : step.id}
                      </div>
                      <span className={`text-[10px] font-semibold transition-colors ${active ? 'text-teal font-bold' : done ? 'text-ink' : 'text-taupe/50'}`}>{step.label}</span>
                    </button>
                    {idx < STEPS.length - 1 && <div className={`flex-1 h-[2px] mx-2 transition-colors ${step.id < currentStep ? 'bg-teal' : 'bg-beige'}`} />}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Step title */}
          <div className="mb-7">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-teal">{t(lang, 'step')} {currentStep} {t(lang, 'of')} {STEPS.length}</span>
            <h1 className="mt-1 text-2xl sm:text-3xl font-serif font-extrabold text-ink tracking-tight">
              {currentStep === 1 && t(lang, 'step1Title')}
              {currentStep === 2 && t(lang, 'step2Title')}
              {currentStep === 3 && t(lang, 'step3Title')}
              {currentStep === 4 && t(lang, 'step4Title')}
              {currentStep === 5 && t(lang, 'step5Title')}
              {currentStep === 6 && t(lang, 'step6Title')}
              {currentStep === 7 && t(lang, 'step7Title')}
            </h1>
            <p className="mt-1.5 text-sm text-taupe">
              {currentStep === 1 && t(lang, 'step1Sub')}
              {currentStep === 2 && t(lang, 'step2Sub')}
              {currentStep === 3 && t(lang, 'step3Sub')}
              {currentStep === 4 && t(lang, 'step4Sub')}
              {currentStep === 5 && t(lang, 'step5Sub')}
              {currentStep === 6 && t(lang, 'step6Sub')}
              {currentStep === 7 && t(lang, 'step7Sub')}
            </p>
          </div>

          {/* Step 1 — Language */}
          {currentStep === 1 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {LANGUAGES.map(langName => {
                const isOther = langName === 'Other Language';
                const sel = selections.language === langName || (isOther && (selections.language === 'Other Language' || selections.language.startsWith('Custom:')));
                if (isOther && sel) return (
                  <div key={langName} className="col-span-2 sm:col-span-3 p-4 rounded-2xl border border-teal bg-teal/8 ring-2 ring-teal/15 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <span className="text-sm font-bold text-ink shrink-0">{t(lang, 'customLangTitle')}</span>
                    <input autoFocus type="text" placeholder="e.g. Konkani, Mizo, Tulu..." value={customInputs.language}
                      onChange={e => handleCustomChange('language', e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-ivory border border-beige text-sm text-ink focus:outline-none focus:border-teal" />
                  </div>
                );
                return (
                  <button key={langName}
                    onClick={() => isOther ? updateSel('language', customInputs.language ? `Custom: ${customInputs.language}` : 'Other Language') : updateSel('language', langName)}
                    className={`p-4 rounded-2xl border text-center font-semibold text-sm transition-all cursor-pointer ${sel ? 'border-teal bg-teal/8 text-ink ring-2 ring-teal/15 shadow-md' : 'border-beige bg-white text-taupe hover:text-ink hover:border-camel/60 hover:bg-cream/60'}`}
                  >{langName}</button>
                );
              })}
            </div>
          )}

          {/* Step 2 — Location */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { mode: 'auto',   title: t(lang, 'locAutoTitle'), sub: t(lang, 'locAutoSub'), badge: t(lang, 'recommended'), onSelect: () => { setLocationMode('auto'); updateSel('location', 'Coimbatore, Tamil Nadu'); } },
                  { mode: 'map',    title: t(lang, 'locMapTitle'),  sub: t(lang, 'locMapSub'), onSelect: () => { setLocationMode('map'); updateSel('location', 'Selected on Interactive Map'); } },
                ].map(({ mode, title, sub, badge, onSelect }) => (
                  <div key={mode} onClick={onSelect} className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col gap-4 ${locationMode === mode ? 'border-teal bg-teal/8 ring-2 ring-teal/15 shadow-md' : 'border-beige bg-white hover:border-camel/60'}`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${locationMode === mode ? 'border-teal bg-teal' : 'border-beige'}`}>
                        {locationMode === mode && <span className="w-2 h-2 rounded-full bg-ivory" />}
                      </div>
                      <div><h3 className="font-bold text-base text-ink">{title}</h3><p className="text-sm text-taupe mt-0.5">{sub}</p></div>
                    </div>
                    {badge && <div className="flex items-center justify-between"><span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gold/15 text-camel border border-gold/20 font-mono">{badge}</span><MapPin size={20} className="text-teal" /></div>}
                  </div>
                ))}
                <div onClick={() => setLocationMode('pin')} className={`p-5 rounded-2xl border cursor-pointer transition-all ${locationMode === 'pin' ? 'border-teal bg-teal/8 ring-2 ring-teal/15 shadow-md' : 'border-beige bg-white hover:border-camel/60'}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${locationMode === 'pin' ? 'border-teal bg-teal' : 'border-beige'}`}>{locationMode === 'pin' && <span className="w-2 h-2 rounded-full bg-ivory" />}</div>
                    <div className="w-full">
                      <h3 className="font-bold text-base text-ink">{t(lang, 'locPinTitle')}</h3>
                      <p className="text-sm text-taupe mt-0.5">{t(lang, 'locPinSub')}</p>
                      {locationMode === 'pin' && <input autoFocus type="text" maxLength={6} placeholder="e.g. 641001" value={pinCodeInput} onChange={e => { setPinCodeInput(e.target.value); if (e.target.value.length === 6) updateSel('location', `PIN: ${e.target.value}`); }} className="mt-3 w-full px-3 py-2 rounded-xl bg-ivory border border-beige text-sm text-ink focus:outline-none focus:border-teal" />}
                    </div>
                  </div>
                </div>
                <div onClick={() => setLocationMode('manual')} className={`p-5 rounded-2xl border cursor-pointer transition-all ${locationMode === 'manual' ? 'border-teal bg-teal/8 ring-2 ring-teal/15 shadow-md' : 'border-beige bg-white hover:border-camel/60'}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${locationMode === 'manual' ? 'border-teal bg-teal' : 'border-beige'}`}>{locationMode === 'manual' && <span className="w-2 h-2 rounded-full bg-ivory" />}</div>
                    <div className="w-full">
                      <h3 className="font-bold text-base text-ink">{t(lang, 'locManualTitle')}</h3>
                      <p className="text-sm text-taupe mt-0.5">{t(lang, 'locManualSub')}</p>
                      {locationMode === 'manual' && <input autoFocus type="text" placeholder="e.g. Pollachi, Coimbatore" value={manualInput} onChange={e => { setManualInput(e.target.value); updateSel('location', e.target.value); }} className="mt-3 w-full px-3 py-2 rounded-xl bg-ivory border border-beige text-sm text-ink focus:outline-none focus:border-teal" />}
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-xl border border-teal/20 bg-teal/6 flex items-center gap-3 text-sm text-taupe">
                <Shield size={18} className="text-teal shrink-0" />
                <div><strong className="text-ink block font-semibold">{t(lang, 'privacyTitle')}</strong><span>{t(lang, 'privacySub')}</span></div>
              </div>
            </div>
          )}

          {/* Step 3 — Scale */}
          {currentStep === 3 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SCALES.map(opt => {
                const isOther = opt.id === 'other';
                const sel = selections.scale === opt.label || (isOther && (selections.scale === opt.label || selections.scale.startsWith('Custom:')));
                if (isOther && sel) return (
                  <div key={opt.id} className="col-span-1 sm:col-span-2 p-5 rounded-2xl border border-teal bg-teal/8 ring-2 ring-teal/15 space-y-3">
                    <h3 className="font-bold text-base text-ink">{t(lang, 'customScaleTitle')}</h3>
                    <p className="text-sm text-taupe">{opt.desc}</p>
                    <input autoFocus type="text" placeholder="e.g. Village Cooperative with 50 local farmers..." value={customInputs.scale} onChange={e => handleCustomChange('scale', e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-ivory border border-beige text-sm text-ink focus:outline-none focus:border-teal" />
                  </div>
                );
                return (
                  <div key={opt.id} onClick={() => isOther ? updateSel('scale', customInputs.scale ? `Custom: ${customInputs.scale}` : opt.label) : updateSel('scale', opt.label)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all ${sel ? 'border-teal bg-teal/8 ring-2 ring-teal/15 shadow-md' : 'border-beige bg-white hover:border-camel/60 hover:bg-cream/60'}`}>
                    <h3 className="font-bold text-base text-ink">{opt.label}</h3>
                    <p className="text-sm text-taupe mt-1">{opt.desc}</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Step 4 — Business */}
          {currentStep === 4 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {BUSINESSES.map(opt => {
                const isOther = opt.id === 'other';
                const sel = selections.business === opt.label || (isOther && (selections.business === opt.label || selections.business.startsWith('Custom:')));
                if (isOther && sel) return (
                  <div key={opt.id} className="col-span-1 sm:col-span-2 p-4 rounded-2xl border border-teal bg-teal/8 ring-2 ring-teal/15 space-y-3">
                    <h3 className="font-bold text-base text-ink">{t(lang, 'customBizTitle')}</h3>
                    <p className="text-sm text-taupe">{opt.desc}</p>
                    <input autoFocus type="text" placeholder="e.g. Drone spray service for precision agriculture..." value={customInputs.business} onChange={e => handleCustomChange('business', e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-ivory border border-beige text-sm text-ink focus:outline-none focus:border-teal" />
                  </div>
                );
                return (
                  <div key={opt.id} onClick={() => isOther ? updateSel('business', customInputs.business ? `Custom: ${customInputs.business}` : opt.label) : updateSel('business', opt.label)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start justify-between gap-2 ${sel ? 'border-teal bg-teal/8 ring-2 ring-teal/15 shadow-md' : 'border-beige bg-white hover:border-camel/60 hover:bg-cream/60'}`}>
                    <div><h3 className="font-bold text-sm text-ink">{opt.label}</h3><p className="text-xs text-taupe mt-1 leading-snug">{opt.desc}</p></div>
                    {sel && <Check size={16} className="text-teal shrink-0 mt-0.5" />}
                  </div>
                );
              })}
            </div>
          )}

          {/* Step 5 — Investment */}
          {currentStep === 5 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {INVESTMENTS.map(opt => {
                const isOther = opt.id === 'other';
                const sel = selections.investment === opt.label || (isOther && (selections.investment === opt.label || selections.investment.startsWith('Custom:')));
                if (isOther && sel) return (
                  <div key={opt.id} className="col-span-1 sm:col-span-2 md:col-span-4 p-4 rounded-2xl border border-teal bg-teal/8 ring-2 ring-teal/15 space-y-3">
                    <h3 className="font-bold text-base text-ink">{t(lang, 'customInvTitle')}</h3>
                    <p className="text-sm text-taupe">{opt.note}</p>
                    <input autoFocus type="text" placeholder="e.g. ₹15 Lakhs bank loan + ₹5 Lakhs personal savings..." value={customInputs.investment} onChange={e => handleCustomChange('investment', e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-ivory border border-beige text-sm text-ink focus:outline-none focus:border-teal" />
                  </div>
                );
                return (
                  <div key={opt.id} onClick={() => isOther ? updateSel('investment', customInputs.investment ? `Custom: ${customInputs.investment}` : opt.label) : updateSel('investment', opt.label)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${sel ? 'border-teal bg-teal/8 ring-2 ring-teal/15 shadow-md' : 'border-beige bg-white hover:border-camel/60 hover:bg-cream/60'}`}>
                    <h3 className="font-bold text-sm text-ink">{opt.label}</h3>
                    <span className="text-xs text-teal font-mono mt-2 block leading-tight">{opt.note}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Step 6 — Experience */}
          {currentStep === 6 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {EXPERIENCES.map(opt => {
                const isOther = opt.id === 'other';
                const sel = selections.experience === opt.label || (isOther && (selections.experience === opt.label || selections.experience.startsWith('Custom:')));
                if (isOther && sel) return (
                  <div key={opt.id} className="col-span-1 sm:col-span-2 p-5 rounded-2xl border border-teal bg-teal/8 ring-2 ring-teal/15 space-y-3">
                    <h3 className="font-bold text-base text-ink">{t(lang, 'customExpTitle')}</h3>
                    <p className="text-sm text-taupe">{opt.desc}</p>
                    <input autoFocus type="text" placeholder="e.g. 10 years in logistics & cold chain supply management..." value={customInputs.experience} onChange={e => handleCustomChange('experience', e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-ivory border border-beige text-sm text-ink focus:outline-none focus:border-teal" />
                  </div>
                );
                return (
                  <div key={opt.id} onClick={() => isOther ? updateSel('experience', customInputs.experience ? `Custom: ${customInputs.experience}` : opt.label) : updateSel('experience', opt.label)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all ${sel ? 'border-teal bg-teal/8 ring-2 ring-teal/15 shadow-md' : 'border-beige bg-white hover:border-camel/60 hover:bg-cream/60'}`}>
                    <h3 className="font-bold text-base text-ink">{opt.label}</h3>
                    <p className="text-sm text-taupe mt-1">{opt.desc}</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Step 7 — Review & Generate */}
          {currentStep === 7 && (
            <div className="p-6 rounded-2xl border border-beige bg-white shadow-md space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal/10 border border-teal/20 flex items-center justify-center text-teal"><Sparkles size={20} /></div>
                <div>
                  <h3 className="font-serif font-extrabold text-lg text-ink">{t(lang, 'blueprintReady')}</h3>
                  <p className="text-sm text-taupe">{t(lang, 'reviewConfig')}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {selectionItems.map(({ icon: Icon, label, val }) => (
                  <div key={label} className="p-3.5 rounded-xl bg-ivory border border-beige flex items-start gap-3">
                    <Icon size={16} className="text-teal shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] uppercase font-mono text-taupe/70 block">{label}</span>
                      <strong className="text-sm text-ink block mt-0.5">{val || <span className="text-taupe/50 font-normal">{t(lang, 'notSelected')}</span>}</strong>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={handleGenerateReport} className="w-full py-4 rounded-xl bg-burgundy text-ivory font-black text-sm uppercase tracking-wider shadow-lg hover:bg-burgundy/90 transition-all flex items-center justify-center gap-2 cursor-pointer">
                <Sparkles size={16} /><span>{t(lang, 'generateBtn')}</span>
              </button>
            </div>
          )}

          {/* Nav */}
          <div className="flex items-center justify-between pt-8 border-t border-beige/60 mt-8">
            <button onClick={() => setCurrentStep(p => Math.max(1, p - 1))} disabled={currentStep === 1}
              className={`px-6 py-2.5 rounded-xl border text-sm font-bold transition-all flex items-center gap-2 ${currentStep === 1 ? 'border-beige/30 text-taupe/30 cursor-not-allowed' : 'border-beige bg-white text-taupe hover:text-ink hover:bg-beige/20 cursor-pointer'}`}>
              <ArrowLeft size={15} /><span>{t(lang, 'back')}</span>
            </button>
            <button onClick={() => setCurrentStep(p => Math.min(7, p + 1))} disabled={currentStep === 7}
              className={`px-8 py-2.5 rounded-xl font-extrabold text-sm tracking-wide transition-all flex items-center gap-2 ${currentStep === 7 ? 'bg-beige/40 text-taupe/40 cursor-not-allowed' : 'bg-teal text-ivory hover:bg-teal/90 shadow-md cursor-pointer'}`}>
              <span>{t(lang, 'continue')}</span><ChevronRight size={15} />
            </button>
          </div>

          {/* Current Selection */}
          <div className="mt-10 pt-6 border-t border-beige/60">
            <p className="text-xs font-mono font-bold uppercase tracking-widest text-taupe/60 mb-4">{t(lang, 'currentSelection')}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {selectionItems.map(({ icon: Icon, label, val }) => (
                <div key={label} className="p-4 rounded-2xl bg-white border border-beige/80 flex items-center gap-3 shadow-sm">
                  <div className="w-9 h-9 rounded-xl bg-teal/10 border border-teal/15 flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-teal" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-taupe/60 block leading-none font-mono uppercase tracking-wide">{label}</span>
                    <span className="text-sm font-bold text-ink block mt-0.5 truncate">
                      {val || <span className="text-taupe/40 font-normal text-xs">{t(lang, 'notSelected')}</span>}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 5 — Page Shell (default export, registered in App.jsx at /business-intelligence)
// ─────────────────────────────────────────────────────────────────────────────

export default function BusinessIntelligence() {
  const [resetPhase,    setResetPhase]    = useState(0); // 0=normal, 1=warning
  const [goIdleTick,    setGoIdleTick]    = useState(0);
  const [hardResetTick, setHardResetTick] = useState(0);
  const [headerLang,    setHeaderLang]    = useState(() => {
    try {
      const s = sessionStorage.getItem(SK.SEL);
      return s ? JSON.parse(s).language || 'English' : 'English';
    } catch { return 'English'; }
  });
  const warnTimerRef = useRef(null);

  useEffect(() => {
    if (resetPhase === 1) {
      warnTimerRef.current = setTimeout(() => setResetPhase(0), 6000);
    }
    return () => clearTimeout(warnTimerRef.current);
  }, [resetPhase]);

  const handleReset = () => {
    if (resetPhase === 0) {
      setGoIdleTick(t => t + 1);
      setResetPhase(1);
    } else {
      clearTimeout(warnTimerRef.current);
      setHardResetTick(t => t + 1);
      setResetPhase(0);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-ivory text-ink font-sans dot-grid">
      <header className="h-16 pl-3 sm:pl-6 pr-24 bg-ivory/90 backdrop-blur-md border-b border-beige/40 flex items-center justify-between z-20 shrink-0 sticky top-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Link to="/" className="p-1.5 sm:p-2 rounded-full hover:bg-beige/30 transition-colors text-taupe hover:text-ink flex items-center gap-1.5 text-xs font-semibold shrink-0" title="Back to Home">
            <ArrowLeft size={16} /><span className="hidden sm:inline">{t(headerLang, 'home')}</span>
          </Link>
          <div className="h-4 w-[1px] bg-beige/60 hidden sm:block" />
          <div className="flex items-center gap-1.5 sm:gap-2 truncate">
            <span className="font-serif font-bold text-base sm:text-lg text-ink tracking-tight shrink-0">
              FINEXA<sup className="text-gold font-sans font-extrabold text-[10px] ml-0.5">AI</sup>
            </span>
            <span className="text-[8px] sm:text-[9px] uppercase tracking-widest font-extrabold bg-teal/10 text-teal px-1.5 sm:px-2 py-0.5 rounded-full truncate">
              {t(headerLang, 'biEngine')}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <AnimatePresence>
            {resetPhase === 1 && (
              <motion.div
                key="warn"
                initial={{ opacity: 0, x: 16, scale: 0.92 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 16, scale: 0.92 }}
                transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-camel/15 border border-camel/40 text-camel text-[10px] sm:text-[11px] font-semibold whitespace-nowrap shadow-sm"
              >
                <AlertTriangle size={12} className="shrink-0" />
                <span className="hidden xs:inline">{t(headerLang, 'clickToClear')}</span>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={handleReset}
            title={resetPhase === 1 ? 'Click again to clear all selections' : 'Return to form'}
            className={`flex items-center gap-1.5 text-sm font-semibold px-3 sm:px-4 py-2 sm:py-2.5 rounded-full transition-all cursor-pointer ${resetPhase === 1 ? 'bg-camel/10 text-camel border border-camel/30 hover:bg-camel/20 animate-pulse' : 'text-taupe hover:text-burgundy hover:bg-beige/30'}`}
          >
            <RotateCcw size={16} className={resetPhase === 1 ? 'animate-spin [animation-duration:3s]' : ''} />
            <span className="hidden sm:inline">{resetPhase === 1 ? t(headerLang, 'resetQ') : t(headerLang, 'reset')}</span>
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-auto">
        <Wizard goIdleTick={goIdleTick} hardResetTick={hardResetTick} onLangSelect={setHeaderLang} />
      </main>
    </div>
  );
}
