import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AddVehicleModal({ open, onOpenChange, onAdd }) {
  const [formData, setFormData] = useState({
    number: "",
    brand: "",
    model: "",
    type: "Car",
    category: "SUV",
    seats: "5",
    fuel: "Petrol"
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.number.trim()) return;

    const newVehicle = {
      id: `v${Date.now()}`,
      ...formData,
      seats: parseInt(formData.seats) || 5,
      status: "Active"
    };

    onAdd(newVehicle);
    onOpenChange(false);
    
    // reset form
    setFormData({
      number: "", brand: "", model: "", type: "Car", category: "SUV", seats: "5", fuel: "Petrol"
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Vehicle</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="number">Vehicle Registration Number</Label>
            <Input id="number" name="number" placeholder="e.g. MH12AB1234" value={formData.number} onChange={handleChange} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input id="brand" name="brand" placeholder="e.g. Toyota" value={formData.brand} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input id="model" name="model" placeholder="e.g. Fortuner" value={formData.model} onChange={handleChange} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Input id="type" name="type" placeholder="e.g. Car or Bus" value={formData.type} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input id="category" name="category" placeholder="e.g. SUV, Sedan" value={formData.category} onChange={handleChange} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="seats">Seats</Label>
              <Input id="seats" name="seats" type="number" min="1" value={formData.seats} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fuel">Fuel Type</Label>
              <Input id="fuel" name="fuel" placeholder="e.g. Diesel, Petrol" value={formData.fuel} onChange={handleChange} required />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">Add Vehicle</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
