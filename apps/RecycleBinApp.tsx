import React from 'react';
import { useOS } from '../context/OSContext';
import { FileText, Trash2, RefreshCw, XCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { FileNode } from '../types';

const RecycleBinApp: React.FC = () => {
  const { fileSystem } = useOS();
  const { files, restoreFile, permanentDeleteFile, emptyRecycleBin } = fileSystem;

  const deletedFiles = (Object.values(files) as FileNode[]).filter(f => f.isTrash);

  return (
    <div className="h-full flex flex-col bg-neutral-900/90 text-white">
      <div className="h-12 border-b border-white/5 flex items-center justify-between px-4 bg-white/5">
        <div className="flex items-center gap-2 opacity-50">
          <Trash2 size={16} />
          <span className="text-sm font-medium">Recycle Bin Tools</span>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={emptyRecycleBin}
                className="text-xs px-3 py-1 bg-red-500/10 text-red-300 hover:bg-red-500/20 rounded border border-red-500/20 transition-colors"
            >
                Empty Recycle Bin
            </button>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-auto">
        {deletedFiles.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-white/30">
            <Trash2 size={48} className="mb-4 opacity-20" />
            <p>Recycle Bin is empty</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2">
            {deletedFiles.map(file => (
              <div 
                key={file.id}
                className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 group hover:border-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                   <FileText size={20} className="text-white/50" />
                   <div>
                     <p className="text-sm">{file.name}</p>
                     <p className="text-xs text-white/30">Original Location: {file.parentId ? 'Folder' : 'My Computer'}</p>
                   </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" onClick={() => restoreFile(file.id)} title="Restore">
                    <RefreshCw size={14} />
                  </Button>
                  <Button variant="ghost" onClick={() => permanentDeleteFile(file.id)} className="hover:text-red-400" title="Delete Forever">
                    <XCircle size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecycleBinApp;