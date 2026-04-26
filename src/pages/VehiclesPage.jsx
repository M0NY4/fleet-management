import { useEffect, useState, useMemo } from "react";
import { Truck } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { getVehicles } from "@/lib/api";
import { VehicleFilters } from "@/components/vehicles/VehicleFilters";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { VehicleDetailsModal } from "@/components/vehicles/VehicleDetailsModal";
import { Pagination } from "@/components/vehicles/Pagination";
import { DeleteConfirmModal } from "@/components/vehicles/DeleteConfirmModal";
import { AddVehicleModal } from "@/components/vehicles/AddVehicleModal";
import { toast } from "sonner";

export default function VehiclesPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [search, setSearch] = useState("");
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

  // View Detail Modal State
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

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
        v.manufacturer.toLowerCase().includes(search.toLowerCase()) ||
        v.model.toLowerCase().includes(search.toLowerCase());
      
      const matchFuel = fuelFilter === "all" || v.fuelType === fuelFilter;
      const matchStatus = statusFilter === "all" || v.status === statusFilter;

      return matchSearch && matchFuel && matchStatus;
    });
  }, [data, search, fuelFilter, statusFilter]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;

  const handleReset = () => {
    setSearch("");
    setFuelFilter("all");
    setStatusFilter("all");
    setCurrentPage(1);
    toast.info("Filters reset to default");
  };

  const handleAddVehicle = () => {
    setAddModalOpen(true);
  };

  const handleVehicleClick = (v) => {
    setSelectedVehicle(v);
    setDetailModalOpen(true);
  };

  const statusCounts = useMemo(() => {
    return {
      all: data.length,
      AVAILABLE: data.filter(v => v.status === "AVAILABLE").length,
      "ON TRIP": data.filter(v => v.status === "ON TRIP").length,
      MAINTENANCE: data.filter(v => v.status === "MAINTENANCE").length,
      INACTIVE: data.filter(v => v.status === "INACTIVE").length,
    };
  }, [data]);

  return (
    <DashboardLayout>
      <PageLayout>
        <PageHeader 
          title="Fleet Management" 
          description="Monitor and manage your vehicle assets, compliance, and operational status." 
          actionLabel="Add Vehicle" 
          onAction={handleAddVehicle} 
        />
        
        <VehicleFilters 
          search={search} setSearch={setSearch}
          fuelFilter={fuelFilter} setFuelFilter={setFuelFilter}
          statusFilter={statusFilter} setStatusFilter={setStatusFilter}
          statusCounts={statusCounts}
          onReset={handleReset}
        />
        
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border h-96 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Synchronizing Fleet...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedData.map((v) => (
                <VehicleCard 
                  key={v.id} 
                  vehicle={v} 
                  onClick={handleVehicleClick}
                />
              ))}
            </div>

            {filteredData.length === 0 && (
               <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-primary/20">
                  <Truck className="h-12 w-12 text-muted-foreground/30 mb-4" />
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">No matching vehicles found</p>
               </div>
            )}
            
            <div className="flex justify-end mt-8">
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={filteredData.length}
                itemsPerPage={itemsPerPage}
              />
            </div>

            <VehicleDetailsModal 
              open={detailModalOpen}
              onOpenChange={setDetailModalOpen}
              vehicle={selectedVehicle}
            />

            <AddVehicleModal 
              open={addModalOpen}
              onOpenChange={setAddModalOpen}
              onAdd={(newVehicle) => {
                setData(prev => [newVehicle, ...prev]);
                toast.success(`Vehicle ${newVehicle.number} added to fleet`);
              }}
            />

            <DeleteConfirmModal 
              open={deleteModalOpen}
              onOpenChange={setDeleteModalOpen}
              onConfirm={() => {
                setData(prev => prev.filter(v => v.id !== vehicleToDelete.id));
                setDeleteModalOpen(false);
                toast.success(`Vehicle ${vehicleToDelete.number} removed`);
              }}
              vehicleNumber={vehicleToDelete?.number}
            />
          </>
        )}
      </PageLayout>
    </DashboardLayout>
  );
}

