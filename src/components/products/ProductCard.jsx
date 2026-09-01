import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, PhoneCall, CheckCircle2, Eye, ShieldCheck, Sparkles, Cpu, FileText } from 'lucide-react';
import { COMPANY_INFO } from '@/data/companyData';
import { PRODUCTS } from '@/data/productsData';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';

export default function ProductCard({ product, onQuickView, onOpenQuote }) {
  const fallbackItem = PRODUCTS.find(p => p.slug === product.slug);
  const imageSrc = product.image || 
    (product.featured_image ? (product.featured_image.startsWith('http') || product.featured_image.startsWith('/') ? product.featured_image : `/uploads/products/${product.featured_image}`) : null) || 
    fallbackItem?.image || 
    '/images/products/pin-bush-coupling.jpg';

  const categoryName = product.category_name || fallbackItem?.category_name || 'Industrial Drives';
  const material = product.material || fallbackItem?.material || 'Grey Cast Iron FG 220/250';
  const specs = product.specifications || fallbackItem?.specifications || [];

  const handleCardClick = (e) => {
    e.preventDefault();
    if (onQuickView) {
      onQuickView(product);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="bg-white border border-slate-200/90 hover:border-orange-500/80 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl hover:shadow-orange-500/10 flex flex-col group transition-all duration-300 relative cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Product Image Stage */}
      <div className="relative aspect-[4/3] block overflow-hidden bg-gradient-to-b from-slate-50 via-slate-50/80 to-slate-100/70 p-6 border-b border-slate-100">
        <div className="w-full h-full flex items-center justify-center">
          <img
            src={imageSrc}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110 filter drop-shadow-md"
            onError={(e) => {
              if (fallbackItem?.image && e.target.src !== fallbackItem.image) {
                e.target.src = fallbackItem.image;
              }
            }}
          />
        </div>
        
        {/* Category Badge (Top Left) */}
        <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 z-10 pointer-events-none">
          <span className="text-[10px] uppercase font-bold tracking-wider text-orange-700 bg-white/95 backdrop-blur-md border border-orange-200/90 px-3 py-1 rounded-full shadow-xs">
            {categoryName}
          </span>
        </div>

        {/* Dynamic Balancing ISO Tag (Top Right) */}
        <div className="absolute top-3.5 right-3.5 z-10 pointer-events-none">
          <span className="text-[10px] font-mono font-bold text-slate-700 bg-white/90 backdrop-blur-sm border border-slate-200 px-2.5 py-1 rounded-md shadow-xs flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>ISO 1940</span>
          </span>
        </div>

        {/* Quick View Button on Hover */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-slate-950/90 text-white font-bold text-xs shadow-lg backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1.5 group-hover:bg-orange-600 z-10 pointer-events-none">
          <Eye size={14} />
          <span>Quick Engineering Spec</span>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-5 sm:p-6 flex flex-col flex-grow justify-between space-y-4">
        <div className="space-y-2.5">
          <h3 className="text-lg font-heading font-black text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
          
          <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed font-medium">
            {product.short_description || fallbackItem?.short_description || 'Heavy-duty power transmission precision component engineered for high reliability.'}
          </p>

          {/* Metallurgy Material Tag */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-700 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-xl font-medium">
            <span className="text-orange-600 font-bold shrink-0">Material:</span>
            <span className="truncate text-slate-800 font-semibold">{material}</span>
          </div>

          {/* Key Specs Snapshot if available */}
          {specs.length > 0 && (
            <div className="space-y-1 pt-1.5 border-t border-slate-100">
              {specs.slice(0, 2).map((spec, i) => (
                <div key={i} className="flex justify-between items-center text-[11px] text-slate-500">
                  <span className="font-medium">{spec.key}:</span>
                  <span className="font-semibold text-slate-800 font-mono">{spec.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2.5" onClick={(e) => e.stopPropagation()}>
          <button 
            type="button"
            onClick={handleCardClick}
            className="w-full text-xs font-bold bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-400 text-slate-800 hover:text-orange-600 py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileText size={13} className="text-orange-600" />
            <span>Spec Sheet</span>
          </button>

          <a 
            href={`https://wa.me/${COMPANY_INFO.whatsapp.replace('+', '')}?text=Hello%20Balaji%20Metal,%20I%20want%20to%20request%20a%20quotation%20for%20${encodeURIComponent(product.name)}`}
            target="_blank" 
            rel="noreferrer"
            className="w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="w-full text-xs font-bold bg-[#25D366] hover:bg-[#20bd5a] text-white py-2.5 px-3 rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer">
              <WhatsAppIcon size={14} fill="#ffffff" />
              <span>Get Quote</span>
            </button>
          </a>
        </div>
      </div>
    </motion.div>
  );
}
