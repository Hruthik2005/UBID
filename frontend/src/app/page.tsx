"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, Activity, ZapOff, CheckCircle, AlertTriangle, 
  Upload, Loader2, Check, X, ArrowRight, Building, 
  MapPin, Hash, Search, FileText, BarChart3, Database
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useState, useEffect } from "react";

const mockData = [
  { name: 'Jan', active: 4000, new: 2400 },
  { name: 'Feb', active: 4200, new: 1398 },
  { name: 'Mar', active: 4600, new: 3800 },
  { name: 'Apr', active: 5100, new: 3908 },
  { name: 'May', active: 5900, new: 4800 },
  { name: 'Jun', active: 6200, new: 3800 },
];

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

export default function Showcase() {
  const [step, setStep] = useState<'dashboard' | 'upload' | 'processing' | 'review' | 'summary'>('dashboard');
  const [progress, setProgress] = useState(0);
  const [tasks, setTasks] = useState(mockTasks);

  // Simulate processing progress
  useEffect(() => {
    if (step === 'processing') {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setStep('review'), 800);
            return 100;
          }
          return prev + 2;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [step]);

  const handleReviewAction = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id));
    if (tasks.length <= 1) {
      setTimeout(() => setStep('summary'), 500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black overflow-hidden">
      
      {/* Navigation Sidebar (Mini) */}
      <div className="fixed left-0 top-0 h-full w-20 border-r border-slate-800 flex flex-col items-center py-8 gap-8 bg-slate-950/50 backdrop-blur-xl z-50">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.5)]">
          <Database size={24} className="text-white" />
        </div>
        <div className="flex flex-col gap-6">
          <button onClick={() => setStep('dashboard')} className={`p-3 rounded-xl transition ${step === 'dashboard' ? 'bg-slate-800 text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}><BarChart3 size={20} /></button>
          <button onClick={() => setStep('upload')} className={`p-3 rounded-xl transition ${step === 'upload' ? 'bg-slate-800 text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}><Upload size={20} /></button>
          <button onClick={() => setStep('review')} className={`p-3 rounded-xl transition ${step === 'review' ? 'bg-slate-800 text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}><CheckCircle size={20} /></button>
        </div>
      </div>

      <main className="ml-20 p-8">
        <AnimatePresence mode="wait">
          
          {/* STEP: DASHBOARD */}
          {step === 'dashboard' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-7xl mx-auto"
            >
              <header className="mb-10 flex justify-between items-center">
                <div>
                  <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">UBID Dashboard</h1>
                  <p className="text-slate-400 mt-2">Karnataka Business Intelligence System Overview</p>
                </div>
                <button 
                  onClick={() => setStep('upload')}
                  className="bg-indigo-600 px-8 py-3 rounded-full hover:bg-indigo-700 transition font-semibold shadow-[0_0_20px_rgba(79,70,229,0.4)] flex items-center gap-2"
                >
                  <Upload size={18} /> Ingest New Data
                </button>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                {[
                  { title: "Total Businesses", value: "42,890", icon: Building2, color: "text-blue-400" },
                  { title: "Active", value: "31,450", icon: Activity, color: "text-emerald-400" },
                  { title: "Dormant", value: "8,200", icon: AlertTriangle, color: "text-amber-400" },
                  { title: "Closed", value: "3,240", icon: ZapOff, color: "text-rose-400" }
                ].map((stat, i) => (
                  <div key={i} className="glass p-6 rounded-2xl relative overflow-hidden group border border-slate-800">
                    <div className={`absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform ${stat.color}`}>
                      <stat.icon size={100} />
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-slate-400 font-medium mb-1">{stat.title}</h3>
                      <p className="text-3xl font-bold">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass p-6 rounded-2xl border border-slate-800">
                  <h3 className="text-xl font-semibold mb-6">Business Growth Metrics</h3>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={mockData}>
                        <defs>
                          <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis dataKey="name" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }} />
                        <Area type="monotone" dataKey="active" stroke="#6366f1" fillOpacity={1} fill="url(#colorActive)" strokeWidth={3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="glass p-6 rounded-2xl border border-slate-800 flex flex-col">
                  <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    System Health
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-400">Entity Resolution Accuracy</span>
                        <span className="text-emerald-400">94.2%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-[94.2%]"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-400">Data Synchronization</span>
                        <span className="text-blue-400">88.5%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-[88.5%]"></div>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-slate-800">
                      <p className="text-sm text-slate-400 leading-relaxed">
                        The UBID system is currently monitoring <strong className="text-white">8 different</strong> departmental databases in real-time.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP: UPLOAD */}
          {step === 'upload' && (
            <motion.div 
              key="upload"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="max-w-2xl mx-auto mt-20"
            >
              <div className="glass p-12 rounded-3xl border-2 border-dashed border-slate-700 text-center group hover:border-indigo-500 transition-colors cursor-pointer" onClick={() => setStep('processing')}>
                <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Upload size={40} className="text-indigo-400" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Upload Departmental Data</h2>
                <p className="text-slate-400 mb-8 max-w-md mx-auto">
                  Drag and drop your CSV, Excel, or JSON files here. The system will automatically parse and resolve entities against the master UBID database.
                </p>
                <div className="flex justify-center gap-4">
                  <div className="glass px-4 py-2 rounded-lg text-xs font-mono border border-slate-800">labour_dept_2024.csv</div>
                  <div className="glass px-4 py-2 rounded-lg text-xs font-mono border border-slate-800">kspcb_inspections.json</div>
                </div>
                <button className="mt-10 bg-indigo-600 px-10 py-4 rounded-full font-bold hover:bg-indigo-700 transition">
                  Select Files to Process
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP: PROCESSING */}
          {step === 'processing' && (
            <motion.div 
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-xl mx-auto mt-32 text-center"
            >
              <div className="relative w-32 h-32 mx-auto mb-10">
                <Loader2 size={128} className="text-indigo-500 animate-spin opacity-20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-indigo-400">{progress}%</span>
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2">Processing Dataset</h2>
              <p className="text-slate-400 mb-10">Running advanced NLP and Vector Embeddings for entity resolution...</p>
              
              <div className="space-y-4 text-left">
                {[
                  { label: "Normalizing record schemas", done: progress > 20 },
                  { label: "Generating vector embeddings", done: progress > 50 },
                  { label: "Executing fuzzy matching algorithms", done: progress > 80 },
                  { label: "Identifying ambiguous matches", done: progress > 95 }
                ].map((item, i) => (
                  <div key={i} className={`flex items-center gap-3 transition-opacity ${item.done ? 'opacity-100' : 'opacity-40'}`}>
                    {item.done ? <CheckCircle size={18} className="text-emerald-500" /> : <div className="w-4 h-4 rounded-full border-2 border-slate-700"></div>}
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP: REVIEW */}
          {step === 'review' && (
            <motion.div 
              key="review"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-5xl mx-auto"
            >
              <header className="mb-10 border-b border-slate-800 pb-6 flex justify-between items-end">
                <div>
                  <h1 className="text-3xl font-bold">Human-in-the-Loop Review</h1>
                  <p className="text-slate-400 mt-2">Verify high-uncertainty matches identified by the AI</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Pending Review</p>
                  <p className="text-2xl font-bold text-amber-500">{tasks.length} Records</p>
                </div>
              </header>

              <div className="space-y-6">
                {tasks.map((task) => (
                  <div key={task.id} className="glass rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
                    <div className="bg-slate-900/80 p-4 border-b border-slate-800 flex justify-between items-center px-8">
                      <div className="flex items-center gap-4">
                        <span className="bg-amber-500/20 text-amber-400 text-xs px-3 py-1 rounded-full font-bold border border-amber-500/30">
                          Match Conflict
                        </span>
                        <div className="h-1 w-24 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500" style={{ width: '78%' }}></div>
                        </div>
                        <span className="text-sm font-medium text-slate-300">Confidence: 78%</span>
                      </div>
                      <p className="text-xs font-mono text-slate-500">{task.reasoning}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-11 p-8 gap-4 items-center">
                      <div className="md:col-span-5 space-y-4">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          Incoming: {task.source.system}
                        </h4>
                        <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/50 space-y-4">
                          <div className="flex gap-4">
                            <Building size={20} className="text-slate-600" />
                            <div><p className="text-xs text-slate-500 font-medium">Business Name</p><p className="text-lg font-bold text-blue-100">{task.source.name}</p></div>
                          </div>
                          <div className="flex gap-4">
                            <MapPin size={20} className="text-slate-600" />
                            <div><p className="text-xs text-slate-500 font-medium">Address</p><p className="text-sm text-slate-300">{task.source.address}</p></div>
                          </div>
                        </div>
                      </div>

                      <div className="md:col-span-1 flex justify-center">
                        <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
                          <ArrowRight size={20} className="text-slate-600" />
                        </div>
                      </div>

                      <div className="md:col-span-5 space-y-4">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                          Master: {task.target.ubid}
                        </h4>
                        <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/50 space-y-4">
                          <div className="flex gap-4">
                            <Building size={20} className="text-slate-600" />
                            <div><p className="text-xs text-slate-500 font-medium">Business Name</p><p className="text-lg font-bold text-emerald-100">{task.target.name}</p></div>
                          </div>
                          <div className="flex gap-4">
                            <MapPin size={20} className="text-slate-600" />
                            <div><p className="text-xs text-slate-500 font-medium">Address</p><p className="text-sm text-slate-300">{task.target.address}</p></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-4 px-8">
                      <button 
                        onClick={() => handleReviewAction(task.id)}
                        className="px-8 py-3 rounded-xl border border-slate-700 text-slate-400 hover:bg-slate-800 transition font-bold text-sm"
                      >
                        Decline & Create New
                      </button>
                      <button 
                        onClick={() => handleReviewAction(task.id)}
                        className="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 transition text-white font-bold text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center gap-2"
                      >
                        <Check size={18} /> Confirm Match
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP: SUMMARY */}
          {step === 'summary' && (
            <motion.div 
              key="summary"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-3xl mx-auto mt-20 text-center"
            >
              <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/30">
                <CheckCircle size={48} className="text-emerald-500" />
              </div>
              <h1 className="text-4xl font-bold mb-4">Ingestion Successful!</h1>
              <p className="text-slate-400 text-lg mb-12">
                Processed 12,450 records with <strong className="text-white">99.8% resolution rate</strong>. 
                The master database has been updated successfully.
              </p>

              <div className="grid grid-cols-3 gap-6 mb-12">
                <div className="glass p-6 rounded-2xl border border-slate-800">
                  <p className="text-3xl font-bold text-emerald-400">+124</p>
                  <p className="text-xs text-slate-500 mt-1 uppercase font-bold">New UBIDs</p>
                </div>
                <div className="glass p-6 rounded-2xl border border-slate-800">
                  <p className="text-3xl font-bold text-blue-400">8,421</p>
                  <p className="text-xs text-slate-500 mt-1 uppercase font-bold">Linked Records</p>
                </div>
                <div className="glass p-6 rounded-2xl border border-slate-800">
                  <p className="text-3xl font-bold text-indigo-400">0</p>
                  <p className="text-xs text-slate-500 mt-1 uppercase font-bold">Pending Review</p>
                </div>
              </div>

              <div className="flex justify-center gap-6">
                <button 
                  onClick={() => setStep('dashboard')}
                  className="px-10 py-4 rounded-full border border-slate-700 hover:bg-slate-800 transition font-bold"
                >
                  Back to Dashboard
                </button>
                <button className="px-10 py-4 rounded-full bg-indigo-600 hover:bg-indigo-700 transition font-bold shadow-[0_0_20px_rgba(79,70,229,0.4)] flex items-center gap-2">
                  <FileText size={18} /> Export Report
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}
