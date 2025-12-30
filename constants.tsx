import { AppID, AppConfig } from './types';
import { FileText, Image, Activity, HardDrive, FolderOpen, Trash2, Calculator, Globe, Settings, PenTool, Bot } from 'lucide-react';
import WriterApp from './apps/WriterApp';
import ConverterApp from './apps/ConverterApp';
import MonitorApp from './apps/MonitorApp';
import FileExplorerApp from './apps/FileExplorerApp';
import RecycleBinApp from './apps/RecycleBinApp';
import CalculatorApp from './apps/CalculatorApp';
import BrowserApp from './apps/BrowserApp';
import SettingsApp from './apps/SettingsApp';
import CreatorApp from './apps/CreatorApp';
import ChatbotApp from './apps/ChatbotApp';

// Memory Placeholder
const MemoryAppPlaceholder = () => (
  <div className="p-8 text-center text-white/50 font-mono">
    <HardDrive className="w-12 h-12 mx-auto mb-4 opacity-50" />
    <p>Memory Management Active</p>
    <p className="text-xs mt-2">Session state is persisting automatically.</p>
  </div>
);

export const APPS: Record<AppID, AppConfig> = {
  [AppID.CHATBOT]: {
    id: AppID.CHATBOT,
    name: 'AI powered chatbot',
    icon: Bot,
    component: ChatbotApp,
    defaultSize: { width: 500, height: 650 },
    description: 'AI Assistant',
  },
  [AppID.CREATOR]: {
    id: AppID.CREATOR,
    name: 'Creator.app',
    icon: PenTool,
    component: CreatorApp,
    defaultSize: { width: 900, height: 700 },
    description: 'About Devartha Studio',
  },
  [AppID.FILE_EXPLORER]: {
    id: AppID.FILE_EXPLORER,
    name: 'File Explorer',
    icon: FolderOpen,
    component: FileExplorerApp,
    defaultSize: { width: 800, height: 550 },
    description: 'Browse local files',
  },
  [AppID.BROWSER]: {
    id: AppID.BROWSER,
    name: 'Chrome',
    icon: Globe,
    component: BrowserApp,
    defaultSize: { width: 900, height: 650 },
    description: 'Web Browser',
  },
  [AppID.SETTINGS]: {
    id: AppID.SETTINGS,
    name: 'Settings',
    icon: Settings,
    component: SettingsApp,
    defaultSize: { width: 800, height: 600 },
    description: 'System Preferences',
  },
  [AppID.WRITER]: {
    id: AppID.WRITER,
    name: 'Writer.app',
    icon: FileText,
    component: WriterApp,
    defaultSize: { width: 800, height: 600 },
    description: 'AI-Enhanced Text Editor',
  },
  [AppID.CONVERTER]: {
    id: AppID.CONVERTER,
    name: 'Converter.app',
    icon: Image,
    component: ConverterApp,
    defaultSize: { width: 700, height: 500 },
    description: 'Image to PDF Utility',
  },
  [AppID.CALCULATOR]: {
    id: AppID.CALCULATOR,
    name: 'Calculator',
    icon: Calculator,
    component: CalculatorApp,
    defaultSize: { width: 320, height: 480 },
    description: 'Standard Calculator',
  },
  [AppID.MONITOR]: {
    id: AppID.MONITOR,
    name: 'Monitor.app',
    icon: Activity,
    component: MonitorApp,
    defaultSize: { width: 500, height: 400 },
    description: 'System Resources',
  },
  [AppID.RECYCLE_BIN]: {
    id: AppID.RECYCLE_BIN,
    name: 'Recycle Bin',
    icon: Trash2,
    component: RecycleBinApp,
    defaultSize: { width: 600, height: 400 },
    description: 'Deleted Files',
  },
  [AppID.MEMORY]: {
    id: AppID.MEMORY,
    name: 'Memory.app',
    icon: HardDrive,
    component: MemoryAppPlaceholder,
    defaultSize: { width: 300, height: 200 },
    description: 'State Persistence',
  },
};

export const INITIAL_BOOT_DELAY = 2500;
export const SHUTDOWN_DELAY = 1500;