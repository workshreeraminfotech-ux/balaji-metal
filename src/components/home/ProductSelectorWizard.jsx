import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, ArrowRight, CheckCircle2, RotateCcw, MessageSquare, Zap, Cpu, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useSettings } from '@/hooks/useSettings';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';

export default function ProductSelectorWizard() {
  const { settings } = useSettings();
  const waNumber = (settings.whatsapp_number || settings.company_whatsapp || settings.whatsapp || '917600060193').replace('+', '');
  const [componentType, setComponentType] = useState('coupling');
  const [motorPowerHP, setMotorPowerHP] = useState('10');
  const [rpm, setRpm] = useState('1440');
  const [applicationType, setApplicationType] = useState('pumps');

  const hpNum = parseFloat(motorPowerHP) || 10;
  const rpmNum = parseFloat(rpm) || 1440;
  const calculatedTorque = Math.round((hpNum * 7120) / rpmNum);
  
  const getRecommendation = () => {
    if (componentType === 'coupling') {
      if (calculatedTorque > 500) {
        return {
          title: "Pin Bush Flexible Coupling (Size FBP-200 / FBP-250)",
          slug: "pin-bush-coupling",
          material: "Cast Iron FG 250 with High-Tensile Alloy Pins",
          reason: `Heavy-duty shock absorbing capacity rated for up to ${calculatedTorque * 2} Nm peak torque.`
        };
      } else {
        return {
          title: "Star Bush Jaw Spider Coupling (Size L-095 / L-110)",
          slug: "star-bush-coupling",
          material: "Precision Graded SAE 1045 Steel Hubs with PU Spider",
          reason: `Compact vibration isolating jaw coupling for ${calculatedTorque} Nm rated torque.`
        };
      }
    } else {
      if (hpNum > 20) {
        return {
          title: "V-Belt Pulley (SPB / SPC Section Multi-Groove)",
          slug: "v-belt-pulley",
          material: "Cast Iron FG 250 Dynamically Balanced (ISO 1940 G6.3)",
          reason: "High torque grip and vibration-free running for heavy drive motors."
        };
      } else {
        return {
          title: "V-Belt Pulley (SPA / SPZ Series Taper Lock)",
          slug: "v-belt-pulley",
          material: "Cast Iron FG 220 with Standard Taper Bushing",
          reason: "Smooth transmission and concentric mounting on motor shaft."
        };
      }
    }
  };

  const rec = getRecommendation();

  return (
    <section className="py-20 bg-white border-b border-slate-200/80 text-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Explanation (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold">
              <Calculator size={14} className="text-orange-600" />
              <span>Interactive Engineering Tool</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-slate-900 tracking-tight">
              Drive & Coupling Sizing Assistant
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Not sure which coupling or pulley size suits your motor drive? Enter your motor specs below to calculate rated torque and get the recommended product model.
            </p>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs text-slate-600">
              <p className="flex items-center gap-2 text-orange-700 font-bold">
                <Zap size={14} className="text-orange-600" />
                <span>Engineering Formula:</span>
              </p>
              <p className="font-mono text-slate-700 font-semibold">Torque (Nm) = (Power in HP × 7120) / RPM</p>
            </div>
          </div>

          {/* Right Interactive Wizard Card (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-slate-50/80 p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-lg shadow-slate-200/60 space-y-6">
              
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setComponentType('coupling')}
                  className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    componentType === 'coupling'
                      ? 'bg-orange-600 text-white shadow-md shadow-orange-500/20'
                      : 'bg-white text-slate-700 border border-slate-200 shadow-xs'
                  }`}
                >
                  Coupling Selector
                </button>
                <button
                  type="button"
                  onClick={() => setComponentType('pulley')}
                  className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    componentType === 'pulley'
                      ? 'bg-orange-600 text-white shadow-md shadow-orange-500/20'
                      : 'bg-white text-slate-700 border border-slate-200 shadow-xs'
                  }`}
                >
                  Pulley Selector
                </button>
              </div>

              {/* Inputs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Motor Power (HP)</label>
                  <select
                    value={motorPowerHP}
                    onChange={(e) => setMotorPowerHP(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-orange-500 font-semibold shadow-xs"
                  >
                    <option value="2">2 HP (1.5 kW)</option>
                    <option value="5">5 HP (3.7 kW)</option>
                    <option value="7.5">7.5 HP (5.5 kW)</option>
                    <option value="10">10 HP (7.5 kW)</option>
                    <option value="15">15 HP (11 kW)</option>
                    <option value="20">20 HP (15 kW)</option>
                    <option value="30">30 HP (22 kW)</option>
                    <option value="50">50 HP (37 kW)</option>
                    <option value="75">75 HP (55 kW)</option>
                    <option value="100">100 HP (75 kW)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Motor RPM</label>
                  <select
                    value={rpm}
                    onChange={(e) => setRpm(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-orange-500 font-semibold shadow-xs"
                  >
                    <option value="2880">2880 RPM (2-Pole)</option>
                    <option value="1440">1440 RPM (4-Pole)</option>
                    <option value="960">960 RPM (6-Pole)</option>
                    <option value="720">720 RPM (8-Pole)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Application Sector</label>
                  <select
                    value={applicationType}
                    onChange={(e) => setApplicationType(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-orange-500 font-semibold shadow-xs"
                  >
                    <option value="pumps">Pumps & Compressors</option>
                    <option value="blowers">Blowers & HVAC Fans</option>
                    <option value="crushers">Crushers & Mining</option>
                    <option value="conveyors">Conveyors & Elevators</option>
                    <option value="textiles">Textile Machinery</option>
                  </select>
                </div>
              </div>

              {/* Recommendation Box - Clean White */}
              <div className="p-5 rounded-2xl bg-white border border-orange-200 shadow-sm space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-orange-700 uppercase tracking-wider">Recommended Model</span>
                  <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                    Est. Torque: ~{calculatedTorque} Nm
                  </span>
                </div>
                
                <h4 className="text-lg font-heading font-black text-slate-900">
                  {rec.title}
                </h4>
                
                <p className="text-xs text-slate-600">
                  {rec.reason}
                </p>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <a
                    href={`https://wa.me/${waNumber}?text=Hello%20Balaji%20Metal,%20I%20used%20your%20selector%20for%20a%20${motorPowerHP}HP%20@%20${rpm}RPM%20motor.%20Please%20quote%20for%20${encodeURIComponent(rec.title)}.`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto"
                  >
                    <Button
                      size="sm"
                      className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm cursor-pointer border-0"
                    >
                      <WhatsAppIcon size={16} fill="#ffffff" />
                      <span>Get WhatsApp Quote for this Model</span>
                    </Button>
                  </a>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
