import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { TableContainer } from "@/components/layout/TableContainer";
import { DataTable } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { getVehicleDocuments } from "@/lib/api";

const columns = [
  { header: "Vehicle", accessor: "vehicleNumber" },
  { header: "Document Type", accessor: "docType" },
  { header: "Expiry Date", accessor: "expiry" },
  { header: "Status", accessor: (r) => <StatusBadge status={r.status} /> },
];

export default function VehicleDocumentsPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getVehicleDocuments().then(setData);
  }, []);

  return (
    <DashboardLayout>
      <PageLayout>
        <PageHeader title="Vehicle Documents" description="Manage and track vehicle compliance" />
        <TableContainer>
          <DataTable columns={columns} data={data} searchPlaceholder="Search documents..." />
        </TableContainer>
      </PageLayout>
    </DashboardLayout>
  );
}
