'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/types';
import { createAdminProduct, toggleProductActive } from '../actions';
import { formatPrice } from '@/lib/utils';
import { Plus, Search, Check, X, Sparkles, Filter } from 'lucide-react';

interface ProductsClientProps {
  initialProducts: Product[];
}

export function ProductsClient({ initialProducts }: ProductsClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // New product form fields
  const [formData, setFormData] = useState({
    name: '',
    categorySlug: 'home-decor',
    regularPrice: 1999,
    salePrice: '',
    sku: '',
    shortDescription: '',
    fullDescription: '',
    stockQuantity: 25,
    imageUrl:
      'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1000&q=80',
  });

  const filteredProducts = products.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.categorySlug?.toLowerCase().includes(q)
    );
  });

  const handleToggleActive = async (productId: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, isActive: nextStatus } : p))
    );
    await toggleProductActive(productId, nextStatus);
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.name.trim() || !formData.sku.trim()) {
      setFormError('Please enter a valid product name and SKU code.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createAdminProduct({
        name: formData.name,
        categorySlug: formData.categorySlug,
        regularPrice: Number(formData.regularPrice),
        salePrice: formData.salePrice ? Number(formData.salePrice) : null,
        sku: formData.sku.toUpperCase(),
        shortDescription: formData.shortDescription,
        fullDescription: formData.fullDescription,
        stockQuantity: Number(formData.stockQuantity),
        imageUrl: formData.imageUrl,
      });

      if (!res.success) {
        throw new Error(res.error || 'Failed to create product.');
      }

      if (res.product) {
        setProducts((prev) => [res.product!, ...prev]);
      }
      setIsModalOpen(false);
      setFormData({
        name: '',
        categorySlug: 'home-decor',
        regularPrice: 1999,
        salePrice: '',
        sku: '',
        shortDescription: '',
        fullDescription: '',
        stockQuantity: 25,
        imageUrl:
          'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1000&q=80',
      });
    } catch (err: any) {
      setFormError(err.message || 'Error creating product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 border border-aesthique-beige shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-aesthique-espresso/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products by title, SKU or collection..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-aesthique-ivory/60 border border-aesthique-beige pl-9 pr-4 py-2 text-xs text-aesthique-espresso placeholder:text-aesthique-espresso/40 focus:outline-none focus:border-aesthique-gold"
          />
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 bg-aesthique-espresso text-aesthique-ivory text-xs uppercase tracking-wider font-semibold px-4 py-2.5 hover:bg-black transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-aesthique-beige shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-aesthique-ivory/60 text-aesthique-espresso/70 uppercase tracking-wider text-[10px] font-semibold border-b border-aesthique-beige">
              <tr>
                <th className="py-3 px-6">Product</th>
                <th className="py-3 px-6">SKU</th>
                <th className="py-3 px-6">Collection</th>
                <th className="py-3 px-6">Price</th>
                <th className="py-3 px-6">Inventory</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-aesthique-beige/50">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-aesthique-ivory/30 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded bg-aesthique-ivory border border-aesthique-beige flex-shrink-0 overflow-hidden">
                        <Image
                          src={p.primaryImage}
                          alt={p.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <span className="font-semibold text-aesthique-espresso block line-clamp-1">
                          {p.name}
                        </span>
                        <span className="text-[10px] text-aesthique-copper block font-medium">
                          {p.categoryName}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-mono font-medium text-aesthique-espresso/80">
                    {p.sku}
                  </td>
                  <td className="py-4 px-6 capitalize text-aesthique-espresso/70">
                    {p.categorySlug?.replace('-', ' ')}
                  </td>
                  <td className="py-4 px-6 font-mono font-bold text-aesthique-espresso">
                    {formatPrice(p.salePrice ?? p.regularPrice)}
                    {p.salePrice && (
                      <span className="block text-[10px] font-normal line-through text-aesthique-espresso/40">
                        {formatPrice(p.regularPrice)}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center gap-1 font-bold ${
                        p.stockQuantity <= 5 ? 'text-amber-700' : 'text-emerald-800'
                      }`}
                    >
                      {p.stockQuantity} in stock
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        p.isActive
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {p.isActive ? 'Active' : 'Archived'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleToggleActive(p.id, p.isActive)}
                      className={`text-xs uppercase tracking-wider font-semibold hover:underline ${
                        p.isActive ? 'text-rose-700' : 'text-emerald-700'
                      }`}
                    >
                      {p.isActive ? 'Deactivate' : 'Publish'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-aesthique-beige shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-aesthique-beige pb-4">
              <div>
                <h3 className="font-editorial text-xl font-bold text-aesthique-espresso">
                  Add New Lifestyle Essential
                </h3>
                <p className="text-xs text-aesthique-espresso/60">
                  Introduce a curated item to the catalog with pricing and stock details.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-aesthique-espresso/60 hover:text-aesthique-espresso"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-xs text-rose-800">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="uppercase tracking-wider font-semibold text-aesthique-espresso block">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Artisanal Stone Pitcher"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-aesthique-ivory/60 border border-aesthique-beige p-2.5 text-aesthique-espresso focus:outline-none focus:border-aesthique-gold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="uppercase tracking-wider font-semibold text-aesthique-espresso block">
                    SKU Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AES-PITCHER-01"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full bg-aesthique-ivory/60 border border-aesthique-beige p-2.5 text-aesthique-espresso focus:outline-none focus:border-aesthique-gold uppercase font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="uppercase tracking-wider font-semibold text-aesthique-espresso block">
                    Collection *
                  </label>
                  <select
                    value={formData.categorySlug}
                    onChange={(e) => setFormData({ ...formData, categorySlug: e.target.value })}
                    className="w-full bg-aesthique-ivory/60 border border-aesthique-beige p-2.5 text-aesthique-espresso focus:outline-none focus:border-aesthique-gold"
                  >
                    <option value="home-decor">Home & Living</option>
                    <option value="kitchen-dining">Kitchen & Dining</option>
                    <option value="bed-bath">Bed & Bath</option>
                    <option value="stationery-workspace">Stationery & Workspace</option>
                    <option value="fragrances-candles">Fragrances & Candles</option>
                    <option value="wellness-relaxation">Wellness & Rituals</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="uppercase tracking-wider font-semibold text-aesthique-espresso block">
                    Regular Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.regularPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, regularPrice: Number(e.target.value) })
                    }
                    className="w-full bg-aesthique-ivory/60 border border-aesthique-beige p-2.5 text-aesthique-espresso focus:outline-none focus:border-aesthique-gold font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="uppercase tracking-wider font-semibold text-aesthique-espresso block">
                    Initial Stock *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.stockQuantity}
                    onChange={(e) =>
                      setFormData({ ...formData, stockQuantity: Number(e.target.value) })
                    }
                    className="w-full bg-aesthique-ivory/60 border border-aesthique-beige p-2.5 text-aesthique-espresso focus:outline-none focus:border-aesthique-gold font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="uppercase tracking-wider font-semibold text-aesthique-espresso block">
                  Image URL (High-Resolution Visual) *
                </label>
                <input
                  type="url"
                  required
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full bg-aesthique-ivory/60 border border-aesthique-beige p-2.5 text-aesthique-espresso focus:outline-none focus:border-aesthique-gold"
                />
              </div>

              <div className="space-y-1">
                <label className="uppercase tracking-wider font-semibold text-aesthique-espresso block">
                  Short Editorial Summary
                </label>
                <textarea
                  rows={2}
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="A tactile stoneware pitcher finished in raw mineral glazes."
                  className="w-full bg-aesthique-ivory/60 border border-aesthique-beige p-2.5 text-aesthique-espresso focus:outline-none focus:border-aesthique-gold"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-aesthique-beige">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 uppercase tracking-wider font-semibold text-aesthique-espresso hover:text-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-aesthique-espresso text-aesthique-ivory px-6 py-2.5 uppercase tracking-wider font-semibold hover:bg-black disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? 'Saving Essential...' : 'Save & Publish Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
