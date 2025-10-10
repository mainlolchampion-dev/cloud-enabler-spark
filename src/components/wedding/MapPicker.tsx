import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Map as MapIcon, Satellite } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface MapPickerProps {
  label: string;
  locationName: string;
  onLocationNameChange: (name: string) => void;
  position: [number, number] | null;
  onPositionChange: (position: [number, number]) => void;
}

export function MapPicker({
  label,
  locationName,
  onLocationNameChange,
  position,
  onPositionChange,
}: MapPickerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [mapType, setMapType] = useState<"map" | "satellite">("map");
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const center: [number, number] = [39.074208, 21.824312]; // Greece center

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map
    const map = L.map(mapContainerRef.current).setView(position || center, position ? 15 : 6);
    mapRef.current = map;

    // Add tile layer
    const tileLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // Add click event
    map.on("click", (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      onPositionChange([lat, lng]);
    });

    // Add initial marker if position exists
    if (position) {
      markerRef.current = L.marker(position).addTo(map);
    }

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  // Update marker when position changes
  useEffect(() => {
    if (!mapRef.current) return;

    if (position) {
      if (markerRef.current) {
        markerRef.current.setLatLng(position);
      } else {
        markerRef.current = L.marker(position).addTo(mapRef.current);
      }
      mapRef.current.setView(position, 15);
    } else if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }
  }, [position]);

  // Update tile layer when map type changes
  useEffect(() => {
    if (!mapRef.current) return;

    // Remove existing tile layers
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        layer.remove();
      }
    });

    // Add new tile layer based on type
    if (mapType === "satellite") {
      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          attribution: "Tiles &copy; Esri",
        }
      ).addTo(mapRef.current);
    } else {
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(mapRef.current);
    }

    // Re-add marker on top of new tile layer
    if (position && markerRef.current) {
      markerRef.current.remove();
      markerRef.current = L.marker(position).addTo(mapRef.current);
    }
  }, [mapType, position]);

  const handleSearch = async () => {
    if (!searchQuery) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery + ", Greece"
        )}`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        onPositionChange([parseFloat(lat), parseFloat(lon)]);
      }
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">{label}</label>
        <Input
          value={locationName}
          onChange={(e) => onLocationNameChange(e.target.value)}
          placeholder="Πληκτρολογήστε το όνομα της Εκκλησίας που θα γίνει το μυστήριο."
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Τοποθεσία στον Χάρτη</label>
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Αναζήτηση τοποθεσίας/ναού..."
        />

        <div className="flex gap-2">
          <Button
            type="button"
            variant={mapType === "map" ? "default" : "outline"}
            size="sm"
            onClick={() => setMapType("map")}
          >
            <MapIcon className="w-4 h-4 mr-2" />
            Χάρτης
          </Button>
          <Button
            type="button"
            variant={mapType === "satellite" ? "default" : "outline"}
            size="sm"
            onClick={() => setMapType("satellite")}
          >
            <Satellite className="w-4 h-4 mr-2" />
            Δορυφόρος
          </Button>
        </div>

        <div ref={mapContainerRef} className="h-80 rounded-lg overflow-hidden border" />
      </div>
    </div>
  );
}
