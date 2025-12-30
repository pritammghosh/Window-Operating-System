import { useState, useEffect } from 'react';
import { SystemStatus } from '../types';
import { INITIAL_BOOT_DELAY, SHUTDOWN_DELAY } from '../constants';

export const useSystemLifecycle = () => {
  const [systemStatus, setSystemStatus] = useState<SystemStatus>('booting');

  useEffect(() => {
    const timer = setTimeout(() => {
      setSystemStatus('active');
    }, INITIAL_BOOT_DELAY);
    return () => clearTimeout(timer);
  }, []);

  const shutdownSystem = () => {
    setSystemStatus('shutdown');
  };

  const rebootSystem = () => {
    setSystemStatus('shutdown');
    setTimeout(() => {
      window.location.reload();
    }, SHUTDOWN_DELAY);
  };

  return {
    systemStatus,
    shutdownSystem,
    rebootSystem
  };
};