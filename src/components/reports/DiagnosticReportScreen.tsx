import React, { useState } from 'react';
import {
  ChevronLeft,
  Share2,
  Check,
  Battery,
  Monitor,
  Volume2,
  Camera,
  Shield,
  Wifi,
  Cpu,
  Cog,
  Download,
  Trash2,
  FileText,
  Calendar,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { DeviceInfo } from '../../types/index.ts';

interface DiagnosticReportScreenProps {
  deviceInfo: DeviceInfo;
  healthScore: number;
  conditionLabel: string;
  onBack: () => void;
  isDark?: boolean;
}

export const DiagnosticReportScreen: React.FC<DiagnosticReportScreenProps> = ({
  deviceInfo,
  healthScore = 86,
  conditionLabel = 'Good Condition',
  onBack,
  isDark = false
}) => {
  const [showFullExportModal, setShowFullExportModal] = useState(false);
  const [reportHistory, setReportHistory] = useState([
    {
      id: 'rep-today',
      date: 'Today, 09:41 AM',
      score: 86,
      condition: 'Good Condition'
    },
    {
      id: 'rep-prev',
      date: 'Oct 24, 2026, 04:15 PM',
      score: 84,
      condition: 'Good Condition'
    }
  ]);

  // Circular score progress math
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (healthScore / 100) * circumference;

  const testResultsList = [
    {
      name: 'Battery',
      status: 'Good',
      icon: Battery,
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60'
    },
    {
      name: 'Display',
      status: 'Good',
      icon: Monitor,
      color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-950/60'
    },
    {
      name: 'Audio',
      status: 'Good',
      icon: Volume2,
      color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/60'
    },
    {
      name: 'Camera',
      status: 'Good',
      icon: Camera,
      color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/60'
    },
    {
      name: 'Sensors',
      status: 'Good',
      icon: Shield,
      color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-950/60'
    },
    {
      name: 'Connectivity',
      status: 'Good',
      icon: Wifi,
      color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/60'
    },
    {
      name: 'Hardware',
      status: 'Good',
      icon: Cpu,
      color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/60'
    },
    {
      name: 'Software',
      status: 'Good',
      icon: Cog,
      color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/60'
    }
  ];

  const handleExportPDF = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Q Fix AI Diagnostic Report',
        text: `Device: ${deviceInfo.model} | Score: ${healthScore}/100 (${conditionLabel}) | All hardware tests passed.`
      });
    } else {
      navigator.clipboard.writeText(`Q Fix AI Report - ${deviceInfo.model}: ${healthScore}/100 Good Condition`);
      alert('Report summary copied to clipboard.');
    }
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
            Diagnostic Report
          </h2>
        </div>

        <button
          onClick={handleShare}
          aria-label="Share report"
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
        >
          <Share2 className="w-5 h-5 stroke-[1.8]" />
        </button>
      </header>

      {/* Main Scroll Content */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {/* Top Score Card matching Screenshot 7 */}
        <section
          aria-label="Health Score Summary"
          className={`w-full rounded-3xl p-5 border flex items-center gap-5 ${
            isDark
              ? 'bg-slate-800/80 border-slate-700/60 shadow-lg'
              : 'bg-white border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.03)]'
          }`}
        >
          {/* Circular Progress Ring */}
          <div className="relative w-22 h-22 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
              <circle
                cx="40"
                cy="40"
                r={radius}
                fill="transparent"
                stroke="#E2E8F0"
                strokeWidth="6"
                className="dark:stroke-slate-700"
              />
              <circle
                cx="40"
                cy="40"
                r={radius}
                fill="transparent"
                stroke="url(#reportGrad)"
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="reportGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06B6D4" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
            </svg>

            <div className="absolute flex flex-col items-center justify-center leading-none">
              <span className="text-[23px] font-black tracking-tight text-slate-900 dark:text-white">
                {healthScore}
              </span>
              <span className="text-[10px] font-medium text-slate-400 mt-0.5">
                /100
              </span>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-emerald-600 dark:text-emerald-400 leading-tight">
              Good Condition
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">
              Your device is working well.
            </p>
          </div>
        </section>

        {/* Section Heading: Test Results */}
        <div className="pt-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2.5">
            Test Results
          </h3>

          <div
            className={`rounded-3xl border divide-y overflow-hidden ${
              isDark
                ? 'bg-slate-800/80 border-slate-700 divide-slate-700/60'
                : 'bg-white border-slate-100 divide-slate-100 shadow-[0_2px_16px_rgba(0,0,0,0.02)]'
            }`}
          >
            {testResultsList.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.name}
                  className="px-4 py-3 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${item.color}`}>
                      <Icon className="w-4 h-4 stroke-[2]" />
                    </div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {item.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Good</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Floating "View Full Report" Button matching Screenshot 7 */}
      <div className="p-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 sticky bottom-0 z-20">
        <button
          onClick={() => setShowFullExportModal(true)}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
        >
          <span>View Full Report</span>
        </button>
      </div>

      {/* Full Report Details & Export Modal */}
      {showFullExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className={`w-full max-w-sm rounded-3xl p-6 ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'} shadow-2xl border border-slate-100 text-left max-h-[85vh] overflow-y-auto`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-sm">Full Diagnostic Report</h3>
              </div>
              <button
                onClick={() => setShowFullExportModal(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3.5 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-800 dark:text-slate-100">
                    {deviceInfo.manufacturer} {deviceInfo.model}
                  </span>
                  <span className="text-[10px] text-slate-400">Android 14</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                  <div>Battery: <strong>{deviceInfo.batteryPercentage}% (Good)</strong></div>
                  <div>Temperature: <strong>31.4°C</strong></div>
                  <div>Storage: <strong>62% Used</strong></div>
                  <div>RAM: <strong>48% Used</strong></div>
                </div>
              </div>

              {/* Action Buttons: Export PDF, Share */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  onClick={handleExportPDF}
                  className="p-3 rounded-2xl bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-blue-100 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Export PDF</span>
                </button>
                <button
                  onClick={handleShare}
                  className="p-3 rounded-2xl bg-purple-50 text-purple-700 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-purple-100 cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>

              {/* Scan History */}
              <div className="pt-2">
                <span className="font-bold text-slate-800 dark:text-slate-200 block mb-2">
                  Scan History
                </span>
                <div className="space-y-2">
                  {reportHistory.map((rep) => (
                    <div
                      key={rep.id}
                      className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]"
                    >
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{rep.date}</span>
                      </div>
                      <span className="font-bold text-emerald-600">
                        {rep.score}/100
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowFullExportModal(false)}
              className="w-full mt-2 py-3 rounded-2xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
