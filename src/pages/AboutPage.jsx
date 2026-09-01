import React from 'react';
import SEO from '@/components/ui/SEO';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { Target, Lightbulb, ShieldCheck, PenTool, CheckCircle2, Award, Cpu, Scale, PhoneCall } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';
import CountUp from '@/components/ui/CountUp';
import { COMPANY_INFO } from '@/data/companyData';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <SEO 
        title="About Us | Balaji Metal - 25+ Years Manufacturing Excellence" 
        description="Learn about Balaji Metal's 25-year manufacturing journey, CNC infrastructure, and commitment to precision couplings and pulleys in Rajkot, Gujarat." 
      />
      
      {/* Dynamic Hero Banner with Industrial Background Image */}
      <section className="relative bg-slate-950 text-white pt-28 pb-16 lg:pt-32 lg:pb-20 overflow-hidden border-b border-slate-800">
        {/* Background Image with Clear Visibility */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero/about-hero.jpg" 
            alt="Balaji Metal Manufacturing Facility" 
            className="w-full h-full object-cover object-center"
          />
          {/* Subtle cinematic gradient for clear background visibility + text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-slate-950/60" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb on top left */}
          <div className="mb-8">
            <Breadcrumb 
              items={[{ label: 'About Us', href: '/about' }]} 
              theme="dark"
            />
          </div>

          {/* Centered Hero Content */}
          <div className="text-center max-w-3xl mx-auto space-y-4 py-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950/70 border border-orange-500/40 text-orange-400 text-xs font-bold backdrop-blur-md shadow-lg">
              <Award size={14} className="text-orange-400" />
              <span>Foundry & CNC Engineering Pioneers</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black tracking-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500">Balaji Metal</span>
            </h1>

            <p className="text-slate-200 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] font-medium">
              Over 25 years of engineering excellence in industrial couplings, pulleys, and heavy-duty power transmission components in Rajkot, Gujarat.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Text (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-orange-700 border border-slate-200 text-xs font-bold uppercase tracking-wider">
              Our Manufacturing Heritage
            </div>

            <h2 className="text-3xl sm:text-4xl font-heading font-black text-slate-900 tracking-tight leading-tight">
              From Foundry Craftsmanship to Modern CNC Precision
            </h2>

            <p className="text-slate-600 text-base leading-relaxed">
              Established in <strong className="text-slate-900">Kotda Sangani / Veraval Industrial Zone, Rajkot</strong>, Balaji Metal has evolved from a specialized foundry into one of Western India's premier manufacturers of industrial power transmission components.
            </p>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              We engineer components that power heavy process plants, mining crushers, continuous chemical pumps, and machine tools. By combining high-grade grey iron metallurgy (FG 220/250) with micron-precision CNC turning and ISO 1940 dynamic balancing, our products guarantee zero downtime and maximum torque efficiency.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <span className="block text-3xl font-black text-orange-600 font-heading">
                  <CountUp end={25} suffix="+" />
                </span>
                <span className="text-xs text-slate-500 font-bold">Years Experience</span>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <span className="block text-3xl font-black text-orange-600 font-heading">
                  <CountUp end={500} suffix="+" />
                </span>
                <span className="text-xs text-slate-500 font-bold">Industrial Clients</span>
              </div>
            </div>
          </div>

          {/* Right Photo (6 cols) */}
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl shadow-slate-200/80 bg-slate-100 group">
              <img 
                src="/images/facility/factory-facility.jpg" 
                alt="Balaji Metal Precision CNC Workshop" 
                className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              
              <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-md">
                <p className="text-xs font-bold text-orange-600 uppercase">State-of-the-art facility</p>
                <p className="text-sm text-slate-900 font-bold">Survey No. P 43/44, Kotda Sangani, Veraval, Gujarat</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Mission & Vision - Clean White */}
      <div className="bg-white border-y border-slate-200/80 py-20 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="bg-slate-50 p-8 sm:p-10 rounded-3xl border border-slate-200 hover:border-orange-300 transition-all space-y-4 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <Target size={28} />
            </div>
            <h3 className="text-2xl font-heading font-black text-slate-900">Our Mission</h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
              To engineer and supply rugged, zero-defect power transmission solutions that protect industrial motor drives, reduce downtime, and deliver uncompromised value to our clients worldwide.
            </p>
          </div>

          <div className="bg-slate-50 p-8 sm:p-10 rounded-3xl border border-slate-200 hover:border-orange-300 transition-all space-y-4 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Lightbulb size={28} />
            </div>
            <h3 className="text-2xl font-heading font-black text-slate-900">Our Vision</h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
              To be India's benchmark brand in industrial mechanical drives, recognized for superior metallurgical integrity, dynamic balancing precision, and ethical business relationships.
            </p>
          </div>

        </div>
      </div>

      {/* Quality & Infrastructure Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold">
            <ShieldCheck size={14} className="text-orange-600" />
            <span>Infrastructure & Testing Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-black text-slate-900">
            Manufacturing & Inspection Infrastructure
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Equipped with modern CNC turning centers and precision metrology testing tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            { icon: Cpu, title: "CNC Machining Centers", desc: "Computer-controlled turning and groove generation for exact angle pitch and concentricity." },
            { icon: Scale, title: "Dynamic Balancing Lab", desc: "Schenck-grade balancing machines guaranteeing vibration-free running to ISO 1940 Grade G6.3." },
            { icon: ShieldCheck, title: "Spectro Testing Lab", desc: "Direct-reading spectrometer analysis to verify carbon, silicon, and tensile metallurgy." },
            { icon: PenTool, title: "Custom CAD/CAM Cell", desc: "In-house design team for customized bores, keyways, splines, and OEM drawings." }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-orange-300 hover:shadow-lg transition-all text-center flex flex-col items-center group shadow-xs">
                <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Icon size={26} />
                </div>
                <h4 className="text-base font-heading font-black text-slate-900 mb-2">{item.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Quality Lab Banner */}
        <div className="rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 overflow-hidden shadow-lg shadow-slate-200/60">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-700 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                Quality Assurance Standards
              </span>
              <h3 className="text-2xl sm:text-3xl font-heading font-black text-slate-900">
                Uncompromising Quality Control at Every Stage
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed font-medium">
                From raw metal analysis in our foundry to final runout and concentricity checks, every component is rigorously tested before being packaged and dispatched.
              </p>
              <div className="space-y-2.5 pt-2">
                {[
                  "Raw Material Spectro Testing before melting",
                  "In-Process Micrometer & Vernier Caliper dimensional checks",
                  "100% Dynamic balancing inspection with balancing certs",
                  "Protective anti-corrosion coating & export packaging"
                ].map((pt, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-slate-700 font-semibold">
                    <CheckCircle2 size={16} className="text-orange-600 shrink-0" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-2xl overflow-hidden border border-slate-200 aspect-video shadow-md">
                <img 
                  src="/images/facility/quality-lab.jpg" 
                  alt="Quality Laboratory and Testing" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Direct Contact CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 text-center">
        <div className="p-10 rounded-3xl bg-white border border-slate-200 space-y-5 max-w-3xl mx-auto shadow-md">
          <h3 className="text-2xl sm:text-3xl font-heading font-black text-slate-900">Have Questions for Our Engineering Team?</h3>
          <p className="text-slate-600 text-sm font-medium">We are always ready to assist you with component sizing, quotations, or custom castings.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
            <Link to="/contact">
              <Button className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-3 rounded-xl shadow-md">
                Contact Us Now
              </Button>
            </Link>
            <a href={`tel:${COMPANY_INFO.phones[0].raw}`}>
              <Button variant="outline" className="bg-white border-slate-300 text-slate-800 px-6 py-3 rounded-xl flex items-center justify-center gap-2 font-bold shadow-xs">
                <PhoneCall size={16} className="text-emerald-600" />
                <span>Call {COMPANY_INFO.phones[0].display}</span>
              </Button>
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}
