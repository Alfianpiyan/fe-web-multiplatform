"use client";

import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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

function LocationMarker({ onChange }: { onChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function MapRecenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], map.getZoom(), { animate: true });
    }
  }, [lat, lng, map]);
  return null;
}

// SearchField dimuat lazy pakai dynamic import agar GeoSearchControl
// tidak di-instantiate sebelum window & container DOM benar-benar siap
function SearchFieldInner({ onChange }: { onChange: (lat: number, lng: number) => void }) {
  const map = useMap();
  const controlRef = useRef<any>(null);

  useEffect(() => {
    if (!map || typeof window === "undefined") return;

    let cancelled = false;

    const initSearch = async () => {
      try {
        // Import dinamis di dalam effect — dijamin jalan setelah DOM siap
        const { GeoSearchControl, OpenStreetMapProvider } = await import("leaflet-geosearch");
        await import("leaflet-geosearch/dist/geosearch.css");

        if (cancelled || !map.getContainer()) return;

        const provider = new OpenStreetMapProvider();
        // @ts-ignore
        const control = new GeoSearchControl({
          provider,
          style: "bar",
          showMarker: false,
          showPopup: false,
          retainZoomLevel: false,
          animateZoom: true,
          keepResult: true,
          searchLabel: "Cari lokasi / nama jalan...",
        });

        controlRef.current = control;
        map.addControl(control);

        const handleResult = (result: any) => {
          if (result?.location) {
            onChange(result.location.y, result.location.x);
          }
        };

        map.on("geosearch/showlocation", handleResult);

        // Simpan handler agar bisa di-off saat cleanup
        (control as any)._resultHandler = handleResult;
      } catch (err) {
        console.warn("GeoSearch gagal dimuat:", err);
      }
    };

    // Tunggu peta benar-benar ready sebelum mount control
    map.whenReady(() => {
      initSearch();
    });

    return () => {
      cancelled = true;
      try {
        if (controlRef.current && map) {
          const handler = controlRef.current._resultHandler;
          if (handler) map.off("geosearch/showlocation", handler);
          map.removeControl(controlRef.current);
          controlRef.current = null;
        }
      } catch (err) {
        // Abaikan error saat unmount — normal terjadi saat Fast Refresh
      }
    };
  }, [map, onChange]);

  return null;
}

export default function LocationPicker({ latitude, longitude, onChange }: LocationPickerProps) {
  const [mounted, setMounted] = useState(false);
  // Key unik untuk paksa recreate MapContainer saat komponen mount ulang
  // Ini mencegah error "Map container is being reused by another instance"
  const mapKeyRef = useRef(`map-${Date.now()}`);

  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
    };
  }, []);

  const lat = Number(latitude) || -6.2088;
  const lng = Number(longitude) || 106.8456;

  if (!mounted) {
    return (
      <div
        style={{ height: "450px" }}
        className="w-full bg-neutral-100 animate-pulse rounded-xl flex items-center justify-center text-sm text-neutral-400"
      >
        Menyiapkan modul peta digital...
      </div>
    );
  }

  return (
    <div className="w-full relative rounded-xl overflow-hidden border border-gray-200 shadow-sm">
      <MapContainer
        key={mapKeyRef.current}
        center={[lat, lng]}
        zoom={13}
        style={{ height: "450px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker onChange={onChange} />
        <SearchFieldInner onChange={onChange} />
        <MapRecenter lat={lat} lng={lng} />
        {latitude && longitude && !isNaN(lat) && !isNaN(lng) && (
          <Marker position={[lat, lng]} icon={defaultIcon} />
        )}
      </MapContainer>
    </div>
  );
}