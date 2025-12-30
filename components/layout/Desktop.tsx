import React from 'react';
import { useOS } from '../../context/OSContext';
import { Taskbar } from './Taskbar';
import { WindowFrame } from '../window/WindowFrame';
import { DesktopWidget } from '../widgets/DesktopWidget';
import { TimeWidget } from '../widgets/TimeWidget';
import { NotesWidget } from '../widgets/NotesWidget';
import { StatusWidget } from '../widgets/StatusWidget';
import { APPS } from '../../constants';
import { WidgetType } from '../../types';

export const Desktop: React.FC = () => {
  const { 
    systemStatus, 
    windows, 
    activeWindowId, 
    closeApp, 
    minimizeApp, 
    focusApp, 
    updateWindowPosition,
    systemSettings,
    desktop
  } = useOS();

  const { brightness } = systemSettings;
  const { wallpaper, widgets } = desktop;

  const renderWidget = (type: WidgetType, widget: any) => {
    switch (type) {
      case 'time': return <TimeWidget widget={widget} />;
      case 'notes': return <NotesWidget widget={widget} />;
      case 'status': return <StatusWidget />;
      default: return null;
    }
  };

  return (
    <div 
      className={`relative w-full h-full overflow-hidden transition-opacity duration-1000 bg-[#050505]
      ${systemStatus === 'active' ? 'opacity-100' : 'opacity-0'}`}
      style={{ filter: `brightness(${brightness}%)` }}
    >
      {/* Animated Background (Default) */}
      {!wallpaper && (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-800 via-neutral-950 to-black opacity-60" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 pointer-events-none mix-blend-overlay" />
          <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-transparent to-transparent animate-[spin_120s_linear_infinite] pointer-events-none" />
        </>
      )}

      {/* Custom Wallpaper Layer */}
      {wallpaper && (
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-500"
          style={{ backgroundImage: `url(${wallpaper})` }}
        >
          <div className="absolute inset-0 bg-black/20" /> {/* Slight overlay for readability */}
        </div>
      )}

      {/* Widgets Layer (Z-Index 10) */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {widgets.map(widget => (
          <DesktopWidget key={widget.id} widget={widget}>
            {renderWidget(widget.type, widget)}
          </DesktopWidget>
        ))}
      </div>

      {/* Windows Layer (Z-Index 20+) - WindowFrame manages its own Z-index starting base */}
      <div className="absolute inset-0 pb-12 z-20 pointer-events-none">
          {Object.values(APPS).map((app) => (
            <WindowFrame
              key={app.id}
              config={windows[app.id]}
              title={app.name}
              isActive={activeWindowId === app.id}
              onClose={() => closeApp(app.id)}
              onMinimize={() => minimizeApp(app.id)}
              onFocus={() => focusApp(app.id)}
              onMove={(pos) => updateWindowPosition(app.id, pos)}
            >
              <app.component />
            </WindowFrame>
          ))}
      </div>

      <Taskbar />
    </div>
  );
};