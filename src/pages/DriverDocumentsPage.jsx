import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { TableContainer } from "@/components/layout/TableContainer";
import { DataTable } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { getDriverDocuments } from "@/lib/api";

const columns = [
  { header: "Driver", accessor: "driverName" },
  { header: "Document Type", accessor: "docType" },
  { header: "Expiry Date", accessor: "expiry" },
  { header: "Status", accessor: (r) => <StatusBadge status={r.status} /> },
];

export default function DriverDocumentsPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getDriverDocuments().then(setData);
  }, []);

  return (
    <DashboardLayout>
      <PageLayout>
        <PageHeader title="Driver Documents" description="Manage and track driver compliance" />
        <TableContainer>
          <DataTable columns={columns} data={data} searchPlaceholder="Search documents..." />
        </TableContainer>
      </PageLayout>
    </DashboardLayout>
  );
}
