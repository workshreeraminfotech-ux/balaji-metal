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
    <section className="py-12 sm:py-20 bg-white text-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="rounded-3xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 p-5 sm:p-12 lg:p-16 shadow-xl shadow-orange-500/20 relative overflow-hidden text-white">
          
          {/* Background subtle radial */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-center relative z-10">
            
            <div className="lg:col-span-8 space-y-2.5 sm:space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-white/20 text-white text-[11px] sm:text-xs font-black uppercase tracking-wider backdrop-blur-xs">
                <ShieldCheck size={13} className="sm:w-3.5 sm:h-3.5" />
                <span>Ready Stock & Custom Dispatch</span>
              </div>
              
              <h2 className="text-xl sm:text-3xl lg:text-5xl font-heading font-black text-white tracking-tight leading-snug sm:leading-tight">
                Ready to Upgrade Your Industrial Power Transmission?
              </h2>
              
              <p className="text-orange-50 font-medium text-xs sm:text-base lg:text-lg max-w-2xl leading-relaxed">
                Get high-precision couplings, pulleys, and custom castings manufactured to your exact technical specifications with factory-direct pricing.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-2.5 sm:gap-3 justify-center">
              <a
                href={`https://wa.me/${waNumber}?text=Hello%20Balaji%20Metal,%20I%20would%20like%20to%20request%20an%20instant%20quotation.`}
                target="_blank"
                rel="noreferrer"
                className="w-full"
              >
                <button
                  className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-2.5 px-4 sm:py-4 sm:px-6 rounded-xl shadow-lg border border-[#25D366]/40 flex items-center justify-center gap-2 text-xs sm:text-base cursor-pointer hover:scale-[1.02] transition-all"
                >
                  <WhatsAppIcon size={16} fill="#ffffff" className="sm:w-5 sm:h-5" />
                  <span>Instant WhatsApp RFQ</span>
                </button>
              </a>

              <Link to="/contact" className="w-full">
                <button
                  className="w-full bg-white hover:bg-orange-50 text-slate-900 font-bold py-2.5 px-4 sm:py-4 sm:px-6 rounded-xl shadow-md border-2 border-white flex items-center justify-center gap-2 text-xs sm:text-base cursor-pointer hover:scale-[1.02] transition-all"
                >
                  <span>Submit Inquiry Form</span>
                  <ArrowRight size={15} className="text-orange-600 sm:w-[18px] sm:h-[18px]" />
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
