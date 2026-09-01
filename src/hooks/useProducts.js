import { useState, useEffect, useCallback } from 'react';
import { storageService } from '@/utils/storageService';

export const useProducts = (initialParams = {}) => {
  const [products, setProducts] = useState(() => storageService.getProducts());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchProducts = useCallback((fetchParams = initialParams) => {
    setLoading(true);
    try {
      let list = storageService.getProducts();

      if (fetchParams.category_id && fetchParams.category_id !== 'all') {
        list = list.filter(p => 
          String(p.category_id) === String(fetchParams.category_id) || 
          p.category_slug === fetchParams.category_id
        );
      }

      if (fetchParams.search) {
        const q = fetchParams.search.toLowerCase();
        list = list.filter(p => 
          p.name?.toLowerCase().includes(q) || 
          p.description?.toLowerCase().includes(q) ||
          p.material?.toLowerCase().includes(q) ||
          p.short_description?.toLowerCase().includes(q)
        );
      }

      setProducts(list);
      setTotalPages(1);
      setCurrentPage(1);
      setError(null);
    } catch (err) {
      console.error('Fetch products error:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [initialParams]);

  useEffect(() => {
    fetchProducts(initialParams);
  }, []);

  return { products, loading, error, totalPages, currentPage, refetch: fetchProducts };
};
