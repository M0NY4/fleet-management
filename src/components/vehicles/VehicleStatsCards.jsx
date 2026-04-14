import { Truck, CheckCircle2, AlertTriangle, Clock } from "lucide-react";
import { StatsCard } from "@/components/layout/StatsCard";

export function VehicleStatsCards({ vehicles = [] }) {
  const stats = {
    total: vehicles.length,
    active: vehicles.filter(v => v.status === "Active").length,
    maintenance: vehicles.filter(v => v.status === "Maintenance" || v.status === "In Service").length,
    available: vehicles.filter(v => v.status === "Active" || v.status === "Available").length,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full items-stretch">
      <StatsCard 
        title="Total Fleet" 
        value={stats.total} 
        icon={Truck} 
        colorClass="bg-primary text-primary" 
        subValue="Units"
      />
      <StatsCard 
        title="Active Now" 
        value={stats.active} 
        icon={CheckCircle2} 
        colorClass="bg-green-500 text-green-500" 
        subValue={`${Math.round((stats.active/stats.total)*100 || 0)}%`}
      />
      <StatsCard 
        title="Maintenance" 
        value={stats.maintenance} 
        icon={AlertTriangle} 
        colorClass="bg-orange-500 text-orange-500" 
        subValue="Attention"
      />
      <StatsCard 
        title="Available" 
        value={stats.available} 
        icon={Clock} 
        colorClass="bg-indigo-500 text-indigo-500" 
        subValue="Ready"
      />
    </div>
  );
}
