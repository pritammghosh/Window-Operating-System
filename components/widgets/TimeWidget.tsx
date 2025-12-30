import React, { useState, useEffect } from 'react';
import { useOS } from '../../context/OSContext';
import { WidgetState } from '../../types';
import { Settings, Check, Type, CreditCard, Columns, ArrowDown, Circle, Globe, Clock, Monitor } from 'lucide-react';

type ClockLayout = 'minimal' | 'large' | 'glass' | 'analog' | 'split' | 'vertical' | 'world';
type WidgetSize = 'small' | 'medium' | 'large';

interface ClockConfig {
  layout: ClockLayout;
  size: WidgetSize;
  format24h: boolean;
  showSeconds: boolean;
  timezone: string;
}

const DEFAULT_CONFIG: ClockConfig = {
  layout: 'glass',
  size: 'medium',
  format24h: false,
  showSeconds: false,
  timezone: 'local'
};

const LAYOUTS: { id: ClockLayout; label: string; icon: React.ElementType }[] = [
  { id: 'minimal', label: 'Minimal', icon: Monitor },
  { id: 'large', label: 'Typography', icon: Type },
  { id: 'glass', label: 'Glass Card', icon: CreditCard },
  { id: 'analog', label: 'Analog', icon: Circle },
  { id: 'split', label: 'Split', icon: Columns },
  { id: 'vertical', label: 'Vertical', icon: ArrowDown },
  { id: 'world', label: 'World', icon: Globe },
];

