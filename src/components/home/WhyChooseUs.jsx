import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Cpu, Scale, Settings2, Truck, CheckCircle2, Award } from 'lucide-react';

const WhyChooseUs = () => {
  const features = [
    {
      icon: Scale,
      title: "Dynamic Balancing (ISO 1940 G6.3)",
      description: "Every pulley and coupling hub is balanced statically and dynamically on computerized balancing machines to eliminate vibration and shaft strain.",
      color: "bg-orange-50 text-orange-600 border-orange-200"
    },
    {
      icon: ShieldCheck,
      title: "Spectro Chemical Analysis",
      description: "100% verified raw material composition (FG 220/250 Grey Cast Iron, EN8, Forged Steel) tested with Optical Emission Spectrometry before casting.",
      color: "bg-blue-50 text-blue-600 border-blue-200"
    },
    {
      icon: Cpu,
      title: "Precision Turned Grooves",
      description: "Precision lathe turning ensures exact belt groove angles, tight dimensional runout tolerances, and flawless concentricity.",
      color: "bg-emerald-50 text-emerald-600 border-emerald-200"
    },
    {
      icon: Settings2,
      title: "Custom Machining & Bores",
      description: "Tailored bore sizes, keyways (DIN 6885 / BS 4235), taper lock bush adaptations, and bespoke casting as per client mechanical drawings.",
      color: "bg-purple-50 text-purple-600 border-purple-200"
    },
    {
      icon: Award,
      title: "25+ Years Manufacturing Heritage",
      description: "Decades of deep foundry and precision machining expertise trusted by heavy machinery OEMs, chemical plants, and mining contractors.",
      color: "bg-amber-50 text-amber-600 border-amber-200"
    },
    {
      icon: Truck,
      title: "Pan-India Ready Dispatch",
      description: "Large inventory of standard Pin Bush Couplings, Star Couplings, and SPA/SPB/SPC pulleys ready for prompt delivery across India.",
      color: "bg-rose-50 text-rose-600 border-rose-200"
    }
  ];

  return (
    <section className="py-20 lg:py-24 bg-slate-50 text-slate-900 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold">
            <span>Precision Engineering Standards</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-slate-900 tracking-tight">
            Why Balaji Metal is Trusted by 500+ Industrial Clients
          </h2>
          <p className="text-slate-600 text-base">
            We don't compromise on metallurgy or tolerances. Here is what sets our power transmission components apart.
          </p>
        </div>

        {/* Feature Grid - Clean White Theme */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="p-8 rounded-3xl bg-white border border-slate-200/90 hover:border-orange-400 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 group flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center mb-6 group-hover:scale-110 transition-all ${feature.color}`}>
                    <Icon size={28} />
                  </div>
                  <h3 className="text-xl font-heading font-black text-slate-900 mb-3 group-hover:text-orange-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed font-medium">
                    {feature.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-100 mt-6 flex items-center gap-2 text-xs font-bold text-orange-700">
                  <CheckCircle2 size={14} className="text-orange-600" />
                  <span>Quality Guaranteed</span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;
