import React from 'react';
import { OSProvider, useOS } from './context/OSContext';
import { BootLoader } from './components/system/BootLoader';
import { Desktop } from './components/layout/Desktop';

const SystemLayer: React.FC = () => {
  const { systemStatus } = useOS();

  return (
    <>
      {systemStatus === 'booting' && <BootLoader />}
      
      {systemStatus === 'shutdown' && (
        <div className="fixed inset-0 bg-black z-[10000] flex items-center justify-center animate-fade-in duration-1000">
          <div className="text-white/50 text-xs font-mono">System Halted.</div>
        </div>
      )}

      <Desktop />
    </>
  );
};

const App: React.FC = () => {
  return (
    <OSProvider>
      <SystemLayer />
    </OSProvider>
  );
};

export default App;