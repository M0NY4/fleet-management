import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageLayout } from "@/components/layout/PageLayout";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend 
} from "recharts";
import { cn } from "@/lib/utils";
import { AlertTriangle, Info, MapPin, Truck } from "lucide-react";

// Colors from the theme palette
const COLORS = {
  navy: "hsl(201, 100%, 20%)",
  gold: "hsl(48, 100%, 50%)",
  green: "hsl(160, 60%, 45%)",
  red: "hsl(0, 100%, 66%)",
  teal: "hsl(180, 50%, 50%)",
  orange: "hsl(30, 100%, 60%)",
  gray: "hsl(210, 20%, 90%)",
};

const topStats = [
  { label: "Vehicles with error", value: 125, color: "bg-primary" },
  { label: "Vehicles with Warning", value: 254, color: "bg-primary" },
  { label: "Deviation from a route", value: 125, color: "bg-primary" },
  { label: "Being Late", value: 256, color: "bg-primary" },
];

const vehicleData = [
  { name: "Out of service", value: 380, color: COLORS.red },
  { name: "Available", value: 450, color: COLORS.green },
  { name: "On route", value: 32000, color: COLORS.teal },
];

const policyViolations = [
  { type: "Driving", value: 4, icon: MapPin, color: "text-green-500" },
  { type: "Parked", value: 6, icon: Info, color: "text-gold-500" },
  { type: "Idling", value: 2, icon: Info, color: "text-orange-500" },
  { type: "Broken", value: 4, icon: AlertTriangle, color: "text-red-500" },
];

const tripData24h = [
  { label: "Live Trips", value: 4652, color: "bg-teal-500" },
  { label: "Scheduled", value: 4652, color: "bg-blue-400" },
  { label: "Completed", value: 4562, color: "bg-green-500" },
  { label: "Being Late", value: 4562, color: "bg-orange-400" },
  { label: "Failed", value: 5628, color: "bg-red-500" },
];

