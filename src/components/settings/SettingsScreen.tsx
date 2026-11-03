import React, { useState } from 'react';
import {
  ChevronLeft,
  Search,
  ChevronRight,
  Palette,
  Sparkles,
  MonitorPlay,
  Activity,
  ShieldCheck,
  Bell,
  HardDrive,
  HelpCircle,
  Check,
  Moon,
  Sun,
  Lock,
  Volume2,
  Trash2,
  Info,
  Globe,
  Sliders,
  Cpu,
  Smartphone,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Download
} from 'lucide-react';
import { QFixLogo } from '../common/QFixLogo.tsx';
import { DeviceSwitcherModal } from '../home/DeviceSwitcherModal.tsx';
import { AppSettings, Language, DeviceInfo } from '../../types/index.ts';

interface SettingsScreenProps {
  settings: AppSettings;
  deviceInfo?: DeviceInfo;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onUpdateDevice?: (device: DeviceInfo) => void;
  onOpenNotifications?: () => void;
  onNavigate?: (tab: any) => void;
  onBack: () => void;
  isDark?: boolean;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  deviceInfo,
  onUpdateSettings,
  onUpdateDevice,
  onOpenNotifications,
  onNavigate,
  onBack,
  isDark = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [isDeviceSwitcherOpen, setIsDeviceSwitcherOpen] = useState(false);
  const [cacheClearedToast, setCacheClearedToast] = useState(false);
  const [testNotificationToast, setTestNotificationToast] = useState(false);

  // Notification toggles
  const [notifyHardware, setNotifyHardware] = useState(true);
  const [notifyBattery, setNotifyBattery] = useState(true);
  const [notifyStorage, setNotifyStorage] = useState(true);
  const [notifySound, setNotifySound] = useState(true);

  // Diagnostics toggles
  const [deepDiagnosticScan, setDeepDiagnosticScan] = useState(true);
  const [autoRamClean, setAutoRamClean] = useState(false);

  // Live screen quality
  const [screenRes, setScreenRes] = useState<'1080p' | '720p'>('1080p');
  const [aiVoiceFeedback, setAiVoiceFeedback] = useState(true);

  const handleClearCache = () => {
    localStorage.removeItem('qfix_temp_cache');
    setCacheClearedToast(true);
    setTimeout(() => setCacheClearedToast(false), 3000);
  };

  const handleTriggerTestNotification = () => {
    setTestNotificationToast(true);
    setTimeout(() => setTestNotificationToast(false), 3500);
    if (onOpenNotifications) {
      setTimeout(() => onOpenNotifications(), 600);
    }
  };

  const settingsList = [
    {
      id: 'appearance',
      title: 'Appearance',
      subtitle: `${settings.theme === 'dark' ? 'Dark' : settings.theme === 'light' ? 'Light' : 'System'} mode, Theme, Font`,
      icon: Palette,
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/60'
    },
    {
      id: 'ai-assistant',
      title: 'AI Assistant',
      subtitle: `${settings.language === 'pa' ? 'Punjabi' : settings.language === 'ur' ? 'Urdu' : 'English'}, Voice, Response`,
      icon: Sparkles,
      color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/60'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      subtitle: 'Alerts, Sound, Vibration, Push',
      icon: Bell,
      color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/60'
    },
    {
      id: 'diagnostics',
      title: 'Diagnostics',
      subtitle: 'Hardware, Software, Battery Health',
      icon: Activity,
      color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60'
    },
    {
      id: 'live-screen',
      title: 'Live Screen',
      subtitle: 'Screen sharing, AI Frame Inspection',
      icon: MonitorPlay,
      color: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-950/60'
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      subtitle: 'Microphone, Camera, Permissions',
      icon: ShieldCheck,
      color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60'
    },
    {
      id: 'storage-data',
      title: 'Storage & Data',
      subtitle: 'Cache, Reports, Data Usage',
      icon: HardDrive,
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/60'
    },
    {
      id: 'more',
      title: 'Device Specs & About',
      subtitle: 'Model, Android Version, Hardware Info',
      icon: HelpCircle,
      color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/60'
    }
  ];

