import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, ShieldCheck } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Rajeshwar Patil",
      role: "Chief Maintenance Engineer",
      company: "Gujarat Process Pumps & Motors Pvt Ltd",
      content: "We have been sourcing Pin Bush Couplings and V-Belt Pulleys from Balaji Metal for the past 6 years. Their dynamic balancing and machining precision are top-tier. Bearing vibration on our 75HP slurry pumps reduced significantly.",
      rating: 5
    },
    {
      name: "Suresh Mehta",
      role: "General Manager - Procurement",
      company: "Surat Textile Machinery Works",
      content: "Balaji Metal delivers consistent cast iron quality without blowholes or casting defects. Their ready stock in Rajkot allows us to fulfill rush machine build orders across Maharashtra and Tamil Nadu with zero delays.",
      rating: 5
    },
    {
      name: "Vikram Singhania",
      role: "Plant Head",
      company: "Apex Crushing & Heavy Mining Equipment",
      content: "For extreme shock loads in stone crushers, their heavy-duty SPC pulleys and flexible couplings have lasted twice as long as standard market alternatives. Truly reliable precision engineering.",
      rating: 5
    }
  ];

  return (
    <section className="py-20 lg:py-24 bg-white text-slate-900 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold">
            <span>Client Endorsements</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-slate-900 tracking-tight">
            Trusted by Industry Leaders Across India
          </h2>
          <p className="text-slate-600 text-base">
            See how our precision power transmission components drive plant performance.
          </p>
        </div>

        {/* Testimonials Grid - Clean White */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="p-8 rounded-3xl bg-slate-50 border border-slate-200/90 flex flex-col justify-between relative group hover:border-orange-300 hover:bg-white transition-all shadow-xs hover:shadow-lg"
            >
              <div>
                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-amber-500 mb-5">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>

                <p className="text-slate-700 text-sm leading-relaxed mb-6 italic font-medium">
                  "{t.content}"
                </p>
              </div>

              <div className="pt-6 border-t border-slate-200 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-700 font-black flex items-center justify-center font-heading text-sm shadow-xs">
                  {t.name[0]}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{t.name}</h4>
                  <p className="text-xs text-orange-700 font-semibold">{t.role}</p>
                  <p className="text-[11px] text-slate-500">{t.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Testimonials;
