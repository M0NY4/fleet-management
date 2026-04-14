import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Eye, MoreHorizontal, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { TableContainer } from "@/components/layout/TableContainer";

export function DriverTable({ drivers = [], onEdit, onDelete, onView }) {
  if (drivers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-card rounded-2xl border border-dashed border-primary/20">
        <div className="p-4 rounded-full bg-primary/5 mb-4">
          <User className="h-10 w-10 text-primary/40" />
        </div>
        <h3 className="text-xl font-extrabold text-foreground">No drivers found</h3>
        <p className="text-muted-foreground text-sm max-w-sm text-center mt-2 font-medium">
          Try adjusting your query or add a new driver to the workforce.
        </p>
      </div>
    );
  }

  return (
    <TableContainer>
      <table className="w-full text-sm text-left">
        <thead className="text-[10px] uppercase font-black bg-muted/30 text-muted-foreground tracking-widest border-b">
          <tr>
            <th className="px-6 py-5">Driver Name</th>
            <th className="px-6 py-5">Phone No.</th>
            <th className="px-6 py-5">License Details</th>
            <th className="px-6 py-5 text-center">Expiry</th>
            <th className="px-6 py-5 text-center">Status</th>
            <th className="px-6 py-5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/40">
          {drivers.map((d, idx) => (
            <tr 
              key={d.id} 
              className={cn(
                "hover:bg-muted/10 transition-colors group cursor-pointer",
                idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
              )}
            >
              <td className="px-6 py-4">
                <span className="font-extrabold text-foreground uppercase tracking-tight">{d.name}</span>
              </td>
              <td className="px-6 py-4">
                <span className="font-bold text-muted-foreground">{d.phone}</span>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">License No.</span>
                  <span className="font-bold text-foreground">{d.license}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-center">
                <div className="inline-flex items-center justify-center px-3 py-1 rounded-lg bg-primary/5 text-primary text-[10px] font-black uppercase">
                  {d.licenseExpiry}
                </div>
              </td>
              <td className="px-6 py-4 text-center">
                <StatusBadge status={d.status} />
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all" onClick={() => onView?.(d)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all" onClick={() => onEdit?.(d)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all" onClick={() => onDelete?.(d)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableContainer>
  );
}
