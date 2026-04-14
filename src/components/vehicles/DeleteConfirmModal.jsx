import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function DeleteConfirmModal({ open, onOpenChange, onConfirm, vehicleNumber }) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-2xl border-2">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-black uppercase tracking-tight">Decommission Vehicle?</AlertDialogTitle>
          <AlertDialogDescription className="text-sm font-medium">
            Are you sure you want to remove <span className="font-black text-foreground underline">{vehicleNumber}</span> from the active fleet records? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="pt-4">
          <AlertDialogCancel className="rounded-xl font-bold uppercase text-[10px] tracking-widest border-2">Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="rounded-xl font-black uppercase text-[10px] tracking-widest bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg shadow-destructive/20"
          >
            Confirm Deletion
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
