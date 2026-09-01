import React, { forwardRef } from 'react';
import { cn } from '@/utils/helpers';

const Input = forwardRef(({ className, label, error, type = 'text', ...props }, ref) => {
  const isTextarea = type === 'textarea';
  const isSelect = type === 'select';
  
  const baseClasses = "w-full rounded-md border border-slate-700 bg-navy-light px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-colors";
  
  return (
    <div className="w-full">
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-slate-300">
          {label}
        </label>
      )}
      {isTextarea ? (
        <textarea
          ref={ref}
          className={cn(baseClasses, "min-h-[100px] resize-y", error && "border-red-500 focus:ring-red-500", className)}
          {...props}
        />
      ) : isSelect ? (
        <select
          ref={ref}
          className={cn(baseClasses, error && "border-red-500 focus:ring-red-500", className)}
          {...props}
        >
          {props.children}
        </select>
      ) : (
        <input
          type={type}
          ref={ref}
          className={cn(baseClasses, error && "border-red-500 focus:ring-red-500", className)}
          {...props}
        />
      )}
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
