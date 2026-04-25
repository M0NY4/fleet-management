import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Eye, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { TableContainer } from "@/components/layout/TableContainer";

export function VehicleTable({ vehicles = [], onEdit, onDelete, onView }) {
  if (vehicles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-card rounded-2xl border border-dashed border-primary/20">
        <div className="p-4 rounded-full bg-primary/5 mb-4">
          <MoreHorizontal className="h-10 w-10 text-primary/40" />
        </div>
        <h3 className="text-xl font-extrabold text-foreground">No vehicles found</h3>
        <p className="text-muted-foreground text-sm max-w-sm text-center mt-2 font-medium">
          Try adjusting your filters or add a new vehicle to the fleet.
        </p>
      </div>
    );
  }

  return (
    <TableContainer>
      <table className="w-full text-sm text-left">
        <thead className="text-[10px] uppercase font-black bg-muted/30 text-muted-foreground tracking-widest border-b">
          <tr>
            <th className="px-6 py-5">Vehicle No.</th>
            <th className="px-6 py-5">Brand</th>
            <th className="px-6 py-5">Model</th>
            <th className="px-6 py-5 text-center">Seats</th>
            <th className="px-6 py-5">Fuel</th>
            <th className="px-6 py-5 text-center">Status</th>
            <th className="px-6 py-5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/40">
          {vehicles.map((v, idx) => (
            <tr 
              key={v.id} 
              className={cn(
                "hover:bg-muted/10 transition-colors group cursor-pointer",
                idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
              )}
              onClick={() => onView?.(v)}
            >
              <td className="px-6 py-4">
                <span className="font-extrabold text-foreground uppercase tracking-tight">{v.number}</span>
              </td>
              <td className="px-6 py-4">
                <span className="font-bold text-foreground uppercase tracking-tight">{v.brand}</span>
              </td>
              <td className="px-6 py-4">
                <span className="font-bold text-muted-foreground">{v.model}</span>
              </td>
              <td className="px-6 py-4 text-center">
                <div className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-primary/5 text-primary font-black">
                  {v.seats}
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{v.fuel}</span>
              </td>
              <td className="px-6 py-4 text-center">
                <StatusBadge status={v.status} />
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit?.(v);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete?.(v);
                    }}
                  >
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
