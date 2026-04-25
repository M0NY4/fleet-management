import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { getTrips } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  MapPin, Calendar, ChevronRight, 
  Search, LayoutGrid, List as ListIcon, 
  ArrowLeftRight, IndianRupee, Truck,
  TrendingUp, Clock, CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StatsCard } from "@/components/layout/StatsCard";
import { FilterBar } from "@/components/layout/FilterBar";
import { TableContainer } from "@/components/layout/TableContainer";

import { TripCard } from "@/components/trips/TripCard";

export default function TripListPage() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    getTrips().then(setTrips);
  }, []);

  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      const matchSearch = Object.values(trip).join(" ").toLowerCase().includes(search.toLowerCase());
      const isUpcoming = trip.status === "UPCOMING";
      const isOngoing = trip.status === "ONGOING";
      const isPast = trip.status === "COMPLETED" || trip.status === "CANCELLED";
      
      const matchStatus = 
        statusFilter === "All" ? true :
        statusFilter === "Upcoming" ? isUpcoming :
        statusFilter === "Ongoing" ? isOngoing : isPast;

      return matchSearch && matchStatus;
    });
  }, [trips, search, statusFilter]);

  const stats = useMemo(() => {
    const upcoming = trips.filter(t => t.status === "UPCOMING").length;
    const ongoing = trips.filter(t => t.status === "ONGOING").length;
    const completed = trips.filter(t => t.status === "COMPLETED").length;
    const totalRevenue = trips.reduce((sum, t) => sum + (t.distanceKm * t.ratePerKm || 0), 0);
    return { upcoming, ongoing, completed, totalRevenue, total: trips.length };
  }, [trips]);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  };

  return (
    <DashboardLayout>
      <PageLayout>
        <PageHeader
          title="Operation Dashboard"
          description="Track active trips, manage routes, and monitor fleet logistics."
          actionLabel="Create Trip"
          onAction={() => navigate("/create-booking")}
        />


      {/* Advanced Toolbar */}
      <FilterBar className="mb-6 justify-between w-full">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            type="text" 
            placeholder="Search trips, routes, statuses..." 
            className="pl-9 h-11 w-full bg-card border-border/60 focus-visible:ring-primary shadow-sm rounded-xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex bg-muted/50 p-1 rounded-lg border w-full md:w-auto">
            {["All", "Upcoming", "Ongoing", "Past"].map((t) => (
              <button
                key={t}
                onClick={() => setStatusFilter(t)}
                className={cn(
                  "flex-1 md:flex-none px-5 py-1.5 text-xs font-bold uppercase tracking-tight rounded-md transition-all",
                  statusFilter === t 
                    ? "bg-background text-primary shadow-sm border border-border/50" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="hidden md:flex bg-muted/50 p-1 rounded-lg border">
            <button 
              onClick={() => setViewMode("grid")}
              className={cn("p-2 rounded-md transition-all", viewMode === "grid" ? "bg-background shadow-sm text-primary border border-border/50" : "text-muted-foreground hover:text-foreground")}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button 
              onClick={() => setViewMode("list")}
              className={cn("p-2 rounded-md transition-all", viewMode === "list" ? "bg-background shadow-sm text-primary border border-border/50" : "text-muted-foreground hover:text-foreground")}
            >
              <ListIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </FilterBar>

      {/* Trips Rendering */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} onClick={() => navigate(`/trips/${trip.id}`)} />
          ))}
        </div>
      ) : (
        /* List View */
        <TableContainer>
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] uppercase font-black bg-muted/30 text-muted-foreground tracking-widest border-b">
                <tr>
                  <th className="px-6 py-5">Trip Identity</th>
                  <th className="px-6 py-5">Route Path</th>
                  <th className="px-6 py-5 text-center">Departure</th>
                  <th className="px-6 py-5">Availability</th>
                  <th className="px-6 py-5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredTrips.map((trip) => {
                  const revenue = trip.distanceKm * trip.ratePerKm;
                  const expenses = (trip.tripExpences || []).reduce((a, b) => a + b.ammountRs, 0);
                  const profit = revenue - expenses;
                  return (
                    <tr 
                      key={trip.id} 
                      className="hover:bg-gray-50 bg-white transition-colors cursor-pointer group"
                      onClick={() => navigate(`/trips/${trip.id}`)}
                    >
                      <td className="px-6 py-4">
                        <p className="font-bold text-foreground truncate max-w-[150px]">{trip.name}</p>
                        <p className="text-[10px] font-medium text-muted-foreground uppercase">ID: {trip.id}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 max-w-[200px] truncate">
                          <span className="font-bold uppercase tracking-tight">{(trip.routePoints || [])[0] || "TBD"}</span>
                          <ArrowLeftRight className="h-3 w-3 text-muted-foreground/40 shrink-0" />
                          <span className="font-bold text-muted-foreground uppercase tracking-tight">{(trip.routePoints || [])[(trip.routePoints || []).length - 1] || "TBD"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <p className="font-bold">{formatDate(trip.startDate)}</p>
                        <p className="text-[10px] text-muted-foreground font-medium uppercase">{new Date(trip.startDate).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</p>
                      </td>
                      <td className="px-6 py-4">
                         <div className="flex items-center gap-3">
                           <span className="font-bold min-w-[3rem] text-xs uppercase tracking-tight">{trip.seatsRemaining} Left</span>
                           <div className="h-1.5 w-20 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(trip.seatsRemaining/trip.totalSeats)*100}%` }} />
                           </div>
                         </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <StatusBadge status={trip.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
        </TableContainer>
      )}


      {/* Empty State */}
      {filteredTrips.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-white shadow-sm rounded-xl border border-dashed border-primary/20">
          <div className="p-4 rounded-full bg-primary/5 mb-4">
            <Search className="h-10 w-10 text-primary/40" />
          </div>
          <h3 className="text-xl font-extrabold text-foreground">No matches found</h3>
          <p className="text-muted-foreground text-sm max-w-sm text-center mt-2 font-medium">
            We couldn't find any trips matching your current search or status filters.
          </p>
          <Button variant="link" className="mt-4 font-bold text-primary" onClick={() => { setSearch(""); setStatusFilter("All"); }}>
            Reset all filters
          </Button>
        </div>
      )}
      </PageLayout>
    </DashboardLayout>
  );
}
