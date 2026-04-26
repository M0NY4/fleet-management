import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { FilterBar } from "@/components/layout/FilterBar";

export function VehicleFilters({ 
  search, setSearch, 
  fuelFilter, setFuelFilter, 
  statusFilter, setStatusFilter,
  statusCounts = {},
  onReset 
}) {
  return (
    <FilterBar className="justify-between mb-6">
      <div className="relative flex-1 max-w-md w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search number, brand, model..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-11 bg-card border-border/60 focus-visible:ring-primary shadow-sm rounded-xl w-full"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
        <div className="flex items-center gap-2 bg-muted/30 p-1 rounded-xl border flex-wrap md:flex-nowrap">
          <Select value={fuelFilter} onValueChange={setFuelFilter}>
            <SelectTrigger className="w-[120px] h-9 border-none bg-transparent shadow-none focus:ring-0 text-xs font-bold uppercase">
              <SelectValue placeholder="Fuel" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">All Fuel</SelectItem>
              <SelectItem value="PETROL">Petrol</SelectItem>
              <SelectItem value="DIESEL">Diesel</SelectItem>
              <SelectItem value="ELECTRIC">Electric</SelectItem>
            </SelectContent>
          </Select>

          <div className="hidden md:block h-4 w-px bg-border" />

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[120px] h-9 border-none bg-transparent shadow-none focus:ring-0 text-xs font-bold uppercase">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">All Status ({statusCounts.all || 0})</SelectItem>
              <SelectItem value="AVAILABLE">Available ({statusCounts.AVAILABLE || 0})</SelectItem>
              <SelectItem value="ON TRIP">On Trip ({statusCounts["ON TRIP"] || 0})</SelectItem>
              <SelectItem value="MAINTENANCE">Maintenance ({statusCounts.MAINTENANCE || 0})</SelectItem>
              <SelectItem value="INACTIVE">Inactive ({statusCounts.INACTIVE || 0})</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onReset}
          className="h-11 px-4 rounded-xl text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-all w-full md:w-auto"
        >
          <X className="h-4 w-4 mr-2" /> Reset
        </Button>
      </div>
    </FilterBar>
  );
}
