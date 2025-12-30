import React, { useState, useRef } from 'react';
import { useOS } from '../context/OSContext';
import { Upload, FileDown, X, FileImage, Trash2, Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';

interface UploadedFile {
  id: string;
  name: string;
  url: string;
  size: string;
}

const ConverterApp: React.FC = () => {
  const { systemSettings } = useOS();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Global drag handlers for the app window
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only disable if we leave the main container
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const processFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    
    const fileArray = Array.from(fileList);
    const validFiles: File[] = [];
    let invalidCount = 0;

    fileArray.forEach(file => {
      // Basic mime type check for images
      if (file.type.startsWith('image/')) {
        validFiles.push(file);
      } else {
        invalidCount++;
      }
    });

    if (invalidCount > 0) {
      systemSettings.addNotification({
        title: 'Invalid File Type',
        message: `${invalidCount} file(s) skipped. Only image files (JPG, PNG, GIF) are accepted.`,
        type: 'warning'
      });
    }

    if (validFiles.length === 0) return;

    const newFiles: UploadedFile[] = validFiles.map(f => ({
      id: Math.random().toString(36).substr(2, 9),
      name: f.name,
      url: URL.createObjectURL(f),
      size: (f.size / 1024 / 1024).toFixed(2) + ' MB'
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleConvert = async () => {
    if (files.length === 0) return;
    setIsConverting(true);
    // Simulate conversion process
    await new Promise(r => setTimeout(r, 2000));
    setIsConverting(false);
    setIsDone(true);
  };

  const handleReset = () => {
    setFiles([]);
    setIsDone(false);
  };

  if (isDone) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-neutral-900/50">
        <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-300">
          <FileDown size={32} />
        </div>
        <h3 className="text-xl font-medium mb-2 text-white">Conversion Complete</h3>
        <p className="text-white/50 mb-8 max-w-[200px]">Your PDF has been generated successfully and is ready for download.</p>
        <div className="flex gap-4">
          <Button onClick={handleReset} variant="secondary">Convert New</Button>
          <Button onClick={() => alert("Downloading PDF...")}>Download PDF</Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="h-full flex flex-col bg-neutral-900/50 relative"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input 
        type="file" 
        multiple 
        accept="image/*" 
        className="hidden" 
        ref={fileInputRef}
        onChange={(e) => processFiles(e.target.files)}
      />

      {/* Drag Overlay */}
      <div className={`
        absolute inset-0 z-50 bg-neutral-900/90 backdrop-blur-sm border-2 border-cyan-500/50 border-dashed m-2 rounded-xl 
        flex flex-col items-center justify-center text-cyan-400 pointer-events-none transition-all duration-200
        ${isDragging ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
      `}>
        <Upload size={48} className="mb-4 animate-bounce" />
        <p className="text-lg font-medium">Drop images to add</p>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
        {files.length === 0 ? (
          <div 
            className="h-full border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center transition-all hover:border-white/20 hover:bg-white/5 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4 text-white/50">
              <Upload size={24} />
            </div>
            <p className="text-sm font-medium mb-1 text-white">Drop images here</p>
            <p className="text-xs text-white/40">or click to browse files</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {files.map((file, idx) => (
              <div key={file.id} className="group relative aspect-[3/4] bg-black/40 rounded-lg overflow-hidden border border-white/10 animate-in fade-in zoom-in-95 duration-200" style={{ animationDelay: `${idx * 50}ms` }}>
                <img src={file.url} alt={file.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100 flex flex-col justify-end p-3">
                  <p className="text-xs font-medium truncate text-white">{file.name}</p>
                  <p className="text-[10px] text-white/50">{file.size}</p>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); setFiles(files.filter(f => f.id !== file.id)); }}
                  className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-500/80 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all scale-90 hover:scale-100 backdrop-blur-sm"
                >
                  <X size={12} />
                </button>
                {/* Page Number Badge */}
                <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/60 rounded text-[10px] text-white/70 backdrop-blur-sm">
                   {idx + 1}
                </div>
              </div>
            ))}
            
            {/* Add More Button */}
            <button 
               onClick={() => fileInputRef.current?.click()}
               className="aspect-[3/4] border border-dashed border-white/10 rounded-lg flex flex-col items-center justify-center hover:bg-white/5 hover:border-white/20 transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                 <Plus size={20} className="text-white/40 group-hover:text-white" />
              </div>
              <span className="text-xs text-white/40 group-hover:text-white/60">Add Page</span>
            </button>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="p-4 border-t border-white/5 flex items-center justify-between bg-black/20 backdrop-blur-md">
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 text-xs text-white/50">
             <FileImage size={14} />
             <span>{files.length} Pages</span>
           </div>
           {files.length > 0 && (
             <button 
               onClick={() => setFiles([])}
               className="text-xs text-red-400/70 hover:text-red-400 flex items-center gap-1 transition-colors"
             >
                <Trash2 size={12} /> Clear
             </button>
           )}
        </div>
        <Button 
          onClick={handleConvert} 
          disabled={files.length === 0} 
          isLoading={isConverting}
        >
          {isConverting ? 'Generating PDF...' : 'Convert to PDF'}
        </Button>
      </div>
    </div>
  );
};

export default ConverterApp;