import React, { useEffect, useState } from 'react';
import { Bell, X, CheckCircle2, AlertTriangle, ShieldCheck, Zap, ChevronRight } from 'lucide-react';
import { QFixLogo } from './QFixLogo.tsx';

export interface TopAlert {
  id: string;
  title: string;
  message: string;
  type?: 'success' | 'warning' | 'info' | 'battery';
  timestamp?: string;
}

interface TopNotificationBannerProps {
  alert: TopAlert | null;
  deviceModel: string;
  androidVersion: string;
  manufacturer: string;
  onDismiss: () => void;
  onOpenNotifications: () => void;
  isDark?: boolean;
}

export const TopNotificationBanner: React.FC<TopNotificationBannerProps> = ({
  alert,
  deviceModel,
  androidVersion,
  manufacturer,
  onDismiss,
  onOpenNotifications,
  isDark = false
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (alert) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onDismiss, 300);
      }, 5500);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [alert, onDismiss]);

  if (!alert && !isVisible) return null;

  const getAlertIcon = () => {
    switch (alert?.type) {
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />;
      case 'battery':
        return <Zap className="w-4 h-4 text-emerald-500 shrink-0" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />;
    }
  };

  return (
    <div
      className={`absolute top-11 left-3 right-3 z-50 transition-all duration-300 ease-out transform ${
        isVisible ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-6 opacity-0 scale-95 pointer-events-none'
      }`}
    >
      <div
        className={`w-full rounded-2xl p-3.5 shadow-2xl border backdrop-blur-md transition-all ${
          isDark
            ? 'bg-slate-900/95 text-white border-slate-700/80 shadow-[0_15px_30px_rgba(0,0,0,0.5)]'
            : 'bg-white/95 text-slate-900 border-slate-200/90 shadow-[0_15px_35px_rgba(0,0,0,0.12)]'
        }`}
      >
        {/* Top App Header inside Notification */}
        <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
          <div className="flex items-center gap-1.5">
            <QFixLogo size={16} />
            <span className="font-bold text-slate-700 dark:text-slate-200">Q Fix AI</span>
            <span>•</span>
            <span className="text-blue-600 dark:text-blue-400 font-bold">{manufacturer} {deviceModel}</span>
            <span>•</span>
            <span className="text-purple-600 dark:text-purple-400">Android {androidVersion}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[9px] text-slate-400">Now</span>
            <button
              onClick={() => {
                setIsVisible(false);
                setTimeout(onDismiss, 200);
              }}
              aria-label="Dismiss alert"
              className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Notification Body */}
        <div
          onClick={onOpenNotifications}
          className="mt-2 flex items-start gap-2.5 cursor-pointer hover:opacity-90 transition-opacity"
        >
          <div className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 mt-0.5">
            {getAlertIcon()}
          </div>

          <div className="flex-1 min-w-0 text-left">
            <h4 className="text-xs font-extrabold text-slate-900 dark:text-white leading-snug">
              {alert?.title}
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium leading-relaxed line-clamp-2 mt-0.5">
              {alert?.message}
            </p>
          </div>

          <div className="self-center p-1 text-slate-400 shrink-0">
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};
