BIZRA Manual : 

import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  RotateCcw,
  X,
  MapPin,
  Check,
  ChevronRight,
  Shield,
  Bot,
  MessageSquare,
  Sparkles,
  Map,
  Compass,
  Building2,
  Coins,
  Briefcase,
  Layers,
  Globe,
  Loader2,
  Download,
  Printer,
  FileText,
  CheckCircle2,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { useResizable } from '../hooks/useResizable';
import ResponseRenderer from './ResponseRenderer';
import { marked } from 'marked';

const steps = [
  { id: 1, label: 'Language', icon: Globe },
  { id: 2, label: 'Location', icon: MapPin },
  { id: 3, label: 'Scale', icon: Layers },
  { id: 4, label: 'Business', icon: Building2 },
  { id: 5, label: 'Investment', icon: Coins },
  { id: 6, label: 'Experience', icon: Briefcase },
  { id: 7, label: 'Analysis', icon: Sparkles },
];

const languageOptions = [
  'English',
  'हिन्दी (Hindi)',
  'தமிழ் (Tamil)',
  'मराठी (Marathi)',
  'বাংলা (Bengali)',
  'తెలుగు (Telugu)',
  'ಕನ್ನಡ (Kannada)',
  'മലയാളം (Malayalam)',
  'ગુજરાતી (Gujarati)',
  'ଓଡ଼ିଆ (Odia)',
  'ਪੰਜਾਬੀ (Punjabi)',
  'অসমীয়া (Assamese)',
  'Other Language'
];

const scaleOptions = [
  { id: 'nano', label: 'Nano / Self-Employed', desc: 'Single-person artisan, mobile vendor, or home enterprise (< ₹50k capacity)' },
  { id: 'micro', label: 'Micro Enterprise', desc: 'Home-based unit, village shop, or single counter setup (₹50k - ₹1L capacity)' },
  { id: 'small', label: 'Small Scale Industry', desc: 'Block-level processing unit, small workshop, or assembly line' },
  { id: 'medium', label: 'Medium Enterprise', desc: 'District-level hub, producer organization (FPO), or cooperative venture' },
  { id: 'large', label: 'Scale-up / Regional Network', desc: 'Multi-district distribution network or retail franchise chain' },
  { id: 'export', label: 'Export-Oriented Unit', desc: 'Specialized production unit targeting national & international buyers' },
  { id: 'other', label: 'Other Custom Scale', desc: 'Specify your own custom business operational scale' }
];

const businessOptions = [
  { id: 'dairy', label: 'Dairy Processing & Livestock', desc: 'Milk collection, chilling, ghee, curd, cheese, and animal husbandry' },
  { id: 'agri', label: 'Agri-Processing & Grain Milling', desc: 'Flour milling, oil extraction, pulse processing, cold storage warehouse' },
  { id: 'solar', label: 'Solar & Renewable Energy Solutions', desc: 'Rooftop solar installations, solar pump sets, green micro-grid tech' },
  { id: 'organic', label: 'Organic Farming & Bio-Inputs', desc: 'Vermi-compost, bio-fertilizers, neem oil, organic produce packaging' },
  { id: 'poultry', label: 'Poultry, Sericulture & Fisheries', desc: 'Poultry layer/broiler farming, fish pond hatcheries, silk weaving' },
  { id: 'food', label: 'Food Processing & Bakery Hub', desc: 'Bakery items, packaged snacks, pickles, fruit juices, spices processing' },
  { id: 'logistics', label: 'Logistics, Transport & Cold Chain', desc: 'Mini-truck freight, cold chain reefer van, rural logistics hub' },
  { id: 'retail', label: 'Retail, Apparel & Kirana Superstore', desc: 'General merchant, readymade garment store, FMCG consumer goods' },
  { id: 'tech', label: 'Digital Services, CSC & FinTech Agent', desc: 'Common Service Centre, micro-ATM banking kiosk, digital IT hub' },
  { id: 'handicraft', label: 'Handicrafts, Pottery & Handloom', desc: 'Artisan clusters, traditional weaving, terracotta, woodcraft exports' },
  { id: 'herbal', label: 'Ayurveda, Herbal & Wellness', desc: 'Medicinal plant farming, essential oil extraction, ayurvedic products' },
  { id: 'tourism', label: 'Eco-Tourism & Rural Homestays', desc: 'Agri-tourism experience hubs, heritage stays, local guide services' },
  { id: 'other', label: 'Other Business Idea', desc: 'Specify your custom business concept, sector, or innovative idea' }
];

const investmentOptions = [
  { id: 'seed', label: 'Under ₹50,000', note: 'Self-funded / Micro-grant & PM-SVANidhi' },
  { id: 'low', label: '₹50,000 – ₹1 Lakh', note: 'Eligible for Mudra Shishu Scheme' },
  { id: 'mid1', label: '₹1 – ₹3 Lakhs', note: 'Eligible for Mudra Kishor & PMEGP Micro' },
  { id: 'mid2', label: '₹3 – ₹5 Lakhs', note: 'Eligible for Stand-Up India & PMEGP 35% Subsidy' },
  { id: 'high', label: '₹5 – ₹10 Lakhs', note: 'Eligible for Mudra Tarun Scheme' },
  { id: 'growth', label: '₹10 – ₹25 Lakhs', note: 'Eligible for CGTMSE Collateral-Free Loan' },
  { id: 'enterprise', label: 'Above ₹25 Lakhs', note: 'Eligible for State MSME Capital Investment Grants' },
  { id: 'other', label: 'Custom Investment Budget', note: 'Specify your target capital investment budget' }
];

const experienceOptions = [
  { id: 'first', label: 'First-Time Entrepreneur', desc: 'Starting fresh with zero prior venture management experience' },
  { id: 'family', label: 'Family Business Lineage', desc: 'Familiar with traditional family trade or ancestral business operations' },
  { id: 'skilled', label: 'Skilled Artisan / Vocational Graduate', desc: 'Formally trained (ITI/PMKVY) or practicing skilled technician' },
  { id: 'exservice', label: 'Ex-Serviceman / Defense / Retired', desc: 'Leveraging disciplined service experience and pension retirement funds' },
  { id: 'farmer', label: 'Progressive Farmer / Agriculturist', desc: 'Deep practical background in agricultural land management & farming' },
  { id: 'experienced', label: 'Experienced Enterprise Owner', desc: 'Currently operating or scaling an active business unit' },
  { id: 'other', label: 'Other Professional Background', desc: 'Specify your unique career background or work experience' }
];

const popularQuestions = [
  'Which business is best in my area?',
  'How much loan can I get?',
  'What government schemes can I apply for?',
  'How to start a bakery business?'
];

const claudeLoadingPhrases = [
  'Synthesizing feasibility blueprint...',
  'Analyzing regional OGD market datasets...',
  'Evaluating local competitor density & demand...',
  'Cross-referencing government loan & subsidy schemes...',
  'Calculating estimated payback period & profit margin...',
  'Formulating regulatory compliance & license checklist...',
  'Finalizing executive summary & recommendations...'
];

