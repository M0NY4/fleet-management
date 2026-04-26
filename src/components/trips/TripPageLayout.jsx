import { useNavigate, useParams, useLocation } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { 
  ArrowLeft, Truck, Share2, 
  Map as MapIcon, Ticket, Receipt 
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function TripPageLayout({ children, trip, loading }) {
  const navigate = useNavigate();

  if (loading || !trip) {
    return <div className="h-screen flex items-center justify-center animate-pulse text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Loading Trip Dossier...</div>;
  }

  const isPast = trip.status === "COMPLETED";

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

        <div className="mt-8">
          {children}
        </div>
      </PageLayout>
    </DashboardLayout>
  );
}
