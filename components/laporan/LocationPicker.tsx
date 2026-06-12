"use client";

import { useEffect, useState } from "react";
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
      map.setView([lat, lng], map.getZoom(), { animate: true });
    }
  }, [lat, lng, map]);
  
  return null;
}

// 3. Komponen untuk kotak pencarian alamat (Sudah Di-Fix Safe DOM-nya)
function SearchField({
  onChange,
}: {
  onChange: (lat: number, lng: number) => void;
}) {
  const map = useMap();

  useEffect(() => {
    // 🛡️ Pengaman: Jangan jalankan apa pun jika peta belum siap / di luar lingkungan browser
    if (!map || typeof window === "undefined") return;

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

    let isMounted = true;

    const delayAdd = setTimeout(() => {
      try {
        if (isMounted && map) {
          map.addControl(searchControl);
        }
      } catch (err) {
        console.error("Gagal menempelkan kontrol pencarian:", err);
      }
    }, 100);

    const handleSearchShow = (result: any) => {
      if (result && result.location) {
        onChange(result.location.y, result.location.x);
      }
    };

    map.on("geosearch/showlocation", handleSearchShow);

    // Fungsi pembersihan saat komponen dibongkar (Unmount)
    return () => {
      isMounted = false;
      clearTimeout(delayAdd);
      map.off("geosearch/showlocation", handleSearchShow);
      
      try {
        // 🛡️ Cek eksistensi control sebelum dilepas agar terhindar dari error appendChild/removeChild
        if (map && searchControl && typeof map.removeControl === "function") {
          map.removeControl(searchControl);
        }
      } catch (err) {
        console.warn("Pembersihan kontrol pencarian diabaikan aman:", err);
      }
    };
  }, [map, onChange]);

  return null;
}

export default function LocationPicker({
  latitude,
  longitude,
  onChange,
}: LocationPickerProps) {
  // Tambahan state pengaman client-side hydration
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Parsing koordinat dengan fallback ke Jakarta Pusat jika data kosong
  const lat = Number(latitude) || -6.2088;
  const lng = Number(longitude) || 106.8456;

  if (!mounted) {
    return (
      <div style={{ height: "450px" }} className="w-full bg-neutral-100 animate-pulse rounded-xl flex items-center justify-center text-sm text-neutral-400">
        Menyiapkan modul peta digital...
      </div>
    );
  }

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
        {latitude && longitude && !isNaN(lat) && !isNaN(lng) && (
          <Marker 
            position={[lat, lng]} 
            icon={defaultIcon} 
            eventHandlers={{
              add: (e) => {
                const marker = e.target;
                if (marker && marker.options) {
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