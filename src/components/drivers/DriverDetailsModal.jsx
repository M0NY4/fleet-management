import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DataTable } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { AlertTriangle, User, Calendar, Phone, CreditCard, Info } from "lucide-react";
import { DocumentPreviewModal } from "@/components/vehicles/DocumentPreviewModal";
import { Badge } from "@/components/ui/badge";

const getDocColumns = () => [
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

export function DriverDetailsModal({ open, onOpenChange, driver }) {
  const [docs, setDocs] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);

  const docColumns = getDocColumns();

  useEffect(() => {
    if (open && driver) {
      setLoadingDocs(true);
      // Simulate network request for documents
      setTimeout(() => {
        const today = new Date();
        const in1Day = new Date(today);
        in1Day.setDate(in1Day.getDate() + 1);
        const in4Days = new Date(today);
        in4Days.setDate(in4Days.getDate() + 4);

        const fullDummyDocs = [
          {
            id: "dd1",
            docType: "Driving License",
            expiry: driver.licenseExpiry || "2028-10-15",
            status: "Valid",
          },
          {
            id: "dd2",
            docType: "Medical Fitness",
            expiry: in1Day.toISOString().split('T')[0],
            status: "Valid",
            alertMessage: "Expiring tomorrow. Medical checkup needed.",
          },
          {
            id: "dd3",
            docType: "Training Certificate",
            expiry: in4Days.toISOString().split('T')[0],
            status: "Valid",
            alertMessage: "Expiring in 4 days. Refresher course scheduled.",
          },
          {
            id: "dd4",
            docType: "Police Verification",
            expiry: "2026-05-20",
            status: "Valid",
          },
        ].map((doc) => ({ ...doc, vehicleNumber: driver.name }));

        setDocs(fullDummyDocs);
        setLoadingDocs(false);
      }, 500);
    }
  }, [open, driver]);

  if (!driver) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between pr-8">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl overflow-hidden border-2 border-primary/20 bg-muted">
                   <img src={driver.image} alt={driver.name} className="h-full w-full object-cover" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-black tracking-tight">{driver.name}</DialogTitle>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Driver ID: #{driver.id}</p>
                </div>
              </div>
              <Badge className={driver.status === "Active" ? "bg-emerald-500" : "bg-amber-500"}>
                {driver.status}
              </Badge>
            </div>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-6">
            <DetailItem icon={Phone} label="Phone Number" value={driver.phone} />
            <DetailItem icon={Calendar} label="Date of Birth" value={driver.dob} />
            <DetailItem icon={CreditCard} label="License Number" value={driver.license} />
            <DetailItem icon={Calendar} label="License Expiry" value={driver.licenseExpiry} />
          </div>

          <div className="border-t pt-6">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-foreground mb-4 flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" /> Compliance & Certifications
            </h3>
            {loadingDocs ? (
              <div className="flex justify-center items-center py-8">
                <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <DataTable
                columns={docColumns}
                data={docs}
                onRowClick={setPreviewDoc}
                searchPlaceholder="Search documents..."
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <DocumentPreviewModal
        open={!!previewDoc}
        onOpenChange={(val) => !val && setPreviewDoc(null)}
        document={previewDoc}
      />
    </>
  );
}
