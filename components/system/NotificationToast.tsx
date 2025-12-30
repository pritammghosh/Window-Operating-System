import React from 'react';
import { useOS } from '../../context/OSContext';
import { X, Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { systemSettings } = useOS();
  const { notifications, dismissNotification } = systemSettings;

  // Filter only visible toasts, limit to 3 to prevent stacking too high
  const activeToasts = notifications.filter(n => n.visible).slice(0, 3);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle size={16} className="text-green-400" />;
      case 'warning': return <AlertTriangle size={16} className="text-yellow-400" />;
      case 'error': return <XCircle size={16} className="text-red-400" />;
      default: return <Info size={16} className="text-blue-400" />;
    }
  };

  return (
    <div className="fixed bottom-16 right-4 z-[10000] flex flex-col gap-3 pointer-events-none">
      {activeToasts.map((notif) => (
        <div
          key={notif.id}
          className="pointer-events-auto w-80 bg-neutral-900/90 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] animate-in slide-in-from-right fade-in duration-300 flex items-start gap-3"
        >
          <div className="mt-0.5 shrink-0">
            {getIcon(notif.type)}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-white leading-tight mb-1">{notif.title}</h4>
            <p className="text-xs text-white/60 leading-relaxed break-words">{notif.message}</p>
          </div>
          <button 
            onClick={() => {
              // Manually hiding toast by removing visible flag would be ideal, 
              // but dismissNotification removes it entirely which is acceptable for the 'X' on a toast
              dismissNotification(notif.id);
            }}
            className="text-white/40 hover:text-white transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};