function Card({ title, subtitle, children, className }) {
  return (
    <div className={cn("bg-card border rounded-sm overflow-hidden shadow-sm", className)}>
      {(title || subtitle) && (
        <div className="px-4 py-3 border-b bg-muted/10">
          {title && <h3 className="text-sm font-bold text-foreground">{title}</h3>}
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}

function Gauge({ label, percentage, value, color }) {
  const data = [
    { value: percentage, color: color },
    { value: 100 - percentage, color: COLORS.gray },
  ];
  return (
    <div className="flex flex-col items-center">
      <p className="text-xs font-semibold mb-2">{label}</p>
      <div className="relative h-24 w-32 flex justify-center items-center overflow-hidden">
        <ResponsiveContainer width="100%" height={160}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="80%"
              startAngle={180}
              endAngle={0}
              innerRadius={35}
              outerRadius={50}
              paddingAngle={0}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute top-[60%] text-center">
          <p className="text-sm font-bold leading-none">{percentage}%</p>
          <p className="text-[10px] text-muted-foreground">Health Rate</p>
        </div>
      </div>
      <div className="mt-2 text-center">
        <p className="text-lg font-bold">{value}</p>
        <p className="text-[10px] text-muted-foreground uppercase">Vehicles</p>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <PageLayout className="space-y-6">
        {/* Top Header Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topStats.map((stat, i) => (
            <div key={i} className="bg-primary rounded-xl p-6 text-center shadow-sm">
              <p className="text-3xl font-bold text-accent">{stat.value}</p>
              <p className="text-sm text-primary-foreground font-medium mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* First Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card title="Total Vehicles">
            <div className="relative h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={vehicleData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {vehicleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-xl font-bold">32000</p>
                <p className="text-xs text-muted-foreground">Vehicles</p>
              </div>
              {/* Legends with Lines (Approximated) */}
              <div className="absolute top-10 left-0 text-[10px]">
                <p className="text-muted-foreground">Out of service</p>
                <p className="font-bold">380</p>
              </div>
              <div className="absolute top-1/2 right-0 text-[10px] text-right">
                <p className="text-muted-foreground">On route</p>
                <p className="font-bold">32000</p>
              </div>
              <div className="absolute bottom-10 left-0 text-[10px]">
                <p className="text-muted-foreground">Available</p>
                <p className="font-bold">450</p>
              </div>
            </div>
          </Card>

          <Card title="Warning" subtitle="Driving Policy Violations">
            <div className="space-y-4">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium">Driving</th>
                    <th className="text-right py-2 font-medium">Policy Violations</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {policyViolations.map((v) => (
                    <tr key={v.type}>
                      <td className="py-2.5 flex items-center gap-2">
                        <v.icon className={cn("h-3.5 w-3.5", v.color)} />
                        {v.type}
                      </td>
                      <td className="py-2.5 text-right font-bold">{v.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-3 bg-teal-50 border border-teal-100 rounded flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold text-teal-800">Driving Time Exceeded</p>
                  <p className="text-[10px] text-teal-600">Wo-13245</p>
                </div>
                <p className="text-xs font-bold text-teal-800">{'>'} 2 Hours</p>
              </div>
              <div className="p-3 bg-teal-50 border border-teal-100 rounded flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold text-teal-800">Driving Time Exceeded</p>
                  <p className="text-[10px] text-teal-600">Wo-13245</p>
                </div>
                <p className="text-xs font-bold text-teal-800">{'>'} 2 Hours</p>
              </div>
            </div>
          </Card>

          <div className="space-y-6">
            <Card title="Traffic jam">
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <p className="text-3xl font-bold">18</p>
                  <p className="text-sm text-muted-foreground">Vehicles</p>
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between border-b pb-1 text-xs">
                    <span className="font-medium">5</span>
                    <span className="text-red-500 font-bold">{'>'}10h</span>
                  </div>
                  <div className="flex justify-between border-b pb-1 text-xs">
                    <span className="font-medium">9</span>
                    <span className="text-red-400 font-bold">{'>'}5h</span>
                  </div>
                  <div className="flex justify-between border-b pb-1 text-xs">
                    <span className="font-medium">8</span>
                    <span className="text-orange-400 font-bold">{'>'}30 Min</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card title="Accidents">
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <p className="text-3xl font-bold">4</p>
                  <p className="text-sm text-muted-foreground">Vehicles</p>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between border bg-red-50 p-2 text-xs">
                    <span className="font-bold text-red-600">8</span>
                    <span className="text-red-500 font-medium tracking-tight">Evacuation needed</span>
                  </div>
                  <div className="flex justify-between border p-2 text-xs">
                    <span className="font-bold">8</span>
                    <span className="text-muted-foreground">Evacuated</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card title="Vehicles Condition">
            <div className="grid grid-cols-3 gap-4">
              <Gauge label="Good" percentage={10} value={245} color={COLORS.green} />
              <Gauge label="Satisfactory" percentage={60} value={266} color={COLORS.gold} />
              <Gauge label="Critical" percentage={70} value={288} color={COLORS.red} />
            </div>
          </Card>

          <Card title="Trips" subtitle="24 hours trips data">
            <div className="space-y-3 mt-2">
              {tripData24h.map((item) => (
                <div key={item.label} className="flex items-center justify-between py-1 border-b text-xs">
                  <div className="flex items-center gap-3">
                    <div className={cn("h-3 w-3 rounded-full", item.color)} />
                    <span className="font-medium text-muted-foreground">{item.label}</span>
                  </div>
                  <span className="font-bold">{item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Trips performance">
            <div className="space-y-6">
              <div className="flex justify-between text-xs">
                <span className="font-bold"><span className="text-lg">350</span> Planned for Today</span>
                <span className="text-muted-foreground">23 Left</span>
              </div>
              
              <div className="h-6 w-full flex rounded overflow-hidden">
                <div className="bg-green-500 h-full" style={{ width: '40%' }} />
                <div className="bg-teal-400 h-full" style={{ width: '15%' }} />
                <div className="bg-gold-500 h-full" style={{ width: '20%' }} />
                <div className="bg-red-500 h-full" style={{ width: '15%' }} />
                <div className="bg-gray-100 h-full flex-1" />
              </div>

              <div className="grid grid-cols-2 gap-x-12 gap-y-4 mt-4">
                <div className="flex justify-between items-end border-b pb-1">
                  <div>
                    <p className="text-xs font-bold">50% /567</p>
                    <p className="text-[10px] text-muted-foreground uppercase">Live trips</p>
                  </div>
                  <p className="text-xs font-bold">60% /567</p>
                </div>
                <div className="flex justify-between items-end border-b pb-1">
                  <div>
                    <p className="text-xs font-bold">50% /567</p>
                    <p className="text-[10px] text-muted-foreground uppercase">Completed</p>
                  </div>
                  <p className="text-xs font-bold">60% /567</p>
                </div>
                <div className="flex justify-between items-end border-b pb-1">
                  <div>
                    <p className="text-xs font-bold">50% /567</p>
                    <p className="text-[10px] text-muted-foreground uppercase">Being late</p>
                  </div>
                  <p className="text-xs font-bold">60% /567</p>
                </div>
                <div className="flex justify-between items-end border-b pb-1">
                  <div>
                    <p className="text-xs font-bold">50% /567</p>
                    <p className="text-[10px] text-muted-foreground uppercase">Failed</p>
                  </div>
                  <p className="text-xs font-bold text-red-500 tracking-tighter">FAILED</p>
                </div>
              </div>

              <p className="text-xs font-bold pt-2">350 <span className="text-muted-foreground font-normal">Planned for tomorrow</span></p>
            </div>
          </Card>
        </div>
      </PageLayout>
    </DashboardLayout>
  );
}
