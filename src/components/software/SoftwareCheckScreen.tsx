import React, { useState } from 'react';
import {
  ChevronLeft,
  MoreVertical,
  ChevronRight,
  Play,
  Cpu,
  HardDrive,
  Wifi,
  ShieldCheck,
  RefreshCw,
  Layers,
  Activity,
  CheckCircle2,
  X,
  AlertCircle
} from 'lucide-react';
import { DiagnosticTestItem } from '../../types/index.ts';

interface SoftwareCheckScreenProps {
  checks: DiagnosticTestItem[];
  onBack: () => void;
  onRunOptimization: () => void;
  isDark?: boolean;
}

// Map software icons
function getSoftwareIcon(id: string) {
  switch (id) {
    case 'sw-android-version':
      return { icon: ShieldCheck, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/60' };
    case 'sw-ram-usage':
      return { icon: Layers, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/60' };
    case 'sw-storage-analysis':
    case 'sw-storage-warning':
      return { icon: HardDrive, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/60' };
    case 'sw-cpu-info':
    case 'sw-system-perf':
      return { icon: Cpu, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/60' };
    case 'sw-app-crash':
    case 'sw-background-apps':
    case 'sw-battery-drain':
    case 'sw-app-performance':
      return { icon: Activity, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/60' };
    case 'sw-app-permissions':
      return { icon: ShieldCheck, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60' };
    case 'sw-internet-test':
    case 'sw-wifi-diag':
    case 'sw-bluetooth-diag':
    case 'sw-mobile-network':
      return { icon: Wifi, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/60' };
    case 'sw-system-update':
      return { icon: RefreshCw, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/60' };
    default:
      return { icon: Activity, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/60' };
  }
}

export const SoftwareCheckScreen: React.FC<SoftwareCheckScreenProps> = ({
  checks,
  onBack,
  onRunOptimization,
  isDark = false
}) => {
  const [selectedItem, setSelectedItem] = useState<DiagnosticTestItem | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleStartCheck = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setSuccessToast('Software check complete: System health is optimal.');
      setTimeout(() => setSuccessToast(null), 3500);
    }, 1200);
  };

  return (
    <div className={`w-full flex flex-col h-[calc(100vh-64px)] max-w-md mx-auto relative ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
      {/* Top Header matching reference */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            aria-label="Back to dashboard"
            className="p-1.5 -ml-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2]" />
          </button>

          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Software Check
          </h2>
        </div>

        <button
          onClick={handleStartCheck}
          aria-label="More options"
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
        >
          <MoreVertical className="w-5 h-5 stroke-[1.8]" />
        </button>
      </header>

      {/* Toast Notice */}
      {successToast && (
        <div className="mx-4 mt-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Software Checks Scroll List matching screenshot */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1">
        {checks.map((item) => {
          const { icon: Icon, color } = getSoftwareIcon(item.id);

          return (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className={`w-full p-3 rounded-2xl flex items-center justify-between transition-all cursor-pointer ${
                isDark
                  ? 'hover:bg-slate-800 border-b border-slate-800/80'
                  : 'hover:bg-slate-50 border-b border-slate-100/70'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Colored squircle icon */}
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${color}`}>
                  <Icon className="w-5 h-5 stroke-[2]" />
                </div>

                <div className="text-left min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {item.name}
                  </h4>
                  <p className="text-[11px] font-semibold text-slate-400 mt-0.5 truncate">
                    {item.statusLabel}
                  </p>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
            </div>
          );
        })}
      </div>

      {/* Bottom Floating Start Check Button matching reference */}
      <div className="p-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 sticky bottom-0 z-20">
        <button
          onClick={handleStartCheck}
          disabled={isScanning}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] disabled:opacity-50"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>{isScanning ? 'Auditing System...' : 'Start Check'}</span>
        </button>
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`w-full max-w-sm rounded-3xl p-6 ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'} shadow-2xl border border-slate-100 text-left`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm">{selectedItem.name}</h3>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <span className="text-slate-400 block mb-0.5">Status Value:</span>
                <strong className="text-slate-900 dark:text-white text-sm">
                  {selectedItem.statusLabel}
                </strong>
              </div>

              <div>
                <strong className="text-slate-800 dark:text-slate-200 block mb-1">
                  System Detail:
                </strong>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedItem.description}
                </p>
              </div>

              {selectedItem.measuredResult && (
                <div className="p-3 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 text-blue-900 dark:text-blue-200">
                  <strong className="block mb-1">Audit Metric:</strong>
                  <span>{selectedItem.measuredResult}</span>
                </div>
              )}

              {selectedItem.recommendation && (
                <div className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-900 dark:text-emerald-200">
                  <strong className="block mb-1">AI Recommendation:</strong>
                  <span>{selectedItem.recommendation}</span>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedItem(null)}
              className="w-full mt-2 py-3 rounded-2xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 cursor-pointer"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
