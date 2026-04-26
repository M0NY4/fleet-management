import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { getDrivers } from "@/lib/api";
import { AddDriverModal } from "@/components/drivers/AddDriverModal";
import { DriverTable } from "@/components/drivers/DriverTable";
import { DriverDetailsModal } from "@/components/drivers/DriverDetailsModal";
import { Users, Search } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

export default function DriversPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);

  useEffect(() => {
    setLoading(true);
    getDrivers().then((res) => {
      setData(res || []);
      setLoading(false);
    }).catch(err => {
      console.error("Failed to fetch drivers:", err);
      setLoading(false);
    });
  }, []);

  const filteredData = (data || []).filter(d => 
    (d.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (d.phone || "").includes(search) ||
    String(d.id || "").includes(search)
  );

  const handleDriverClick = (d) => {
    setSelectedDriver(d);
    setDetailModalOpen(true);
  };

  return (
    <DashboardLayout>
      <PageLayout>
        <PageHeader 
          title="Workforce Management" 
          description="Manage your driver profiles, licenses, and performance metrics." 
          actionLabel="Add Driver" 
          onAction={() => setAddModalOpen(true)} 
        />

        <div className="flex items-center gap-4 mb-8">
           <div className="relative flex-1 max-w-sm">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
             <Input 
                placeholder="Search drivers by name or phone..." 
                className="pl-10 h-11 border-none bg-white shadow-sm rounded-xl font-medium"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
             />
           </div>
        </div>

        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center gap-4 bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-primary/20">
            <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Syncing Workforce Data...</p>
          </div>
        ) : filteredData.length > 0 ? (
          <DriverTable 
            drivers={filteredData} 
            onView={handleDriverClick}
            onEdit={(d) => toast.info(`Editing ${d.name}`)}
            onDelete={(d) => toast.error(`Deleting ${d.name}`)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-primary/20">
            <div className="p-4 rounded-full bg-primary/5 mb-4">
              <Users className="h-10 w-10 text-primary/30" />
            </div>
            <h3 className="text-xl font-black text-foreground">No Drivers Found</h3>
            <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mt-2">Adjust your search or add a new driver</p>
          </div>
        )}

        <AddDriverModal 
          open={addModalOpen}
          onOpenChange={setAddModalOpen}
          onAdd={(newDriver) => {
            setData(prev => [newDriver, ...prev]);
            toast.success(`Driver ${newDriver.name} onboarded successfully`);
          }}
        />

        <DriverDetailsModal 
          open={detailModalOpen}
          onOpenChange={setDetailModalOpen}
          driver={selectedDriver}
        />
      </PageLayout>
    </DashboardLayout>
  );
}
