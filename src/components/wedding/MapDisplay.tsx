import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapDisplayProps {
  position: [number, number];
  locationName: string;
  mapType?: 'map' | 'satellite';
}

// Fix default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export function MapDisplay({ position, locationName, mapType = 'map' }: MapDisplayProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Initialize map
    mapRef.current = L.map(containerRef.current).setView(position, 15);

    // Add tile layer
    const tileUrl = mapType === 'map'
      ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

    tileLayerRef.current = L.tileLayer(tileUrl, {
      attribution: mapType === 'map'
        ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        : '&copy; Esri'
    }).addTo(mapRef.current);

    // Add marker
    markerRef.current = L.marker(position)
      .addTo(mapRef.current)
      .bindPopup(locationName);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update tile layer when mapType changes
  useEffect(() => {
    if (!mapRef.current || !tileLayerRef.current) return;

    const tileUrl = mapType === 'map'
      ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

    tileLayerRef.current.setUrl(tileUrl);
  }, [mapType]);

  // Update marker position when position changes
  useEffect(() => {
    if (!mapRef.current || !markerRef.current) return;

    markerRef.current.setLatLng(position);
    mapRef.current.setView(position, 15);
  }, [position]);

  return <div ref={containerRef} className="w-full h-full" />;
}
