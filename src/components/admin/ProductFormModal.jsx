import React, { useState, useEffect } from 'react';
import { 
  X, Plus, Trash2, Check, Upload, 
  Sparkles, Layers, Building2, Image as ImageIcon 
} from 'lucide-react';
import { storageService } from '@/utils/storageService';

export default function ProductFormModal({ isOpen, onClose, product, onSave }) {
  const categories = storageService.getCategories();

  const [formData, setFormData] = useState({
    name: '',
    category_id: categories[0]?.id || 1,
    material: 'Graded Cast Iron (FG 200/250)',
    short_description: '',
    description: '',
    image: '',
    galleryText: '',
    features: [''],
    applications: [{ industry: '', application: '' }],
    available_sizes: [''],
    is_featured: true
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        category_id: product.category_id || (categories.find(c => c.slug === product.category_slug)?.id) || 1,
        material: product.material || 'Graded Cast Iron (FG 200/250)',
        short_description: product.short_description || '',
        description: product.description || '',
        image: product.image || '',
        galleryText: Array.isArray(product.gallery) ? product.gallery.join('\n') : (product.image || ''),
        features: Array.isArray(product.features) && product.features.length > 0 ? product.features : [''],
        applications: Array.isArray(product.applications) && product.applications.length > 0 
          ? product.applications.map(a => typeof a === 'object' ? { industry: a.industry || '', application: a.application || '' } : { industry: 'General', application: String(a) })
          : [{ industry: '', application: '' }],
        available_sizes: Array.isArray(product.available_sizes) && product.available_sizes.length > 0 ? product.available_sizes : [''],
        is_featured: product.is_featured !== undefined ? product.is_featured : true
      });
    } else {
      setFormData({
        name: '',
        category_id: categories[0]?.id || 1,
        material: 'Graded Cast Iron (FG 200/250)',
        short_description: '',
        description: '',
        image: '/images/products/pin-bush-coupling/pin-bush-coupling-01.jpeg',
        galleryText: '/images/products/pin-bush-coupling/pin-bush-coupling-01.jpeg',
        features: ['High torsional elasticity & vibration dampening', 'Precision balanced conforming to ISO 1940'],
        applications: [{ industry: 'Pumps & Compressors', application: 'Water pumps and industrial air blowers' }],
        available_sizes: ['Standard Bores 12mm to 100mm'],
        is_featured: true
      });
    }
    setError('');
    setSuccess(false);
  }, [product, isOpen]);

  if (!isOpen) return null;

  // Features list handlers
  const handleFeatureChange = (index, value) => {
    const updated = [...formData.features];
    updated[index] = value;
    setFormData({ ...formData, features: updated });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const removeFeature = (index) => {
    const updated = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: updated.length ? updated : [''] });
  };

  // Applications list handlers
  const handleAppChange = (index, field, value) => {
    const updated = [...formData.applications];
    updated[index][field] = value;
    setFormData({ ...formData, applications: updated });
  };

  const addApplication = () => {
    setFormData({ ...formData, applications: [...formData.applications, { industry: '', application: '' }] });
  };

  const removeApplication = (index) => {
    const updated = formData.applications.filter((_, i) => i !== index);
    setFormData({ ...formData, applications: updated.length ? updated : [{ industry: '', application: '' }] });
  };

  // Sizes handlers
  const handleSizeChange = (index, value) => {
    const updated = [...formData.available_sizes];
    updated[index] = value;
    setFormData({ ...formData, available_sizes: updated });
  };

  const addSize = () => {
    setFormData({ ...formData, available_sizes: [...formData.available_sizes, ''] });
  };

  const removeSize = (index) => {
    const updated = formData.available_sizes.filter((_, i) => i !== index);
    setFormData({ ...formData, available_sizes: updated.length ? updated : [''] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Please enter a product name');
      return;
    }

    const galleryArray = formData.galleryText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const mainImage = formData.image.trim() || galleryArray[0] || '/images/products/pin-bush-coupling/pin-bush-coupling-01.jpeg';

    const cleanPayload = {
      ...(product ? { id: product.id, slug: product.slug } : {}),
      name: formData.name.trim(),
      category_id: Number(formData.category_id),
      material: formData.material.trim(),
      short_description: formData.short_description.trim() || `${formData.name} manufactured by Balaji Metal.`,
      description: formData.description.trim() || formData.short_description.trim(),
      image: mainImage,
      gallery: galleryArray.length > 0 ? galleryArray : [mainImage],
      features: formData.features.map(f => f.trim()).filter(Boolean),
      applications: formData.applications.filter(a => a.industry.trim() || a.application.trim()),
      available_sizes: formData.available_sizes.map(s => s.trim()).filter(Boolean),
      is_featured: formData.is_featured
    };

    onSave(cleanPayload);
    setSuccess(true);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-900/50 backdrop-blur-xs">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden z-10 text-slate-900 font-sans">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 border border-orange-200 flex items-center justify-center">
              <Sparkles size={16} />
            </div>
            <h2 className="text-lg font-heading font-black text-slate-900">
              {product ? 'Edit Product' : 'Add New Product'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-200/60 text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
              {error}
            </div>
          )}

          {/* Row 1: Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-8 space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Product Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Pin Bush Flexible Coupling"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-900 placeholder-slate-400 text-sm focus:border-orange-500 focus:bg-white focus:outline-none"
                required
              />
            </div>

            <div className="sm:col-span-4 space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Category
              </label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-3 text-slate-800 text-sm focus:border-orange-500 focus:outline-none cursor-pointer"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Material & Featured Toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-8 space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Material / Grade
              </label>
              <input
                type="text"
                value={formData.material}
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                placeholder="e.g. Graded Cast Iron (FG 200/250) or Mild Steel"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-900 placeholder-slate-400 text-sm focus:border-orange-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="sm:col-span-4 flex items-center pt-6">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="w-5 h-5 rounded-lg text-orange-600 bg-slate-50 border-slate-300 focus:ring-orange-500 cursor-pointer"
                />
                <span className="text-xs font-bold text-slate-800">Show on Home Page</span>
              </label>
            </div>
          </div>

          {/* Short Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Short Customer-Friendly Description
            </label>
            <textarea
              rows={2}
              value={formData.short_description}
              onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
              placeholder="A simple, non-technical explanation of what the product is and does..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-900 placeholder-slate-400 text-sm focus:border-orange-500 focus:bg-white focus:outline-none leading-relaxed"
            />
          </div>

          {/* Product Photos & Upload */}
          <div className="space-y-3 bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Product Image & Gallery
                </label>
                <span className="text-[11px] text-slate-500">First image is used as the cover photo on website</span>
              </div>
              
              {/* File Upload Button */}
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-xs cursor-pointer transition-colors shrink-0">
                <Upload size={14} />
                <span>Upload From Device</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    if (file.size > 3 * 1024 * 1024) {
                      setError('Image size should be under 3MB');
                      return;
                    }
                    const reader = new FileReader();
                    reader.onload = () => {
                      const dataUrl = reader.result;
                      setFormData(prev => ({
                        ...prev,
                        image: dataUrl,
                        galleryText: prev.galleryText ? `${dataUrl}\n${prev.galleryText}` : dataUrl
                      }));
                    };
                    reader.readAsDataURL(file);
                  }}
                />
              </label>
            </div>

            {/* Quick preset selector */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-semibold text-slate-500 mr-1">Sample Presets:</span>
              {[
                { label: 'Pin Bush', path: '/images/products/pin-bush-coupling/pin-bush-coupling-01.jpeg' },
                { label: 'Star Bush', path: '/images/products/star-bush-coupling/star-bush-coupling-01.jpeg' },
                { label: 'V-Belt Pulley', path: '/images/products/v-belt-pulley/v-belt-pulley-01.jpeg' },
                { label: 'Hand Wheel', path: '/images/products/hand-wheel/hand-wheel-01.jpeg' },
              ].map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      image: p.path,
                      galleryText: p.path
                    }));
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-300 text-[11px] font-medium text-slate-700 cursor-pointer transition-all"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Live Preview Thumbnail */}
            {(formData.image || formData.galleryText) && (
              <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-200">
                <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 p-1 shrink-0 overflow-hidden flex items-center justify-center">
                  <img 
                    src={formData.image || formData.galleryText.split('\n')[0]} 
                    alt="Preview" 
                    className="w-full h-full object-contain"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-bold text-slate-800 block truncate">
                    Active Image Preview
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono block truncate">
                    {formData.image || formData.galleryText.split('\n')[0]}
                  </span>
                </div>
              </div>
            )}

            <textarea
              rows={2}
              value={formData.galleryText}
              onChange={(e) => setFormData({ 
                ...formData, 
                galleryText: e.target.value,
                image: e.target.value.split('\n')[0]?.trim() || formData.image
              })}
              placeholder="Or paste image URLs (1 per line) e.g. https://... or /images/products/..."
              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-900 placeholder-slate-400 text-xs font-mono focus:border-orange-500 focus:outline-none leading-relaxed"
            />
          </div>

          {/* Key Benefits (Dynamic List) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Key Benefits / Features
              </label>
              <button
                type="button"
                onClick={addFeature}
                className="text-xs text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Benefit</span>
              </button>
            </div>
            <div className="space-y-2">
              {formData.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={feat}
                    onChange={(e) => handleFeatureChange(idx, e.target.value)}
                    placeholder={`Benefit ${idx + 1} (e.g. Absorbs shock and vibration)`}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 text-xs placeholder-slate-400 focus:border-orange-500 focus:bg-white focus:outline-none"
                  />
                  {formData.features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeature(idx)}
                      className="p-2 text-slate-400 hover:text-red-600 cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Where Is It Used? (Industries & Machinery) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Where Is It Used? (Industries & Machines)
              </label>
              <button
                type="button"
                onClick={addApplication}
                className="text-xs text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Application</span>
              </button>
            </div>
            <div className="space-y-2">
              {formData.applications.map((app, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-5">
                    <input
                      type="text"
                      value={app.industry}
                      onChange={(e) => handleAppChange(idx, 'industry', e.target.value)}
                      placeholder="Industry (e.g. Pumps)"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 text-xs placeholder-slate-400 focus:border-orange-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div className="col-span-6">
                    <input
                      type="text"
                      value={app.application}
                      onChange={(e) => handleAppChange(idx, 'application', e.target.value)}
                      placeholder="Machines (e.g. Water pumps, Blowers)"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-900 text-xs placeholder-slate-400 focus:border-orange-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div className="col-span-1 text-center">
                    {formData.applications.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeApplication(idx)}
                        className="p-1.5 text-slate-400 hover:text-red-600 cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Available Sizes */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Available Sizes
              </label>
              <button
                type="button"
                onClick={addSize}
                className="text-xs text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Size</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.available_sizes.map((sz, idx) => (
                <div key={idx} className="flex items-center gap-1 bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1">
                  <input
                    type="text"
                    value={sz}
                    onChange={(e) => handleSizeChange(idx, e.target.value)}
                    placeholder="e.g. FBP-100"
                    className="w-28 bg-transparent text-slate-900 text-xs placeholder-slate-400 focus:outline-none font-mono font-medium"
                  />
                  {formData.available_sizes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSize(idx)}
                      className="text-slate-400 hover:text-red-600 cursor-pointer"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs shadow-md shadow-orange-600/25 flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
            >
              <Check size={16} />
              <span>{product ? 'Update Product' : 'Save Product'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
