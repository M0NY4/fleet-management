import { useState, useEffect, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { getPayments } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/layout/StatsCard";
import { FilterBar } from "@/components/layout/FilterBar";
import { TableContainer } from "@/components/layout/TableContainer";
import { IndianRupee, AlertTriangle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    getPayments().then(setPayments);
  }, []);

  const totalBill = useMemo(() => payments.reduce((s, p) => s + p.totalBill, 0), [payments]);
  const totalPaid = useMemo(() => payments.reduce((s, p) => s + p.paidAmount, 0), [payments]);
  const totalPending = useMemo(() => payments.reduce((s, p) => s + p.pendingAmount, 0), [payments]);

  const filtered = useMemo(() => 
    filter === "all" ? payments : payments.filter((p) => p.status === filter),
    [payments, filter]
  );

  const columns = [
    { header: "Customer", accessor: "customerName" },
    { header: "Trip", accessor: "tripName" },
    { header: "Total Bill", accessor: (r) => `₹${r.totalBill.toLocaleString()}` },
    { header: "Paid", accessor: (r) => <span className="text-success font-medium">₹{r.paidAmount.toLocaleString()}</span> },
    { header: "Pending", accessor: (r) => (
      <span className={r.pendingAmount > 0 ? "text-destructive font-medium" : "text-success font-medium"}>
        ₹{r.pendingAmount.toLocaleString()}
      </span>
    )},
    { header: "Status", accessor: (r) => <StatusBadge status={r.status} /> },
    { header: "Last Payment", accessor: "lastPaymentDate" },
    { header: "", accessor: (r) => r.status !== "Paid" ? (
      <Button size="sm" variant="outline" className="text-xs" onClick={(e) => {
        e.stopPropagation();
        toast.success(`Marked ${r.customerName} as completed`);
      }}>
        Mark Completed
      </Button>
    ) : null },
  ];

  return (
    <DashboardLayout>
      <PageLayout>
        <PageHeader title="Payments / Outstanding" description="Track customer payments and outstanding dues" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard title="Total Billed" value={`₹${totalBill.toLocaleString()}`} icon={IndianRupee} colorClass="bg-blue-500 text-blue-500" />
          <StatsCard title="Total Collected" value={`₹${totalPaid.toLocaleString()}`} icon={CheckCircle} colorClass="bg-green-500 text-green-500" subValue={`${totalBill > 0 ? Math.round((totalPaid / totalBill) * 100) : 0}% collected`} />
          <StatsCard title="Outstanding" value={`₹${totalPending.toLocaleString()}`} icon={AlertTriangle} colorClass="bg-orange-500 text-orange-500" subValue={`${payments.filter((p) => p.pendingAmount > 0).length} pending`} />
        </div>

        {/* Filter Tabs */}
        <FilterBar className="p-2">
          <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit">
            {(["all", "Pending", "Partial", "Paid"]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md transition-colors capitalize",
                  filter === f ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {f === "all" ? "All" : f}
              </button>
            ))}
          </div>
        </FilterBar>

        <TableContainer>
          <DataTable columns={columns} data={filtered} />
        </TableContainer>
      </PageLayout>
    </DashboardLayout>
  );
}
