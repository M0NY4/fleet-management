import {
  Truck, FileText, Users, UserCheck,
  Bell, Wallet, BarChart3, ChevronDown, ChevronRight,
  PlusCircle, List, Receipt, IndianRupee,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";



const fleetItems = [
  { title: "Vehicles", url: "/vehicles", icon: Truck },
];

const driverItems = [
  { title: "Drivers", url: "/drivers", icon: Users },
];

const tripItems = [
  { title: "Create Booking", url: "/create-booking", icon: PlusCircle },
  { title: "Trip List", url: "/trips", icon: List },
];



const otherItems = [
  { title: "Payments", url: "/payments", icon: IndianRupee },
  { title: "Notifications", url: "/notifications", icon: Bell },
  { title: "Accounts / Finance", url: "/finance", icon: Wallet },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
];

function SidebarSection({ label, items, collapsed, currentPath }) {
  const [open, setOpen] = useState(true);

  return (
    <SidebarGroup>
      {!collapsed && (
        <SidebarGroupLabel
          className="cursor-pointer select-none text-sidebar-foreground/50 hover:text-sidebar-foreground/70 flex items-center justify-between text-[10px] uppercase tracking-wider"
          onClick={() => setOpen(!open)}
        >
          {label}
          {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        </SidebarGroupLabel>
      )}
      {(open || collapsed) && (
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <NavLink
                    to={item.url}
                    end={item.url === "/"}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors",
                    )}
                    activeClassName="bg-sidebar-accent text-sidebar-foreground font-medium"
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {!collapsed && <span>{item.title}</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      )}
    </SidebarGroup>
  );
}

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <div className="flex h-14 items-center gap-2 px-4 border-b border-sidebar-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent overflow-hidden">
          <img src="/favicon.ico" alt="Logo" className="h-6 w-6 object-contain" />
        </div>
        {!collapsed && <span className="font-semibold text-sidebar-foreground text-sm">FleetFlow</span>}
      </div> 
      <SidebarContent className="pt-2">

        <SidebarSection label="Fleet Management" items={fleetItems} collapsed={collapsed} currentPath={currentPath} />
        <SidebarSection label="Driver Management" items={driverItems} collapsed={collapsed} currentPath={currentPath} />
        <SidebarSection label="Trip Management" items={tripItems} collapsed={collapsed} currentPath={currentPath} />

        <SidebarSection label="System" items={otherItems} collapsed={collapsed} currentPath={currentPath} />
      </SidebarContent>
    </Sidebar>
  );
}
