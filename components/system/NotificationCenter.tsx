import React from 'react';
import { useOS } from '../../context/OSContext';
import { Bell, Trash2, X, Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface NotificationCenterProps {
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ onClose }) => {
  const { systemSettings } = useOS();
  const { notifications, clearAllNotifications, dismissNotification } = systemSettings;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle size={14} className="text-green-400" />;
      case 'warning': return <AlertTriangle size={14} className="text-yellow-400" />;
      case 'error': return <XCircle size={14} className="text-red-400" />;
      default: return <Info size={14} className="text-blue-400" />;
    }
  };

  return (
    <div className="absolute bottom-12 right-4 w-80 max-h-[500px] bg-neutral-900/95 backdrop-blur-2xl border border-white/10 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.6)] flex flex-col animate-in slide-in-from-bottom-5 fade-in duration-200 z-[10000] overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
        <div className="flex items-center gap-2">
          <Bell size={16} className="text-white/70" />
          <span className="text-sm font-medium text-white">Notifications</span>
          {notifications.length > 0 && (
            <span className="bg-white/10 text-white/70 text-[10px] px-1.5 py-0.5 rounded-full">
              {notifications.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {notifications.length > 0 && (
            <button 
              onClick={clearAllNotifications}
              className="p-1.5 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors"
              title="Clear All"
            >
              <Trash2 size={14} />
            </button>
          )}
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-thin scrollbar-thumb-white/10">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-white/20">
            <Bell size={48} className="mb-4 opacity-20" />
            <p className="text-xs">No new notifications</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div 
              key={notif.id}
              className="relative group p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0 opacity-80">
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-xs font-medium text-white/90 truncate pr-4">{notif.title}</h4>
                    <span className="text-[10px] text-white/30 whitespace-nowrap">
                      {notif.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-white/50 leading-relaxed line-clamp-2">{notif.message}</p>
                </div>
              </div>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  dismissNotification(notif.id);
                }}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded text-white/40 hover:text-white transition-all"
              >
                <X size={12} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};