export default function BizraManual({ setCurrentTab }) {
  const { containerRef, startDrag, initialWidth } = useResizable(66.66, 30, 75);
  const scrollRef = useRef(null);

  const [currentStep, setCurrentStep] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('BIZRA_MANUAL_STEP');
      return saved ? parseInt(saved, 10) : 2;
    }
    return 2;
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [currentStep]);

  const [locationMode, setLocationMode] = useState(() => {
    if (typeof window !== 'undefined') return sessionStorage.getItem('BIZRA_MANUAL_LOC_MODE') || 'auto';
    return 'auto';
  });

  const [pinCodeInput, setPinCodeInput] = useState(() => {
    if (typeof window !== 'undefined') return sessionStorage.getItem('BIZRA_MANUAL_PIN') || '';
    return '';
  });

  const [manualLocationInput, setManualLocationInput] = useState(() => {
    if (typeof window !== 'undefined') return sessionStorage.getItem('BIZRA_MANUAL_LOC_INPUT') || '';
    return '';
  });

  const [customInputs, setCustomInputs] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('BIZRA_MANUAL_CUSTOM_INPUTS');
      if (saved) return JSON.parse(saved);
    }
    return { language: '', scale: '', business: '', investment: '', experience: '' };
  });

  const [selections, setSelections] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('BIZRA_MANUAL_SELECTIONS');
      if (saved) return JSON.parse(saved);
    }
    return {
      language: 'English',
      location: 'Coimbatore, Tamil Nadu',
      scale: '',
      business: '',
      investment: '',
      experience: ''
    };
  });

  // Persist questionnaire state to sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('BIZRA_MANUAL_STEP', currentStep.toString());
      sessionStorage.setItem('BIZRA_MANUAL_LOC_MODE', locationMode);
      sessionStorage.setItem('BIZRA_MANUAL_PIN', pinCodeInput);
      sessionStorage.setItem('BIZRA_MANUAL_LOC_INPUT', manualLocationInput);
      sessionStorage.setItem('BIZRA_MANUAL_CUSTOM_INPUTS', JSON.stringify(customInputs));
      sessionStorage.setItem('BIZRA_MANUAL_SELECTIONS', JSON.stringify(selections));
    }
  }, [currentStep, locationMode, pinCodeInput, manualLocationInput, customInputs, selections]);

  // n8n AI Agent Report States (with sessionStorage backup)
  const [reportState, setReportState] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('BIZRA_MANUAL_REPORT_STATE') || 'idle';
    }
    return 'idle';
  });
  const [reportText, setReportText] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('BIZRA_MANUAL_REPORT_TEXT') || '';
    }
    return '';
  });
  const [reportError, setReportError] = useState('');
  const [loadingPhraseIndex, setLoadingPhraseIndex] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('BIZRA_MANUAL_REPORT_STATE', reportState);
    }
  }, [reportState]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('BIZRA_MANUAL_REPORT_TEXT', reportText);
    }
  }, [reportText]);

  const generateSessionId = () => 'BIZRA-MANUAL-' + Math.random().toString(36).substring(2, 9) + '-' + Date.now();
  const [sessionId] = useState(generateSessionId);

  // Claude-style loading text animation interval
  useEffect(() => {
    let interval;
    if (reportState === 'loading') {
      interval = setInterval(() => {
        setLoadingPhraseIndex((prev) => (prev + 1) % claudeLoadingPhrases.length);
      }, 2400);
    }
    return () => clearInterval(interval);
  }, [reportState]);

  const updateSelection = (key, value) => {
    setSelections((prev) => ({ ...prev, [key]: value }));
  };

  const handleCustomInputChange = (key, val) => {
    setCustomInputs((prev) => ({ ...prev, [key]: val }));
    setSelections((prev) => ({ ...prev, [key]: val ? `Custom: ${val}` : 'Custom / Other' }));
  };

  const handleNext = () => {
    if (currentStep < 7) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setReportState('idle');
    setReportText('');
    setReportError('');
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('BIZRA_MANUAL_REPORT_STATE');
      sessionStorage.removeItem('BIZRA_MANUAL_REPORT_TEXT');
    }
    setSelections({
      language: 'English',
      location: '',
      scale: '',
      business: '',
      investment: '',
      experience: ''
    });
    setPinCodeInput('');
    setManualLocationInput('');
    setCustomInputs({
      language: '',
      scale: '',
      business: '',
      investment: '',
      experience: ''
    });
  };

  const callN8nForReport = async (promptText) => {
    const WEBHOOK_PATH = '/webhook/239e175e-8629-407e-98b8-580035573ac2';
    const PROXY_URL = `/n8n-api${WEBHOOK_PATH}`;
    const DIRECT_URL = `https://prefamiliar-overliterary-princess.ngrok-free.dev${WEBHOOK_PATH}`;

    const payload = {
      chatInput: promptText,
      message: promptText,
      rawQuery: promptText,
      sessionId: sessionId,
      location: selections.location || null
    };

    const headers = {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
    };

    let response;
    try {
      response = await fetch(PROXY_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        response = await fetch(DIRECT_URL, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
        });
      }
    } catch (err) {
      response = await fetch(DIRECT_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });
    }

    if (!response.ok) {
      throw new Error(`n8n AI Agent returned HTTP ${response.status}`);
    }

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await response.json();
      if (typeof data === 'string') return data;
      if (Array.isArray(data) && data.length > 0) {
        const first = data[0];
        if (typeof first === 'string') return first;
        return (
          first?.output ||
          first?.response ||
          first?.text ||
          first?.message ||
          first?.json?.output ||
          JSON.stringify(first)
        );
      }
      if (typeof data === 'object' && data !== null) {
        return (
          data.output ||
          data.response ||
          data.text ||
          data.message ||
          JSON.stringify(data)
        );
      }
      return String(data);
    } else {
      return await response.text();
    }
  };

  const handleGenerateReport = async () => {
    setReportState('loading');
    setReportError('');
    setLoadingPhraseIndex(0);

    const promptText = `Generate a comprehensive MSME Business Feasibility Report and Market Analysis for the following setup:
- Preferred Language: ${selections.language || 'English'}
- Target Location: ${selections.location || 'Coimbatore, Tamil Nadu'}
- Scale of Business: ${selections.scale || 'Micro Enterprise'}
- Proposed Business Sector / Idea: ${selections.business || 'Dairy Processing & Livestock'}
- Estimated Investment Budget: ${selections.investment || '₹1 – ₹3 Lakhs'}
- Prior Entrepreneurial Experience: ${selections.experience || 'First-Time Entrepreneur'}

Please structure the response with clear headings, bullet points, and key metrics covering:
1. Executive Summary & Market Opportunity in ${selections.location || 'the specified region'}
2. Required Setup, Machinery & Daily Operations
3. Financial Projections, Unit Economics & Payback Period
4. Applicable Government Loan Schemes & Subsidies (e.g. Mudra, PMEGP, CGTMSE)
5. Mandatory Licenses & Regulatory Compliance Checklist (FSSAI, GST, MSME Udyam)
6. Key Risk Factors & Actionable 90-Day Execution Roadmap
7. Local Competitor Landscape (List of existing related businesses in ${selections.location || 'the specified region'} with brief descriptions and address/locality details)

Format all tables using clean, well-structured Markdown tables with:
- A header row, a separator row (| --- | --- |), and matching data rows
- Consistent number of columns across every row
- Short, clear cell content (avoid line breaks inside cells)
- Proper spacing: | Header | Header |`;

    try {
      const replyText = await callN8nForReport(promptText);
      setReportText(replyText || 'Report generation complete.');
      setReportState('success');
    } catch (err) {
      console.error('Report Generation Error:', err);
      setReportError(err.message || 'Failed to generate feasibility report from n8n AI Agent.');
      setReportState('error');
    }
  };

  const handleDownloadPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    // Clean n8n artifacts before passing to marked (same logic as ResponseRenderer)
    const cleanedMarkdown = reportText
      ? reportText
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
          .join('\n')
      : '';

    // Use marked to convert Markdown into proper HTML (tables, lists, bold, etc.)
    const cleanHtml = cleanedMarkdown ? marked.parse(cleanedMarkdown) : '';

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>BIZRA_Feasibility_Report_${(selections.business || 'Venture').replace(/\s+/g, '_')}</title>
          <style>
            @page { size: A4; margin: 18mm; }
            body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; color: #1e293b; line-height: 1.6; font-size: 13px; margin: 0; padding: 0; }
            .header { border-bottom: 3px solid #2EA8A4; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
            .logo { font-size: 22px; font-weight: 900; color: #0f172a; letter-spacing: -0.5px; }
            .logo span { color: #2EA8A4; }
            .tagline { font-size: 11px; color: #64748B; font-weight: 600; text-transform: uppercase; }
            .meta-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; background: #F8FAFC; border: 1px solid #E2E8F0; padding: 14px; border-radius: 8px; margin-bottom: 24px; }
            .meta-item { font-size: 11px; }
            .meta-label { font-size: 9px; text-transform: uppercase; color: #64748B; font-weight: 700; display: block; margin-bottom: 2px; }
            .meta-val { font-weight: 700; color: #0F172A; }
            
            /* Markdown Content Styles */
            .content-body { font-size: 13px; line-height: 1.7; color: #334155; }
            .content-body p { margin-top: 0; margin-bottom: 12px; }
            .content-body h1, .content-body h2, .content-body h3 { color: #0f172a; font-weight: 800; margin-top: 24px; margin-bottom: 10px; page-break-after: avoid; }
            .content-body h1 { font-size: 18px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; }
            .content-body h2 { font-size: 16px; border-left: 4px solid #2EA8A4; padding-left: 10px; }
            .content-body h3 { font-size: 14px; }
            .content-body strong { font-weight: 700; color: #0f172a; }
            
            /* Table Styles */
            .content-body table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 12px; }
            .content-body th, .content-body td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
            .content-body th { background-color: #f1f5f9; font-weight: 700; color: #0f172a; text-transform: uppercase; font-size: 10px; letter-spacing: 0.5px; }
            .content-body tr:nth-child(even) { background-color: #f8fafc; }
            
            /* List Styles */
            .content-body ul, .content-body ol { margin-top: 0; margin-bottom: 14px; padding-left: 24px; }
            .content-body li { margin-bottom: 6px; }
            
            /* Blockquotes & Code */
            .content-body blockquote { margin: 16px 0; padding: 10px 16px; background: #f8fafc; border-left: 4px solid #2EA8A4; color: #475569; font-style: italic; }
            .content-body code { background: #f1f5f9; padding: 2px 4px; border-radius: 4px; font-family: monospace; font-size: 11px; color: #0f172a; border: 1px solid #e2e8f0; }
            .content-body hr { border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0; }
            
            .footer { margin-top: 40px; padding-top: 12px; border-top: 1px solid #E2E8F0; text-align: center; font-size: 10px; color: #94A3B8; font-weight: 600; page-break-inside: avoid; }
            
            /* Screen Preview Wrapper */
            .container { max-width: 850px; margin: 0 auto; padding: 40px 40px 40px 60px; }
            @media print {
              .container { max-width: 100%; margin: 0; padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">BIZRA <span>AI Agent</span></div>
              <div class="tagline">Official MSME Feasibility Blueprint</div>
            </div>
            <div class="meta-grid">
              <div class="meta-item"><span class="meta-label">Location</span><span class="meta-val">${selections.location || 'N/A'}</span></div>
              <div class="meta-item"><span class="meta-label">Language</span><span class="meta-val">${selections.language}</span></div>
              <div class="meta-item"><span class="meta-label">Business Sector</span><span class="meta-val">${selections.business || 'N/A'}</span></div>
              <div class="meta-item"><span class="meta-label">Operational Scale</span><span class="meta-val">${selections.scale || 'N/A'}</span></div>
              <div class="meta-item"><span class="meta-label">Investment Budget</span><span class="meta-val">${selections.investment || 'N/A'}</span></div>
              <div class="meta-item"><span class="meta-label">Experience</span><span class="meta-val">${selections.experience || 'N/A'}</span></div>
            </div>
            <div class="content-body">${cleanHtml}</div>
            <div class="footer">
              Generated by BIZRA AI Agent • Verified OGD Datasets & Government MSME Guidance • ${new Date().toLocaleDateString()}
            </div>
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 300);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const [messagingTab, setMessagingTab] = useState('whatsapp'); // 'whatsapp' | 'telegram'

  const openMessagingBot = () => {
    if (messagingTab === 'whatsapp') {
      window.open('https://wa.me/?text=Hello%20BIZRA%20AI%20Assistant', '_blank');
    } else {
      window.open('https://t.me/bizra_ai_bot', '_blank');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#F8F2E5] text-gray-900 overflow-hidden font-sans">
      {/* Top Navigation Bar */}
      <header className="px-4 lg:px-10 h-[60px] md:h-[72px] border-b border-gray-200 bg-white/95 backdrop-blur-md flex items-center justify-between shrink-0 shadow-[0_2px_10px_rgba(0,0,0,0.02)] z-10 relative">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentTab('landing')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-semibold text-gray-700 hover:text-black hover:bg-white transition-colors cursor-pointer shadow-sm"
          >
            <ArrowLeft size={14} />
            <span>Home</span>
          </button>

          <div className="h-4 w-[1px] bg-gray-300" />

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-black text-white font-black text-base shadow-sm">
              B
            </div>
            <span className="font-extrabold text-base tracking-tight text-gray-900">
              BIZRA <span className="text-gray-700 font-semibold text-xs uppercase px-1.5 py-0.5 rounded bg-gray-100 border border-gray-200 font-mono">Manual Wizard</span>
            </span>
          </div>

          {selections.location && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-gray-200 text-xs text-gray-700">
              <MapPin size={12} className="text-black" />
              <span>{selections.location}</span>
            </div>
          )}
        </div>

        {/* Right Tab Switcher Actions */}
        <div className="flex items-center gap-2">
          {/* Mode Switch Pills */}
          <div className="hidden sm:flex items-center p-1 rounded-xl bg-white border border-gray-200 shadow-inner">
            <button
              onClick={() => setCurrentTab('manual')}
              className="px-3 py-1 rounded-lg text-xs font-bold transition-all bg-white text-black shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Compass size={13} />
              <span>Manual</span>
            </button>
            <button
              onClick={() => setCurrentTab('chatbot')}
              className="px-3 py-1 rounded-lg text-xs font-semibold text-gray-500 hover:text-gray-900 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Bot size={13} />
              <span>AI Chatbot</span>
            </button>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-xs font-medium text-gray-600 hover:text-black hover:bg-white transition-colors cursor-pointer shadow-sm"
            title="Reset Session"
          >
            <RotateCcw size={13} />
            <span className="hidden md:inline">Reset</span>
          </button>

          <button
            onClick={() => setCurrentTab('landing')}
            className="p-1.5 rounded-xl border border-gray-200 bg-white text-gray-500 hover:text-black hover:bg-white transition-colors cursor-pointer shadow-sm"
            aria-label="Exit"
          >
            <X size={16} />
          </button>
        </div>
      </header>

      {/* Main Workspace Body */}
      <main 
        ref={containerRef}
        className="flex flex-col lg:flex-row flex-grow overflow-hidden relative"
        style={{ '--left-width': `${initialWidth}%` }}
      >
        {/* Left Workspace (Variable Width) - Manual Steps Questionnaire or Report View */}
        <div
          id="manual-workspace"
          className="w-full lg-dynamic-w flex flex-col h-full relative overflow-hidden bg-[#F8F2E5]"
        >
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-[#F8F2E5]" data-lenis-prevent>
          {reportState === 'loading' && (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center space-y-8 max-w-xl mx-auto my-auto">
              {/* Ambient Pulse Glowing Orb */}
              <div className="relative">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-[#2EA8A4] via-[#9ED4AC] to-[#2EA8A4] animate-pulse blur-xl opacity-40 absolute -inset-2" />
                <div className="w-24 h-24 rounded-3xl bg-white border-2 border-[#2EA8A4] flex items-center justify-center shadow-2xl relative z-10">
                  <Sparkles size={40} className="text-[#2EA8A4] animate-bounce" />
                </div>
              </div>

              {/* Claude-style Cycling Thought Phrase */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#2EA8A4] px-3 py-1 rounded-full bg-[#2EA8A4]/15 border border-[#2EA8A4]/30">
                  BIZRA AI Intelligence Engine
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight min-h-[3rem] flex items-center justify-center transition-all duration-300">
                  {claudeLoadingPhrases[loadingPhraseIndex]}
                </h2>
                <p className="text-xs text-gray-500 font-medium max-w-md mx-auto">
                  Processing parameters for <span className="text-[#2EA8A4] font-bold">{selections.business || 'your venture'}</span> in <span className="text-[#2EA8A4] font-bold">{selections.location}</span>
                </p>
              </div>

              {/* Shimmer Progress Line */}
              <div className="w-full bg-white border border-gray-200 h-2 rounded-full overflow-hidden relative shadow-inner">
                <div className="bg-gradient-to-r from-[#2EA8A4] via-[#9ED4AC] to-[#2EA8A4] h-full w-3/4 animate-pulse rounded-full" />
              </div>

              {/* Claude-style Milestone Checkpoints */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left w-full pt-4 border-t border-gray-200/50">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <CheckCircle2 size={15} className="text-[#2EA8A4] shrink-0" />
                  <span>Aggregating OGD market metrics</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <CheckCircle2 size={15} className="text-[#2EA8A4] shrink-0" />
                  <span>Cross-referencing Mudra & PMEGP</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-900 font-semibold animate-pulse">
                  <Loader2 size={15} className="text-[#2EA8A4] animate-spin shrink-0" />
                  <span>Synthesizing feasibility blueprint</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500/50">
                  <div className="w-3.5 h-3.5 rounded-full border border-gray-200 shrink-0" />
                  <span>Generating PDF export schema</span>
                </div>
              </div>
            </div>
          )}

          {reportState === 'success' && (
            <div className="space-y-6 max-w-4xl mx-auto w-full">
              {/* Report Header Bar */}
              <div className="p-5 rounded-2xl bg-white border border-[#2EA8A4]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#2EA8A4]/20 border border-[#2EA8A4]/40 text-[#2EA8A4] text-[10px] font-mono font-bold uppercase">
                      Official Blueprint
                    </span>
                    <span className="text-xs text-gray-500 font-mono">{selections.location}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                    Feasibility Analysis: {selections.business || 'Custom Business Venture'}
                  </h2>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleDownloadPDF}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#2EA8A4] text-white font-black text-xs uppercase tracking-wider hover:bg-[#258B87] shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download size={15} />
                    <span>Download PDF</span>
                  </button>

                  <button
                    onClick={() => setReportState('idle')}
                    className="px-3 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-100 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    title="Modify Parameters"
                  >
                    <RefreshCw size={14} />
                    <span className="hidden sm:inline">Modify</span>
                  </button>
                </div>
              </div>

              {/* Form Parameters Highlights Card */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 p-3.5 rounded-xl bg-white/60 border border-gray-200/60 text-xs">
                <div>
                  <span className="text-[9px] uppercase font-mono text-gray-500/70 block">Location</span>
                  <strong className="text-gray-900 truncate block mt-0.5">{selections.location}</strong>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-mono text-gray-500/70 block">Language</span>
                  <strong className="text-gray-900 truncate block mt-0.5">{selections.language}</strong>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-mono text-gray-500/70 block">Sector</span>
                  <strong className="text-gray-900 truncate block mt-0.5">{selections.business || 'N/A'}</strong>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-mono text-gray-500/70 block">Scale</span>
                  <strong className="text-gray-900 truncate block mt-0.5">{selections.scale || 'N/A'}</strong>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-mono text-gray-500/70 block">Investment</span>
                  <strong className="text-gray-900 truncate block mt-0.5">{selections.investment || 'N/A'}</strong>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-mono text-gray-500/70 block">Experience</span>
                  <strong className="text-gray-900 truncate block mt-0.5">{selections.experience || 'N/A'}</strong>
                </div>
              </div>

              {/* Report Output Content Rendered via ResponseRenderer */}
              <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-xl space-y-4">
                <ResponseRenderer text={reportText} />
              </div>

              {/* Bottom Footer Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <CheckCircle2 size={16} className="text-[#2EA8A4]" />
                  <span>Verified by n8n BIZRA AI Agent</span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleDownloadPDF}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-[#2EA8A4]/20 border border-[#2EA8A4]/50 text-[#2EA8A4] hover:bg-[#2EA8A4]/30 font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Printer size={14} />
                    <span>Print / Export PDF</span>
                  </button>

                  <button
                    onClick={() => setCurrentTab('chatbot')}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-gray-900 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageSquare size={14} />
                    <span>Ask Questions in Chatbot</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {reportState === 'error' && (
            <div className="p-6 rounded-2xl border border-red-500/40 bg-red-500/10 text-center space-y-4 max-w-md mx-auto my-auto">
              <AlertCircle size={36} className="text-red-400 mx-auto" />
              <div>
                <h3 className="font-extrabold text-base text-gray-900">Report Generation Error</h3>
                <p className="text-xs text-red-300 mt-1">{reportError}</p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={handleGenerateReport}
                  className="flex-1 py-2.5 rounded-xl bg-[#2EA8A4] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#258B87] transition-all cursor-pointer"
                >
                  Retry Generation
                </button>

                <button
                  onClick={() => setCurrentTab('chatbot')}
                  className="flex-1 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-gray-900 font-bold text-xs transition-all cursor-pointer"
                >
                  Open Chatbot
                </button>
              </div>
            </div>
          )}

          {reportState === 'idle' && (
            <div>
              {/* Step Progress Stepper Bar */}
              <div className="w-full mb-8 pb-6 border-b border-gray-200/60 overflow-x-auto scrollbar-none">
                <div className="flex items-center justify-between min-w-[600px] px-2">
                  {steps.map((step, idx) => {
                    const isCompleted = step.id < currentStep;
                    const isActive = step.id === currentStep;

                    return (
                      <React.Fragment key={step.id}>
                        <button
                          onClick={() => setCurrentStep(step.id)}
                          className="flex items-center gap-2 group cursor-pointer focus:outline-none"
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                              isCompleted
                                ? 'bg-[#2EA8A4] text-white shadow-md'
                                : isActive
                                ? 'bg-[#2EA8A4]/20 border-2 border-[#2EA8A4] text-[#2EA8A4] shadow-lg ring-4 ring-[#2EA8A4]/10'
                                : 'bg-white border border-gray-200 text-gray-500/60'
                            }`}
                          >
                            {isCompleted ? <Check size={14} className="stroke-[3]" /> : step.id}
                          </div>
                          <span
                            className={`text-xs font-semibold transition-colors ${
                              isActive
                                ? 'text-[#2EA8A4] font-bold'
                                : isCompleted
                                ? 'text-gray-900'
                                : 'text-gray-500/60'
                            }`}
                          >
                            {step.label}
                          </span>
                        </button>

                        {idx < steps.length - 1 && (
                          <div
                            className={`flex-grow h-[2px] mx-3 transition-colors ${
                              step.id < currentStep ? 'bg-[#2EA8A4]' : 'bg-gray-200'
                            }`}
                          />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              {/* Active Step Content Frame */}
              <div className="max-w-3xl mx-auto space-y-6">
                {/* Step Title Header */}
                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#2EA8A4]">
                    Step {currentStep} of {steps.length}
                  </span>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                    {currentStep === 1 && 'Select Your Preferred Language'}
                    {currentStep === 2 && 'Where do you plan to start your business?'}
                    {currentStep === 3 && 'What is the scale of your business?'}
                    {currentStep === 4 && 'Which business sector or idea are you considering?'}
                    {currentStep === 5 && 'What is your estimated investment capacity?'}
                    {currentStep === 6 && 'What is your prior experience level in this domain?'}
                    {currentStep === 7 && 'Review & Generate Feasibility Report'}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 font-medium">
                    {currentStep === 2
                      ? 'This helps us analyse the local market and opportunities for you.'
                      : 'Provide details to customize verified OGD datasets and capital guidance.'}
                  </p>
                </div>

                {/* Step 1: Language */}
                {currentStep === 1 && (
                  <div className="pt-2">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {languageOptions.map((lang) => {
                        const isOther = lang === 'Other Language';
                        const isSelected =
                          selections.language === lang ||
                          (isOther && (selections.language === 'Other Language' || selections.language.startsWith('Custom:')));

                        if (isOther && isSelected) {
                          return (
                            <div
                              key={lang}
                              className="col-span-2 sm:col-span-3 md:col-span-4 p-3.5 rounded-xl border border-[#2EA8A4] bg-[#2EA8A4]/15 shadow-lg ring-2 ring-[#2EA8A4]/20 flex flex-col sm:flex-row items-center gap-3"
                            >
                              <span className="text-xs font-bold text-gray-900 shrink-0">Type Custom Language:</span>
                              <input
                                type="text"
                                autoFocus
                                placeholder="e.g. Konkani, Mizo, Santali, Tulu..."
                                value={customInputs.language}
                                onChange={(e) => handleCustomInputChange('language', e.target.value)}
                                className="w-full px-3.5 py-1.5 rounded-lg bg-white border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-[#2EA8A4]"
                              />
                            </div>
                          );
                        }

                        return (
                          <button
                            key={lang}
                            onClick={() => {
                              if (isOther) {
                                updateSelection(
                                  'language',
                                  customInputs.language ? `Custom: ${customInputs.language}` : 'Other Language'
                                );
                              } else {
                                updateSelection('language', lang);
                              }
                            }}
                            className={`p-3.5 rounded-xl border text-center font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                              isSelected
                                ? 'border-[#2EA8A4] bg-[#2EA8A4]/15 text-gray-900 shadow-lg ring-2 ring-[#2EA8A4]/20'
                                : 'border-gray-200 bg-white text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                            }`}
                          >
                            {lang}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Step 2: Location (4 Cards matching image 1) */}
                {currentStep === 2 && (
                  <div className="space-y-6 pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Card 1: Use My Current Location */}
                      <div
                        onClick={() => {
                          setLocationMode('auto');
                          updateSelection('location', 'Coimbatore, Tamil Nadu');
                        }}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-4 relative overflow-hidden ${
                          locationMode === 'auto'
                            ? 'border-[#2EA8A4] bg-[#2EA8A4]/10 ring-2 ring-[#2EA8A4]/20 shadow-xl'
                            : 'border-gray-200 bg-white hover:border-[#2EA8A4]/50 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                locationMode === 'auto' ? 'border-[#2EA8A4] bg-[#2EA8A4]' : 'border-gray-200'
                              }`}
                            >
                              {locationMode === 'auto' && <span className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                            <div>
                              <h3 className="font-extrabold text-sm sm:text-base text-gray-900">
                                1. Use My Current Location
                              </h3>
                              <p className="text-xs text-gray-500 mt-0.5">Detect my current location automatically</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#2EA8A4]/20 text-[#2EA8A4] border border-[#2EA8A4]/30 font-mono">
                            Recommended
                          </span>
                          <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-[#2EA8A4]">
                            <MapPin size={22} />
                          </div>
                        </div>
                      </div>

                      {/* Card 2: Select on Map */}
                      <div
                        onClick={() => {
                          setLocationMode('map');
                          updateSelection('location', 'Selected on Interactive Map');
                        }}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-4 ${
                          locationMode === 'map'
                            ? 'border-[#2EA8A4] bg-[#2EA8A4]/10 ring-2 ring-[#2EA8A4]/20 shadow-xl'
                            : 'border-gray-200 bg-white hover:border-[#2EA8A4]/50 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                              locationMode === 'map' ? 'border-[#2EA8A4] bg-[#2EA8A4]' : 'border-gray-200'
                            }`}
                          >
                            {locationMode === 'map' && <span className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                          <div>
                            <h3 className="font-extrabold text-sm sm:text-base text-gray-900">2. Select on Map</h3>
                            <p className="text-xs text-gray-500 mt-0.5">Pick your business location on interactive map</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-end pt-2">
                          <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-500">
                            <Map size={22} />
                          </div>
                        </div>
                      </div>

                      {/* Card 3: Enter PIN Code */}
                      <div
                        onClick={() => setLocationMode('pin')}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-4 ${
                          locationMode === 'pin'
                            ? 'border-[#2EA8A4] bg-[#2EA8A4]/10 ring-2 ring-[#2EA8A4]/20 shadow-xl'
                            : 'border-gray-200 bg-white hover:border-[#2EA8A4]/50 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                              locationMode === 'pin' ? 'border-[#2EA8A4] bg-[#2EA8A4]' : 'border-gray-200'
                            }`}
                          >
                            {locationMode === 'pin' && <span className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                          <div className="w-full">
                            <h3 className="font-extrabold text-sm sm:text-base text-gray-900">3. Enter PIN Code</h3>
                            <p className="text-xs text-gray-500 mt-0.5">Enter 6-digit PIN code to find your area</p>

                            {locationMode === 'pin' && (
                              <input
                                type="text"
                                autoFocus
                                maxLength={6}
                                placeholder="e.g. 641001"
                                value={pinCodeInput}
                                onChange={(e) => {
                                  setPinCodeInput(e.target.value);
                                  if (e.target.value.length === 6) {
                                    updateSelection('location', `PIN: ${e.target.value}`);
                                  }
                                }}
                                className="mt-3 w-full px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-[#2EA8A4]"
                              />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Card 4: Enter Village / Block / District */}
                      <div
                        onClick={() => setLocationMode('manual')}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-4 ${
                          locationMode === 'manual'
                            ? 'border-[#2EA8A4] bg-[#2EA8A4]/10 ring-2 ring-[#2EA8A4]/20 shadow-xl'
                            : 'border-gray-200 bg-white hover:border-[#2EA8A4]/50 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                              locationMode === 'manual' ? 'border-[#2EA8A4] bg-[#2EA8A4]' : 'border-gray-200'
                            }`}
                          >
                            {locationMode === 'manual' && <span className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                          <div className="w-full">
                            <h3 className="font-extrabold text-sm sm:text-base text-gray-900">
                              4. Enter Village / Block / District
                            </h3>
                            <p className="text-xs text-gray-500 mt-0.5">Type your area details manually</p>

                            {locationMode === 'manual' && (
                              <input
                                type="text"
                                autoFocus
                                placeholder="e.g. Pollachi, Coimbatore"
                                value={manualLocationInput}
                                onChange={(e) => {
                                  setManualLocationInput(e.target.value);
                                  updateSelection('location', e.target.value);
                                }}
                                className="mt-3 w-full px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-[#2EA8A4]"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Privacy Assurance Note */}
                    <div className="p-4 rounded-xl border border-[#2EA8A4]/30 bg-[#2EA8A4]/10 flex items-center gap-3 text-xs text-gray-500">
                      <Shield size={20} className="text-[#2EA8A4] shrink-0" />
                      <div>
                        <strong className="text-gray-900 block font-semibold">We respect your privacy.</strong>
                        <span>Your location data is only used for market analysis and will never be shared.</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Scale */}
                {currentStep === 3 && (
                  <div className="pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {scaleOptions.map((opt) => {
                        const isOther = opt.id === 'other';
                        const isSelected =
                          selections.scale === opt.label ||
                          (isOther && (selections.scale === opt.label || selections.scale.startsWith('Custom:')));

                        if (isOther && isSelected) {
                          return (
                            <div
                              key={opt.id}
                              className="col-span-1 sm:col-span-2 p-5 rounded-2xl border border-[#2EA8A4] bg-[#2EA8A4]/15 ring-2 ring-[#2EA8A4]/20 shadow-xl space-y-2"
                            >
                              <div className="flex items-center justify-between">
                                <h3 className="font-bold text-sm text-gray-900">Type Custom Business Scale</h3>
                                <span className="text-[10px] font-mono text-[#2EA8A4] uppercase font-bold px-2 py-0.5 rounded bg-[#2EA8A4]/20 border border-[#2EA8A4]/30">
                                  Click & Type
                                </span>
                              </div>
                              <p className="text-xs text-gray-500">{opt.desc}</p>
                              <input
                                type="text"
                                autoFocus
                                placeholder="e.g. Village Cooperative with 50 local farmers..."
                                value={customInputs.scale}
                                onChange={(e) => handleCustomInputChange('scale', e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-[#2EA8A4]"
                              />
                            </div>
                          );
                        }

                        return (
                          <div
                            key={opt.id}
                            onClick={() => {
                              if (isOther) {
                                updateSelection(
                                  'scale',
                                  customInputs.scale ? `Custom: ${customInputs.scale}` : opt.label
                                );
                              } else {
                                updateSelection('scale', opt.label);
                              }
                            }}
                            className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                              isSelected
                                ? 'border-[#2EA8A4] bg-[#2EA8A4]/15 ring-2 ring-[#2EA8A4]/20 shadow-xl'
                                : 'border-gray-200 bg-white hover:bg-gray-100'
                            }`}
                          >
                            <h3 className="font-bold text-sm text-gray-900">{opt.label}</h3>
                            <p className="text-xs text-gray-500 mt-1">{opt.desc}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Step 4: Business Sector */}
                {currentStep === 4 && (
                  <div className="pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1 scrollbar-thin">
                      {businessOptions.map((opt) => {
                        const isOther = opt.id === 'other';
                        const isSelected =
                          selections.business === opt.label ||
                          (isOther && (selections.business === opt.label || selections.business.startsWith('Custom:')));

                        if (isOther && isSelected) {
                          return (
                            <div
                              key={opt.id}
                              className="col-span-1 sm:col-span-2 p-4 rounded-2xl border border-[#2EA8A4] bg-[#2EA8A4]/15 ring-2 ring-[#2EA8A4]/20 shadow-xl space-y-2"
                            >
                              <div className="flex items-center justify-between">
                                <h3 className="font-bold text-xs sm:text-sm text-gray-900">Type Custom Business Idea / Concept</h3>
                                <span className="text-[10px] font-mono text-[#2EA8A4] uppercase font-bold px-2 py-0.5 rounded bg-[#2EA8A4]/20 border border-[#2EA8A4]/30">
                                  Click & Type
                                </span>
                              </div>
                              <p className="text-xs text-gray-500">{opt.desc}</p>
                              <input
                                type="text"
                                autoFocus
                                placeholder="e.g. Drone spray service for precision agriculture..."
                                value={customInputs.business}
                                onChange={(e) => handleCustomInputChange('business', e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-[#2EA8A4]"
                              />
                            </div>
                          );
                        }

                        return (
                          <div
                            key={opt.id}
                            onClick={() => {
                              if (isOther) {
                                updateSelection(
                                  'business',
                                  customInputs.business ? `Custom: ${customInputs.business}` : opt.label
                                );
                              } else {
                                updateSelection('business', opt.label);
                              }
                            }}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-2 ${
                              isSelected
                                ? 'border-[#2EA8A4] bg-[#2EA8A4]/15 ring-2 ring-[#2EA8A4]/20 shadow-xl'
                                : 'border-gray-200 bg-white hover:bg-gray-100'
                            }`}
                          >
                            <div>
                              <h3 className="font-bold text-xs sm:text-sm text-gray-900">{opt.label}</h3>
                              <p className="text-[11px] text-gray-500 mt-1 leading-snug">{opt.desc}</p>
                            </div>
                            {isSelected && <Check size={18} className="text-[#2EA8A4] shrink-0 mt-0.5" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Step 5: Investment */}
                {currentStep === 5 && (
                  <div className="pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                      {investmentOptions.map((opt) => {
                        const isOther = opt.id === 'other';
                        const isSelected =
                          selections.investment === opt.label ||
                          (isOther && (selections.investment === opt.label || selections.investment.startsWith('Custom:')));

                        if (isOther && isSelected) {
                          return (
                            <div
                              key={opt.id}
                              className="col-span-1 sm:col-span-2 md:col-span-4 p-4 rounded-2xl border border-[#2EA8A4] bg-[#2EA8A4]/15 ring-2 ring-[#2EA8A4]/20 shadow-xl space-y-2"
                            >
                              <div className="flex items-center justify-between">
                                <h3 className="font-bold text-sm text-gray-900">Type Custom Investment Amount</h3>
                                <span className="text-[10px] font-mono text-[#2EA8A4] uppercase font-bold px-2 py-0.5 rounded bg-[#2EA8A4]/20 border border-[#2EA8A4]/30">
                                  Click & Type
                                </span>
                              </div>
                              <p className="text-xs text-gray-500">{opt.note}</p>
                              <input
                                type="text"
                                autoFocus
                                placeholder="e.g. ₹15 Lakhs bank loan + ₹5 Lakhs personal savings..."
                                value={customInputs.investment}
                                onChange={(e) => handleCustomInputChange('investment', e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-[#2EA8A4]"
                              />
                            </div>
                          );
                        }

                        return (
                          <div
                            key={opt.id}
                            onClick={() => {
                              if (isOther) {
                                updateSelection(
                                  'investment',
                                  customInputs.investment ? `Custom: ${customInputs.investment}` : opt.label
                                );
                              } else {
                                updateSelection('investment', opt.label);
                              }
                            }}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                              isSelected
                                ? 'border-[#2EA8A4] bg-[#2EA8A4]/15 ring-2 ring-[#2EA8A4]/20 shadow-xl'
                                : 'border-gray-200 bg-white hover:bg-gray-100'
                            }`}
                          >
                            <h3 className="font-bold text-sm text-gray-900">{opt.label}</h3>
                            <span className="text-[10px] text-[#2EA8A4] font-mono mt-2 block leading-tight">{opt.note}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Step 6: Experience */}
                {currentStep === 6 && (
                  <div className="pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {experienceOptions.map((opt) => {
                        const isOther = opt.id === 'other';
                        const isSelected =
                          selections.experience === opt.label ||
                          (isOther && (selections.experience === opt.label || selections.experience.startsWith('Custom:')));

                        if (isOther && isSelected) {
                          return (
                            <div
                              key={opt.id}
                              className="col-span-1 sm:col-span-2 p-5 rounded-2xl border border-[#2EA8A4] bg-[#2EA8A4]/15 ring-2 ring-[#2EA8A4]/20 shadow-xl space-y-2"
                            >
                              <div className="flex items-center justify-between">
                                <h3 className="font-bold text-sm text-gray-900">Describe Custom Professional Experience</h3>
                                <span className="text-[10px] font-mono text-[#2EA8A4] uppercase font-bold px-2 py-0.5 rounded bg-[#2EA8A4]/20 border border-[#2EA8A4]/30">
                                  Click & Type
                                </span>
                              </div>
                              <p className="text-xs text-gray-500">{opt.desc}</p>
                              <input
                                type="text"
                                autoFocus
                                placeholder="e.g. 10 years experience in logistics & cold chain supply management..."
                                value={customInputs.experience}
                                onChange={(e) => handleCustomInputChange('experience', e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-[#2EA8A4]"
                              />
                            </div>
                          );
                        }

                        return (
                          <div
                            key={opt.id}
                            onClick={() => {
                              if (isOther) {
                                updateSelection(
                                  'experience',
                                  customInputs.experience ? `Custom: ${customInputs.experience}` : opt.label
                                );
                              } else {
                                updateSelection('experience', opt.label);
                              }
                            }}
                            className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                              isSelected
                                ? 'border-[#2EA8A4] bg-[#2EA8A4]/15 ring-2 ring-[#2EA8A4]/20 shadow-xl'
                                : 'border-gray-200 bg-white hover:bg-gray-100'
                            }`}
                          >
                            <h3 className="font-bold text-sm text-gray-900">{opt.label}</h3>
                            <p className="text-xs text-gray-500 mt-1">{opt.desc}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Step 7: Analysis & Summary */}
                {currentStep === 7 && (
                  <div className="p-6 rounded-2xl border border-[#2EA8A4]/40 bg-white space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#2EA8A4]/20 border border-[#2EA8A4]/30 flex items-center justify-center text-[#2EA8A4]">
                        <Sparkles size={20} />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-base text-gray-900">Feasibility Blueprint Ready</h3>
                        <p className="text-xs text-gray-500">Review your configuration before generating report</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                      {Object.entries(selections).map(([key, val]) => (
                        <div key={key} className="p-3 rounded-xl bg-white border border-gray-200">
                          <span className="text-[10px] uppercase tracking-wider font-mono text-gray-500/70 block">{key}</span>
                          <strong className="text-xs text-gray-900 block mt-0.5 truncate">{val || 'Not selected'}</strong>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={handleGenerateReport}
                      className="w-full py-3.5 rounded-xl bg-[#2EA8A4] text-white font-black text-sm uppercase tracking-wider shadow-lg hover:bg-[#258B87] transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Sparkles size={16} />
                      <span>Generate AI Feasibility Report</span>
                    </button>
                  </div>
                )}

                {/* Navigation Action Buttons (Back & Continue) */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200/60">
                  <button
                    onClick={handleBack}
                    disabled={currentStep === 1}
                    className={`px-5 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                      currentStep === 1
                        ? 'border-gray-200/40 text-gray-500/30 cursor-not-allowed'
                        : 'border-gray-200 bg-white text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <ArrowLeft size={15} />
                    <span>Back</span>
                  </button>

                  <button
                    onClick={handleNext}
                    disabled={currentStep === 7}
                    className={`px-6 py-2.5 rounded-xl font-extrabold text-xs tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                      currentStep === 7
                        ? 'bg-gray-100 text-gray-500/40 cursor-not-allowed'
                        : 'bg-[#2EA8A4] text-white hover:bg-[#258B87] shadow-md'
                    }`}
                  >
                    <span>Continue</span>
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Bar: "Your Current Selection" matching image 1 */}
          <div className="mt-8 pt-4 border-t border-gray-200/60">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500/70 font-mono block mb-3">
              Your Current Selection
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              <div className="p-2.5 rounded-xl bg-white border border-gray-200 flex items-center gap-2">
                <Globe size={14} className="text-[#2EA8A4] shrink-0" />
                <div className="truncate">
                  <span className="text-[9px] text-gray-500/60 block leading-none">Language</span>
                  <span className="text-xs font-bold text-gray-900 truncate block mt-0.5">{selections.language}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-gray-200 flex items-center gap-2">
                <MapPin size={14} className="text-[#2EA8A4] shrink-0" />
                <div className="truncate">
                  <span className="text-[9px] text-gray-500/60 block leading-none">Location</span>
                  <span className="text-xs font-bold text-gray-900 truncate block mt-0.5">{selections.location || 'Not selected'}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-gray-200 flex items-center gap-2">
                <Layers size={14} className="text-[#2EA8A4] shrink-0" />
                <div className="truncate">
                  <span className="text-[9px] text-gray-500/60 block leading-none">Scale</span>
                  <span className="text-xs font-bold text-gray-900 truncate block mt-0.5">{selections.scale || 'Not selected'}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-gray-200 flex items-center gap-2">
                <Building2 size={14} className="text-[#2EA8A4] shrink-0" />
                <div className="truncate">
                  <span className="text-[9px] text-gray-500/60 block leading-none">Business</span>
                  <span className="text-xs font-bold text-gray-900 truncate block mt-0.5">{selections.business || 'Not selected'}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-gray-200 flex items-center gap-2">
                <Coins size={14} className="text-[#2EA8A4] shrink-0" />
                <div className="truncate">
                  <span className="text-[9px] text-gray-500/60 block leading-none">Investment</span>
                  <span className="text-xs font-bold text-gray-900 truncate block mt-0.5">{selections.investment || 'Not selected'}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-gray-200 flex items-center gap-2">
                <Briefcase size={14} className="text-[#2EA8A4] shrink-0" />
                <div className="truncate">
                  <span className="text-[9px] text-gray-500/60 block leading-none">Experience</span>
                  <span className="text-xs font-bold text-gray-900 truncate block mt-0.5">{selections.experience || 'Not selected'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* Resizer Handle (Curvy visible line) */}
        <div 
          className="hidden lg:block w-1.5 my-4 mx-1 rounded-full bg-gray-300 hover:bg-[#2EA8A4] cursor-col-resize transition-colors z-50 flex-shrink-0"
          onPointerDown={startDrag}
          title="Drag to resize panels"
        />

        {/* Right Sidebar - Integrations & Context */}
        <div className="hidden lg:flex flex-1 flex-col h-full justify-between p-6 bg-[#F8F2E5] text-gray-900 overflow-y-auto" data-lenis-prevent>
          <div className="space-y-6 my-auto">
            {/* AI Assistant Mode Switcher Card */}
            <div className="p-5 rounded-2xl border border-gray-200 bg-white space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#2EA8A4]/20 border border-[#2EA8A4]/30 flex items-center justify-center text-[#2EA8A4]">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-gray-900">Prefer Talking to AI?</h3>
                  <span className="text-xs text-gray-500">Switch to BIZRA Conversational Agent</span>
                </div>
              </div>

              <button
                onClick={() => setCurrentTab('chatbot')}
                className="w-full py-2.5 rounded-xl bg-[#2EA8A4] text-white font-black text-xs uppercase tracking-wider shadow-md hover:bg-[#258B87] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MessageSquare size={14} />
                <span>Launch AI Chatbot</span>
              </button>
            </div>

            {/* WhatsApp / Telegram Mobile Concierge Card */}
            <div
              className={`p-6 rounded-2xl border shadow-xl text-center transition-all duration-300 ${
                messagingTab === 'whatsapp'
                  ? 'border-[#25D366]/40 bg-[#25D366] text-white'
                  : 'border-[#0088CC]/40 bg-[#0088CC] text-white'
              }`}
            >
              {/* Concierge Platform Switcher Buttons */}
              <div className="inline-flex items-center p-1 rounded-xl mb-4 bg-white/20 border border-white/30">
                <button
                  onClick={() => setMessagingTab('whatsapp')}
                  className={`px-3.5 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                    messagingTab === 'whatsapp'
                      ? 'bg-white text-[#25D366] shadow-sm'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  WhatsApp
                </button>
                <button
                  onClick={() => setMessagingTab('telegram')}
                  className={`px-3.5 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                    messagingTab === 'telegram'
                      ? 'bg-white text-[#0088CC] shadow-sm'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  Telegram
                </button>
              </div>

              {/* Dynamic Real Brand Icon Badge */}
              <div
                className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition-transform mb-4 ${
                  messagingTab === 'whatsapp'
                    ? 'bg-white text-[#25D366]'
                    : 'bg-white text-[#0088CC]'
                }`}
                onClick={openMessagingBot}
              >
                {messagingTab === 'whatsapp' ? (
                  <svg className="w-10 h-10 fill-[#25D366]" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.447-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.572-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.99c-.002 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                ) : (
                  <svg className="w-10 h-10 fill-[#0088CC] ml-0.5" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.141.119.098.152.228.166.331.016.11.036.353.02.547z" />
                  </svg>
                )}
              </div>

              <div className="space-y-1">
                <h3 className="font-black text-lg">
                  {messagingTab === 'whatsapp' ? 'Chat on WhatsApp' : 'Chat on Telegram'}
                </h3>
                <p className="text-xs max-w-xs mx-auto leading-relaxed font-medium text-white/90">
                  Connect with BIZRA AI on {messagingTab === 'whatsapp' ? 'WhatsApp' : 'Telegram'} for instant feasibility reports and mandi price alerts.
                </p>
              </div>

              <button
                onClick={openMessagingBot}
                className={`mt-5 px-6 py-2.5 rounded-xl uppercase font-extrabold tracking-wider cursor-pointer text-xs shadow-md transition-all ${
                  messagingTab === 'whatsapp'
                    ? 'bg-[#128C7E] text-white hover:bg-[#075E54]'
                    : 'bg-[#0F172A] text-white hover:bg-[#0284C7]'
                }`}
              >
                {messagingTab === 'whatsapp' ? 'Open WhatsApp Bot' : 'Open Telegram Bot'}
              </button>
            </div>

            {/* Popular Questions Accordion / List */}
            <div className="p-5 rounded-2xl border border-gray-200 bg-white space-y-3">
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-gray-500">Popular Questions</h4>
              <div className="space-y-2">
                {popularQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => setCurrentTab('chatbot')}
                    className="w-full p-2.5 rounded-xl border border-gray-200/80 bg-white text-left text-xs font-semibold text-gray-900 hover:text-[#2EA8A4] hover:border-[#2EA8A4]/50 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <span>{q}</span>
                    <ChevronRight size={14} className="text-gray-500/70 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 text-center text-[10px] uppercase tracking-widest text-gray-500/70">
            BIZRA Official Mobile Concierge
          </div>
        </div>
      </main>
    </div>
  );
}

ResponseRenderer :
import React, { useState, createContext, useContext } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Check, Copy, ExternalLink, ChevronRight, Minus
} from 'lucide-react';

/* ─── Ordered list context (tracks counter for styled list items) ─────────── */
const ListContext = createContext({ ordered: false, counter: { val: 0 } });

/* ─── Code Block with copy button ────────────────────────────────────────── */
function CodeBlock({ children, className }) {
  const [copied, setCopied] = useState(false);
  const language = (className || '').replace('language-', '') || 'code';
  const code = String(children).replace(/\n$/, '');

  return (
    <div className="my-4 rounded-xl bg-[#FFFFFF] border border-gray-200 overflow-hidden shadow-lg">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#2EA8A4]">
          {language}
        </span>
        <button
          onClick={() => {
            navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className="flex items-center gap-1.5 text-[11px] text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
        >
          {copied
            ? <><Check size={12} className="text-[#2EA8A4]" /><span className="text-[#2EA8A4]">Copied</span></>
            : <><Copy size={12} /><span>Copy</span></>
          }
        </button>
      </div>
      <pre className="p-4 text-xs font-mono text-gray-900 overflow-x-auto whitespace-pre leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

/* ─── Inline code ─────────────────────────────────────────────────────────── */
function InlineCode({ children }) {
  return (
    <code className="bg-[#2EA8A4]/15 text-gray-500 font-mono text-[11px] px-1.5 py-0.5 rounded border border-[#2EA8A4]/30 mx-0.5">
      {children}
    </code>
  );
}

/* ─── Headings ────────────────────────────────────────────────────────────── */
const H1 = ({ children }) => (
  <div className="mt-6 mb-3 pb-3 border-b-2 border-[#2EA8A4]/40">
    <h1 className="text-lg sm:text-xl font-black tracking-tight text-gray-900 flex items-center gap-2.5">
      <span className="w-1.5 h-6 rounded-full bg-gradient-to-b from-[#2EA8A4] to-[#9ED4AC] inline-block shrink-0" />
      {children}
    </h1>
  </div>
);

const H2 = ({ children }) => (
  <div className="mt-5 mb-2">
    <h2 className="text-base sm:text-lg font-extrabold text-gray-900 flex items-center gap-2">
      <span className="w-5 h-5 rounded-md bg-[#2EA8A4]/20 border border-[#2EA8A4]/40 flex items-center justify-center shrink-0">
        <ChevronRight size={12} className="text-[#2EA8A4]" />
      </span>
      {children}
    </h2>
  </div>
);

const H3 = ({ children }) => (
  <h3 className="mt-4 mb-1.5 text-sm sm:text-base font-bold text-[#2EA8A4] flex items-center gap-1.5">
    <span className="w-2 h-2 rounded-full bg-[#2EA8A4]/60 inline-block shrink-0" />
    {children}
  </h3>
);

const H4 = ({ children }) => (
  <h4 className="mt-3 mb-1 text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wide">
    {children}
  </h4>
);

const H5 = ({ children }) => (
  <h5 className="mt-2 mb-1 text-xs font-bold text-gray-500/80">{children}</h5>
);

const H6 = ({ children }) => (
  <h6 className="mt-1 mb-1 text-xs font-semibold text-gray-500/60">{children}</h6>
);

/* ─── Paragraph ───────────────────────────────────────────────────────────── */
const Paragraph = ({ children }) => (
  <p className="text-xs sm:text-sm leading-relaxed text-gray-900 my-1.5">{children}</p>
);

/* ─── Strong / Em / Link ──────────────────────────────────────────────────── */
const Strong = ({ children }) => (
  <strong className="font-extrabold text-gray-900">{children}</strong>
);

const Em = ({ children }) => (
  <em className="italic text-gray-500">{children}</em>
);

const Link = ({ href, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-1 text-[#2EA8A4] hover:text-gray-500 font-semibold underline underline-offset-2 transition-colors mx-0.5"
  >
    {children}
    <ExternalLink size={11} />
  </a>
);

/* ─── Blockquote ─────────────────────────────────────────────────────────── */
const Blockquote = ({ children }) => (
  <blockquote className="my-4 pl-4 border-l-[3px] border-[#2EA8A4] bg-[#2EA8A4]/8 rounded-r-xl py-3 pr-4 text-gray-500 italic text-sm">
    {children}
  </blockquote>
);

/* ─── Horizontal rule ─────────────────────────────────────────────────────── */
const Hr = () => (
  <div className="my-5 flex items-center gap-3">
    <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
    <Minus size={12} className="text-gray-300 shrink-0" />
    <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
  </div>
);

/* ─── Lists ───────────────────────────────────────────────────────────────── */
const Ul = ({ children }) => (
  <ListContext.Provider value={{ ordered: false, counter: { val: 0 } }}>
    <ul className="my-2 space-y-1.5 pl-1">{children}</ul>
  </ListContext.Provider>
);

const Ol = ({ children, start }) => {
  const counter = { val: (start ?? 1) - 1 };
  return (
    <ListContext.Provider value={{ ordered: true, counter }}>
      <ol className="my-2 space-y-1.5 pl-1 list-none">{children}</ol>
    </ListContext.Provider>
  );
};

const Li = ({ children }) => {
  const { ordered, counter } = useContext(ListContext);
  if (ordered) {
    counter.val += 1;
    const num = counter.val;
    return (
      <li className="flex items-start gap-3 p-2.5 rounded-xl bg-gray-100/60 border border-gray-200/60 hover:border-[#2EA8A4]/40 transition-colors">
        <span className="w-6 h-6 rounded-lg bg-[#2EA8A4]/20 border border-[#2EA8A4]/40 text-[#2EA8A4] font-extrabold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
          {num}
        </span>
        <div className="flex-grow text-xs sm:text-sm text-gray-900 leading-relaxed pt-0.5">
          {children}
        </div>
      </li>
    );
  }
  return (
    <li className="flex items-start gap-2.5 text-gray-900">
      <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-[#2EA8A4] shrink-0 flex-none" />
      <span className="text-xs sm:text-sm leading-relaxed flex-grow">{children}</span>
    </li>
  );
};

/* ─── Table ──────────────────────────────────────────────────────────────── */
const Table = ({ children }) => (
  <div className="my-5 rounded-xl border border-slate-200 overflow-hidden shadow-sm">
    <div className="overflow-x-auto" data-lenis-prevent>
      <table className="w-full text-xs sm:text-sm border-collapse min-w-[400px]">
        {children}
      </table>
    </div>
  </div>
);

const Thead = ({ children }) => (
  <thead className="bg-slate-100">{children}</thead>
);

const Tbody = ({ children }) => (
  <tbody className="divide-y divide-slate-100">{children}</tbody>
);

const Tr = ({ children }) => (
  <tr className="transition-colors even:bg-slate-50/60">{children}</tr>
);

const Th = ({ children }) => (
  <th className="px-4 py-2.5 text-left text-xs font-bold text-slate-700 border-b border-slate-200">
    {children}
  </th>
);

const Td = ({ children }) => (
  <td className="px-4 py-2.5 text-slate-800 text-xs sm:text-sm border-b border-slate-100">
    {children}
  </td>
);

/* ─── Component map ──────────────────────────────────────────────────────── */
const components = {
  h1: H1, h2: H2, h3: H3, h4: H4, h5: H5, h6: H6,
  p: Paragraph,
  strong: Strong,
  em: Em,
  a: Link,
  blockquote: Blockquote,
  hr: Hr,
  ul: Ul,
  ol: Ol,
  li: Li,
  table: Table,
  thead: Thead,
  tbody: Tbody,
  tr: Tr,
  th: Th,
  td: Td,
  // code handles both inline and block depending on parent node
  code({ node, className, children, ...props }) {
    const isBlock = node?.parent?.tagName === 'pre';
    if (isBlock) return <CodeBlock className={className}>{children}</CodeBlock>;
    return <InlineCode>{children}</InlineCode>;
  },
  // Suppress the wrapping <pre> so CodeBlock renders its own
  pre({ children }) {
    return <>{children}</>;
  },
};

/* ─── Main export ────────────────────────────────────────────────────────── */
export default function ResponseRenderer({ text }) {
  if (!text) return null;

  // ── Clean n8n artifacts before passing to react-markdown ──────────────────
  // The n8n AI can leak internal node/panel references (e.g. ###PANEL-1-2-1,
  // **PANEL-1-2-1) when expression resolution fails or a branch isn't reached.
  // We strip those lines entirely so the valid markdown content renders cleanly.
  const normalised = text
    .split('\n')
    .filter(line => {
      const t = line.trim();
      
      // Strip leading markdown chars (bullets, numbers, headers, bold, italics, literal bullets) and trailing bold
      const stripped = t.replace(/^[#*\-.\s\d>•◦▪]+/, '').replace(/[*]+$/, '').trim();
      
      // If the remaining core text is just a PANEL reference, drop the line entirely
      if (/^PANEL\s*[-_]\s*[\d\-]+$/i.test(stripped)) {
        return false;
      }
      
      // Drop bare unresolved n8n expression placeholders {{ … }}
      if (/^\{\{.*\}\}\s*$/.test(t)) return false;
      
      return true;
    })
    .map(line => {
      const t = line.trim();
      // Normalise horizontal rules (---, ===, ***) to a single proper ---
      if (/^-{3,}$/.test(t) || /^={3,}$/.test(t) || /^\*{3,}$/.test(t)) return '---';
      // Remove inline PANEL references that sneak into otherwise valid lines
      return line.replace(/PANEL\s*[-_]\s*[\d\-]+/gi, '').replace(/\s{2,}/g, ' ');
    })
    .join('\n');

  return (
    <div className="bizra-markdown space-y-0.5 font-sans">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={components}
        skipHtml={false}
      >
        {normalised}
      </ReactMarkdown>
    </div>
  );
}

/* ─── Inline-only convenience export (kept for back-compat) ─────────────── */
export function renderFormattedInline(text) {
  if (!text) return null;
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => <>{children}</>,
        strong: Strong,
        em: Em,
        a: Link,
        code: ({ node, children }) => {
          const isBlock = node?.parent?.tagName === 'pre';
          return isBlock ? <code>{children}</code> : <InlineCode>{children}</InlineCode>;
        },
      }}
    >
      {text}
    </ReactMarkdown>
  );
}
