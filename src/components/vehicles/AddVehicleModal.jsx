import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImagePlus, X } from "lucide-react";

export function AddVehicleModal({ open, onOpenChange, onAdd }) {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    number: "",
    manufacturer: "",
    model: "",
    category: "AC Bus",
    seatingCapacity: "45",
    fuelType: "DIESEL",
    purchaseCost: "",
    purchaseDate: new Date().toISOString().split('T')[0],
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
    if (!formData.number.trim()) return;

    const newVehicle = {
      id: Date.now(),
      ...formData,
      status: "AVAILABLE",
      // Fallback image if none uploaded
      image: formData.image || "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800"
    };

    onAdd(newVehicle);
    onOpenChange(false);
    
    // reset form
    setFormData({
      number: "",
      manufacturer: "",
      model: "",
      category: "AC Bus",
      seatingCapacity: "45",
      fuelType: "DIESEL",
      purchaseCost: "",
      purchaseDate: new Date().toISOString().split('T')[0],
      image: ""
    });
    setImagePreview(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-black uppercase tracking-tight">Register New Fleet Unit</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Vehicle Appearance</Label>
            <div 
              className="relative h-40 w-full rounded-xl border-2 border-dashed border-muted-foreground/20 bg-muted/30 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors overflow-hidden"
              onClick={() => !imagePreview && fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                  <button 
                    type="button" 
                    onClick={(e) => { e.stopPropagation(); removeImage(); }}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <>
                  <div className="p-3 rounded-full bg-white shadow-sm text-primary">
                    <ImagePlus className="h-6 w-6" />
                  </div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center px-4">
                    Click to upload vehicle photo<br/>(PNG, JPG)
                  </p>
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
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground" htmlFor="number">Registration Number</Label>
            <Input id="number" name="number" placeholder="e.g. MH12AB1234" value={formData.number} onChange={handleChange} required className="h-11 border-2" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground" htmlFor="manufacturer">Manufacturer</Label>
              <Input id="manufacturer" name="manufacturer" placeholder="e.g. Ashok Leyland" value={formData.manufacturer} onChange={handleChange} required className="h-11 border-2" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground" htmlFor="model">Model Name</Label>
              <Input id="model" name="model" placeholder="e.g. Viking" value={formData.model} onChange={handleChange} required className="h-11 border-2" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground" htmlFor="category">Vehicle Category</Label>
              <Input id="category" name="category" placeholder="e.g. Sleeper Bus" value={formData.category} onChange={handleChange} className="h-11 border-2" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground" htmlFor="seatingCapacity">Seating Capacity</Label>
              <Input id="seatingCapacity" name="seatingCapacity" type="number" min="1" value={formData.seatingCapacity} onChange={handleChange} required className="h-11 border-2" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground" htmlFor="fuelType">Fuel Type</Label>
              <Input id="fuelType" name="fuelType" placeholder="e.g. DIESEL" value={formData.fuelType} onChange={handleChange} required className="h-11 border-2" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground" htmlFor="purchaseCost">Purchase Cost (₹)</Label>
              <Input id="purchaseCost" name="purchaseCost" type="number" placeholder="976987" value={formData.purchaseCost} onChange={handleChange} required className="h-11 border-2" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground" htmlFor="purchaseDate">Purchase Date</Label>
            <Input id="purchaseDate" name="purchaseDate" type="date" value={formData.purchaseDate} onChange={handleChange} required className="h-11 border-2" />
          </div>
          <DialogFooter className="mt-6">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="font-bold">Cancel</Button>
            <Button type="submit" className="font-black uppercase tracking-widest px-8">Confirm Entry</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

