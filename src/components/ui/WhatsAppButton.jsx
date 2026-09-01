import React, { useState } from 'react';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';
import { COMPANY_INFO } from '@/data/companyData';

export default function WhatsAppButton() {
  const [isHovered, setIsHovered] = useState(false);
  const waNumber = (COMPANY_INFO.whatsapp || '917600060193').replace('+', '');
  const waUrl = `https://wa.me/${waNumber}?text=Hello%20Balaji%20Metal,%20I%20am%20visiting%20your%20website%20and%20would%20like%20to%20inquire%20about%20your%20power%20transmission%20products.`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* Tooltip on hover */}
      {isHovered && (
        <div className="hidden sm:flex items-center bg-slate-950 text-white text-xs font-bold px-3.5 py-2 rounded-2xl shadow-xl border border-slate-800 animate-in fade-in slide-in-from-right-2 duration-200">
          <span>Chat on WhatsApp</span>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-xl shadow-emerald-500/30 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-[#25D366]/40 cursor-pointer group"
        aria-label="Chat on WhatsApp"
      >
        <div className="absolute inset-0 rounded-full animate-ping bg-[#25D366] opacity-25 pointer-events-none group-hover:hidden"></div>
        <WhatsAppIcon size={30} fill="#ffffff" className="relative z-10 filter drop-shadow-xs" />
      </a>
    </div>
  );
}
