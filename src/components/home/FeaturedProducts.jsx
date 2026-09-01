import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Sparkles, Layers, Disc, CircleDot, 
  Settings, Award, ShieldCheck, CheckCircle2 
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { PRODUCTS, CATEGORIES } from '@/data/productsData';
import ProductCard from '@/components/products/ProductCard';
import QuoteModal from '@/components/products/QuoteModal';
import QuickSpecModal from '@/components/products/QuickSpecModal';

const FeaturedProducts = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [quoteProduct, setQuoteProduct] = useState(null);
  const [quoteSize, setQuoteSize] = useState('');
  const [quickSpecProduct, setQuickSpecProduct] = useState(null);

  const handleOpenQuote = (prod, size = '') => {
    setQuoteProduct(prod);
    setQuoteSize(size);
  };

  const filteredProducts = activeCategory === 'all'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category_slug === activeCategory);

  const getCategoryIcon = (slug) => {
    switch (slug) {
      case 'couplings': return Layers;
      case 'pulleys': return Disc;
      case 'hand-wheels': return CircleDot;
      case 'accessories': return Settings;
      default: return Sparkles;
    }
  };

  return (
    <section className="py-20 lg:py-24 bg-slate-50 text-slate-900 border-b border-slate-200/80 relative overflow-hidden">
      {/* Ambient background accents */}
      <div className="absolute top-0 right-1/3 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold shadow-xs">
              <Award size={14} className="text-orange-600" />
              <span>ISO 9001:2015 & ISO 1940 Dynamic Balancing</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-slate-900 tracking-tight leading-tight">
              Featured Power Transmission <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500">
                Products & Castings
              </span>
            </h2>
            
            <p className="text-slate-600 text-sm sm:text-base font-medium">
              Heavy-duty Pin Bush Couplings, Star Spider Couplings, Tyre Couplings, and precision CNC machined V-Belt Pulleys manufactured in Rajkot.
            </p>
          </div>

          <Link to="/products" className="hidden md:inline-flex shrink-0">
            <Button className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 hover:border-orange-500 px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 shadow-xs cursor-pointer transition-all">
              <span>View Full Catalog ({PRODUCTS.length})</span>
              <ArrowRight size={16} className="text-orange-600" />
            </Button>
          </Link>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-10 scrollbar-none">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
              activeCategory === 'all'
                ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md shadow-orange-500/25'
                : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200 shadow-xs'
            }`}
          >
            <Sparkles size={14} />
            <span>All Products ({PRODUCTS.length})</span>
          </button>
          
          {CATEGORIES.map(cat => {
            const Icon = getCategoryIcon(cat.slug);
            const isSelected = activeCategory === cat.slug;
            const count = PRODUCTS.filter(p => p.category_slug === cat.slug).length;

            return (
              <button
                key={cat.slug}
                onClick={() => setActiveCategory(cat.slug)}
                className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md shadow-orange-500/25'
                    : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200 shadow-xs'
                }`}
              >
                <Icon size={14} />
                <span>{cat.shortName} ({count})</span>
              </button>
            );
          })}
        </div>

        {/* Products Grid - Modern ProductCard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={setQuickSpecProduct}
              onOpenQuote={handleOpenQuote}
            />
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="text-center mt-10 md:hidden">
          <Link to="/products">
            <Button className="w-full bg-white text-orange-600 border border-slate-300 py-3.5 rounded-2xl text-sm font-bold shadow-xs">
              View All Products ({PRODUCTS.length})
            </Button>
          </Link>
        </div>

      </div>

      {/* Quick RFQ Modal */}
      {quoteProduct && (
        <QuoteModal
          productName={quoteProduct.name}
          selectedSize={quoteSize}
          isOpen={!!quoteProduct}
          onClose={() => {
            setQuoteProduct(null);
            setQuoteSize('');
          }}
        />
      )}

      {/* Quick Spec Sheet Modal */}
      {quickSpecProduct && (
        <QuickSpecModal
          product={quickSpecProduct}
          isOpen={!!quickSpecProduct}
          onClose={() => setQuickSpecProduct(null)}
          onOpenQuote={handleOpenQuote}
        />
      )}
    </section>
  );
};

export default FeaturedProducts;
