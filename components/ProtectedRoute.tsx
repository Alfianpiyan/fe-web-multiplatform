"use client";

import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // KUNCINYA DI SINI:
    // Pastikan loading benar-benar SELESAI sebelum memutuskan untuk nendang user
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Kalau masih loading, TUNGGU, jangan nendang dulu!
  if (loading) return <div>Memuat...</div>;

  return user ? <>{children}</> : null;
}