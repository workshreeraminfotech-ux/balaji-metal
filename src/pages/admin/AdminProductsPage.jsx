import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, Plus, Search, Edit2, Trash2, 
  ExternalLink, Eye, CheckCircle2, XCircle, 
  Building2, Sparkles, Filter, RotateCcw
} from 'lucide-react';
import { storageService } from '@/utils/storageService';
import SEO from '@/components/ui/SEO';
import ProductFormModal from '@/components/admin/ProductFormModal';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Modal states
  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const loadData = () => {
    setProducts(storageService.getProducts());
    setCategories(storageService.getCategories());
  };

  useEffect(() => {
    loadData();
    const unsubscribe = storageService.subscribe((detail) => {
      if (!detail?.type || detail.type === 'products' || detail.type === 'categories' || detail.type === 'all') {
        loadData();
      }
    });
    return unsubscribe;
  }, []);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod) => {
    setEditingProduct(prod);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (productData) => {
    await storageService.saveProduct(productData);
    loadData();
  };

  const handleDeleteProduct = async (id) => {
    await storageService.deleteProduct(id);
    setDeleteConfirmId(null);
    loadData();
  };

  // Filtered products
  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'all' || 
      String(p.category_id) === String(selectedCategory) || 
      p.category_slug === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || (
      p.name.toLowerCase().includes(q) ||
      p.short_description?.toLowerCase().includes(q) ||
      p.category_name?.toLowerCase().includes(q)
    );
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 font-sans text-slate-900">
      <SEO title="Product Management | Balaji Metal Admin" description="Add, edit, remove, and manage industrial products catalog." />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div>
          <h1 className="text-2xl font-heading font-black text-slate-900 flex items-center gap-2.5">
            <Package size={24} className="text-orange-600" />
            <span>Products Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Add new photoshoot products, edit specifications, or remove discontinued items.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs shadow-md shadow-orange-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-105"
        >
          <Plus size={16} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Toolbar: Search & Category Filter */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-xs">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by name or material..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-slate-900 placeholder-slate-400 text-xs focus:border-orange-500 focus:bg-white focus:outline-none"
          />
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>

        {/* Category select */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider hidden sm:inline">
            Category:
          </span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-48 bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl px-3 py-2.5 focus:border-orange-500 focus:outline-none cursor-pointer"
          >
            <option value="all">All Categories ({products.length})</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Showing <strong className="text-slate-900">{filteredProducts.length}</strong> Products
          </span>
          <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
            <CheckCircle2 size={13} />
            <span>Live Sync Active</span>
          </span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 text-slate-500 text-sm">
            No products found matching your search or category filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="text-slate-500 uppercase tracking-wider text-[11px] border-b border-slate-100 bg-slate-50">
                  <th className="py-3.5 px-6 font-bold">Product</th>
                  <th className="py-3.5 px-4 font-bold">Category</th>
                  <th className="py-3.5 px-4 font-bold">Photos</th>
                  <th className="py-3.5 px-4 font-bold">Home Featured</th>
                  <th className="py-3.5 px-6 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {filteredProducts.map((product) => {
                  const photoCount = Array.isArray(product.gallery) ? product.gallery.length : 1;

                  return (
                    <tr key={product.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Product Name & Cover Photo */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3.5">
                          <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 p-1.5 shrink-0 flex items-center justify-center overflow-hidden shadow-2xs">
                            <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-bold text-slate-900 text-sm truncate">
                              {product.name}
                            </h3>
                            <p className="text-xs text-slate-500 truncate max-w-xs font-normal">
                              {product.short_description}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-200 text-[11px] font-bold">
                          {product.category_name || categories.find(c => String(c.id) === String(product.category_id) || c.slug === product.category_slug)?.name || 'General'}
                        </span>
                      </td>

                      {/* Gallery count */}
                      <td className="py-4 px-4 text-slate-500 text-xs font-medium">
                        {photoCount} {photoCount === 1 ? 'photo' : 'photos'}
                      </td>

                      {/* Featured */}
                      <td className="py-4 px-4">
                        {product.is_featured ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-xs">
                            <CheckCircle2 size={14} />
                            <span>Yes</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-slate-400 font-medium text-xs">
                            <span>No</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/products/${product.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 transition-colors cursor-pointer"
                            title="View Live on Website"
                          >
                            <ExternalLink size={16} />
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleOpenEdit(product)}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-orange-50 text-slate-600 hover:text-orange-600 transition-colors cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit2 size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(product.id)}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 transition-colors cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 size={16} />
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

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 size={24} />
            </div>
            <h3 className="text-xl font-heading font-black text-slate-900">
              Delete This Product?
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Are you sure you want to remove this product? It will be removed immediately from the public catalog and homepage.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteProduct(deleteConfirmId)}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 cursor-pointer transition-colors"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={editingProduct}
        onSave={handleSaveProduct}
      />
    </div>
  );
}
