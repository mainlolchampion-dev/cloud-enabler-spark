import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Map, Satellite } from "lucide-react";
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

function LocationMarker({
  position,
  setPosition,
}: {
  position: [number, number] | null;
  setPosition: (pos: [number, number]) => void;
}) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position ? <Marker position={position} /> : null;
}

function MapUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  return null;
}


export function MapPicker({
  label,
  locationName,
  onLocationNameChange,
  position,
  onPositionChange,
}: MapPickerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [mapType, setMapType] = useState("map");
  const center: [number, number] = [39.074208, 21.824312]; // Greece center

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
            <Map className="w-4 h-4 mr-2" />
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

        <div className="h-80 rounded-lg overflow-hidden border">
          <MapContainer
            center={position || center}
            zoom={position ? 15 : 6}
            className="h-full w-full"
          >
            <TileLayer
              url={
                mapType === "satellite"
                  ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              }
              attribution={
                mapType === "satellite"
                  ? "Tiles &copy; Esri"
                  : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              }
            />
            <LocationMarker position={position} setPosition={onPositionChange} />
            <MapUpdater 
              center={position || center} 
              zoom={position ? 15 : 6} 
            />
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
