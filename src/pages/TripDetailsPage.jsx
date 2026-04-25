import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageLayout } from "@/components/layout/PageLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { getTrips, getBookings } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/DataTable";
import { TableContainer } from "@/components/layout/TableContainer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Truck,
  IndianRupee,
  Users,
  Clock,
  ShieldCheck,
  Map as MapIcon,
  MoreVertical,
  Plus,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  History,
  Receipt,
  HardDrive,
  Wallet,
  Calculator,
  Share2,
  CreditCard,
  Check,
  MinusCircle,
  User
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

function DetailItem({ label, value, icon: Icon, colorClass }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/40">
      <div
        className={cn(
          "p-2 rounded-md",
          colorClass || "bg-primary/10 text-primary",
        )}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
          {label}
        </p>
        <p className="text-sm font-bold text-foreground">{value}</p>
      </div>
    </div>
  );
}

export default function TripDetailsPage() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [settlementData, setSettlementData] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([getTrips(), getBookings()]).then(([tripsData, bookingsData]) => {
      const currentTrip = tripsData.find((t) => String(t.id) === String(tripId));
      setTrip(currentTrip);
      
      const customBookings = JSON.parse(localStorage.getItem("custom_bookings") || "[]");
      const combinedBookings = [...bookingsData, ...customBookings];
      
      const tripBookings = combinedBookings.filter(b => String(b.tripId) === String(tripId));
      setBookings(tripBookings);

      const settlements = JSON.parse(localStorage.getItem("trip_settlements") || "[]");
      const currentSettlement = settlements.find(s => String(s.tripId) === String(tripId));
      setSettlementData(currentSettlement);

      setLoading(false);
    });
  }, [tripId]);

  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [approvalAmount, setApprovalAmount] = useState("");

  const handleApprove = () => {
    if (!selectedInquiry) return;
    const amount = parseFloat(approvalAmount) || 0;
    setBookings(prev => prev.map(b => b.id === selectedInquiry.id ? { ...b, status: "CONFIRMED", paidAmount: amount } : b));
    toast.success("Booking Confirmed", { description: `Approved with ₹${amount} payment received.` });
    setSelectedInquiry(null);
    setApprovalAmount("");
  };

  const handleReject = (bookingId) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: "CANCELLED" } : b));
    toast.error("Inquiry Rejected", { description: `Inquiry #${bookingId} has been cancelled.` });
  };

  const inquiries = useMemo(() => bookings.filter(b => b.status === "PENDING_APPROVAL"), [bookings]);
  const confirmedManifest = useMemo(() => bookings.filter(b => b.status !== "PENDING_APPROVAL" && b.status !== "CANCELLED"), [bookings]);
  
  const totalExpenses = useMemo(() => (trip?.tripExpences || []).reduce((sum, exp) => sum + exp.ammountRs, 0), [trip]);
  const collectionTotal = useMemo(() => confirmedManifest.reduce((sum, b) => sum + (b.totalAmount || 0), 0), [confirmedManifest]);
  const collectionPaid = useMemo(() => confirmedManifest.reduce((sum, b) => sum + (b.paidAmount || 0), 0), [confirmedManifest]);
  const collectionPending = collectionTotal - collectionPaid;
  
  const confirmedSeats = useMemo(() => confirmedManifest.reduce((sum, b) => sum + b.seatsBooked, 0), [confirmedManifest]);
  const occupancyPercent = useMemo(() => Math.round((confirmedSeats / (trip?.totalSeats || 1)) * 100), [confirmedSeats, trip]);
  
  // Financial Conclusion Logic (Frame 4)
  // Actual Cash Profit = Total Paid - Total Expenses
  // Book Profit = Total Billing - Total Expenses
  const bookProfit = collectionTotal - totalExpenses;
  const actualCashProfit = collectionPaid - totalExpenses;

  const handleMarkAsCompleted = (bookingId) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, paidAmount: b.totalAmount, status: "CONFIRMED" } : b));
    toast.success("Payment Received", { description: "Booking has been marked as fully paid." });
  };

  const expenseCols = [
    { 
      header: "Expense Category", 
      accessor: (r) => <span className="font-bold text-destructive uppercase text-[10px] tracking-widest">{r.name}</span> 
    },
    { 
      header: "Amount", 
      accessor: (r) => <span className="font-black text-destructive">₹{(r.ammountRs || 0).toLocaleString()}</span> 
    },
    { 
      header: "Receipt", 
      accessor: (r) => r.documentPath ? <Button variant="link" size="sm" className="h-auto p-0 font-bold">View Screenshot</Button> : <span className="text-[10px] text-muted-foreground uppercase font-bold">No Proof</span> 
    },
  ];

  if (loading) return <div className="h-screen flex items-center justify-center animate-pulse">Loading Trip Ledger...</div>;
  const isPast = trip?.status === "COMPLETED";

  return (
    <DashboardLayout>
      <PageLayout fullWidth>
        {/* Operation Summary Banner */}
        <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden border-4 border-slate-800">
           <Truck className="absolute -right-10 -bottom-10 h-64 w-64 text-white/5 pointer-events-none rotate-12" />
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="flex items-center gap-6">
                 <Button variant="outline" size="icon" className="rounded-full bg-white/5 border-white/10 hover:bg-white/10 text-white" onClick={() => navigate("/trips")}>
                    <ArrowLeft className="h-5 w-5" />
                 </Button>
                 <div>
                    <div className="flex items-center gap-4">
                       <h1 className="text-3xl font-black tracking-tighter uppercase">{trip.name}</h1>
                       <StatusBadge status={trip.status} />
                    </div>
                    <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mt-1">Vehicle: {trip.vehicleNumber || "MH12AB1234"} • Trip ID #{trip.id}</p>
                 </div>
              </div>
              <div className="flex gap-3">
                 {isPast && (
                    <Button className="bg-blue-600 font-black h-12 rounded-2xl uppercase tracking-widest px-8" onClick={() => toast.success("Trip finalized")}>Conclude Trip</Button>
                 )}
                 <Button variant="outline" className="h-12 rounded-2xl border-2 border-white/10 bg-white/5 font-bold" onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/public/booking/${trip.id}`);
                    toast.success("Share link copied");
                 }}><Share2 className="h-4 w-4 mr-2" /> Share Link</Button>
              </div>
           </div>
        </div>

        <div className="space-y-8 mt-8">
           
           {/* Section 1: Logistics & Manifest (Full Width) */}
           <div className="space-y-8">
              
              {/* Route & Logistics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <Card className="p-6 border-none shadow-sm bg-white rounded-3xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Route Architecture</p>
                    <div className="space-y-4 border-l-2 border-slate-100 pl-6 ml-1">
                       {(trip.routePoints || []).map((p, i, arr) => (
                          <div key={i} className="relative">
                             <div className={cn("absolute -left-[31px] top-1 h-3 w-3 rounded-full border-2 border-white shadow-sm", i===0 ? "bg-blue-500" : i===arr.length-1 ? "bg-emerald-500" : "bg-slate-300")} />
                             <p className="text-[11px] font-black text-slate-800 uppercase tracking-tight">{p}</p>
                          </div>
                       ))}
                    </div>
                 </Card>
                 <div className="grid grid-cols-1 gap-4">
                    <DetailItem label="Schedule" value={new Date(trip.startDate).toLocaleString()} icon={Calendar} colorClass="bg-blue-50 text-blue-600" />
                    <DetailItem label="Distance" value={`${trip.distanceKm} KM`} icon={MapPin} colorClass="bg-indigo-50 text-indigo-600" />
                    <DetailItem label="Commercial Rate" value={`₹${trip.ratePerKm} / KM`} icon={IndianRupee} colorClass="bg-emerald-50 text-emerald-600" />
                 </div>
              </div>

              {/* Outstanding Report (Frame 3) */}
              <div className="space-y-4">
                 <div className="flex items-center justify-between px-2">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600 flex items-center gap-2">
                       <Wallet className="h-4 w-4" /> Outstanding Report (Receivables)
                    </h3>
                    <p className="text-[10px] font-black text-destructive uppercase">Pending: ₹{collectionPending.toLocaleString()}</p>
                 </div>
                 <TableContainer className="rounded-[2.5rem] border-slate-100 bg-white shadow-xl shadow-indigo-500/5 overflow-hidden">
                    <table className="w-full text-left text-sm">
                       <thead className="bg-slate-50 border-b text-[10px] font-black uppercase text-destructive tracking-[0.15em]">
                          <tr>
                             <th className="px-8 py-5">Customer</th>
                             <th className="px-6 py-5 text-right">Total Bill</th>
                             <th className="px-6 py-5 text-right">Paid</th>
                             <th className="px-6 py-5 text-right">Pending</th>
                             <th className="px-8 py-5 text-right">Actions</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-50">
                          {confirmedManifest.map((b) => {
                             const pending = b.totalAmount - b.paidAmount;
                             return (
                                <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                                   <td className="px-8 py-5 font-black uppercase text-slate-800">{b.passengers?.[0]?.name || "Rahul Sharma"}</td>
                                   <td className="px-6 py-5 text-right font-bold text-slate-600">₹{b.totalAmount.toLocaleString()}</td>
                                   <td className="px-6 py-5 text-right font-bold text-emerald-600">₹{b.paidAmount.toLocaleString()}</td>
                                   <td className="px-6 py-5 text-right font-black text-destructive bg-destructive/5">₹{pending.toLocaleString()}</td>
                                   <td className="px-8 py-5 text-right">
                                       {pending > 0 ? (
                                          <Button 
                                             size="sm" 
                                             variant="outline" 
                                             className="h-9 px-4 rounded-xl font-black text-[10px] uppercase border-2 border-emerald-500/20 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm" 
                                             onClick={() => {
                                                setSelectedInquiry(b);
                                                setApprovalAmount(String(pending));
                                             }}
                                          >
                                             Settle Dues
                                          </Button>
                                       ) : (
                                          <div className="flex justify-end items-center gap-2 text-emerald-600 font-black uppercase text-[10px] tracking-widest px-4">
                                             <CheckCircle2 className="h-4 w-4" /> Fully Settled
                                          </div>
                                       )}
                                    </td>
                                </tr>
                             );
                          })}
                          {confirmedManifest.length === 0 && (
                             <tr>
                                <td colSpan={5} className="px-8 py-10 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest italic opacity-40">No active receivables found</td>
                             </tr>
                          )}
                       </tbody>
                    </table>
                 </TableContainer>
              </div>

              {/* Conclude Trip Section (Frame 4 - Now Horizontal & Full Width) */}
              {isPast && (
                <div className="space-y-6 pt-4 border-t-4 border-slate-100">
                   <div className="flex flex-col md:flex-row md:items-center justify-between px-2 gap-4">
                      <div>
                         <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">Conclude Trip</h2>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Operational Financial Settlement</p>
                      </div>
                      <Button className="h-14 rounded-2xl font-black uppercase tracking-[0.15em] bg-slate-900 shadow-xl px-10 hover:scale-[1.02] transition-transform active:scale-95" onClick={() => toast.success("Trip Records Finalized")}>
                         Finalize Trip & Close Dossier
                      </Button>
                   </div>

                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Collection Breakdown */}
                      <Card className="border-none shadow-xl rounded-[2.5rem] bg-white p-8">
                         <div className="space-y-6">
                            <div className="flex justify-between items-center">
                               <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                                  <CreditCard className="h-3 w-3" /> Total Collection
                               </p>
                               <span className="bg-emerald-50 text-emerald-600 text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest border border-emerald-100">Auto Generated</span>
                            </div>

                            <div className="space-y-3">
                               <div className="flex justify-between items-center text-sm font-bold text-slate-600">
                                  <span className="uppercase tracking-tight">Booking Value (Paid)</span>
                                  <span>₹{collectionPaid.toLocaleString()}</span>
                               </div>
                               <div className="flex justify-between items-center text-sm font-bold text-destructive">
                                  <span className="uppercase tracking-tight">Pending Dues</span>
                                  <span>+ ₹{collectionPending.toLocaleString()}</span>
                               </div>
                               <div className="pt-2 border-t border-dashed flex justify-between items-center">
                                  <span className="text-[11px] font-black uppercase tracking-widest text-slate-900">Gross Collection</span>
                                  <span className="text-xl font-black text-slate-900">₹{collectionTotal.toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Optional Charges Frame */}
                            <div className="p-5 rounded-[2rem] border-2 border-slate-200 bg-slate-50/50 space-y-3 relative">
                               <span className="absolute -top-2.5 left-6 bg-white px-3 text-[9px] font-black uppercase tracking-widest text-slate-400 border rounded-full">Add-on Frame</span>
                               <div className="flex justify-between items-center text-[11px] font-bold text-blue-600">
                                  <span className="flex items-center gap-2"><MapPin className="h-3 w-3" /> Toll Charges</span>
                                  <span>₹450</span>
                               </div>
                               <div className="flex justify-between items-center text-[11px] font-bold text-blue-600">
                                  <span className="flex items-center gap-2"><User className="h-3 w-3" /> Driver Allowance</span>
                                  <span>₹300</span>
                               </div>
                               <div className="flex justify-between items-center text-[11px] font-bold text-blue-600">
                                  <span className="flex items-center gap-2"><ShieldCheck className="h-3 w-3" /> Hotel Charges</span>
                                  <span>₹300</span>
                               </div>
                            </div>
                         </div>
                      </Card>

                      {/* Expenditure Dossier */}
                      <Card className="border-none shadow-xl rounded-[2.5rem] bg-white p-8">
                         <div className="space-y-4">
                            <p className="text-[10px] font-black text-destructive uppercase tracking-widest flex items-center justify-between">
                               Expenditure Dossier
                               <span className="text-[8px] opacity-50">Operational Costs</span>
                            </p>
                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
                               {[
                                 { name: "Fuel (diesel/petrol)", amount: 45000, color: "bg-red-50 text-red-600" },
                                 { name: "Toll charges", amount: 4500, color: "bg-orange-50 text-orange-600" },
                                 { name: "Driver food", amount: 1500, color: "bg-amber-50 text-amber-600" },
                                 { name: "Parking charges", amount: 800, color: "bg-yellow-50 text-yellow-600" },
                                 { name: "State border tax", amount: 2200, color: "bg-rose-50 text-rose-600" },
                                 { name: "Police entry tax", amount: 500, color: "bg-pink-50 text-pink-600" },
                                 { name: "Cleaning charges during trip", amount: 500, color: "bg-slate-50 text-slate-600" },
                               ].map((exp, i) => (
                                  <div key={i} className={cn("flex justify-between items-center p-3 rounded-xl border border-transparent hover:border-slate-200 transition-all", exp.color)}>
                                     <span className="text-[10px] font-black uppercase tracking-tight">{exp.name}</span>
                                     <span className="text-xs font-black">₹{exp.amount.toLocaleString()}</span>
                                  </div>
                               ))}
                            </div>
                            <div className="flex justify-between items-center p-5 bg-destructive text-white rounded-[1.5rem] shadow-xl shadow-destructive/20 border-t-4 border-white/10">
                               <span className="text-[10px] font-black uppercase tracking-[0.2em]">Total Expenses</span>
                               <span className="text-2xl font-black">₹{totalExpenses.toLocaleString()}</span>
                            </div>
                         </div>
                      </Card>

                      {/* Net Cash Profit */}
                      <Card className="border-none shadow-xl rounded-[2.5rem] bg-white p-8 flex flex-col justify-between">
                         <div className="pt-6">
                            <div className={cn("p-10 rounded-[3rem] flex flex-col items-center text-center relative overflow-hidden", actualCashProfit >= 0 ? "bg-blue-600 shadow-2xl shadow-blue-200" : "bg-destructive shadow-2xl shadow-destructive-200")}>
                               <div className="absolute top-0 right-0 p-4 opacity-10">
                                  <TrendingUp className="h-24 w-24 text-white" />
                               </div>
                               <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.3em] mb-4 relative z-10">Net Cash Profit</p>
                               <p className="text-6xl font-black text-white tracking-tighter mb-2 relative z-10">₹{actualCashProfit.toLocaleString()}</p>
                               <p className="text-[9px] font-bold text-white/50 uppercase tracking-widest italic flex items-center gap-1 relative z-10">
                                  <MinusCircle className="h-3 w-3" /> ? minus the pending
                               </p>
                            </div>
                         </div>
                         <div className="mt-8 p-6 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                            <div className="flex justify-between items-center mb-2">
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Potential (On Paper)</p>
                               <p className="text-sm font-black text-blue-600">₹{bookProfit.toLocaleString()}</p>
                            </div>
                            <p className="text-[8px] font-bold text-slate-400 uppercase leading-relaxed italic">
                               * Potential profit represents the total book value minus expenses, assuming 100% collection of pending dues.
                            </p>
                         </div>
                      </Card>
                   </div>
                </div>
              )}

              {/* Booking Inquiries (Pending Approval) */}
              {inquiries.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-amber-600 px-2 flex items-center gap-2">
                    <Users className="h-4 w-4" /> Pending Approval Queue
                  </h3>
                  <TableContainer className="rounded-[2.5rem] border-amber-100 bg-amber-50/10 border-2 overflow-hidden shadow-xl shadow-amber-500/5">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-amber-100/50 border-b text-[10px] font-black uppercase text-amber-700 tracking-widest">
                        <tr>
                          <th className="px-8 py-5">Customer Entity</th>
                          <th className="px-6 py-5">Contact</th>
                          <th className="px-6 py-5 text-center">Seats Requested</th>
                          <th className="px-6 py-5 text-right">Potential Revenue</th>
                          <th className="px-8 py-5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-amber-100/50">
                        {inquiries.map((b) => (
                          <tr key={b.id} className="hover:bg-amber-100/20 transition-colors">
                            <td className="px-8 py-5">
                               <p className="font-black uppercase text-slate-800">{b.passengers?.[0]?.name}</p>
                               <p className="text-[8px] font-black text-amber-600 uppercase tracking-widest">Inquiry ID #{b.id}</p>
                            </td>
                            <td className="px-6 py-5 text-slate-600 font-bold">{b.passengers?.[0]?.mobileNo}</td>
                            <td className="px-6 py-5 text-center">
                               <span className="bg-amber-200/50 text-amber-700 px-3 py-1 rounded-full text-[10px] font-black">{b.seatsBooked} SEATS</span>
                            </td>
                            <td className="px-6 py-5 text-right font-black text-slate-900">₹{b.totalAmount.toLocaleString()}</td>
                            <td className="px-8 py-5 text-right flex justify-end gap-2">
                               <Button variant="ghost" size="sm" className="text-destructive font-black uppercase text-[10px]" onClick={() => toast.error("Booking Rejected")}>Reject</Button>
                               <Button size="sm" className="bg-amber-600 text-white font-black uppercase text-[10px] px-6 h-9 rounded-xl" onClick={() => {
                                  setSelectedInquiry(b);
                                  setApprovalAmount(String(b.totalAmount));
                               }}>Review & Approve</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </TableContainer>
                </div>
              )}

              {/* Trip Settlement Record (Frame 6) */}
              {settlementData && (
                <div className="space-y-4 pt-8">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600 px-2 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" /> Trip Settlement Record
                  </h3>
                  <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white">
                     <div className="bg-emerald-600 p-8 text-white flex justify-between items-center">
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-1">Financial Dossier</p>
                           <h4 className="text-2xl font-black tracking-tighter uppercase">Finalized Settlement</h4>
                        </div>
                        <div className="text-right">
                           <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Total Collection</p>
                           <p className="text-3xl font-black">₹{settlementData.totalCollection?.toLocaleString()}</p>
                        </div>
                     </div>
                     <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-4">
                           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b pb-2">Operational Burn</p>
                           <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                 <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">Fuel (Diesel)</span>
                                 <span className="text-sm font-black text-slate-900">₹{settlementData.fuel || '0'}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                 <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">Toll Charges</span>
                                 <span className="text-sm font-black text-slate-900">₹{settlementData.tolls || '0'}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                 <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">Parking</span>
                                 <span className="text-sm font-black text-slate-900">₹{settlementData.parking || '0'}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                 <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">Cleaning</span>
                                 <span className="text-sm font-black text-slate-900">₹{settlementData.cleaning || '0'}</span>
                              </div>
                           </div>
                        </div>

                        <div className="space-y-4">
                           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 border-b pb-2">Taxes & Logistics</p>
                           <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                 <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">State Border</span>
                                 <span className="text-sm font-black text-slate-900">₹{settlementData.stateTax || '0'}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                 <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">Police Entry</span>
                                 <span className="text-sm font-black text-slate-900">₹{settlementData.policeTax || '0'}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                 <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">Food / Hotel</span>
                                 <span className="text-sm font-black text-slate-900">₹{settlementData.foodHotel || '0'}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                 <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">Allowance</span>
                                 <span className="text-sm font-black text-slate-900">₹{settlementData.allowance || '0'}</span>
                              </div>
                           </div>
                        </div>

                        <div className="bg-slate-50 p-6 rounded-[2rem] flex flex-col justify-center items-center text-center border border-dashed border-slate-200">
                           <ShieldCheck className="h-10 w-10 text-emerald-600 mb-3" />
                           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Final Status</p>
                           <p className="text-xl font-black text-emerald-600 uppercase">Settled</p>
                           <p className="text-[8px] font-bold text-slate-400 mt-2 italic">
                              Finalized on {new Date(settlementData.finalizedAt).toLocaleDateString()}
                           </p>
                        </div>
                     </div>
                  </Card>
                </div>
              )}
           </div>
        </div>

        {/* Approval Dialog */}
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

      </PageLayout>
    </DashboardLayout>
  );
}
