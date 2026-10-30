import React, { useState, useEffect } from 'react';
import { StatusBar } from './components/common/StatusBar.tsx';
import { BottomNav } from './components/common/BottomNav.tsx';
import { NotificationModal } from './components/common/NotificationModal.tsx';
import { HomeDashboard } from './components/home/HomeDashboard.tsx';
import { AIChatBoard } from './components/chat/AIChatBoard.tsx';
import { LiveScreenAnalysis } from './components/live/LiveScreenAnalysis.tsx';
import { VoiceAssistant } from './components/voice/VoiceAssistant.tsx';
import { HardwareTestScreen } from './components/hardware/HardwareTestScreen.tsx';
import { SoftwareCheckScreen } from './components/software/SoftwareCheckScreen.tsx';
import { DiagnosticReportScreen } from './components/reports/DiagnosticReportScreen.tsx';
import { SettingsScreen } from './components/settings/SettingsScreen.tsx';

import {
  AppTab,
  DeviceInfo,
  AppSettings,
  DiagnosticTestItem
} from './types/index.ts';
import {
  getLiveDeviceInfo,
  INITIAL_HARDWARE_TESTS,
  INITIAL_SOFTWARE_CHECKS,
  DEFAULT_SETTINGS
} from './utils/deviceInfo.ts';
import { calculatePhoneHealthScore } from './utils/diagnosticRules.ts';

export default function App() {
  const [currentTab, setCurrentTab] = useState<AppTab>('home');
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    manufacturer: 'Samsung',
    model: 'Galaxy A54',
    androidVersion: '14',
    apiLevel: 34,
    batteryPercentage: 78,
    batteryTemperature: 31.4,
    batteryCharging: false,
    batteryHealth: 'Good',
    storageUsedGB: 79.4,
    storageTotalGB: 128,
    storagePercentage: 62,
    ramUsedGB: 3.8,
    ramTotalGB: 8,
    ramPercentage: 48,
    cpuCores: 8,
    cpuUsagePercentage: 32,
    networkType: 'Wi-Fi 5GHz',
    networkSpeedMbps: 78.5,
    pingMs: 24,
    securityPatch: 'October 1, 2026'
  });

  const [hardwareTests, setHardwareTests] = useState<DiagnosticTestItem[]>(INITIAL_HARDWARE_TESTS);
  const [softwareChecks, setSoftwareChecks] = useState<DiagnosticTestItem[]>(INITIAL_SOFTWARE_CHECKS);

  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('qfix_settings');
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Initialize live device data
  useEffect(() => {
    getLiveDeviceInfo().then((info) => {
      setDeviceInfo(info);
    });
  }, []);

  // Sync settings with localStorage and theme classes
  const handleUpdateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem('qfix_settings', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const isDark =
    settings.theme === 'dark' ||
    (settings.theme === 'system' &&
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  // Calculate dynamic health score
  const failedHardwareCount = hardwareTests.filter((t) => t.status === 'fail').length;
  const { score: healthScore, condition: conditionLabel } = calculatePhoneHealthScore({
    batteryHealthPct: 96,
    storageUsedPct: deviceInfo.storagePercentage,
    ramUsedPct: deviceInfo.ramPercentage,
    batteryTempC: deviceInfo.batteryTemperature,
    failedHardwareTestsCount: failedHardwareCount,
    totalHardwareTestsTested: hardwareTests.length
  });

  const handleUpdateTestStatus = (id: string, status: 'pass' | 'fail') => {
    setHardwareTests((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status, statusLabel: status === 'pass' ? 'Good' : 'Needs Repair' } : t))
    );
  };

  return (
    <div
      className={`min-h-screen w-full flex items-center justify-center transition-colors font-['Plus_Jakarta_Sans',sans-serif] ${
        isDark ? 'bg-slate-950 text-white dark' : 'bg-slate-100 text-slate-900'
      }`}
    >
      {/* Smartphone Device Frame Container */}
      <div
        className={`w-full max-w-md h-screen sm:h-[890px] sm:max-h-[96vh] flex flex-col sm:rounded-[44px] overflow-hidden sm:border-[8px] sm:border-slate-800/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] relative transition-all ${
          isDark ? 'bg-slate-900' : 'bg-white'
        }`}
      >
        {/* Android Galaxy Status Bar */}
        <StatusBar batteryPct={deviceInfo.batteryPercentage} isDark={isDark} />

        {/* Dynamic Screen View */}
        <main className="flex-1 overflow-hidden flex flex-col relative">
          {currentTab === 'home' && (
            <div className="flex-1 overflow-y-auto">
              <HomeDashboard
                deviceInfo={deviceInfo}
                healthScore={healthScore}
                conditionLabel={conditionLabel}
                onNavigate={(tab) => setCurrentTab(tab)}
                onOpenNotifications={() => setIsNotificationsOpen(true)}
                isDark={isDark}
              />
            </div>
          )}

          {currentTab === 'chat' && (
            <AIChatBoard
              onBack={() => setCurrentTab('home')}
              onNavigate={(tab) => setCurrentTab(tab)}
              onOpenNotifications={() => setIsNotificationsOpen(true)}
              language={settings.language}
              isDark={isDark}
            />
          )}

          {currentTab === 'live' && (
            <LiveScreenAnalysis
              onBack={() => setCurrentTab('home')}
              onOpenSettings={() => setCurrentTab('settings')}
              isDark={isDark}
            />
          )}

          {currentTab === 'voice' && (
            <VoiceAssistant
              onBack={() => setCurrentTab('home')}
              onOpenSettings={() => setCurrentTab('settings')}
              isDark={isDark}
            />
          )}

          {currentTab === 'hardware' && (
            <HardwareTestScreen
              tests={hardwareTests}
              onBack={() => setCurrentTab('home')}
              onUpdateTestStatus={handleUpdateTestStatus}
              isDark={isDark}
            />
          )}

          {currentTab === 'software' && (
            <SoftwareCheckScreen
              checks={softwareChecks}
              onBack={() => setCurrentTab('home')}
              onRunOptimization={() => {}}
              isDark={isDark}
            />
          )}

          {currentTab === 'reports' && (
            <DiagnosticReportScreen
              deviceInfo={deviceInfo}
              healthScore={healthScore}
              conditionLabel={conditionLabel}
              onBack={() => setCurrentTab('home')}
              isDark={isDark}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsScreen
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              onBack={() => setCurrentTab('home')}
              isDark={isDark}
            />
          )}
        </main>

        {/* Global Bottom Navigation (Visible on main tabs) */}
        {['home', 'reports', 'settings'].includes(currentTab) && (
          <BottomNav
            currentTab={currentTab}
            onSelectTab={(tab) => setCurrentTab(tab)}
            isDark={isDark}
          />
        )}

        {/* Notifications Modal */}
        <NotificationModal
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
          isDark={isDark}
        />
      </div>
    </div>
  );
}
