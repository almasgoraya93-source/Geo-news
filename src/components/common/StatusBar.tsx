import React, { useState, useEffect } from 'react';
import { Wifi, Signal, Battery } from 'lucide-react';

interface StatusBarProps {
  batteryPct?: number;
  deviceInfo?: any;
  onOpenDeviceSwitcher?: () => void;
  isDark?: boolean;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  batteryPct = 78,
  deviceInfo,
  onOpenDeviceSwitcher,
  isDark = false
}) => {
  const [timeStr, setTimeStr] = useState('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      hours = hours % 12 || 12;
      setTimeStr(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const textColor = isDark ? 'text-white' : 'text-slate-900';

  return (
    <div className="w-full flex flex-col shrink-0 select-none z-30">
      {/* Top Status Indicators */}
      <div className={`w-full flex items-center justify-between px-6 pt-2 pb-1 ${textColor} text-xs font-semibold tracking-tight`}>
        {/* Time */}
        <span className="w-12 text-left">{timeStr}</span>

        {/* Front camera punch-hole */}
        <div className="w-3.5 h-3.5 rounded-full bg-black/90 ring-2 ring-slate-800/10 shadow-inner mx-auto -mt-0.5" />

        {/* Connectivity & Battery */}
        <div className="flex items-center gap-1.5 w-16 justify-end">
          <Signal className="w-3 h-3 stroke-[2.5]" />
          <Wifi className="w-3.5 h-3.5 stroke-[2.5]" />
          <span className="text-[11px] font-bold ml-0.5">{batteryPct}%</span>
          <div className="relative w-4 h-2.5 border-[1.5px] border-current rounded-xs flex items-center p-0.5 ml-0.5">
            <div
              className="h-full bg-current rounded-xs"
              style={{ width: `${Math.min(100, Math.max(10, batteryPct))}%` }}
            />
            <div className="absolute -right-1 top-0.5 w-0.5 h-1.5 bg-current rounded-r-xs" />
          </div>
        </div>
      </div>

      {/* Live Device & Android Version Top Strip */}
      {deviceInfo && (
        <button
          onClick={onOpenDeviceSwitcher}
          title="Click to detect or switch smartphone model"
          className="w-full flex items-center justify-between px-3.5 py-1 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-indigo-500/10 border-b border-blue-500/20 text-[10px] font-bold cursor-pointer transition-colors hover:bg-blue-500/20"
        >
          <div className="flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="text-blue-600 dark:text-blue-400 font-extrabold truncate">
              {deviceInfo.manufacturer} {deviceInfo.model}
            </span>
            <span className="text-slate-400 shrink-0">•</span>
            <span className="text-purple-600 dark:text-purple-400 shrink-0">
              Android {deviceInfo.androidVersion} ({deviceInfo.osName?.split(' ')[0] || 'HiOS'})
            </span>
          </div>

          <div className="flex items-center gap-1 text-[9px] text-emerald-600 dark:text-emerald-400 font-extrabold shrink-0 ml-1">
            <span>LIVE</span>
            <span className="animate-pulse">🟢</span>
          </div>
        </button>
      )}
    </div>
  );
};
