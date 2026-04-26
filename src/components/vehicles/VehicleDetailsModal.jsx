import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DataTable } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { AlertTriangle, Truck, Info, Calendar, IndianRupee, Fuel, Users, Plus, RefreshCw } from "lucide-react";
import { DocumentPreviewModal } from "@/components/vehicles/DocumentPreviewModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AddDocumentModal } from "@/components/vehicles/AddDocumentModal";
import { toast } from "sonner";

const getDocColumns = (onRenew) => [
  {
    header: "Document Type",
    accessor: (r) => (
      <div className="flex items-center gap-2">
        {r.docType}
        {r.alertMessage && (
          <AlertTriangle
            className="h-4 w-4 text-amber-500 animate-pulse"
            title={r.alertMessage}
          />
        )}
      </div>
    ),
  },
  {
    header: "Expiry Date",
    accessor: (r) => (
      <span className={r.alertMessage ? "font-bold text-amber-600" : ""}>
        {r.expiry}
      </span>
    ),
  },
  { header: "Status", accessor: (r) => <StatusBadge status={r.status} /> },
  {
    header: "Action",
    className: "text-center w-24",
    accessor: (r) => (
      <div className="flex justify-center">
        {r.alertMessage && (
          <Button
            size="sm"
            variant="outline"
            className="h-6 px-2 text-[10px] font-black uppercase tracking-widest border-amber-200 text-amber-700 hover:bg-amber-50 hover:text-amber-800 flex items-center gap-1"
            onClick={(e) => {
              e.stopPropagation();
              onRenew(r);
            }}
          >
            <RefreshCw className="h-3 w-3" />
            Renew
          </Button>
        )}
      </div>
    ),
  },
];

function DetailItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border/50">
      <div className="p-3 rounded-lg bg-white shadow-sm text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</p>
        <p className="text-sm font-black text-foreground">{value}</p>
      </div>
    </div>
  );
}

export function VehicleDetailsModal({ open, onOpenChange, vehicle }) {
  const [docs, setDocs] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [showDocs, setShowDocs] = useState(false);
  const [isAddDocModalOpen, setIsAddDocModalOpen] = useState(false);
  const [renewingDoc, setRenewingDoc] = useState(null);

  const handleRenew = (doc) => {
    setRenewingDoc(doc);
    setIsAddDocModalOpen(true);
  };

  const docColumns = getDocColumns(handleRenew);

  useEffect(() => {
    if (open && vehicle) {
      setLoadingDocs(true);
      // Simulate network request for documents
      setTimeout(() => {
        const today = new Date();
        const in2Days = new Date(today);
        in2Days.setDate(in2Days.getDate() + 2);
        const in3Days = new Date(today);
        in3Days.setDate(in3Days.getDate() + 3);

        const fullDummyDocs = [
          { id: "dummy1", docType: "Insurance", expiry: "2025-12-31", status: "Valid" },
          { id: "dummy2", docType: "Registration (RC)", expiry: in2Days.toISOString().split("T")[0], status: "Valid", alertMessage: "Expiring in 2 days." },
          { id: "dummy3", docType: "PUC (Pollution)", expiry: in3Days.toISOString().split("T")[0], status: "Valid", alertMessage: "Expiring in 3 days." },
          { id: "dummy4", docType: "National Permit", expiry: "2026-01-10", status: "Valid" },
        ].map((doc) => ({ ...doc, vehicleNumber: vehicle.number }));

        setDocs(fullDummyDocs);
        setLoadingDocs(false);
      }, 500);
    }
  }, [open, vehicle]);

  if (!vehicle) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between pr-8">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary text-primary-foreground">
                  <Truck className="h-6 w-6" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-black tracking-tight">{vehicle.number}</DialogTitle>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{vehicle.manufacturer} • {vehicle.model}</p>
                </div>
              </div>
              <Badge className={vehicle.status === "Active" ? "bg-emerald-500" : "bg-amber-500"}>
                {vehicle.status}
              </Badge>
            </div>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6">
            <DetailItem icon={Info} label="Category" value={vehicle.category} />
            <DetailItem icon={Fuel} label="Fuel Type" value={vehicle.fuelType} />
            <DetailItem icon={Users} label="Seating Capacity" value={`${vehicle.seatingCapacity} Seats`} />
            <DetailItem icon={IndianRupee} label="Purchase Cost" value={`₹${Number(vehicle.purchaseCost).toLocaleString()}`} />
            <DetailItem icon={Calendar} label="Purchase Date" value={vehicle.purchaseDate} />
          </div>

          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-foreground flex items-center gap-2">
                <Info className="h-4 w-4 text-primary" /> Vehicle Compliance Documents
              </h3>
              <div className="flex items-center gap-2">
                <Button 
                  onClick={() => setIsAddDocModalOpen(true)}
                  className="h-9 px-3 rounded-xl font-black text-[10px] uppercase tracking-widest bg-emerald-500 hover:bg-emerald-600 text-white flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Document
                </Button>
                {!showDocs && (
                  <Button 
                    onClick={() => setShowDocs(true)}
                    variant="outline"
                    className="h-9 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest border-2"
                  >
                    View Documents
                  </Button>
                )}
              </div>
            </div>
            
            {showDocs && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                {loadingDocs ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <>
                    <DataTable
                      columns={docColumns}
                      data={docs}
                      onRowClick={setPreviewDoc}
                      searchPlaceholder="Search documents..."
                    />
                    <div className="mt-4 flex justify-center">
                      <Button 
                        variant="ghost"
                        onClick={() => setShowDocs(false)}
                        className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground"
                      >
                        Hide Documents
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <DocumentPreviewModal
        open={!!previewDoc}
        onOpenChange={(val) => !val && setPreviewDoc(null)}
        document={previewDoc}
      />

      <AddDocumentModal
        open={isAddDocModalOpen}
        onOpenChange={(val) => {
          setIsAddDocModalOpen(val);
          if (!val) setRenewingDoc(null);
        }}
        vehicleNumber={vehicle.number}
        renewDoc={renewingDoc}
        onAdd={(newDoc, isUpdate) => {
          if (isUpdate) {
            setDocs(prev => prev.map(d => d.id === newDoc.id ? newDoc : d));
          } else {
            setDocs(prev => [newDoc, ...prev]);
          }
        }}
      />
    </>
  );
}
