import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, PhoneCall } from 'lucide-react';
import { COMPANY_INFO } from '@/data/companyData';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "What grades of Cast Iron do you use for Pin Bush Couplings and Pulleys?",
      answer: "We manufacture using high-tensile Grey Cast Iron conforming to IS 210 Grade FG 200, FG 220, and FG 250. For heavy impact or critical applications, we also provide ductile SG Iron (Spheroidal Graphite) and forged EN8/EN9 steel hubs."
    },
    {
      question: "Are your V-Belt Pulleys and Couplings dynamically balanced?",
      answer: "Yes, all our pulleys and high-speed couplings undergo computer-assisted static and dynamic balancing adhering to ISO 1940 Grade G6.3 (with G2.5 precision balancing available on custom OEM requests) to ensure vibration-free running up to 30 m/s rim speeds."
    },
    {
      question: "Can you provide custom bore sizes, keyways, and special tolerances?",
      answer: "Absolutely. In addition to pilot bores and standard taper lock bushings, we machine finished bores with precise IS/DIN standard keyways, set-screw tapings, and splines based on your machine shaft specifications."
    },
    {
      question: "What is the typical dispatch lead time for standard vs. customized components?",
      answer: "Standard catalog sizes of Pin Bush Couplings (100 to 350) and popular V-Belt Pulleys (SPA, SPB, SPC) are kept in ready inventory for same-day or 24-48 hour dispatch. Custom castings and special bore orders typically ship within 3 to 7 working days."
    },
    {
      question: "Do you supply pan-India and assist with transport logistics?",
      answer: "Yes, Balaji Metal serves clients across India with daily logistics dispatch to Gujarat, Maharashtra, Rajasthan, Tamil Nadu, Karnataka, Punjab, and other major industrial hubs."
    }
  ];

  return (
    <section className="py-20 lg:py-24 bg-slate-50 text-slate-900 border-b border-slate-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold">
            <HelpCircle size={14} className="text-orange-600" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-slate-900 tracking-tight">
            Technical & Purchasing FAQs
          </h2>
          <p className="text-slate-600 text-base">
            Everything you need to know about our metallurgy, tolerances, sizing, and order fulfillment.
          </p>
        </div>

        {/* FAQ Accordion - Clean White */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="w-full p-6 text-left flex justify-between items-center gap-4 focus:outline-none cursor-pointer"
                >
                  <span className="font-heading font-bold text-base sm:text-lg text-slate-900">
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-orange-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    <ChevronDown size={18} />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-6 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-100 pt-4 font-medium">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Quick Help Box */}
        <div className="mt-12 p-6 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-xs">
          <div>
            <h4 className="text-base font-bold text-slate-900">Have a customized drawing or tender requirement?</h4>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Speak directly with our technical engineering team for instant advice.</p>
          </div>
          <a
            href={`tel:${COMPANY_INFO.phones[0].raw}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-500/20 whitespace-nowrap cursor-pointer"
          >
            <PhoneCall size={14} />
            <span>Call +91 76000 60193</span>
          </a>
        </div>

      </div>
    </section>
  );
};

export default FAQ;
