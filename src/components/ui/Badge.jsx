import React from 'react';
import { cn } from '@/utils/helpers';

export default function Badge({ variant = 'default', children, className }) {
  const variants = {
    default: 'bg-accent/20 text-accent border border-accent/30',
    success: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    warning: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    info: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    gray: 'bg-slate-500/20 text-slate-300 border border-slate-500/30',
  };

  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', variants[variant], className)}>
      {children}
    </span>
  );
}
