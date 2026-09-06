import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, ExternalLink, ArrowRight, Lock } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { settings } = useSettings();

  const primaryPhone = settings.primary_phone || settings.phones?.[0]?.display || '+91 70960 70727';
  const primaryPhoneRaw = settings.phones?.[0]?.raw || primaryPhone.replace(/[^0-9+]/g, '');
  const secondaryPhone = settings.secondary_phone || settings.phones?.[1]?.display || '+91 92655 39537';
  const secondaryPhoneRaw = settings.phones?.[1]?.raw || secondaryPhone.replace(/[^0-9+]/g, '');
  const email = settings.email || settings.company_email || 'Balajimetal5302@gmail.com';

  return (
    <footer className="bg-slate-950 text-slate-300 pt-14 pb-8 border-t border-slate-800/80 relative overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 mb-10">
          {/* Col 1: Brand & Bio (4 cols) */}
          <div className="md:col-span-5 lg:col-span-4 space-y-4">
            <Link 
              to="/" 
              onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 p-0.5 shadow-lg shadow-orange-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-heading font-black text-xl text-amber-400">
                  BM
                </div>
              </div>
              <span className="font-heading text-2xl font-bold tracking-tight text-white">
                Balaji <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Metal</span>
              </span>
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Pioneering manufacturer of heavy-duty industrial couplings, precision V-belt pulleys, and power transmission components engineered for demanding industrial environments across India.
            </p>
          </div>

          {/* Col 2: Quick Links (3 cols with clean padding) */}
          <div className="md:col-span-3 lg:col-span-3 lg:pl-4 space-y-4">
            <h4 className="text-white font-heading font-bold text-base tracking-wide flex items-center gap-2">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Home', href: '/' },
                { label: 'About Company', href: '/about' },
                { label: 'All Products', href: '/products' },
                { label: 'Contact Us', href: '/contact' }
              ].map((item, idx) => (
                <li key={idx}>
                  <Link 
                    to={item.href} 
                    className="text-slate-400 hover:text-amber-400 transition-colors text-sm flex items-center gap-1.5 group"
                  >
                    <ArrowRight size={13} className="text-slate-600 group-hover:text-amber-400 transition-colors" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Contact & Factory Location (5 cols) */}
          <div className="md:col-span-4 lg:col-span-5 lg:pl-6 space-y-4">
            <h4 className="text-white font-heading font-bold text-base tracking-wide">
              Factory & Works
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-slate-400 text-xs leading-relaxed max-w-md">
                  {settings.company_address || settings.address?.full || 'Balaji Metal, P. 43/44, Main Road, Ta. Kotda Sangani, Veraval (Shapar - Padavala Industrial Zone), Rajkot, Gujarat - 360025'}
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-amber-400 shrink-0" />
                <div className="text-xs flex flex-wrap items-center gap-x-3 gap-y-1">
                  <a href={`tel:${primaryPhoneRaw}`} className="text-slate-300 hover:text-amber-400 font-semibold transition-colors">
                    {primaryPhone}
                  </a>
                  <span className="text-slate-600 hidden sm:inline">|</span>
                  <a href={`tel:${secondaryPhoneRaw}`} className="text-slate-400 hover:text-amber-400 transition-colors">
                    {secondaryPhone}
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-amber-400 shrink-0" />
                <a 
                  href={`mailto:${email}`} 
                  className="text-slate-300 text-xs hover:text-amber-400 transition-colors break-all"
                >
                  {email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {currentYear} Balaji Metal. All rights reserved. Precision Engineering & Power Transmission Components.</p>
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-5">
            <p className="text-slate-400">
              Developed by{' '}
              <a 
                href="https://www.matrixtechx.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-amber-400 hover:text-amber-300 font-bold underline transition-colors decoration-amber-500/50 hover:decoration-amber-400"
              >
                MatrixTechX
              </a>
            </p>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <a 
              href={settings.googleMapsDirections || 'https://maps.google.com/?q=Balaji+Metal+Kotda+Sangani+Veraval+Rajkot+Gujarat+360025'} 
              target="_blank" 
              rel="noreferrer"
              className="text-slate-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
            >
              <span>Get Directions</span>
              <ExternalLink size={12} />
            </a>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <Link 
              to="/admin/login" 
              className="text-slate-500 hover:text-orange-400 flex items-center gap-1 transition-colors"
              title="Administrator Login"
            >
              <Lock size={12} />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
