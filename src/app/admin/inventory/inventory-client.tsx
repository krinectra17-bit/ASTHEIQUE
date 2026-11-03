'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Boxes, AlertTriangle, Plus, Search, RefreshCw, Check } from 'lucide-react';

interface InventoryClientProps {
  initialProducts: Product[];
}

export function InventoryClient({ initialProducts }: InventoryClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [adjustingProduct, setAdjustingProduct] = useState<Product | null>(null);
  const [adjustDelta, setAdjustDelta] = useState<number>(10);
  const [adjustReason, setAdjustReason] = useState<string>('Studio batch restock');
  const [isSuccess, setIsSuccess] = useState(false);

  const filteredProducts = products.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
  });

  const lowStockItems = products.filter((p) => p.stockQuantity <= p.lowStockThreshold);

  const handleApplyAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingProduct) return;

    setProducts((prev) =>
      prev.map((p) =>
        p.id === adjustingProduct.id
          ? { ...p, stockQuantity: Math.max(0, p.stockQuantity + adjustDelta) }
          : p
      )
    );

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setAdjustingProduct(null);
      setAdjustDelta(10);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Low Stock Warning Banner */}
      {lowStockItems.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 p-4 flex items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-editorial text-sm font-bold text-amber-950">
                Low Stock Threshold Alert ({lowStockItems.length} essentials)
              </h4>
              <p className="text-xs text-amber-800/80">
                The following products have available quantities at or below safety threshold. Restock recommended.
              </p>
            </div>
          </div>
          <span className="text-xs uppercase tracking-wider font-bold text-amber-900 bg-amber-200 px-3 py-1 rounded-sm">
            Action Recommended
          </span>
        </div>
      )}

      {/* Control Bar */}
      <div className="bg-white p-4 border border-aesthique-beige shadow-sm flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-aesthique-espresso/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search inventory by title or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-aesthique-ivory/60 border border-aesthique-beige pl-9 pr-4 py-2 text-xs text-aesthique-espresso placeholder:text-aesthique-espresso/40 focus:outline-none focus:border-aesthique-gold"
          />
        </div>

        <div className="text-xs text-aesthique-espresso/60">
          Tracking <strong className="text-aesthique-espresso">{products.length}</strong> catalog items
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white border border-aesthique-beige shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-aesthique-ivory/60 text-aesthique-espresso/70 uppercase tracking-wider text-[10px] font-semibold border-b border-aesthique-beige">
              <tr>
                <th className="py-3 px-6">Product Item</th>
                <th className="py-3 px-6">SKU</th>
                <th className="py-3 px-6">Unit Price</th>
                <th className="py-3 px-6">Available Stock</th>
                <th className="py-3 px-6">Low Stock Limit</th>
                <th className="py-3 px-6">Health</th>
                <th className="py-3 px-6 text-right">Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-aesthique-beige/50">
              {filteredProducts.map((p) => {
                const isLow = p.stockQuantity <= p.lowStockThreshold;

                return (
                  <tr key={p.id} className="hover:bg-aesthique-ivory/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded bg-aesthique-ivory border border-aesthique-beige overflow-hidden flex-shrink-0">
                          <Image
                            src={p.primaryImage}
                            alt={p.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="font-semibold text-aesthique-espresso block line-clamp-1">
                          {p.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono font-medium text-aesthique-espresso/80">
                      {p.sku}
                    </td>
                    <td className="py-4 px-6 font-mono font-bold text-aesthique-espresso">
                      {formatPrice(p.salePrice ?? p.regularPrice)}
                    </td>
                    <td className="py-4 px-6 font-mono font-bold text-sm text-aesthique-espresso">
                      {p.stockQuantity} units
                    </td>
                    <td className="py-4 px-6 font-mono text-aesthique-espresso/60">
                      {p.lowStockThreshold} units
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isLow
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {isLow ? 'Low Stock Alert' : 'Healthy'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setAdjustingProduct(p)}
                        className="inline-flex items-center gap-1 text-xs uppercase tracking-wider font-semibold text-aesthique-copper hover:underline"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Adjust</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Modal */}
      {adjustingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-aesthique-beige shadow-2xl max-w-md w-full p-6 space-y-5">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-aesthique-copper block">
                Inventory Adjustment
              </span>
              <h3 className="font-editorial text-lg font-bold text-aesthique-espresso">
                {adjustingProduct.name}
              </h3>
              <p className="text-xs text-aesthique-espresso/60 font-mono mt-0.5">
                Current Quantity: {adjustingProduct.stockQuantity} units
              </p>
            </div>

            {isSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-semibold">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Stock quantity successfully synchronized!</span>
              </div>
            ) : (
              <form onSubmit={handleApplyAdjustment} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="uppercase tracking-wider font-semibold text-aesthique-espresso block">
                    Quantity Delta (+ Add / - Deduct)
                  </label>
                  <input
                    type="number"
                    required
                    value={adjustDelta}
                    onChange={(e) => setAdjustDelta(parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-aesthique-ivory/60 border border-aesthique-beige p-2.5 text-aesthique-espresso focus:outline-none focus:border-aesthique-gold font-mono text-sm"
                  />
                  <p className="text-[11px] text-aesthique-espresso/50">
                    Resulting Stock: {Math.max(0, adjustingProduct.stockQuantity + adjustDelta)} units
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="uppercase tracking-wider font-semibold text-aesthique-espresso block">
                    Audit Reason
                  </label>
                  <select
                    value={adjustReason}
                    onChange={(e) => setAdjustReason(e.target.value)}
                    className="w-full bg-aesthique-ivory/60 border border-aesthique-beige p-2.5 text-aesthique-espresso focus:outline-none focus:border-aesthique-gold"
                  >
                    <option value="Studio batch restock">Studio batch restock</option>
                    <option value="Stock take / Physical audit correction">Stock take / Physical audit correction</option>
                    <option value="Damaged in transit write-off">Damaged in transit write-off</option>
                    <option value="Studio sample withdrawal">Studio sample withdrawal</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-aesthique-beige">
                  <button
                    type="button"
                    onClick={() => setAdjustingProduct(null)}
                    className="px-4 py-2 uppercase tracking-wider font-semibold text-aesthique-espresso hover:text-black"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-aesthique-espresso text-aesthique-ivory px-5 py-2 uppercase tracking-wider font-semibold hover:bg-black transition-colors"
                  >
                    Apply Adjustment
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
