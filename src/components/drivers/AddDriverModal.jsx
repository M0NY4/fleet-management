import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AddDriverModal({ open, onOpenChange, onAdd }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    license: "",
    licenseExpiry: ""
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.license.trim()) return;

    const newDriver = {
      id: `d${Date.now()}`,
      ...formData,
      status: "Active"
    };

    onAdd(newDriver);
    onOpenChange(false);
    
    // reset form
    setFormData({ name: "", phone: "", license: "", licenseExpiry: "" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Driver</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" placeholder="e.g. John Doe" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" name="phone" placeholder="e.g. 9876543210" value={formData.phone} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="license">License Number</Label>
            <Input id="license" name="license" placeholder="e.g. MH12XXX" value={formData.license} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="licenseExpiry">License Expiry Date</Label>
            <Input id="licenseExpiry" name="licenseExpiry" type="date" value={formData.licenseExpiry} onChange={handleChange} required />
          </div>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">Add Driver</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
