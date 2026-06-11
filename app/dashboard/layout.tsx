import Sidebar from "@/components/dashboard/Sidebar"; // Sesuaikan path import sidebar kamu

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar diam di kiri */}
      <Sidebar />

      {/* Area Konten Kanan yang bisa di-scroll bebas */}
      {/* ml-72 digunakan untuk memberikan ruang kosong sebesar lebar sidebar (w-72) */}
      <main className="flex-1 ml-72 p-8 overflow-y-auto h-screen">
        {children}
      </main>
    </div>
  );
}