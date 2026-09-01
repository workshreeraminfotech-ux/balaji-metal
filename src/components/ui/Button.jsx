import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/helpers';

const variants = {
  primary: 'bg-accent text-white hover:bg-accent-dark',
  secondary: 'bg-transparent border border-navy text-white hover:bg-navy-lighter',
  outline: 'bg-transparent border border-white text-white hover:bg-white/10',
  ghost: 'bg-transparent text-white hover:bg-white/10',
  // For use on white/light backgrounds (e.g. admin panel tables and cards).
  // The other variants above use white text/borders, meant for the dark
  // navy public site theme — they render invisible on light backgrounds.
  'outline-light': 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-800',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2',
  lg: 'px-6 py-3 text-lg',
};

export default function Button({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className, 
  loading = false, 
  disabled = false,
  icon,
  ...rest 
}) {
  // `icon` can be passed either as a component reference (icon={Plus})
  // or as an already-rendered element (icon={<Plus size={18} />}).
  // Support both so a mismatch at the call site never crashes rendering.
  const isComponentRef = typeof icon === 'function';
  const iconElement = loading
    ? null
    : isComponentRef
      ? React.createElement(icon, { className: 'mr-2 h-4 w-4' })
      : icon
        ? React.cloneElement(icon, {
            className: cn('mr-2 h-4 w-4', icon.props?.className),
          })
        : null;

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-navy disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...rest}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {!loading && iconElement}
      {children}
    </motion.button>
  );
}
