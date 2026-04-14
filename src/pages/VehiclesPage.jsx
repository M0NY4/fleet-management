import { useEffect, useState, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { getVehicles } from "@/lib/api";
import { VehicleStatsCards } from "@/components/vehicles/VehicleStatsCards";
import { VehicleFilters } from "@/components/vehicles/VehicleFilters";
import { VehicleTable } from "@/components/vehicles/VehicleTable";
import { Pagination } from "@/components/vehicles/Pagination";
import { DeleteConfirmModal } from "@/components/vehicles/DeleteConfirmModal";
import { AddVehicleModal } from "@/components/vehicles/AddVehicleModal";
import { VehicleDocumentsModal } from "@/components/vehicles/VehicleDocumentsModal";
import { toast } from "sonner";

export default function VehiclesPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [fuelFilter, setFuelFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);

  // Add Modal State
  const [addModalOpen, setAddModalOpen] = useState(false);

  // View Document Modal State
  const [viewDocsModalOpen, setViewDocsModalOpen] = useState(false);
  const [vehicleToView, setVehicleToView] = useState(null);

  useEffect(() => {
    setLoading(true);
    getVehicles().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((v) => {
      const matchSearch = 
        v.number.toLowerCase().includes(search.toLowerCase()) ||
        v.brand.toLowerCase().includes(search.toLowerCase()) ||
        v.model.toLowerCase().includes(search.toLowerCase());
      
      const matchType = typeFilter === "all" || v.type === typeFilter;
      const matchFuel = fuelFilter === "all" || v.fuel === fuelFilter;
      const matchStatus = statusFilter === "all" || v.status === statusFilter;

      return matchSearch && matchType && matchFuel && matchStatus;
    });
  }, [data, search, typeFilter, fuelFilter, statusFilter]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;

  const handleReset = () => {
    setSearch("");
    setTypeFilter("all");
    setFuelFilter("all");
    setStatusFilter("all");
    setCurrentPage(1);
    toast.info("Filters reset to default");
  };

  const handleAddVehicle = () => {
    setAddModalOpen(true);
  };

  const handleDeleteClick = (v) => {
    setVehicleToDelete(v);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!vehicleToDelete) return;
    setData(prev => prev.filter(v => v.id !== vehicleToDelete.id));
    setDeleteModalOpen(false);
    toast.success(`Vehicle ${vehicleToDelete.number} decommissioned successfully`);
    setVehicleToDelete(null);
  };

  return (
    <DashboardLayout>
      <PageLayout>
        <PageHeader 
          title="Vehicles Management" 
          description="Manage and monitor your fleet vehicles, maintenance schedules, and availability." 
          actionLabel="Add Vehicle" 
          onAction={handleAddVehicle} 
        />
        
        <VehicleStatsCards vehicles={data} />
        
        <VehicleFilters 
          search={search} setSearch={setSearch}
          typeFilter={typeFilter} setTypeFilter={setTypeFilter}
          fuelFilter={fuelFilter} setFuelFilter={setFuelFilter}
          statusFilter={statusFilter} setStatusFilter={setStatusFilter}
          onReset={handleReset}
        />
        
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border h-96 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Loading Fleet Data...</p>
            </div>
          </div>
        ) : (
          <>
            <VehicleTable 
              vehicles={paginatedData} 
              onDelete={handleDeleteClick}
              onEdit={(v) => toast.info(`Editing ${v.number}`)}
              onView={(v) => {
                setVehicleToView(v);
                setViewDocsModalOpen(true);
              }}
            />
            
            <div className="flex justify-end mt-4">
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={filteredData.length}
                itemsPerPage={itemsPerPage}
              />
            </div>

            <DeleteConfirmModal 
              open={deleteModalOpen}
              onOpenChange={setDeleteModalOpen}
              onConfirm={confirmDelete}
              vehicleNumber={vehicleToDelete?.number}
            />

            <AddVehicleModal 
              open={addModalOpen}
              onOpenChange={setAddModalOpen}
              onAdd={(newVehicle) => {
                setData(prev => [newVehicle, ...prev]);
                toast.success(`Vehicle ${newVehicle.number} added successfully`);
              }}
            />

            <VehicleDocumentsModal
              open={viewDocsModalOpen}
              onOpenChange={setViewDocsModalOpen}
              vehicle={vehicleToView}
            />
          </>
        )}
      </PageLayout>
    </DashboardLayout>
  );
}
