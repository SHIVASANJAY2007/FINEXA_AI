import React, { useState, useRef, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Printer, X, Award, CheckCircle2, Sparkles, RefreshCw } from 'lucide-react';

const generateRandomCertId = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let segment1 = '';
  let segment2 = '';
  for (let i = 0; i < 4; i++) {
    segment1 += chars.charAt(Math.floor(Math.random() * chars.length));
    segment2 += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `FNX-${segment1}-2026-${segment2}`;
};

const CertificateModal = ({ isOpen, onClose, userXP = 1350 }) => {
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('finexa_user_name') || 'Alex Vance';
  });
  
  const [certificateId, setCertificateId] = useState(() => {
    const saved = localStorage.getItem('finexa_cert_id');
    if (saved) return saved;
    const newId = generateRandomCertId();
    localStorage.setItem('finexa_cert_id', newId);
    return newId;
  });

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  // Save name when changed
  const handleNameChange = (e) => {
    setUserName(e.target.value);
    localStorage.setItem('finexa_user_name', e.target.value);
  };

  // Regenerate new unique Verification ID
  const handleRegenerateId = () => {
    const newId = generateRandomCertId();
    setCertificateId(newId);
    localStorage.setItem('finexa_cert_id', newId);
  };

  // High-Precision Pixel-Perfect 2K Canvas Downloader utilizing finexa_seal.png centered and aligned
  const handleDownloadPNG = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set 2K ultra-high resolution (2000 x 1414) matching A4 landscape proportions (1.414:1)
    canvas.width = 2000;
    canvas.height = 1414;

    const bgImage = new Image();
    bgImage.crossOrigin = 'anonymous';
    bgImage.src = '/certificate_bg.png';

    const sealImage = new Image();
    sealImage.crossOrigin = 'anonymous';
    sealImage.src = '/finexa_seal.png';

    const drawCertificate = () => {
      // 1. Draw Background Image or Ivory Fill
      if (bgImage.complete && bgImage.naturalWidth !== 0) {
        ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
      } else {
        ctx.fillStyle = '#FDF6ED';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // 2. Draw Translucent Ivory Parchment Tint Overlay
      ctx.fillStyle = 'rgba(253, 246, 237, 0.92)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 3. Draw Outer Burgundy Frame (24px thickness)
      ctx.strokeStyle = 'rgba(107, 30, 43, 0.25)';
      ctx.lineWidth = 24;
      ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

      // 4. Draw Inner Gold Border Lines
      ctx.strokeStyle = 'rgba(201, 162, 39, 0.6)';
      ctx.lineWidth = 6;
      ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);

      ctx.strokeStyle = 'rgba(107, 30, 43, 0.4)';
      ctx.lineWidth = 2;
      ctx.strokeRect(64, 64, canvas.width - 128, canvas.height - 128);

      // 5. Draw Faint Central Watermark Text "FINEXA"
      ctx.save();
      ctx.fillStyle = 'rgba(201, 162, 39, 0.05)';
      ctx.font = 'bold 220px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('FINEXA', canvas.width / 2, canvas.height / 2);
      ctx.restore();

      // 6. Header Section: Pill Badge "✦ OFFICIAL CREDENTIALS"
      const pillWidth = 340;
      const pillHeight = 46;
      const pillX = (canvas.width - pillWidth) / 2;
      const pillY = 120;

      ctx.fillStyle = 'rgba(201, 162, 39, 0.15)';
      ctx.strokeStyle = 'rgba(201, 162, 39, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(pillX, pillY, pillWidth, pillHeight, 23);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#C9A227';
      ctx.font = 'bold 18px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✦  OFFICIAL CREDENTIALS', canvas.width / 2, pillY + 30);

      // 7. Certificate Main Title
      ctx.fillStyle = '#3A2E25';
      ctx.font = 'bold 64px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText('CERTIFICATE OF MASTERY', canvas.width / 2, 250);

      // 8. Academy Subtitle
      ctx.fillStyle = '#6B1E2B';
      ctx.font = 'italic 28px Georgia, serif';
      ctx.fillText('FINEXA AI Academy of Quantitative Finance', canvas.width / 2, 305);

      // 9. Recipient Lead Text
      ctx.fillStyle = '#786B60';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('THIS CERTIFIES THAT', canvas.width / 2, 420);

      // 10. Student Name (Clean 68px Georgia Font)
      const formattedName = (userName || 'Valued Scholar').trim();
      ctx.fillStyle = '#6B1E2B';
      ctx.font = 'bold 68px Georgia, serif';
      ctx.fillText(formattedName, canvas.width / 2, 520);

      // 11. Gold Underline beneath name
      const nameWidth = Math.max(400, ctx.measureText(formattedName).width);
      const underlineStartX = (canvas.width - nameWidth) / 2;
      const underlineEndX = (canvas.width + nameWidth) / 2;
      ctx.beginPath();
      ctx.moveTo(underlineStartX, 550);
      ctx.lineTo(underlineEndX, 550);
      ctx.strokeStyle = '#C9A227';
      ctx.lineWidth = 4;
      ctx.stroke();

      // 12. Achievement Description Text (Strict Valid Font Strings: 22px sans-serif)
      ctx.fillStyle = '#3A2E25';
      ctx.font = '22px sans-serif';
      ctx.fillText(
        'has successfully completed all 6 Advanced Financial & Quantitative Modules, demonstrating',
        canvas.width / 2,
        630
      );
      ctx.fillText(
        'mastery in Personal Finance, Equity Valuation, Charting, Risk Management, DeFi, and Quant AI.',
        canvas.width / 2,
        670
      );

      // 13. Stats Callout Box
      ctx.fillStyle = '#6B1E2B';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText(`SCORE: 100% PERFECT PASS  |  TOTAL ACCUMULATED: ${userXP} XP`, canvas.width / 2, 730);

      // 14. Horizontal Divider Line above footer
      ctx.beginPath();
      ctx.moveTo(120, 1080);
      ctx.lineTo(1880, 1080);
      ctx.strokeStyle = 'rgba(58, 46, 37, 0.15)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 15. Footer - LEFT COLUMN (Completion Date, Verification ID, Green Verified Pill)
      ctx.textAlign = 'left';
      ctx.fillStyle = '#786B60';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('DATE OF COMPLETION:', 140, 1145);
      ctx.fillStyle = '#3A2E25';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(currentDate, 400, 1145);

      ctx.fillStyle = '#786B60';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('VERIFICATION ID:', 140, 1185);
      ctx.fillStyle = '#6B1E2B';
      ctx.font = 'bold 20px monospace';
      ctx.fillText(certificateId, 340, 1185);

      // Verified Green Pill
      const vPillWidth = 230;
      const vPillHeight = 36;
      ctx.fillStyle = '#ECFDF5';
      ctx.strokeStyle = '#A7F3D0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(140, 1220, vPillWidth, vPillHeight, 18);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#047857';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('✓  Verified Credential', 165, 1244);

      // 16. Footer - CENTER COLUMN (Using finexa_seal.png Sized 160x160 and Perfectly Centered)
      const sealSize = 160;
      const sealX = (canvas.width - sealSize) / 2;
      const sealY = 1090;

      if (sealImage.complete && sealImage.naturalWidth !== 0) {
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
        ctx.shadowBlur = 15;
        ctx.shadowOffsetY = 4;
        ctx.drawImage(sealImage, sealX, sealY, sealSize, sealSize);
        ctx.restore();
      } else {
        // Fallback 3D Seal
        ctx.fillStyle = '#C9A227';
        ctx.beginPath();
        ctx.arc(canvas.width / 2, 1170, 65, 0, Math.PI * 2);
        ctx.fill();
      }

      // Official Seal Label below
      ctx.fillStyle = '#786B60';
      ctx.font = 'bold 15px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('OFFICIAL SEAL', canvas.width / 2, 1265);

      // 17. Footer - RIGHT COLUMN (Signature & Title)
      ctx.textAlign = 'right';
      ctx.fillStyle = '#3A2E25';
      ctx.font = 'bold italic 36px Georgia, serif';
      ctx.fillText('Dr. Julian Vance', 1860, 1160);

      // Signature line under signature
      ctx.beginPath();
      ctx.moveTo(1560, 1180);
      ctx.lineTo(1860, 1180);
      ctx.strokeStyle = 'rgba(58, 46, 37, 0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#3A2E25';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('CHIEF AI STRATEGIST', 1860, 1210);

      ctx.fillStyle = '#786B60';
      ctx.font = '16px sans-serif';
      ctx.fillText('FINEXA Quantitative Research', 1860, 1238);

      // 18. Trigger High-Res Download
      const link = document.createElement('a');
      link.download = `FINEXA_Mastery_Certificate_${formattedName.replace(/\s+/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    };

    let loadedCount = 0;
    const checkAndDraw = () => {
      loadedCount++;
      if (loadedCount >= 2 || (bgImage.complete && sealImage.complete)) {
        drawCertificate();
      }
    };

    bgImage.onload = checkAndDraw;
    bgImage.onerror = checkAndDraw;
    sealImage.onload = checkAndDraw;
    sealImage.onerror = checkAndDraw;

    if (bgImage.complete && sealImage.complete) {
      drawCertificate();
    }
  };

  // Trigger Native Print Dialog
  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 sm:p-6 overflow-y-auto print:p-0 print:static">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-ink/75 backdrop-blur-md print:hidden"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-5xl bg-ivory rounded-3xl shadow-2xl border border-beige/60 overflow-hidden z-10 my-auto flex flex-col max-h-[92vh] print:max-h-none print:shadow-none print:border-none print:w-full print:rounded-none"
        >
          {/* Top Bar - Controls */}
          <div className="bg-cream border-b border-beige/40 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0 print:hidden">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-10 h-10 rounded-xl bg-gold/20 text-gold flex items-center justify-center border border-gold/40 shrink-0">
                <Award size={22} />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-gold">
                  Official Verification
                </span>
                <h3 className="text-lg font-serif font-bold text-ink leading-tight">
                  Master Certificate of Financial Mastery
                </h3>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <button
                onClick={handleDownloadPNG}
                className="px-5 py-2.5 rounded-full bg-burgundy text-ivory text-xs font-bold uppercase tracking-wider hover:brightness-110 transition-all flex items-center gap-2 shadow-md cursor-pointer"
              >
                <Download size={15} /> Download High-Res PNG
              </button>

              <button
                onClick={handlePrint}
                className="px-4 py-2.5 rounded-full bg-ink text-ivory text-xs font-bold uppercase tracking-wider hover:bg-taupe transition-all flex items-center gap-2 cursor-pointer"
              >
                <Printer size={15} /> Print / Save PDF
              </button>

              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-beige/30 hover:bg-beige/60 text-ink flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Name & ID Customization Bar */}
          <div className="bg-ivory border-b border-beige/40 px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0 print:hidden">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <label className="text-xs font-bold text-taupe uppercase tracking-wider whitespace-nowrap">
                Certificate Name:
              </label>
              <input
                type="text"
                value={userName}
                onChange={handleNameChange}
                placeholder="Enter your full legal name..."
                className="w-full sm:w-80 bg-cream border border-beige/60 rounded-xl px-4 py-1.5 text-sm font-bold text-ink focus:outline-none focus:border-burgundy"
              />
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-taupe">
              <span>Verification ID: <strong className="text-burgundy font-mono">{certificateId}</strong></span>
              <button
                onClick={handleRegenerateId}
                title="Generate New Unique Verification ID"
                className="p-1.5 rounded-lg bg-beige/40 hover:bg-beige/80 text-ink transition-colors cursor-pointer"
              >
                <RefreshCw size={14} />
              </button>
            </div>
          </div>

          {/* Scrollable Preview Section */}
          <div className="p-2 sm:p-8 overflow-y-auto overflow-x-auto flex-grow bg-ink/5 flex items-center justify-start sm:justify-center">
            
            {/* Live Visual Certificate Component */}
            <div 
              id="certificate-print-area"
              className="relative w-full min-w-[540px] sm:min-w-0 max-w-[900px] aspect-[1.414/1] bg-cream rounded-2xl shadow-2xl border-4 sm:border-8 border-burgundy/20 p-6 sm:p-12 flex flex-col justify-between overflow-hidden relative print:w-full print:max-w-none print:shadow-none print:border-4 print:border-gold my-2"
              style={{
                backgroundImage: `linear-gradient(rgba(253, 246, 237, 0.92), rgba(253, 246, 237, 0.94)), url('/certificate_bg.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {/* Gold Inner Border Line */}
              <div className="absolute inset-4 border-2 border-gold/60 rounded-xl pointer-events-none" />
              <div className="absolute inset-5 border border-burgundy/40 rounded-lg pointer-events-none" />

              {/* Watermark Crest */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gold/10 text-[180px] font-serif pointer-events-none font-bold select-none">
                FINEXA
              </div>

              {/* Header */}
              <div className="text-center relative z-10 pt-2">
                <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gold/15 border border-gold/40 text-gold text-[10px] sm:text-xs font-extrabold uppercase tracking-widest mb-2">
                  <Sparkles size={14} /> Official Credentials
                </div>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-ink tracking-tight uppercase leading-none">
                  Certificate of Mastery
                </h2>
                <p className="text-burgundy font-serif italic text-sm sm:text-lg mt-2">
                  FINEXA AI Academy of Quantitative Finance
                </p>
              </div>

              {/* Recipient Name Section */}
              <div className="text-center relative z-10 py-4 my-auto">
                <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-taupe mb-2">
                  This certifies that
                </p>
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-burgundy tracking-tight underline decoration-gold decoration-2 underline-offset-8">
                  {userName || 'Valued Scholar'}
                </h1>
                <p className="text-xs sm:text-sm text-ink max-w-xl mx-auto mt-6 leading-relaxed font-normal">
                  has successfully completed all 6 Advanced Financial & Quantitative Modules, demonstrating mastery in Personal Finance, Equity Valuation, Charting, Risk Management, DeFi, and Quant AI.
                </p>
              </div>

              {/* Footer Details with finexa_seal.png centered */}
              <div className="flex items-end justify-between relative z-10 pt-4 border-t border-beige/60">
                {/* Issue Info */}
                <div className="text-left space-y-1">
                  <p className="text-[11px] font-bold text-taupe uppercase tracking-wider">
                    Date of Completion: <span className="text-ink font-semibold">{currentDate}</span>
                  </p>
                  <p className="text-[11px] font-bold text-taupe uppercase tracking-wider">
                    Verification ID: <span className="text-burgundy font-mono font-semibold">{certificateId}</span>
                  </p>
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full mt-1">
                    <CheckCircle2 size={12} /> Verified Credential
                  </div>
                </div>

                {/* Sized & Centered finexa_seal.png */}
                <div className="flex flex-col items-center">
                  <img
                    src="/finexa_seal.png"
                    alt="FINEXA Official Seal"
                    className="w-20 h-20 sm:w-24 sm:h-24 object-contain drop-shadow-xl hover:scale-105 transition-transform"
                  />
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-taupe mt-1">Official Seal</span>
                </div>

                {/* Signature */}
                <div className="text-right">
                  <div className="font-serif italic text-lg sm:text-2xl text-ink font-bold border-b border-taupe/40 pb-1 mb-1 font-serif">
                    Dr. Julian Vance
                  </div>
                  <p className="text-[11px] font-bold text-ink uppercase tracking-wider">Chief AI Strategist</p>
                  <p className="text-[10px] text-taupe">FINEXA Quantitative Research</p>
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default memo(CertificateModal);
