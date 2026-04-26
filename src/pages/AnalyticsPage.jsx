import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  TrendingUp, TrendingDown, Wallet, 
  AlertTriangle, ArrowUpRight, Receipt, 
  Users, Wrench, ShieldCheck, PieChart as PieIcon,
  Info, MapPin, Truck
} from "lucide-react";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  Tooltip
} from "recharts";

// --- Data Constants ---
const dataByRange = {
  overall: {
    revenue: 12450000,
    expenses: { trips: 2100000, salaries: 1200000, maintenance: 850000, permits: 420000, other: 230000 },
    pending: 1240000
  },
  monthly: {
    revenue: 1050000,
    expenses: { trips: 180000, salaries: 100000, maintenance: 75000, permits: 35000, other: 20000 },
    pending: 150000
  },
  yearly: {
    revenue: 12450000,
    expenses: { trips: 2100000, salaries: 1200000, maintenance: 850000, permits: 420000, other: 230000 },
    pending: 1240000
  }
};

const OPERATIONAL_COLORS = {
  navy: "hsl(201, 100%, 20%)",
  gold: "hsl(48, 100%, 50%)",
  green: "hsl(160, 60%, 45%)",
  red: "hsl(0, 100%, 66%)",
  teal: "hsl(180, 50%, 50%)",
  orange: "hsl(30, 100%, 60%)",
  gray: "hsl(210, 20%, 90%)",
};

const topStats = [
  { label: "Vehicles with error", value: 125, color: "bg-slate-900" },
  { label: "Vehicles with Warning", value: 254, color: "bg-slate-900" },
  { label: "Deviation from a route", value: 125, color: "bg-slate-900" },
  { label: "Being Late", value: 256, color: "bg-slate-900" },
];

