import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, X, ImagePlus } from "lucide-react";

export function AddDriverModal({ open, onOpenChange, onAdd }) {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    dob: "1990-01-01",
    license: "",
    licenseExpiry: "",
    image: ""
  });

  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      setFormData(prev => ({ ...prev, image: url }));
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData(prev => ({ ...prev, image: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.license.trim()) return;

    const newDriver = {
      id: Date.now(),
      ...formData,
      status: "ACTIVE",
      image: formData.image || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=400"
    };

    onAdd(newDriver);
    onOpenChange(false);
    
    // reset form
    setFormData({ name: "", phone: "", dob: "1990-01-01", license: "", licenseExpiry: "", image: "" });
    setImagePreview(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-black uppercase tracking-tight">Onboard New Driver</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Profile Photo</Label>
            <div 
              className="relative h-32 w-32 mx-auto rounded-full border-2 border-dashed border-muted-foreground/20 bg-muted/30 flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-muted/50 transition-colors overflow-hidden"
              onClick={() => !imagePreview && fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                  <button 
                    type="button" 
                    onClick={(e) => { e.stopPropagation(); removeImage(); }}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                  >
                    <X className="h-6 w-6 text-white" />
                  </button>
                </>
              ) : (
                <>
                  <ImagePlus className="h-6 w-6 text-primary/40" />
                  <p className="text-[8px] font-black uppercase text-muted-foreground text-center px-2">Upload Photo</p>
                </>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleImageChange} 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground" htmlFor="name">Full Name</Label>
            <Input id="name" name="name" placeholder="e.g. John Doe" value={formData.name} onChange={handleChange} required className="h-11 border-2" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground" htmlFor="phone">Phone Number</Label>
              <Input id="phone" name="phone" placeholder="e.g. 9876543210" value={formData.phone} onChange={handleChange} required className="h-11 border-2" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground" htmlFor="dob">Date of Birth</Label>
              <Input id="dob" name="dob" type="date" value={formData.dob} onChange={handleChange} required className="h-11 border-2" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground" htmlFor="license">License Number</Label>
              <Input id="license" name="license" placeholder="e.g. MH12XXX" value={formData.license} onChange={handleChange} required className="h-11 border-2" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground" htmlFor="licenseExpiry">License Expiry</Label>
              <Input id="licenseExpiry" name="licenseExpiry" type="date" value={formData.licenseExpiry} onChange={handleChange} required className="h-11 border-2" />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="font-bold">Cancel</Button>
            <Button type="submit" className="font-black uppercase tracking-widest px-8">Confirm Onboarding</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

