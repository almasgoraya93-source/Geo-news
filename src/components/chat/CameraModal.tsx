import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw, Check } from 'lucide-react';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (base64Img: string) => void;
  isDark?: boolean;
}

export const CameraModal: React.FC<CameraModalProps> = ({
  isOpen,
  onClose,
  onCapture,
  isDark = false
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  useEffect(() => {
    if (!isOpen) {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
      return;
    }

    let activeStream: MediaStream | null = null;

    async function initCamera() {
      try {
        setErrorMsg(null);
        const s = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: facingMode } },
          audio: false
        });
        activeStream = s;
        setStream(s);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          videoRef.current.play();
        }
      } catch (err: any) {
        console.warn('Camera access issue:', err);
        setErrorMsg('Camera access is not permitted or unavailable. You can use simulated photo capture.');
      }
    }

    initCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [isOpen, facingMode]);

  if (!isOpen) return null;

  const handleSnap = () => {
    if (videoRef.current && stream) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        onCapture(dataUrl);
        onClose();
        return;
      }
    }

    // Fallback: draw simulated diagnostic test frame
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(0, 0, 640, 480);
      ctx.fillStyle = '#38BDF8';
      ctx.font = '24px sans-serif';
      ctx.fillText('Q Fix AI Camera Capture', 40, 60);
      ctx.strokeStyle = '#EF4444';
      ctx.lineWidth = 4;
      // draw cracked line
      ctx.beginPath();
      ctx.moveTo(100, 100);
      ctx.lineTo(240, 220);
      ctx.lineTo(300, 180);
      ctx.lineTo(450, 360);
      ctx.stroke();
      const fallbackUrl = canvas.toDataURL('image/jpeg');
      onCapture(fallbackUrl);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className={`w-full max-w-md rounded-3xl overflow-hidden ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'} shadow-2xl relative flex flex-col`}>
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-sm">Take Diagnostic Photo</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Viewport */}
        <div className="relative aspect-4/3 bg-black flex items-center justify-center overflow-hidden">
          {errorMsg ? (
            <div className="p-6 text-center text-slate-300 text-xs">
              <p className="mb-3">{errorMsg}</p>
              <button
                onClick={handleSnap}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold text-xs"
              >
                Use Diagnostic Snapshot Sample
              </button>
            </div>
          ) : (
            <video
              ref={videoRef}
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          )}

          {/* Switch Camera Button */}
          {!errorMsg && (
            <button
              onClick={() => setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'))}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/50 text-white backdrop-blur-md hover:bg-black/70 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Footer controls */}
        <div className="p-4 flex items-center justify-center gap-4 bg-slate-50 dark:bg-slate-800">
          <button
            onClick={handleSnap}
            className="w-16 h-16 rounded-full border-4 border-white shadow-lg bg-red-600 hover:bg-red-700 flex items-center justify-center cursor-pointer transition-transform active:scale-95"
            aria-label="Capture Photo"
          >
            <div className="w-6 h-6 rounded-full bg-white"></div>
          </button>
        </div>
      </div>
    </div>
  );
};
