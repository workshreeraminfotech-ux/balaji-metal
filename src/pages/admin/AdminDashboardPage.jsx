import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, MessageSquareText, Layers, TrendingUp, 
  Plus, ArrowRight, Eye, Phone, Building2, CheckCircle2, 
  Clock, ShieldCheck, Sparkles, AlertCircle 
} from 'lucide-react';
import { storageService } from '@/utils/storageService';
import SEO from '@/components/ui/SEO';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';
import ProductFormModal from '@/components/admin/ProductFormModal';
import InquiryDetailModal from '@/components/admin/InquiryDetailModal';

export default function AdminDashboardPage() {
  const [products, setProducts] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const loadData = () => {
    setProducts(storageService.getProducts());
    setInquiries(storageService.getInquiries());
    setCategories(storageService.getCategories());
  };

  useEffect(() => {
    loadData();
    const unsubscribe = storageService.subscribe((detail) => {
      if (!detail?.type || detail.type === 'inquiries' || detail.type === 'products' || detail.type === 'categories' || detail.type === 'all') {
        loadData();
      }
    });
    return unsubscribe;
  }, []);

  const newInquiries = inquiries.filter(i => i.status === 'new');
  const recentInquiries = inquiries.slice(0, 5);

  const handleStatusChange = async (id, newStatus) => {
    await storageService.updateInquiryStatus(id, newStatus);
    loadData();
    if (selectedInquiry && String(selectedInquiry.id) === String(id)) {
      setSelectedInquiry({ ...selectedInquiry, status: newStatus });
    }
  };

  const handleSaveProduct = async (productData) => {
    await storageService.saveProduct(productData);
    loadData();
  };

  const statusBadges = {
    new: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    contacted: 'bg-amber-50 text-amber-700 border-amber-200',
    quoted: 'bg-blue-50 text-blue-700 border-blue-200',
    closed: 'bg-slate-100 text-slate-700 border-slate-200'
  };

  return (
    <div className="space-y-8 font-sans text-slate-900">
      <SEO title="Admin Dashboard | Balaji Metal" description="Overview of products, customer inquiries, and sales leads." />

      {/* Top Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-sm">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold">
            <Sparkles size={14} className="text-orange-600" />
            <span>Balaji Metal Foundry & Engineering</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-slate-900 tracking-tight">
            Welcome to Admin Control Center
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm font-medium max-w-xl">
            Manage your industrial transmission products catalog, view incoming customer quotations, and update company configurations.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button
            type="button"
            onClick={() => setIsProductModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs shadow-md shadow-orange-600/25 flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
          >
            <Plus size={16} />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────
          KPI METRIC CARDS - Clean White Cards
      ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Total Products */}
        <Link to="/admin/products" className="block group">
          <div className="bg-white border border-slate-200/90 hover:border-orange-500/80 rounded-3xl p-6 transition-all shadow-sm hover:shadow-md group-hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Products</span>
              <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
                <Package size={20} />
              </div>
            </div>
            <div className="text-3xl font-heading font-black text-slate-900 mt-3">
              {products.length}
            </div>
            <span className="text-[11px] text-slate-500 font-medium mt-1 block">
              Active in catalog & homepage
            </span>
          </div>
        </Link>

        {/* Total Inquiries */}
        <Link to="/admin/inquiries" className="block group">
          <div className="bg-white border border-slate-200/90 hover:border-orange-500/80 rounded-3xl p-6 transition-all shadow-sm hover:shadow-md group-hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Customer Inquiries</span>
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <MessageSquareText size={20} />
              </div>
            </div>
            <div className="text-3xl font-heading font-black text-slate-900 mt-3">
              {inquiries.length}
            </div>
            <span className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
              <Clock size={12} />
              <span>{newInquiries.length} New unread leads</span>
            </span>
          </div>
        </Link>

        {/* Categories */}
        <Link to="/admin/categories" className="block group">
          <div className="bg-white border border-slate-200/90 hover:border-orange-500/80 rounded-3xl p-6 transition-all shadow-sm hover:shadow-md group-hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Categories</span>
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Layers size={20} />
              </div>
            </div>
            <div className="text-3xl font-heading font-black text-slate-900 mt-3">
              {categories.length}
            </div>
            <span className="text-[11px] text-slate-500 font-medium mt-1 block">
              Couplings, Pulleys & Wheels
            </span>
          </div>
        </Link>

        {/* Quality System */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Quality Standard</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
          </div>
          <div className="text-xl font-heading font-black text-slate-900 mt-3">
            ISO 9001:2015
          </div>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">
            Dynamic Balancing ISO 1940
          </span>
        </div>

      </div>

      {/* ─────────────────────────────────────────────────────────
          RECENT CUSTOMER INQUIRIES - Clean White Table
      ───────────────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
          <div>
            <h2 className="text-lg font-heading font-black text-slate-900 flex items-center gap-2">
              <MessageSquareText size={20} className="text-orange-600" />
              <span>Recent Customer Inquiries & Leads</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Quotations and direct messages sent from the live website
            </p>
          </div>
          <Link
            to="/admin/inquiries"
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
          >
            <span>View All ({inquiries.length})</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {recentInquiries.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-sm">
            No customer inquiries yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="text-slate-500 uppercase tracking-wider text-[11px] border-b border-slate-100 bg-slate-50">
                  <th className="py-3 px-4 font-bold">Customer Name</th>
                  <th className="py-3 px-4 font-bold">Product Interest</th>
                  <th className="py-3 px-4 font-bold">Contact</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {recentInquiries.map((inq) => {
                  const cleanPhone = (inq.phone || '').replace(/[^0-9]/g, '');
                  const whatsappUrl = `https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(inq.name || '')},%20regarding%20your%20inquiry%20at%20Balaji%20Metal.`;

                  return (
                    <tr key={inq.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-4 font-bold text-slate-900">
                        <div>{inq.name}</div>
                        {inq.company_name && (
                          <div className="text-[11px] text-slate-500 font-normal">
                            {inq.company_name}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4 text-slate-700 font-medium">
                        <span className="text-orange-600 font-semibold">{inq.product_interest || inq.product_name || 'General Inquiry'}</span>
                        {inq.quantity && <span className="block text-[11px] text-slate-500">Qty: {inq.quantity}</span>}
                      </td>
                      <td className="py-4 px-4 text-slate-600 font-mono text-xs">
                        <div>{inq.phone || 'N/A'}</div>
                        <div className="text-[11px] text-slate-400">{inq.email || ''}</div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusBadges[inq.status] || statusBadges.new}`}>
                          {inq.status || 'New'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {inq.phone && (
                            <a
                              href={whatsappUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] transition-colors"
                              title="WhatsApp Chat"
                            >
                              <WhatsAppIcon size={15} fill="#25D366" />
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => setSelectedInquiry(inq)}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────
          QUICK PRODUCT CATALOG PREVIEW
      ───────────────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
          <div>
            <h2 className="text-lg font-heading font-black text-slate-900 flex items-center gap-2">
              <Package size={20} className="text-orange-600" />
              <span>Current Products Showcase</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Live products currently displayed to customers
            </p>
          </div>
          <Link
            to="/admin/products"
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
          >
            <span>Manage All Products</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => (
            <div key={p.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 p-2 shrink-0 flex items-center justify-center overflow-hidden shadow-2xs">
                <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <span className="text-[10px] font-bold text-orange-700 uppercase tracking-wider">
                  {p.category_name}
                </span>
                <h4 className="text-sm font-bold text-slate-900 truncate">
                  {p.name}
                </h4>
                <p className="text-[11px] text-slate-500 truncate">
                  {p.short_description || p.category_name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <ProductFormModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        product={null}
        onSave={handleSaveProduct}
      />

      <InquiryDetailModal
        isOpen={!!selectedInquiry}
        onClose={() => setSelectedInquiry(null)}
        inquiry={selectedInquiry}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
