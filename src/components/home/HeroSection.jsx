import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Award } from 'lucide-react';
import Button from '@/components/ui/Button';

const HeroSection = () => {
  const videoRef = useRef(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  // Keep video playing only first 8 seconds on loop
  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.currentTime >= 8) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

  return (
    <section className="relative min-h-[92vh] lg:min-h-[94vh] flex items-center justify-start overflow-hidden pt-36 pb-20 sm:pt-40 sm:pb-24 lg:pt-48 lg:pb-32 border-b border-slate-800">
      {/* Bright & Clear Background Video with 8s Loop */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          onTimeUpdate={handleTimeUpdate}
          className="w-full h-full object-cover filter brightness-105 contrast-105"
        >
          <source src="/images/hero/hero-video.mp4" type="video/mp4" />
          <source src="/images/hero/Metal_casting_manufacturing_proc._202608251857_gwr_video_mvp.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Soft, Transparent Overlay for Clear Video Visibility */}
        <div className="absolute inset-0 bg-slate-950/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <motion.div
          className="max-w-3xl space-y-6 flex flex-col items-start text-left"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* ISO / Quality Badge */}
          <motion.div 
            variants={itemVariants} 
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900/80 border border-orange-500/50 text-orange-400 text-xs sm:text-sm font-bold shadow-lg backdrop-blur-md"
          >
            <Award size={16} className="text-orange-400 shrink-0" />
            <span>ISO 9001:2015 Certified | 25+ Years of Foundry & Machining Excellence</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-black text-white leading-[1.12] tracking-tight drop-shadow-md"
            variants={itemVariants}
          >
            Precision Engineered <br />
            <span className="text-orange-500 font-bold drop-shadow-sm">
              Couplings & Pulleys
            </span>
          </motion.h1>
          
          {/* Subtext */}
          <motion.p 
            className="text-base sm:text-lg md:text-xl text-slate-200 max-w-2xl font-body leading-relaxed drop-shadow-sm"
            variants={itemVariants}
          >
            Balaji Metal is Western India's trusted manufacturer of heavy-duty <strong className="text-white font-bold">Pin Bush Couplings, Star Spider Couplings</strong>, and dynamically balanced <strong className="text-white font-bold">V-Belt Pulleys</strong> built to withstand the most demanding industrial operations.
          </motion.p>
          
          {/* Single CTA Button - Explore Product Catalog */}
          <motion.div 
            className="pt-2 w-full sm:w-auto"
            variants={itemVariants}
          >
            <Link to="/products" className="inline-block w-full sm:w-auto">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-orange-600 hover:bg-orange-500 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-orange-600/20 border-0 flex items-center justify-center gap-2.5 group text-base cursor-pointer hover:scale-[1.02] transition-all duration-200"
              >
                <span>Explore Product Catalog</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
