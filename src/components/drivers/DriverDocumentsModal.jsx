import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DataTable } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Eye, AlertTriangle } from "lucide-react";
import { DocumentPreviewModal } from "@/components/vehicles/DocumentPreviewModal";

const getColumns = (onView) => [
  { 
    header: "Document Type", 
    accessor: (r) => (
      <div className="flex items-center gap-2">
        {r.docType}
        {r.alertMessage && (
          <AlertTriangle className="h-4 w-4 text-amber-500 animate-pulse" title={r.alertMessage} />
        )}
      </div>
    )
  },
  { 
    header: "Expiry Date", 
    accessor: (r) => (
      <span className={r.alertMessage ? "font-bold text-amber-600" : ""}>
        {r.expiry}
      </span>
    )
  },
  { header: "Status", accessor: (r) => <StatusBadge status={r.status} /> },
  {
    header: "Action",
    accessor: (r) => (
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-primary hover:bg-primary/10"
        onClick={() => onView(r)}
        title="View Document"
      >
        <Eye className="h-4 w-4" />
      </Button>
    ),
  },
];

export function DriverDocumentsModal({ open, onOpenChange, driver }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);

  const columns = getColumns(setPreviewDoc);

  useEffect(() => {
    if (open && driver) {
      setLoading(true);
      // Simulate network request to keep the loading animation, but always use full dummy data
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
        ].map((doc) => ({ ...doc, vehicleNumber: driver.name })); // Use vehicleNumber field for driver name in the preview
        
        setData(fullDummyDocs);
        setLoading(false);
      }, 500);
    }
  }, [open, driver]);

  return (
    <>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Documents for {driver?.name}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : data.length > 0 ? (
            <DataTable
              columns={columns}
              data={data}
              searchPlaceholder="Search documents..."
            />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No documents found for this driver.
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
    </>
  );
}
