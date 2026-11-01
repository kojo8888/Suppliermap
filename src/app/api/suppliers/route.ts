import { NextResponse } from 'next/server';
import { parseExcelFile } from '@/lib/parseExcel';
import { geocodeSuppliers } from '@/lib/geocode';
import { DATA_PATHS } from '@/lib/config';
import { GeocodedSupplier } from '@/lib/types';

let cachedSuppliers: GeocodedSupplier[] | null = null;

export async function GET() {
  if (cachedSuppliers) {
    return NextResponse.json(cachedSuppliers);
  }

  try {
    const suppliers = parseExcelFile(DATA_PATHS.suppliers, 'supplier');
    const subSuppliers = parseExcelFile(DATA_PATHS.subSuppliers, 'sub-supplier');

    const allSuppliers = [...suppliers, ...subSuppliers];
    const geocoded = await geocodeSuppliers(allSuppliers);

    cachedSuppliers = geocoded;

    return NextResponse.json(geocoded);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to load suppliers';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
