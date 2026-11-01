export type SupplierType = 'supplier' | 'sub-supplier';

export interface Supplier {
  name: string;
  address: string;
  type: SupplierType;
}

export interface GeocodedSupplier extends Supplier {
  lat: number;
  lng: number;
}

export interface Coordinates {
  lat: number;
  lng: number;
}
