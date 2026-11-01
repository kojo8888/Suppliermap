'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useSuppliers } from '@/hooks/useSuppliers';
import { MapFilter, FilterState } from '@/components/MapFilter';

const SupplierMap = dynamic(
  () => import('@/components/SupplierMap').then((mod) => mod.SupplierMap),
  { ssr: false }
);

export default function Home() {
  const { suppliers, loading, error } = useSuppliers();
  const [filters, setFilters] = useState<FilterState>({
    suppliers: true,
    subSuppliers: true,
  });

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((supplier) => {
      if (supplier.type === 'supplier' && !filters.suppliers) return false;
      if (supplier.type === 'sub-supplier' && !filters.subSuppliers) return false;
      return true;
    });
  }, [suppliers, filters]);

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-white shadow-sm p-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">Supplier Map</h1>
        <MapFilter onFilterChange={setFilters} />
      </header>
      <main className="flex-1 relative">
        {loading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-600">Loading suppliers...</p>
            </div>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 bg-white flex items-center justify-center z-10">
            <div className="text-center p-8 max-w-md">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-red-600 text-2xl">!</span>
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Failed to load suppliers
              </h2>
              <p className="text-gray-600">{error}</p>
            </div>
          </div>
        )}
        <SupplierMap suppliers={filteredSuppliers} />
      </main>
    </div>
  );
}
