import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Eye, Sparkles, Building2, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product, onQuickView }) {
  const navigate = useNavigate();
  const defaultImage = '/images/products/pin-bush-coupling/pin-bush-coupling-01.jpeg';
  const imageSrc = product.image || 
    (product.featured_image ? (product.featured_image.startsWith('http') || product.featured_image.startsWith('/') ? product.featured_image : `/uploads/products/${product.featured_image}`) : null) || 
    (Array.isArray(product.gallery) && product.gallery[0]) || 
    defaultImage;

  const categoryName = product.category_name || 'Industrial Product';
  const shortDesc = product.short_description || product.description || 'High quality industrial power transmission component.';
  const applications = Array.isArray(product.applications) ? product.applications : [];

  // Get primary industry tag
  const primaryIndustry = applications[0]?.industry || 'Industrial Machinery';

  const handleCardClick = () => {
    if (onQuickView) {
      onQuickView(product);
    }
  };

  const handleGetQuote = (e) => {
    e.stopPropagation();
    navigate(`/contact?product=${encodeURIComponent(product.name)}`);
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      onClick={handleCardClick}
      className="bg-white border border-slate-200/90 hover:border-orange-500/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-orange-500/10 flex flex-col group transition-all duration-300 relative cursor-pointer"
    >
      {/* Product Image Stage */}
      <div className="relative aspect-[4/3] block overflow-hidden bg-gradient-to-b from-slate-50 via-slate-50/80 to-slate-100/70 p-6 border-b border-slate-100">
        <div className="w-full h-full flex items-center justify-center">
          <img
            src={imageSrc}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-108 filter drop-shadow-md"
            onError={(e) => {
              if (e.target.src !== defaultImage && !e.target.src.includes('pin-bush-coupling-01.jpeg')) {
                e.target.src = defaultImage;
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
      </div>

      {/* Product Content Details */}
      <div className="p-5 sm:p-6 flex flex-col flex-grow justify-between space-y-4">
        <div className="space-y-3">
          {/* Product Name */}
          <h3 className="text-lg font-heading font-black text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
          
          {/* Short Normal Description */}
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-normal line-clamp-2">
            {shortDesc}
          </p>

          {/* Industry Application Tag */}
          <div className="flex items-center gap-1.5 text-xs text-slate-700 bg-slate-50 border border-slate-200/80 px-3 py-2 rounded-xl">
            <Building2 size={14} className="text-orange-600 shrink-0" />
            <span className="text-slate-500 font-medium">Used in:</span>
            <span className="font-semibold text-slate-800 truncate">{primaryIndustry}</span>
          </div>
        </div>

        {/* Single CTA Button: Get Quote */}
        <div className="pt-2 border-t border-slate-100">
          <button 
            type="button"
            onClick={handleGetQuote}
            className="w-full text-sm font-bold bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-xl shadow-md shadow-orange-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.02]"
          >
            <span>Get Quote</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

