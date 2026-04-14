import { useState, useEffect, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/DataTable";
import { StatsCard } from "@/components/layout/StatsCard";
import { TableContainer } from "@/components/layout/TableContainer";
import { getTransactions } from "@/lib/api";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FinancePage() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    getTransactions().then(setTransactions);
  }, []);

  const totalIncome = useMemo(() => 
    transactions.filter((t) => t.type === "Income").reduce((s, t) => s + t.amount, 0),
    [transactions]
  );
  const totalExpense = useMemo(() => 
    transactions.filter((t) => t.type === "Expense").reduce((s, t) => s + t.amount, 0),
    [transactions]
  );
  const profit = totalIncome - totalExpense;

  const columns = [
    {
      header: "Type",
      accessor: (r) => (
        <span className={cn(
          "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
          r.type === "Income" ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"
        )}>
          {r.type}
        </span>
      ),
    },
    { header: "Category", accessor: "category" },
    { header: "Description", accessor: "description" },
    { header: "Amount", accessor: (r) => <span className={r.type === "Income" ? "text-success font-medium" : "text-destructive font-medium"}>₹{r.amount.toLocaleString()}</span> },
    { header: "Date", accessor: "date" },
  ];

  return (
    <DashboardLayout>
      <PageLayout fullWidth>
        <PageHeader title="Accounts / Finance" description="Track income, expenses, and profitability" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard title="Total Income" value={`₹${totalIncome.toLocaleString()}`} icon={TrendingUp} colorClass="bg-green-500 text-green-500" />
          <StatsCard title="Total Expenses" value={`₹${totalExpense.toLocaleString()}`} icon={TrendingDown} colorClass="bg-red-500 text-red-500" />
          <StatsCard title="Profit" value={`₹${profit.toLocaleString()}`} icon={Wallet} colorClass="bg-blue-500 text-blue-500" subValue={profit > 0 ? "Profitable" : "Loss"} />
        </div>

        <TableContainer>
          <DataTable columns={columns} data={transactions} />
        </TableContainer>
      </PageLayout>
    </DashboardLayout>
  );
}
