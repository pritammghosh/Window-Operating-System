import { useState } from 'react';
import { FileNode } from '../types';

const INITIAL_FILES: Record<string, FileNode> = {
  'folder-docs': { id: 'folder-docs', name: 'Documents', type: 'folder', parentId: null, size: '--', createdAt: new Date(), isTrash: false },
  'folder-system': { id: 'folder-system', name: 'System', type: 'folder', parentId: null, size: '--', createdAt: new Date(), isTrash: false },
  'file-welcome': { id: 'file-welcome', name: 'Welcome.txt', type: 'file', parentId: 'folder-docs', content: 'Welcome to TOS v1.0', size: '2KB', createdAt: new Date(), isTrash: false },
  'file-config': { id: 'file-config', name: 'config.json', type: 'file', parentId: 'folder-system', content: '{"version": "1.0"}', size: '1KB', createdAt: new Date(), isTrash: false },
};

export const useFileSystem = () => {
  const [files, setFiles] = useState<Record<string, FileNode>>(INITIAL_FILES);

  const createFile = (name: string, content: string, parentId: string | null) => {
    const id = `file-${Date.now()}`;
    const newFile: FileNode = {
      id,
      name,
      type: 'file',
      parentId,
      content,
      size: '1KB',
      createdAt: new Date(),
      isTrash: false
    };
    setFiles(prev => ({ ...prev, [id]: newFile }));
  };

  const createFolder = (name: string, parentId: string | null) => {
    const id = `folder-${Date.now()}`;
    const newFolder: FileNode = {
      id,
      name,
      type: 'folder',
      parentId,
      size: '--',
      createdAt: new Date(),
      isTrash: false
    };
    setFiles(prev => ({ ...prev, [id]: newFolder }));
  };

  const deleteFile = (id: string) => {
    setFiles(prev => ({
      ...prev,
      [id]: { ...prev[id], isTrash: true }
    }));
  };

  const restoreFile = (id: string) => {
    setFiles(prev => ({
      ...prev,
      [id]: { ...prev[id], isTrash: false }
    }));
  };

  const permanentDeleteFile = (id: string) => {
    setFiles(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const renameFile = (id: string, newName: string) => {
    if (!newName.trim()) return;
    setFiles(prev => ({
      ...prev,
      [id]: { ...prev[id], name: newName }
    }));
  };

  const emptyRecycleBin = () => {
    setFiles(prev => {
      const next = { ...prev };
      (Object.values(next) as FileNode[]).forEach(file => {
        if (file.isTrash) delete next[file.id];
      });
      return next;
    });
  };

  return {
    files,
    createFile,
    createFolder,
    deleteFile,
    restoreFile,
    permanentDeleteFile,
    renameFile,
    emptyRecycleBin
  };
};