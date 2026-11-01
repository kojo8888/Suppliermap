import { Coordinates, Supplier, GeocodedSupplier } from './types';

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
const RATE_LIMIT_MS = 1000;

let lastRequestTime = 0;

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForRateLimit(): Promise<void> {
  const now = Date.now();
  const elapsed = now - lastRequestTime;
  if (elapsed < RATE_LIMIT_MS) {
    await delay(RATE_LIMIT_MS - elapsed);
  }
  lastRequestTime = Date.now();
}

export async function geocodeAddress(
  address: string
): Promise<Coordinates | null> {
  await waitForRateLimit();

  try {
    const params = new URLSearchParams({
      q: address,
      format: 'json',
      limit: '1',
    });

    const response = await fetch(`${NOMINATIM_URL}?${params}`, {
      headers: {
        'User-Agent': 'SupplierMap/1.0',
      },
    });

    if (!response.ok) {
      console.error(`Geocoding failed for "${address}": ${response.status}`);
      return null;
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      console.warn(`No results for address: ${address}`);
      return null;
    }

    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
    };
  } catch (error) {
    console.error(`Geocoding error for "${address}":`, error);
    return null;
  }
}

export async function geocodeSuppliers(
  suppliers: Supplier[]
): Promise<GeocodedSupplier[]> {
  const results: GeocodedSupplier[] = [];

  for (const supplier of suppliers) {
    const coords = await geocodeAddress(supplier.address);
    if (coords) {
      results.push({
        ...supplier,
        lat: coords.lat,
        lng: coords.lng,
      });
    }
  }

  return results;
}
