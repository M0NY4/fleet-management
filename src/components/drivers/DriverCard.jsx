import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, Calendar, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function DriverCard({ driver, onClick }) {
  return (
    <Card 
      className="overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300 border-none bg-white/50 backdrop-blur-sm"
      onClick={() => onClick(driver)}
    >
      <div className="relative h-48 overflow-hidden bg-primary/5">
        <img 
          src={driver.image || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=400"} 
          alt={driver.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <Badge 
          className={cn(
            "absolute top-4 right-4 font-bold uppercase tracking-widest text-[10px]",
            driver.status === "Active" ? "bg-emerald-500 hover:bg-emerald-600" : "bg-amber-500 hover:bg-amber-600"
          )}
        >
          {driver.status}
        </Badge>
        <div className="absolute bottom-4 left-4 text-white">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70 mb-1">Driver ID: #{driver.id}</p>
          <h3 className="text-xl font-black tracking-tight">{driver.name}</h3>
        </div>
      </div>
      <CardContent className="p-5">
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/5 text-primary">
              <Phone className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase">Phone Number</p>
              <p className="text-sm font-black text-foreground tracking-tight">{driver.phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/5 text-primary">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase">Date of Birth</p>
              <p className="text-sm font-black text-foreground">{driver.dob || "N/A"}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
