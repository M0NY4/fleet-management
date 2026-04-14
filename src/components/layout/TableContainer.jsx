import { cn } from "@/lib/utils";

export function TableContainer({ children, className }) {
  return (
    <div className={cn("bg-white rounded-xl border shadow-sm overflow-x-auto", className)}>
      {children}
    </div>
  );
}
