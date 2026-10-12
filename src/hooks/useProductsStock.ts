import { useState, useEffect } from 'react';
import { Product } from '../types';
import { PRODUCTS } from '../data/products';

const PRODUCTS_STOCK_KEY = 'miss2m_products_stock';

export function useProductsStock() {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(PRODUCTS_STOCK_KEY);
      if (saved) return JSON.parse(saved) as Product[];
    } catch {}
    return PRODUCTS;
  });

  useEffect(() => {
    const sync = () => {
      try {
        const saved = localStorage.getItem(PRODUCTS_STOCK_KEY);
        if (saved) setProducts(JSON.parse(saved));
      } catch {}
    };
    window.addEventListener('storage', sync);
    const id = setInterval(sync, 1000);
    return () => {
      window.removeEventListener('storage', sync);
      clearInterval(id);
    };
  }, []);

  return products;
}