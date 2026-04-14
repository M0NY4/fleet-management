import { useState, useEffect, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { getNotifications } from "@/lib/api";
import { cn } from "@/lib/utils";
import { AlertTriangle, FileText, Shield } from "lucide-react";
import { FilterBar } from "@/components/layout/FilterBar";
import { CardContainer } from "@/components/layout/CardContainer";

const iconMap = {
  Insurance: Shield,
  License: FileText,
  PUC: AlertTriangle,
  Permit: FileText,
};

export default function NotificationsPage() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    getNotifications().then(setItems);
  }, []);

  const filtered = useMemo(() => {
    return items.filter((n) => {
      if (filter === "unread") return !n.read;
      if (filter === "read") return n.read;
      return true;
    });
  }, [items, filter]);

  const toggleRead = (id) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)));
  };

  return (
    <DashboardLayout>
      <PageLayout>
        <PageHeader title="Notifications" description="Stay on top of alerts and expiry reminders" />

        <FilterBar className="p-2 border-none bg-transparent shadow-none gap-2">
          {(["all", "unread", "read"]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize",
                filter === f ? "bg-white text-gray-900 shadow-sm border" : "bg-transparent text-gray-500 hover:bg-white/50"
              )}
            >
              {f} {f === "unread" && `(${items.filter((n) => !n.read).length})`}
            </button>
          ))}
        </FilterBar>

        <CardContainer className="p-0 overflow-hidden divide-y divide-gray-100 border-gray-200">
          {filtered.map((n) => {
            const Icon = iconMap[n.type] || AlertTriangle;
            return (
              <div
                key={n.id}
                className={cn(
                  "p-4 flex items-start gap-4 cursor-pointer hover:bg-gray-50 transition-colors",
                  !n.read && "bg-blue-50/30"
                )}
                onClick={() => toggleRead(n.id)}
              >
                {!n.read && <div className="mt-2 h-2.5 w-2.5 rounded-full bg-blue-500 flex-shrink-0" />}
                {n.read && <div className="mt-2 h-2.5 w-2.5 flex-shrink-0" />}
                <div className="rounded-xl bg-gray-100 p-2.5 flex-shrink-0">
                  <Icon className="h-5 w-5 text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn("text-sm", !n.read ? "font-semibold text-gray-900" : "font-medium text-gray-500")}>{n.message}</p>
                  <div className="flex items-center gap-2 mt-1.5 border-t border-transparent pt-0.5">
                    <span className="text-xs font-semibold text-gray-400 tracking-wide uppercase">{n.date}</span>
                    <span className={cn(
                      "text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider",
                      n.type === "Insurance" ? "bg-indigo-100 text-indigo-700" :
                      n.type === "PUC" ? "bg-orange-100 text-orange-700" :
                      "bg-gray-100 text-gray-600"
                    )}>
                      {n.type}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="p-12 flex flex-col items-center justify-center text-center">
              <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <AlertTriangle className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">No notifications</h3>
              <p className="text-sm text-gray-500">You're all caught up!</p>
            </div>
          )}
        </CardContainer>
      </PageLayout>
    </DashboardLayout>
  );
}
