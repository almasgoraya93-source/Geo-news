import React, { useRef, useState } from 'react';
import { X, Image, Camera, Smartphone, Folder, MonitorPlay, Mic, ChevronRight, Upload } from 'lucide-react';

interface AttachmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (base64Url: string, filename: string) => void;
  onTakePhoto: () => void;
  onUploadScreenshot: (base64Url?: string, filename?: string) => void;
  onUploadFile: (filename: string) => void;
  onShareScreen: () => void;
  onStartVoice: () => void;
  isDark?: boolean;
}

const PRESET_SCREENSHOTS = [
  {
    id: 'crack',
    title: '📱 Cracked Screen Sample',
    desc: 'Display glass fracture & touch digitizer issue',
    url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80',
    filename: 'cracked_screen_screenshot.jpg'
  },
  {
    id: 'storage',
    title: '💾 Storage Full Warning',
    desc: 'Internal storage 98% full & app cache alert',
    url: 'https://images.unsplash.com/photo-1616469829941-c7200edec809?auto=format&fit=crop&w=600&q=80',
    filename: 'storage_warning_screenshot.jpg'
  },
  {
    id: 'battery',
    title: '🔋 Battery Thermal Alert',
    desc: 'High temperature & rapid drain warning',
    url: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=600&q=80',
    filename: 'battery_overheating_screenshot.jpg'
  }
];

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
  const screenshotInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  const [showScreenshotPicker, setShowScreenshotPicker] = useState(false);

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

  const handleScreenshotFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        onUploadScreenshot(reader.result as string, file.name);
        setShowScreenshotPicker(false);
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
        ref={screenshotInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleScreenshotFileChange}
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
        } shadow-2xl border-t border-slate-100 transition-all transform animate-in slide-in-from-bottom duration-300 max-h-[85vh] overflow-y-auto`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            {showScreenshotPicker ? 'Select Screenshot' : 'Add Attachment'}
          </h3>
          <button
            onClick={() => {
              setShowScreenshotPicker(false);
              onClose();
            }}
            aria-label="Close Attachment Menu"
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Screenshot Sub-Picker */}
        {showScreenshotPicker ? (
          <div className="mt-4 space-y-3">
            <button
              onClick={() => screenshotInputRef.current?.click()}
              className="w-full p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-between cursor-pointer hover:bg-blue-100/70"
            >
              <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-blue-900 dark:text-blue-100">
                    Upload from Device Gallery
                  </h4>
                  <p className="text-[11px] text-blue-700/80 dark:text-blue-300">
                    Choose any screenshot from your phone
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-blue-600" />
            </button>

            <span className="text-[11px] font-bold text-slate-400 block px-1 pt-1">
              OR Select Common Diagnostic Screenshot:
            </span>

            {PRESET_SCREENSHOTS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => {
                  onUploadScreenshot(preset.url, preset.filename);
                  setShowScreenshotPicker(false);
                  onClose();
                }}
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 flex items-center justify-between text-left hover:bg-slate-100/80 cursor-pointer"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {preset.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {preset.desc}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            ))}

            <button
              onClick={() => setShowScreenshotPicker(false)}
              className="w-full py-2.5 rounded-xl border text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer"
            >
              Back to Options
            </button>
          </div>
        ) : (
          /* 6 Actions Grid matching reference screenshot */
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
              onClick={() => setShowScreenshotPicker(true)}
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
        )}
      </div>
    </div>
  );
};
