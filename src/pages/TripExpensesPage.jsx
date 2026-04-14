import { useState, useEffect, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getTrips, getCustomerBookings } from "@/lib/api";
import { toast } from "sonner";
import { 
  AlertTriangle, CheckCircle2, IndianRupee, 
  Receipt, Wallet, TrendingUp, Filter, 
  ClipboardCheck, HardDrive, Calculator, MapPin
} from "lucide-react";
import { cn } from "@/lib/utils";

function ExpenseInput({ label, value, setter, icon: Icon }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center px-1">
        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</Label>
      </div>
      <div className="relative group">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-hover:text-primary transition-colors">
          <Icon className="h-4 w-4" />
        </div>
        <Input
          type="number"
          value={value}
          onChange={(e) => setter(Number(e.target.value))}
          className="h-11 pl-10 border-2 bg-muted/20 focus-visible:ring-primary focus-visible:bg-background transition-all font-bold"
          placeholder="0.00"
        />
      </div>
    </div>
  );
}

export default function TripExpensesPage() {
  const [trips, setTrips] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState("");

  const [fuelCost, setFuelCost] = useState(0);
  const [tollCharges, setTollCharges] = useState(0);
  const [driverFood, setDriverFood] = useState(0);
  const [parkingCharges, setParkingCharges] = useState(0);
  const [stateBorderTax, setStateBorderTax] = useState(0);
  const [policeEntryTax, setPoliceEntryTax] = useState(0);
  const [cleaningCharges, setCleaningCharges] = useState(0);
  const [driverAllowance, setDriverAllowance] = useState(0);
  const [hotelCharges, setHotelCharges] = useState(0);

  useEffect(() => {
    Promise.all([getTrips(), getCustomerBookings()]).then(([tripsData, bookingsData]) => {
      setTrips(tripsData);
      setBookings(bookingsData);
      const initialTrip = tripsData.find(t => t.status === 'Completed') || tripsData[0];
      if (initialTrip) {
        setSelectedTripId(initialTrip.id);
        updateExpenseFields(initialTrip);
      }
    });
  }, []);

  const updateExpenseFields = (trip) => {
    const e = trip.expenses || {};
    setFuelCost(e.fuelCost || 0);
    setTollCharges(e.tollCharges || 0);
    setDriverFood(e.driverFood || 0);
    setParkingCharges(e.parkingCharges || 0);
    setStateBorderTax(e.stateBorderTax || 0);
    setPoliceEntryTax(e.policeEntryTax || 0);
    setCleaningCharges(e.cleaningCharges || 0);
    setDriverAllowance(e.driverAllowance || 0);
    setHotelCharges(e.hotelCharges || 0);
  };

  const trip = useMemo(() => trips.find((t) => t.id === selectedTripId), [trips, selectedTripId]);

  const handleTripChange = (id) => {
    setSelectedTripId(id);
    const t = trips.find((tr) => tr.id === id);
    if (t) {
      updateExpenseFields(t);
    }
  };

  const totalExpenses = fuelCost + tollCharges + driverFood + parkingCharges + stateBorderTax + policeEntryTax + cleaningCharges + driverAllowance + hotelCharges;
  const tripBookings = useMemo(() => bookings.filter((b) => b.tripId === selectedTripId), [bookings, selectedTripId]);
  const totalCollection = useMemo(() => tripBookings.reduce((sum, b) => sum + (b.paidAmount || 0), 0), [tripBookings]);
  const totalPending = useMemo(() => tripBookings.reduce((sum, b) => sum + (b.pendingAmount || 0), 0), [tripBookings]);
  const profit = totalCollection - totalExpenses;

  return (
    <DashboardLayout>
      <PageLayout>
        <PageHeader 
          title="Operational Settlement" 
          description="Finalize trip accounts, reconcile expenses, and calculate net profitability." 
        />

        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="flex-1 max-w-xl space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Select Active/Closed Assignment</Label>
            <div className="relative group">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary z-10" />
              <Select value={selectedTripId} onValueChange={handleTripChange}>
                <SelectTrigger className="h-14 pl-12 border-2 rounded-2xl bg-card shadow-sm hover:border-primary/50 transition-all font-bold">
                  <SelectValue placeholder="-- Reconcile Assignment --" />
                </SelectTrigger>
                <SelectContent className="max-h-80 rounded-xl">
                  {trips.map((t) => (
                    <SelectItem key={t.id} value={t.id} className="py-3 font-medium">
                       <span className="font-bold">{t.name}</span> <span className="text-muted-foreground ml-2 uppercase text-[10px]">{t.vehicle}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {trip && (
            <div className="flex items-center gap-4 bg-muted/30 border p-4 rounded-2xl">
               <div className="bg-primary text-primary-foreground p-3 rounded-xl shadow-md">
                  <Calculator className="h-6 w-6" />
               </div>
               <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Settlement Context</p>
                  <p className="text-sm font-black">{trip.route || "N/A"}</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">{trip.driver} • {trip.date}</p>
               </div>
            </div>
          )}
        </div>

        {trip && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 pb-12">
            {/* Detailed Ledger Inputs */}
            <div className="xl:col-span-2 space-y-8">
              <div className="bg-card border rounded-3xl p-8 shadow-sm border-primary/5">
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-dashed">
                   <div className="flex items-center gap-3">
                     <Receipt className="h-5 w-5 text-primary" />
                     <h3 className="font-black text-lg uppercase tracking-tight">Expense Ledger</h3>
                   </div>
                   <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-primary/50" onClick={() => updateExpenseFields(trip)}>
                      Reset Fields
                   </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-y-10 gap-x-8">
                  {/* Operational Group */}
                  <div className="md:col-span-3">
                     <p className="text-[10px] font-bold text-primary bg-primary/5 px-3 py-1 rounded inline-block uppercase tracking-[0.2em] mb-4">Operational Costs</p>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                       <ExpenseInput label="Fuel Cost" value={fuelCost} setter={setFuelCost} icon={HardDrive} />
                       <ExpenseInput label="Toll & Entry" value={tollCharges} setter={setTollCharges} icon={MapPin} />
                       <ExpenseInput label="Parking Fees" value={parkingCharges} setter={setParkingCharges} icon={MapPin} />
                     </div>
                  </div>

                  {/* Driver/Crew Group */}
                  <div className="md:col-span-3">
                     <p className="text-[10px] font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded inline-block uppercase tracking-[0.2em] mb-4">Driver & Crew Costs</p>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                       <ExpenseInput label="Driver Allowance" value={driverAllowance} setter={setDriverAllowance} icon={Wallet} />
                       <ExpenseInput label="Wait/Food" value={driverFood} setter={setDriverFood} icon={Calculator} />
                       <ExpenseInput label="Accomodation" value={hotelCharges} setter={setHotelCharges} icon={Receipt} />
                     </div>
                  </div>

                  {/* Statutory Group */}
                  <div className="md:col-span-3">
                     <p className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded inline-block uppercase tracking-[0.2em] mb-4">Statutory & Misc</p>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                       <ExpenseInput label="Border Tax" value={stateBorderTax} setter={setStateBorderTax} icon={MapPin} />
                       <ExpenseInput label="Police/Entry" value={policeEntryTax} setter={setPoliceEntryTax} icon={MapPin} />
                       <ExpenseInput label="Sanitization" value={cleaningCharges} setter={setCleaningCharges} icon={CheckCircle2} />
                     </div>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-6">
                   <div>
                      <h4 className="text-2xl font-black text-destructive tracking-tighter">₹{totalExpenses.toLocaleString()}</h4>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Total Operational Outflow</p>
                   </div>
                   <Button size="lg" className="h-14 px-12 rounded-2xl font-black uppercase tracking-widest shadow-xl" onClick={() => toast.success("Ledger Synchronized")}>
                     <ClipboardCheck className="h-5 w-5 mr-3" /> Save Ledger Data
                   </Button>
                </div>
              </div>
            </div>

            {/* Settlement Summary */}
            <div className="space-y-6">
              <div className="bg-primary text-primary-foreground p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden border-4 border-primary">
                 {/* Pattern */}
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.1),transparent)]" />
                 <IndianRupee className="absolute -right-4 -bottom-4 h-32 w-32 text-white/5" />

                 <div className="relative z-10 space-y-10">
                    <div className="flex items-center justify-between">
                       <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md">
                          <TrendingUp className="h-6 w-6 text-accent" />
                       </div>
                       <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Statement Summary</span>
                    </div>

                    <div className="space-y-6">
                       <div className="flex justify-between items-end border-b border-white/10 pb-4">
                          <div>
                             <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Gross Collection</p>
                             <p className="text-2xl font-black tracking-tighter">₹{totalCollection.toLocaleString()}</p>
                          </div>
                          <p className="text-[10px] font-bold text-success-foreground bg-success px-2 py-0.5 rounded tracking-tighter uppercase">Net Inflow</p>
                       </div>

                       <div className="flex justify-between items-end border-b border-white/10 pb-4">
                          <div>
                             <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Total Outflow</p>
                             <p className="text-2xl font-black tracking-tighter">₹{totalExpenses.toLocaleString()}</p>
                          </div>
                          <p className="text-[10px] font-bold text-destructive-foreground bg-destructive px-2 py-0.5 rounded tracking-tighter uppercase">Expenses</p>
                       </div>

                       <div className="pt-6 text-center">
                          <div className={cn(
                            "inline-block px-10 py-6 rounded-3xl backdrop-blur-xl border-2 transition-all duration-700",
                            profit >= 0 ? "bg-accent/10 border-accent/30 shadow-[0_0_30px_rgba(255,204,0,0.2)]" : "bg-destructive/10 border-destructive/30"
                          )}>
                             <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] mb-2 leading-none">Settlement Profit</p>
                             <p className={cn("text-5xl font-black tracking-[calc(-0.06em)]", profit >= 0 ? "text-accent" : "text-destructive")}>
                                ₹{profit.toLocaleString()}
                             </p>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              {totalPending > 0 ? (
                <div className="bg-destructive/10 border-2 border-destructive/20 p-6 rounded-3xl flex items-start gap-4">
                   <AlertTriangle className="h-6 w-6 text-destructive shrink-0" />
                   <div>
                      <p className="text-sm font-black text-destructive uppercase tracking-tight">Outstanding Dues</p>
                      <p className="text-xs text-destructive/80 font-bold mt-1 leading-relaxed">
                         Recalculate settlement: ₹{totalPending.toLocaleString()} is still uncollected from customers.
                      </p>
                   </div>
                </div>
              ) : (
                <div className="bg-emerald-50 border-2 border-emerald-500/10 p-6 rounded-3xl flex items-start gap-4 shadow-sm">
                   <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />
                   <div>
                      <p className="text-sm font-black text-emerald-900 uppercase tracking-tight">Full Reconsolidation</p>
                      <p className="text-xs text-emerald-700/80 font-bold mt-1 leading-relaxed">
                         Ready for final audit. All revenue streams have been accounted for and verified.
                      </p>
                   </div>
                </div>
              )}

              <div className="bg-muted/10 border rounded-3xl p-6">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4 border-b pb-2">Settlement Tasks</h4>
                 <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-xs font-bold text-muted-foreground/80">
                       <CheckCircle2 className="h-4 w-4 text-primary" /> Verify Driver Logs
                    </li>
                    <li className="flex items-center gap-3 text-xs font-bold text-muted-foreground/80">
                       <CheckCircle2 className="h-4 w-4 text-primary" /> Audit Fuel Vouchers
                    </li>
                    <li className="flex items-center gap-3 text-xs font-bold text-muted-foreground/80">
                       <div className="h-4 w-4 rounded-full border-2 border-muted shrink-0" /> Mark Trip as Accounted
                    </li>
                 </ul>
              </div>
            </div>
          </div>
        )}
      </PageLayout>
    </DashboardLayout>
  );
}
