"use client";

import { motion } from "framer-motion";
import { Building2, Activity, ZapOff, CheckCircle, AlertTriangle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { name: 'Jan', active: 4000, new: 2400 },
  { name: 'Feb', active: 4200, new: 1398 },
  { name: 'Mar', active: 4600, new: 3800 },
  { name: 'Apr', active: 5100, new: 3908 },
  { name: 'May', active: 5900, new: 4800 },
  { name: 'Jun', active: 6200, new: 3800 },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-8 font-sans bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
      
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 flex justify-between items-center"
      >
        <div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">UBID Platform</h1>
          <p className="text-slate-400 mt-2">Karnataka Business Intelligence System</p>
        </div>
        <div className="flex gap-4">
          <button className="glass px-6 py-2 rounded-full hover:bg-slate-800 transition text-sm font-medium border border-slate-700">Search</button>
          <button className="bg-indigo-600 px-6 py-2 rounded-full hover:bg-indigo-700 transition text-sm font-medium shadow-[0_0_15px_rgba(79,70,229,0.5)]">Review Tasks</button>
        </div>
      </motion.header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {[
          { title: "Total Businesses", value: "42,890", icon: Building2, color: "text-blue-400" },
          { title: "Active", value: "31,450", icon: Activity, color: "text-emerald-400" },
          { title: "Dormant", value: "8,200", icon: AlertTriangle, color: "text-amber-400" },
          { title: "Closed", value: "3,240", icon: ZapOff, color: "text-rose-400" }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-6 rounded-2xl relative overflow-hidden group"
          >
            <div className={`absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform ${stat.color}`}>
              <stat.icon size={100} />
            </div>
            <div className="relative z-10">
              <h3 className="text-slate-400 font-medium mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 glass p-6 rounded-2xl"
        >
          <h3 className="text-xl font-semibold mb-6">Business Growth</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                />
                <Line type="monotone" dataKey="active" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="new" stroke="#10b981" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Live Event Stream */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="glass p-6 rounded-2xl flex flex-col"
        >
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Live Activity Stream
          </h3>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {[
              { time: "2m ago", system: "Labour Dept", event: "Renewal Filed", ubid: "UBID-8A92B4", alert: false },
              { time: "15m ago", system: "KSPCB", event: "Inspection Passed", ubid: "UBID-91F3A0", alert: false },
              { time: "1h ago", system: "BESCOM", event: "Power Disconnected", ubid: "UBID-2C44D1", alert: true },
              { time: "3h ago", system: "Factories", event: "New Registration", ubid: "UBID-7E11A9", alert: false },
            ].map((feed, i) => (
              <div key={i} className="flex gap-4 items-start border-b border-slate-800 pb-4 last:border-0">
                <div className="mt-1">
                  {feed.alert ? <AlertTriangle size={18} className="text-amber-400" /> : <CheckCircle size={18} className="text-emerald-400" />}
                </div>
                <div>
                  <p className="text-sm font-medium">{feed.event}</p>
                  <div className="flex gap-2 text-xs text-slate-400 mt-1">
                    <span>{feed.ubid}</span>
                    <span>•</span>
                    <span>{feed.system}</span>
                    <span>•</span>
                    <span>{feed.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
