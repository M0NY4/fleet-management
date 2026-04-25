import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/DataTable";
import { StatsCard } from "@/components/layout/StatsCard";
import { TableContainer } from "@/components/layout/TableContainer";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { FilterBar } from "@/components/layout/FilterBar";
import { getTransactions, getPayments } from "@/lib/api";
import { 
  TrendingUp, TrendingDown, Wallet, 
  IndianRupee, AlertTriangle, CheckCircle,
  Receipt, Users, ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { FinancialSettlementModal } from "@/components/finance/FinancialSettlementModal";

export default function FinancePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("ledger");
  const [transactions, setTransactions] = useState([]);
  const [payments, setPayments] = useState([]);
  const [paymentFilter, setPaymentFilter] = useState("all");

  useEffect(() => {
    Promise.all([getTransactions(), getPayments()]).then(([tData, pData]) => {
      // Injecting specific requirement data for demonstration
      const demoTransactions = [
        { type: "Expense", category: "Fuel", description: "Fuel (diesel/petrol) - Trip #1", amount: 45000, date: "2026-04-20" },
        { type: "Expense", category: "Tolls", description: "Toll charges Pune expressway", amount: 4500, date: "2026-04-21" },
        { type: "Expense", category: "Food", description: "Driver food & allowances", amount: 1500, date: "2026-04-21" },
        { type: "Expense", category: "Parking", description: "Parking charges - City Center", amount: 800, date: "2026-04-22" },
        { type: "Income", category: "Booking", description: "Payment from Rahul Sharma", amount: 6000, date: "2026-04-22" },
        ...tData
      ];

      const demoPayments = [
        { id: "demo-1", customerName: "Rahul Sharma", tripName: "Pune → Mumbai (Trip #1)", totalBill: 10000, paidAmount: 6000, pendingAmount: 4000, status: "Partial", lastPaymentDate: "2026-04-22" },
        ...pData
      ];

      setTransactions(demoTransactions);
      setPayments(demoPayments);
    });
  }, []);

  // Finance Ledger Calculations - NOW TRIP-WISE
  const tripWiseData = useMemo(() => {
    // For demonstration, grouping transactions and payments into Trip Summaries
    const trip1 = {
      id: 1,
      name: "Pune → Mumbai (Trip #1)",
      vehicle: "MH12AB1234",
      collection: 10000, // Total Bill
      distanceKm: 500, // For revenue calculation in modal
      ratePerKm: 20,
      expenses: 45000 + 4500 + 1500 + 800 + 2200 + 500 + 500, // Detailed list
      status: "COMPLETED"
    };

    const trip2 = {
      id: 2,
      name: "Mumbai → Goa Tour",
      vehicle: "MH14XY9999",
      collection: 85000,
      distanceKm: 600,
      ratePerKm: 140,
      expenses: 32000,
      status: "ONGOING"
    };

    const trip3 = {
      id: 3,
      name: "Corporate Event - TechCorp",
      vehicle: "MH12AB1234",
      collection: 12500,
      distanceKm: 100,
      ratePerKm: 125,
      expenses: 4200,
      status: "UPCOMING"
    };

    return [trip1, trip2, trip3];
  }, []);

  const totalIncome = useMemo(() => tripWiseData.reduce((s, t) => s + t.collection, 0), [tripWiseData]);
  const totalExpense = useMemo(() => tripWiseData.reduce((s, t) => s + t.expenses, 0), [tripWiseData]);
  const netProfit = totalIncome - totalExpense;

  // Payments / Outstanding Calculations
  const totalBilled = useMemo(() => payments.reduce((s, p) => s + p.totalBill, 0), [payments]);
  const totalCollected = useMemo(() => payments.reduce((s, p) => s + p.paidAmount, 0), [payments]);
  const totalOutstanding = useMemo(() => payments.reduce((s, p) => s + p.pendingAmount, 0), [payments]);

  const filteredPayments = useMemo(() => 
    paymentFilter === "all" ? payments : payments.filter((p) => p.status === paymentFilter),
    [payments, paymentFilter]
  );

  const tripColumns = [
    { 
      header: "Trip Assignment", 
      accessor: (r) => (
        <div>
           <p className="font-black uppercase text-slate-800 tracking-tight">{r.name}</p>
           <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Vehicle: {r.vehicle}</p>
        </div>
      )
    },
    { 
      header: "Total Collection", 
      accessor: (r) => <span className="font-bold text-emerald-600">₹{r.collection.toLocaleString()}</span> 
    },
    { 
      header: "Operational Costs", 
      accessor: (r) => <span className="font-bold text-destructive">₹{r.expenses.toLocaleString()}</span> 
    },
    { 
      header: "Net Profit", 
      accessor: (r) => {
        const p = r.collection - r.expenses;
        return (
          <div className={cn("inline-flex items-center gap-2 font-black px-4 py-2 rounded-2xl", p >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-destructive/10 text-destructive")}>
             {p >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
             ₹{p.toLocaleString()}
          </div>
        );
      }
    },
    { 
      header: "Trip Status", 
      accessor: (r) => <StatusBadge status={r.status} /> 
    },
    { 
      header: "Actions", 
      accessor: (r) => (
        <FinancialSettlementModal 
          trip={r} 
          trigger={
            <Button variant="ghost" size="sm" className="h-9 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest text-indigo-600 hover:bg-indigo-50">
               Open Ledger
            </Button>
          } 
        />
      )
    },
  ];

  const paymentColumns = [
    { header: "Customer", accessor: (r) => <span className="font-black uppercase text-slate-800">{r.customerName}</span> },
    { header: "Trip Reference", accessor: "tripName" },
    { header: "Total Bill", accessor: (r) => <span className="font-bold">₹{r.totalBill.toLocaleString()}</span> },
    { header: "Paid", accessor: (r) => <span className="text-emerald-600 font-bold">₹{r.paidAmount.toLocaleString()}</span> },
    { header: "Pending", accessor: (r) => (
      <span className={cn("font-black", r.pendingAmount > 0 ? "text-destructive" : "text-emerald-600")}>
        ₹{r.pendingAmount.toLocaleString()}
      </span>
    )},
    { header: "Status", accessor: (r) => <StatusBadge status={r.status} /> },
    { header: "Actions", accessor: (r) => (
      <div className="flex justify-end items-center gap-2">
         <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 rounded-lg border-2 border-indigo-100 text-indigo-600 hover:bg-indigo-50"
            onClick={(e) => {
               e.stopPropagation();
               navigate(`/trips/${r.tripId || 1}`); 
            }}
            title="Open Ledger"
         >
            <ExternalLink className="h-3 w-3" />
         </Button>
         {r.status !== "Paid" && (
            <Button size="sm" variant="outline" className="h-8 text-[10px] font-black uppercase tracking-widest border-2 border-emerald-500/20 text-emerald-600 hover:bg-emerald-600 hover:text-white" onClick={(e) => {
              e.stopPropagation();
              toast.success(`Marked ${r.customerName} as fully settled`);
            }}>
              Settle Dues
            </Button>
         )}
      </div>
    )},
  ];

  return (
    <DashboardLayout>
      <PageLayout fullWidth>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
           <PageHeader title="Financial Management" description="Trip-wise Profitability & Receivables Tracking" />
           <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-1 shadow-inner self-start md:self-center">
              <Button 
                 variant={activeTab === "ledger" ? "default" : "ghost"} 
                 className={cn("h-11 rounded-xl font-black uppercase text-[10px] tracking-widest px-6 shadow-sm", activeTab === "ledger" ? "bg-slate-900" : "text-slate-500")}
                 onClick={() => setActiveTab("ledger")}
              >
                 <Receipt className="h-4 w-4 mr-2" /> Trip-Wise Ledger
              </Button>
              <Button 
                 variant={activeTab === "outstanding" ? "default" : "ghost"} 
                 className={cn("h-11 rounded-xl font-black uppercase text-[10px] tracking-widest px-6 shadow-sm", activeTab === "outstanding" ? "bg-slate-900" : "text-slate-500")}
                 onClick={() => setActiveTab("outstanding")}
              >
                 <Users className="h-4 w-4 mr-2" /> Receivables Report
              </Button>
           </div>
        </div>

        {activeTab === "ledger" ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatsCard title="Gross Collection" value={`₹${totalIncome.toLocaleString()}`} icon={TrendingUp} colorClass="bg-emerald-500 text-emerald-500" />
              <StatsCard title="Operational Burn" value={`₹${totalExpense.toLocaleString()}`} icon={TrendingDown} colorClass="bg-destructive text-destructive" />
              <StatsCard title="Total Net Profit" value={`₹${netProfit.toLocaleString()}`} icon={Wallet} colorClass="bg-blue-500 text-blue-500" subValue={netProfit > 0 ? "System-wide Profit" : "Liquidity Warning"} />
            </div>

            <TableContainer className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
               <div className="p-8 border-b bg-slate-50/50 flex justify-between items-center">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Trip-Wise Performance Ledger</h3>
                  <Button variant="outline" className="h-9 rounded-xl font-black text-[10px] uppercase border-2">Generate Audit Report</Button>
               </div>
               <DataTable columns={tripColumns} data={tripWiseData} />
            </TableContainer>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatsCard title="Total Billed" value={`₹${totalBilled.toLocaleString()}`} icon={IndianRupee} colorClass="bg-blue-500 text-blue-500" />
              <StatsCard title="Total Collected" value={`₹${totalCollected.toLocaleString()}`} icon={CheckCircle} colorClass="bg-emerald-500 text-emerald-500" subValue={`${totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0}% Liquidity`} />
              <StatsCard title="Outstanding Dues" value={`₹${totalOutstanding.toLocaleString()}`} icon={AlertTriangle} colorClass="bg-orange-500 text-orange-500" subValue={`${payments.filter((p) => p.pendingAmount > 0).length} Overdue Accounts`} />
            </div>

            <div className="space-y-4">
              <FilterBar className="p-0 bg-transparent border-none">
                <div className="flex gap-2 bg-slate-100 p-1.5 rounded-xl w-fit shadow-inner">
                  {(["all", "Pending", "Partial", "Paid"]).map((f) => (
                    <button
                      key={f}
                      onClick={() => setPaymentFilter(f)}
                      className={cn(
                        "px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
                        paymentFilter === f ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                      )}
                    >
                      {f === "all" ? "Full Manifest" : f}
                    </button>
                  ))}
                </div>
              </FilterBar>

              <TableContainer className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
                 <div className="p-8 border-b bg-slate-50/50 flex justify-between items-center">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Receivables Report</h3>
                    <div className="flex gap-2">
                       <Button variant="outline" className="h-9 rounded-xl font-black text-[10px] uppercase border-2">Remind All</Button>
                       <Button variant="outline" className="h-9 rounded-xl font-black text-[10px] uppercase border-2">Export CSV</Button>
                    </div>
                 </div>
                 <DataTable columns={paymentColumns} data={filteredPayments} />
              </TableContainer>
            </div>
          </div>
        )}
      </PageLayout>
    </DashboardLayout>
  );
}
