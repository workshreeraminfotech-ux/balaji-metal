import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MessageSquare, ArrowRight, ShieldCheck } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useSettings } from '@/hooks/useSettings';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';

const ContactCTA = () => {
  const { settings } = useSettings();
  const waNumber = (settings.whatsapp_number || settings.company_whatsapp || settings.whatsapp || '917600060193').replace('+', '');

  return (
    <section className="py-20 bg-white text-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="rounded-3xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 p-8 sm:p-12 lg:p-16 shadow-xl shadow-orange-500/20 relative overflow-hidden text-white">
          
          {/* Background subtle radial */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            <div className="lg:col-span-8 space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-black uppercase tracking-wider backdrop-blur-xs">
                <ShieldCheck size={14} />
                <span>Ready Stock & Custom Dispatch</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-white tracking-tight leading-tight">
                Ready to Upgrade Your Industrial Power Transmission?
              </h2>
              
              <p className="text-orange-50 font-medium text-base sm:text-lg max-w-2xl">
                Get high-precision couplings, pulleys, and custom castings manufactured to your exact technical specifications with factory-direct pricing.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <a
                href={`https://wa.me/${waNumber}?text=Hello%20Balaji%20Metal,%20I%20would%20like%20to%20request%20an%20instant%20quotation.`}
                target="_blank"
                rel="noreferrer"
                className="w-full"
              >
                <button
                  className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-4 px-6 rounded-xl shadow-lg border border-[#25D366]/40 flex items-center justify-center gap-2.5 text-base cursor-pointer hover:scale-[1.02] transition-all"
                >
                  <WhatsAppIcon size={20} fill="#ffffff" />
                  <span>Instant WhatsApp RFQ</span>
                </button>
              </a>

              <Link to="/contact" className="w-full">
                <button
                  className="w-full bg-white hover:bg-orange-50 text-slate-900 font-bold py-4 px-6 rounded-xl shadow-md border-2 border-white flex items-center justify-center gap-2.5 text-base cursor-pointer hover:scale-[1.02] transition-all"
                >
                  <span>Submit Inquiry Form</span>
                  <ArrowRight size={18} className="text-orange-600" />
                </button>
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default ContactCTA;
