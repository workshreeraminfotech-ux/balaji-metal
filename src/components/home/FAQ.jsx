import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

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
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-bold uppercase tracking-wider mb-3">
            <HelpCircle size={14} />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-black tracking-tight text-slate-900">
            Frequently Asked <span className="text-orange-600">Questions</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-3 font-normal">
            Common technical and procurement queries regarding our castings, tolerances, and supply.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={faq.question}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen 
                    ? 'bg-white border-orange-300 shadow-md shadow-orange-500/5' 
                    : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="w-full py-4.5 px-5 sm:px-6 text-left flex items-center justify-between gap-4 font-heading font-bold text-slate-900 text-base sm:text-lg cursor-pointer"
                >
                  <span className={isOpen ? 'text-orange-600 font-extrabold' : ''}>{faq.question}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                    isOpen ? 'bg-orange-100 text-orange-600 rotate-180' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <ChevronDown size={18} />
                  </div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
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

      </div>
    </section>
  );
};

export default FAQ;
