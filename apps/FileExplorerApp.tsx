import React, { useState, useEffect, useRef } from 'react';
import { useOS } from '../context/OSContext';
import { Folder, FileText, HardDrive, Trash2, ChevronRight, MoreVertical, Plus } from 'lucide-react';
import { AppID, FileNode } from '../types';

interface ContextMenuState {
  x: number;
  y: number;
  type: 'item' | 'background';
  targetId?: string;
}

const FileExplorerApp: React.FC = () => {
  const { fileSystem, launchApp, systemSettings } = useOS();
  const { files, createFolder, deleteFile, renameFile } = fileSystem;
  
  // State
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);

  const displayedFiles = (Object.values(files) as FileNode[]).filter(f => 
    !f.isTrash && 
    (currentFolder ? f.parentId === currentFolder : f.parentId === null)
  );

  // Close context menu on click elsewhere
  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedId || renamingId) return;

      if (e.key === 'Delete') {
        handleDelete(selectedId);
      }
      if (e.key === 'F2') {
        startRenaming(selectedId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, renamingId, deleteFile]);

  // Focus rename input on mount
  useEffect(() => {
    if (renamingId && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [renamingId]);

  const startRenaming = (id: string) => {
    setRenamingId(id);
    setRenameValue(files[id]?.name || '');
    setContextMenu(null);
  };

  const commitRename = () => {
    if (renamingId && renameValue) {
      renameFile(renamingId, renameValue);
    }
    setRenamingId(null);
  };

  const handleItemClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedId(id);
    setContextMenu(null);
  };

  const handleItemDoubleClick = (e: React.MouseEvent, file: FileNode) => {
    e.stopPropagation();
    if (file.type === 'folder') {
      setCurrentFolder(file.id);
      setSelectedId(null);
    } else {
      // Simulate opening a file
      systemSettings.addNotification({
        title: 'File Open',
        message: `Opened ${file.name}`,
        type: 'info'
      });
    }
  };

  const handleContextMenu = (e: React.MouseEvent, type: 'item' | 'background', targetId?: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      type,
      targetId
    });

    if (targetId) {
      setSelectedId(targetId);
    } else {
      setSelectedId(null);
    }
  };

  const handleCreateFolder = () => {
    createFolder('New Folder', currentFolder);
    setContextMenu(null);
    systemSettings.addNotification({
      title: 'Folder Created',
      message: 'New Folder has been created.',
      type: 'success'
    });
  };

  const handleDelete = (id: string) => {
    const fileName = files[id]?.name;
    deleteFile(id);
    setSelectedId(null);
    setContextMenu(null);
    systemSettings.addNotification({
      title: 'Item Moved to Trash',
      message: `${fileName || 'Item'} moved to Recycle Bin`,
      type: 'info'
    });
  };

  return (
    <div className="h-full flex text-white bg-neutral-900/95" ref={containerRef} onClick={() => { setSelectedId(null); setContextMenu(null); }}>
      
      {/* Sidebar */}
      <div className="w-48 bg-black/20 border-r border-white/5 p-4 flex flex-col gap-1 select-none">
        <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-2 px-2">Favorites</div>
        <button 
          onClick={(e) => { e.stopPropagation(); setCurrentFolder(null); setSelectedId(null); }}
          className={`flex items-center gap-2 text-sm px-2 py-1.5 rounded-lg transition-colors ${!currentFolder ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
        >
          <HardDrive size={14} /> My Computer
        </button>
        <button 
           onClick={(e) => { e.stopPropagation(); launchApp(AppID.RECYCLE_BIN); }}
           className="flex items-center gap-2 text-sm px-2 py-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors"
        >
          <Trash2 size={14} /> Recycle Bin
        </button>

        <div className="h-px bg-white/5 my-3" />
        
        <div className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-2 px-2">Folders</div>
        {(Object.values(files) as FileNode[])
            .filter(f => f.type === 'folder' && !f.isTrash && !f.parentId)
            .map(folder => (
           <button 
            key={folder.id}
            onClick={(e) => { e.stopPropagation(); setCurrentFolder(folder.id); setSelectedId(null); }}
            className={`flex items-center gap-2 text-sm px-2 py-1.5 rounded-lg transition-colors ${currentFolder === folder.id ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
           >
            <Folder size={14} className={currentFolder === folder.id ? 'text-cyan-400' : ''} /> {folder.name}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div 
        className="flex-1 flex flex-col h-full overflow-hidden" 
        onContextMenu={(e) => handleContextMenu(e, 'background')}
      >
        {/* Breadcrumb / Header */}
        <div className="h-12 border-b border-white/5 flex items-center px-6 gap-2 select-none bg-white/5">
            <button onClick={() => setCurrentFolder(null)} className="hover:bg-white/10 p-1 rounded text-white/50 hover:text-white transition-colors">
                <HardDrive size={16} />
            </button>
            <ChevronRight size={14} className="text-white/20" />
            <span className="text-sm font-medium">
                {currentFolder ? files[currentFolder]?.name : 'My Computer'}
            </span>
        </div>

        {/* File Grid */}
        <div className="flex-1 p-6 overflow-auto">
            <div className="grid grid-cols-4 lg:grid-cols-5 gap-4 content-start">
            {displayedFiles.map(file => (
                <div 
                    key={file.id} 
                    className={`
                        group flex flex-col items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer select-none
                        ${selectedId === file.id 
                            ? 'bg-blue-500/20 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.15)]' 
                            : 'bg-transparent border-transparent hover:bg-white/5 hover:border-white/5'
                        }
                    `}
                    onClick={(e) => handleItemClick(e, file.id)}
                    onDoubleClick={(e) => handleItemDoubleClick(e, file)}
                    onContextMenu={(e) => handleContextMenu(e, 'item', file.id)}
                >
                    <div className={`w-12 h-12 flex items-center justify-center transition-transform ${selectedId === file.id ? 'scale-110' : 'group-hover:scale-105'}`}>
                        {file.type === 'folder' ? (
                            <Folder size={44} className="text-cyan-400 fill-cyan-400/20" strokeWidth={1.5} />
                        ) : (
                            <FileText size={44} className="text-white/80" strokeWidth={1.5} />
                        )}
                    </div>
                    
                    {renamingId === file.id ? (
                        <input
                            ref={renameInputRef}
                            type="text"
                            value={renameValue}
                            onChange={(e) => setRenameValue(e.target.value)}
                            onBlur={commitRename}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') commitRename();
                                if (e.key === 'Escape') setRenamingId(null);
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full bg-black/50 border border-blue-500/50 rounded px-1 text-center text-sm focus:outline-none"
                        />
                    ) : (
                        <div className="text-center w-full">
                            <p className={`text-sm font-medium truncate w-full ${selectedId === file.id ? 'text-white' : 'text-white/90'}`}>
                                {file.name}
                            </p>
                            <p className={`text-[10px] ${selectedId === file.id ? 'text-white/60' : 'text-white/40'}`}>
                                {file.size}
                            </p>
                        </div>
                    )}
                </div>
            ))}
            
            {/* Empty State Action */}
            <button 
                onClick={(e) => { e.stopPropagation(); handleCreateFolder(); }}
                className="flex flex-col items-center gap-3 p-4 rounded-xl border border-dashed border-white/10 hover:border-white/20 hover:bg-white/5 transition-colors group"
            >
                <div className="w-12 h-12 flex items-center justify-center text-white/20 group-hover:text-white/40">
                    <Plus size={32} />
                </div>
                <span className="text-sm text-white/30 group-hover:text-white/50">New Folder</span>
            </button>
            </div>
        </div>
      </div>

      {/* Context Menu Overlay */}
      {contextMenu && (
        <div 
            className="fixed z-[10000] w-48 bg-neutral-900 border border-white/10 rounded-lg shadow-2xl py-1 animate-in fade-in zoom-in-95 duration-100"
            style={{ top: contextMenu.y, left: contextMenu.x }}
            onClick={(e) => e.stopPropagation()}
        >
            {contextMenu.type === 'item' ? (
                <>
                    <button 
                        className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors"
                        onClick={() => {
                            const file = files[contextMenu.targetId!];
                            if (file) handleItemDoubleClick({ stopPropagation: () => {} } as React.MouseEvent, file);
                            setContextMenu(null);
                        }}
                    >
                        Open
                    </button>
                    <div className="h-px bg-white/10 my-1" />
                    <button 
                        className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors"
                        onClick={() => startRenaming(contextMenu.targetId!)}
                    >
                        Rename
                    </button>
                    <button 
                        className="w-full text-left px-4 py-2 text-sm text-red-300 hover:bg-red-500/20 transition-colors"
                        onClick={() => handleDelete(contextMenu.targetId!)}
                    >
                        Delete
                    </button>
                </>
            ) : (
                <>
                     <button 
                        className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors"
                        onClick={handleCreateFolder}
                    >
                        New Folder
                    </button>
                    <div className="h-px bg-white/10 my-1" />
                    <button 
                        className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors"
                        onClick={() => setContextMenu(null)}
                    >
                        Refresh
                    </button>
                </>
            )}
        </div>
      )}
    </div>
  );
};

export default FileExplorerApp;