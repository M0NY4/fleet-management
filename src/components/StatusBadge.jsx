import { cn } from "@/lib/utils";

const statusStyles = {
  AVAILABLE: "bg-success/20 text-success border-success/30",
  ACTIVE: "bg-success/20 text-success border-success/30",
  "ON TRIP": "bg-indigo-500/20 text-indigo-600 border-indigo-500/30 animate-pulse",
  MAINTENANCE: "bg-amber-500/20 text-amber-600 border-amber-500/30",
  INACTIVE: "bg-muted text-muted-foreground border-border",
  VALID: "bg-success/20 text-success border-success/30",
  Active: "bg-success/20 text-success border-success/30",
  Valid: "bg-success/20 text-success border-success/30",
  Completed: "bg-success/20 text-success border-success/30",
  Paid: "bg-success/20 text-success border-success/30",
  Confirmed: "bg-success/20 text-success border-success/30",
  Booked: "bg-secondary/20 text-secondary border-secondary/30",
  "In Progress": "bg-secondary/20 text-secondary border-secondary/30",
  Ongoing: "bg-indigo-500/20 text-indigo-600 border-indigo-500/30 animate-pulse",
  Upcoming: "bg-secondary/20 text-secondary border-secondary/30",
  Partial: "bg-accent/30 text-accent-foreground border-accent/40",
  "Pending Approval": "bg-accent/30 text-accent-foreground border-accent/40",
  Pending: "bg-accent/30 text-accent-foreground border-accent/40",
  "On Leave": "bg-muted text-muted-foreground border-border",
  Maintenance: "bg-accent/30 text-accent-foreground border-accent/40",
  "Expiring Soon": "bg-accent/30 text-accent-foreground border-accent/40",
  Expired: "bg-destructive/20 text-destructive border-destructive/30",
  Cancelled: "bg-destructive/20 text-destructive border-destructive/30",
};

export function StatusBadge({ status, className }) {
  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight border",
      statusStyles[status] || "bg-muted text-muted-foreground border-border",
      className
    )}>
      {status}
    </span>
  );
}
