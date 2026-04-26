import { useParams } from "react-router-dom";
import { useTripData } from "@/hooks/useTripData";
import { TripPageLayout } from "@/components/trips/TripPageLayout";
import { Card } from "@/components/ui/card";
import { Calendar, MapPin, IndianRupee } from "lucide-react";
import { cn } from "@/lib/utils";

function DetailItem({ label, value, icon: Icon, colorClass }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/40">
      <div className={cn("p-2 rounded-md", colorClass || "bg-primary/10 text-primary")}>
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">{label}</p>
        <p className="text-sm font-bold text-foreground">{value}</p>
      </div>
    </div>
  );
}

export default function TripLogisticsPage() {
  const { tripId } = useParams();
  const { trip, loading } = useTripData(tripId);

  return (
    <TripPageLayout trip={trip} loading={loading}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Card className="p-8 border-none shadow-2xl bg-white rounded-[2.5rem]">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Route Architecture</p>
           <div className="space-y-6 border-l-2 border-slate-100 pl-8 ml-1">
              {(trip?.routePoints || []).map((p, i, arr) => (
                 <div key={i} className="relative">
                    <div className={cn("absolute -left-[37px] top-1.5 h-4 w-4 rounded-full border-4 border-white shadow-md", i===0 ? "bg-blue-500" : i===arr.length-1 ? "bg-emerald-500" : "bg-slate-300")} />
                    <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{p}</p>
                 </div>
              ))}
           </div>
        </Card>
        <div className="grid grid-cols-1 gap-4">
           <DetailItem label="Schedule" value={new Date(trip?.startDate).toLocaleString()} icon={Calendar} colorClass="bg-blue-50 text-blue-600" />
           <DetailItem label="Distance" value={`${trip?.distanceKm} KM`} icon={MapPin} colorClass="bg-indigo-50 text-indigo-600" />
           <DetailItem label="Commercial Rate" value={`₹${trip?.ratePerKm} / KM`} icon={IndianRupee} colorClass="bg-emerald-50 text-emerald-600" />
        </div>
      </div>
    </TripPageLayout>
  );
}
