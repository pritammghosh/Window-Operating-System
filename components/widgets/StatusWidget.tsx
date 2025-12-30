import React from 'react';
import { useOS } from '../../context/OSContext';
import { WindowState } from '../../types';
import { Cpu, HardDrive, Layers } from 'lucide-react';

export const StatusWidget: React.FC = () => {
  const { windows, fileSystem } = useOS();
  const fileCount = Object.keys(fileSystem.files).length;
  const openApps = Object.values(windows).filter((w: WindowState) => w.isOpen).length;

  return (
    <div className="w-56 p-4 rounded-2xl bg-neutral-900/60 backdrop-blur-xl border border-white/10 shadow-xl text-white">
      <div className="text-[10px] uppercase font-bold text-white/40 mb-3 tracking-wider">System Status</div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white/70">
                <Layers size={14} />
                <span className="text-xs">Active Apps</span>
            </div>
            <span className="text-sm font-bold">{openApps}</span>
        </div>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white/70">
                <HardDrive size={14} />
                <span className="text-xs">Files</span>
            </div>
            <span className="text-sm font-bold">{fileCount}</span>
        </div>
        <div className="w-full bg-white/10 h-1 rounded-full mt-2 overflow-hidden">
            <div className="bg-cyan-500 h-full w-[42%]" />
        </div>
        <div className="flex justify-between text-[10px] text-white/30">
            <span>Memory Usage</span>
            <span>42%</span>
        </div>
      </div>
    </div>
  );
};
