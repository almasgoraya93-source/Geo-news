import React, { useState } from 'react';
import {
  Bell,
  Settings,
  Smartphone,
  CheckCircle2,
  Battery,
  HardDrive,
  Cpu,
  Scan,
  Cpu as ChipIcon,
  Cog,
  MessageSquare,
  MonitorPlay
} from 'lucide-react';
import { QFixLogo } from '../common/QFixLogo.tsx';
import { FullScanModal } from './FullScanModal.tsx';
import { AppTab, DeviceInfo } from '../../types/index.ts';

interface HomeDashboardProps {
  deviceInfo: DeviceInfo;
  healthScore: number;
  conditionLabel: string;
  onNavigate: (tab: AppTab) => void;
  onOpenNotifications: () => void;
  isDark?: boolean;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  deviceInfo,
  healthScore = 86,
  conditionLabel = 'Good',
  onNavigate,
  onOpenNotifications,
  isDark = false
}) => {
  const [isScanning, setIsScanning] = useState(false);

  // SVG Circular progress math for Health Score
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (healthScore / 100) * circumference;

  return (
    <div className="w-full flex flex-col px-5 pt-2 pb-6 space-y-4">
      {/* Top Header */}
      <header className="flex items-center justify-between pt-1">
        <QFixLogo size={38} showText />

        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenNotifications}
            aria-label="Open notifications"
            className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer relative"
          >
            <Bell className="w-5 h-5 stroke-[1.8]" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse"></span>
          </button>

          <button
            onClick={() => onNavigate('settings')}
            aria-label="Open settings"
            className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <Settings className="w-5 h-5 stroke-[1.8]" />
          </button>
        </div>
      </header>

      {/* Device Info Card */}
      <section
        aria-label="Device Information"
        className={`w-full rounded-3xl p-4.5 border transition-all ${
          isDark
            ? 'bg-slate-800/80 border-slate-700/60 shadow-lg'
            : 'bg-white border-slate-100/90 shadow-[0_4px_24px_rgba(0,0,0,0.03)]'
        }`}
      >
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-700/50">
          <div className="flex items-center gap-3">
            {/* Phone Silhouette Frame with glow */}
            <div className="w-12 h-14 rounded-2xl bg-gradient-to-tr from-blue-100/80 via-purple-100/50 to-indigo-100/80 dark:from-blue-900/40 dark:to-purple-900/40 border border-blue-200/50 dark:border-blue-700/40 flex items-center justify-center p-1 relative shadow-inner">
              <Smartphone className="w-6 h-6 text-blue-600 dark:text-blue-400 stroke-[1.8]" />
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                {deviceInfo.model}
              </h2>
              <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold">
                <CheckCircle2 className="w-3 h-3 stroke-[2.5]" />
                <span>Good Condition</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mini stats: Battery, Storage, RAM */}
        <div className="mt-3.5 pt-1">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-semibold">
              <Battery className="w-4 h-4 text-blue-600" />
              <span>Battery</span>
              <span className="text-slate-900 dark:text-white font-extrabold ml-1">
                {deviceInfo.batteryPercentage}%
              </span>
            </div>

            <div className="flex items-center gap-4 text-[11px] font-medium text-slate-500 dark:text-slate-400">
              <span>
                Storage <strong className="text-slate-800 dark:text-slate-200 ml-1">{deviceInfo.storagePercentage}%</strong>
              </span>
              <span>
                RAM <strong className="text-slate-800 dark:text-slate-200 ml-1">{deviceInfo.ramPercentage}%</strong>
              </span>
            </div>
          </div>

          {/* Battery gradient bar matching screenshot */}
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
              style={{ width: `${deviceInfo.batteryPercentage}%` }}
            />
          </div>
        </div>
      </section>

      {/* Phone Health Score Card */}
      <section
        aria-label="Phone Health Score"
        className={`w-full rounded-3xl p-4 border flex items-center gap-4 transition-all ${
          isDark
            ? 'bg-slate-800/80 border-slate-700/60 shadow-lg'
            : 'bg-white border-slate-100/90 shadow-[0_4px_24px_rgba(0,0,0,0.03)]'
        }`}
      >
        {/* Circular Progress Gauge matching screenshot */}
        <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
            {/* Background track circle */}
            <circle
              cx="40"
              cy="40"
              r={radius}
              fill="transparent"
              stroke="#E2E8F0"
              strokeWidth="6"
              className="dark:stroke-slate-700"
            />
            {/* Animated Teal/Cyan/Blue Gradient Ring */}
            <circle
              cx="40"
              cy="40"
              r={radius}
              fill="transparent"
              stroke="url(#scoreGrad)"
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06B6D4" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute flex flex-col items-center justify-center leading-none">
            <span className="text-[21px] font-black tracking-tight text-slate-900 dark:text-white">
              {healthScore}
            </span>
            <span className="text-[10px] font-medium text-slate-400 mt-0.5">
              /100
            </span>
          </div>
        </div>

        {/* Score Details */}
        <div className="flex-1 min-w-0">
          <span className="text-[11px] font-medium text-slate-400 block mb-0.5">
            Phone Health Score
          </span>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 stroke-[2.5]" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {conditionLabel}
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">
            Your device is working well.
          </p>
        </div>
      </section>

      {/* Main Action: Full Scan Button */}
      <button
        onClick={() => setIsScanning(true)}
        className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.98]"
      >
        <Scan className="w-5 h-5 stroke-[2.2]" />
        <span>Full Scan</span>
      </button>

      {/* 4 Feature Action Cards (2x2 Grid) */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        {/* 1. Hardware Test */}
        <button
          onClick={() => onNavigate('hardware')}
          className={`p-4 rounded-3xl border text-left transition-all hover:scale-[1.01] cursor-pointer ${
            isDark
              ? 'bg-slate-800/80 border-slate-700/60 hover:bg-slate-800'
              : 'bg-white border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:border-blue-100 hover:shadow-md'
          }`}
        >
          <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2.5">
            <ChipIcon className="w-5 h-5 stroke-[2]" />
          </div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
            Hardware Test
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
            Check physical parts
          </p>
        </button>

        {/* 2. Software Check */}
        <button
          onClick={() => onNavigate('software')}
          className={`p-4 rounded-3xl border text-left transition-all hover:scale-[1.01] cursor-pointer ${
            isDark
              ? 'bg-slate-800/80 border-slate-700/60 hover:bg-slate-800'
              : 'bg-white border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:border-purple-100 hover:shadow-md'
          }`}
        >
          <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2.5">
            <Cog className="w-5 h-5 stroke-[2]" />
          </div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
            Software Check
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
            Check system & apps
          </p>
        </button>

        {/* 3. AI Chat Board */}
        <button
          onClick={() => onNavigate('chat')}
          className={`p-4 rounded-3xl border text-left transition-all hover:scale-[1.01] cursor-pointer ${
            isDark
              ? 'bg-slate-800/80 border-slate-700/60 hover:bg-slate-800'
              : 'bg-white border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:border-blue-100 hover:shadow-md'
          }`}
        >
          <div className="w-10 h-10 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-2.5">
            <MessageSquare className="w-5 h-5 stroke-[2]" />
          </div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
            AI Chat Board
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
            Ask anything
          </p>
        </button>

        {/* 4. Live Screen Analysis */}
        <button
          onClick={() => onNavigate('live')}
          className={`p-4 rounded-3xl border text-left transition-all hover:scale-[1.01] cursor-pointer ${
            isDark
              ? 'bg-slate-800/80 border-slate-700/60 hover:bg-slate-800'
              : 'bg-white border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:border-purple-100 hover:shadow-md'
          }`}
        >
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2.5">
            <MonitorPlay className="w-5 h-5 stroke-[2]" />
          </div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
            Live Screen Analysis
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
            Share & get AI help
          </p>
        </button>
      </div>

      {/* Full Scan Interactive Modal */}
      <FullScanModal
        isOpen={isScanning}
        onClose={() => setIsScanning(false)}
        onComplete={() => {
          setIsScanning(false);
          onNavigate('reports');
        }}
        isDark={isDark}
      />
    </div>
  );
};
