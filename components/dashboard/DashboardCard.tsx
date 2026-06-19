import { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  variant?: "default" | "success" | "warning" | "blue";
}

export default function DashboardCard({
  title,
  value,
  icon: Icon,
  variant = "default",
}: DashboardCardProps) {
  
  // Mapping warna berdasarkan variant
  const styles = {
    default: "bg-red-100 text-red-600",
    success: "bg-emerald-100 text-emerald-600",
    warning: "bg-amber-100 text-amber-600",
    blue: "bg-blue-100 text-blue-600",
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 font-medium">{title}</p>
          <h2 className="text-3xl font-bold text-slate-900 mt-2">{value}</h2>
        </div>

        <div className={`p-3 rounded-xl ${styles[variant]}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}