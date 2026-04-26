import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Users, ChevronRight, IndianRupee, TrendingUp, Share2, Plus, Phone, User, CreditCard, Ticket, Clock, Receipt, BarChart3 } from "lucide-react";
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
        <div className="mt-4 pt-3 border-t border-slate-50 space-y-2">
          <div className="flex gap-1.5">
            <Button 
              variant="outline" 
              className="flex-1 h-9 rounded-lg font-black uppercase text-[8px] tracking-tighter border-2 border-destructive/5 text-destructive hover:bg-destructive hover:text-white transition-all px-1"
              onClick={(e) => { e.stopPropagation(); navigate(`/trips/${trip.id}/expenses`); }}
            >
              <Receipt className="h-3 w-3 mr-1" /> Expenses
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 h-9 rounded-lg font-black uppercase text-[8px] tracking-tighter border-2 border-slate-900/5 text-slate-900 hover:bg-slate-900 hover:text-white transition-all px-1"
              onClick={(e) => { e.stopPropagation(); navigate(`/trips/${trip.id}/bookings`); }}
            >
              <Ticket className="h-3 w-3 mr-1" /> Bookings
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 h-9 rounded-lg font-black uppercase text-[8px] tracking-tighter border-2 border-indigo-500/5 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all px-1"
              onClick={(e) => { e.stopPropagation(); navigate(`/finance?tripId=${trip.id}`); }}
            >
              <TrendingUp className="h-3 w-3 mr-1" /> Summary
            </Button>
          </div>

          <div className="flex items-center gap-2">
             <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 rounded-lg border-2 border-slate-50 text-slate-400 hover:bg-slate-50 shrink-0"
                onClick={(e) => {
                   e.stopPropagation();
                   const url = `${window.location.origin}/public/booking/${trip.id}`;
                   navigator.clipboard.writeText(url);
                   toast.success("Share link copied");
                }}
             >
                <Share2 className="h-3.5 w-3.5" />
             </Button>
             <Button 
                className="flex-1 h-9 rounded-lg bg-[#3E85A8] hover:bg-[#347291] text-white font-black uppercase text-[9px] tracking-widest shadow-md flex items-center justify-center gap-2"
                onClick={() => navigate(`/trips/${trip.id}/logistics`)}
             >
                Details <ChevronRight className="h-3.5 w-3.5" />
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

