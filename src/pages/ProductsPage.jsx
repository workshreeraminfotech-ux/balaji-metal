import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, X, SlidersHorizontal, ArrowRight, PhoneCall, 
  ShieldCheck, Award, Cpu, Layers, Disc, CircleDot, 
  Settings, CheckCircle2, Eye, LayoutGrid, ListFilter,
  FileText, ArrowUpRight, Sparkles, MessageSquare, Filter,
  Gauge, Check, RefreshCw
} from 'lucide-react';
import SEO from '@/components/ui/SEO';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { PRODUCTS, CATEGORIES } from '@/data/productsData';
import { COMPANY_INFO } from '@/data/companyData';
import ProductCard from '@/components/products/ProductCard';
import QuoteModal from '@/components/products/QuoteModal';
import QuickSpecModal from '@/components/products/QuickSpecModal';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedMaterial, setSelectedMaterial] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  
  // Modals state
  const [quoteProduct, setQuoteProduct] = useState(null);
  const [quoteSize, setQuoteSize] = useState('');
  const [quickSpecProduct, setQuickSpecProduct] = useState(null);

  // Sync with searchParams
  const handleCategorySelect = (catSlug) => {
    setActiveCategory(catSlug);
    const newParams = new URLSearchParams(searchParams);
    if (catSlug === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', catSlug);
    }
    setSearchParams(newParams, { replace: true });
  };

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    const newParams = new URLSearchParams(searchParams);
    if (!val) {
      newParams.delete('search');
    } else {
      newParams.set('search', val);
    }
    setSearchParams(newParams, { replace: true });
  };

  const handleResetFilters = () => {
    setActiveCategory('all');
    setSearchQuery('');
    setSelectedMaterial('all');
    setSortBy('featured');
    setSearchParams({});
  };

  const handleOpenQuote = (prod, size = '') => {
    setQuoteProduct(prod);
    setQuoteSize(size);
  };

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((item) => {
      // Category filter
      const matchesCategory = 
        activeCategory === 'all' || 
        item.category_slug === activeCategory ||
        item.category_name?.toLowerCase().includes(activeCategory.toLowerCase());

      // Search filter
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        item.name.toLowerCase().includes(q) ||
        item.short_description?.toLowerCase().includes(q) ||
        item.material?.toLowerCase().includes(q) ||
        item.available_sizes?.some(s => s.toLowerCase().includes(q)) ||
        item.specifications?.some(s => s.key.toLowerCase().includes(q) || s.value.toLowerCase().includes(q)) ||
        item.applications?.some(a => (a.application || '').toLowerCase().includes(q) || (a.industry || '').toLowerCase().includes(q))
      );

      // Material filter
      const matchesMaterial = 
        selectedMaterial === 'all' ? true :
        selectedMaterial === 'cast-iron' ? item.material?.toLowerCase().includes('cast iron') :
        selectedMaterial === 'steel' ? (item.material?.toLowerCase().includes('steel') || item.material?.toLowerCase().includes('sae')) :
        selectedMaterial === 'polyurethane' ? (item.material?.toLowerCase().includes('polyurethane') || item.description?.toLowerCase().includes('rubber')) : true;

      return matchesCategory && matchesSearch && matchesMaterial;
    }).sort((a, b) => {
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
    });
  }, [activeCategory, searchQuery, selectedMaterial, sortBy]);

  // Icons map for category tabs
  const getCategoryIcon = (slug) => {
    switch (slug) {
      case 'couplings': return Layers;
      case 'pulleys': return Disc;
      case 'hand-wheels': return CircleDot;
      case 'accessories': return Settings;
      default: return Sparkles;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      <SEO 
        title="Industrial Couplings, Pulleys & Transmission Products | Balaji Metal" 
        description="Explore Western India's largest catalog of precision Pin Bush Couplings, Star Spider Couplings, Tyre Couplings, V-Belt Pulleys and Hand Wheels by Balaji Metal Rajkot." 
        keywords="industrial couplings, pin bush coupling, jaw spider coupling, tyre coupling, v belt pulleys, taper lock bush, rajkot power transmission foundry"
      />

      {/* ─────────────────────────────────────────────────────────
          1. HERO HEADER (High-Impact Visible Background)
      ───────────────────────────────────────────────────────── */}
      <section className="relative bg-slate-950 text-white pt-28 pb-20 lg:pt-32 lg:pb-24 overflow-hidden border-b border-slate-800">
        {/* Background Image with Clear High-Definition Visibility */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero/products-hero.jpg" 
            alt="Balaji Metal Precision Industrial Transmission Products" 
            className="w-full h-full object-cover object-center filter brightness-[0.70] contrast-110"
          />
          {/* Subtle cinematic gradient so text is razor-sharp while background is clearly visible */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/40 to-slate-950/80" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(2,6,23,0.75)_100%)]" />
        </div>

        {/* Ambient Industrial Glows */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-orange-500/20 blur-[130px] rounded-full pointer-events-none z-1" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb on top left */}
          <div className="mb-6">
            <Breadcrumb 
              items={[{ label: 'Product Catalog', href: '/products' }]} 
              theme="dark"
            />
          </div>

          {/* Centered Hero Content with Crisp Drop Shadows */}
          <div className="text-center max-w-4xl mx-auto space-y-5 py-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950/80 border border-orange-500/50 text-orange-400 text-xs font-bold backdrop-blur-md shadow-xl shadow-black/40">
              <Award size={14} className="text-orange-400" />
              <span>ISO 9001:2015 Certified | Dynamic Balancing Conforming to ISO 1940</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-black tracking-tight leading-[1.15] text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
              Precision Industrial <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500">
                Power Transmission Products
              </span>
            </h1>

            <p className="text-slate-100 text-sm sm:text-base lg:text-lg leading-relaxed max-w-3xl mx-auto font-medium drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
              Heavy-duty Pin Bush Couplings, Star Spider Couplings, Tyre Couplings, V-Belt Pulleys, and custom CNC transmission components manufactured to rigorous metallurgical and dimensional standards in Rajkot.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          2. FLOATING SEARCH & CATEGORY TOOLBAR
      ───────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-xl shadow-slate-300/40 space-y-4">
          
          {/* Top Bar: Search Input & Controls */}
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:flex-1">
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search product name (e.g. Pin Bush), grade (FG 250), size (FBP-200), or application..."
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 pl-11 pr-10 py-3 rounded-2xl text-sm focus:border-orange-500 focus:bg-white focus:outline-none font-medium transition-all"
              />
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-600" />
              {searchQuery && (
                <button
                  onClick={() => handleSearchChange('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                  title="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Material Filter Dropdown */}
            <div className="w-full md:w-auto flex items-center gap-2">
              <div className="relative w-full md:w-44">
                <select
                  value={selectedMaterial}
                  onChange={(e) => setSelectedMaterial(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm font-semibold rounded-2xl px-3.5 py-3 focus:border-orange-500 focus:outline-none cursor-pointer"
                >
                  <option value="all">Material: All Grades</option>
                  <option value="cast-iron">Cast Iron (FG 220/250)</option>
                  <option value="steel">Alloy / Carbon Steel</option>
                  <option value="polyurethane">Polyurethane / Rubber</option>
                </select>
              </div>

              {/* Sort By Dropdown */}
              <div className="relative w-full md:w-44">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm font-semibold rounded-2xl px-3.5 py-3 focus:border-orange-500 focus:outline-none cursor-pointer"
                >
                  <option value="featured">Sort: Featured First</option>
                  <option value="name-asc">Sort: Name (A - Z)</option>
                  <option value="name-desc">Sort: Name (Z - A)</option>
                </select>
              </div>

              {/* View Toggle (Grid / List) */}
              <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 shrink-0">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    viewMode === 'grid' 
                      ? 'bg-white text-orange-600 shadow-xs' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid size={17} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    viewMode === 'list' 
                      ? 'bg-white text-orange-600 shadow-xs' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="List View"
                >
                  <ListFilter size={17} />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Interactive Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100 scrollbar-none">
            {/* All Products Tab */}
            <button
              onClick={() => handleCategorySelect('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-2 ${
                activeCategory === 'all'
                  ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md shadow-orange-500/25'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200/80'
              }`}
            >
              <Sparkles size={14} />
              <span>All Products ({PRODUCTS.length})</span>
            </button>

            {/* Individual Category Tabs */}
            {CATEGORIES.map((cat) => {
              const Icon = getCategoryIcon(cat.slug);
              const isSelected = activeCategory === cat.slug;
              const count = PRODUCTS.filter(p => p.category_slug === cat.slug).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.slug)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md shadow-orange-500/25'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200/80'
                  }`}
                >
                  <Icon size={14} />
                  <span>{cat.shortName || cat.name} ({count})</span>
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────
          3. MAIN PRODUCT CATALOG (GRID / LIST VIEW)
      ───────────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Results Header Info & Active Filter Tags */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div className="text-xs sm:text-sm text-slate-600 font-medium flex items-center gap-2 flex-wrap">
            <span>Showing <strong className="text-slate-900 font-bold">{filteredProducts.length}</strong> precision products</span>
            {activeCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 text-xs font-bold">
                Category: {activeCategory}
              </span>
            )}
            {selectedMaterial !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-800 text-xs font-bold">
                Material: {selectedMaterial}
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                Search: "{searchQuery}"
              </span>
            )}
          </div>

          {(searchQuery || activeCategory !== 'all' || selectedMaterial !== 'all') && (
            <button
              onClick={handleResetFilters}
              className="text-xs text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1 cursor-pointer underline"
            >
              <RefreshCw size={12} />
              <span>Reset all filters</span>
            </button>
          )}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 sm:p-16 text-center space-y-4 shadow-sm my-6">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center mx-auto">
              <Search size={30} />
            </div>
            <h3 className="text-2xl font-heading font-black text-slate-900">
              No matching products found
            </h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
              We couldn't find any industrial products matching your criteria. Try adjusting your search keyword, category, or material filter.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm shadow-md cursor-pointer transition-all"
            >
              View Full Product Catalog
            </button>
          </div>
        )}

        {/* GRID VIEW MODE */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onQuickView={setQuickSpecProduct}
                onOpenQuote={handleOpenQuote}
              />
            ))}
          </div>
        )}

        {/* LIST VIEW MODE */}
        {viewMode === 'list' && (
          <div className="space-y-4">
            {filteredProducts.map((product, index) => {
              const specs = product.specifications || [];
              const sizes = product.available_sizes || [];

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                  onClick={() => setQuickSpecProduct(product)}
                  className="bg-white rounded-3xl border border-slate-200 hover:border-orange-400 p-5 sm:p-6 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row items-center gap-6 group cursor-pointer"
                >
                  {/* Product Image */}
                  <div 
                    className="w-full md:w-52 h-40 bg-slate-50 rounded-2xl border border-slate-100 p-4 flex items-center justify-center shrink-0 overflow-hidden"
                  >
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-contain filter drop-shadow-sm group-hover:scale-108 transition-transform duration-500"
                    />
                  </div>

                  {/* Details Middle */}
                  <div className="flex-1 space-y-2.5 text-center md:text-left">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700 bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-full">
                        {product.category_name}
                      </span>
                      <span className="text-[10px] text-slate-600 font-mono bg-slate-100 px-2 py-0.5 rounded-md font-bold">
                        ISO 1940 Balanced
                      </span>
                    </div>

                    <h3 className="text-xl font-heading font-black text-slate-900 group-hover:text-orange-600 transition-colors">
                      {product.name}
                    </h3>

                    <p className="text-slate-600 text-xs sm:text-sm line-clamp-2 leading-relaxed font-medium">
                      {product.short_description}
                    </p>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs text-slate-500 pt-1">
                      <div>
                        <strong className="text-slate-800 font-semibold">Material:</strong> {product.material}
                      </div>
                      {sizes.length > 0 && (
                        <div>
                          <strong className="text-slate-800 font-semibold">Sizes:</strong> {sizes.length} Standard Variations
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Right */}
                  <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0 w-full md:w-48" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => setQuickSpecProduct(product)}
                      className="w-full text-xs font-bold bg-slate-100 hover:bg-orange-50 hover:text-orange-600 border border-slate-200 hover:border-orange-300 text-slate-800 py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                    >
                      <Eye size={15} className="text-orange-600" />
                      <span>View Spec Sheet</span>
                    </button>

                    <a 
                      href={`https://wa.me/${COMPANY_INFO.whatsapp.replace('+', '')}?text=Hello%20Balaji%20Metal,%20I%20want%20to%20request%20a%20quotation%20for%20${encodeURIComponent(product.name)}`}
                      target="_blank" 
                      rel="noreferrer"
                      className="w-full"
                    >
                      <button className="w-full text-xs font-bold bg-[#25D366] hover:bg-[#20bd5a] text-white py-3 px-4 rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer">
                        <WhatsAppIcon size={15} fill="#ffffff" />
                        <span>Instant RFQ</span>
                      </button>
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────
            4. TECHNICAL MACHINING & DRAWINGS CALLOUT
        ───────────────────────────────────────────────────────── */}
        <section className="mt-20 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          {/* Accent glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/35 text-orange-400 text-xs font-bold">
                <Cpu size={14} className="text-orange-400" />
                <span>Foundry & CNC Precision Engineering</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-black text-white tracking-tight leading-tight">
                Need Custom Pilot Bores, Keyways or Casting as per Drawing?
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                We manufacture bespoke couplings and pulleys based on client 2D/3D mechanical drawings with ISO 1940 dynamic balancing, custom broaching (DIN 6885 / BS 4235), and rapid pan-India dispatch.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-xs text-slate-300 font-semibold">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-orange-400" />
                  <span>Custom PCD & Grooves</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-orange-400" />
                  <span>Taper Lock Adaptations</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-orange-400" />
                  <span>Direct Foundry Lead Times</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3 justify-center items-stretch sm:items-center lg:items-end">
              <Link to="/contact" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-sm shadow-xl shadow-orange-500/25 flex items-center justify-center gap-2.5 cursor-pointer hover:scale-105 transition-all">
                  <FileText size={18} />
                  <span>Submit Drawing / RFQ</span>
                </button>
              </Link>

              <a
                href={`https://wa.me/${COMPANY_INFO.whatsapp.replace('+', '')}?text=Hello%20Balaji%20Metal,%20I%20have%20a%20technical%20drawing%20for%20a%20custom%20coupling/pulley.`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto"
              >
                <button className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] hover:text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer">
                  <WhatsAppIcon size={16} fill="#25D366" />
                  <span>Technical Consultation on WhatsApp</span>
                </button>
              </a>
            </div>
          </div>
        </section>

      </main>

      {/* Quick RFQ Modal */}
      {quoteProduct && (
        <QuoteModal
          productName={quoteProduct.name}
          selectedSize={quoteSize}
          isOpen={!!quoteProduct}
          onClose={() => {
            setQuoteProduct(null);
            setQuoteSize('');
          }}
        />
      )}

      {/* Quick Spec Sheet Modal */}
      {quickSpecProduct && (
        <QuickSpecModal
          product={quickSpecProduct}
          isOpen={!!quickSpecProduct}
          onClose={() => setQuickSpecProduct(null)}
          onOpenQuote={handleOpenQuote}
        />
      )}
    </div>
  );
}
