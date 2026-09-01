import React from 'react';
import { motion } from 'framer-motion';
import { PackageSearch, RotateCcw } from 'lucide-react';
import ProductCard from './ProductCard';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } }
};

export default function ProductGrid({ products, loading, onResetFilters }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-3xl overflow-hidden p-6 space-y-4 animate-pulse">
             <div className="h-48 bg-slate-100 rounded-2xl w-full" />
             <div className="h-5 bg-slate-200 rounded-md w-3/4" />
             <div className="h-4 bg-slate-100 rounded-md w-full" />
             <div className="h-4 bg-slate-100 rounded-md w-2/3" />
             <div className="h-10 bg-slate-100 rounded-xl mt-4" />
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-white border border-slate-200/90 rounded-3xl shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 mb-4">
          <PackageSearch size={32} />
        </div>
        <h3 className="text-xl sm:text-2xl font-heading font-black text-slate-900 mb-2">
          No matching products found
        </h3>
        <p className="text-slate-500 text-sm max-w-md mb-6 leading-relaxed">
          We couldn't find any products matching your current filters. Try changing your search term or select another category.
        </p>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm flex items-center gap-2 shadow-sm cursor-pointer transition-colors"
          >
            <RotateCcw size={16} />
            <span>Reset All Filters</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={itemVariants}>
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
}
