import React, { useState, useEffect } from 'react';
import { 
  FolderTree, Plus, Edit2, Trash2, 
  Check, X, Sparkles, Layers, Disc, CircleDot, Settings, Package 
} from 'lucide-react';
import { storageService } from '@/utils/storageService';
import SEO from '@/components/ui/SEO';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', slug: '', shortName: '', description: '' });

  const loadData = () => {
    setCategories(storageService.getCategories());
    setProducts(storageService.getProducts());
  };

  useEffect(() => {
    loadData();
    const unsubscribe = storageService.subscribe((detail) => {
      if (!detail?.type || detail.type === 'categories' || detail.type === 'products' || detail.type === 'all') {
        loadData();
      }
    });
    return unsubscribe;
  }, []);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({ name: '', slug: '', shortName: '', description: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name || '',
      slug: cat.slug || '',
      shortName: cat.shortName || cat.name || '',
      description: cat.description || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const slug = formData.slug.trim() || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    await storageService.saveCategory({
      ...(editingCategory ? { id: editingCategory.id } : {}),
      name: formData.name.trim(),
      slug,
      shortName: formData.shortName.trim() || formData.name.trim(),
      description: formData.description.trim()
    });

    setIsModalOpen(false);
    loadData();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      await storageService.deleteCategory(id);
      loadData();
    }
  };

  return (
    <div className="space-y-6 font-sans text-slate-900">
      <SEO title="Categories Management | Balaji Metal Admin" description="Manage industrial product categories and taxonomy." />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div>
          <h1 className="text-2xl font-heading font-black text-slate-900 flex items-center gap-2.5">
            <FolderTree size={24} className="text-orange-600" />
            <span>Category Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Organize couplings, pulleys, hand wheels, and transmission accessories.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs shadow-md shadow-orange-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-105"
        >
          <Plus size={16} />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {categories.map((cat) => {
          const count = products.filter(p => p.category_slug === cat.slug || String(p.category_id) === String(cat.id)).length;

          return (
            <div key={cat.id} className="bg-white border border-slate-200/90 rounded-3xl p-6 space-y-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
                    <Layers size={20} />
                  </div>
                  <span className="text-xs font-semibold text-orange-700 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full flex items-center gap-1.5">
                    <Package size={13} />
                    <span>{count} {count === 1 ? 'Product' : 'Products'}</span>
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-heading font-black text-slate-900">
                    {cat.name}
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400">
                    slug: {cat.slug}
                  </span>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  {cat.description || 'Power transmission products line.'}
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(cat)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-orange-50 text-slate-600 hover:text-orange-600 transition-colors cursor-pointer"
                  title="Edit Category"
                >
                  <Edit2 size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(cat.id)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 transition-colors cursor-pointer"
                  title="Delete Category"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="relative bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-md p-6 text-slate-900 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-heading font-black text-slate-900">
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Category Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Industrial Couplings"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Short Name</label>
                <input
                  type="text"
                  value={formData.shortName}
                  onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                  placeholder="e.g. Couplings"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 cursor-pointer"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
