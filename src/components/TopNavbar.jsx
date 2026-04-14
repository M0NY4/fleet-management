import { useState, useEffect } from "react";
import { Bell, Search, ChevronDown } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getNotifications } from "@/lib/api";

export function TopNavbar() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getNotifications().then(setItems);
  }, []);

  const unreadCount = items.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-card px-4 sm:px-6 shadow-sm shrink-0">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
        
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search vehicles, drivers, bookings..."
            className="h-10 w-[300px] lg:w-[400px] rounded-md border bg-background pl-9 pr-4 text-sm outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground transition-all"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="relative rounded-md p-2 hover:bg-accent hover:text-accent-foreground text-muted-foreground transition-colors">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground border-2 border-card shadow-sm">
              {unreadCount}
            </span>
          )}
        </button>
        
        <div className="h-8 w-[1px] bg-border hidden sm:block"></div>
        
        <div className="flex items-center gap-3 cursor-pointer p-2 rounded-md hover:bg-accent transition-colors">
          <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-semibold shadow-sm">
            AP
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-foreground leading-none">Admin Panel</p>
            <p className="text-xs text-muted-foreground mt-1">Super Admin</p>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
        </div>
      </div>
    </header>
  );
}
