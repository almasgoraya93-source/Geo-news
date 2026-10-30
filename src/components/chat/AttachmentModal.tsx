import React, { useRef } from 'react';
import { X, Image, Camera, Smartphone, Folder, MonitorPlay, Mic } from 'lucide-react';

interface AttachmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (base64Url: string, filename: string) => void;
  onTakePhoto: () => void;
  onUploadScreenshot: () => void;
  onUploadFile: (filename: string) => void;
  onShareScreen: () => void;
  onStartVoice: () => void;
  isDark?: boolean;
}

export const AttachmentModal: React.FC<AttachmentModalProps> = ({
  isOpen,
  onClose,
  onSelectImage,
  onTakePhoto,
  onUploadScreenshot,
  onUploadFile,
  onShareScreen,
  onStartVoice,
  isDark = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        onSelectImage(reader.result as string, file.name);
        onClose();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadFile(file.name);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <input
        type="file"
        ref={docInputRef}
        accept=".pdf,.txt,.log,.json"
        className="hidden"
        onChange={handleDocChange}
      />

      <div
        className={`w-full max-w-md rounded-t-3xl p-6 ${
          isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'
        } shadow-2xl border-t border-slate-100 transition-all transform animate-in slide-in-from-bottom duration-300`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Add Attachment
          </h3>
          <button
            onClick={onClose}
            aria-label="Close Attachment Menu"
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 6 Actions Grid matching reference screenshot */}
        <div className="grid grid-cols-3 gap-3.5 mt-5">
          {/* 1. Upload Image */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-blue-50/70 dark:bg-slate-800 border border-blue-100/60 dark:border-slate-700/60 hover:bg-blue-100/60 transition-colors cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Image className="w-6 h-6 stroke-[1.8]" />
            </div>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 text-center leading-tight">
              Upload<br />Image
            </span>
          </button>

          {/* 2. Take Photo */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onTakePhoto();
            }}
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-pink-50/70 dark:bg-slate-800 border border-pink-100/60 dark:border-slate-700/60 hover:bg-pink-100/60 transition-colors cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-pink-500/10 text-pink-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Camera className="w-6 h-6 stroke-[1.8]" />
            </div>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 text-center leading-tight">
              Take<br />Photo
            </span>
          </button>

          {/* 3. Upload Screenshot */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onUploadScreenshot();
            }}
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-slate-800 border border-indigo-100/60 dark:border-slate-700/60 hover:bg-indigo-100/60 transition-colors cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Smartphone className="w-6 h-6 stroke-[1.8]" />
            </div>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 text-center leading-tight">
              Upload<br />Screenshot
            </span>
          </button>

          {/* 4. Upload File */}
          <button
            type="button"
            onClick={() => docInputRef.current?.click()}
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-cyan-50/70 dark:bg-slate-800 border border-cyan-100/60 dark:border-slate-700/60 hover:bg-cyan-100/60 transition-colors cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Folder className="w-6 h-6 stroke-[1.8]" />
            </div>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 text-center leading-tight">
              Upload<br />File
            </span>
          </button>

          {/* 5. Share Screen */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onShareScreen();
            }}
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-purple-50/70 dark:bg-slate-800 border border-purple-100/60 dark:border-slate-700/60 hover:bg-purple-100/60 transition-colors cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <MonitorPlay className="w-6 h-6 stroke-[1.8]" />
            </div>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 text-center leading-tight">
              Share<br />Screen
            </span>
          </button>

          {/* 6. Voice Chat */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onStartVoice();
            }}
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-blue-50/70 dark:bg-slate-800 border border-blue-100/60 dark:border-slate-700/60 hover:bg-blue-100/60 transition-colors cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Mic className="w-6 h-6 stroke-[1.8]" />
            </div>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 text-center leading-tight">
              Voice<br />Chat
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
