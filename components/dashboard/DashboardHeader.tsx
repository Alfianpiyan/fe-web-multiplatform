interface DashboardHeaderProps {
  title: string;
  description: string;
}

export default function DashboardHeader({
  title,
  description,
}: DashboardHeaderProps) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900">
        {title}
      </h1>

      <p className="text-slate-600 mt-2">
        {description}
      </p>
    </div>
  );
}