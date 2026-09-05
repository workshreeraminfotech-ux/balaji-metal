import React, { forwardRef } from 'react';
import { cn } from '@/utils/helpers';

const Input = forwardRef(({ className, label, error, type = 'text', ...props }, ref) => {
  const isTextarea = type === 'textarea';
  const isSelect = type === 'select';
  
  const baseClasses = "w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all font-sans text-sm";
  
  return (
    <div className="w-full">
      {label && (
        <label className="mb-1.5 block text-xs font-bold text-slate-700 uppercase tracking-wider">
          {label}
        </label>
      )}
      {isTextarea ? (
        <textarea
          ref={ref}
          className={cn(baseClasses, "min-h-[100px] resize-y text-slate-900 leading-relaxed", error && "border-red-500 focus:border-red-500", className)}
          {...props}
        />
      ) : isSelect ? (
        <select
          ref={ref}
          className={cn(baseClasses, "cursor-pointer text-slate-900", error && "border-red-500 focus:border-red-500", className)}
          {...props}
        >
          {props.children}
        </select>
      ) : (
        <input
          type={type}
          ref={ref}
          className={cn(baseClasses, "text-slate-900", error && "border-red-500 focus:border-red-500", className)}
          {...props}
        />
      )}
      {error && (
        <p className="mt-1 text-xs text-red-500 font-bold">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
