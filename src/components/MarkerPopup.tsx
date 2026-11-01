'use client';

import { GeocodedSupplier } from '@/lib/types';

interface MarkerPopupProps {
  supplier: GeocodedSupplier;
}

export function MarkerPopup({ supplier }: MarkerPopupProps) {
  return (
    <div className="min-w-[200px]">
      <h3 className="font-semibold text-gray-900">{supplier.name}</h3>
      <p className="text-sm text-gray-600 mt-1">{supplier.address}</p>
      <span
        className={`inline-block mt-2 px-2 py-0.5 text-xs rounded-full ${
          supplier.type === 'supplier'
            ? 'bg-blue-100 text-blue-800'
            : 'bg-orange-100 text-orange-800'
        }`}
      >
        {supplier.type === 'supplier' ? 'Supplier' : 'Sub-supplier'}
      </span>
    </div>
  );
}
