import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, CheckCircle2, Building2, Layers, 
  ArrowRight, Sparkles, ChevronRight, ChevronLeft 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '@/hooks/useSettings';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';

export default function QuickSpecModal({ product, isOpen, onClose }) {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Reset index to 0 when product opens or changes
  useEffect(() => {
    setActiveImageIndex(0);
  }, [product?.id, product?.slug]);

  if (!isOpen || !product) return null;

  // Safe gallery extraction - use product prop directly (no static PRODUCTS fallback needed)
  const rawGallery = Array.isArray(product?.gallery) && product.gallery.length > 0
    ? product.gallery
    : product?.image
      ? [product.image]
      : ['/images/products/pin-bush-coupling/pin-bush-coupling-01.jpeg'];

  const gallery = rawGallery.filter(Boolean);
  const safeIndex = Math.min(Math.max(0, activeImageIndex), gallery.length - 1);
  const currentImage = gallery[safeIndex] || product?.image || '/images/products/pin-bush-coupling/pin-bush-coupling-01.jpeg';

  const handlePrevImage = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setActiveImageIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  const handleNextImage = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setActiveImageIndex((prev) => (prev + 1) % gallery.length);
  };

  const productName = product?.name || 'Industrial Product';
  const categoryName = product?.category_name || 'Industrial Product';
  const description = product?.description || product?.short_description || 'High quality precision manufactured industrial power transmission component.';
  const features = Array.isArray(product?.features) && product.features.length > 0 
    ? product.features 
    : [];
  const applications = Array.isArray(product?.applications) && product.applications.length > 0 
    ? product.applications 
    : [];
  const sizes = Array.isArray(product?.available_sizes) && product.available_sizes.length > 0 
    ? product.available_sizes 
    : [];
  const material = product?.material || 'Graded Cast Iron (FG 200/250)';

  const handleGetQuote = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    onClose();
    navigate(`/contact?product=${encodeURIComponent(productName)}`);
  };

  const whatsappNum = (settings.whatsapp_number || settings.company_whatsapp || settings.whatsapp || '917600060193').replace('+', '');
  const whatsappMessage = `Hello Balaji Metal, I want to inquire and request a price quote for *${productName}*.`;
  const whatsappUrl = `https://wa.me/${whatsappNum}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md">
      {/* Backdrop Click */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Window */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.2 }}
        className="relative bg-white rounded-3xl border border-slate-200/90 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-bold uppercase tracking-wider">
              {categoryName}
            </span>
            <span className="text-slate-300 text-xs font-medium hidden sm:inline">Product Overview & Photos</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body Content (Scrollable) */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6">
          
          {/* Top Row: Photo Gallery on Left (6 cols) & Key Info on Right (6 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Photo Showcase & Scroll Arrows */}
            <div className="lg:col-span-6 space-y-3">
              {/* Main Large Photo Container with Left & Right Arrows */}
              <div className="aspect-square bg-gradient-to-b from-slate-50 via-slate-50/80 to-slate-100/70 border border-slate-200/80 rounded-2xl p-5 flex items-center justify-center relative overflow-hidden shadow-inner group">
                <img
                  key={currentImage}
                  src={currentImage}
                  alt={productName}
                  className="w-full h-full object-contain filter drop-shadow-md transition-all duration-300"
                />

                {/* Photo Counter Badge */}
                {gallery.length > 0 && (
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-slate-900/85 text-white text-[11px] font-bold shadow-sm">
                    {safeIndex + 1} / {gallery.length} Photos
                  </div>
                )}

                {/* Previous Photo Arrow Button */}
                {gallery.length > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/95 hover:bg-orange-600 text-slate-800 hover:text-white border border-slate-200 hover:border-orange-600 shadow-xl flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95 z-20"
                    title="Previous Photo"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft size={22} />
                  </button>
                )}

                {/* Next Photo Arrow Button */}
                {gallery.length > 1 && (
                  <button
                    type="button"
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/95 hover:bg-orange-600 text-slate-800 hover:text-white border border-slate-200 hover:border-orange-600 shadow-xl flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95 z-20"
                    title="Next Photo"
                    aria-label="Next photo"
                  >
                    <ChevronRight size={22} />
                  </button>
                )}
              </div>

              {/* Clickable Photo Thumbnails Row */}
              {gallery.length > 1 && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      All Photos ({gallery.length}):
                    </span>
                    <span className="text-[11px] font-bold text-orange-600">
                      Click arrows or photo below
                    </span>
                  </div>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {gallery.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImageIndex(idx)}
                        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl p-1 bg-slate-50 border-2 transition-all shrink-0 cursor-pointer overflow-hidden ${
                          safeIndex === idx 
                            ? 'border-orange-500 shadow-md shadow-orange-500/25 ring-2 ring-orange-500/20 bg-white' 
                            : 'border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt={`view ${idx + 1}`} className="w-full h-full object-contain" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Product Details on Right */}
            <div className="lg:col-span-6 space-y-4">
              <div>
                <h3 className="text-2xl sm:text-3xl font-heading font-black text-slate-900 tracking-tight leading-snug">
                  {productName}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                  Manufactured by <strong className="text-slate-800">Balaji Metal (Rajkot, Gujarat)</strong>
                </p>
              </div>

              {/* Simple Description */}
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-orange-700 uppercase tracking-wider">About This Product:</h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                  {description}
                </p>
              </div>

              {/* Material Pill */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-2.5 text-xs">
                <span className="font-bold text-orange-600 shrink-0">Material:</span>
                <span className="text-slate-800 font-semibold">{material}</span>
              </div>

              {/* Key Benefits / Highlights */}
              {features.length > 0 && (
                <div className="space-y-2 pt-1">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Key Benefits:</h4>
                  <div className="space-y-1.5">
                    {features.slice(0, 4).map((f, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                        <CheckCircle2 size={15} className="text-orange-600 shrink-0 mt-0.5" />
                        <span>{typeof f === 'string' ? f : String(f)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Bottom Row: Industries & Applications */}
          {applications.length > 0 && (
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center gap-2">
                <Building2 size={16} className="text-orange-600" />
                <h4 className="text-sm font-heading font-black text-slate-900">
                  Where Is This Product Used? (Machinery & Industries)
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {applications.map((app, i) => {
                  const indText = typeof app === 'object' ? (app?.industry || 'Industrial Drive') : 'Industrial Machinery';
                  const appDesc = typeof app === 'object' ? (app?.application || app?.name || '') : String(app);

                  return (
                    <div key={i} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0 mt-1.5" />
                      <div>
                        <span className="block text-[11px] font-bold text-orange-700 uppercase">{indText}</span>
                        <span className="text-xs font-semibold text-slate-800">{appDesc}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Standard Sizes Available */}
          {sizes.length > 0 && (
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Available Sizes & Configurations:
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {sizes.map((sz, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
                    {typeof sz === 'string' ? sz : String(sz)}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            Custom bores, keyways, and direct factory pricing available.
          </span>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <WhatsAppIcon size={16} fill="#ffffff" />
              <span>Chat on WhatsApp</span>
            </a>

            <button
              type="button"
              onClick={handleGetQuote}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-105"
            >
              <span>Get Official Quote</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}


