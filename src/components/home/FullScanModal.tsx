import React, { useState, useEffect } from 'react';
import { CheckCircle2, Loader2, Sparkles, X, ShieldAlert } from 'lucide-react';

interface FullScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  isDark?: boolean;
}

const SCAN_STEPS = [
  { name: 'Auditing Battery & Thermal Regulators', icon: '🔋', category: 'Battery' },
  { name: 'Inspecting OLED / Touch Digitizer Sub-pixels', icon: '📱', category: 'Display' },
  { name: 'Calibrating Stereo Speakers & Dual Mics', icon: '🔊', category: 'Audio' },
  { name: 'Testing Optical Image Stabilization & Sensors', icon: '📸', category: 'Camera' },
  { name: 'Validating Accelerometer, Gyro & Compass', icon: '🧭', category: 'Sensors' },
  { name: 'Auditing Wi-Fi 5GHz & Mobile 5G Baseband', icon: '📶', category: 'Connectivity' },
  { name: 'Running CPU Core Stress & Memory IOPS', icon: '⚙️', category: 'Hardware' },
  { name: 'Scanning Android 14 Security Definitions', icon: '🛡️', category: 'Software' },
];

export const FullScanModal: React.FC<FullScanModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  isDark = false
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(10);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStepIndex(0);
      setProgress(10);
      setIsFinished(false);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < SCAN_STEPS.length - 1) {
          const next = prev + 1;
          setProgress(Math.round(((next + 1) / SCAN_STEPS.length) * 100));
          return next;
        } else {
          clearInterval(interval);
          setProgress(100);
          setIsFinished(true);
          return prev;
        }
      });
    }, 450);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className={`w-full max-w-sm rounded-3xl p-6 ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'} shadow-2xl border border-slate-100 flex flex-col items-center text-center relative`}>
        <button
          onClick={onClose}
          aria-label="Cancel Scan"
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Circular Scanning Radar Graphic */}
        <div className="relative w-28 h-28 my-4 flex items-center justify-center">
          {/* Outer pulsating ring */}
          <div className="absolute inset-0 rounded-full border-2 border-blue-500/20 animate-ping opacity-60"></div>
          <div className="absolute -inset-2 rounded-full border border-purple-500/30 animate-pulse"></div>

          {/* Rotating scanner beam */}
          <div
            className="w-24 h-24 rounded-full border-4 border-t-blue-600 border-r-purple-600 border-b-emerald-400 border-l-transparent animate-spin"
            style={{ animationDuration: '1.2s' }}
          ></div>

          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {progress}%
            </span>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              Scanning
            </span>
          </div>
        </div>

        <h3 className="text-lg font-bold mt-1">
          {isFinished ? 'Full Scan Complete!' : 'Analyzing Device Health...'}
        </h3>
        <p className="text-xs text-slate-500 mt-1 max-w-[240px]">
          {isFinished
            ? 'All 22 hardware and 16 software parameters inspected.'
            : SCAN_STEPS[currentStepIndex]?.name}
        </p>

        {/* Diagnostic Steps List */}
        <div className="w-full mt-5 space-y-2 text-left bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-700/60 text-xs">
          {SCAN_STEPS.slice(0, 4).map((step, idx) => {
            const isDone = currentStepIndex > idx || isFinished;
            const isCurrent = currentStepIndex === idx && !isFinished;
            return (
              <div key={step.name} className="flex items-center justify-between py-1">
                <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium truncate pr-2">
                  <span>{step.icon}</span>
                  <span className="truncate">{step.category}</span>
                </span>
                {isDone ? (
                  <span className="flex items-center gap-1 text-emerald-600 font-semibold text-[11px] shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Good
                  </span>
                ) : isCurrent ? (
                  <span className="flex items-center gap-1 text-blue-600 font-medium text-[11px] shrink-0">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Testing...
                  </span>
                ) : (
                  <span className="text-slate-400 text-[11px] shrink-0">Pending</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        {isFinished ? (
          <button
            onClick={onComplete}
            className="w-full mt-5 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm shadow-md hover:opacity-95 cursor-pointer transition-opacity"
          >
            View Diagnostic Report
          </button>
        ) : (
          <div className="w-full mt-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 font-medium text-xs">
            Please wait while Q Fix AI tests hardware & software...
          </div>
        )}
      </div>
    </div>
  );
};
