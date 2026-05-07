"use client";

import { motion } from "framer-motion";
import { Check, X, ArrowRight, Building, MapPin, Hash, Search } from "lucide-react";
import { useState } from "react";

const mockTasks = [
  {
    id: 1,
    confidence: 0.78,
    reasoning: "Fuzzy+Embedding (Name: 0.82, Vector: 0.75)",
    source: {
      system: "KSPCB",
      name: "Sri Balaji Industries",
      address: "123 Peenya Industrial Area, Phase 2",
      pincode: "560058",
      pan: "ABCDE1234F"
    },
    target: {
      ubid: "UBID-91F3A0",
      name: "Shri Balaji Ind",
      address: "Peenya Phase II",
      pincode: "560058",
      pan: null
    }
  }
];

export default function ReviewPage() {
  const [tasks, setTasks] = useState(mockTasks);

  const handleAction = (id: number, action: 'approve' | 'reject') => {
    setTasks(tasks.filter(t => t.id !== id));
    // In real app, make API call
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-8 font-sans bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
      
      <header className="mb-10 flex justify-between items-center border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold">Review Tasks</h1>
          <p className="text-slate-400 mt-2">Human-in-the-loop entity resolution queue</p>
        </div>
        <div className="glass px-4 py-2 rounded-lg flex items-center gap-2 border border-slate-800">
          <Search size={18} className="text-slate-400" />
          <input type="text" placeholder="Search tasks..." className="bg-transparent border-none outline-none text-sm w-64" />
        </div>
      </header>

      <div className="space-y-6">
        {tasks.length === 0 ? (
          <div className="glass p-12 text-center rounded-2xl flex flex-col items-center justify-center text-slate-400">
            <Check size={48} className="mb-4 text-emerald-500" />
            <h3 className="text-xl text-slate-200">All caught up!</h3>
            <p>No pending review tasks in the queue.</p>
          </div>
        ) : tasks.map((task, idx) => (
          <motion.div 
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass rounded-2xl overflow-hidden border border-slate-800"
          >
            {/* Task Header */}
            <div className="bg-slate-900/50 p-4 border-b border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <span className="bg-amber-500/20 text-amber-400 text-xs px-3 py-1 rounded-full font-medium border border-amber-500/30">
                  Ambiguous Match
                </span>
                <span className="text-sm text-slate-400">Confidence Score: <strong className="text-white">{(task.confidence * 100).toFixed(0)}%</strong></span>
              </div>
              <p className="text-sm text-slate-400 font-mono text-xs">{task.reasoning}</p>
            </div>

            {/* Comparison Area */}
            <div className="grid grid-cols-1 md:grid-cols-5 p-6 gap-6 items-center">
              
              {/* Source Record */}
              <div className="md:col-span-2 space-y-4">
                <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex justify-between">
                  Incoming Record 
                  <span className="text-blue-400">{task.source.system}</span>
                </h4>
                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex gap-3"><Building size={18} className="text-slate-500 mt-0.5" /> <div><p className="text-xs text-slate-500">Name</p><p className="font-medium text-blue-100">{task.source.name}</p></div></div>
                  <div className="flex gap-3"><MapPin size={18} className="text-slate-500 mt-0.5" /> <div><p className="text-xs text-slate-500">Address</p><p className="text-sm text-slate-300">{task.source.address}, {task.source.pincode}</p></div></div>
                  <div className="flex gap-3"><Hash size={18} className="text-slate-500 mt-0.5" /> <div><p className="text-xs text-slate-500">PAN</p><p className="font-mono text-sm">{task.source.pan || 'N/A'}</p></div></div>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center text-slate-600">
                <ArrowRight size={32} />
              </div>

              {/* Target Record */}
              <div className="md:col-span-2 space-y-4">
                <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex justify-between">
                  Existing Master 
                  <span className="text-emerald-400">{task.target.ubid}</span>
                </h4>
                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex gap-3"><Building size={18} className="text-slate-500 mt-0.5" /> <div><p className="text-xs text-slate-500">Name</p><p className="font-medium text-emerald-100">{task.target.name}</p></div></div>
                  <div className="flex gap-3"><MapPin size={18} className="text-slate-500 mt-0.5" /> <div><p className="text-xs text-slate-500">Address</p><p className="text-sm text-slate-300">{task.target.address}, {task.target.pincode}</p></div></div>
                  <div className="flex gap-3"><Hash size={18} className="text-slate-500 mt-0.5" /> <div><p className="text-xs text-slate-500">PAN</p><p className="font-mono text-sm">{task.target.pan || 'N/A'}</p></div></div>
                </div>
              </div>

            </div>

            {/* Actions */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/30 flex justify-end gap-3">
              <button 
                onClick={() => handleAction(task.id, 'reject')}
                className="px-6 py-2 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 transition flex items-center gap-2 text-sm font-medium"
              >
                <X size={16} /> Separate (Create New UBID)
              </button>
              <button 
                onClick={() => handleAction(task.id, 'approve')}
                className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 transition text-white flex items-center gap-2 text-sm font-medium shadow-[0_0_15px_rgba(16,185,129,0.4)]"
              >
                <Check size={16} /> Approve Merge
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
