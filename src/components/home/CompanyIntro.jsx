import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Cpu, ArrowRight, CheckCircle2, Award } from 'lucide-react';
import Button from '@/components/ui/Button';

const CompanyIntro = () => {
  return (
    <section className="py-10 sm:py-12 lg:py-14 bg-white text-slate-900 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          
          {/* Desktop Visual Showcase (6 cols) - Visible only on lg screens */}
          <motion.div 
            className="hidden lg:flex lg:col-span-6 relative flex-col"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-lg shadow-slate-200/60 bg-slate-100 group flex-1 min-h-[400px]">
              <img 
                src="/images/facility/factory-facility.jpg" 
                alt="Balaji Metal Manufacturing Facility in Rajkot" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 absolute inset-0"
              />
              
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

              {/* Top Quality Tag */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200 shadow-md flex items-center gap-2">
                <Award size={15} className="text-orange-600" />
                <span className="text-xs font-bold text-slate-900">ISO 9001:2015 Facility</span>
              </div>
            </div>
          </motion.div>

          {/* Text Content (6 cols on lg, full width on mobile) */}
          <motion.div 
            className="lg:col-span-6 flex flex-col justify-between space-y-5"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold w-fit">
                <span>About Balaji Metal</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-black text-slate-900 tracking-tight leading-tight">
                Engineering Reliability <br />
                <span className="text-orange-600">
                  Since Over 25 Years
                </span>
              </h2>

              {/* Mobile Visual Photo - Placed directly below heading on mobile */}
              <div className="block lg:hidden my-4">
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-100 aspect-[16/10] w-full">
                  <img 
                    src="/images/facility/factory-facility.jpg" 
                    alt="Balaji Metal Manufacturing Facility in Rajkot" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full border border-slate-200 shadow-sm flex items-center gap-1.5">
                    <Award size={13} className="text-orange-600" />
                    <span className="text-[11px] font-bold text-slate-900">ISO 9001:2015 Facility</span>
                  </div>
                </div>
              </div>

              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                Located in Gujarat's industrial hub at <strong className="text-slate-800">Veraval / Kotda Sangani, Rajkot</strong>, <strong className="text-slate-900">Balaji Metal</strong> specializes in precision power transmission components, heavy-duty industrial couplings, and dynamically balanced pulleys.
              </p>

              <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">
                From high-pressure chemical pump setups to heavy rock crushers, our products are engineered to absorb shock, damp torsional vibration, and maintain flawless torque delivery under 24/7 continuous industrial duty.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {[
                  "High-tensile Graded Cast Iron (FG 220/250)",
                  "Dynamic Balancing conforming to ISO 1940",
                  "Custom Bore & Keyway machining",
                  "Direct Factory Pricing & Fast Dispatch"
                ].map((point, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-orange-600 shrink-0" />
                    <span className="text-xs sm:text-sm text-slate-700 font-semibold">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <Link to="/about">
                <Button className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 text-sm group shadow-md shadow-slate-900/10 cursor-pointer w-full sm:w-auto justify-center">
                  <span>Learn More About Us</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform text-amber-400" />
                </Button>
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default CompanyIntro;
