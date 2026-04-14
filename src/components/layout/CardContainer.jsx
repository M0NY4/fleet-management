import { cn } from "@/lib/utils";

export function CardContainer({ children, className }) {
  return (
    <div className={cn("bg-white p-4 rounded-xl border shadow-sm", className)}>
      {children}
    </div>
  );
}
