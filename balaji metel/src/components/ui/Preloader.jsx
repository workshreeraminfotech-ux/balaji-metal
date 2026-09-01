import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hide preloader smoothly after 1.8 seconds
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
          className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center select-none"
        >
          <div className="flex flex-col items-center max-w-sm mx-auto px-6">
            {/* Logo Container with Smooth Motion */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center text-center mb-6"
            >
              {/* BM Logo Icon */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 p-0.5 shadow-xl shadow-orange-500/20 mb-4 flex items-center justify-center">
                <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center font-heading font-black text-2xl sm:text-3xl text-amber-400">
                  BM
                </div>
              </div>

              {/* Company Title */}
              <div className="flex flex-col items-center">
                <span className="font-heading text-2xl sm:text-3xl font-black tracking-tight text-slate-900 flex items-center gap-1.5">
                  BALAJI <span className="text-orange-600">METAL</span>
                </span>
                <span className="text-[11px] sm:text-xs tracking-[0.2em] uppercase font-bold text-slate-400 mt-1">
                  Precision Engineering Works
                </span>
              </div>
            </motion.div>

            {/* Line Fill Animation Container */}
            <div className="w-48 sm:w-56 h-1.5 bg-slate-100 rounded-full overflow-hidden relative shadow-inner">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.6, ease: [0.65, 0, 0.35, 1] }}
                className="h-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-full shadow-sm shadow-orange-500/50"
              />
            </div>

            {/* Subtle Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-[11px] text-slate-400 font-medium mt-3"
            >
              Loading Industrial Showcase...
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
