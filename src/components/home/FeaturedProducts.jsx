import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Award, ChevronLeft, ChevronRight 
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/products/ProductCard';
import QuoteModal from '@/components/products/QuoteModal';
import QuickSpecModal from '@/components/products/QuickSpecModal';

const FeaturedProducts = () => {
  const { products } = useProducts();
  const [quoteProduct, setQuoteProduct] = useState(null);
  const [quoteSize, setQuoteSize] = useState('');
  const [quickSpecProduct, setQuickSpecProduct] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef(null);

  // Use featured products or all products if none marked
  const displayProducts = products.filter(p => p.is_featured !== false);
  const activeList = displayProducts.length > 0 ? displayProducts : products;

  // Auto-scroll effect
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 20) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: 360, behavior: 'smooth' });
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -360 : 360;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleOpenQuote = (prod, size = '') => {
    setQuoteProduct(prod);
    setQuoteSize(size);
  };

  return (
    <section className="py-20 lg:py-24 bg-slate-50 text-slate-900 border-b border-slate-200/80 relative overflow-hidden">
      {/* Ambient background accents */}
      <div className="absolute top-0 right-1/3 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with Navigation */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold w-fit">
              <Award size={14} className="text-orange-600" />
              <span>Standard & Custom Product Range</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-slate-900 tracking-tight leading-tight">
              Precision Power Transmission <br />
              <span className="text-orange-600">
                Products Lineup
              </span>
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Heavy-duty Pin Bush Couplings, Star Spider Couplings, and precision machined V-Belt Pulleys manufactured in Rajkot.
            </p>
          </div>

          {/* Desktop Only: Navigation Arrows & All Products Button */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scroll('left')}
                className="w-11 h-11 rounded-2xl bg-white hover:bg-orange-600 text-slate-700 hover:text-white border border-slate-200 hover:border-orange-600 shadow-sm hover:shadow-md flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
                title="Scroll Left"
                aria-label="Scroll left"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                type="button"
                onClick={() => scroll('right')}
                className="w-11 h-11 rounded-2xl bg-white hover:bg-orange-600 text-slate-700 hover:text-white border border-slate-200 hover:border-orange-600 shadow-sm hover:shadow-md flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
                title="Scroll Right"
                aria-label="Scroll right"
              >
                <ChevronRight size={22} />
              </button>
            </div>

            <Link to="/products" className="inline-flex shrink-0">
              <button 
                type="button"
                className="bg-slate-900 hover:bg-orange-600 text-white font-bold px-5 py-3 rounded-2xl text-sm flex items-center gap-2.5 shadow-md shadow-slate-900/20 hover:shadow-orange-600/30 transition-all cursor-pointer hover:scale-105"
              >
                <span>All Products ({products.length})</span>
                <ArrowRight size={16} className="text-orange-400 group-hover:text-white" />
              </button>
            </Link>
          </div>
        </div>

        {/* Auto-Scrollable Products Carousel with Snap */}
        <div 
          ref={scrollRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          className="flex overflow-x-auto pb-6 gap-6 scrollbar-none snap-x snap-mandatory scroll-smooth"
        >
          {activeList.map((product) => (
            <div 
              key={product.id} 
              className="w-[290px] sm:w-[340px] lg:w-[370px] shrink-0 snap-start flex flex-col"
            >
              <ProductCard
                product={product}
                onQuickView={setQuickSpecProduct}
                onOpenQuote={handleOpenQuote}
              />
            </div>
          ))}
        </div>

        {/* Mobile Only: Bottom Controls with Arrows & All Products Button */}
        <div className="mt-4 sm:hidden flex items-center gap-3">
          {/* Scroll Navigation Arrow Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => scroll('left')}
              className="w-12 h-12 rounded-2xl bg-white active:bg-orange-600 text-slate-700 active:text-white border border-slate-200 shadow-sm flex items-center justify-center transition-all cursor-pointer active:scale-95"
              title="Previous Product"
              aria-label="Scroll left"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              className="w-12 h-12 rounded-2xl bg-white active:bg-orange-600 text-slate-700 active:text-white border border-slate-200 shadow-sm flex items-center justify-center transition-all cursor-pointer active:scale-95"
              title="Next Product"
              aria-label="Scroll right"
            >
              <ChevronRight size={22} />
            </button>
          </div>

          {/* All Products Button */}
          <Link to="/products" className="flex-1 min-w-0">
            <button 
              type="button"
              className="w-full h-12 bg-slate-900 active:bg-orange-600 text-white font-bold px-4 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-md shadow-slate-900/20 active:scale-98 transition-all cursor-pointer"
            >
              <span className="truncate">All Products ({products.length})</span>
              <ArrowRight size={16} className="text-amber-400 shrink-0" />
            </button>
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
