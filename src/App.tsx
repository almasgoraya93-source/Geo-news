import React, { useState, useEffect } from 'react';
import { StatusBar } from './components/common/StatusBar.tsx';
import { BottomNav } from './components/common/BottomNav.tsx';
import { NotificationModal } from './components/common/NotificationModal.tsx';
import { TopNotificationBanner, TopAlert } from './components/common/TopNotificationBanner.tsx';
import { DeviceSwitcherModal } from './components/home/DeviceSwitcherModal.tsx';
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
  getDynamicHardwareTests,
  getDynamicSoftwareChecks,
  INITIAL_HARDWARE_TESTS,
  INITIAL_SOFTWARE_CHECKS,
  DEFAULT_SETTINGS
} from './utils/deviceInfo.ts';
import { calculatePhoneHealthScore } from './utils/diagnosticRules.ts';

export default function App() {
  const [currentTab, setCurrentTab] = useState<AppTab>('home');
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    manufacturer: 'Tecno Mobile',
    model: 'Tecno One (Spark 20)',
    marketingName: 'Tecno One',
    androidVersion: '14',
    apiLevel: 34,
    osName: 'HiOS 14 (Android 14)',
    processorName: 'MediaTek Helio G99 Ultimate (8-Core 2.2 GHz)',
    gpuRenderer: 'Mali-G57 MC2',
    gpuVendor: 'ARM',
    screenResolution: '1080 x 2460 (FHD+)',
    screenRefreshRate: 120,
    maxTouchPoints: 10,
    batteryCapacityMah: 5000,
    batteryPercentage: 82,
    batteryTemperature: 31.4,
    batteryCharging: false,
    batteryHealth: 'Good',
    storageUsedGB: 74.2,
    storageTotalGB: 128,
    storagePercentage: 58,
    ramUsedGB: 3.8,
    ramTotalGB: 8,
    ramPercentage: 48,
    cpuCores: 8,
    cpuUsagePercentage: 30,
    networkType: 'Wi-Fi 5GHz',
    networkSpeedMbps: 85.0,
    pingMs: 22,
    securityPatch: 'October 1, 2026',
    isAutoDetected: true
  });

  const [hardwareTests, setHardwareTests] = useState<DiagnosticTestItem[]>(() =>
    getDynamicHardwareTests()
  );
  const [softwareChecks, setSoftwareChecks] = useState<DiagnosticTestItem[]>(() =>
    getDynamicSoftwareChecks()
  );

  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('qfix_settings');
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [activeTopAlert, setActiveTopAlert] = useState<TopAlert | null>(null);
  const [isDeviceSwitcherOpen, setIsDeviceSwitcherOpen] = useState(false);

  // Initialize live device data and update hardware/software specs dynamically
  useEffect(() => {
    getLiveDeviceInfo().then((info) => {
      setDeviceInfo(info);
      setHardwareTests(getDynamicHardwareTests(info));
      setSoftwareChecks(getDynamicSoftwareChecks(info));

      // Trigger initial live device notification
      setTimeout(() => {
        setActiveTopAlert({
          id: 'live-connect-' + Date.now(),
          title: `📱 ${info.manufacturer} ${info.model} Connected`,
          message: `Android ${info.androidVersion} (${info.osName?.split(' ')[0] || 'HiOS'}): Live telemetry active. 22 hardware sensors & battery operating in Good Condition.`,
          type: 'success'
        });
      }, 800);
    });

    // Realistic live thermal and CPU telemetry fluctuations every 4.5 seconds
    const liveTelemetryTimer = setInterval(() => {
      setDeviceInfo((prev) => {
        const tempVariation = (Math.random() * 0.4 - 0.2);
        const nextTemp = Number(Math.max(30.8, Math.min(32.4, prev.batteryTemperature + tempVariation)).toFixed(1));
        const nextCpu = Math.round(28 + Math.random() * 6);
        return {
          ...prev,
          batteryTemperature: nextTemp,
          cpuUsagePercentage: nextCpu
        };
      });
    }, 4500);

    return () => clearInterval(liveTelemetryTimer);
  }, []);

  const handleUpdateDevice = (newDevice: DeviceInfo) => {
    setDeviceInfo(newDevice);
    setHardwareTests(getDynamicHardwareTests(newDevice));
    setSoftwareChecks(getDynamicSoftwareChecks(newDevice));

    // Show instant notification on device switch
    setActiveTopAlert({
      id: 'switch-' + Date.now(),
      title: `🔄 Phone Switched: ${newDevice.model}`,
      message: `${newDevice.manufacturer} • Android ${newDevice.androidVersion} • ${newDevice.processorName || '8-Core'} • Live Diagnostics re-calibrated.`,
      type: 'info'
    });
  };

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
        {/* Android Galaxy Status Bar with Live Device & Android Version Strip */}
        <StatusBar
          batteryPct={deviceInfo.batteryPercentage}
          deviceInfo={deviceInfo}
          onOpenDeviceSwitcher={() => setIsDeviceSwitcherOpen(true)}
          isDark={isDark}
        />

        {/* Top Heads-Up Notification Banner */}
        <TopNotificationBanner
          alert={activeTopAlert}
          deviceModel={deviceInfo.model}
          androidVersion={deviceInfo.androidVersion}
          manufacturer={deviceInfo.manufacturer}
          onDismiss={() => setActiveTopAlert(null)}
          onOpenNotifications={() => {
            setActiveTopAlert(null);
            setIsNotificationsOpen(true);
          }}
          isDark={isDark}
        />

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
                onUpdateDevice={handleUpdateDevice}
                isDark={isDark}
              />
            </div>
          )}

          {currentTab === 'chat' && (
            <AIChatBoard
              deviceInfo={deviceInfo}
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
              onOpenNotifications={() => setIsNotificationsOpen(true)}
              onNavigate={(tab) => setCurrentTab(tab)}
              isDark={isDark}
            />
          )}

          {currentTab === 'voice' && (
            <VoiceAssistant
              deviceInfo={deviceInfo}
              onBack={() => setCurrentTab('home')}
              onOpenSettings={() => setCurrentTab('settings')}
              onOpenNotifications={() => setIsNotificationsOpen(true)}
              onNavigate={(tab) => setCurrentTab(tab)}
              isDark={isDark}
            />
          )}

          {currentTab === 'hardware' && (
            <HardwareTestScreen
              tests={hardwareTests}
              deviceInfo={deviceInfo}
              onBack={() => setCurrentTab('home')}
              onUpdateTestStatus={handleUpdateTestStatus}
              isDark={isDark}
            />
          )}

          {currentTab === 'software' && (
            <SoftwareCheckScreen
              checks={softwareChecks}
              deviceInfo={deviceInfo}
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
              deviceInfo={deviceInfo}
              onUpdateSettings={handleUpdateSettings}
              onUpdateDevice={handleUpdateDevice}
              onOpenNotifications={() => setIsNotificationsOpen(true)}
              onBack={() => setCurrentTab('home')}
              onNavigate={(tab) => setCurrentTab(tab)}
              isDark={isDark}
            />
          )}
        </main>

        {/* Global Bottom Navigation (Consistent across main application screens) */}
        {['home', 'chat', 'voice', 'live', 'reports', 'settings'].includes(currentTab) && (
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
          deviceInfo={deviceInfo}
          onTriggerAlert={(alert) => setActiveTopAlert(alert)}
          isDark={isDark}
        />

        {/* Global Device Switcher Modal */}
        <DeviceSwitcherModal
          isOpen={isDeviceSwitcherOpen}
          onClose={() => setIsDeviceSwitcherOpen(false)}
          currentDevice={deviceInfo}
          onSelectDevice={handleUpdateDevice}
          isDark={isDark}
        />
      </div>
    </div>
  );
}
