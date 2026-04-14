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
  MapPin, Calendar, Users, ChevronRight, 
  Search, LayoutGrid, List as ListIcon, 
  ArrowLeftRight, IndianRupee, Truck, UserCircle,
  TrendingUp, Clock, CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StatsCard } from "@/components/layout/StatsCard";
import { FilterBar } from "@/components/layout/FilterBar";
import { TableContainer } from "@/components/layout/TableContainer";

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
      const isUpcoming = trip.status === "Upcoming";
      const isOngoing = trip.status === "Ongoing" || trip.status === "In Progress";
      const isPast = trip.status === "Completed" || trip.status === "Cancelled";
      
      const matchStatus = 
        statusFilter === "All" ? true :
        statusFilter === "Upcoming" ? isUpcoming :
        statusFilter === "Ongoing" ? isOngoing : isPast;

      return matchSearch && matchStatus;
    });
  }, [trips, search, statusFilter]);

  const stats = useMemo(() => {
    const upcoming = trips.filter(t => t.status === "Upcoming").length;
    const ongoing = trips.filter(t => t.status === "Ongoing" || t.status === "In Progress").length;
    const completed = trips.filter(t => t.status === "Completed").length;
    const totalRevenue = trips.reduce((sum, t) => sum + (t.totalAmount || 0), 0);
    return { upcoming, ongoing, completed, totalRevenue, total: trips.length };
  }, [trips]);

  return (
    <DashboardLayout>
      <PageLayout>
        <PageHeader
          title="Trip Management"
          description="Monitor and manage all fleet operations and trip schedules."
          actionLabel="Create Booking"
          onAction={() => navigate("/create-booking")}
        />

        {/* Quick Stats Header */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          <StatsCard icon={Truck} title="Total Trips" value={stats.total} colorClass="bg-primary text-primary" />
          <StatsCard icon={Clock} title="Ongoing" value={stats.ongoing} colorClass="bg-blue-500 text-blue-500" />
          <StatsCard icon={CheckCircle2} title="Completed" value={stats.completed} colorClass="bg-green-500 text-green-500" />
          <StatsCard icon={TrendingUp} title="Upcoming" value={stats.upcoming} colorClass="bg-purple-500 text-purple-500" />
        </div>

      {/* Advanced Toolbar */}
      <FilterBar className="mb-6 justify-between w-full">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            type="text" 
            placeholder="Search trips, drivers, vehicles..." 
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
          {filteredTrips.map((trip) => {
            const seatsPercent = Math.round(((trip.bookedSeats || 0) / (trip.totalSeats || 1)) * 100);
            const [pickup, drop] = (trip.route || "").split("→").map(s => s.trim());
            const statusColor = 
              trip.status === "Upcoming" ? "bg-secondary" :
              trip.status === "Ongoing" || trip.status === "In Progress" ? "bg-indigo-500 animate-pulse" :
              trip.status === "Completed" ? "bg-success" : "bg-destructive";

            return (
              <div 
                key={trip.id}
                className="group relative bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                onClick={() => navigate(`/trips/${trip.id}`)}
              >
                {/* Ticket Header */}
                <div className={cn("h-2 w-full", statusColor)} />
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-extrabold text-lg text-foreground group-hover:text-primary transition-colors">{trip.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold bg-muted px-2 py-0.5 rounded text-muted-foreground uppercase">{trip.id}</span>
                        <span className="text-[10px] font-bold bg-primary/5 text-primary px-2 py-0.5 rounded uppercase">{trip.vehicle}</span>
                      </div>
                    </div>
                    <StatusBadge status={trip.status} />
                  </div>

                  {/* Visual Route Timeline */}
                  <div className="flex items-center gap-3 my-6">
                    <div className="flex-1">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Pickup</p>
                      <p className="text-sm font-bold truncate">{pickup}</p>
                    </div>
                    <div className="flex flex-col items-center gap-1 px-2">
                       <div className="h-px w-8 bg-border border-t border-dashed" />
                       <ArrowLeftRight className="h-3.5 w-3.5 text-muted-foreground/50" />
                       <div className="h-px w-8 bg-border border-t border-dashed" />
                    </div>
                    <div className="flex-1 text-right">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Drop</p>
                      <p className="text-sm font-bold truncate">{drop || "N/A"}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-dashed">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" /> Schedule</p>
                      <p className="text-sm font-bold">{trip.date}</p>
                      <p className="text-[10px] font-medium text-muted-foreground">{trip.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1 justify-end"><UserCircle className="h-3 w-3" /> Driver</p>
                      <p className="text-sm font-bold">{trip.driver}</p>
                      <p className="text-[10px] font-medium text-muted-foreground">Rating: 4.8★</p>
                    </div>
                  </div>

                  {/* Occupancy */}
                  <div className="space-y-1.5 mb-6">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-tight">
                      <span className="text-muted-foreground">Occupancy</span>
                      <span className={cn(seatsPercent > 90 ? "text-destructive" : "text-primary")}>{trip.bookedSeats} / {trip.totalSeats} Seats</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div 
                        className={cn("h-full rounded-full transition-all duration-500", seatsPercent > 90 ? "bg-destructive" : "bg-primary")}
                        style={{ width: `${Math.min(seatsPercent, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex flex-col gap-4 pt-4 border-t border-border/40">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Revenue</p>
                        <p className="text-lg font-black text-emerald-600 flex items-center tracking-tighter">
                          <IndianRupee className="h-3.5 w-3.5 mr-0.5" />{(trip.totalAmount || 0).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex flex-col text-right">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Expenses</p>
                        <p className="text-lg font-black text-destructive flex items-center justify-end tracking-tighter">
                          <IndianRupee className="h-3.5 w-3.5 mr-0.5" />{(Object.values(trip.expenses || {}).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0)).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className={cn(
                        "px-3 py-1.5 rounded-lg flex items-center gap-2",
                        (trip.totalAmount - Object.values(trip.expenses || {}).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0)) >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-destructive/5 text-destructive"
                      )}>
                        <TrendingUp className="h-3.5 w-3.5" />
                        <span className="text-xs font-black tracking-tight">
                        ₹{(trip.totalAmount - Object.values(trip.expenses || {}).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0)).toLocaleString()} Profit
                        </span>
                      </div>
                      <Button variant="secondary" size="sm" className="rounded-lg font-bold group-hover:bg-primary group-hover:text-primary-foreground transition-all h-8 text-xs">
                        View Details <ChevronRight className="h-3.5 w-3.5 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <TableContainer>
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] uppercase font-black bg-muted/30 text-muted-foreground tracking-widest border-b">
                <tr>
                  <th className="px-6 py-5">Trip & Vehicle</th>
                  <th className="px-6 py-5">Route Path</th>
                  <th className="px-6 py-5 text-center">Schedule</th>
                  <th className="px-6 py-5">Occupancy</th>
                  <th className="px-6 py-5 text-right">Revenue</th>
                  <th className="px-6 py-5 text-right">Expenses</th>
                  <th className="px-6 py-5 text-right">Profit</th>
                  <th className="px-6 py-5 text-center">Status</th>
                  <th className="px-6 py-5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredTrips.map((trip) => (
                  <tr 
                    key={trip.id} 
                    className="hover:bg-gray-50 bg-white transition-colors cursor-pointer group"
                    onClick={() => navigate(`/trips/${trip.id}`)}
                  >
                    <td className="px-6 py-4">
                      <p className="font-bold text-foreground truncate max-w-[150px]">{trip.name}</p>
                      <p className="text-[10px] font-medium text-muted-foreground uppercase">{trip.vehicle}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 max-w-[200px] truncate">
                        <span className="font-bold">{(trip.route || "").split("→")[0]}</span>
                        <ArrowLeftRight className="h-3 w-3 text-muted-foreground/40 shrink-0" />
                        <span className="font-bold text-muted-foreground">{(trip.route || "").split("→")[1] || "N/A"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <p className="font-bold">{trip.date}</p>
                      <p className="text-[10px] text-muted-foreground font-medium">{trip.time}</p>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-3">
                         <span className="font-bold min-w-[3rem]">{trip.bookedSeats}/{trip.totalSeats}</span>
                         <div className="h-1.5 w-20 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(trip.bookedSeats/trip.totalSeats)*100}%` }} />
                         </div>
                       </div>
                    </td>
                    <td className="px-6 py-4 text-right font-black text-emerald-600">
                      ₹{(trip.totalAmount || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-destructive">
                      ₹{(Object.values(trip.expenses || {}).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0)).toLocaleString()}
                    </td>
                    <td className={cn(
                      "px-6 py-4 text-right font-black",
                      (trip.totalAmount - Object.values(trip.expenses || {}).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0)) >= 0 ? "text-emerald-700" : "text-destructive"
                    )}>
                      ₹{(trip.totalAmount - Object.values(trip.expenses || {}).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0)).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <StatusBadge status={trip.status} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg border opacity-0 group-hover:opacity-100 transition-all">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
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
