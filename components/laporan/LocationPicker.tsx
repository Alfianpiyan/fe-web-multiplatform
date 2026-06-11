"use client";

import { useEffect } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";

// Fix icon marker bawaan Leaflet agar tidak hilang di Next.js
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface LocationPickerProps {
  latitude: string;
  longitude: string;
  onChange: (lat: number, lng: number) => void;
}

// 1. Komponen untuk menangani KLIK MANUAL di peta
function LocationMarker({
  onChange,
}: {
  onChange: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      // Mengambil koordinat pas diklik oleh user
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// 2. Komponen untuk sinkronisasi posisi peta agar PIN-nya mau pindah & center otomatis
function MapRecenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  
  useEffect(() => {
    if (lat && lng) {
      // Memaksa peta bergeser ke tempat yang diklik/dicari secara halus
      map.setView([lat, lng], map.getZoom(), { animate: true });
    }
  }, [lat, lng, map]);
  
  return null;
}

// 3. Komponen untuk kotak pencarian alamat
function SearchField({
  onChange,
}: {
  onChange: (lat: number, lng: number) => void;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const provider = new OpenStreetMapProvider();

    // @ts-ignore
    const searchControl = new GeoSearchControl({
      provider: provider,
      style: "bar",
      showMarker: false,
      showPopup: false,
      marker: { icon: defaultIcon },
      retainZoomLevel: false,
      animateZoom: true,
      keepResult: true,
      searchLabel: "Cari lokasi / nama jalan...",
    });

    // Timeout tipis agar Leaflet selesai inisialisasi DOM-nya duluan
    const delayAdd = setTimeout(() => {
      try {
        map.addControl(searchControl);
      } catch (err) {
        console.error(err);
      }
    }, 50);

    map.on("geosearch/showlocation", (result: any) => {
      onChange(result.location.y, result.location.x);
    });

    return () => {
      clearTimeout(delayAdd);
      map.off("geosearch/showlocation");
      try {
        map.removeControl(searchControl);
      } catch (err) {}
    };
  }, [map, onChange]);

  return null;
}

export default function LocationPicker({
  latitude,
  longitude,
  onChange,
}: LocationPickerProps) {
  // Parsing koordinat dengan fallback ke Jakarta Pusat jika data kosong
  const lat = Number(latitude) || -6.2088;
  const lng = Number(longitude) || 106.8456;

  return (
    <div className="w-full relative rounded-xl overflow-hidden border border-gray-200 shadow-sm">
      <MapContainer
        center={[lat, lng]}
        zoom={13}
        style={{
          height: "450px",
          width: "100%",
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Pemantau klik manual */}
        <LocationMarker onChange={onChange} />

        {/* Pemantau ketikan kotak pencarian */}
        <SearchField onChange={onChange} />

        {/* Penggerak kamera peta otomatis */}
        <MapRecenter lat={lat} lng={lng} />

        {/* Pin merah hanya muncul jika string latitude & longitude valid */}
        {latitude && longitude && (
          <Marker 
            position={[lat, lng]} 
            icon={defaultIcon} 
            eventHandlers={{
              add: (e) => {
                // Mengakses objek marker asli Leaflet secara langsung saat di-render
                const marker = e.target;
                if (marker.options) {
                  marker.options.autoPan = false;
                }
              }
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}