import React from 'react';
import { cn } from '@/utils/helpers';

export default function Skeleton({ variant = 'text', className, ...props }) {
  const variants = {
    text: 'h-4 w-3/4 rounded',
    card: 'h-64 w-full rounded-xl',
    image: 'h-full w-full rounded',
    'table-row': 'h-12 w-full rounded',
  };

  return (
    <div
      className={cn('shimmer bg-navy-lighter', variants[variant], className)}
      {...props}
    />
  );
}
