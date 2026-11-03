import React from 'react';
import { X, Bell, BatteryCharging, AlertTriangle, ShieldCheck, HardDrive, Download } from 'lucide-react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  deviceInfo?: any;
  onTriggerAlert?: (alert: any) => void;
  isDark?: boolean;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  deviceInfo,
  onTriggerAlert,
  isDark = false
}) => {
  if (!isOpen) return null;

  const modelName = deviceInfo?.model || 'Tecno One (Spark 20)';
  const batteryLevel = deviceInfo?.batteryPercentage ?? 82;
  const temp = deviceInfo?.batteryTemperature ?? 31.4;

  const notifications = [
    {
      id: '0',
      title: '📦 Android APK Ready to Install',
      time: 'New',
      desc: `QFixAI-v1.0.0-debug.apk (2.9 MB) is compiled for Android ${deviceInfo?.androidVersion || '14'} devices. Tap below to download.`,
      icon: Download,
      color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/60'
    },
    {
      id: '1',
      title: 'Battery Health Optimal',
      time: 'Just now',
      desc: `${modelName} battery is at ${batteryLevel}% capacity with safe operating temperature (${temp}°C).`,
      icon: BatteryCharging,
      color: 'text-emerald-500 bg-emerald-50'
    },
    {
      id: '2',
      title: 'Cache Buildup Detected',
      time: '1 hour ago',
      desc: `Temporary app caches have accumulated 3.2 GB on ${modelName}. Tap to clean.`,
      icon: HardDrive,
      color: 'text-amber-500 bg-amber-50'
    },
    {
      id: '3',
      title: 'Security Definitions Verified',
      time: 'Today',
      desc: `Google Play System update and Android ${deviceInfo?.androidVersion || '14'} security patch are current.`,
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

        {/* Test Live Notification Button */}
        {onTriggerAlert && (
          <button
            onClick={() => {
              onClose();
              onTriggerAlert({
                id: 'test-' + Date.now(),
                title: '⚡ Live Diagnostic Health Update',
                message: `${modelName} (Android ${deviceInfo?.androidVersion || '14'}): Battery ${batteryLevel}%, Temperature ${temp}°C, all 22 sensors operating in good condition.`,
                type: 'battery'
              });
            }}
            className="w-full mt-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm hover:from-blue-700 hover:to-indigo-700"
          >
            <span>🔔 Send Live Test Alert (لائیو ٹیسਟ الرٹ بھیجیں)</span>
          </button>
        )}

        {/* Direct APK Download Link */}
        <a
          href="/app-debug.apk"
          download="QFixAI-v1.0.0-debug.apk"
          className="w-full mt-3 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/20 hover:from-emerald-700 hover:to-teal-700 transition-all text-center"
        >
          <Download className="w-4 h-4 stroke-[2.2]" />
          <span>📥 Download Android APK (2.9 MB)</span>
        </a>

        <button
          onClick={onClose}
          className="w-full mt-2.5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs hover:bg-slate-200 cursor-pointer transition-colors"
        >
          Dismiss All
        </button>
      </div>
    </div>
  );
};
