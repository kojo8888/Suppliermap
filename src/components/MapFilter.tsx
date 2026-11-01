'use client';

import { useState } from 'react';

export interface FilterState {
  suppliers: boolean;
  subSuppliers: boolean;
}

interface MapFilterProps {
  onFilterChange: (filters: FilterState) => void;
}

export function MapFilter({ onFilterChange }: MapFilterProps) {
  const [showSuppliers, setShowSuppliers] = useState(true);
  const [showSubSuppliers, setShowSubSuppliers] = useState(true);

  const handleChange = (type: 'suppliers' | 'subSuppliers', value: boolean) => {
    const newFilters = {
      suppliers: type === 'suppliers' ? value : showSuppliers,
      subSuppliers: type === 'subSuppliers' ? value : showSubSuppliers,
    };
    if (type === 'suppliers') setShowSuppliers(value);
    if (type === 'subSuppliers') setShowSubSuppliers(value);
    onFilterChange(newFilters);
  };

  return (
    <div className="flex gap-4 p-4 bg-white rounded shadow">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={showSuppliers}
          onChange={(e) => handleChange('suppliers', e.target.checked)}
          className="w-4 h-4"
        />
        <span className="text-blue-600 font-medium">Suppliers</span>
      </label>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={showSubSuppliers}
          onChange={(e) => handleChange('subSuppliers', e.target.checked)}
          className="w-4 h-4"
        />
        <span className="text-orange-600 font-medium">Sub-suppliers</span>
      </label>
    </div>
  );
}
