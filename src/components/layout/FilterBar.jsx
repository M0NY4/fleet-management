import { cn } from "@/lib/utils";
import { CardContainer } from "./CardContainer";

export function FilterBar({ children, className }) {
  return (
    <CardContainer className={cn("flex flex-wrap gap-3 items-center", className)}>
      {children}
    </CardContainer>
  );
}
