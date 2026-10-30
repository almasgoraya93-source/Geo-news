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
  Globe
} from 'lucide-react';
import { QFixLogo } from '../common/QFixLogo.tsx';
import { AppSettings, Language } from '../../types/index.ts';

interface SettingsScreenProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onBack: () => void;
  isDark?: boolean;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  onBack,
  isDark = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [cacheClearedToast, setCacheClearedToast] = useState(false);

  const handleClearCache = () => {
    localStorage.removeItem('qfix_temp_cache');
    setCacheClearedToast(true);
    setTimeout(() => setCacheClearedToast(false), 3000);
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
      subtitle: `${settings.language.toUpperCase()}, Voice, Response`,
      icon: Sparkles,
      color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/60'
    },
    {
      id: 'live-screen',
      title: 'Live Screen',
      subtitle: 'Screen sharing, Analysis',
      icon: MonitorPlay,
      color: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-950/60'
    },
    {
      id: 'diagnostics',
      title: 'Diagnostics',
      subtitle: 'Hardware, Software, Battery',
      icon: Activity,
      color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60'
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      subtitle: 'Permissions, App Lock',
      icon: ShieldCheck,
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/60'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      subtitle: 'Alerts, Sound, Vibration',
      icon: Bell,
      color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/60'
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
      title: 'More Settings',
      subtitle: 'Help, About, Feedback',
      icon: HelpCircle,
      color: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-950/60'
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
      <header className="flex items-center px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 sticky top-0 z-20">
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
            className="flex-1 bg-transparent border-none outline-hidden text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
          />
        </div>

        {/* Q Fix AI Brand Card matching Screenshot 10 */}
        <div
          onClick={() => setActiveModal('about')}
          className={`w-full p-4 rounded-3xl border flex items-center justify-between transition-all cursor-pointer ${
            isDark
              ? 'bg-slate-800/80 border-slate-700 shadow-md'
              : 'bg-white border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:border-blue-100'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <QFixLogo size={40} />
            <div className="text-left">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                Q Fix AI
              </h3>
              <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                Version 1.0.0
              </p>
            </div>
          </div>

          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        {/* Toast */}
        {cacheClearedToast && (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Cache successfully purged (3.4 GB released).</span>
          </div>
        )}

        {/* Categorized Settings List matching Screenshot 10 */}
        <div
          className={`rounded-3xl border divide-y overflow-hidden ${
            isDark
              ? 'bg-slate-800/80 border-slate-700 divide-slate-700/60'
              : 'bg-white border-slate-100 divide-slate-100 shadow-[0_2px_16px_rgba(0,0,0,0.02)]'
          }`}
        >
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
              className="w-full mt-6 py-3 rounded-2xl bg-blue-600 text-white font-bold text-xs"
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
                          ? 'border-blue-600 bg-blue-50 text-blue-600 font-bold'
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
              className="w-full mt-6 py-3 rounded-2xl bg-blue-600 text-white font-bold text-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* 3. Storage & Cache Modal */}
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
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full mt-5 py-3 rounded-2xl bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* 4. About Modal */}
      {activeModal === 'about' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className={`w-full max-w-sm rounded-3xl p-6 ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'} shadow-2xl border border-slate-100 text-center`}>
            <QFixLogo size={48} className="mx-auto mb-3" />
            <h3 className="font-bold text-base">Q Fix AI Assistant</h3>
            <p className="text-xs text-slate-400 mt-1">Version 1.0.0 (Build 2026.10)</p>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
              Professional Android smartphone diagnostic, live screen analysis, and repair assistant. Powered by state-of-the-art diagnostic algorithms and multimodal AI.
            </p>
            <button
              onClick={() => setActiveModal(null)}
              className="w-full mt-6 py-3 rounded-2xl bg-blue-600 text-white font-bold text-xs cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
