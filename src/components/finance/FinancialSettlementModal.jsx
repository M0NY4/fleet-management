import { useState, useEffect } from "react";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, 
  DialogFooter, DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IndianRupee, TrendingUp, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function FinancialSettlementModal({ trip, trigger, onFinalize }) {
  const [open, setOpen] = useState(false);
  const [settlement, setSettlement] = useState({
    fuel: "",
    tolls: "",
    parking: "",
    cleaning: "",
    stateTax: "",
    policeTax: "",
    foodHotel: "",
    allowance: ""
  });

  // Load existing settlement data if any
  useEffect(() => {
    if (open && trip) {
      const settlements = JSON.parse(localStorage.getItem("trip_settlements") || "[]");
      const existing = settlements.find(s => String(s.tripId) === String(trip.id));
      if (existing) {
        setSettlement({
          fuel: existing.fuel || "",
          tolls: existing.tolls || "",
          parking: existing.parking || "",
          cleaning: existing.cleaning || "",
          stateTax: existing.stateTax || "",
          policeTax: existing.policeTax || "",
          foodHotel: existing.foodHotel || "",
          allowance: existing.allowance || ""
        });
      }
    }
  }, [open, trip]);

  const handleFinalize = () => {
    const settlementData = {
      tripId: trip.id,
      ...settlement,
      totalCollection: (trip.distanceKm * trip.ratePerKm) || 0,
      finalizedAt: new Date().toISOString()
    };
    
    const existing = JSON.parse(localStorage.getItem("trip_settlements") || "[]");
    localStorage.setItem("trip_settlements", JSON.stringify([...existing.filter(s => String(s.tripId) !== String(trip.id)), settlementData]));
    
    toast.success("Financials Finalized", { description: "Trip settlement data has been synced to the ledger." });
    setOpen(false);
    if (onFinalize) onFinalize(settlementData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl rounded-[2.5rem]" onClick={(e) => e.stopPropagation()}>
         <DialogHeader>
            <DialogTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
               <IndianRupee className="h-5 w-5 text-emerald-600" /> Financial Settlement: {trip.name}
            </DialogTitle>
         </DialogHeader>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
            {/* Collection Summary */}
            <div className="space-y-4 md:col-span-2">
               <div className="bg-slate-50 p-6 rounded-[2rem] border-2 border-dashed border-slate-200">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 text-center">Total Collection (Auto-Generated)</p>
                  <p className="text-4xl font-black text-slate-900 text-center tracking-tighter">₹{((trip.distanceKm * trip.ratePerKm) || 0).toLocaleString()}</p>
               </div>
            </div>

            {/* Operational Expenses */}
            <div className="space-y-4">
               <p className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Operational Burn</p>
               <div className="space-y-3">
                  <div className="space-y-1">
                     <Label className="text-[10px] font-bold uppercase text-slate-500 ml-1">Fuel (Diesel/Petrol)</Label>
                     <Input 
                        value={settlement.fuel} 
                        onChange={(e) => setSettlement({...settlement, fuel: e.target.value})}
                        placeholder="₹0.00" className="h-10 border-2 rounded-xl font-black" 
                     />
                  </div>
                  <div className="space-y-1">
                     <Label className="text-[10px] font-bold uppercase text-slate-500 ml-1">Toll Charges</Label>
                     <Input 
                        value={settlement.tolls} 
                        onChange={(e) => setSettlement({...settlement, tolls: e.target.value})}
                        placeholder="₹0.00" className="h-10 border-2 rounded-xl font-black" 
                     />
                  </div>
                  <div className="space-y-1">
                     <Label className="text-[10px] font-bold uppercase text-slate-500 ml-1">Parking Charges</Label>
                     <Input 
                        value={settlement.parking} 
                        onChange={(e) => setSettlement({...settlement, parking: e.target.value})}
                        placeholder="₹0.00" className="h-10 border-2 rounded-xl font-black" 
                     />
                  </div>
                  <div className="space-y-1">
                     <Label className="text-[10px] font-bold uppercase text-slate-500 ml-1">Cleaning Charges</Label>
                     <Input 
                        value={settlement.cleaning} 
                        onChange={(e) => setSettlement({...settlement, cleaning: e.target.value})}
                        placeholder="₹0.00" className="h-10 border-2 rounded-xl font-black" 
                     />
                  </div>
               </div>
            </div>

            {/* Taxes & Allowances */}
            <div className="space-y-4">
               <p className="text-[10px] font-black uppercase tracking-widest text-primary ml-1">Taxes & Allowances</p>
               <div className="space-y-3">
                  <div className="space-y-1">
                     <Label className="text-[10px] font-bold uppercase text-slate-500 ml-1">State Border Tax</Label>
                     <Input 
                        value={settlement.stateTax} 
                        onChange={(e) => setSettlement({...settlement, stateTax: e.target.value})}
                        placeholder="₹0.00" className="h-10 border-2 rounded-xl font-black" 
                     />
                  </div>
                  <div className="space-y-1">
                     <Label className="text-[10px] font-bold uppercase text-slate-500 ml-1">Police Entry Tax</Label>
                     <Input 
                        value={settlement.policeTax} 
                        onChange={(e) => setSettlement({...settlement, policeTax: e.target.value})}
                        placeholder="₹0.00" className="h-10 border-2 rounded-xl font-black" 
                     />
                  </div>
                  <div className="space-y-1">
                     <Label className="text-[10px] font-bold uppercase text-slate-500 ml-1">Driver Food / Hotel</Label>
                     <Input 
                        value={settlement.foodHotel} 
                        onChange={(e) => setSettlement({...settlement, foodHotel: e.target.value})}
                        placeholder="₹0.00" className="h-10 border-2 rounded-xl font-black" 
                     />
                  </div>
                  <div className="space-y-1">
                     <Label className="text-[10px] font-bold uppercase text-slate-500 ml-1">Driver Allowance</Label>
                     <Input 
                        value={settlement.allowance} 
                        onChange={(e) => setSettlement({...settlement, allowance: e.target.value})}
                        placeholder="₹0.00" className="h-10 border-2 rounded-xl font-black" 
                     />
                  </div>
               </div>
            </div>
         </div>

         <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setOpen(false)} className="h-12 rounded-xl font-black uppercase tracking-widest border-2 flex-1">Cancel</Button>
            <Button className="h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-black uppercase tracking-widest flex-1 shadow-lg shadow-emerald-200" onClick={handleFinalize}>
               Finalize Settlement
            </Button>
         </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
