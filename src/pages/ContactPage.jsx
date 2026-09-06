import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SEO from '@/components/ui/SEO';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useInquiries } from '@/hooks/useInquiries';
import { 
  Phone, Mail, MapPin, Clock, Send, MessageSquare, 
  CheckCircle2, ShieldCheck, ArrowRight, Building, 
  Sparkles, FileText, ChevronRight, PackageCheck
} from 'lucide-react';
import WhatsAppIcon from '@/components/ui/WhatsAppIcon';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useSettings } from '@/hooks/useSettings';

export default function ContactPage() {
  const { settings } = useSettings();
  const [searchParams] = useSearchParams();
  const productParam = searchParams.get('product') || '';
  const { submitInquiry, loading } = useInquiries();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: productParam ? `Quote: ${productParam}` : 'Request Quotation',
    message: productParam ? `Hello, I would like to get a price quotation and delivery timeline for ${productParam}.` : ''
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (productParam) {
      setFormData(prev => ({
        ...prev,
        subject: `Quote: ${productParam}`,
        message: prev.message || `Hello, I would like to get a price quotation and delivery timeline for ${productParam}.`
      }));
    }
  }, [productParam]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitInquiry(formData);
    toast.success('Inquiry received! Our sales engineer will get back to you shortly.');
    setSubmitted(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      subject: productParam ? `Quote: ${productParam}` : 'Request Quotation',
      message: ''
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      <SEO 
        title="Contact Us | Balaji Metal - Direct Quotations & Factory Support" 
        description="Contact Balaji Metal for heavy-duty couplings, pulleys, and custom castings quotations. Phone: +91-76000 60193 | Veraval, Rajkot, Gujarat." 
      />
      
      {/* Dynamic Hero Banner with Industrial Background Image */}
      <section className="relative bg-slate-950 text-white pt-28 pb-16 lg:pt-32 lg:pb-20 overflow-hidden border-b border-slate-800">
        {/* Background Image with Clear Visibility */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero/contact-hero.jpg" 
            alt="Balaji Metal Technical & Quotations Team" 
            className="w-full h-full object-cover object-center"
          />
          {/* Subtle cinematic gradient for clear background visibility + text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-slate-950/60" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb on top left */}
          <div className="mb-8">
            <Breadcrumb 
              items={[{ label: 'Contact Us', href: '/contact' }]} 
              theme="dark"
            />
          </div>

          {/* Centered Hero Content */}
          <div className="text-center max-w-3xl mx-auto space-y-4 py-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950/70 border border-orange-500/40 text-orange-400 text-xs font-bold backdrop-blur-md shadow-lg">
              <MessageSquare size={14} className="text-orange-400" />
              <span>Fast Turnaround Quotations</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black tracking-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
              Get In <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500">Touch</span>
            </h1>

            <p className="text-slate-200 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] font-medium">
              Reach out to our technical team for product quotations, custom bore inquiries, or bulk orders.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Form Side (7 cols) - Clean White Card */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50 space-y-6"
          >
            <div>
              <h2 className="text-2xl sm:text-3xl font-heading font-black text-slate-900 mb-2">
                Request a Quick Quote
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Fill out your requirement below and we will respond with an official quotation.
              </p>
            </div>

            {productParam && (
              <div className="p-3.5 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-between gap-3 text-orange-900 text-xs sm:text-sm font-semibold">
                <div className="flex items-center gap-2">
                  <PackageCheck size={18} className="text-orange-600 shrink-0" />
                  <span>Selected Product: <strong className="font-black text-slate-900">{productParam}</strong></span>
                </div>
                <span className="text-[11px] font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-md">RFQ Active</span>
              </div>
            )}

            {submitted && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-800 text-sm font-semibold">
                <CheckCircle2 size={20} className="shrink-0 text-emerald-600" />
                <span>Thank you! Your message has been received. We will contact you shortly.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name *</label>
                  <Input 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                    placeholder="e.g. Rajesh Kumar"
                    className="bg-slate-50 border-slate-300 text-slate-900 rounded-xl py-3 focus:border-orange-500 text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address *</label>
                  <Input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                    placeholder="e.g. rajesh@company.com"
                    className="bg-slate-50 border-slate-300 text-slate-900 rounded-xl py-3 focus:border-orange-500 text-sm font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Phone / Mobile Number *</label>
                  <Input 
                    type="tel" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    required 
                    placeholder="e.g. +91 98765 43210"
                    className="bg-slate-50 border-slate-300 text-slate-900 rounded-xl py-3 focus:border-orange-500 text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Company / Firm Name</label>
                  <Input 
                    name="company" 
                    value={formData.company} 
                    onChange={handleChange} 
                    placeholder="e.g. Apex Engineering Works"
                    className="bg-slate-50 border-slate-300 text-slate-900 rounded-xl py-3 focus:border-orange-500 text-sm font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Requirement / Subject</label>
                <Input 
                  type="select" 
                  name="subject" 
                  value={formData.subject} 
                  onChange={handleChange}
                  className="bg-slate-50 border-slate-300 text-slate-900 rounded-xl py-3 focus:border-orange-500 text-sm font-semibold focus:bg-white"
                >
                  <option value="Request Quotation" className="text-slate-900 bg-white">Request Quotation (Price & Availability)</option>
                  <option value="Pin Bush Coupling Inquiry" className="text-slate-900 bg-white">Pin Bush Coupling Inquiry</option>
                  <option value="Star Spider Coupling Inquiry" className="text-slate-900 bg-white">Star Spider Coupling Inquiry</option>
                  <option value="V-Belt Pulley Sizing & Supply" className="text-slate-900 bg-white">V-Belt Pulley Sizing & Supply</option>
                  <option value="Hand Wheel Inquiry" className="text-slate-900 bg-white">Hand Wheel Inquiry</option>
                  <option value="Custom Castings & Drawing Match" className="text-slate-900 bg-white">Custom Castings & Drawing Match</option>
                  <option value="Other" className="text-slate-900 bg-white">Other Query</option>
                </Input>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Details (Bore, Quantity, Size) *</label>
                <Input 
                  type="textarea" 
                  name="message" 
                  value={formData.message} 
                  onChange={handleChange} 
                  rows={4} 
                  required 
                  placeholder="Please specify model size, shaft diameter, groove type, and quantity required..."
                  className="bg-slate-50 border-slate-300 text-slate-900 rounded-xl py-3 focus:border-orange-500 text-sm font-medium"
                />
              </div>

              <Button 
                variant="primary" 
                size="default" 
                type="submit" 
                loading={loading} 
                className="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold py-2.5 sm:py-3.5 px-4 sm:px-6 text-sm sm:text-base rounded-xl shadow-md border-0 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send size={15} className="sm:w-4 sm:h-4" />
                <span>Submit Quotation Request</span>
              </Button>
            </form>
          </motion.div>

          {/* Info Side (5 cols) - Clean White Card */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }} 
            className="lg:col-span-5 space-y-6"
          >
            {/* Quick Contact Card */}
            <div className="bg-white border border-slate-200/90 p-8 rounded-3xl space-y-6 shadow-xl shadow-slate-200/50">
              <h3 className="text-xl font-heading font-black text-slate-900 border-b border-slate-100 pb-4">
                Factory & Contact Information
              </h3>

              <div className="space-y-5 text-sm">
                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 uppercase font-bold">Direct Hotline</span>
                    <a href={`tel:${settings.phones?.[0]?.raw || settings.primary_phone || '+917096070727'}`} className="text-slate-900 font-bold hover:text-orange-600 transition-colors block">
                      {settings.primary_phone || settings.phones?.[0]?.display || '+91 70960 70727'}
                    </a>
                    <a href={`tel:${settings.phones?.[1]?.raw || settings.secondary_phone || '+919265539537'}`} className="text-slate-600 hover:text-orange-600 transition-colors block text-xs mt-0.5 font-medium">
                      {settings.secondary_phone || settings.phones?.[1]?.display || '+91 92655 39537'}
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 shrink-0">
                    <Mail size={18} />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 uppercase font-bold">Official Email</span>
                    <a href={`mailto:${settings.email || settings.company_email || 'Balajimetal5302@gmail.com'}`} className="text-slate-900 font-bold hover:text-orange-600 transition-colors break-all">
                      {settings.email || settings.company_email || 'Balajimetal5302@gmail.com'}
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 uppercase font-bold">Factory Address</span>
                    <p className="text-slate-700 text-xs leading-relaxed mt-0.5 font-medium">
                      {settings.company_address || settings.address?.full || 'Balaji Metal, P. 43/44, Main Road, Ta. Kotda Sangani, Veraval (Shapar - Padavala Industrial Zone), Rajkot, Gujarat - 360025'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Instant WhatsApp Action */}
            <a 
              href={`https://wa.me/${(settings.whatsapp_number || settings.company_whatsapp || settings.whatsapp || '917600060193').replace('+', '')}?text=Hello%20Balaji%20Metal,%20I%20am%20contacting%20you%20via%20your%20website%20to%20request%20a%20product%20quotation.`}
              target="_blank" 
              rel="noreferrer"
              className="block bg-[#25D366] hover:bg-[#20bd5a] text-white p-6 rounded-3xl shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.02] text-center cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <WhatsAppIcon size={28} fill="#ffffff" />
              </div>
              <h3 className="text-lg font-heading font-black mb-1">Chat on WhatsApp</h3>
              <p className="text-emerald-50 text-xs font-medium">Direct instant engineering support & quotes from our sales desk.</p>
            </a>
          </motion.div>

        </div>

        {/* Interactive Google Map */}
        <div className="mt-16 rounded-3xl bg-white border border-slate-200/90 p-4 shadow-lg shadow-slate-200/60 overflow-hidden">
          <div className="p-3 mb-2 flex justify-between items-center text-xs text-slate-600">
            <span className="font-bold text-slate-900">Factory Location Map (Kotda Sangani / Veraval, Gujarat)</span>
            <a 
              href={settings.googleMapsDirections || 'https://maps.google.com/?q=Balaji+Metal+Kotda+Sangani+Veraval+Rajkot+Gujarat+360025'} 
              target="_blank" 
              rel="noreferrer"
              className="text-orange-600 hover:underline font-bold"
            >
              Open in Google Maps ↗
            </a>
          </div>
          <iframe 
            src={settings.google_maps_embed || settings.googleMapsUrl || 'https://www.google.com/maps?q=Balaji+Metal%2C+P.+43%2F44%2C+Main+Road%2C+Ta.+Kotda+Sangani%2C+Veraval%2C+Rajkot%2C+Gujarat+360025&output=embed'} 
            width="100%" 
            height="400" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-2xl w-full"
            title="Balaji Metal Factory Location"
          />
        </div>

      </div>
    </div>
  );
}
