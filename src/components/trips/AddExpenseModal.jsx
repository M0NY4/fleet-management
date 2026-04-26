import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Receipt, IndianRupee, Upload, X } from "lucide-react";
import { toast } from "sonner";

export function AddExpenseModal({ open, onOpenChange, onAdd }) {
  const [formData, setFormData] = useState({
    name: "",
    ammountRs: "",
    document: null
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, document: file });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.ammountRs) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newExpense = {
      id: Date.now(),
      name: formData.name,
      ammountRs: parseFloat(formData.ammountRs),
      documentPath: formData.document ? URL.createObjectURL(formData.document) : null,
      date: new Date().toISOString()
    };

    onAdd(newExpense);
    toast.success("Expense added successfully");
    setFormData({ name: "", ammountRs: "", document: null });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-[2.5rem] border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
            <Receipt className="h-5 w-5 text-destructive" /> Add New Expense
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Expense Description</Label>
            <Input 
              placeholder="e.g. Fuel, Toll, Driver Food" 
              className="h-12 border-2 rounded-xl font-bold"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Amount</Label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                type="number" 
                placeholder="0.00" 
                className="h-12 pl-10 border-2 rounded-xl font-black text-lg"
                value={formData.ammountRs}
                onChange={(e) => setFormData({ ...formData, ammountRs: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Document Upload</Label>
            <div className="relative">
              <input
                type="file"
                id="expense-doc"
                className="hidden"
                accept="image/*,.pdf"
                onChange={handleFileChange}
              />
              <label
                htmlFor="expense-doc"
                className="flex items-center justify-center gap-2 h-14 border-2 border-dashed rounded-xl cursor-pointer hover:bg-muted/50 transition-all border-slate-200"
              >
                {formData.document ? (
                  <div className="flex items-center gap-2 text-primary font-bold">
                    <CheckCircle className="h-4 w-4" /> {formData.document.name}
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setFormData({ ...formData, document: null });
                      }}
                    >
                      <X className="h-4 w-4 text-destructive" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Select Receipt</span>
                  </>
                )}
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" className="w-full h-12 rounded-xl bg-destructive hover:bg-destructive/90 text-white font-black uppercase tracking-widest shadow-lg shadow-destructive/20">
              Save Expense
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function CheckCircle({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
