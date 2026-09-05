import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, Mail, MapPin, Sparkles } from 'lucide-react';
import { cn } from '@/utils/helpers';
import Button from '@/components/ui/Button';
import { COMPANY_INFO } from '@/data/companyData';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoClick = (e) => {
    setIsMobileMenuOpen(false);
    if (location.pathname === '/') {
      e?.preventDefault?.();
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  };

  const handleNavLinkClick = (path) => {
    setIsMobileMenuOpen(false);
    if (path === '/' && location.pathname === '/') {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Products', path: '/products' },
    { name: 'Contact Us', path: '/contact' },
  ];

  return (
    <>
      {/* Top Announcement Bar - Visible on Desktop only (hidden on mobile) */}
      <div 
        className={cn(
          "hidden md:block bg-slate-900 text-slate-200 text-xs py-2 px-6 fixed top-0 left-0 right-0 z-40 border-b border-slate-800 transition-all duration-300",
          isScrolled ? "-translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
        )}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-2">
          {/* Location / Tagline */}
          <div className="flex items-center gap-1.5 text-slate-300 truncate">
            <MapPin size={12} className="text-amber-400 shrink-0" />
            <span className="truncate font-medium">
              GIDC Aji Vasahat, Rajkot, Gujarat
            </span>
          </div>

          {/* Contact Details */}
          <div className="flex items-center gap-6 shrink-0">
            <a 
              href={`tel:${COMPANY_INFO.phones[0].raw}`}
              className="flex items-center gap-1.5 text-slate-200 hover:text-amber-400 transition-colors"
            >
              <Phone size={12} className="text-amber-400 shrink-0" />
              <span className="font-semibold">{COMPANY_INFO.phones[0].display}</span>
            </a>
            <a 
              href={`mailto:${COMPANY_INFO.email}`} 
              className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-semibold transition-colors"
            >
              <Mail size={12} className="text-amber-400 shrink-0" />
              <span>{COMPANY_INFO.email}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Clean White Navbar */}
      <header
        className={cn(
          'fixed z-30 w-full transition-all duration-300',
          isScrolled
            ? 'top-0 bg-white/95 backdrop-blur-md shadow-md shadow-slate-200/50 border-b border-slate-200/80 py-2.5 sm:py-3'
            : 'top-0 md:top-[33px] bg-white/95 backdrop-blur-md border-b border-slate-100 py-3 sm:py-4'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* 1. Left: Logo */}
            <div className="flex-shrink-0">
              <Link 
                to="/" 
                onClick={handleLogoClick} 
                className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 p-0.5 shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
                  <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center font-heading font-black text-lg sm:text-xl text-amber-400">
                    BM
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-heading text-lg sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-1">
                    BALAJI <span className="text-orange-600">METAL</span>
                  </span>
                  <span className="text-[10px] tracking-wider uppercase font-semibold text-slate-500 -mt-1 hidden sm:block">
                    Precision Engineering Works
                  </span>
                </div>
              </Link>
            </div>

            {/* 2. Center: Navigation Links */}
            <nav className="hidden md:flex items-center justify-center flex-1">
              <ul className="flex items-center gap-8 lg:gap-10">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <NavLink
                      to={link.path}
                      onClick={() => handleNavLinkClick(link.path)}
                      className={({ isActive }) =>
                        cn(
                          'text-[15px] sm:text-base font-semibold transition-colors py-2 flex items-center gap-1.5 tracking-wide whitespace-nowrap',
                          isActive 
                            ? 'text-orange-600 font-bold border-b-2 border-orange-600 pb-1' 
                            : 'text-slate-700 hover:text-orange-600'
                        )
                      }
                    >
                      {link.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            {/* 3. Right: Request Quote CTA Button */}
            <div className="hidden md:flex items-center flex-shrink-0">
              <Link to="/contact">
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold shadow-md shadow-orange-500/20 border-0 rounded-xl px-5 py-2.5 text-sm"
                >
                  <Sparkles size={15} className="mr-1.5" />
                  Request Quote
                </Button>
              </Link>
            </div>

            {/* Mobile Action Buttons (Drawer Hamburger only) */}
            <div className="flex items-center md:hidden">
              <button
                type="button"
                className="text-slate-800 hover:text-slate-900 p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 focus:outline-none active:scale-95 transition-all"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[9999] md:hidden">
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Drawer Container */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed right-0 top-0 bottom-0 w-[80%] max-w-[320px] bg-white border-l border-slate-200 shadow-2xl flex flex-col z-[10000] overflow-y-auto"
            >
              {/* Drawer Top Header */}
              <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/80 sticky top-0 z-10">
                <Link 
                  to="/" 
                  onClick={handleLogoClick}
                  className="flex items-center gap-2.5 focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 p-0.5 shadow-md">
                    <div className="w-full h-full bg-slate-900 rounded-[9px] flex items-center justify-center font-heading font-black text-sm text-amber-400">
                      BM
                    </div>
                  </div>
                  <span className="font-heading text-base font-black text-slate-900">
                    BALAJI <span className="text-orange-600">METAL</span>
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-slate-500 hover:text-slate-800 p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 active:scale-95 transition-all"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation Links Only */}
              <div className="p-5 flex-1 flex flex-col">
                <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold px-1 mb-3">Navigation</p>
                <ul className="flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <li key={link.name}>
                      <NavLink
                        to={link.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          cn(
                            'block text-base font-semibold py-3 px-4 rounded-xl transition-colors',
                            isActive 
                              ? 'bg-orange-50 text-orange-600 border border-orange-200 font-bold shadow-xs' 
                              : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                          )
                        }
                      >
                        {link.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
