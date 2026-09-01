import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-navy flex flex-col items-center justify-center relative overflow-hidden px-4 text-center">
      {/* Decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent/20 rounded-full blur-3xl mix-blend-screen"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl mix-blend-screen"></div>

      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="relative z-10"
      >
        <h1 className="text-9xl md:text-[12rem] font-heading font-black text-transparent bg-clip-text bg-gradient-to-br from-accent to-accent-dark drop-shadow-2xl">
          404
        </h1>
        <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mt-4 mb-6">
          Page Not Found
        </h2>
        <p className="text-xl text-gray-400 mb-10 max-w-lg mx-auto">
          The page you're looking for doesn't exist, has been moved, or is temporarily unavailable.
        </p>
        
        <Link to="/">
          <Button variant="primary" size="lg" className="shadow-lg shadow-accent/20">
            Back to Home
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
