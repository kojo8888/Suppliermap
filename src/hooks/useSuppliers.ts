'use client';

import { useState, useEffect } from 'react';
import { GeocodedSupplier } from '@/lib/types';

interface UseSuppliers {
  suppliers: GeocodedSupplier[];
  loading: boolean;
  error: string | null;
}

export function useSuppliers(): UseSuppliers {
  const [suppliers, setSuppliers] = useState<GeocodedSupplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSuppliers() {
      try {
        const response = await fetch('/api/suppliers');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch suppliers');
        }

        setSuppliers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchSuppliers();
  }, []);

  return { suppliers, loading, error };
}
