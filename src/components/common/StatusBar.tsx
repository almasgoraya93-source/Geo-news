import React, { useState, useEffect } from 'react';
import { Wifi, Signal, Battery } from 'lucide-react';

interface StatusBarProps {
  batteryPct?: number;
  isDark?: boolean;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  batteryPct = 78,
  isDark = false
}) => {
  const [timeStr, setTimeStr] = useState('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      // Format as 12-hour or standard
      hours = hours % 12 || 12;
      setTimeStr(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const textColor = isDark ? 'text-white' : 'text-slate-900';

  return (
    <div className={`w-full flex items-center justify-between px-6 pt-2 pb-1.5 select-none ${textColor} text-xs font-semibold tracking-tight z-30`}>
      {/* Time */}
      <span className="w-12 text-left">{timeStr}</span>

      {/* Front camera punch-hole */}
      <div className="w-3.5 h-3.5 rounded-full bg-black/90 ring-2 ring-slate-800/10 shadow-inner mx-auto -mt-0.5"></div>

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
  );
};
