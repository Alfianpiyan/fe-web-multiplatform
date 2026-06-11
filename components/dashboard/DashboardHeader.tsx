interface DashboardHeaderProps {
  title: string;
  description?: string;
}

export default function DashboardHeader({ title, description }: DashboardHeaderProps) {
  return (
    <div className="border-b border-slate-100 pb-4 mb-6">
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
        {title}
      </h1>
      {description && (
        <p className="text-sm text-slate-500 mt-1 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}