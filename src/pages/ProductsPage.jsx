import React, { useState, useMemo, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, X, ArrowRight, ShieldCheck, Award, Cpu, 
  Layers, Disc, CircleDot, Settings, CheckCircle2, 
  Eye, LayoutGrid, ListFilter, FileText, Sparkles, 
  RefreshCw, ChevronLeft, ChevronRight, Building2
} from 'lucide-react';
import SEO from '@/components/ui/SEO';
import Breadcrumb from '@/components/ui/Breadcrumb';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useSettings } from '@/hooks/useSettings';
import ProductCard from '@/components/products/ProductCard';
import QuoteModal from '@/components/products/QuoteModal';
import QuickSpecModal from '@/components/products/QuickSpecModal';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';

export default function ProductsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';

  const { products } = useProducts();
  const { categories } = useCategories();
  const { settings } = useSettings();
  const waNumber = (settings.whatsapp_number || settings.company_whatsapp || settings.whatsapp || '917600060193').replace('+', '');

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  
  // Scroll Ref for products container
  const productsScrollRef = useRef(null);

  const scrollProducts = (direction) => {
    if (productsScrollRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      productsScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };
  
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
    setSearchParams({});
  };

  const handleOpenQuote = (prod, size = '') => {
    setQuoteProduct(prod);
    setQuoteSize(size);
  };

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // Category filter
      const matchesCategory = 
        activeCategory === 'all' || 
        item.category_slug === activeCategory ||
        String(item.category_id) === String(activeCategory) ||
        item.category_name?.toLowerCase().includes(activeCategory.toLowerCase());

      // Search filter
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        item.name.toLowerCase().includes(q) ||
        item.short_description?.toLowerCase().includes(q) ||
        item.material?.toLowerCase().includes(q) ||
        item.available_sizes?.some(s => s.toLowerCase().includes(q)) ||
        item.applications?.some(a => (a.application || '').toLowerCase().includes(q) || (a.industry || '').toLowerCase().includes(q))
      );

      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchQuery]);

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
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 overflow-hidden">
      <SEO 
        title="Industrial Couplings, Pulleys & Transmission Products | Balaji Metal" 
        description="Explore Western India's largest catalog of precision Pin Bush Couplings, Star Spider Couplings, Tyre Couplings, V-Belt Pulleys and Hand Wheels by Balaji Metal Rajkot." 
        keywords="industrial couplings, pin bush coupling, jaw spider coupling, tyre coupling, v belt pulleys, taper lock bush, rajkot power transmission foundry"
      />

      <section className="relative bg-slate-950 text-white pt-28 pb-20 lg:pt-32 lg:pb-24 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero/products-hero.jpg" 
            alt="Balaji Metal Precision Industrial Transmission Products" 
            className="w-full h-full object-cover object-center filter brightness-[0.70] contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/40 to-slate-950/80" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(2,6,23,0.75)_100%)]" />
        </div>

        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-orange-500/20 blur-[130px] rounded-full pointer-events-none z-1" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Breadcrumb 
              items={[{ label: 'Product Catalog', href: '/products' }]} 
              theme="dark"
            />
          </motion.div>

          <motion.div 
            className="text-center max-w-4xl mx-auto space-y-5 py-2"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
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
              Heavy-duty Pin Bush Couplings, Star Spider Couplings, V-Belt Pulleys, and custom power transmission components manufactured in Rajkot.
            </p>
          </motion.div>
        </div>
      </section>

      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20"
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-xl shadow-slate-300/40 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:flex-1">
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search products (e.g. Pin Bush, Star Bush, Pulley, Hand Wheel)..."
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

            <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 shrink-0 self-end sm:self-auto">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'grid' 
                    ? 'bg-white text-orange-600 shadow-xs' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Grid View"
              >
                <LayoutGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'list' 
                    ? 'bg-white text-orange-600 shadow-xs' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="List View"
              >
                <ListFilter size={18} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100 scrollbar-none">
            <button
              onClick={() => handleCategorySelect('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-2 ${
                activeCategory === 'all'
                  ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md shadow-orange-500/25'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200/80'
              }`}
            >
              <Sparkles size={14} />
              <span>All Products ({products.length})</span>
            </button>

            {categories.map((cat) => {
              const Icon = getCategoryIcon(cat.slug);
              const isSelected = activeCategory === cat.slug || String(activeCategory) === String(cat.id);
              const count = products.filter(p => p.category_slug === cat.slug || String(p.category_id) === String(cat.id)).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.slug || String(cat.id))}
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
      </motion.div>

      <motion.main 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
      >
        
        {/* Results Header Info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="text-xs sm:text-sm text-slate-600 font-medium flex items-center gap-2 flex-wrap">
            <span>Showing <strong className="text-slate-900 font-bold">{filteredProducts.length}</strong> products</span>
            {activeCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 text-xs font-bold">
                Category: {activeCategory}
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                Search: "{searchQuery}"
              </span>
            )}
          </div>

          {(searchQuery || activeCategory !== 'all') && (
            <button
              onClick={handleResetFilters}
              className="text-xs text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1 cursor-pointer underline"
            >
              <RefreshCw size={12} />
              <span>Reset all filters</span>
            </button>
          )}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/90 shadow-sm p-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center mx-auto">
              <Search size={28} />
            </div>
            <h3 className="text-xl font-heading font-black text-slate-900">
              No matching products found
            </h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
              We couldn't find any industrial products matching your criteria. Try adjusting your search keyword or category filter.
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

        {viewMode === 'list' && (
          <div className="space-y-4">
            {filteredProducts.map((product, index) => {
              const applications = product.applications || [];
              const primaryIndustry = applications[0]?.industry || 'Industrial Machinery';

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: index * 0.06 }}
                  onClick={() => setQuickSpecProduct(product)}
                  className="bg-white rounded-3xl border border-slate-200 hover:border-orange-400 p-5 sm:p-6 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row items-center gap-6 group cursor-pointer"
                >
                  <div 
                    className="w-full md:w-52 h-40 bg-slate-50 rounded-2xl border border-slate-100 p-4 flex items-center justify-center shrink-0 overflow-hidden"
                  >
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-contain filter drop-shadow-sm group-hover:scale-108 transition-transform duration-500"
                    />
                  </div>

                  <div className="flex-1 space-y-2.5 text-center md:text-left">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700 bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-full">
                        {product.category_name}
                      </span>
                    </div>

                    <h3 className="text-xl font-heading font-black text-slate-900 group-hover:text-orange-600 transition-colors">
                      {product.name}
                    </h3>

                    <p className="text-slate-600 text-xs sm:text-sm line-clamp-2 leading-relaxed font-medium">
                      {product.short_description}
                    </p>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs text-slate-500 pt-1">
                      <div className="flex items-center gap-1.5 text-slate-700 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                        <Building2 size={13} className="text-orange-600 shrink-0" />
                        <span>Used in: <strong>{primaryIndustry}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0 w-full md:w-44" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => navigate(`/contact?product=${encodeURIComponent(product.name)}`)}
                      className="w-full text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-orange-600/20"
                    >
                      <span>Get Quote</span>
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        <motion.section 
          className="mt-20 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 p-8 sm:p-12 relative overflow-hidden shadow-2xl shadow-slate-950/40"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.55 }}
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/35 text-orange-400 text-xs font-bold">
                <Cpu size={14} className="text-orange-400" />
                <span>Foundry & Heavy Precision Engineering</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-black text-white tracking-tight leading-tight">
                Need Custom Pilot Bores, Keyways or Casting as per Drawing?
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                We manufacture bespoke couplings and pulleys based on client 2D/3D mechanical drawings with ISO 1940 dynamic balancing, custom broaching (DIN 6885 / BS 4235), and rapid pan-India dispatch.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3 justify-center items-stretch sm:items-center lg:items-end">
              <Link to="/contact" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-sm shadow-xl shadow-orange-500/25 flex items-center justify-center gap-2.5 cursor-pointer hover:scale-105 transition-all">
                  <FileText size={18} />
                  <span>Submit Drawing / RFQ</span>
                </button>
              </Link>

              <a
                href={`https://wa.me/${waNumber}?text=Hello%20Balaji%20Metal,%20I%20have%20a%20technical%20drawing%20for%20a%20custom%20coupling/pulley.`}
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
        </motion.section>
      </motion.main>

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
