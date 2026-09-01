import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ShieldCheck, CheckCircle2, Award, 
  Cpu, FileText, ChevronRight, Layers, Sparkles 
} from 'lucide-react';
import { COMPANY_INFO } from '@/data/companyData';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';

export default function QuickSpecModal({ product, isOpen, onClose, onOpenQuote }) {
  const [activeTab, setActiveTab] = useState('specs'); // 'specs' | 'sizes' | 'features' | 'applications'

  if (!isOpen || !product) return null;

  const specifications = Array.isArray(product.specifications) ? product.specifications : [];
  const sizes = Array.isArray(product.available_sizes) ? product.available_sizes : [];
  const features = Array.isArray(product.features) ? product.features : [];
  const applications = Array.isArray(product.applications) ? product.applications : [];

  const whatsappMessage = `Hello Balaji Metal Team,\nI am reviewing the *${product.name}* specification sheet on your website and would like price quotation and dispatch time.`;
  const whatsappUrl = `https://wa.me/${COMPANY_INFO.whatsapp.replace('+', '')}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md">
        {/* Backdrop Click */}
        <div className="fixed inset-0" onClick={onClose} />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.22 }}
          className="relative bg-white rounded-3xl border border-slate-200/90 shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden z-10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/35 text-[11px] font-bold uppercase tracking-wider">
                {product.category_name}
              </span>
              <span className="text-slate-300 text-xs font-mono font-bold hidden sm:inline">Quick Engineering Spec Sheet</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
              title="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-5 sm:p-7 overflow-y-auto space-y-6">
            {/* Top Product Showcase in Modal */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Visual Container */}
              <div className="md:col-span-4 bg-gradient-to-b from-slate-50 to-slate-100/70 border border-slate-200/80 rounded-2xl p-5 flex items-center justify-center aspect-square shadow-inner">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain filter drop-shadow-md"
                />
              </div>

              {/* Summary & Metrics */}
              <div className="md:col-span-8 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    Ready Stock & Custom Pilot Bore
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono font-bold">
                    ISO 1940 G6.3
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-heading font-black text-slate-900 tracking-tight leading-snug">
                  {product.name}
                </h3>
                
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  {product.description || product.short_description}
                </p>

                {/* Material & Standards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="block text-[10px] uppercase font-bold text-slate-400">Material Grade</span>
                    <span className="text-xs font-black text-orange-600 truncate block">{product.material}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="block text-[10px] uppercase font-bold text-slate-400">Balancing</span>
                    <span className="text-xs font-black text-slate-800">ISO 1940 G6.3</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 col-span-2 sm:col-span-1">
                    <span className="block text-[10px] uppercase font-bold text-slate-400">Keyway Standard</span>
                    <span className="text-xs font-black text-slate-800">DIN 6885 / IS 210</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs in Modal */}
            <div className="border-b border-slate-200 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {[
                { id: 'specs', label: 'Technical Specifications' },
                { id: 'sizes', label: `Standard Sizing (${sizes.length})` },
                { id: 'features', label: 'Key Features' },
                { id: 'applications', label: 'Industrial Applications' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB 1: Specifications Matrix Table */}
            {activeTab === 'specs' && specifications.length > 0 && (
              <div className="space-y-3">
                <div className="overflow-hidden rounded-2xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 uppercase text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="px-5 py-3">Engineering Parameter</th>
                        <th className="px-5 py-3">Standard Factory Value / Tolerance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {specifications.map((s, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-slate-50/60 hover:bg-slate-50'}>
                          <td className="px-5 py-2.5 font-bold text-slate-900">{s.key}</td>
                          <td className="px-5 py-2.5 font-mono font-semibold text-orange-700">{s.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 2: Available Sizes Matrix */}
            {activeTab === 'sizes' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-500 font-medium">Click on any size below to request an instant quotation for that exact dimension:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                  {sizes.map((sz, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        onClose();
                        onOpenQuote(product, sz);
                      }}
                      className="p-3 rounded-xl bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-400 transition-all flex flex-col justify-between text-left group shadow-xs cursor-pointer"
                    >
                      <span className="text-[10px] font-mono text-slate-400 font-bold group-hover:text-orange-500">#{i + 1}</span>
                      <span className="text-xs font-bold text-slate-900 group-hover:text-orange-600 py-1">{sz}</span>
                      <span className="text-[10px] font-bold text-orange-600 flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                        <span>Get Quote</span>
                        <ChevronRight size={12} />
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: Features */}
            {activeTab === 'features' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {features.map((f, i) => (
                    <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="text-orange-600 shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-800 font-semibold leading-relaxed">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: Applications */}
            {activeTab === 'applications' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {applications.map((app, i) => (
                    <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-md">
                        {app.industry || 'Industrial Drive'}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 pt-1">{app.application || app}</h4>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Footer Actions */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
              <ShieldCheck size={16} className="text-emerald-600" />
              <span>Direct Manufacturer Guarantee with MTC Certificate</span>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <WhatsAppIcon size={16} fill="#ffffff" />
                <span>Instant WhatsApp RFQ</span>
              </a>

              <button
                onClick={() => {
                  onClose();
                  onOpenQuote(product);
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold text-xs shadow-md shadow-orange-500/20 cursor-pointer transition-all"
              >
                Request Quotation
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
