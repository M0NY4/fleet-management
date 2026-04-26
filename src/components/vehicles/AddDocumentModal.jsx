import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, FileText } from "lucide-react";
import { toast } from "sonner";

export function AddDocumentModal({ open, onOpenChange, vehicleNumber, onAdd, renewDoc }) {
  const [formData, setFormData] = useState({
    docType: "",
    expiry: new Date().toISOString().split('T')[0],
    file: null
  });

  useEffect(() => {
    if (renewDoc && open) {
      setFormData({
        docType: renewDoc.docType,
        expiry: new Date().toISOString().split('T')[0], // Default to today for renewal
        file: null
      });
    } else if (open && !renewDoc) {
      setFormData({
        docType: "",
        expiry: new Date().toISOString().split('T')[0],
        file: null
      });
    }
  }, [renewDoc, open]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, file }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.docType.trim()) {
      toast.error("Please enter document type");
      return;
    }

    const newDoc = {
      id: renewDoc ? renewDoc.id : Date.now().toString(),
      docType: formData.docType,
      expiry: formData.expiry,
      status: "Valid", // Default to Valid for new uploads
      vehicleNumber,
      // If renewing, we remove the alertMessage
      alertMessage: null
    };

    if (onAdd) onAdd(newDoc, !!renewDoc);
    toast.success(renewDoc ? `${formData.docType} renewed successfully` : `${formData.docType} added successfully`);
    onOpenChange(false);
    
    // reset form
    setFormData({
      docType: "",
      expiry: new Date().toISOString().split('T')[0],
      file: null
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-black uppercase tracking-tight">
            {renewDoc ? "Renew Vehicle Document" : "Add Vehicle Document"}
          </DialogTitle>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">For Vehicle: {vehicleNumber}</p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground" htmlFor="docType">Document Type</Label>
            <Input 
              id="docType" 
              name="docType" 
              placeholder="e.g. Pollution, Insurance, etc." 
              value={formData.docType} 
              onChange={handleChange} 
              required 
              className="h-11 border-2 focus-visible:ring-primary" 
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground" htmlFor="expiry">Expiry Date</Label>
            <Input 
              id="expiry" 
              name="expiry" 
              type="date" 
              value={formData.expiry} 
              onChange={handleChange} 
              required 
              className="h-11 border-2 focus-visible:ring-primary" 
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Document File</Label>
            <div className="relative group">
              <input 
                type="file" 
                id="file-upload" 
                className="hidden" 
                onChange={handleFileChange}
              />
              <label 
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/20 rounded-xl bg-muted/30 cursor-pointer group-hover:bg-muted/50 transition-all duration-200"
              >
                {formData.file ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                      <FileText className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-bold text-foreground truncate max-w-[200px]">{formData.file.name}</span>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={(e) => { e.preventDefault(); setFormData(prev => ({ ...prev, file: null })); }}
                      className="h-7 text-[10px] font-black uppercase tracking-widest text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="p-3 rounded-full bg-white shadow-sm text-muted-foreground group-hover:text-primary transition-colors">
                      <Upload className="h-6 w-6" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Upload Document (PDF, JPG)</span>
                  </div>
                )}
              </label>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="font-bold text-xs uppercase tracking-widest">Cancel</Button>
            <Button type="submit" className="font-black uppercase tracking-widest px-8 bg-primary hover:bg-primary/90">
              {renewDoc ? "Confirm Renewal" : "Save Document"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
