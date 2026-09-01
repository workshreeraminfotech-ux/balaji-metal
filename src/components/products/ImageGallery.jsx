import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Package } from 'lucide-react';

export default function ImageGallery({ images = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const sortedImages = [...images].sort((a, b) => {
    if (a.is_featured) return -1;
    if (b.is_featured) return 1;
    return (a.sort_order || 0) - (b.sort_order || 0);
  });

  const handlePrevious = useCallback((e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? sortedImages.length - 1 : prev - 1));
  }, [sortedImages.length]);

  const handleNext = useCallback((e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === sortedImages.length - 1 ? 0 : prev + 1));
  }, [sortedImages.length]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isLightboxOpen) return;
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') setIsLightboxOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, handleNext, handlePrevious]);

  if (!sortedImages.length) {
    return (
      <div className="w-full aspect-video bg-navy-light rounded-2xl flex items-center justify-center border border-navy-lighter">
        <Package size={64} className="text-gray-500" />
      </div>
    );
  }

  const currentImage = sortedImages[currentIndex];

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Main Image */}
      <div 
        className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-[3/2] rounded-2xl overflow-hidden bg-navy-light border border-navy-lighter cursor-zoom-in group"
        onClick={() => setIsLightboxOpen(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={`/uploads/products/${currentImage.filename}`}
            alt="Product"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, scale: isHovered ? 1.05 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>

        {sortedImages.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 backdrop-blur-sm"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 backdrop-blur-sm"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {sortedImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-navy-lighter scrollbar-track-transparent">
          {sortedImages.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setCurrentIndex(idx)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                idx === currentIndex ? 'border-accent scale-105' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img src={`/uploads/products/${img.filename}`} alt="Thumbnail" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
            onClick={() => setIsLightboxOpen(false)}
          >
            <button 
              className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors bg-white/10 rounded-full"
              onClick={() => setIsLightboxOpen(false)}
            >
              <X size={24} />
            </button>
            
            <div className="relative w-full max-w-5xl aspect-video px-4 md:px-12 flex items-center justify-center" onClick={e => e.stopPropagation()}>
               <motion.img
                  key={`lightbox-${currentIndex}`}
                  src={`/uploads/products/${currentImage.filename}`}
                  alt="Product Fullscreen"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="max-w-full max-h-[85vh] object-contain"
                />

              {sortedImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrevious}
                    className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors backdrop-blur-md"
                  >
                    <ChevronLeft size={32} />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors backdrop-blur-md"
                  >
                    <ChevronRight size={32} />
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
