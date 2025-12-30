import React, { useState } from 'react';
import { useOS } from '../context/OSContext';
import { Button } from '../components/ui/Button';
import { Image, Clock, StickyNote, Activity, Layout, Monitor, Trash2, Palette, Check } from 'lucide-react';
import { Theme, WidgetType } from '../types';

const SettingsApp: React.FC = () => {
  const { desktop, systemSettings } = useOS();
  const [activeTab, setActiveTab] = useState<'wallpaper' | 'appearance' | 'widgets' | 'about'>('wallpaper');
  const [inputUrl, setInputUrl] = useState('');

  const handleApplyWallpaper = () => {
    if (inputUrl) {
      desktop.setWallpaper(inputUrl);
      systemSettings.addNotification({
        title: 'Wallpaper Updated',
        message: 'Your new desktop background has been applied.',
        type: 'success'
      });
      setInputUrl('');
    }
  };

  const handleClearWallpaper = () => {
    desktop.setWallpaper(null);
    setInputUrl('');
    systemSettings.addNotification({
      title: 'Wallpaper Removed',
      message: 'Restored system default background.',
      type: 'info'
    });
  };

  const handleAddWidget = (type: WidgetType, name: string) => {
    desktop.addWidget(type);
    systemSettings.addNotification({
      title: 'Widget Added',
      message: `${name} has been added to the desktop.`,
      type: 'success'
    });
  };

  const themes: { id: Theme; name: string; description: string; colors: string }[] = [
    { id: 'dark', name: 'Dark (Default)', description: 'Minimalist, low contrast, standard.', colors: 'bg-neutral-800 border-white/20' },
    { id: 'glass', name: 'Glass', description: 'High transparency, blue glow, futuristic.', colors: 'bg-blue-500/20 border-blue-400/30' },
    { id: 'frost', name: 'Frost', description: 'Bright, icy transparency, soft shadows.', colors: 'bg-white/20 border-white/40' },
    { id: 'void', name: 'Void', description: 'High contrast, technical, dashed lines.', colors: 'bg-black border-dashed border-white/30' },
  ];

  return (
    <div className="flex h-full bg-neutral-900/95 text-white">
      {/* Sidebar */}
      <div className="w-48 bg-black/20 border-r border-white/5 p-4 flex flex-col gap-1">
        <div className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2 px-2">Personalization</div>
        <button 
          onClick={() => setActiveTab('wallpaper')}
          className={`flex items-center gap-2 text-sm px-2 py-2 rounded-lg transition-colors ${activeTab === 'wallpaper' ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
        >
          <Image size={16} /> Wallpaper
        </button>
        <button 
          onClick={() => setActiveTab('appearance')}
          className={`flex items-center gap-2 text-sm px-2 py-2 rounded-lg transition-colors ${activeTab === 'appearance' ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
        >
          <Palette size={16} /> Appearance
        </button>
        <button 
          onClick={() => setActiveTab('widgets')}
          className={`flex items-center gap-2 text-sm px-2 py-2 rounded-lg transition-colors ${activeTab === 'widgets' ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
        >
          <Layout size={16} /> Widgets
        </button>
        <div className="h-px bg-white/5 my-2" />
        <button 
          onClick={() => setActiveTab('about')}
          className={`flex items-center gap-2 text-sm px-2 py-2 rounded-lg transition-colors ${activeTab === 'about' ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
        >
          <Monitor size={16} /> System Info
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {activeTab === 'wallpaper' && (
          <div className="space-y-6 max-w-lg">
            <div>
              <h2 className="text-2xl font-light mb-1">Wallpaper</h2>
              <p className="text-white/50 text-sm">Customize your desktop background.</p>
            </div>

            <div className="space-y-4">
              <div className="aspect-video rounded-xl bg-neutral-800 overflow-hidden border border-white/10 relative group">
                {desktop.wallpaper ? (
                  <>
                    <img src={desktop.wallpaper} alt="Current Wallpaper" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button variant="danger" onClick={handleClearWallpaper}>
                            <Trash2 size={16} /> Remove
                        </Button>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20 bg-gradient-to-br from-neutral-800 to-black">
                    <span className="text-xs uppercase tracking-widest">Default System Background</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-white/70">Set New Wallpaper</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-white/30 transition-colors"
                  />
                  <Button onClick={handleApplyWallpaper} disabled={!inputUrl}>Apply</Button>
                </div>
                <p className="text-[10px] text-white/30">Supports JPG, PNG, WEBP from any secure (https) source.</p>
              </div>

              <div className="pt-4 border-t border-white/5">
                 <Button 
                    variant="secondary" 
                    onClick={handleClearWallpaper} 
                    className="w-full justify-center"
                    disabled={!desktop.wallpaper}
                 >
                   Reset to Default Wallpaper
                 </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'appearance' && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h2 className="text-2xl font-light mb-1">Appearance & Theme</h2>
              <p className="text-white/50 text-sm">Control the visual language of the operating system.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
               {themes.map(theme => (
                 <button
                   key={theme.id}
                   onClick={() => systemSettings.setTheme(theme.id)}
                   className={`
                      relative p-4 rounded-xl border text-left transition-all duration-200 group
                      ${systemSettings.theme === theme.id 
                        ? 'bg-white/10 border-white/40 shadow-lg' 
                        : 'bg-white/5 border-white/5 hover:bg-white/10'
                      }
                   `}
                 >
                   <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                         <div className={`w-8 h-8 rounded-full border ${theme.colors}`} />
                         <span className="font-medium text-sm">{theme.name}</span>
                      </div>
                      {systemSettings.theme === theme.id && <Check size={16} className="text-cyan-400" />}
                   </div>
                   <p className="text-xs text-white/50">{theme.description}</p>
                 </button>
               ))}
            </div>
            
             <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-xs text-white/60">
                <strong>Note:</strong> Changing themes affects window styles, snap zones, and system highlights instantly.
            </div>
          </div>
        )}

        {activeTab === 'widgets' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-light mb-1">Widgets</h2>
              <p className="text-white/50 text-sm">Add functional widgets to your desktop.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {/* Time Widget Card */}
               <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                        <Clock size={20} />
                    </div>
                    <div>
                        <h3 className="font-medium text-sm">Clock Widget</h3>
                        <p className="text-xs text-white/40">Shows current time</p>
                    </div>
                  </div>
                  <Button variant="secondary" onClick={() => handleAddWidget('time', 'Clock Widget')} className="w-full justify-center">Add to Desktop</Button>
               </div>

               {/* Notes Widget Card */}
               <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-yellow-500/20 text-yellow-400 flex items-center justify-center">
                        <StickyNote size={20} />
                    </div>
                    <div>
                        <h3 className="font-medium text-sm">Quick Note</h3>
                        <p className="text-xs text-white/40">Simple sticky notes</p>
                    </div>
                  </div>
                  <Button variant="secondary" onClick={() => handleAddWidget('notes', 'Quick Note')} className="w-full justify-center">Add to Desktop</Button>
               </div>

               {/* Status Widget Card */}
               <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/20 text-green-400 flex items-center justify-center">
                        <Activity size={20} />
                    </div>
                    <div>
                        <h3 className="font-medium text-sm">System Status</h3>
                        <p className="text-xs text-white/40">Monitor resources</p>
                    </div>
                  </div>
                  <Button variant="secondary" onClick={() => handleAddWidget('status', 'System Status')} className="w-full justify-center">Add to Desktop</Button>
               </div>
            </div>
            
            <div className="mt-8 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-200 text-xs">
                <strong>Tip:</strong> Widgets appear on the desktop layer. You can drag them to position them anywhere. Hover over a widget to reveal the remove button.
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="space-y-6 max-w-lg">
             <div>
              <h2 className="text-2xl font-light mb-1">System Information</h2>
              <p className="text-white/50 text-sm">About THE OPERATING SYSTEM</p>
            </div>
            
            <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                    <span className="text-sm text-white/70">OS Version</span>
                    <span className="font-mono text-sm">1.0.0 (Alpha)</span>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                    <span className="text-sm text-white/70">Kernel</span>
                    <span className="font-mono text-sm">React 18.2.0</span>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                    <span className="text-sm text-white/70">Resolution</span>
                    <span className="font-mono text-sm">{window.innerWidth}x{window.innerHeight}</span>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsApp;