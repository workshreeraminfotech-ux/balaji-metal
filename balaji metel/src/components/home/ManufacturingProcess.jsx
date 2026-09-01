import React from 'react';
import { motion } from 'framer-motion';
import { Microscope, Flame, Cpu, Scale, CheckCircle2, ShieldCheck } from 'lucide-react';

const ManufacturingProcess = () => {
  const steps = [
    {
      step: "01",
      icon: Flame,
      title: "Foundry & Graded Casting",
      desc: "High-grade FG 220/250 Grey Iron casting in automated moulding lines with strict carbon equivalent controls.",
      color: "bg-orange-50 text-orange-600 border-orange-200"
    },
    {
      step: "02",
      icon: Microscope,
      title: "Spectro Chemical Testing",
      desc: "Direct-reading Optical Emission Spectrometer tests every melt batch for precise carbon, silicon, and tensile chemistry.",
      color: "bg-blue-50 text-blue-600 border-blue-200"
    },
    {
      step: "03",
      icon: Cpu,
      title: "CNC Precision Machining",
      desc: "Computer numerical controlled CNC turning and boring machines ensure micron-level groove angles and bore tolerances.",
      color: "bg-emerald-50 text-emerald-600 border-emerald-200"
    },
    {
      step: "04",
      icon: Scale,
      title: "Dynamic Balancing (ISO 1940)",
      desc: "Electronic computerized dynamic balancing to Grade G6.3 to prevent vibration at maximum RPM operation.",
      color: "bg-amber-50 text-amber-600 border-amber-200"
    }
  ];

  return (
    <section className="py-20 lg:py-24 bg-white text-slate-900 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold">
            <span>Rigorous Quality Workflow</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-slate-900 tracking-tight">
            Our 4-Stage Precision Manufacturing Process
          </h2>
          <p className="text-slate-600 text-base">
            From raw metal ingot spectroscopy to high-speed dynamic balancing, every component undergoes strict quality checks.
          </p>
        </div>

        {/* 4 Steps Grid - Clean White Theme */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="p-6 rounded-3xl bg-slate-50 border border-slate-200/90 hover:border-orange-300 hover:bg-white transition-all flex flex-col justify-between group shadow-xs hover:shadow-lg"
              >
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="font-heading font-black text-3xl text-slate-300 group-hover:text-orange-600 transition-colors">
                      {item.step}
                    </span>
                    <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center group-hover:scale-110 transition-transform ${item.color}`}>
                      <Icon size={22} />
                    </div>
                  </div>
                  <h3 className="text-lg font-heading font-black text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 flex items-center gap-1.5 text-xs text-emerald-700 font-bold">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  <span>QC Passed Standard</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Quality Lab Visual Feature - Clean White */}
        <div className="rounded-3xl bg-slate-50 border border-slate-200/90 overflow-hidden shadow-lg p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-orange-700 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                <ShieldCheck size={16} className="text-orange-600" />
                <span>In-House Metrology & Testing Lab</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-heading font-black text-slate-900">
                Zero Defect Quality Assurance Facility
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Our in-house quality testing facility in Rajkot is equipped with electronic balancing rigs, surface roughness testers, profile projectors, and precision micrometer gauges to ensure zero-defect shipment.
              </p>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-orange-600" />
                  <span>100% Dimensional run-out verification before dispatch</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-orange-600" />
                  <span>Material Test Certificate (MTC) provided upon request</span>
                </li>
              </ul>
            </div>
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 aspect-video shadow-md group">
                <img 
                  src="/images/facility/quality-lab.jpg" 
                  alt="Balaji Metal Metrology and Dynamic Balancing Quality Lab" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ManufacturingProcess;
