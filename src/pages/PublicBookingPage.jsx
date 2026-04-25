import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTrips } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  MapPin, Calendar, Clock, Users, 
  ChevronRight, Ticket, CheckCircle2, 
  ArrowLeft, ShieldCheck, Phone, User,
  QrCode, Upload, CreditCard, Info
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function PublicBookingPage() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("direct");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    seats: 1,
    proof: null
  });

  const baseFare = trip ? (trip.distanceKm * trip.ratePerKm) : 0;
  const finalTotal = baseFare * formData.seats;

  useEffect(() => {
    setLoading(true);
    getTrips().then((data) => {
      const found = data.find((t) => String(t.id) === String(tripId));
      setTrip(found);
      setLoading(false);
    });
  }, [tripId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      toast.error("Required Fields", { description: "Please provide your name and contact number." });
      return;
    }

    // Prepare booking object for persistence
    const newBooking = {
      id: `BK-${Math.floor(Math.random() * 90000) + 10000}`,
      tripId: tripId,
      customerName: formData.name,
      customerPhone: formData.phone,
      seatsBooked: formData.seats,
      totalAmount: finalTotal,
      paidAmount: 0,
      status: "PENDING_APPROVAL",
      timestamp: new Date().toISOString(),
      proofPath: formData.proof ? "screenshot_uploaded.jpg" : null
    };

    // Save to localStorage for mock persistence
    const existingBookings = JSON.parse(localStorage.getItem("custom_bookings") || "[]");
    localStorage.setItem("custom_bookings", JSON.stringify([...existingBookings, newBooking]));

    setSubmitted(true);
    toast.success("Inquiry Submitted Successfully", { description: "Your request has been logged in the fleet manifest." });
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" />
    </div>
  );

  if (!trip) return <div className="text-center py-20">Trip not found</div>;

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
        <Card className="max-w-md w-full p-10 border-none shadow-2xl rounded-[3rem]">
          <div className="h-20 w-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h1 className="text-3xl font-black text-foreground mb-4">CONFIRMED!</h1>
          <p className="text-muted-foreground mb-8 font-medium">
            Booking for <span className="text-foreground font-black uppercase tracking-tight">{trip.name}</span> has been logged. Our dispatch will contact you on WhatsApp shortly.
          </p>
          <div className="bg-muted/30 p-6 rounded-3xl text-left space-y-3 mb-8">
             <div className="flex justify-between items-center text-xs">
                <span className="font-bold opacity-60 uppercase">Reference</span>
                <span className="font-black">#TRP-{Math.floor(Math.random()*10000)}</span>
             </div>
             <div className="flex justify-between items-center text-xs">
                <span className="font-bold opacity-60 uppercase">Total Bill</span>
                <span className="font-black text-emerald-600 text-lg">₹{finalTotal.toLocaleString()}</span>
             </div>
          </div>
          <Button className="w-full h-14 rounded-2xl font-black uppercase tracking-widest" onClick={() => window.close()}>Close Tab</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col: Trip Dossier */}
        <div className="lg:col-span-7 space-y-6">
           <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/60 border border-slate-100 relative overflow-hidden">
              <div className="flex justify-between items-start mb-8">
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2">Fleet Trip Dossier</p>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">{trip.name}</h1>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">Seats Available</p>
                    <p className="text-2xl font-black text-emerald-600">{trip.seatsRemaining}</p>
                 </div>
              </div>

              <div className="space-y-6 relative border-l-2 border-slate-100 pl-8 ml-2">
                 {(trip.routePoints || []).map((point, i, arr) => (
                    <div key={i} className="relative">
                       <div className={cn("absolute -left-[41px] top-1 h-4 w-4 rounded-full border-4 border-white shadow-md", i===0 ? "bg-primary" : i===arr.length-1 ? "bg-emerald-500" : "bg-slate-300")} />
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{i===0 ? "Origin" : i===arr.length-1 ? "Destination" : `Waypoint ${i}`}</p>
                       <p className="text-lg font-black text-slate-800 uppercase tracking-tight">{point}</p>
                    </div>
                 ))}
              </div>

              <div className="mt-12 grid grid-cols-3 gap-4 pt-8 border-t border-slate-50">
                 <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Distance</p>
                    <p className="text-sm font-black text-slate-800">{trip.distanceKm} KM</p>
                 </div>
                 <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rate/KM</p>
                    <p className="text-sm font-black text-slate-800">₹{trip.ratePerKm}</p>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Travel Date</p>
                    <p className="text-sm font-black text-slate-800">{new Date(trip.startDate).toLocaleDateString()}</p>
                 </div>
              </div>
           </div>

           <div className="bg-blue-600 text-white p-8 rounded-[2.5rem] shadow-xl shadow-blue-200">
              <div className="flex items-center gap-3 mb-6">
                 <Info className="h-5 w-5 opacity-60" />
                 <p className="text-[10px] font-black uppercase tracking-[0.2em]">Estimated Quotation</p>
              </div>
              <div className="space-y-4">
                 <div className="flex justify-between items-center text-sm border-b border-white/10 pb-3">
                    <span className="font-bold opacity-70 uppercase tracking-wider">Fare Calculation ({formData.seats} Seats × ₹{baseFare.toLocaleString()})</span>
                    <span className="font-black">₹{finalTotal.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between items-center pt-4">
                    <span className="text-xl font-black uppercase tracking-tighter">Total Amount</span>
                    <span className="text-4xl font-black tracking-tighter text-yellow-300">₹{finalTotal.toLocaleString()}</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Right Col: Booking Form */}
        <div className="lg:col-span-5">
           <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden sticky top-8">
              <CardHeader className="bg-slate-900 text-white p-8 text-center">
                 <CardTitle className="text-xl font-black uppercase tracking-widest">Customer Entry</CardTitle>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Direct fleet registration</p>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                 <div className="space-y-4">
                    <div className="space-y-1.5">
                       <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Full Name</Label>
                       <Input 
                          placeholder="e.g. Rahul Sharma" 
                          className="h-12 border-2 rounded-xl font-black uppercase tracking-tight"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                       />
                    </div>
                    <div className="space-y-1.5">
                       <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">WhatsApp Number</Label>
                       <Input 
                          placeholder="+91 9XXXX XXXXX" 
                          className="h-12 border-2 rounded-xl font-black"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                       />
                    </div>
                 </div>

                 {/* No of Seats Section (Replacing Optional Charges) */}
                 <div className="space-y-4 pt-4 border-t border-slate-50">
                    <div className="space-y-1.5">
                       <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">No of Seats Required</Label>
                       <div className="flex items-center gap-4">
                          <Input 
                             type="number"
                             min="1"
                             max={trip.seatsRemaining}
                             value={formData.seats}
                             onChange={(e) => setFormData({...formData, seats: parseInt(e.target.value) || 1})}
                             className="h-14 border-2 rounded-xl font-black text-xl"
                          />
                          <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-100">
                             <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Estimated Cost</p>
                             <p className="text-xl font-black text-emerald-600">₹{(baseFare * formData.seats).toLocaleString()}</p>
                          </div>
                       </div>
                       <p className="text-[9px] font-bold text-slate-400 italic mt-2 ml-1">* Final amount may vary based on exact vehicle assignment.</p>
                    </div>
                 </div>

                 {/* Payment Section */}
                 <div className="space-y-4 pt-6 border-t border-slate-50">
                    <div className="grid grid-cols-2 gap-3">
                       <Button 
                         type="button" 
                         variant={paymentMethod === "direct" ? "default" : "outline"} 
                         className="h-14 rounded-2xl flex flex-col items-center justify-center gap-1"
                         onClick={() => setPaymentMethod("direct")}
                       >
                          <QrCode className="h-5 w-5" />
                          <span className="text-[10px] font-black uppercase tracking-widest">G-Pay / UPI</span>
                       </Button>
                       <Button 
                         type="button" 
                         variant={paymentMethod === "proof" ? "default" : "outline"} 
                         className="h-14 rounded-2xl flex flex-col items-center justify-center gap-1"
                         onClick={() => setPaymentMethod("proof")}
                       >
                          <Upload className="h-5 w-5" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Upload Proof</span>
                       </Button>
                    </div>

                    {paymentMethod === "direct" ? (
                       <div className="p-6 bg-slate-50 rounded-2xl text-center border-2 border-dashed border-slate-200">
                          <QrCode className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                          <Button type="button" className="w-full h-12 bg-blue-600 font-black uppercase text-[10px] tracking-widest">Open G-Pay App</Button>
                       </div>
                    ) : (
                       <div className="p-6 bg-slate-50 rounded-2xl text-center border-2 border-dashed border-slate-200">
                          <Label className="flex flex-col items-center cursor-pointer">
                             <Upload className="h-8 w-8 text-slate-300 mb-2" />
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Upload Screenshot</span>
                             <Input type="file" className="hidden" />
                          </Label>
                       </div>
                    )}
                 </div>

                 <Button className="w-full h-16 rounded-[1.5rem] bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-200 mt-6" onClick={handleSubmit}>
                    Complete Booking Request
                 </Button>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
