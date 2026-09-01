import React from 'react';
import { motion } from 'framer-motion';
import { Award, Users, PackageCheck, Factory } from 'lucide-react';
import CountUp from '@/components/ui/CountUp';

const CompanyStats = () => {
  const stats = [
    {
      icon: Award,
      num: 25,
      suffix: "+",
      label: "Years of Engineering",
      sub: "Established in 1999",
      color: "bg-orange-50 text-orange-600 border-orange-200"
    },
    {
      icon: Users,
      num: 500,
      suffix: "+",
      label: "Industrial Clients",
      sub: "Pan India & Exports",
      color: "bg-blue-50 text-blue-600 border-blue-200"
    },
    {
      icon: PackageCheck,
      num: 1000,
      suffix: "+",
      label: "Products Delivered",
      sub: "Ready Stock & Custom",
      color: "bg-emerald-50 text-emerald-600 border-emerald-200"
    },
    {
      icon: Factory,
      num: 50,
      suffix: "+",
      label: "Industries Powered",
      sub: "Mining, HVAC, Pumps",
      color: "bg-amber-50 text-amber-600 border-amber-200"
    }
  ];

  return (
    <section className="bg-white border-b border-slate-200/80 py-10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: index * 0.12, ease: "easeOut" }}
                className="p-5 sm:p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-orange-300 hover:bg-white hover:shadow-lg transition-all duration-300 group text-center flex flex-col items-center shadow-xs"
              >
                <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl border flex items-center justify-center mb-3 group-hover:scale-110 transition-transform ${item.color}`}>
                  <Icon size={22} />
                </div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-black text-slate-900 mb-1 group-hover:text-orange-600 transition-colors">
                  <CountUp end={item.num} suffix={item.suffix} duration={2} />
                </h3>
                <p className="text-xs sm:text-sm font-bold text-slate-800 mb-0.5">{item.label}</p>
                <p className="text-[11px] sm:text-xs text-slate-500">{item.sub}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CompanyStats;
