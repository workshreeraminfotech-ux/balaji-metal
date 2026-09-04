import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useInquiries } from '@/hooks/useInquiries';
import toast from 'react-hot-toast';
import { PhoneCall, MessageSquare, Send, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';

export default function QuoteModal({ isOpen, onClose, productName = '', selectedSize = '' }) {
  const { settings } = useSettings();
  const { submitInquiry, loading, error, success } = useInquiries();
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    product_name: productName || '',
    size_or_bore: selectedSize || '',
    quantity: '10',
    message: ''
  });

  useEffect(() => {
    if (productName) {
      setFormData(prev => ({ 
        ...prev, 
        product_name: productName,
        size_or_bore: selectedSize || prev.size_or_bore 
      }));
    }
  }, [productName, selectedSize]);

  useEffect(() => {
    if (success) {
      toast.success('Inquiry submitted successfully! Our engineering team will contact you promptly.');
      onClose();
      setFormData({
        name: '',
        company: '',
        email: '',
        phone: '',
        product_name: '',
        size_or_bore: '',
        quantity: '10',
        message: ''
      });
    }
    if (error) {
      toast.error(error || 'Failed to submit inquiry.');
    }
  }, [success, error, onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullMessage = `Product: ${formData.product_name}\nSize/Bore: ${formData.size_or_bore || 'Standard'}\nQty: ${formData.quantity}\nRequirements: ${formData.message}`;
    await submitInquiry({
      name: formData.name,
      company: formData.company,
      email: formData.email,
      phone: formData.phone,
      product_name: formData.product_name,
      subject: `Quote Request for ${formData.product_name} (${formData.size_or_bore || 'Standard'})`,
      message: fullMessage
    });
  };

  const handleWhatsAppRedirect = () => {
    const waNumber = (settings.whatsapp_number || settings.company_whatsapp || settings.whatsapp || '917600060193').replace('+', '');
    const waText = `Hello Balaji Metal Team,\nI would like to request an official quotation:\n• Product: ${formData.product_name || productName || 'Industrial Component'}\n• Size/Bore: ${formData.size_or_bore || selectedSize || 'As per standard'}\n• Quantity: ${formData.quantity || '10'} pcs\n• Name: ${formData.name || 'Buyer'}\n• Company: ${formData.company || 'Industrial Client'}\n• Requirements: ${formData.message || 'Please share price & dispatch lead time.'}`;
    const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`;
    window.open(url, '_blank');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Request Engineering Quotation" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Banner */}
        <div className="p-3.5 bg-orange-50/80 border border-orange-200/80 rounded-2xl flex items-center justify-between text-xs text-orange-950 font-medium">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-orange-600 shrink-0" />
            <span>Direct Manufacturer Quote with ISO 1940 Dynamic Balancing & MTC report.</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
            <Input 
              name="name" 
              placeholder="e.g. Rajesh Sharma" 
              value={formData.name} 
              onChange={handleChange} 
              required 
              className="bg-slate-50 border-slate-300 rounded-xl text-sm" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Company / Industry Name</label>
            <Input 
              name="company" 
              placeholder="e.g. Apex Engineering Ltd." 
              value={formData.company} 
              onChange={handleChange} 
              className="bg-slate-50 border-slate-300 rounded-xl text-sm" 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Phone / WhatsApp Number *</label>
            <Input 
              type="tel" 
              name="phone" 
              placeholder="+91 98765 43210" 
              value={formData.phone} 
              onChange={handleChange} 
              required 
              className="bg-slate-50 border-slate-300 rounded-xl text-sm" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
            <Input 
              type="email" 
              name="email" 
              placeholder="purchases@company.com" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              className="bg-slate-50 border-slate-300 rounded-xl text-sm" 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">Product Name</label>
            <Input 
              name="product_name" 
              value={formData.product_name} 
              onChange={handleChange} 
              readOnly={!!productName} 
              className="bg-slate-100 border-slate-300 font-bold rounded-xl text-sm text-slate-900" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Required Quantity</label>
            <Input 
              type="number" 
              name="quantity" 
              min="1" 
              placeholder="10" 
              value={formData.quantity} 
              onChange={handleChange} 
              className="bg-slate-50 border-slate-300 rounded-xl text-sm" 
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Target Size / Bore / Bush Code</label>
          <Input 
            name="size_or_bore" 
            placeholder="e.g. Size FBP-200, Bore 45mm, or DIN Keyway" 
            value={formData.size_or_bore} 
            onChange={handleChange} 
            className="bg-slate-50 border-slate-300 rounded-xl text-sm" 
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Additional Requirements / Notes</label>
          <Input 
            type="textarea" 
            name="message" 
            placeholder="Specify pilot bore requirement, DIN 6885 keyway, operating RPM, target delivery location, etc." 
            value={formData.message} 
            onChange={handleChange} 
            rows={3} 
            className="bg-slate-50 border-slate-300 rounded-xl text-sm" 
          />
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={handleWhatsAppRedirect}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] border border-[#25D366]/40 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <WhatsAppIcon size={16} fill="#25D366" />
            <span>Send Direct on WhatsApp</span>
          </button>

          <div className="flex gap-2 w-full sm:w-auto justify-end">
            <Button 
              variant="ghost" 
              type="button" 
              onClick={onClose} 
              className="text-slate-600 hover:bg-slate-100 font-semibold text-xs px-4"
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit" 
              loading={loading} 
              className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-orange-500/20 cursor-pointer"
            >
              <Send size={14} />
              <span>Submit Formal RFQ</span>
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
