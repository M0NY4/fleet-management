import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageLayout } from "@/components/layout/PageLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { getTrips, getCustomerBookings } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/DataTable";
import { TableContainer } from "@/components/layout/TableContainer";
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
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

function ExpenseInput({ label, value, setter, icon: Icon }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
        {label}
      </Label>
      <div className="relative group">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50 group-hover:text-primary transition-colors">
          <Icon className="h-3.5 w-3.5" />
        </div>
        <Input
          type="number"
          value={value}
          onChange={(e) => setter(Number(e.target.value))}
          className="h-9 pl-9 border-border/60 bg-muted/20 focus-visible:ring-primary transition-all font-bold text-sm"
          placeholder="0.00"
        />
      </div>
    </div>
  );
}

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
  const [trips, setTrips] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [fuelCost, setFuelCost] = useState(0);
  const [tollCharges, setTollCharges] = useState(0);
  const [driverFood, setDriverFood] = useState(0);
  const [parkingCharges, setParkingCharges] = useState(0);
  const [stateBorderTax, setStateBorderTax] = useState(0);
  const [policeEntryTax, setPoliceEntryTax] = useState(0);
  const [cleaningCharges, setCleaningCharges] = useState(0);
  const [driverAllowance, setDriverAllowance] = useState(0);
  const [hotelCharges, setHotelCharges] = useState(0);
  const [miscCharges, setMiscCharges] = useState(0);

  useEffect(() => {
    Promise.all([getTrips(), getCustomerBookings()]).then(
      ([tripsData, bookingsData]) => {
        setTrips(tripsData);
        setBookings(bookingsData);

        const currentTrip = tripsData.find((t) => t.id === tripId);
        if (currentTrip) {
          const e = currentTrip.expenses || {};
          setFuelCost(e.fuelCost || 0);
          setTollCharges(e.tollCharges || 0);
          setDriverFood(e.driverFood || 0);
          setParkingCharges(e.parkingCharges || 0);
          setStateBorderTax(e.stateBorderTax || 0);
          setPoliceEntryTax(e.policeEntryTax || 0);
          setCleaningCharges(e.cleaningCharges || 0);
          setDriverAllowance(e.driverAllowance || 0);
          setHotelCharges(e.hotelCharges || 0);
          setMiscCharges(e.miscCharges || 0);
        }
      },
    );
  }, [tripId]);

  const trip = useMemo(
    () => trips.find((t) => t.id === tripId),
    [trips, tripId],
  );

  if (!trip) {
    return (
      <DashboardLayout>
        <PageLayout>
          <div className="flex flex-col items-center justify-center py-24 bg-card border rounded-2xl border-dashed">
            <AlertCircle className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <h2 className="text-xl font-bold">Trip not found</h2>
            <p className="text-muted-foreground text-sm mt-1">
              The trip ID you requested does not exist or has been archived.
            </p>
            <Button
              variant="primary"
              className="mt-6 font-bold"
              onClick={() => navigate("/trips")}
            >
              Back to Fleet Ops
            </Button>
          </div>
        </PageLayout>
      </DashboardLayout>
    );
  }

  const totalExpenses =
    fuelCost +
    tollCharges +
    driverFood +
    parkingCharges +
    stateBorderTax +
    policeEntryTax +
    cleaningCharges +
    driverAllowance +
    hotelCharges +
    miscCharges;
  const tripBookings = bookings.filter((b) => b.tripId === tripId);
  const totalRevenue = tripBookings.reduce(
    (sum, b) => sum + (b.paidAmount || 0),
    0,
  );
  const occupancyPercent = Math.round(
    ((trip.bookedSeats || 0) / (trip.totalSeats || 1)) * 100,
  );

  const bookingCols = [
    {
      header: "Customer",
      accessor: (r) => (
        <div className="flex flex-col">
          <span className="font-bold">{r.customerName}</span>
          <span className="text-[10px] text-muted-foreground">{r.phone}</span>
        </div>
      ),
    },
    {
      header: "Seats",
      accessor: (r) => <span className="font-bold">{r.seatsBooked}</span>,
    },
    {
      header: "Paid",
      accessor: (r) => (
        <span className="font-bold text-emerald-600">
          ₹{(r.paidAmount || 0).toLocaleString()}
        </span>
      ),
    },
    {
      header: "Pending",
      accessor: (r) => (
        <span
          className={cn(
            "font-bold",
            (r.pendingAmount || 0) > 0
              ? "text-destructive"
              : "text-emerald-500",
          )}
        >
          ₹{(r.pendingAmount || 0).toLocaleString()}
        </span>
      ),
    },
    { header: "Status", accessor: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <DashboardLayout>
      <PageLayout fullWidth>
        {/* Top Operational Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-primary text-primary-foreground p-6 rounded-2xl shadow-lg relative overflow-hidden">
          {/* Subtle Background Icon */}
          <Truck className="absolute -right-10 -bottom-10 h-64 w-64 text-white/5 pointer-events-none rotate-12" />

          <div className="flex items-center gap-4 relative z-10">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/trips")}
              className="rounded-full bg-white/10 border-white/20 hover:bg-white/20 text-white"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black tracking-tight">
                  {trip.name}
                </h1>
                <span className="bg-accent text-accent-foreground text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
                  {trip.status}
                </span>
              </div>
              <p className="text-white/70 text-sm font-medium mt-1">
                Operational ID:{" "}
                <span className="text-white font-bold">{trip.id}</span> •
                Reference:{" "}
                <span className="text-white font-bold uppercase">
                  {trip.vehicle}
                </span>
              </p>
            </div>
          </div>

          <div className="flex gap-2 relative z-10">
            <Button
              variant="secondary"
              className="font-bold shadow-sm"
              onClick={() => toast.info("Print manifest feature coming soon")}
            >
              Manifest
            </Button>
            <Button
              className="bg-accent text-accent-foreground font-black hover:bg-accent/90"
              onClick={() => toast.success("Trip marked as Active")}
            >
              Live Track
            </Button>
          </div>
        </div>

        {/* Top Logistical Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DetailItem
                label="Assigned Driver"
                value={trip.driver}
                icon={Users}
                colorClass="bg-blue-500/10 text-blue-600"
              />
              <DetailItem
                label="Fleet Category"
                value={trip.vehicleCategory || "Luxury Coach"}
                icon={Truck}
                colorClass="bg-indigo-500/10 text-indigo-600"
              />
              <DetailItem
                label="Departure"
                value={`${trip.date} • ${trip.time}`}
                icon={Clock}
                colorClass="bg-orange-500/10 text-orange-600"
              />
              <DetailItem
                label="Estimated Distance"
                value={`${trip.distance} KM`}
                icon={MapPin}
                colorClass="bg-emerald-500/10 text-emerald-600"
              />
            </div>

            <Card className="border-border/40 overflow-hidden shadow-sm">
              <CardHeader className="bg-muted/30 border-b pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <MapIcon className="h-4 w-4 text-primary" /> Route Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 px-10">
                <div className="relative border-l-2 border-primary/20 pl-8 space-y-12">
                  {/* Pickup */}
                  <div className="relative">
                    <div className="absolute -left-[41px] top-0 h-5 w-5 rounded-full bg-primary border-4 border-background animate-pulse shadow-sm" />
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                        Origin / Pickup
                      </span>
                      <span className="text-lg font-black text-foreground">
                        {(trip.route || "").split("→")[0]}
                      </span>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5 font-medium">
                        <Clock className="h-3 w-3" /> Scheduled Check-in:{" "}
                        {trip.time}
                      </p>
                    </div>
                  </div>

                  {/* Mid-point (mocked) */}
                  <div className="relative">
                    <div className="absolute -left-[41px] top-4 h-4 w-4 rounded-full bg-border border-4 border-background" />
                    <div className="flex flex-col opacity-40 grayscale pointer-events-none">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                        Waypoint 1 (Auto-logged)
                      </span>
                      <span className="text-base font-bold">
                        Lonavala Food Court
                      </span>
                    </div>
                  </div>

                  {/* Drop */}
                  <div className="relative">
                    <div className="absolute -left-[41px] top-0 h-5 w-5 rounded-full bg-emerald-500 border-4 border-background shadow-sm shadow-emerald-200" />
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                        Final Destination / Drop
                      </span>
                      <span className="text-lg font-black text-foreground">
                        {(trip.route || "").split("→")[1] || "Destination"}
                      </span>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5 font-medium">
                        <CheckCircle2 className="h-3 w-3 text-emerald-500" />{" "}
                        Est. Arrival: Successful
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-indigo-500/20 bg-indigo-50/10 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center justify-between text-indigo-900/70">
                  Operational Health
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-[10px] font-black uppercase mb-1.5 tracking-tight">
                    <span className="text-muted-foreground">Load Factor</span>
                    <span
                      className={cn(
                        occupancyPercent > 90
                          ? "text-destructive"
                          : "text-indigo-600",
                      )}
                    >
                      {trip.bookedSeats} / {trip.totalSeats} PAX
                    </span>
                  </div>
                  <div className="h-2 w-full bg-indigo-100/50 rounded-full overflow-hidden border border-indigo-200/20">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-1000",
                        occupancyPercent > 90
                          ? "bg-destructive shadow-[0_0_8px_#ef444466]"
                          : "bg-indigo-600 shadow-[0_0_8px_#4f46e566]",
                      )}
                      style={{ width: `${occupancyPercent}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-indigo-100 shadow-sm">
                  <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100">
                    <IndianRupee className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Profitability
                    </p>
                    <p className="text-xl font-black tracking-tighter text-emerald-700">
                      ₹{(totalRevenue - totalExpenses).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground pl-1">
                Actions & Controls
              </h3>
              <Button className="w-full h-12 rounded-xl font-black uppercase tracking-wider shadow-md bg-foreground text-background hover:bg-foreground/90 transition-all">
                Close Trip Records
              </Button>
              <Button
                variant="outline"
                className="w-full h-12 rounded-xl font-bold border-2 border-primary/20 text-primary hover:bg-primary/5 transition-all"
              >
                <Calendar className="h-4 w-4 mr-2" /> Reschedule Trip
              </Button>
              <Button
                variant="ghost"
                className="w-full h-12 rounded-xl font-bold text-destructive hover:bg-destructive/5 transition-all"
              >
                <AlertCircle className="h-4 w-4 mr-2" /> Cancel Operations
              </Button>
            </div>
          </div>
        </div>

        {/* Full-width Ledger and Manifest Sections */}
        <div className="space-y-8 mt-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">
                Manifest / Customer List
              </h3>
              <Button
                variant="outline"
                size="sm"
                className="h-8 font-bold border-dashed border-2"
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Booking
              </Button>
            </div>
            <TableContainer>
              <DataTable columns={bookingCols} data={tripBookings} />
            </TableContainer>
          </div>

          <Card className="border-border/60 shadow-md overflow-hidden bg-white">
            <CardHeader className="pb-6 border-b bg-muted/20">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-black uppercase tracking-widest flex items-center gap-2 text-primary">
                  <Calculator className="h-5 w-5" /> Operational Settlement &
                  Ledger
                </CardTitle>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase bg-muted px-2 py-1 rounded tracking-tighter">
                    ID: {tripId}
                  </span>
                  <StatusBadge status={trip.status} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 xl:grid-cols-3 divide-y xl:divide-y-0 xl:divide-x border-b">
                {/* Data Entry Area (2/3 width) */}
                <div className="xl:col-span-2 p-8 bg-white space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Operational Category */}
                    <div className="space-y-5">
                      <div className="flex items-center gap-2 pb-2 border-b border-dashed">
                        <HardDrive className="h-4 w-4 text-primary" />
                        <span className="text-xs font-black uppercase tracking-widest text-primary">
                          Direct Operational Costs
                        </span>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        <ExpenseInput
                          label="Fuel Cost"
                          value={fuelCost}
                          setter={setFuelCost}
                          icon={HardDrive}
                        />
                        <ExpenseInput
                          label="Toll & Entry"
                          value={tollCharges}
                          setter={setTollCharges}
                          icon={MapPin}
                        />
                        <ExpenseInput
                          label="Parking Fees"
                          value={parkingCharges}
                          setter={setParkingCharges}
                          icon={MapPin}
                        />
                        <ExpenseInput
                          label="Cleaning / Sanitization"
                          value={cleaningCharges}
                          setter={setCleaningCharges}
                          icon={CheckCircle2}
                        />
                      </div>
                    </div>

                    {/* Crew & Taxes Category */}
                    <div className="space-y-5">
                      <div className="flex items-center gap-2 pb-2 border-b border-dashed">
                        <Wallet className="h-4 w-4 text-orange-600" />
                        <span className="text-xs font-black uppercase tracking-widest text-orange-600">
                          Crew & Statutory Charges
                        </span>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        <ExpenseInput
                          label="Driver Allowance"
                          value={driverAllowance}
                          setter={setDriverAllowance}
                          icon={Wallet}
                        />
                        <ExpenseInput
                          label="Food & Logistics"
                          value={driverFood}
                          setter={setDriverFood}
                          icon={Calculator}
                        />
                        <ExpenseInput
                          label="Border & Entry Tax"
                          value={stateBorderTax}
                          setter={setStateBorderTax}
                          icon={ShieldCheck}
                        />
                        <ExpenseInput
                          label="Accommodation / Hotel"
                          value={hotelCharges}
                          setter={setHotelCharges}
                          icon={Receipt}
                        />
                        <ExpenseInput
                          label="Misc Charges"
                          value={miscCharges}
                          setter={setMiscCharges}
                          icon={Plus}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial Statement Area (1/3 width) */}
                <div className="p-8 bg-muted/5 space-y-8">
                  <div className="flex items-center gap-2 pb-2 border-b border-dashed">
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                    <span className="text-xs font-black uppercase tracking-widest text-emerald-600">
                      Trip Balance Sheet
                    </span>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm font-bold">
                        <span className="text-muted-foreground uppercase tracking-wider text-[10px]">
                          Gross Revenue
                        </span>
                        <span className="text-emerald-600">
                          ₹{totalRevenue.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm font-bold">
                        <span className="text-muted-foreground uppercase tracking-wider text-[10px]">
                          Total Outflow
                        </span>
                        <span className="text-destructive">
                          ₹{totalExpenses.toLocaleString()}
                        </span>
                      </div>
                      <div className="h-px bg-border my-2" />
                      <div className="flex flex-col gap-1">
                        <span className="text-muted-foreground uppercase tracking-widest text-[10px] font-black">
                          Net Margin
                        </span>
                        <div
                          className={cn(
                            "p-4 rounded-xl flex items-center justify-between shadow-inner",
                            totalRevenue - totalExpenses >= 0
                              ? "bg-emerald-50 border border-emerald-100"
                              : "bg-destructive/5 border border-destructive/10",
                          )}
                        >
                          <p
                            className={cn(
                              "text-3xl font-black tracking-tighter",
                              totalRevenue - totalExpenses >= 0
                                ? "text-emerald-700"
                                : "text-destructive",
                            )}
                          >
                            ₹{(totalRevenue - totalExpenses).toLocaleString()}
                          </p>
                          {totalRevenue - totalExpenses >= 0 ? (
                            <TrendingUp className="h-6 w-6 text-emerald-400" />
                          ) : (
                            <AlertCircle className="h-6 w-6 text-destructive/30" />
                          )}
                        </div>
                        <p className="text-[10px] text-muted-foreground font-medium mt-1">
                          Calculated Margin:{" "}
                          {Math.round(
                            ((totalRevenue - totalExpenses) /
                              (totalRevenue || 1)) *
                              100,
                          )}
                          %
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 pt-6 border-t border-dashed">
                      <Button
                        className="w-full h-12 rounded-xl font-black uppercase tracking-widest shadow-lg bg-primary hover:bg-primary/90 transition-all text-xs"
                        onClick={() => toast.success("Settlement Completed")}
                      >
                        Finalize Settlement
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full h-10 rounded-xl font-bold text-muted-foreground hover:text-primary transition-all text-xs"
                        onClick={() =>
                          toast.info("Syncing ledger with cloud...")
                        }
                      >
                        Save as Draft
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-muted/30 p-4 border-t flex items-center justify-center gap-3 text-[10px] text-muted-foreground font-medium italic">
                <History className="h-3.5 w-3.5" />
                Last updated on {new Date().toLocaleDateString()} at{" "}
                {new Date().toLocaleTimeString()} • All finances are subject to
                audit.
              </div>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    </DashboardLayout>
  );
}
