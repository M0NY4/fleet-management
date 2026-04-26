import { useState } from "react";
import { useParams } from "react-router-dom";
import { useTripData } from "@/hooks/useTripData";
import { TripPageLayout } from "@/components/trips/TripPageLayout";
import { TableContainer } from "@/components/layout/TableContainer";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, IndianRupee } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function TripBookingsPage() {
  const { tripId } = useParams();
  const { trip, bookings, setBookings, loading } = useTripData(tripId);
  const [bookingFilter, setBookingFilter] = useState("all");
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [approvalAmount, setApprovalAmount] = useState("");

  const handleApprove = () => {
    if (!selectedInquiry) return;
    const amount = parseFloat(approvalAmount) || 0;
    setBookings(prev => prev.map(b => b.id === selectedInquiry.id ? { ...b, status: "CONFIRMED", paidAmount: amount } : b));
    toast.success("Booking Confirmed");
    setSelectedInquiry(null);
  };

  const handleReject = (id) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "CANCELLED" } : b));
    toast.error("Booking Rejected");
  };

  return (
    <TripPageLayout trip={trip} loading={loading}>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex gap-2 bg-slate-100 p-1.5 rounded-xl w-fit shadow-inner">
          {(["all", "PENDING_APPROVAL", "CONFIRMED", "CANCELLED"]).map((f) => (
            <button
              key={f}
              onClick={() => setBookingFilter(f)}
              className={cn(
                "px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
                bookingFilter === f ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
              )}
            >
              {f === "all" ? "Full Manifest" : f === "PENDING_APPROVAL" ? "New Bookings" : f === "CONFIRMED" ? "Approved" : "Rejected"}
            </button>
          ))}
        </div>

        <TableContainer className="rounded-[2.5rem] border-none bg-white shadow-2xl overflow-hidden">
           <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
                 <tr>
                    <th className="px-8 py-6">Customer</th>
                    <th className="px-6 py-6 text-right">Total Bill</th>
                    <th className="px-6 py-6 text-right">Paid</th>
                    <th className="px-6 py-6 text-right">Pending</th>
                    <th className="px-6 py-6 text-center">Status</th>
                    <th className="px-8 py-6 text-right">Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                 {bookings.filter(b => bookingFilter === "all" || b.status === bookingFilter).map((b) => {
                    const pending = (b.totalAmount || 0) - (b.paidAmount || 0);
                    const isFullyPaid = pending <= 0;
                    return (
                       <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-8 py-6">
                             <p className="font-black uppercase text-slate-800">{b.passengers?.[0]?.name || "Guest"}</p>
                             <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Ref: {b.tripName || "Trip Account"}</p>
                          </td>
                          <td className="px-6 py-6 text-right font-bold text-slate-600">₹{(b.totalAmount || 0).toLocaleString()}</td>
                          <td className="px-6 py-6 text-right font-bold text-emerald-600">₹{(b.paidAmount || 0).toLocaleString()}</td>
                          <td className="px-6 py-6 text-right font-black text-destructive">₹{pending.toLocaleString()}</td>
                          <td className="px-6 py-6 text-center">
                             <StatusBadge status={isFullyPaid ? "Paid" : "Partial"} className="text-[8px]" />
                          </td>
                          <td className="px-8 py-6 text-right">
                             {b.status === "PENDING_APPROVAL" ? (
                               <div className="flex justify-end gap-2">
                                  <Button variant="ghost" size="sm" className="h-8 text-destructive font-black uppercase text-[10px]" onClick={() => handleReject(b.id)}>Reject</Button>
                                  <Button size="sm" className="h-8 bg-amber-500 hover:bg-amber-600 text-white font-black uppercase text-[10px] px-4 rounded-lg" onClick={() => {
                                     setSelectedInquiry(b);
                                     setApprovalAmount(String(b.totalAmount));
                                  }}>Review</Button>
                               </div>
                             ) : b.status === "CONFIRMED" && pending > 0 ? (
                               <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="h-8 px-4 rounded-lg font-black text-[10px] uppercase border-2 border-emerald-500/20 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all" 
                                  onClick={() => {
                                     setSelectedInquiry(b);
                                     setApprovalAmount(String(pending));
                                  }}
                               >
                                  Settle Dues
                               </Button>
                             ) : (
                               <div className="flex justify-end items-center gap-2 text-emerald-600 font-black uppercase text-[10px] tracking-widest px-4">
                                  <CheckCircle2 className="h-4 w-4" /> Finalized
                               </div>
                             )}
                           </td>
                       </tr>
                    );
                 })}
              </tbody>
           </table>
        </TableContainer>
      </div>

      <Dialog open={!!selectedInquiry} onOpenChange={(open) => !open && setSelectedInquiry(null)}>
         <DialogContent className="sm:max-w-md rounded-[2.5rem] border-none shadow-2xl">
            <DialogHeader>
               <DialogTitle className="text-xl font-black uppercase tracking-tight">Manual Payment Verification</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
               <div className="p-4 bg-muted/30 rounded-2xl space-y-2">
                  <div className="flex justify-between text-xs">
                     <span className="font-bold text-muted-foreground uppercase">Customer</span>
                     <span className="font-black">{selectedInquiry?.passengers?.[0]?.name}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                     <span className="font-bold text-muted-foreground uppercase">Quoted Total</span>
                     <span className="font-black text-primary">₹{selectedInquiry?.totalAmount?.toLocaleString()}</span>
                  </div>
               </div>
               <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Input Cash / Paid Amount</Label>
                  <div className="relative">
                     <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                     <Input type="number" value={approvalAmount} onChange={(e) => setApprovalAmount(e.target.value)} className="h-12 pl-10 border-2 rounded-xl font-black text-lg" placeholder="0.00" />
                  </div>
               </div>
            </div>
            <DialogFooter className="sm:justify-between gap-3">
               <Button variant="ghost" className="font-bold uppercase text-[10px]" onClick={() => setSelectedInquiry(null)}>Cancel</Button>
               <Button className="bg-emerald-600 font-black uppercase tracking-widest px-8" onClick={handleApprove}>Approve & Settle</Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
    </TripPageLayout>
  );
}
