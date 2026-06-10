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
// Jangan lupa import CSS bawaan geosearch biar kotak inputnya rapi
import "leaflet-geosearch/dist/geosearch.css";

// Fix icon marker bawaan Leaflet yang sering ngebug/hilang di Next.js
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

// 1. Komponen untuk menangani klik manual di peta
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

// 2. Komponen baru untuk memunculkan kotak pencarian alamat
function SearchField({
  onChange,
}: {
  onChange: (lat: number, lng: number) => void;
}) {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();

    // @ts-ignore
    const searchControl = new GeoSearchControl({
      provider: provider,
      style: "bar", // Model kotak input memanjang
      showMarker: false, // Kita set false karena pin-nya bakal dikontrol sama state komponen utama kita
      showPopup: false,
      marker: { icon: defaultIcon },
      retainZoomLevel: false,
      animateZoom: true,
      keepResult: true,
      searchLabel: "Cari lokasi / nama jalan...",
    });

    map.addControl(searchControl);

    // Event ketika user memilih lokasi dari hasil pencarian
    map.on("geosearch/showlocation", (result: any) => {
      onChange(result.location.y, result.location.x); // y = lat, x = lng
    });

    return () => {
      map.removeControl(searchControl);
    };
  }, [map, onChange]);

  return null;
}

export default function LocationPicker({
  latitude,
  longitude,
  onChange,
}: LocationPickerProps) {
  // Default koordinat Jakarta jika data masih kosong
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

        {/* Pasang fitur pendeteksi klik manual */}
        <LocationMarker onChange={onChange} />

        {/* Pasang fitur kotak pencarian lokasi */}
        <SearchField onChange={onChange} />

        {/* Tampilkan pin/marker hanya jika koordinat sudah ada */}
        {latitude && longitude && (
          <Marker position={[lat, lng]} icon={defaultIcon} />
        )}
      </MapContainer>
    </div>
  );
}