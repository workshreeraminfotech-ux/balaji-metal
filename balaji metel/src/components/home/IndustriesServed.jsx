import React from 'react';
import { motion } from 'framer-motion';
import { Droplet, Hammer, Shirt, Wind, Zap, Shovel, Cog, Cpu } from 'lucide-react';

const IndustriesServed = () => {
  const industries = [
    {
      icon: Droplet,
      name: "Chemical & Process Pumps",
      description: "Centrifugal pumps, petrochemical reactors, and slurries requiring cushioned pin bush and star couplings.",
      color: "bg-blue-50 text-blue-600 border-blue-200"
    },
    {
      icon: Hammer,
      name: "Mining & Stone Crushers",
      description: "Jaw crushers, cone crushers, vibrating screens, and heavy SPC/SPB multi-groove drive pulleys.",
      color: "bg-orange-50 text-orange-600 border-orange-200"
    },
    {
      icon: Shirt,
      name: "Textile Machinery",
      description: "Spinning frames, ring frames, carding machines, and balanced timing & V-belt pulleys.",
      color: "bg-purple-50 text-purple-600 border-purple-200"
    },
    {
      icon: Wind,
      name: "HVAC & Industrial Blowers",
      description: "Ventilation blowers, exhaust fans, and cooling towers requiring silent, vibration-free couplings.",
      color: "bg-teal-50 text-teal-600 border-teal-200"
    },
    {
      icon: Zap,
      name: "Power Generation & DG Sets",
      description: "Diesel generators, turbine auxiliary drives, and flexible power transmission systems.",
      color: "bg-amber-50 text-amber-600 border-amber-200"
    },
    {
      icon: Shovel,
      name: "Agriculture & Agro Equipment",
      description: "Rice mill polishers, flour mill grinders, agricultural tractors, and belt transmission.",
      color: "bg-emerald-50 text-emerald-600 border-emerald-200"
    },
    {
      icon: Cog,
      name: "Machine Tools & CNCs",
      description: "Industrial lathe headstocks, milling feed controls, and precision cast iron hand wheels.",
      color: "bg-slate-100 text-slate-700 border-slate-300"
    },
    {
      icon: Cpu,
      name: "Automation & Material Handling",
      description: "Conveyor systems, overhead cranes, bucket elevators, and elastomeric spider couplings.",
      color: "bg-rose-50 text-rose-600 border-rose-200"
    }
  ];

  return (
    <section className="py-20 lg:py-24 bg-slate-50 text-slate-900 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold">
            <span>Versatile Application Engineering</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-slate-900 tracking-tight">
            Industries Powered by Balaji Metal
          </h2>
          <p className="text-slate-600 text-base">
            Engineered to transmit reliable torque in severe continuous duty cycles across India's core sectors.
          </p>
        </div>

        {/* Industry Cards Grid - Clean White Theme */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {industries.map((ind, idx) => {
            const Icon = ind.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-orange-300 hover:shadow-lg hover:shadow-slate-200/60 transition-all duration-300 group flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-4 group-hover:scale-110 transition-all ${ind.color}`}>
                    <Icon size={22} />
                  </div>
                  <h3 className="text-base font-heading font-black text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">
                    {ind.name}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    {ind.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default IndustriesServed;
