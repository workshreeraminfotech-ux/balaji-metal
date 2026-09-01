import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/utils/helpers';

export default function Breadcrumb({ items = [], className = '', theme = 'light' }) {
  // Filter out any duplicate 'Home' or root path if passed in items
  const filteredItems = (items || []).filter(
    (item) => item && item.label && item.label.trim().toLowerCase() !== 'home' && item.href !== '/'
  );

  const isDark = theme === 'dark' || className.includes('text-slate-400') || className.includes('dark');

  return (
    <nav className={cn("flex text-sm", className)} aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2 flex-wrap">
        <li className="inline-flex items-center">
          <Link
            to="/"
            className={cn(
              "inline-flex items-center transition-colors font-medium",
              isDark
                ? "text-slate-400 hover:text-orange-400"
                : "text-slate-500 hover:text-orange-600"
            )}
          >
            <Home className="mr-1.5 h-4 w-4 shrink-0" />
            Home
          </Link>
        </li>
        {filteredItems.map((item, index) => {
          const isLast = index === filteredItems.length - 1;
          return (
            <li key={item.label || index} className="inline-flex items-center">
              <div className="flex items-center">
                <ChevronRight
                  className={cn(
                    "h-4 w-4 mx-1 shrink-0",
                    isDark ? "text-slate-600" : "text-slate-400"
                  )}
                />
                {isLast ? (
                  <span
                    className={cn(
                      "font-semibold",
                      isDark ? "text-white" : "text-slate-900"
                    )}
                    aria-current="page"
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    to={item.href || '#'}
                    className={cn(
                      "transition-colors font-medium",
                      isDark
                        ? "text-slate-400 hover:text-orange-400"
                        : "text-slate-500 hover:text-orange-600"
                    )}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

