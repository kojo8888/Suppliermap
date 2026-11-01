'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import { MAP_CONFIG } from '@/lib/config';
import { GeocodedSupplier, SupplierType } from '@/lib/types';
import { MarkerPopup } from './MarkerPopup';
import 'leaflet/dist/leaflet.css';

const supplierIcon = new L.Icon({
  iconUrl: '/markers/supplier.svg',
  iconSize: [24, 36],
  iconAnchor: [12, 36],
  popupAnchor: [0, -36],
});

const subSupplierIcon = new L.Icon({
  iconUrl: '/markers/sub-supplier.svg',
  iconSize: [24, 36],
  iconAnchor: [12, 36],
  popupAnchor: [0, -36],
});

function getIcon(type: SupplierType): L.Icon {
  return type === 'supplier' ? supplierIcon : subSupplierIcon;
}

interface SupplierMapProps {
  suppliers: GeocodedSupplier[];
}

export function SupplierMap({ suppliers }: SupplierMapProps) {
  return (
    <MapContainer
      center={[MAP_CONFIG.center.lat, MAP_CONFIG.center.lng]}
      zoom={MAP_CONFIG.zoom}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerClusterGroup chunkedLoading>
        {suppliers.map((supplier, index) => (
          <Marker
            key={index}
            position={[supplier.lat, supplier.lng]}
            icon={getIcon(supplier.type)}
          >
            <Popup>
              <MarkerPopup supplier={supplier} />
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
}
