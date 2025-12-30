import React from 'react';
import { useOS } from '../../context/OSContext';
import { Sun, Volume2, Wifi, Bluetooth } from 'lucide-react';

export const ControlCenter: React.FC = () => {
  const { systemSettings } = useOS();
  const { brightness, setBrightness, volume, setVolume } = systemSettings;

  return (
    <div className="absolute bottom-12 right-4 w-80 bg-neutral-900/90 backdrop-blur-2xl border border-white/10 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] p-4 flex flex-col gap-4 animate-in slide-in-from-bottom-5 fade-in duration-200 z-[10000]">
      
      {/* Toggles */}
      <div className="grid grid-cols-2 gap-3">
         <div className="bg-white/10 rounded-xl p-3 flex items-center gap-3 hover:bg-white/20 cursor-pointer transition-colors">
            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                <Wifi size={16} />
            </div>
            <div className="flex flex-col">
                <span className="text-xs font-medium">Wi-Fi</span>
                <span className="text-[10px] text-white/50">TOS_Network</span>
            </div>
         </div>
         <div className="bg-white/10 rounded-xl p-3 flex items-center gap-3 hover:bg-white/20 cursor-pointer transition-colors">
            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
                <Bluetooth size={16} />
            </div>
            <div className="flex flex-col">
                <span className="text-xs font-medium">Bluetooth</span>
                <span className="text-[10px] text-white/50">On</span>
            </div>
         </div>
      </div>

      {/* Sliders */}
      <div className="bg-white/5 rounded-xl p-4 flex flex-col gap-4 border border-white/5">
        <div className="space-y-2">
            <div className="flex justify-between text-[10px] text-white/50 font-medium uppercase tracking-wider">
                <span>Display</span>
                <span>{brightness}%</span>
            </div>
            <div className="flex items-center gap-3">
                <Sun size={16} className="text-white/50" />
                <input 
                    type="range" 
                    min="20" 
                    max="100" 
                    value={brightness} 
                    onChange={(e) => setBrightness(Number(e.target.value))}
                    className="flex-1 h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                />
            </div>
        </div>

        <div className="space-y-2">
            <div className="flex justify-between text-[10px] text-white/50 font-medium uppercase tracking-wider">
                <span>Sound</span>
                <span>{volume}%</span>
            </div>
            <div className="flex items-center gap-3">
                <Volume2 size={16} className="text-white/50" />
                <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={volume} 
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="flex-1 h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                />
            </div>
        </div>
      </div>
    </div>
  );
};