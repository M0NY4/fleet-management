import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useTripData } from "@/hooks/useTripData";
import { TripPageLayout } from "@/components/trips/TripPageLayout";
import { TableContainer } from "@/components/layout/TableContainer";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Receipt, Plus, FileText } from "lucide-react";
import { AddExpenseModal } from "@/components/trips/AddExpenseModal";

export default function TripExpensesPage() {
  const { tripId } = useParams();
  const { trip, setTrip, loading, totalExpenses } = useTripData(tripId);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  const expenseCols = [
    { 
      header: "Expense Name", 
      accessor: (r) => (
        <div>
          <p className="font-black uppercase text-slate-800">{r.name}</p>
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Operational Charge</p>
        </div>
      )
    },
    { 
      header: "Date", 
      accessor: (r) => <span className="text-slate-500 font-bold">{r.date || new Date(trip?.startDate).toLocaleDateString()}</span> 
    },
    { 
      header: "Amount", 
      accessor: (r) => <span className="font-black text-destructive">₹{r.ammountRs.toLocaleString()}</span> 
    },
    { 
      header: "Status", 
      accessor: () => <span className="bg-emerald-50 text-emerald-600 text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-widest border border-emerald-100">Already Paid</span> 
    },
    { 
      header: "Receipt", 
      accessor: () => <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600"><FileText className="h-4 w-4" /></Button> }
  ];

  return (
    <TripPageLayout trip={trip} loading={loading}>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between px-2">
           <h3 className="text-xs font-black uppercase tracking-[0.2em] text-destructive flex items-center gap-2">
              <Receipt className="h-4 w-4" /> Operational Expenditure Dossier
           </h3>
           <Button 
              className="bg-destructive hover:bg-destructive/90 text-white font-black h-10 rounded-xl uppercase text-[10px] tracking-widest px-6"
              onClick={() => setIsExpenseModalOpen(true)}
           >
              <Plus className="h-3.5 w-3.5 mr-2" /> Add Expense
           </Button>
        </div>
        <TableContainer className="rounded-[2.5rem] border-none bg-white shadow-2xl overflow-hidden">
           <DataTable columns={expenseCols} data={trip?.tripExpences || []} />
           <div className="bg-destructive p-8 text-white flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70">Cumulative Operational Burn</span>
              <span className="text-3xl font-black">₹{totalExpenses.toLocaleString()}</span>
           </div>
        </TableContainer>

        <AddExpenseModal 
          open={isExpenseModalOpen}
          onOpenChange={setIsExpenseModalOpen}
          onAdd={(newExp) => {
            setTrip(prev => ({
              ...prev,
              tripExpences: [newExp, ...(prev.tripExpences || [])]
            }));
          }}
        />
      </div>
    </TripPageLayout>
  );
}