  const filteredSettings = settingsList.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`w-full flex flex-col h-[calc(100vh-64px)] max-w-md mx-auto relative ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
      {/* Top Header matching Screenshot 10 */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 sticky top-0 z-20">
        <div className="flex items-center gap-1">
          <button
            onClick={onBack}
            aria-label="Back to dashboard"
            className="p-1.5 -ml-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer mr-1"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2]" />
          </button>

          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Settings
          </h2>
        </div>

        {onOpenNotifications && (
          <button
            onClick={onOpenNotifications}
            aria-label="Open notifications"
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
          >
            <Bell className="w-5 h-5 stroke-[1.8]" />
          </button>
        )}
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {/* Search Settings Bar matching screenshot */}
        <div className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search settings..."
            className="flex-1 bg-transparent border-none outline-hidden text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
          />
        </div>

        {/* App Version Info Card matching Screenshot 10 */}
        <div
          onClick={() => setActiveModal('more')}
          className={`p-4 rounded-3xl border flex items-center justify-between transition-all cursor-pointer ${
            isDark
              ? 'bg-slate-800/80 border-slate-700/60 hover:bg-slate-800'
              : 'bg-white border-slate-100/90 shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:border-blue-100'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <QFixLogo size={36} />
            <div className="text-left">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                Q Fix AI Assistant
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">
                Version 1.0.0 (Production Build)
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        {/* Android APK Download Card */}
        <div className={`p-4 rounded-3xl border transition-all ${
          isDark
            ? 'bg-gradient-to-r from-blue-950/60 to-purple-950/60 border-blue-800/40'
            : 'bg-gradient-to-r from-blue-50/80 to-purple-50/80 border-blue-100 shadow-[0_4px_24px_rgba(37,99,235,0.06)]'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
                <Download className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="text-left min-w-0">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 flex-wrap">
                  Android APK Package
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    Ready
                  </span>
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  QFixAI-v1.0.0-debug.apk (2.9 MB)
                </p>
              </div>
            </div>

            <a
              href="/app-debug.apk"
              download="QFixAI-v1.0.0-debug.apk"
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold shadow-md shadow-blue-500/25 hover:opacity-95 active:scale-95 transition-all flex items-center gap-1.5 shrink-0"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              Download APK
            </a>
          </div>
        </div>

        {/* Settings List Items matching reference design */}
        <div className={`rounded-3xl border divide-y overflow-hidden ${
          isDark
            ? 'bg-slate-800/60 border-slate-700/60 divide-slate-700/60'
            : 'bg-white border-slate-100/90 divide-slate-100/90 shadow-[0_4px_24px_rgba(0,0,0,0.02)]'
        }`}>
          {filteredSettings.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => setActiveModal(item.id)}
                className="px-4 py-3.5 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${item.color}`}>
                    <Icon className="w-4.5 h-4.5 stroke-[2]" />
                  </div>

                  <div className="text-left min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Settings Sub-Modals */}
      {/* 1. Appearance Modal */}
      {activeModal === 'appearance' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className={`w-full max-w-sm rounded-3xl p-6 ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'} shadow-2xl border border-slate-100 text-left`}>
            <h3 className="font-bold text-base mb-4">Appearance Settings</h3>
            <div className="space-y-3 text-xs">
              <span className="font-semibold text-slate-500 block">Theme Mode</span>
              <div className="grid grid-cols-3 gap-2">
                {(['light', 'dark', 'system'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => onUpdateSettings({ theme: t })}
                    className={`p-3 rounded-2xl border font-bold capitalize flex flex-col items-center gap-1.5 cursor-pointer ${
                      settings.theme === t
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-600'
                        : 'border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {t === 'light' ? <Sun className="w-4 h-4" /> : t === 'dark' ? <Moon className="w-4 h-4" /> : <Palette className="w-4 h-4" />}
                    <span>{t}</span>
                  </button>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="font-semibold text-slate-500 block mb-2">Font Size</span>
                <div className="grid grid-cols-3 gap-2">
                  {(['small', 'medium', 'large'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => onUpdateSettings({ fontSize: s })}
                      className={`p-2.5 rounded-xl border text-xs font-semibold capitalize cursor-pointer ${
                        settings.fontSize === s
                          ? 'border-blue-600 bg-blue-50 text-blue-600'
                          : 'border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full mt-6 py-3 rounded-2xl bg-blue-600 text-white font-bold text-xs cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* 2. AI Assistant & Language Modal */}
      {activeModal === 'ai-assistant' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className={`w-full max-w-sm rounded-3xl p-6 ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'} shadow-2xl border border-slate-100 text-left`}>
            <h3 className="font-bold text-base mb-4">AI Assistant & Language</h3>
            <div className="space-y-4 text-xs">
              <div>
                <span className="font-semibold text-slate-500 block mb-2">Select Language</span>
                <div className="space-y-1.5">
                  {[
                    { code: 'pa' as Language, name: 'Punjabi (ਪੰਜਾਬੀ / پنجابی)' },
                    { code: 'ur' as Language, name: 'Urdu (اردو / Roman Urdu)' },
                    { code: 'en' as Language, name: 'English' },
                    { code: 'hi' as Language, name: 'Hindi (हिंदी)' },
                    { code: 'ps' as Language, name: 'Pashto (پښتو)' }
                  ].map((l) => (
                    <button
                      key={l.code}
                      onClick={() => onUpdateSettings({ language: l.code })}
                      className={`w-full p-3 rounded-xl border text-left flex items-center justify-between cursor-pointer ${
                        settings.language === l.code
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-600 font-bold'
                          : 'border-slate-100 dark:border-slate-800'
                      }`}
                    >
                      <span>{l.name}</span>
                      {settings.language === l.code && <Check className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="font-semibold text-slate-500 block mb-2">Voice Gender</span>
                <div className="grid grid-cols-2 gap-2">
                  {(['female', 'male'] as const).map((g) => (
                    <button
                      key={g}
                      onClick={() => onUpdateSettings({ voiceGender: g })}
                      className={`p-2.5 rounded-xl border text-xs font-semibold capitalize cursor-pointer ${
                        settings.voiceGender === g
                          ? 'border-blue-600 bg-blue-50 text-blue-600'
                          : 'border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full mt-6 py-3 rounded-2xl bg-blue-600 text-white font-bold text-xs cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* 3. Notifications Settings Modal */}
      {activeModal === 'notifications' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className={`w-full max-w-sm rounded-3xl p-6 ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'} shadow-2xl border border-slate-100 text-left`}>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base">Notifications & Alerts</h3>
                <p className="text-[11px] text-slate-400">Device health alarms and sound</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              {/* Toggle 1: Hardware Warnings */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border">
                <div>
                  <span className="font-bold block">Hardware Failure Alarms</span>
                  <span className="text-[10px] text-slate-400">Alert if display/sensors report fault</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifyHardware}
                  onChange={(e) => setNotifyHardware(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                />
              </div>

              {/* Toggle 2: Battery Temp Alert */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border">
                <div>
                  <span className="font-bold block">Battery Thermal Alert (&gt;38°C)</span>
                  <span className="text-[10px] text-slate-400">Warn on fast battery heat buildup</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifyBattery}
                  onChange={(e) => setNotifyBattery(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                />
              </div>

              {/* Toggle 3: Storage Alert */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border">
                <div>
                  <span className="font-bold block">Storage Full Warning (&gt;85%)</span>
                  <span className="text-[10px] text-slate-400">Notify before device runs out of space</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifyStorage}
                  onChange={(e) => setNotifyStorage(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                />
              </div>

              {/* Toggle 4: Sound & Vibration */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border">
                <div>
                  <span className="font-bold block">Sound & Vibration Feedback</span>
                  <span className="text-[10px] text-slate-400">Audio chimes on diagnosis completion</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifySound}
                  onChange={(e) => setNotifySound(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                />
              </div>

              {/* Direct Action 1: View Notifications Tray */}
              <button
                onClick={() => {
                  setActiveModal(null);
                  if (onOpenNotifications) onOpenNotifications();
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-blue-50 text-blue-600 font-bold flex items-center justify-center gap-2 cursor-pointer hover:bg-blue-100"
              >
                <Bell className="w-4 h-4" />
                <span>View Recent Notifications Tray</span>
              </button>

              {/* Direct Action 2: Trigger Test Notification */}
              <button
                onClick={handleTriggerTestNotification}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-200"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Send Test Diagnostic Alert</span>
              </button>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full mt-4 py-3 rounded-2xl bg-blue-600 text-white font-bold text-xs cursor-pointer"
            >
              Save & Close
            </button>
          </div>
        </div>
      )}

      {/* 4. Diagnostics Settings Modal */}
      {activeModal === 'diagnostics' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className={`w-full max-w-sm rounded-3xl p-6 ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'} shadow-2xl border border-slate-100 text-left`}>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base">Diagnostics Control</h3>
                <p className="text-[11px] text-slate-400">Sensor polling & automated tests</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border">
                <div>
                  <span className="font-bold block">Deep Battery Health Audit</span>
                  <span className="text-[10px] text-slate-400">Cycle-level mAh degradation tracking</span>
                </div>
                <input
                  type="checkbox"
                  checked={deepDiagnosticScan}
                  onChange={(e) => setDeepDiagnosticScan(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border">
                <div>
                  <span className="font-bold block">Auto RAM Optimization</span>
                  <span className="text-[10px] text-slate-400">Purge dead background services</span>
                </div>
                <input
                  type="checkbox"
                  checked={autoRamClean}
                  onChange={(e) => setAutoRamClean(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                />
              </div>

              <button
                onClick={() => {
                  setActiveModal(null);
                  if (onNavigate) onNavigate('hardware');
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-blue-50 text-blue-600 font-bold flex items-center justify-center gap-2 cursor-pointer hover:bg-blue-100"
              >
                <span>Launch Hardware Tests (22 Sensors) →</span>
              </button>

              <button
                onClick={() => {
                  setActiveModal(null);
                  if (onNavigate) onNavigate('software');
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-purple-50 text-purple-600 font-bold flex items-center justify-center gap-2 cursor-pointer hover:bg-purple-100"
              >
                <span>Launch Software Check (16 Items) →</span>
              </button>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full mt-5 py-3 rounded-2xl bg-blue-600 text-white font-bold text-xs cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* 5. Live Screen Config Modal */}
      {activeModal === 'live-screen' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className={`w-full max-w-sm rounded-3xl p-6 ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'} shadow-2xl border border-slate-100 text-left`}>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-cyan-50 text-cyan-600 rounded-xl">
                <MonitorPlay className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base">Live Screen Analysis</h3>
                <p className="text-[11px] text-slate-400">Video resolution and AI inspection</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-semibold text-slate-500 block mb-1.5">Inspection Resolution</span>
                <div className="grid grid-cols-2 gap-2">
                  {(['1080p', '720p'] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setScreenRes(r)}
                      className={`p-2.5 rounded-xl border text-xs font-bold cursor-pointer ${
                        screenRes === r
                          ? 'border-blue-600 bg-blue-50 text-blue-600'
                          : 'border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {r === '1080p' ? '1080p FHD (Sharp)' : '720p HD (Fast)'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border">
                <div>
                  <span className="font-bold block">Spoken AI Readout</span>
                  <span className="text-[10px] text-slate-400">Read screen diagnosis aloud</span>
                </div>
                <input
                  type="checkbox"
                  checked={aiVoiceFeedback}
                  onChange={(e) => setAiVoiceFeedback(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                />
              </div>

              <button
                onClick={() => {
                  setActiveModal(null);
                  if (onNavigate) onNavigate('live');
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-cyan-50 text-cyan-700 font-bold flex items-center justify-center gap-2 cursor-pointer hover:bg-cyan-100"
              >
                <span>Start Live Screen Sharing Now →</span>
              </button>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full mt-5 py-3 rounded-2xl bg-blue-600 text-white font-bold text-xs cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* 6. Privacy & Permissions Modal */}
      {activeModal === 'privacy' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className={`w-full max-w-sm rounded-3xl p-6 ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'} shadow-2xl border border-slate-100 text-left`}>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base">Privacy & Permissions</h3>
                <p className="text-[11px] text-slate-400">Android hardware permissions</p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border flex items-center justify-between">
                <div>
                  <span className="font-bold block">Microphone Access</span>
                  <span className="text-[10px] text-emerald-600 font-semibold">Granted / Active for Voice AI</span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border flex items-center justify-between">
                <div>
                  <span className="font-bold block">Camera Hardware</span>
                  <span className="text-[10px] text-emerald-600 font-semibold">Granted for Hardware Test</span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border flex items-center justify-between">
                <div>
                  <span className="font-bold block">Display Capture (Screen)</span>
                  <span className="text-[10px] text-emerald-600 font-semibold">Granted for Live Screen</span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border flex items-center justify-between">
                <div>
                  <span className="font-bold block">Storage & Diagnostic Cache</span>
                  <span className="text-[10px] text-slate-400">Stored locally on your device</span>
                </div>
                <Lock className="w-4 h-4 text-slate-400" />
              </div>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full mt-5 py-3 rounded-2xl bg-blue-600 text-white font-bold text-xs cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* 7. Storage & Cache Modal */}
      {activeModal === 'storage-data' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className={`w-full max-w-sm rounded-3xl p-6 ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'} shadow-2xl border border-slate-100 text-left`}>
            <h3 className="font-bold text-base mb-4">Storage & Cache</h3>
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border">
                <span className="text-slate-400 block mb-1">Temporary Cache Size</span>
                <strong className="text-slate-900 dark:text-white text-base">3.4 GB</strong>
              </div>

              <button
                onClick={handleClearCache}
                className="w-full py-3 rounded-2xl bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear Cache Now</span>
              </button>

              {cacheClearedToast && (
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs text-center font-bold">
                  ✓ Cache cleared successfully (3.4 GB freed)!
                </div>
              )}
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full mt-5 py-3 rounded-2xl bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* 8. Device Hardware & Software Specs Modal */}
      {activeModal === 'more' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className={`w-full max-w-sm rounded-3xl p-6 ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'} shadow-2xl border border-slate-100 text-left max-h-[85vh] overflow-y-auto`}>
            <div className="flex items-center gap-2 mb-4">
              <QFixLogo size={32} />
              <div>
                <h3 className="font-bold text-base">Device Specifications</h3>
                <p className="text-[11px] text-slate-400">Complete Hardware & Software Profile</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 flex justify-between">
                <span className="text-slate-400">Device Model</span>
                <strong className="font-bold">{deviceInfo?.model || 'Tecno One (Spark 20)'}</strong>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 flex justify-between">
                <span className="text-slate-400">Manufacturer</span>
                <strong className="font-bold">{deviceInfo?.manufacturer || 'Tecno Mobile'}</strong>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 flex justify-between">
                <span className="text-slate-400">Operating System</span>
                <strong className="font-bold">{deviceInfo?.osName || `HiOS 14 (Android ${deviceInfo?.androidVersion || '14'})`}</strong>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 flex justify-between">
                <span className="text-slate-400">Processor (CPU)</span>
                <strong className="font-bold">{deviceInfo?.processorName || `${deviceInfo?.cpuCores || 8}-Core MediaTek Helio G99`}</strong>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 flex justify-between">
                <span className="text-slate-400">Graphics (GPU)</span>
                <strong className="font-bold">{deviceInfo?.gpuRenderer || 'Mali-G57 MC2'}</strong>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 flex justify-between">
                <span className="text-slate-400">RAM Memory</span>
                <strong className="font-bold">{deviceInfo?.ramUsedGB || 3.8} GB / {deviceInfo?.ramTotalGB || 8} GB ({deviceInfo?.ramPercentage || 48}%)</strong>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 flex justify-between">
                <span className="text-slate-400">Internal Storage</span>
                <strong className="font-bold">{deviceInfo?.storageUsedGB || 74.2} GB / {deviceInfo?.storageTotalGB || 128} GB ({deviceInfo?.storagePercentage || 58}%)</strong>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 flex justify-between">
                <span className="text-slate-400">Battery Capacity</span>
                <strong className="font-bold">{deviceInfo?.batteryCapacityMah || 5000} mAh ({deviceInfo?.batteryPercentage || 82}% charged, {deviceInfo?.batteryTemperature || 31.4}°C)</strong>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 flex justify-between">
                <span className="text-slate-400">Display Spec</span>
                <strong className="font-bold">{deviceInfo?.screenResolution || '1080 x 2460'} ({deviceInfo?.screenRefreshRate || 120}Hz)</strong>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 flex justify-between">
                <span className="text-slate-400">Security Patch</span>
                <strong className="font-bold">{deviceInfo?.securityPatch || 'October 1, 2026'}</strong>
              </div>
            </div>

            {/* Switch / Auto-Detect Phone Model from Settings */}
            <button
              onClick={() => {
                setActiveModal(null);
                setIsDeviceSwitcherOpen(true);
              }}
              className="w-full mt-3 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-transform active:scale-95"
            >
              <Smartphone className="w-4 h-4" />
              <span>🔄 Auto-Detect / Switch Phone (موبائل تبدیل کریں)</span>
            </button>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full mt-2 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs cursor-pointer hover:bg-slate-200"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Device Switcher & Live Auto-Detect Modal */}
      {deviceInfo && (
        <DeviceSwitcherModal
          isOpen={isDeviceSwitcherOpen}
          onClose={() => setIsDeviceSwitcherOpen(false)}
          currentDevice={deviceInfo}
          onSelectDevice={(newDev) => {
            if (onUpdateDevice) onUpdateDevice(newDev);
          }}
          isDark={isDark}
        />
      )}
    </div>
  );
};
