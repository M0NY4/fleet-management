import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DataTable } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { getVehicleDocuments } from "@/lib/api";
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

export function VehicleDocumentsModal({ open, onOpenChange, vehicle }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);

  const columns = getColumns(setPreviewDoc);

  useEffect(() => {
    if (open && vehicle) {
      setLoading(true);
      // Simulate network request to keep the loading animation, but always use full dummy data
      setTimeout(() => {
        const today = new Date();
        const in2Days = new Date(today);
        in2Days.setDate(in2Days.getDate() + 2);
        const in3Days = new Date(today);
        in3Days.setDate(in3Days.getDate() + 3);

        const fullDummyDocs = [
          {
            id: "dummy1",
            docType: "Insurance",
            expiry: "2025-12-31",
            status: "Valid",
          },
          {
            id: "dummy2",
            docType: "Registration (RC)",
            expiry: in2Days.toISOString().split("T")[0],
            status: "Valid",
            alertMessage: "Expiring in 2 days. Immediate renewal required.",
          },
          {
            id: "dummy3",
            docType: "PUC (Pollution)",
            expiry: in3Days.toISOString().split("T")[0],
            status: "Valid",
            alertMessage: "Expiring in 3 days. Please initiate renewal.",
          },
          {
            id: "dummy4",
            docType: "National Permit",
            expiry: "2026-01-10",
            status: "Valid",
          },
        ].map((doc) => ({ ...doc, vehicleNumber: vehicle.number }));

        setData(fullDummyDocs);
        setLoading(false);
      }, 500);
    }
  }, [open, vehicle]);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Documents for {vehicle?.number}</DialogTitle>
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
                No documents found for this vehicle.
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