export const TimeWidget: React.FC<{ widget: WidgetState }> = ({ widget }) => {
  const { desktop } = useOS();
  const [time, setTime] = useState(new Date());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const config: ClockConfig = { ...DEFAULT_CONFIG, ...widget.data };

  useEffect(() => {
    // Sync frequency depends on seconds visibility to save resources
    const interval = config.showSeconds || config.layout === 'analog' ? 1000 : 1000 * 10;
    const timer = setInterval(() => setTime(new Date()), interval);
    return () => clearInterval(timer);
  }, [config.showSeconds, config.layout]);

  const updateConfig = (updates: Partial<ClockConfig>) => {
    desktop.updateWidgetData(widget.id, updates);
  };

  const getSizeClasses = () => {
    switch (config.size) {
      case 'small': return 'min-w-[160px] min-h-[100px] p-4';
      case 'large': return 'min-w-[300px] min-h-[300px] p-8';
      case 'medium': 
      default: return 'min-w-[240px] min-h-[160px] p-6';
    }
  };

  // --- Format Helpers ---
  const getHours = () => {
    let h = time.getHours();
    if (!config.format24h) {
      h = h % 12 || 12;
    }
    return h.toString().padStart(2, '0');
  };
  
  const getMinutes = () => time.getMinutes().toString().padStart(2, '0');
  const getSeconds = () => time.getSeconds().toString().padStart(2, '0');
  const getAmPm = () => time.getHours() >= 12 ? 'PM' : 'AM';
  const getDate = () => time.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });

  // --- Render Layouts ---

  const renderMinimal = () => (
    <div className="flex flex-col items-center justify-center">
      <div className="text-5xl font-light tracking-tighter">
        {getHours()}:{getMinutes()}
        {config.showSeconds && <span className="text-2xl opacity-50 font-normal">:{getSeconds()}</span>}
      </div>
      {!config.format24h && <div className="text-xs uppercase tracking-[0.3em] opacity-40 mt-1">{getAmPm()}</div>}
    </div>
  );

  const renderLarge = () => (
    <div className="flex flex-col items-center justify-center leading-[0.85]">
      <div className="text-7xl font-bold tracking-tighter">{getHours()}</div>
      <div className="text-7xl font-bold tracking-tighter opacity-50">{getMinutes()}</div>
      {config.showSeconds && <div className="text-xl font-medium tracking-widest mt-2 opacity-80">{getSeconds()}</div>}
    </div>
  );

  const renderGlass = () => (
    <div className="flex flex-col items-start justify-between h-full w-full">
       <div className="flex items-end gap-2">
         <span className="text-5xl font-light tracking-tighter">{getHours()}:{getMinutes()}</span>
         {config.showSeconds && <span className="text-xl pb-1.5 opacity-60">{getSeconds()}</span>}
       </div>
       <div className="w-full h-px bg-white/20 my-2" />
       <div className="flex justify-between w-full items-end">
         <div className="text-sm font-medium uppercase tracking-wider opacity-80">{getDate()}</div>
         {!config.format24h && <div className="text-xs font-bold opacity-40">{getAmPm()}</div>}
       </div>
    </div>
  );

  const renderSplit = () => (
    <div className="flex items-center gap-2 h-full">
      <div className="flex-1 h-full bg-white/5 rounded-xl flex items-center justify-center text-5xl font-light border border-white/5">
        {getHours()}
      </div>
      <div className="flex flex-col gap-1 h-full py-2">
         <div className="w-1 h-1 bg-white/50 rounded-full animate-pulse" />
         <div className="w-1 h-1 bg-white/50 rounded-full animate-pulse" />
      </div>
      <div className="flex-1 h-full bg-white/5 rounded-xl flex items-center justify-center text-5xl font-light border border-white/5 text-white/80">
        {getMinutes()}
      </div>
    </div>
  );

  const renderVertical = () => (
    <div className="flex flex-row items-center gap-4 h-full">
       <div className="flex flex-col text-sm uppercase tracking-widest opacity-40 justify-between h-full py-2 border-r border-white/10 pr-4">
          <span>{config.format24h ? '24H' : getAmPm()}</span>
          <span>{time.toLocaleDateString([], { weekday: 'short' })}</span>
          <span>{time.getDate()}</span>
       </div>
       <div className="flex flex-col justify-center gap-0">
          <span className="text-6xl font-light tracking-tighter leading-none">{getHours()}</span>
          <span className="text-6xl font-light tracking-tighter leading-none opacity-50">{getMinutes()}</span>
       </div>
    </div>
  );

  const renderAnalog = () => {
    const s = time.getSeconds();
    const m = time.getMinutes();
    const h = time.getHours();
    
    const degS = s * 6;
    const degM = (m + s/60) * 6;
    const degH = ((h % 12) + m/60) * 30;

    return (
      <div className="relative w-32 h-32 rounded-full border-2 border-white/20 bg-white/5 shadow-inner">
         {/* Markers */}
         {[0, 90, 180, 270].map(d => (
            <div key={d} className="absolute w-full h-full left-0 top-0" style={{ transform: `rotate(${d}deg)` }}>
               <div className="w-1 h-2 bg-white/40 mx-auto mt-1" />
            </div>
         ))}
         
         {/* Hands */}
         <div className="absolute top-0 left-0 w-full h-full" style={{ transform: `rotate(${degH}deg)` }}>
            <div className="w-1.5 h-8 bg-white mx-auto mt-8 rounded-full" />
         </div>
         <div className="absolute top-0 left-0 w-full h-full" style={{ transform: `rotate(${degM}deg)` }}>
            <div className="w-1 h-12 bg-white/80 mx-auto mt-4 rounded-full" />
         </div>
         {config.showSeconds && (
            <div className="absolute top-0 left-0 w-full h-full transition-transform duration-100 ease-linear" style={{ transform: `rotate(${degS}deg)` }}>
               <div className="w-0.5 h-14 bg-cyan-400 mx-auto mt-2 rounded-full" />
            </div>
         )}
         <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 shadow-lg" />
      </div>
    );
  };

  const renderWorld = () => (
    <div className="flex flex-col items-center justify-center">
       <div className="text-xs uppercase tracking-[0.2em] text-cyan-400 mb-1 flex items-center gap-1">
          <Globe size={10} /> Local
       </div>
       <div className="text-4xl font-medium tracking-tight">
        {getHours()}:{getMinutes()}
       </div>
       <div className="text-xs text-white/40 mt-1">
          {Intl.DateTimeFormat().resolvedOptions().timeZone.split('/')[1]?.replace('_', ' ') || 'System Time'}
       </div>
    </div>
  );

  const renderClock = () => {
    switch(config.layout) {
      case 'minimal': return renderMinimal();
      case 'large': return renderLarge();
      case 'split': return renderSplit();
      case 'vertical': return renderVertical();
      case 'analog': return renderAnalog();
      case 'world': return renderWorld();
      case 'glass': 
      default: return renderGlass();
    }
  };

  // --- Settings UI ---
  if (isSettingsOpen) {
    return (
      <div 
        className={`relative ${getSizeClasses()} rounded-3xl bg-neutral-900/90 backdrop-blur-2xl border border-white/20 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 select-none`}
        onDoubleClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
           <span className="text-xs font-bold uppercase tracking-wider text-white/60">Configure Clock</span>
           <button onClick={() => setIsSettingsOpen(false)} className="bg-white/10 hover:bg-white/20 p-1 rounded-full text-white">
              <Check size={12} />
           </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
           <div className="space-y-2">
              <label className="text-[10px] text-white/40 uppercase">Layout</label>
              <div className="grid grid-cols-3 gap-2">
                 {LAYOUTS.map(layout => (
                    <button 
                      key={layout.id}
                      onClick={() => updateConfig({ layout: layout.id })}
                      className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all
                        ${config.layout === layout.id 
                           ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-100' 
                           : 'bg-white/5 border-transparent hover:bg-white/10 text-white/60'
                        }
                      `}
                    >
                       <layout.icon size={16} />
                       <span className="text-[8px]">{layout.label}</span>
                    </button>
                 ))}
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-[10px] text-white/40 uppercase">Options</label>
              <div className="flex gap-2">
                 <button 
                    onClick={() => updateConfig({ format24h: !config.format24h })}
                    className={`px-3 py-1.5 rounded text-xs border transition-colors ${config.format24h ? 'bg-white/20 border-white/30 text-white' : 'bg-white/5 border-white/5 text-white/50'}`}
                 >
                    24-Hour
                 </button>
                 <button 
                    onClick={() => updateConfig({ showSeconds: !config.showSeconds })}
                    className={`px-3 py-1.5 rounded text-xs border transition-colors ${config.showSeconds ? 'bg-white/20 border-white/30 text-white' : 'bg-white/5 border-white/5 text-white/50'}`}
                 >
                    Seconds
                 </button>
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-[10px] text-white/40 uppercase">Size</label>
              <div className="flex bg-white/5 rounded-lg p-1">
                 {['small', 'medium', 'large'].map((s) => (
                    <button
                       key={s}
                       onClick={() => updateConfig({ size: s as WidgetSize })}
                       className={`flex-1 py-1 text-[10px] uppercase rounded transition-all ${config.size === s ? 'bg-white/20 text-white shadow' : 'text-white/40 hover:text-white/70'}`}
                    >
                       {s}
                    </button>
                 ))}
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`relative group ${getSizeClasses()} rounded-3xl bg-black/20 backdrop-blur-xl border border-white/5 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-default select-none`}
      onDoubleClick={(e) => {
         e.stopPropagation();
         setIsSettingsOpen(true);
      }}
    >
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
         <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-1.5 bg-black/40 hover:bg-black/60 rounded-full text-white/70 hover:text-white backdrop-blur-sm"
            title="Configure Clock"
         >
            <Settings size={12} />
         </button>
      </div>

      <div className="w-full h-full flex items-center justify-center text-white">
        {renderClock()}
      </div>
    </div>
  );
};