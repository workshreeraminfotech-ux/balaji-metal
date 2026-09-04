import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from '@/components/ui/SEO';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import QuoteModal from '@/components/products/QuoteModal';
import { 
  CheckCircle2, MessageSquare, PhoneCall, ShieldCheck, 
  ArrowRight, FileText, ChevronRight, Award, Cpu, 
  Layers, Gauge, Sparkles, Disc, CircleDot, Settings,
  Check, Maximize2, X
} from 'lucide-react';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '@/hooks/useSettings';
import { storageService } from '@/utils/storageService';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { settings: companySettings } = useSettings();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modals & Interactive states
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [selectedSizeForQuote, setSelectedSizeForQuote] = useState('');
  const [activeTab, setActiveTab] = useState('specs');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = () => {
      setLoading(true);
      try {
        const item = storageService.getProductBySlug(slug);
        if (item) {
          setProduct(item);
          setSelectedImage(item.image || (item.gallery && item.gallery[0]) || '/images/products/pin-bush-coupling/pin-bush-coupling-01.jpeg');
          setError(null);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error(err);
        setError('Product not found');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const unsubscribe = storageService.subscribe((detail) => {
      if (!detail?.type || detail.type === 'products' || detail.type === 'all') {
        fetchProduct();
      }
    });

    return unsubscribe;
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 pt-28 pb-20 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <Skeleton variant="image" className="w-full aspect-square rounded-3xl bg-slate-200" />
          </div>
          <div className="lg:col-span-7 space-y-6">
            <Skeleton variant="text" className="w-1/3 h-6 bg-slate-200" />
            <Skeleton variant="text" className="w-3/4 h-12 bg-slate-200" />
            <Skeleton variant="text" className="w-full h-32 bg-slate-200" />
            <Skeleton variant="card" className="w-full h-48 bg-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-900 p-4 pt-20">
        <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mb-4">
          <ShieldCheck size={32} />
        </div>
        <h2 className="text-3xl font-heading font-black text-slate-900 mb-2">Product Not Found</h2>
        <p className="text-slate-600 mb-6 text-center max-w-md">
          {error || "The requested industrial transmission product could not be located in our active manufacturing catalog."}
        </p>
        <Link to="/products">
          <Button className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-3 rounded-xl shadow-md cursor-pointer">
            Explore All Products
          </Button>
        </Link>
      </div>
    );
  }

  const imageSrc = selectedImage || product.image || (Array.isArray(product.gallery) && product.gallery[0]) || '/images/products/pin-bush-coupling.jpg';

  const features = Array.isArray(product.features) ? product.features : [];
  const specifications = Array.isArray(product.specifications) 
    ? product.specifications 
    : (typeof product.specifications === 'object' && product.specifications !== null 
        ? Object.entries(product.specifications).map(([key, value]) => ({ key, value })) 
        : []);
  const applications = Array.isArray(product.applications) ? product.applications : [];
  const sizes = Array.isArray(product.available_sizes) ? product.available_sizes : [];

  const galleryImages = [
    imageSrc,
    ...(Array.isArray(product.gallery) ? product.gallery : [])
  ].filter((v, i, a) => v && a.indexOf(v) === i);

  const relatedProducts = storageService.getProducts().filter(p => p.slug !== slug).slice(0, 3);

  const handleSizeSelectForQuote = (sizeName) => {
    setSelectedSizeForQuote(sizeName);
    setIsQuoteOpen(true);
  };

  const dynamicWhatsApp = (companySettings.whatsapp || companySettings.company_whatsapp || '917600060193').replace('+', '');
  const whatsappMessage = `Hello Balaji Metal Team,\nI would like to request an official quotation for *${product.name}* ${selectedSizeForQuote ? `(Size: ${selectedSizeForQuote})` : ''}.\nPlease share technical datasheet, CAD drawing, and price quotation.`;
  const whatsappUrl = `https://wa.me/${dynamicWhatsApp}?text=${encodeURIComponent(whatsappMessage)}`;

  // Derive key parameters for metric cards
  const boreSpec = specifications.find(s => s.key.toLowerCase().includes('bore'))?.value || '12 mm – 160 mm';
  const torqueSpec = specifications.find(s => s.key.toLowerCase().includes('torque') || s.key.toLowerCase().includes('rating'))?.value || 'Up to 15,000 Nm';
  const speedSpec = specifications.find(s => s.key.toLowerCase().includes('speed') || s.key.toLowerCase().includes('rpm'))?.value || '1,500 – 4,000 RPM';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-24 pb-24">
      <SEO 
        title={`${product.name} | Precision Industrial Transmission | Balaji Metal`} 
        description={product.short_description || `Technical specifications, ISO 1940 dynamic balancing, and sizing details for ${product.name} manufactured by Balaji Metal Rajkot.`} 
        keywords={`${product.name}, pin bush coupling, star bush coupling, rajkot power transmission, industrial coupling specs`}
      />
      
      {/* ─────────────────────────────────────────────────────────
          1. BREADCRUMB & STATUS BAR
      ───────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <Breadcrumb 
            items={[
              { label: 'Product Catalog', href: '/products' },
              { label: product.category_name || 'Transmission Components', href: `/products?category=${product.category_slug || 'all'}` },
              { label: product.name, href: '#' }
            ]} 
          />

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Direct Foundry Dispatch</span>
            </span>
            <span className="text-slate-400">|</span>
            <span className="text-orange-700 font-bold">ISO 1940 Balancing</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* ─────────────────────────────────────────────────────────
            2. PRODUCT TOP SHOWCASE STAGE
        ───────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start mb-16">
          
          {/* Left Column: Image Showcase (5 cols) */}
          <motion.div 
            className="lg:col-span-5 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xl shadow-slate-200/60 relative overflow-hidden group">
              {/* Product Visual Container */}
              <div 
                className="aspect-square flex items-center justify-center relative bg-gradient-to-b from-slate-50 via-slate-50/70 to-slate-100/60 rounded-2xl p-6 border border-slate-100 cursor-zoom-in overflow-hidden"
                onClick={() => setIsLightboxOpen(true)}
              >
                <img 
                  src={imageSrc} 
                  alt={product.name} 
                  className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-108 transition-transform duration-500"
                />

                {/* Lightbox hint badge */}
                <div className="absolute bottom-3 right-3 p-2 rounded-xl bg-white/90 backdrop-blur-md text-slate-700 border border-slate-200 shadow-sm opacity-80 group-hover:opacity-100 transition-opacity">
                  <Maximize2 size={16} />
                </div>
              </div>

              {/* Gallery Thumbnails Strip (Showing all photoshoot images) */}
              {galleryImages.length > 1 && (
                <div className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Product Photos ({galleryImages.length})
                    </span>
                    <span className="text-[10px] text-orange-600 font-bold">
                      Click to switch
                    </span>
                  </div>
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                    {galleryImages.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedImage(img)}
                        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl p-1.5 bg-slate-50 border-2 transition-all shrink-0 cursor-pointer overflow-hidden ${
                          imageSrc === img 
                            ? 'border-orange-500 shadow-md shadow-orange-500/20 ring-2 ring-orange-500/20 bg-white' 
                            : 'border-slate-200 hover:border-slate-300 opacity-75 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt={`${product.name} view ${idx + 1}`} className="w-full h-full object-contain" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quality & Metallurgy Badges */}
              <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3 text-center">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="block text-[10px] text-slate-500 uppercase font-bold">Balancing Standard</span>
                  <span className="text-xs font-black text-orange-600">ISO 1940 G6.3</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="block text-[10px] text-slate-500 uppercase font-bold">Metallurgy Grade</span>
                  <span className="text-xs font-black text-slate-800">FG 220 / FG 250</span>
                </div>
              </div>
            </div>

            {/* Quality Assurance Strip */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-emerald-600 shrink-0" />
                <span className="font-semibold text-slate-800">100% Ultrasonic & Dimensional Tested</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">MTC Available</span>
            </div>
          </motion.div>

          {/* Right Column: Key Details & Quotation Trigger (7 cols) */}
          <motion.div 
            className="lg:col-span-7 space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Category & Status Badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold uppercase tracking-wider">
                {product.category_name || fallbackData.category_name || 'Power Transmission'}
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold font-mono">
                Model: {product.slug?.toUpperCase()}
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-600" />
                <span>Ready Stock & Custom Dispatch</span>
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-slate-900 tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Description */}
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-normal">
              {product.description || product.short_description || fallbackData.description}
            </p>

            {/* Key Engineering Parameter Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Bore Range</span>
                <p className="text-xs sm:text-sm font-black text-slate-900 truncate">{boreSpec}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Torque Capacity</span>
                <p className="text-xs sm:text-sm font-black text-orange-600 truncate">{torqueSpec}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Rated Speed</span>
                <p className="text-xs sm:text-sm font-black text-slate-900 truncate">{speedSpec}</p>
              </div>
            </div>

            {/* Action Buttons Deck */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row gap-3">
                <a 
                  href={whatsappUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full sm:flex-1"
                >
                  <Button 
                    size="lg" 
                    className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-emerald-500/25 border-0 flex items-center justify-center gap-2.5 text-sm sm:text-base cursor-pointer hover:scale-[1.02] transition-all"
                  >
                    <WhatsAppIcon size={20} fill="#ffffff" />
                    <span>Instant WhatsApp RFQ</span>
                  </Button>
                </a>

                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={() => setIsQuoteOpen(true)}
                  className="w-full sm:flex-1 bg-white border-slate-300 hover:border-orange-500 text-slate-800 py-4 px-6 rounded-2xl flex items-center justify-center gap-2 text-sm sm:text-base font-bold shadow-xs cursor-pointer transition-all"
                >
                  <FileText size={18} className="text-orange-600" />
                  <span>Request Custom Quote</span>
                </Button>
              </div>

              <div className="flex items-center justify-between pt-1">
                <a 
                  href={`tel:${companySettings.phones?.[0]?.raw || companySettings.primary_phone || '+917600060193'}`}
                  className="text-xs font-bold text-slate-600 hover:text-orange-600 flex items-center gap-1.5 transition-colors"
                >
                  <PhoneCall size={14} className="text-emerald-600" />
                  <span>Call Technical Support: {companySettings.primary_phone || companySettings.phones?.[0]?.display || '+91-76000 60193'}</span>
                </a>

                <span className="text-xs text-slate-400 font-medium">Pan-India Transport Available</span>
              </div>
            </div>

          </motion.div>
        </div>

        {/* ─────────────────────────────────────────────────────────
            3. TECHNICAL DATA & SPECIFICATION TABS
        ───────────────────────────────────────────────────────── */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 mb-16 shadow-xl shadow-slate-200/50">
          {/* Tab Navigation */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-slate-100 scrollbar-none">
            {[
              { id: 'specs', label: 'Technical Specifications' },
              { id: 'sizes', label: `Standard Sizing (${sizes.length})` },
              { id: 'features', label: 'Engineering Features' },
              { id: 'applications', label: 'Industrial Applications' },
              { id: 'custom', label: 'Custom Bores & Drawings' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md shadow-orange-500/25'
                    : 'bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab 1: Specs Table */}
          {activeTab === 'specs' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <div>
                  <h3 className="text-xl font-heading font-black text-slate-900">Engineering Parameters & Tolerances</h3>
                  <p className="text-xs text-slate-500 font-medium">Precision machined as per IS / DIN dimensional standards.</p>
                </div>
                <button
                  onClick={() => setIsQuoteOpen(true)}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Need custom bore or keyway tolerances?</span>
                </button>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200">
                <table className="w-full text-left text-sm text-slate-800">
                  <thead className="bg-slate-100 text-xs uppercase text-slate-700 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 font-bold">Parameter / Specification</th>
                      <th className="px-6 py-4 font-bold">Standard Value / Metallurgy</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {specifications.map((spec, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors odd:bg-white even:bg-slate-50/60">
                        <td className="px-6 py-4 font-bold text-slate-900">{spec.key || spec.spec_key}</td>
                        <td className="px-6 py-4 font-mono font-semibold text-orange-700">{spec.value || spec.spec_value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 2: Available Sizes Matrix */}
          {activeTab === 'sizes' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <div>
                  <h3 className="text-xl font-heading font-black text-slate-900">Standard Manufacturing Range</h3>
                  <p className="text-xs text-slate-500 font-medium">Click on any size below to request an instant quotation for that exact dimension.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {sizes.map((size, i) => (
                  <button
                    key={i}
                    onClick={() => handleSizeSelectForQuote(size)}
                    className="p-4 rounded-2xl bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-400 transition-all flex flex-col justify-between items-start text-left group shadow-xs cursor-pointer"
                  >
                    <span className="text-xs font-mono text-slate-400 font-bold group-hover:text-orange-500">#{i + 1}</span>
                    <span className="text-sm font-black text-slate-900 group-hover:text-orange-600 py-2">{size}</span>
                    <span className="text-[11px] font-bold text-orange-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>Get Quote</span>
                      <ChevronRight size={12} />
                    </span>
                  </button>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                <span>Looking for a non-standard bore size or specialized hub length? We cast and machine custom sizes on request.</span>
                <button 
                  onClick={() => setIsQuoteOpen(true)}
                  className="font-bold text-orange-700 hover:underline cursor-pointer shrink-0 ml-4"
                >
                  Custom Sizing RFQ
                </button>
              </div>
            </div>
          )}

          {/* Tab 3: Features */}
          {activeTab === 'features' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-heading font-black text-slate-900">Design & Metallurgical Advantages</h3>
                <p className="text-xs text-slate-500 font-medium">Engineered for maximum power transmission reliability and low maintenance.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((feat, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3.5">
                    <div className="p-2 rounded-xl bg-orange-100 text-orange-600 shrink-0">
                      <CheckCircle2 size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">{feat}</h4>
                      <p className="text-xs text-slate-500 mt-1 font-medium">Conforms to industrial high-torque continuous drive standards.</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Applications */}
          {activeTab === 'applications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-heading font-black text-slate-900">Industrial Uses & Machine Setups</h3>
                <p className="text-xs text-slate-500 font-medium">Proven performance across diverse heavy industrial drive environments.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {applications.map((app, i) => (
                  <div key={i} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                    <span className="text-[10px] uppercase font-bold text-orange-700 bg-orange-100 border border-orange-200 px-3 py-1 rounded-full">
                      {app.industry || 'Heavy Industry'}
                    </span>
                    <h4 className="text-base font-bold text-slate-900 pt-1 leading-snug">{app.application || app}</h4>
                    <p className="text-xs text-slate-500 font-medium">Continuous duty, shock dampening & thermal resistance guaranteed.</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 5: Custom Bores & Drawings */}
          {activeTab === 'custom' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-heading font-black text-slate-900">Custom Pilot Bores, Keyways & Foundry Castings</h3>
                <p className="text-xs text-slate-500 font-medium">Direct foundry manufacturing matching your exact CAD drawings and specs.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                    <Cpu size={20} />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Custom Pilot Bore & Keyway</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Precision turned pilot bores and high-precision broaching conforming to DIN 6885, BS 4235, or US inch standard keyways.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                    <Award size={20} />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Dynamic Balancing ISO 1940</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    State-of-the-art dual plane computerized dynamic balancing ensuring minimal vibration up to 4,000 RPM.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                    <FileText size={20} />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">CAD Drawing RFQ</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Upload your 2D PDF or 3D STEP/DWG drawings for fast manufacturing feasibility review and quotation within 24 hours.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Link to="/contact">
                  <button className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs transition-colors">
                    <FileText size={15} className="text-orange-400" />
                    <span>Submit Technical Drawing</span>
                  </button>
                </Link>

                <a
                  href={`https://wa.me/${dynamicWhatsApp}?text=Hello%20Balaji%20Metal,%20I%20have%20a%20drawing%20for%20a%20custom%20${encodeURIComponent(product.name)}.`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <button className="px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs transition-colors">
                    <WhatsAppIcon size={16} fill="#ffffff" />
                    <span>Discuss on WhatsApp</span>
                  </button>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* ─────────────────────────────────────────────────────────
            4. RELATED PRODUCTS GRID
        ───────────────────────────────────────────────────────── */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-heading font-black text-slate-900">Related Power Transmission Spares</h3>
              <p className="text-xs text-slate-500 font-medium">Complementary couplings, pulleys and transmission accessories.</p>
            </div>
            <Link to="/products" className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1">
              <span>View All Catalog</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((rel, idx) => (
              <div 
                key={idx}
                className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-orange-300 hover:shadow-lg transition-all flex items-center gap-4 group shadow-xs"
              >
                <div className="w-20 h-20 rounded-2xl bg-slate-50 p-2 shrink-0 flex items-center justify-center border border-slate-100">
                  <img src={rel.image} alt={rel.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-orange-600">{rel.category_name}</span>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                    <Link to={`/products/${rel.slug}`}>{rel.name}</Link>
                  </h4>
                  <Link to={`/products/${rel.slug}`} className="text-xs font-bold text-orange-600 hover:underline inline-flex items-center gap-0.5 pt-1">
                    <span>Inspect Specs</span>
                    <ChevronRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-md p-4"
            onClick={() => setIsLightboxOpen(false)}
          >
            <button 
              className="absolute top-5 right-5 p-2.5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
              onClick={() => setIsLightboxOpen(false)}
            >
              <X size={24} />
            </button>
            <motion.img
              src={imageSrc}
              alt={product.name}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="max-w-full max-h-[85vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quote Modal */}
      {isQuoteOpen && (
        <QuoteModal
          isOpen={isQuoteOpen}
          onClose={() => {
            setIsQuoteOpen(false);
            setSelectedSizeForQuote('');
          }}
          productName={product.name}
          selectedSize={selectedSizeForQuote}
        />
      )}
    </div>
  );
}
