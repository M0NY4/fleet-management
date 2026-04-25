import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { 
  MapPin, Calendar, Truck, IndianRupee, Users, 
  ChevronRight, Info, CheckCircle2, Ticket, Plus, 
  ArrowRight, ShieldCheck, Zap, Clock
} from "lucide-react";
import { getRoutes, getVehicles } from "@/lib/api";
import { cn } from "@/lib/utils";

function FormSectionHeader({ icon: Icon, title, step, colorClass }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center font-black text-xs", colorClass)}>
        {step}
      </div>
      <div>
        <h3 className="text-sm font-black uppercase tracking-widest text-foreground flex items-center gap-2">
          <Icon className="h-4 w-4" /> {title}
        </h3>
      </div>
    </div>
  );
}

export default function CreateBookingPage() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  
  const [tripName, setTripName] = useState("");
  const [routePoints, setRoutePoints] = useState(["", ""]);
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 16));
  const [endDate, setEndDate] = useState(new Date(Date.now() + 86400000).toISOString().slice(0, 16));
  const [distanceKm, setDistanceKm] = useState(100);
  const [ratePerKm, setRatePerKm] = useState(25);
  const [totalSeats, setTotalSeats] = useState(50);
  const [selectedVehicle, setSelectedVehicle] = useState("");

  const totalRevenue = distanceKm * ratePerKm;

  useEffect(() => {
    getVehicles().then(setVehicles);
  }, []);

  const addRoutePoint = () => setRoutePoints([...routePoints, ""]);
  const removeRoutePoint = (index) => {
    if (routePoints.length > 2) {
      const newPoints = [...routePoints];
      newPoints.splice(index, 1);
      setRoutePoints(newPoints);
    }
  };

  const updateRoutePoint = (index, value) => {
    const newPoints = [...routePoints];
    newPoints[index] = value;
    setRoutePoints(newPoints);
  };

  const handleCreateTrip = () => {
    if (!tripName || routePoints.some(p => !p)) {
      toast.error("Validation Failed", { description: "Trip name and all route points are required." });
      return;
    }
    toast.success("Trip Created Successfully", { description: `${tripName} is now in UPCOMING status.` });
    setTimeout(() => navigate("/trips"), 1500);
  };

  return (
    <DashboardLayout>
      <PageLayout>
        <PageHeader 
          title="Create New Operation" 
          description="Initialize a new fleet trip with multi-stop route architecture." 
        />

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <div className="xl:col-span-3 space-y-12">
            
            {/* Step 1: Basic Identity */}
            <div className="bg-card border rounded-2xl p-6 shadow-sm border-primary/10">
              <FormSectionHeader icon={Truck} title="Basic Identity" step="01" colorClass="bg-primary text-primary-foreground" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Trip Name</Label>
                  <Input placeholder="e.g. Pune - Mumbai Corporate Shuttle" className="h-12 border-2" value={tripName} onChange={(e) => setTripName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Vehicle Allocation</Label>
                  <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                    <SelectTrigger className="h-12 border-2">
                      <SelectValue placeholder="Select Vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicles.map(v => (
                        <SelectItem key={v.id} value={String(v.id)}>{v.number} • {v.category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Seating Capacity</Label>
                  <Input type="number" className="h-12 border-2" value={totalSeats} onChange={(e) => setTotalSeats(e.target.value)} />
                </div>
                <div className="flex items-center gap-2 pt-8">
                   <Zap className="h-4 w-4 text-accent animate-pulse" />
                   <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Status will be set to UPCOMING</p>
                </div>
              </div>
            </div>

            {/* Step 2: Route Architecture */}
            <div className="bg-card border rounded-2xl p-6 shadow-sm border-secondary/10">
              <FormSectionHeader icon={MapPin} title="Route Architecture" step="02" colorClass="bg-secondary text-secondary-foreground" />
              <div className="space-y-4">
                {routePoints.map((point, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-1 space-y-1">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                        {index === 0 ? "Origin" : index === routePoints.length - 1 ? "Destination" : `Stop ${index}`}
                      </Label>
                      <div className="relative">
                        <MapPin className={cn("absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4", index === 0 ? "text-primary" : index === routePoints.length - 1 ? "text-emerald-500" : "text-muted-foreground")} />
                        <Input 
                          value={point} 
                          onChange={(e) => updateRoutePoint(index, e.target.value)} 
                          className="h-12 pl-10 border-2" 
                          placeholder={index === 0 ? "Starting Terminal" : index === routePoints.length - 1 ? "End Terminal" : "Intermediate Stop"} 
                        />
                      </div>
                    </div>
                    {routePoints.length > 2 && (
                      <Button variant="ghost" size="icon" className="mt-6 text-destructive hover:bg-destructive/10" onClick={() => removeRoutePoint(index)}>
                         <Plus className="h-4 w-4 rotate-45" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" className="w-full border-dashed border-2 py-6 mt-2 font-bold" onClick={addRoutePoint}>
                  <Plus className="h-4 w-4 mr-2" /> Add Intermediate Stop
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-8 border-t border-dashed">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Operational Start (Departure)</Label>
                  <Input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="h-12 border-2" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Operational End (ETA)</Label>
                  <Input type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="h-12 border-2" />
                </div>
              </div>
            </div>

            {/* Step 3: Commercial Parameters */}
            <div className="bg-card border rounded-2xl p-6 shadow-sm border-success/10">
              <FormSectionHeader icon={IndianRupee} title="Commercial Parameters" step="03" colorClass="bg-success text-success-foreground" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Estimated Distance (KM)</Label>
                  <Input type="number" value={distanceKm} onChange={(e) => setDistanceKm(e.target.value)} className="h-14 border-2 text-lg font-black" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Commercial Rate (₹ / KM)</Label>
                  <Input type="number" value={ratePerKm} onChange={(e) => setRatePerKm(e.target.value)} className="h-14 border-2 text-lg font-black" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Estimated Revenue</Label>
                  <div className="h-14 flex items-center justify-center border-2 border-dashed border-success/50 rounded-xl bg-success/5">
                     <span className="text-xl font-black text-success">₹{totalRevenue.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <Button onClick={handleCreateTrip} size="lg" className="w-full h-16 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 text-lg">
               Initialize & Publish Trip <ChevronRight className="h-6 w-6 ml-2" />
            </Button>
          </div>

          {/* Ticket Preview Card */}
          <div className="xl:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="bg-primary text-primary-foreground p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden border-4 border-primary">
                 <div className="absolute -left-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background" />
                 <div className="absolute -right-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background" />
                 
                 <div className="relative z-10 flex flex-col items-center">
                    <div className="bg-accent text-accent-foreground p-3 rounded-2xl mb-6 shadow-lg">
                       <Ticket className="h-6 w-6" />
                    </div>
                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] mb-8 text-white/50">Trip Token</h2>
                    
                    <div className="w-full space-y-8">
                       <div className="text-center">
                          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Assignment</p>
                          <p className="text-xl font-black truncate">{tripName || "Operational Draft"}</p>
                       </div>

                       <div className="flex items-center justify-between border-y border-white/10 py-6">
                          <div className="text-center flex-1">
                             <p className="text-[10px] font-bold text-white/40 uppercase">Origin</p>
                             <p className="text-xs font-black truncate uppercase">{routePoints[0] || "TBD"}</p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-accent mx-2" />
                          <div className="text-center flex-1">
                             <p className="text-[10px] font-bold text-white/40 uppercase">Destination</p>
                             <p className="text-xs font-black truncate uppercase">{routePoints[routePoints.length - 1] || "TBD"}</p>
                          </div>
                       </div>

                       <div className="grid grid-cols-2 gap-4">
                          <div>
                             <p className="text-[10px] font-bold text-white/40 uppercase">Departure</p>
                             <p className="text-[10px] font-black">{startDate ? new Date(startDate).toLocaleDateString() : "--/--/--"}</p>
                          </div>
                          <div className="text-right">
                             <p className="text-[10px] font-bold text-white/40 uppercase">Arrival</p>
                             <p className="text-[10px] font-black">{endDate ? new Date(endDate).toLocaleDateString() : "--/--/--"}</p>
                          </div>
                       </div>

                       <div className="pt-8 border-t border-dashed border-white/20 text-center">
                          <p className="text-[10px] font-bold text-white/40 uppercase mb-1">Contract Est.</p>
                          <p className="text-3xl font-black text-accent tracking-tighter">₹{totalRevenue.toLocaleString()}</p>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    </DashboardLayout>
  );
}

