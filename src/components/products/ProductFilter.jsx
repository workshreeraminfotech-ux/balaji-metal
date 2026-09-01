import React from 'react';
import { Search, X, SlidersHorizontal, Layers } from 'lucide-react';
import Input from '@/components/ui/Input';

export default function ProductFilter({ 
  search, 
  onSearchChange, 
  categoryId, 
  onCategoryChange, 
  categories,
  totalCount = 0
}) {
  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 mb-10 shadow-sm space-y-4">
      {/* Top Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search Bar with Icon */}
        <div className="w-full md:w-2/3 relative">
          <Input
            type="text"
            placeholder="Search couplings, pulleys, hand wheels, grade FG 250, bore size..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 pl-11 pr-10 py-3 rounded-2xl text-sm focus:border-orange-500 font-medium transition-all"
          />
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-600" />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Category Dropdown for Mobile / Quick Select */}
        <div className="w-full md:w-1/3">
          <Input
            type="select"
            value={categoryId}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full bg-slate-50 border-slate-200 text-slate-900 py-3 rounded-2xl text-sm focus:border-orange-500 font-bold"
          >
            <option value="">All Product Categories ({totalCount})</option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </Input>
        </div>
      </div>

      {/* Interactive Category Tabs with Count Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pt-3 border-t border-slate-100 scrollbar-none">
        <button
          onClick={() => onCategoryChange('')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
            !categoryId 
              ? 'bg-orange-600 text-white shadow-md shadow-orange-500/20' 
              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200/80'
          }`}
        >
          <Layers size={14} />
          <span>All Products ({totalCount})</span>
        </button>

        {categories?.map((cat) => {
          const isSelected = String(categoryId) === String(cat.id) || categoryId === cat.slug;
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(String(cat.id))}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-orange-600 text-white shadow-md shadow-orange-500/20' 
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200/80'
              }`}
            >
              <span>{cat.shortName || cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
