import React, { useEffect, useState, useRef } from 'react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Cpu, Wifi, Activity, Zap, Disc, Hexagon, ShieldCheck, Database } from 'lucide-react';

const MonitorApp: React.FC = () => {
  const [stats, setStats] = useState({
    cpu: 42,
    memory: 35,
    netUp: 1.2,
    netDown: 14.5,
    temp: 45
  });
  const [logs, setLogs] = useState<string[]>([]);
  const [historyData, setHistoryData] = useState<{ value: number }[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Simulation Loop
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        cpu: Math.min(100, Math.max(0, prev.cpu + (Math.random() * 10 - 5))),
        memory: Math.min(100, Math.max(0, prev.memory + (Math.random() * 6 - 3))),
        netUp: Math.max(0, prev.netUp + (Math.random() - 0.5)),
        netDown: Math.max(0, prev.netDown + (Math.random() * 5 - 2.5)),
        temp: Math.min(90, Math.max(30, prev.temp + (Math.random() * 2 - 1)))
      }));

      // Update Chart Data
      setHistoryData(prev => {
        const newData = [...prev, { value: Math.random() * 100 }];
        if (newData.length > 30) newData.shift();
        return newData;
      });

      // Add Random Log
      if (Math.random() > 0.7) {
        const actions = ['SCANNING_SECTOR', 'OPTIMIZING_CORE', 'PACKET_INTERCEPT', 'ENCRYPTING_STREAM', 'THERMAL_REG', 'MEM_FLUSH'];
        const hex = Math.random().toString(16).substr(2, 6).toUpperCase();
        const newLog = `[${new Date().toLocaleTimeString()}] ${actions[Math.floor(Math.random() * actions.length)]} :: 0x${hex}`;
        setLogs(prev => [...prev.slice(-10), newLog]);
      }
    }, 800);

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll logs
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="h-full flex flex-col bg-black text-cyan-400 font-mono relative overflow-hidden select-none">
      
      {/* Background Grid & Vignette */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_90%)] pointer-events-none" />
      
      {/* Scanline Overlay */}
      <div className="absolute inset-0 z-50 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[size:100%_4px] opacity-20" />

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-cyan-500/20 bg-cyan-950/10 z-10 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Activity className="animate-pulse text-cyan-400" size={18} />
          <span className="text-xs tracking-[0.2em] font-bold text-cyan-200">SYSTEM DIAGNOSTIC</span>
        </div>
        <div className="flex items-center gap-4 text-[10px] text-cyan-600">
           <span>SECURE_CONN_EST</span>
           <span>V.4.2.0</span>
        </div>
      </div>

      <div className="flex-1 flex p-4 gap-4 relative z-10 overflow-hidden">
        
        {/* Left Column: Vertical Bars */}
        <div className="w-1/4 flex flex-col gap-4">
          
          {/* Memory Module */}
          <div className="flex-1 bg-black/40 border border-cyan-500/20 p-4 relative group rounded-lg overflow-hidden">
             <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-400" />
             <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-400" />
             <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-400" />
             <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-400" />
             
             <div className="flex items-center justify-between mb-4">
               <span className="text-xs text-cyan-600 uppercase">Memory</span>
               <Database size={14} className="text-cyan-400" />
             </div>
             
             <div className="flex gap-1 h-32 items-end justify-between">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-full bg-cyan-900/30 h-full relative overflow-hidden rounded-sm">
                     <div 
                        className="absolute bottom-0 left-0 right-0 bg-cyan-400/80 shadow-[0_0_10px_rgba(34,211,238,0.5)] transition-all duration-500"
                        style={{ height: `${Math.max(10, stats.memory + (Math.random() * 20 - 10))}%` }} 
                     />
                  </div>
                ))}
             </div>
             <div className="mt-2 text-right text-2xl font-bold tracking-tighter text-white">
                {stats.memory.toFixed(1)}<span className="text-xs text-cyan-500 font-normal ml-1">GB</span>
             </div>
          </div>

          {/* Network Module */}
          <div className="h-32 bg-black/40 border border-cyan-500/20 p-3 rounded-lg flex flex-col justify-between">
             <div className="flex items-center gap-2 text-xs text-cyan-600 uppercase">
                <Wifi size={14} /> Network
             </div>
             <div className="space-y-2">
                <div className="flex justify-between items-end">
                   <span className="text-[10px] opacity-50">UP</span>
                   <span className="font-mono text-cyan-300">{stats.netUp.toFixed(1)} MB/s</span>
                </div>
                <div className="w-full h-1 bg-cyan-900/30 rounded-full overflow-hidden">
                   <div className="h-full bg-cyan-400 w-1/2 animate-pulse" style={{ width: `${stats.netUp * 5}%` }} />
                </div>
                
                <div className="flex justify-between items-end">
                   <span className="text-[10px] opacity-50">DOWN</span>
                   <span className="font-mono text-cyan-300">{stats.netDown.toFixed(1)} MB/s</span>
                </div>
                <div className="w-full h-1 bg-cyan-900/30 rounded-full overflow-hidden">
                   <div className="h-full bg-cyan-400 w-3/4 animate-pulse" style={{ width: `${stats.netDown}%` }} />
                </div>
             </div>
          </div>
        </div>

        {/* Center: The Reactor */}
        <div className="flex-1 flex flex-col items-center justify-center relative">
           
           {/* Rotating Rings */}
           <div className="relative w-64 h-64 flex items-center justify-center">
              {/* Outer Ring */}
              <div className="absolute inset-0 rounded-full border border-cyan-500/10 border-t-cyan-400/80 border-b-cyan-400/80 animate-[spin_10s_linear_infinite]" />
              <div className="absolute inset-2 rounded-full border border-cyan-500/10 border-l-cyan-400/50 border-r-cyan-400/50 animate-[spin_8s_linear_infinite_reverse]" />
              
              {/* Inner Pulsing Core */}
              <div className="absolute inset-12 rounded-full border-4 border-cyan-500/20 animate-pulse" />
              <div className="absolute inset-16 rounded-full border border-dashed border-cyan-400/60 animate-[spin_20s_linear_infinite]" />

              {/* Center Text */}
              <div className="relative z-10 text-center flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm rounded-full w-32 h-32 border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                  <Cpu size={24} className="text-cyan-200 mb-1" />
                  <span className="text-4xl font-bold text-white tracking-tighter drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]">
                    {Math.round(stats.cpu)}%
                  </span>
                  <span className="text-[10px] text-cyan-500 uppercase tracking-widest mt-1">Core Load</span>
              </div>
           </div>

           {/* Graph Underlay */}
           <div className="absolute bottom-0 left-0 right-0 h-24 opacity-40">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historyData}>
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#22d3ee" 
                    strokeWidth={2}
                    fill="url(#colorGradient)" 
                    isAnimationActive={false} 
                  />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.4}/>
                      <stop offset="100%" stopColor="#22d3ee" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Right Column: Logs & Security */}
        <div className="w-1/4 flex flex-col gap-4">
           
           {/* Security Module */}
           <div className="h-24 bg-black/40 border border-cyan-500/20 p-3 rounded-lg flex items-center justify-between relative overflow-hidden">
               <div className="relative z-10">
                  <div className="flex items-center gap-2 text-xs text-cyan-600 uppercase mb-1">
                     <ShieldCheck size={14} /> Firewall
                  </div>
                  <div className="text-xl text-white font-bold tracking-wider">ACTIVE</div>
               </div>
               <Hexagon size={48} className="text-cyan-900/50 absolute -right-2 -bottom-4 animate-spin-slow" strokeWidth={1} />
           </div>

           {/* Temp */}
           <div className="h-24 bg-black/40 border border-cyan-500/20 p-3 rounded-lg flex items-center gap-4 relative overflow-hidden">
               <div className="relative w-16 h-16 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90">
                     <circle cx="32" cy="32" r="28" stroke="rgba(34,211,238,0.2)" strokeWidth="4" fill="transparent" />
                     <circle 
                        cx="32" cy="32" r="28" 
                        stroke={stats.temp > 80 ? '#ef4444' : '#22d3ee'} 
                        strokeWidth="4" 
                        fill="transparent"
                        strokeDasharray={175}
                        strokeDashoffset={175 - (175 * stats.temp) / 100}
                        className="transition-all duration-500"
                     />
                  </svg>
                  <Zap size={16} className={`absolute ${stats.temp > 80 ? 'text-red-500' : 'text-cyan-400'}`} />
               </div>
               <div>
                  <div className="text-xs text-cyan-600 uppercase mb-1">Thermal</div>
                  <div className={`text-2xl font-bold tracking-wider ${stats.temp > 80 ? 'text-red-400' : 'text-white'}`}>
                     {Math.round(stats.temp)}°C
                  </div>
               </div>
           </div>

           {/* Terminal Logs */}
           <div className="flex-1 bg-black/60 border border-cyan-500/20 p-3 rounded-lg font-mono text-[10px] overflow-hidden flex flex-col relative">
              <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-black to-transparent z-10" />
              <div className="flex-1 overflow-y-auto scrollbar-none space-y-1 opacity-70" ref={scrollRef}>
                 {logs.map((log, i) => (
                    <div key={i} className="truncate text-cyan-300/80 border-l-2 border-cyan-500/30 pl-2">
                       {log}
                    </div>
                 ))}
              </div>
              <div className="h-4 border-t border-cyan-500/20 mt-2 flex items-center gap-2">
                 <div className="w-2 h-2 bg-cyan-400 animate-pulse rounded-full" />
                 <span className="text-cyan-500 animate-pulse">LISTENING...</span>
              </div>
           </div>

        </div>

      </div>
    </div>
  );
};

export default MonitorApp;