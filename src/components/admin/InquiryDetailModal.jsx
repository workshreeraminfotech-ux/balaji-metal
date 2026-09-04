import React from 'react';
import { 
  X, Phone, Mail, Building2, MapPin, 
  Package, Calendar, MessageSquare, Check, Trash2 
} from 'lucide-react';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';

export default function InquiryDetailModal({ isOpen, onClose, inquiry, onStatusChange, onDelete }) {
  if (!isOpen || !inquiry) return null;

  const cleanPhone = (inquiry.phone || '').replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(inquiry.name || 'Sir')},%20we%20received%20your%20quotation%20inquiry%20regarding%20${encodeURIComponent(inquiry.product_interest || inquiry.product_name || 'Balaji Metal products')}.`;

  const statusColors = {
    new: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    contacted: 'bg-amber-50 text-amber-700 border-amber-200',
    quoted: 'bg-blue-50 text-blue-700 border-blue-200',
    closed: 'bg-slate-100 text-slate-700 border-slate-200'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-900/50 backdrop-blur-xs">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden z-10 text-slate-900 font-sans">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${statusColors[inquiry.status] || statusColors.new}`}>
              Status: {inquiry.status || 'New'}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Inquiry #{inquiry.id}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-200/60 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6 text-sm">
          
          {/* Customer Info Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-lg font-heading font-black text-slate-900">
                  {inquiry.name}
                </h3>
                {inquiry.company_name && (
                  <p className="text-xs text-orange-700 font-bold flex items-center gap-1.5 mt-0.5">
                    <Building2 size={13} />
                    <span>{inquiry.company_name}</span>
                  </p>
                )}
              </div>
              <div className="text-xs text-slate-500 font-mono flex items-center gap-1.5">
                <Calendar size={13} />
                <span>{new Date(inquiry.created_at).toLocaleString()}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <Phone size={14} className="text-orange-600 shrink-0" />
                <a href={`tel:${inquiry.phone}`} className="hover:underline font-mono">
                  {inquiry.phone || 'N/A'}
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Mail size={14} className="text-orange-600 shrink-0" />
                <a href={`mailto:${inquiry.email}`} className="hover:underline truncate">
                  {inquiry.email || 'N/A'}
                </a>
              </div>
              {inquiry.city && (
                <div className="flex items-center gap-2 text-slate-700">
                  <MapPin size={14} className="text-orange-600 shrink-0" />
                  <span>City: {inquiry.city}</span>
                </div>
              )}
            </div>
          </div>

          {/* Product Requested */}
          <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 space-y-1.5">
            <span className="text-[11px] font-bold text-orange-800 uppercase tracking-wider block">
              Requested Product / Interest:
            </span>
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <Package size={18} className="text-orange-600 shrink-0" />
              <span>{inquiry.product_interest || inquiry.product_name || 'General Inquiries & Pricing'}</span>
            </div>
            {inquiry.quantity && (
              <span className="text-xs text-slate-700 block font-medium">
                Quantity Required: <strong>{inquiry.quantity}</strong>
              </span>
            )}
          </div>

          {/* Customer Message */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Customer Message / Requirements:
            </span>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
              {inquiry.message || 'No additional message provided.'}
            </div>
          </div>

          {/* Status Changer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">Change Status:</span>
              <select
                value={inquiry.status || 'new'}
                onChange={(e) => onStatusChange(inquiry.id, e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="new">New Lead</option>
                <option value="contacted">Contacted</option>
                <option value="quoted">Quoted / RFQ Sent</option>
                <option value="closed">Closed / Won</option>
              </select>
            </div>

            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(inquiry.id)}
                className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Trash2 size={14} />
                <span>Delete Inquiry</span>
              </button>
            )}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-3">
          {inquiry.phone && (
            <a
              href={`tel:${inquiry.phone}`}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-200/80 hover:bg-slate-300 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Phone size={15} />
              <span>Call Customer</span>
            </a>
          )}

          {inquiry.phone && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md shadow-green-600/20"
            >
              <WhatsAppIcon size={15} fill="#ffffff" />
              <span>Reply on WhatsApp</span>
            </a>
          )}
        </div>

      </div>
    </div>
  );
}
