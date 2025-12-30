import React, { useEffect, useState } from 'react';

export const BootLoader: React.FC = () => {
  const [step, setStep] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const bootSequence = async () => {
      // Step 0: Blank
      await new Promise(r => setTimeout(r, 500));
      
      // Step 1: Text Logs
      setStep(1);
      const messages = [
        "Initializing kernel...",
        "Mounting file system...",
        "Loading drivers...",
        "Starting window manager...",
        "Restoring session state...",
        "TOS v1.0 Ready."
      ];
      
      for (const msg of messages) {
        setLogs(prev => [...prev, msg]);
        await new Promise(r => setTimeout(r, 150 + Math.random() * 200));
      }

      // Step 2: Logo
      await new Promise(r => setTimeout(r, 400));
      setStep(2);

      // Transition handled by parent removal of component
    };

    bootSequence();
  }, []);

  return (
    <div className="fixed inset-0 z-[10000] bg-black text-white flex flex-col items-center justify-center font-mono cursor-wait">
      {step === 1 && (
        <div className="absolute top-10 left-10 text-xs text-white/50 space-y-1">
          {logs.map((log, i) => (
            <div key={i}>{log}</div>
          ))}
          <div className="animate-pulse">_</div>
        </div>
      )}

      <div className={`transition-all duration-1000 ease-out flex flex-col items-center ${step === 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        <div className="w-16 h-16 border-2 border-white rounded-full flex items-center justify-center mb-6 animate-[spin_10s_linear_infinite]">
          <div className="w-12 h-12 border border-white/50 rounded-full" />
        </div>
        <h1 className="text-3xl font-bold tracking-[0.5em] text-white">TOS</h1>
        <p className="text-xs text-white/40 mt-2 tracking-widest uppercase">The Operating System</p>
      </div>
    </div>
  );
};