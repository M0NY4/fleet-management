import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Users, ChevronRight, IndianRupee, TrendingUp, Share2, Plus, Phone, User, CreditCard, Ticket, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FinancialSettlementModal } from "@/components/finance/FinancialSettlementModal";

export function TripCard({ trip, onClick }) {
  const navigate = useNavigate();
  const seatsPercent = Math.round(((trip.totalSeats - trip.seatsRemaining) / (trip.totalSeats || 1)) * 100);
  const routePoints = trip.routePoints || [];
  const pickup = routePoints[0] || "TBD";
  const drop = routePoints[routePoints.length - 1] || "TBD";
  
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  const totalExpenses = (trip.tripExpences || []).reduce((sum, exp) => sum + exp.ammountRs, 0);
  const bookRevenue = trip.distanceKm * trip.ratePerKm;
  const isPast = trip.status === "COMPLETED" || trip.status === "CANCELLED";
  
  // Show actual collection for past trips, otherwise show book value
  const displayRevenue = isPast ? (trip.collectionPaid || 0) : bookRevenue;
  const displayProfit = displayRevenue - totalExpenses;

  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    customer_name: "",
    customer_no: "",
    seats_booked: 1,
    paid_amount: "",
    payment_method: "GPAY"
  });

  const seatRate = (trip.distanceKm * trip.ratePerKm) / (trip.totalSeats || 1);
  const totalBookingAmount = bookingForm.seats_booked * seatRate;
  const pendingBookingAmount = totalBookingAmount - (parseFloat(bookingForm.paid_amount) || 0);

  const handleManualBooking = () => {
    if (!bookingForm.customer_name || !bookingForm.customer_no) {
      toast.error("Validation Error", { description: "Customer name and number are required." });
      return;
    }
    toast.success("Booking Recorded", { description: `Seat reserved for ${bookingForm.customer_name}.` });
    setShowBookingDialog(false);
  };

  return (
    <div 
      className="group relative bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
      onClick={() => onClick(trip)}
    >
      <div className={cn(
        "h-2 w-full",
        trip.status === "UPCOMING" ? "bg-blue-500" :
        trip.status === "ONGOING" ? "bg-amber-500 animate-pulse" :
        trip.status === "COMPLETED" ? "bg-emerald-500" : "bg-destructive"
      )} />
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-extrabold text-lg text-foreground group-hover:text-primary transition-colors">{trip.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-bold bg-primary/5 text-primary px-2 py-0.5 rounded uppercase">{routePoints.length} Stops</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <StatusBadge status={trip.status} />
            {trip.inquiriesCount > 0 && (
              <div className="flex items-center gap-1 bg-amber-500 text-white text-[8px] font-black uppercase px-1.5 py-0.5 rounded-sm animate-bounce">
                {trip.inquiriesCount} Inquiries
              </div>
            )}
          </div>
        </div>

        {/* Visual Route Timeline */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1">
            <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Origin</p>
            <p className="text-sm font-black truncate uppercase tracking-tight">{pickup}</p>
          </div>
          <div className="flex flex-col items-center gap-1 px-2 shrink-0">
             <div className="h-px w-8 bg-border border-t border-dashed" />
             <MapPin className="h-3.5 w-3.5 text-primary" />
             <div className="h-px w-8 bg-border border-t border-dashed" />
          </div>
          <div className="flex-1 text-right">
            <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Destination</p>
            <p className="text-sm font-black truncate uppercase tracking-tight">{drop}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-dashed">
          <div>
            <p className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" /> Departure</p>
            <p className="text-sm font-bold">{formatDate(trip.startDate)}</p>
            <p className="text-[10px] font-medium text-muted-foreground">{formatTime(trip.startDate)}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1 justify-end"><Calendar className="h-3 w-3" /> Arrival</p>
            <p className="text-sm font-bold">{formatDate(trip.endDate)}</p>
            <p className="text-[10px] font-medium text-muted-foreground">{formatTime(trip.endDate)}</p>
          </div>
        </div>

        {/* Occupancy */}
        <div className="space-y-1.5 mb-6">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-tight">
            <span className="text-muted-foreground">Seats Available</span>
            <span className={cn(trip.seatsRemaining < 5 ? "text-destructive" : "text-primary")}>{trip.seatsRemaining} / {trip.totalSeats} Free</span>
          </div>
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <div 
              className={cn("h-full rounded-full transition-all duration-500", trip.seatsRemaining < 5 ? "bg-destructive" : "bg-primary")}
              style={{ width: `${Math.max(0, 100 - seatsPercent)}%` }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-4 pt-4 border-t border-border/40">
          <div className="flex items-center justify-between gap-2">
            {!isPast && (
               <>
                 <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
                   <DialogTrigger asChild>
                     <Button 
                       variant="outline" 
                       size="sm" 
                       className="rounded-lg h-8 px-3 text-[10px] font-black uppercase tracking-widest border-2 border-primary/20 text-primary hover:bg-primary hover:text-white transition-all shrink-0"
                       onClick={(e) => e.stopPropagation()}
                     >
                       <Plus className="h-3 w-3 mr-1.5" /> Add Booking
                     </Button>
                   </DialogTrigger>
                   <DialogContent className="sm:max-w-md rounded-[2.5rem]" onClick={(e) => e.stopPropagation()}>
                     <DialogHeader>
                       <DialogTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                         <Ticket className="h-5 w-5 text-primary" /> Internal Booking Form
                       </DialogTitle>
                     </DialogHeader>
                     <div className="space-y-4 py-4">
                       <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-1.5">
                           <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Customer Name</Label>
                           <div className="relative">
                             <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                             <Input 
                               placeholder="Name" className="h-10 pl-9 border-2 rounded-xl font-bold" 
                               value={bookingForm.customer_name}
                               onChange={(e) => setBookingForm({...bookingForm, customer_name: e.target.value})}
                             />
                           </div>
                         </div>
                         <div className="space-y-1.5">
                           <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Customer No.</Label>
                           <div className="relative">
                             <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                             <Input 
                               placeholder="Phone" className="h-10 pl-9 border-2 rounded-xl font-bold" 
                               value={bookingForm.customer_no}
                               onChange={(e) => setBookingForm({...bookingForm, customer_no: e.target.value})}
                             />
                           </div>
                         </div>
                       </div>

                       <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-1.5">
                           <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Seats Booked</Label>
                           <Input 
                             type="number" min="1" max={trip.seatsRemaining} className="h-10 border-2 rounded-xl font-black" 
                             value={bookingForm.seats_booked}
                             onChange={(e) => setBookingForm({...bookingForm, seats_booked: parseInt(e.target.value) || 1})}
                           />
                         </div>
                         <div className="space-y-1.5">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Payment Method</Label>
                            <Select value={bookingForm.payment_method} onValueChange={(val) => setBookingForm({...bookingForm, payment_method: val})}>
                               <SelectTrigger className="h-10 border-2 rounded-xl font-bold">
                                  <SelectValue />
                               </SelectTrigger>
                               <SelectContent>
                                  <SelectItem value="GPAY">G-PAY</SelectItem>
                                  <SelectItem value="CASH">CASH</SelectItem>
                                  <SelectItem value="PROOF_UPLOAD">PROOF UPLOAD</SelectItem>
                               </SelectContent>
                            </Select>
                         </div>
                       </div>

                       <div className="bg-muted/30 p-4 rounded-2xl space-y-2 border border-dashed">
                          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                             <span>Total Amount</span>
                             <span className="text-primary">₹{totalBookingAmount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                             <span>Pending Balance</span>
                             <span className={cn(pendingBookingAmount > 0 ? "text-destructive" : "text-emerald-600")}>₹{pendingBookingAmount.toLocaleString()}</span>
                          </div>
                       </div>

                       <div className="space-y-1.5">
                         <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Cash / Paid Amount</Label>
                         <div className="relative">
                           <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                           <Input 
                             type="number" placeholder="0.00" className="h-12 pl-9 border-2 rounded-xl font-black text-lg" 
                             value={bookingForm.paid_amount}
                             onChange={(e) => setBookingForm({...bookingForm, paid_amount: e.target.value})}
                           />
                         </div>
                       </div>
                     </div>
                     <DialogFooter>
                       <Button className="w-full h-12 rounded-xl bg-primary font-black uppercase tracking-widest" onClick={handleManualBooking}>Log Internal Booking</Button>
                     </DialogFooter>
                   </DialogContent>
                 </Dialog>

                 <Button 
                   variant="outline" 
                   size="sm" 
                   className="rounded-lg h-8 px-3 text-[10px] font-black uppercase tracking-widest border-dashed hover:bg-primary/5 hover:text-primary transition-all shrink-0"
                   onClick={(e) => {
                     e.stopPropagation();
                     const url = `${window.location.origin}/public/booking/${trip.id}`;
                     navigator.clipboard.writeText(url);
                     toast.success("Booking Link Copied", { description: "You can now share this link with customers." });
                   }}
                 >
                   <Share2 className="h-3 w-3 mr-1.5" /> Share
                 </Button>
               </>
            )}
            <FinancialSettlementModal 
              trip={trip}
              trigger={
                <div 
                  className={cn(
                    "px-3 py-1.5 rounded-lg flex items-center gap-2 flex-1 justify-center cursor-pointer transition-all hover:scale-105",
                    displayProfit >= 0 ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : "bg-destructive/5 text-destructive hover:bg-destructive/10"
                  )}
                  onClick={(e) => e.stopPropagation()}
                >
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-black tracking-widest uppercase">
                    Conclude Settlement
                  </span>
                </div>
              }
            />
            <Button variant="secondary" size="sm" className="rounded-lg font-bold group-hover:bg-primary group-hover:text-primary-foreground transition-all h-8 text-xs px-4 shrink-0">
              Details <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

