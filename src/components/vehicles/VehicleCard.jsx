import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Truck, Factory } from "lucide-react";
import { cn } from "@/lib/utils";

export function VehicleCard({ vehicle, onClick }) {
  return (
    <Card 
      className="overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300 border-none bg-white/50 backdrop-blur-sm"
      onClick={() => onClick(vehicle)}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={vehicle.image} 
          alt={vehicle.model} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <Badge 
          className={cn(
            "absolute top-4 right-4 font-bold uppercase tracking-widest text-[10px]",
            vehicle.status === "Active" ? "bg-emerald-500 hover:bg-emerald-600" : "bg-amber-500 hover:bg-amber-600"
          )}
        >
          {vehicle.status}
        </Badge>
        <div className="absolute bottom-4 left-4 text-white">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70 mb-1">{vehicle.category}</p>
          <h3 className="text-xl font-black tracking-tight">{vehicle.model}</h3>
        </div>
      </div>
      <CardContent className="p-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/5 text-primary">
              <Factory className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase">Manufacturer</p>
              <p className="text-xs font-black text-foreground">{vehicle.manufacturer}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/5 text-primary">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase">Capacity</p>
              <p className="text-xs font-black text-foreground">{vehicle.seatingCapacity} Seats</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
