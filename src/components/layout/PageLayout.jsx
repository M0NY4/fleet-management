import { cn } from "@/lib/utils";

export function PageLayout({ children, className, fullWidth }) {
  return (
    <div className={cn(
      "mx-auto px-4 sm:px-6 w-full space-y-6 py-6", 
      fullWidth ? "max-w-none" : "max-w-7xl",
      className
    )}>
      {children}
    </div>
  );
}
