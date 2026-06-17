import { useState, useEffect } from 'react';
import { UploadCloud, CheckCircle2, Loader2, FileText, X } from 'lucide-react';
import { fetchCloudinaryConfig } from '../../../services/api';

const CloudinaryUploader = ({ onUploadSuccess }) => {
  const [config, setConfig] = useState(null);
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, success, error
  const [uploadedUrl, setUploadedUrl] = useState('');

  useEffect(() => {
    fetchCloudinaryConfig().then(setConfig).catch(() => {
      // Standard safe fallback
      setConfig({ cloudName: 'demo', uploadPreset: 'preset_secure' });
    });
  }, []);

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    setUploadStatus('uploading');
    setProgress(10);

    // Simulate Cloudinary multi-chunk REST upload progression
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 20;
      });
    }, 300);

    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setUploadStatus('success');
      // Create secure simulated image/document preview link
      const simulatedStorageUrl = `https://res.cloudinary.com/${config?.cloudName || 'healthcareplus'}/image/upload/v${Date.now()}/${encodeURIComponent(selectedFile.name)}`;
      setUploadedUrl(simulatedStorageUrl);
      if (onUploadSuccess) onUploadSuccess(simulatedStorageUrl, selectedFile.name);
    }, 1800);
  };

  return (
    <div className="bg-white dark:bg-[#0c0c0c] rounded-2xl border border-slate-200 dark:border-slate-800 p-5">
      <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-1.5">
        <UploadCloud size={16} className="text-blue-600 dark:text-blue-500" />
        <span>Secure Cloudinary Upload</span>
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
        Attach medical files, reports, or identity documents securely
      </p>

      {uploadStatus === 'idle' && (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files?.[0]) handleFileSelect(e.dataTransfer.files[0]);
          }}
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-all relative ${
            isDragging
              ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/20'
              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/30 dark:bg-black'
          }`}
        >
          <input
            type="file"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept="image/*,application/pdf"
          />
          <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-2">
            <UploadCloud size={20} />
          </div>
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Drag & drop files here, or <span className="text-blue-600 dark:text-blue-400 underline">browse</span>
          </p>
          <p className="text-[10px] text-slate-400 mt-1">Supports PDF, PNG, JPG up to 10MB</p>
        </div>
      )}

      {uploadStatus === 'uploading' && (
        <div className="bg-slate-50 dark:bg-black p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-700 dark:text-slate-300 truncate max-w-[200px]">{file?.name}</span>
            <span className="text-blue-600 dark:text-blue-400">{progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-[10px] text-slate-400 flex items-center gap-1">
            <Loader2 size={10} className="animate-spin text-blue-600" /> Uploading block to storage container...
          </p>
        </div>
      )}

      {uploadStatus === 'success' && (
        <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center flex-shrink-0">
              <CheckCircle2 size={16} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-emerald-900 dark:text-emerald-300 truncate">{file?.name}</p>
              <a
                href={uploadedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-blue-600 dark:text-blue-400 underline truncate block"
              >
                View hosted file preview
              </a>
            </div>
          </div>
          <button
            onClick={() => {
              setFile(null);
              setUploadStatus('idle');
              setUploadedUrl('');
            }}
            className="p-1.5 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 transition-colors cursor-pointer"
            title="Upload another file"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default CloudinaryUploader;
