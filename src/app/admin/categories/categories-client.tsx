'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { AdminCategory, createAdminCategory, deleteAdminCategory } from '../actions';
import { Plus, Search, Layers, AlertCircle, Trash2, CheckCircle2, X, ExternalLink } from 'lucide-react';

export function CategoriesClient({ initialCategories }: { initialCategories: AdminCategory[] }) {
  const [categories, setCategories] = useState<AdminCategory[]>(initialCategories);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
    displayOrder: categories.length + 1,
  });

  const filteredCategories = categories.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q);
  });

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);
    setActionSuccess(null);

    if (!formData.name.trim()) {
      setActionError('Category name is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createAdminCategory({
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: formData.description,
        imageUrl: formData.imageUrl,
        displayOrder: Number(formData.displayOrder),
      });

      if (res.success) {
        setActionSuccess(`Category "${formData.name}" created successfully.`);
        setIsModalOpen(false);
        setCategories((prev) => [
          ...prev,
          {
            id: `c0000001-0000-0000-0000-0000000000${prev.length + 1}`,
            name: formData.name,
            slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            description: formData.description,
            imageUrl: formData.imageUrl,
            displayOrder: Number(formData.displayOrder),
            isActive: true,
          },
        ]);
        setFormData({
          name: '',
          slug: '',
          description: '',
          imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
          displayOrder: categories.length + 2,
        });
      } else {
        setActionError(res.error || 'Failed to create category.');
      }
    } catch {
      setActionError('Network error while saving category.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (cat: AdminCategory) => {
    if (!confirm(`Are you sure you want to delete category "${cat.name}"?`)) return;

    setActionError(null);
    setActionSuccess(null);

    const res = await deleteAdminCategory(cat.id);
    if (res.success) {
      setCategories((prev) => prev.filter((c) => c.id !== cat.id));
      setActionSuccess(`Category "${cat.name}" removed safely.`);
    } else {
      setActionError(res.error || 'Failed to delete category.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Notifications */}
      {actionSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-sm flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)}>
            <X className="w-3.5 h-3.5 text-emerald-600" />
          </button>
        </div>
      )}

      {actionError && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 text-xs rounded-sm flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span>{actionError}</span>
          </div>
          <button onClick={() => setActionError(null)}>
            <X className="w-3.5 h-3.5 text-red-600" />
          </button>
        </div>
      )}

      {/* Action Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-aesthique-espresso/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search categories by name or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-aesthique-beige text-xs text-aesthique-espresso placeholder:text-aesthique-espresso/40 focus:outline-none focus:border-aesthique-gold"
          />
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 bg-aesthique-espresso text-aesthique-ivory text-xs uppercase tracking-wider font-semibold px-4 py-2.5 hover:bg-black transition-colors"
        >
          <Plus className="w-4 h-4 text-aesthique-gold" />
          <span>Create Category</span>
        </button>
      </div>

      {/* Categories Grid Table */}
      <div className="bg-white border border-aesthique-beige shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-aesthique-espresso">
            <thead className="bg-[#FAF7F2] border-b border-aesthique-beige uppercase tracking-wider text-[10px] text-aesthique-espresso/60 font-semibold">
              <tr>
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">Image</th>
                <th className="py-3 px-4">Category Name</th>
                <th className="py-3 px-4">Slug</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-aesthique-beige/60">
              {filteredCategories.map((c) => (
                <tr key={c.id} className="hover:bg-[#FDFBF7] transition-colors">
                  <td className="py-3.5 px-4 font-mono font-semibold text-aesthique-copper">
                    #{c.displayOrder}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="relative w-10 h-10 rounded-sm overflow-hidden border border-aesthique-beige bg-aesthique-ivory">
                      {c.imageUrl ? (
                        <Image src={c.imageUrl} alt={c.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-aesthique-espresso/30">
                          <Layers className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-aesthique-espresso">
                    {c.name}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-aesthique-espresso/60">
                    /{c.slug}
                  </td>
                  <td className="py-3.5 px-4 text-aesthique-espresso/70 max-w-xs truncate">
                    {c.description || '—'}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 text-[10px] uppercase font-semibold rounded-full bg-emerald-100 text-emerald-800">
                      Active
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`/category/${c.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        title="View storefront category page"
                        className="p-1 text-aesthique-espresso/60 hover:text-aesthique-gold transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => handleDeleteCategory(c)}
                        title="Delete category"
                        className="p-1 text-aesthique-espresso/60 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Creating Category */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full border border-aesthique-gold shadow-2xl overflow-hidden animate-fadeIn">
            <div className="p-6 border-b border-aesthique-beige flex items-center justify-between bg-[#FAF7F2]">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-aesthique-copper font-semibold block">
                  Add Catalog Taxonomy
                </span>
                <h3 className="font-editorial text-xl font-bold text-aesthique-espresso">
                  New Category
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-aesthique-espresso/40 hover:text-aesthique-espresso"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-aesthique-espresso uppercase tracking-wider text-[10px]">
                  Category Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sculptural Objects"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 bg-white border border-aesthique-beige focus:outline-none focus:border-aesthique-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-aesthique-espresso uppercase tracking-wider text-[10px]">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    placeholder="sculptural-objects"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full p-2.5 bg-white border border-aesthique-beige focus:outline-none focus:border-aesthique-gold font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-aesthique-espresso uppercase tracking-wider text-[10px]">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                    className="w-full p-2.5 bg-white border border-aesthique-beige focus:outline-none focus:border-aesthique-gold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-aesthique-espresso uppercase tracking-wider text-[10px]">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Curated essentials designed for mindful everyday beauty."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 bg-white border border-aesthique-beige focus:outline-none focus:border-aesthique-gold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-aesthique-espresso uppercase tracking-wider text-[10px]">
                  Hero / Card Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full p-2.5 bg-white border border-aesthique-beige focus:outline-none focus:border-aesthique-gold"
                />
              </div>

              <div className="pt-3 border-t border-aesthique-beige flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-aesthique-beige text-aesthique-espresso hover:bg-black/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-aesthique-espresso text-aesthique-ivory font-semibold hover:bg-black uppercase tracking-wider"
                >
                  {isSubmitting ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