const vehicleData = [
  { name: "Out of service", value: 380, color: OPERATIONAL_COLORS.red },
  { name: "Available", value: 450, color: OPERATIONAL_COLORS.green },
  { name: "On route", value: 32000, color: OPERATIONAL_COLORS.teal },
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

// --- Sub-components ---
function Gauge({ label, percentage, value, color }) {
  const data = [
    { value: percentage, color: color },
    { value: 100 - percentage, color: OPERATIONAL_COLORS.gray },
  ];
  return (
    <div className="flex flex-col items-center">
      <p className="text-[10px] font-black uppercase tracking-widest mb-2 text-slate-400">{label}</p>
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
          <p className="text-sm font-black leading-none">{percentage}%</p>
          <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-tighter">Health</p>
        </div>
      </div>
      <div className="mt-2 text-center">
        <p className="text-xl font-black text-slate-900">{value}</p>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Vehicles</p>
      </div>
    </div>
  );
}

function Card({ title, subtitle, children, className }) {
  return (
    <div className={cn("bg-white border-0 rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-500 hover:shadow-indigo-500/10", className)}>
      {(title || subtitle) && (
        <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/30">
          {title && <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em]">{title}</h3>}
          {subtitle && <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{subtitle}</p>}
        </div>
      )}
      <div className="p-8">{children}</div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("overall");
  const data = dataByRange[timeRange];
  
  const totalExpenses = Object.values(data.expenses).reduce((a, b) => a + b, 0);
  const netProfit = data.revenue - totalExpenses;

  return (
    <DashboardLayout>
      <PageLayout className="space-y-16">
        {/* --- FINANCIAL INTELLIGENCE LAYER --- */}
        <div className="space-y-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
             <div>
                <h1 className="text-3xl font-black tracking-tighter uppercase text-slate-900">Financial Intelligence</h1>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Fleet Profitability & Operational Burn Audit</p>
             </div>
             <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-1 shadow-inner self-start">
                {(["overall", "monthly", "yearly"]).map((range) => (
                   <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={cn(
                         "px-8 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all",
                         timeRange === range ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-600"
                      )}
                   >
                      {range}
                   </button>
                ))}
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             <div className="bg-emerald-600 p-8 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden group">
                <TrendingUp className="absolute -right-4 -bottom-4 h-24 w-24 text-white/10 rotate-12 group-hover:scale-150 transition-transform duration-700" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70">Revenue</p>
                <h2 className="text-4xl font-black mt-4 tracking-tighter">₹{(data.revenue/1000000).toFixed(1)}M</h2>
                <div className="flex items-center gap-1 mt-2 text-[10px] font-bold text-emerald-100 bg-white/10 w-fit px-2 py-0.5 rounded-full">
                   <ArrowUpRight className="h-3 w-3" /> 12.5% vs Last Period
                </div>
             </div>

             <div className="bg-destructive p-8 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden group">
                <TrendingDown className="absolute -right-4 -bottom-4 h-24 w-24 text-white/10 -rotate-12 group-hover:scale-150 transition-transform duration-700" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70">Expenses</p>
                <h2 className="text-4xl font-black mt-4 tracking-tighter">₹{(totalExpenses/1000000).toFixed(1)}M</h2>
                <p className="text-[9px] font-bold text-red-100/50 mt-2 uppercase tracking-widest">Total operational burn</p>
             </div>

             <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden group">
                <Wallet className="absolute -right-4 -bottom-4 h-24 w-24 text-white/10 rotate-6 group-hover:scale-150 transition-transform duration-700" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70">Net Profit</p>
                <h2 className="text-4xl font-black mt-4 text-[#FFD700] tracking-tighter">₹{(netProfit/1000000).toFixed(1)}M</h2>
                <p className="text-[9px] font-bold text-slate-500 mt-2 uppercase tracking-widest">Revenue - All Expenses</p>
             </div>

             <div className="bg-orange-500 p-8 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden group">
                <AlertTriangle className="absolute -right-4 -bottom-4 h-24 w-24 text-white/10 -rotate-12 group-hover:scale-150 transition-transform duration-700" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70">Pending</p>
                <h2 className="text-4xl font-black mt-4 tracking-tighter">₹{(data.pending/100000).toFixed(1)}L</h2>
                <p className="text-[9px] font-bold text-orange-100 mt-2 uppercase tracking-widest">Unsettled accounts</p>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <Card title="Revenue Stream Insight" subtitle="Income Source Distribution">
                <div className="space-y-8">
                   <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 relative group overflow-hidden">
                      <PieIcon className="absolute -right-6 -bottom-6 h-24 w-24 text-slate-100 group-hover:text-indigo-500/10 transition-colors" />
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Trip Revenue</p>
                      <h3 className="text-3xl font-black text-slate-900 tracking-tighter">₹{(data.revenue/1000000).toFixed(2)}M</h3>
                      <p className="text-xs font-bold text-emerald-600 mt-4 flex items-center gap-1">
                         <ShieldCheck className="h-4 w-4" /> Fully Validated Earnings
                      </p>
                   </div>
                   <div className="space-y-4">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Quarterly Velocity</p>
                      <div className="h-40 w-full flex items-end gap-2 px-2">
                         {[60, 80, 45, 90, 70, 100].map((h, i) => (
                            <div key={i} className="flex-1 bg-slate-100 rounded-t-lg group hover:bg-slate-900 transition-colors relative">
                               <div className="bg-indigo-500 rounded-t-lg absolute bottom-0 w-full transition-all duration-1000" style={{ height: `${h}%` }} />
                            </div>
                         ))}
                      </div>
                   </div>
                </div>
             </Card>

             <Card title="Expenditure Architecture" subtitle="Granular operational costs">
                <div className="space-y-6">
                   {[
                      { label: "Trip Expenses", value: data.expenses.trips, color: "bg-blue-600", icon: Receipt },
                      { label: "Salaries", value: data.expenses.salaries, color: "bg-indigo-600", icon: Users },
                      { label: "Maintenance", value: data.expenses.maintenance, color: "bg-amber-500", icon: Wrench },
                      { label: "Permits & Gov", value: data.expenses.permits, color: "bg-slate-900", icon: ShieldCheck },
                      { label: "Other Expenses", value: data.expenses.other, color: "bg-slate-300", icon: PieIcon }
                   ].map((item) => {
                      const percentage = (item.value / totalExpenses) * 100;
                      return (
                         <div key={item.label} className="group">
                            <div className="flex justify-between items-center mb-2">
                               <div className="flex items-center gap-3">
                                  <div className={cn("p-2 rounded-lg text-white", item.color)}>
                                     <item.icon className="h-3 w-3" />
                                  </div>
                                  <span className="text-[11px] font-black uppercase text-slate-800 tracking-wider">{item.label}</span>
                               </div>
                               <span className="text-xs font-black text-slate-900">₹{(item.value/1000).toFixed(0)}K</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                               <div 
                                  className={cn("h-full rounded-full transition-all duration-1000", item.color)} 
                                  style={{ width: `${percentage}%` }} 
                               />
                            </div>
                            <p className="text-[8px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{percentage.toFixed(1)}% of total burn</p>
                         </div>
                      );
                   })}
                </div>
             </Card>

             <Card title="Cash Flow Dynamics" subtitle="Liquidity & pending dues">
                <div className="flex flex-col h-full gap-8">
                   <div className="flex-1 bg-orange-50 border-2 border-orange-100 rounded-[2.5rem] p-10 text-center flex flex-col justify-center items-center group relative overflow-hidden">
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                      <AlertTriangle className="h-10 w-10 text-orange-500 mb-6 relative z-10" />
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-600 mb-2 relative z-10">Pending Payments</p>
                      <h2 className="text-5xl font-black text-slate-900 tracking-tighter relative z-10">₹{(data.pending/100000).toFixed(1)}L</h2>
                      <p className="text-[9px] font-bold text-orange-400 mt-4 uppercase tracking-widest relative z-10">Requires immediate collection</p>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 text-center">
                         <p className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em]">Efficiency</p>
                         <p className="text-xl font-black text-slate-900 mt-1 tracking-tight">92.4%</p>
                      </div>
                      <div className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 text-center">
                         <p className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em]">Avg Age</p>
                         <p className="text-xl font-black text-slate-900 mt-1 tracking-tight">14D</p>
                      </div>
                   </div>
                   
                   <Button className="w-full h-14 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black uppercase tracking-[0.2em] shadow-xl shadow-orange-500/20">
                      Run Collection Report
                   </Button>
                </div>
             </Card>
          </div>
        </div>

        {/* --- OPERATIONAL INTELLIGENCE LAYER --- */}
        <div className="pt-16 border-t border-slate-100 space-y-10">
           <div className="space-y-1">
              <h2 className="text-2xl font-black tracking-tighter uppercase text-slate-900">Operational Intelligence</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Real-time Fleet Performance & Safety Audit</p>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
             {topStats.map((stat, i) => (
               <div key={i} className="bg-slate-900 rounded-3xl p-6 text-center shadow-xl relative overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                 <p className="text-3xl font-black text-white tracking-tighter">{stat.value}</p>
                 <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{stat.label}</p>
               </div>
             ))}
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <Card title="Total Vehicles" subtitle="Fleet Distribution">
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
                   <p className="text-xl font-black">32,000</p>
                   <p className="text-[10px] text-slate-400 font-bold uppercase">Total</p>
                 </div>
                 <div className="absolute top-0 left-0 text-[10px] font-black uppercase tracking-tighter">
                   <p className="text-red-500">Out of service</p>
                   <p className="text-lg">380</p>
                 </div>
                 <div className="absolute top-1/2 right-0 text-[10px] text-right font-black uppercase tracking-tighter">
                   <p className="text-teal-500">On route</p>
                   <p className="text-lg">32,000</p>
                 </div>
                 <div className="absolute bottom-0 left-0 text-[10px] font-black uppercase tracking-tighter">
                   <p className="text-green-500">Available</p>
                   <p className="text-lg">450</p>
                 </div>
               </div>
             </Card>

             <Card title="Warning" subtitle="Driving Policy Violations">
               <div className="space-y-4">
                 <table className="w-full text-[10px]">
                   <thead>
                     <tr className="border-b border-slate-50">
                       <th className="text-left py-2 font-black uppercase tracking-widest text-slate-400">Driving</th>
                       <th className="text-right py-2 font-black uppercase tracking-widest text-slate-400">Violations</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                     {policyViolations.map((v) => (
                       <tr key={v.type} className="group hover:bg-slate-50/50 transition-colors">
                         <td className="py-3 flex items-center gap-3">
                           <v.icon className={cn("h-4 w-4", v.color)} />
                           <span className="font-bold text-slate-700 uppercase tracking-tight">{v.type}</span>
                         </td>
                         <td className="py-3 text-right font-black text-slate-900">{v.value}</td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
                 <div className="p-4 bg-teal-50 border border-teal-100 rounded-2xl flex justify-between items-center group hover:bg-teal-100 transition-colors cursor-default">
                   <div>
                     <p className="text-[10px] font-black text-teal-900 uppercase tracking-widest">Driving Time Exceeded</p>
                     <p className="text-[9px] font-bold text-teal-600">Wo-13245</p>
                   </div>
                   <p className="text-[10px] font-black text-teal-900">{'>'} 2 Hours</p>
                 </div>
               </div>
             </Card>

             <div className="space-y-8">
               <Card title="Traffic jam">
                 <div className="flex items-center gap-8">
                   <div className="text-center">
                     <p className="text-4xl font-black text-slate-900 tracking-tighter">18</p>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vehicles</p>
                   </div>
                   <div className="flex-1 space-y-2">
                     <div className="flex justify-between border-b border-slate-50 pb-1 text-[10px] font-black uppercase tracking-tighter">
                       <span className="text-slate-400">5 Vehicles</span>
                       <span className="text-red-600">{'>'}10h</span>
                     </div>
                     <div className="flex justify-between border-b border-slate-50 pb-1 text-[10px] font-black uppercase tracking-tighter">
                       <span className="text-slate-400">9 Vehicles</span>
                       <span className="text-red-400">{'>'}5h</span>
                     </div>
                     <div className="flex justify-between border-b border-slate-50 pb-1 text-[10px] font-black uppercase tracking-tighter">
                       <span className="text-slate-400">8 Vehicles</span>
                       <span className="text-orange-500">{'>'}30 Min</span>
                     </div>
                   </div>
                 </div>
               </Card>

               <Card title="Accidents">
                 <div className="flex items-center gap-8">
                   <div className="text-center">
                     <p className="text-4xl font-black text-slate-900 tracking-tighter">4</p>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vehicles</p>
                   </div>
                   <div className="flex-1 space-y-2">
                     <div className="flex justify-between border-2 border-red-100 bg-red-50 p-3 rounded-xl text-[10px] font-black uppercase tracking-tight">
                       <span className="text-red-600">8</span>
                       <span className="text-red-500">Evacuation needed</span>
                     </div>
                     <div className="flex justify-between border border-slate-100 p-3 rounded-xl text-[10px] font-black uppercase tracking-tight">
                       <span className="text-slate-900">8</span>
                       <span className="text-slate-400 font-bold">Evacuated</span>
                     </div>
                   </div>
                 </div>
               </Card>
             </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <Card title="Vehicles Condition">
               <div className="grid grid-cols-3 gap-4">
                 <Gauge label="Good" percentage={10} value={245} color={OPERATIONAL_COLORS.green} />
                 <Gauge label="Satisfactory" percentage={60} value={266} color={OPERATIONAL_COLORS.gold} />
                 <Gauge label="Critical" percentage={70} value={288} color={OPERATIONAL_COLORS.red} />
               </div>
             </Card>

             <Card title="Trips Status" subtitle="Last 24 Hours">
               <div className="space-y-4">
                 {tripData24h.map((item) => (
                   <div key={item.label} className="flex items-center justify-between py-2 border-b border-slate-50 group">
                     <div className="flex items-center gap-4">
                       <div className={cn("h-3 w-3 rounded-full shadow-sm", item.color)} />
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-900 transition-colors">{item.label}</span>
                     </div>
                     <span className="text-sm font-black text-slate-900">{item.value.toLocaleString()}</span>
                   </div>
                 ))}
               </div>
             </Card>

             <Card title="Trips performance">
               <div className="space-y-8">
                 <div className="flex justify-between items-end">
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                     <span className="text-3xl text-slate-900 block tracking-tighter">350</span> 
                     Planned for Today
                   </p>
                   <span className="text-[10px] font-black bg-slate-900 text-white px-3 py-1 rounded-full uppercase tracking-widest">23 Left</span>
                 </div>
                 
                 <div className="h-4 w-full flex rounded-full overflow-hidden bg-slate-50">
                   <div className="bg-green-500 h-full" style={{ width: '40%' }} />
                   <div className="bg-teal-400 h-full" style={{ width: '15%' }} />
                   <div className="bg-gold-500 h-full" style={{ width: '20%' }} />
                   <div className="bg-red-500 h-full" style={{ width: '15%' }} />
                 </div>

                 <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                   {[
                     { label: "Live trips", val1: "50%", val2: "567" },
                     { label: "Completed", val1: "50%", val2: "567" },
                     { label: "Being late", val1: "50%", val2: "567" },
                     { label: "Failed", val1: "50%", val2: "567", color: "text-red-600" }
                   ].map((p, idx) => (
                     <div key={idx} className="space-y-1 border-b border-slate-50 pb-2">
                        <div className="flex justify-between items-baseline">
                          <p className="text-xs font-black text-slate-900">{p.val1} <span className="text-[9px] text-slate-400 font-bold tracking-tighter">/{p.val2}</span></p>
                          {p.color && <span className="text-[8px] font-black text-red-600 uppercase tracking-[0.2em]">Failed</span>}
                        </div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{p.label}</p>
                     </div>
                   ))}
                 </div>

                 <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest pt-4 border-t border-slate-50">
                   350 <span className="text-slate-400 font-bold">Planned for tomorrow</span>
                 </p>
               </div>
             </Card>
           </div>
        </div>
      </PageLayout>
    </DashboardLayout>
  );
}
