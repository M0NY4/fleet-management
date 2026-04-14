import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { getDrivers } from "@/lib/api";
import { AddDriverModal } from "@/components/drivers/AddDriverModal";
import { DriverTable } from "@/components/drivers/DriverTable";
import { DriverDocumentsModal } from "@/components/drivers/DriverDocumentsModal";
import { toast } from "sonner";

export default function DriversPage() {
  const [data, setData] = useState([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [viewDocsModalOpen, setViewDocsModalOpen] = useState(false);
  const [driverToView, setDriverToView] = useState(null);

  const handleView = (d) => {
    setDriverToView(d);
    setViewDocsModalOpen(true);
  };

  const handleEdit = (d) => toast.info(`Editing ${d.name}`);
  const handleDelete = (d) => toast.error(`Deleting ${d.name}`);
  useEffect(() => {
    getDrivers().then(setData);
  }, []);

  return (
    <DashboardLayout>
      <PageLayout>
        <PageHeader 
          title="Drivers" 
          description="Manage your driver workforce" 
          actionLabel="Add Driver" 
          onAction={() => setAddModalOpen(true)} 
        />
        <DriverTable 
          drivers={data} 
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
        />

        <AddDriverModal 
          open={addModalOpen}
          onOpenChange={setAddModalOpen}
          onAdd={(newDriver) => {
            setData(prev => [newDriver, ...prev]);
            toast.success(`Driver ${newDriver.name} added successfully`);
          }}
        />

        <DriverDocumentsModal 
          open={viewDocsModalOpen}
          onOpenChange={setViewDocsModalOpen}
          driver={driverToView}
        />
      </PageLayout>
    </DashboardLayout>
  );
}
