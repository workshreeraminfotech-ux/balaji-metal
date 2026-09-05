import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, Mail, MapPin, Sparkles } from 'lucide-react';
import { cn } from '@/utils/helpers';
import Button from '@/components/ui/Button';
import { COMPANY_INFO } from '@/data/companyData';
import { CATEGORIES } from '@/data/productsData';

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

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Products', path: '/products' },
    { name: 'Contact Us', path: '/contact' },
  ];

  return (
    <>
      {/* Top Announcement Bar - Clean Corporate */}
      <div 
        className={cn(
          "hidden lg:block bg-slate-900 text-slate-200 text-xs py-2 px-6 fixed top-0 left-0 right-0 z-50 border-b border-slate-800 transition-all duration-300",
          isScrolled ? "-translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
        )}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
          {/* Full Address */}
          <div className="flex items-center gap-2 text-slate-300 truncate">
            <MapPin size={13} className="text-amber-400 shrink-0" />
            <span className="truncate">
              {COMPANY_INFO.address.full}
            </span>
          </div>

          {/* Contact Details */}
          <div className="flex items-center gap-6 shrink-0">
            <a 
              href={`tel:${COMPANY_INFO.phones[0].raw}`}
              className="flex items-center gap-1.5 text-slate-200 hover:text-amber-400 transition-colors"
            >
              <Phone size={13} className="text-amber-400" />
              <span className="font-semibold">{COMPANY_INFO.phones[0].display}</span>
            </a>
            <a 
              href={`mailto:${COMPANY_INFO.email}`} 
              className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-semibold transition-colors"
            >
              <Mail size={13} className="text-amber-400" />
              <span>{COMPANY_INFO.email}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Clean White Navbar */}
      <header
        className={cn(
          'fixed z-40 w-full transition-all duration-300',
          isScrolled
            ? 'top-0 bg-white/95 backdrop-blur-md shadow-md shadow-slate-200/50 border-b border-slate-200/80 py-3'
            : 'top-0 lg:top-[33px] bg-white/90 backdrop-blur-sm border-b border-slate-100 py-4'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* 1. Left: Logo */}
            <div className="flex-shrink-0">
              <Link 
                to="/" 
                onClick={handleLogoClick} 
                className="flex items-center gap-3 group focus:outline-none"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 p-0.5 shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
                  <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center font-heading font-black text-xl text-amber-400">
                    BM
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-heading text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-1">
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

            {/* Mobile Action Buttons */}
            <div className="flex items-center gap-2.5 md:hidden">
              <a
                href={`mailto:${COMPANY_INFO.email}`}
                className="p-2 rounded-xl bg-orange-50 text-orange-600 border border-orange-200"
                aria-label="Email Us"
              >
                <Mail size={18} />
              </a>
              <button
                className="text-slate-700 hover:text-slate-900 p-2 rounded-xl bg-slate-100 border border-slate-200 focus:outline-none"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 md:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className="fixed right-0 top-0 bottom-0 w-4/5 max-w-sm bg-white border-l border-slate-200 z-50 p-6 flex flex-col md:hidden overflow-y-auto shadow-2xl"
              >
                <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                  <Link 
                    to="/" 
                    onClick={handleLogoClick}
                    className="flex items-center gap-2.5 focus:outline-none"
                  >
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 p-0.5 shadow-md">
                      <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center font-heading font-black text-lg text-amber-400">
                        BM
                      </div>
                    </div>
                    <span className="font-heading text-lg font-black text-slate-900">
                      BALAJI <span className="text-orange-600">METAL</span>
                    </span>
                  </Link>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 border border-slate-200"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

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
                              ? 'bg-orange-50 text-orange-600 border border-orange-200 font-bold' 
                              : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                          )
                        }
                      >
                        {link.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
                  <p className="text-xs uppercase tracking-wider text-slate-400 font-bold px-1">Product Categories</p>
                  <div className="grid grid-cols-2 gap-2">
                    {CATEGORIES.map(cat => (
                      <Link
                        key={cat.id}
                        to={`/products?category=${cat.slug}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:text-orange-600 hover:border-orange-300"
                      >
                        {cat.shortName}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="mt-auto pt-6 border-t border-slate-100 flex flex-col gap-3">
                  <a 
                    href={`tel:${COMPANY_INFO.phones[0].raw}`}
                    className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700"
                  >
                    <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                      <Phone size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Direct Hotline</p>
                      <p className="text-xs font-bold text-slate-900">{COMPANY_INFO.phones[0].display}</p>
                    </div>
                  </a>

                  <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold py-3 rounded-xl shadow-md">
                      Request Quotation
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
