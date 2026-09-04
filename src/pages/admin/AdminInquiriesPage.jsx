import React, { useState, useEffect } from 'react';
import { 
  MessageSquareText, Search, Filter, Download, 
  Trash2, Phone, Mail, Building2, Calendar, 
  ExternalLink, CheckCircle2, Clock 
} from 'lucide-react';
import { storageService } from '@/utils/storageService';
import SEO from '@/components/ui/SEO';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';
import InquiryDetailModal from '@/components/admin/InquiryDetailModal';

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  const loadData = () => {
    setInquiries(storageService.getInquiries());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = (id, newStatus) => {
    storageService.updateInquiryStatus(id, newStatus);
    loadData();
    if (selectedInquiry && selectedInquiry.id === id) {
      setSelectedInquiry({ ...selectedInquiry, status: newStatus });
    }
  };

  const handleDeleteInquiry = (id) => {
    storageService.deleteInquiry(id);
    setSelectedInquiry(null);
    loadData();
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Date', 'Customer Name', 'Company', 'Phone', 'Email', 'City', 'Product Interest', 'Quantity', 'Status', 'Message'];
    const rows = inquiries.map(i => [
      i.id,
      `"${new Date(i.created_at).toLocaleString()}"`,
      `"${i.name || ''}"`,
      `"${i.company_name || ''}"`,
      `"${i.phone || ''}"`,
      `"${i.email || ''}"`,
      `"${i.city || ''}"`,
      `"${i.product_interest || i.product_name || ''}"`,
      `"${i.quantity || ''}"`,
      `"${i.status || ''}"`,
      `"${(i.message || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `balaji_metal_inquiries_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter inquiries
  const filteredInquiries = inquiries.filter((inq) => {
    const matchesStatus = statusFilter === 'all' || inq.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || (
      inq.name?.toLowerCase().includes(q) ||
      inq.company_name?.toLowerCase().includes(q) ||
      inq.phone?.toLowerCase().includes(q) ||
      inq.email?.toLowerCase().includes(q) ||
      inq.product_interest?.toLowerCase().includes(q) ||
      inq.message?.toLowerCase().includes(q)
    );
    return matchesStatus && matchesSearch;
  });

  const statusBadges = {
    new: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    contacted: 'bg-amber-50 text-amber-700 border-amber-200',
    quoted: 'bg-blue-50 text-blue-700 border-blue-200',
    closed: 'bg-slate-100 text-slate-700 border-slate-200'
  };

  return (
    <div className="space-y-6 font-sans text-slate-900">
      <SEO title="Inquiries & RFQ Leads | Balaji Metal Admin" description="Manage incoming customer inquiries and quotation requests." />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div>
          <h1 className="text-2xl font-heading font-black text-slate-900 flex items-center gap-2.5">
            <MessageSquareText size={24} className="text-orange-600" />
            <span>Customer Inquiries & RFQ Leads</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Real-time leads submitted by customers via Contact Form and Get Quote popups.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors border border-slate-300 shadow-xs"
        >
          <Download size={16} className="text-orange-600" />
          <span>Export to Excel (CSV)</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-xs">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name, phone, product..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-slate-900 placeholder-slate-400 text-xs focus:border-orange-500 focus:bg-white focus:outline-none"
          />
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {['all', 'new', 'contacted', 'quoted', 'closed'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-orange-600 text-white shadow-sm shadow-orange-600/20'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {st} {st === 'all' ? `(${inquiries.length})` : `(${inquiries.filter(i => i.status === st).length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Showing <strong className="text-slate-900">{filteredInquiries.length}</strong> Inquiries
          </span>
        </div>

        {filteredInquiries.length === 0 ? (
          <div className="text-center py-16 text-slate-500 text-sm">
            No inquiries matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="text-slate-500 uppercase tracking-wider text-[11px] border-b border-slate-100 bg-slate-50">
                  <th className="py-3.5 px-6 font-bold">Date & Customer</th>
                  <th className="py-3.5 px-4 font-bold">Product Interest</th>
                  <th className="py-3.5 px-4 font-bold">Contact Info</th>
                  <th className="py-3.5 px-4 font-bold">Status</th>
                  <th className="py-3.5 px-6 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {filteredInquiries.map((inq) => {
                  const cleanPhone = (inq.phone || '').replace(/[^0-9]/g, '');
                  const whatsappUrl = `https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(inq.name || '')},%20we%20received%20your%20quotation%20request%20for%20${encodeURIComponent(inq.product_interest || inq.product_name || 'Balaji Metal products')}.`;

                  return (
                    <tr key={inq.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Customer & Date */}
                      <td className="py-4 px-6">
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                            <Calendar size={11} />
                            <span>{new Date(inq.created_at).toLocaleDateString()}</span>
                          </span>
                          <h3 className="font-bold text-slate-900 text-sm">
                            {inq.name}
                          </h3>
                          {inq.company_name && (
                            <p className="text-[11px] text-orange-700 font-medium truncate">
                              {inq.company_name}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Product Interest */}
                      <td className="py-4 px-4 text-slate-700">
                        <div className="font-semibold text-slate-900 truncate max-w-xs">
                          {inq.product_interest || inq.product_name || 'General Inquiry'}
                        </div>
                        {inq.quantity && (
                          <div className="text-[11px] text-slate-500">
                            Required Qty: <strong className="text-slate-700">{inq.quantity}</strong>
                          </div>
                        )}
                      </td>

                      {/* Phone & Email */}
                      <td className="py-4 px-4 text-slate-600 font-mono text-xs">
                        <div className="flex items-center gap-1.5">
                          <Phone size={12} className="text-orange-600" />
                          <a href={`tel:${inq.phone}`} className="hover:underline">
                            {inq.phone || 'N/A'}
                          </a>
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
                          {inq.email || ''}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <select
                          value={inq.status || 'new'}
                          onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border cursor-pointer focus:outline-none ${statusBadges[inq.status] || statusBadges.new}`}
                        >
                          <option value="new">New Lead</option>
                          <option value="contacted">Contacted</option>
                          <option value="quoted">Quoted</option>
                          <option value="closed">Closed</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {inq.phone && (
                            <a
                              href={whatsappUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] transition-colors"
                              title="Chat on WhatsApp"
                            >
                              <WhatsAppIcon size={16} fill="#25D366" />
                            </a>
                          )}

                          <button
                            type="button"
                            onClick={() => setSelectedInquiry(inq)}
                            className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                          >
                            View Details
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

      {/* Inquiry Detail Modal */}
      <InquiryDetailModal
        isOpen={!!selectedInquiry}
        onClose={() => setSelectedInquiry(null)}
        inquiry={selectedInquiry}
        onStatusChange={handleStatusChange}
        onDelete={handleDeleteInquiry}
      />
    </div>
  );
}
