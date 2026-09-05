import React, { useState, useEffect } from 'react';
import { 
  X, Plus, Trash2, Check, Upload, 
  Sparkles, Layers, Image as ImageIcon, Loader2, AlertCircle 
} from 'lucide-react';
import { storageService } from '@/utils/storageService';
import { firebaseService } from '@/services/firebaseService';
import { compressImage } from '@/utils/imageCompressor';

export default function ProductFormModal({ isOpen, onClose, product, onSave }) {
  const categories = storageService.getCategories();

  const [formData, setFormData] = useState({
    name: '',
    category_id: categories[0]?.id || 1,
    short_description: '',
    is_featured: true,
    photos: [], // Max 5 photo URLs
    features: ['']
  });

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      let existingPhotos = [];
      if (Array.isArray(product.gallery) && product.gallery.length > 0) {
        existingPhotos = [...product.gallery];
      } else if (product.image) {
        existingPhotos = [product.image];
      }

      setFormData({
        name: product.name || '',
        category_id: product.category_id || (categories.find(c => c.slug === product.category_slug)?.id) || categories[0]?.id || 1,
        short_description: product.short_description || product.description || '',
        is_featured: product.is_featured !== undefined ? product.is_featured : true,
        photos: existingPhotos.slice(0, 5),
        features: Array.isArray(product.features) && product.features.length > 0 ? product.features : ['']
      });
    } else {
      setFormData({
        name: '',
        category_id: categories[0]?.id || 1,
        short_description: '',
        is_featured: true,
        photos: [],
        features: ['Precision engineered & dynamic balanced conforming to ISO 1940']
      });
    }
    setError('');
  }, [product, isOpen]);

  if (!isOpen) return null;

  // Features handlers
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

  // Ultra-fast Photo Upload (Instant compression + Cloud upload fallback)
  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const remainingSlots = 5 - formData.photos.length;
    if (remainingSlots <= 0) {
      setError('Maximum 5 photos allowed per product.');
      return;
    }

    const filesToProcess = files.slice(0, remainingSlots);
    setUploading(true);
    setError('');

    try {
      const newPhotoUrls = [];

      for (const file of filesToProcess) {
        // 1. Instant client-side compression (reduces 10MB -> ~100KB in 50ms)
        const { dataUrl, blob } = await compressImage(file, 1000, 0.82);

        let finalUrl = dataUrl;

        // 2. Try fast cloud upload with a 3-second timeout
        if (firebaseService.isConfigured() && blob) {
          try {
            const uploadPromise = firebaseService.uploadImage(blob, 'products');
            const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Storage timeout')), 3000)
            );
            const cloudUrl = await Promise.race([uploadPromise, timeoutPromise]);
            if (cloudUrl) {
              finalUrl = cloudUrl;
            }
          } catch (cloudErr) {
            console.info('Using instant optimized image storage:', cloudErr.message);
          }
        }

        if (finalUrl) {
          newPhotoUrls.push(finalUrl);
        }
      }

      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...newPhotoUrls].slice(0, 5)
      }));
    } catch (err) {
      setError(err.message || 'Error processing photo');
    } finally {
      setUploading(false);
      e.target.value = ''; // Reset input so same file can be re-selected if desired
    }
  };

  const removePhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Please enter a product name');
      return;
    }

    const defaultPlaceholder = '/images/products/pin-bush-coupling/pin-bush-coupling-01.jpeg';
    const mainCoverPhoto = formData.photos[0] || (product?.image) || defaultPlaceholder;
    const gallery = formData.photos.length > 0 ? formData.photos : [mainCoverPhoto];

    const selectedCat = categories.find(c => String(c.id) === String(formData.category_id) || c.slug === String(formData.category_id)) || categories[0] || {};

    const cleanPayload = {
      ...(product ? { id: product.id, slug: product.slug, applications: product.applications, specifications: product.specifications, available_sizes: product.available_sizes, material: product.material } : {}),
      name: formData.name.trim(),
      category_id: selectedCat.id || formData.category_id,
      category_name: selectedCat.name || selectedCat.shortName || 'Industrial Components',
      category_slug: selectedCat.slug || 'couplings',
      short_description: formData.short_description.trim() || `${formData.name} manufactured by Balaji Metal.`,
      description: formData.short_description.trim(),
      image: mainCoverPhoto,
      gallery: gallery,
      features: formData.features.map(f => f.trim()).filter(Boolean),
      is_featured: Boolean(formData.is_featured)
    };

    try {
      setSaving(true);
      await onSave(cleanPayload);
      onClose();
    } catch (saveErr) {
      setError(saveErr.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-900/50 backdrop-blur-xs">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden z-10 text-slate-900 font-sans">
        
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
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 1. Product Name & 2. Category */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-7 space-y-1.5">
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

            <div className="sm:col-span-5 space-y-1.5">
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

          {/* 3. Show on Home Page (Toggle Button) */}
          <div className="bg-orange-50/50 border border-orange-200/80 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                Show on Home Page
              </span>
              <span className="text-[11px] text-slate-500">
                Display this product in the featured section of the homepage
              </span>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
            </label>
          </div>

          {/* 4. Short Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Short Description
            </label>
            <textarea
              rows={3}
              value={formData.short_description}
              onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
              placeholder="Simple description explaining the product features and utility..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-900 placeholder-slate-400 text-sm focus:border-orange-500 focus:bg-white focus:outline-none leading-relaxed"
            />
          </div>

          {/* 5. Upload From Computer (Max 5 Photos) */}
          <div className="space-y-3 bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Product Photos (Max 5)
                </label>
                <span className="text-[11px] text-slate-500">
                  {formData.photos.length} of 5 photos added (1st photo will be the main cover)
                </span>
              </div>
              
              {/* Upload Button */}
              {formData.photos.length < 5 && (
                <label className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-xs cursor-pointer transition-all ${uploading ? 'opacity-70 pointer-events-none' : ''}`}>
                  {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                  <span>{uploading ? 'Processing...' : 'Upload From Computer'}</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple
                    className="hidden" 
                    disabled={uploading}
                    onChange={handlePhotoUpload}
                  />
                </label>
              )}
            </div>

            {/* Photo Preview Grid (Max 5) */}
            {formData.photos.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
                {formData.photos.map((photoUrl, idx) => (
                  <div key={idx} className="relative group bg-white border border-slate-200 rounded-2xl p-1.5 overflow-hidden shadow-xs flex flex-col items-center">
                    <div className="w-full aspect-square rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden">
                      <img 
                        src={photoUrl} 
                        alt={`Photo ${idx + 1}`} 
                        className="w-full h-full object-contain"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                    <div className="w-full mt-1.5 flex items-center justify-between px-1">
                      <span className="text-[10px] font-bold text-slate-500">
                        {idx === 0 ? 'Cover' : `#${idx + 1}`}
                      </span>
                      <button
                        type="button"
                        onClick={() => removePhoto(idx)}
                        className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Remove photo"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center text-slate-400 text-xs">
                <ImageIcon size={28} className="mx-auto mb-2 text-slate-300" />
                <span>No photos added yet. Click &quot;Upload From Computer&quot; to add up to 5 photos.</span>
              </div>
            )}
          </div>

          {/* 6. Key Benefits / Features */}
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
                    placeholder={`Benefit ${idx + 1} (e.g. Dynamic balancing conforming to ISO 1940)`}
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

          {/* Footer Submit */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs shadow-md shadow-orange-600/25 flex items-center gap-2 cursor-pointer transition-all hover:scale-105 disabled:opacity-50 disabled:pointer-events-none"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
              <span>{saving ? 'Saving...' : (product ? 'Update Product' : 'Save Product')}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
