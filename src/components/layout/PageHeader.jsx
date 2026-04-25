import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function PageHeader({ title, description, actionLabel, onAction, className }) {
  return (
    <div className={cn("flex items-start justify-between", className)}>
      <div>
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
      </div>
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm" className="rounded-lg px-4 py-2">
          {actionLabel !== "Create Trip" && <Plus className="h-4 w-4 mr-1" />}
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
