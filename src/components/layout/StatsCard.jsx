import { cn } from "@/lib/utils";

export function StatsCard({ title, value, icon: Icon, colorClass, className, subValue }) {
  return (
    <div className={cn("bg-white border shadow-sm rounded-xl p-5 flex items-center justify-between gap-4 transition-all duration-200 hover:shadow-md", className)}>
      <div className="flex flex-col gap-1">
        <p className="text-2xl font-black text-gray-900 tracking-tight">{value}</p>
        <div className="flex items-center gap-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 leading-none">{title}</p>
          {subValue && <span className="text-[10px] font-bold text-gray-500 ring-1 ring-border px-1.5 py-0.5 rounded-md bg-gray-50">{subValue}</span>}
        </div>
      </div>
      {Icon && (
        <div className={cn("p-3 rounded-xl flex items-center justify-center flex-shrink-0 bg-opacity-10", colorClass)}>
          <Icon className="h-6 w-6" />
        </div>
      )}
    </div>
  );
}
