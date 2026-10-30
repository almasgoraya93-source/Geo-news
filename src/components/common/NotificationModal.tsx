import React from 'react';
import { X, Bell, BatteryCharging, AlertTriangle, ShieldCheck, HardDrive } from 'lucide-react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark?: boolean;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  isDark = false
}) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: '1',
      title: 'Battery Health Optimal',
      time: '10 min ago',
      desc: 'Battery is at 78% capacity with safe operating temperature (31.4°C).',
      icon: BatteryCharging,
      color: 'text-emerald-500 bg-emerald-50'
    },
    {
      id: '2',
      title: 'Cache Buildup Detected',
      time: '2 hours ago',
      desc: 'Temporary app caches have accumulated 3.4 GB. You can safely clear it.',
      icon: HardDrive,
      color: 'text-amber-500 bg-amber-50'
    },
    {
      id: '3',
      title: 'Security Definitions Verified',
      time: 'Yesterday',
      desc: 'Google Play System update and Android security patch are current.',
      icon: ShieldCheck,
      color: 'text-blue-500 bg-blue-50'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className={`w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'} shadow-2xl border border-slate-100 max-h-[85vh] overflow-y-auto`}>
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Notifications</h3>
              <p className="text-xs text-slate-500">Device alerts and health updates</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Notifications"
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {notifications.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                  isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50/70 border-slate-100 hover:border-slate-200'
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${item.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-800">{item.title}</span>
                    <span className="text-[10px] text-slate-400">{item.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-5 py-3 rounded-2xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 cursor-pointer transition-colors"
        >
          Dismiss All
        </button>
      </div>
    </div>
  );
};
