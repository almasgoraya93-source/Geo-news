import React, { useState } from 'react';
import {
  X,
  Smartphone,
  CheckCircle2,
  Scan,
  Sparkles,
  Cpu,
  Layers,
  Battery,
  HardDrive,
  Monitor,
  RefreshCw,
  Search,
  Check
} from 'lucide-react';
import { DeviceInfo } from '../../types/index.ts';
import {
  PRESET_DEVICES,
  saveCustomDeviceProfile,
  detectGPU,
  detectScreenSpecs,
  mergeLiveHardwareMetrics
} from '../../utils/deviceInfo.ts';

interface DeviceSwitcherModalProps {
  currentDevice: DeviceInfo;
  isOpen: boolean;
  onClose: () => void;
  onSelectDevice: (newDevice: DeviceInfo) => void;
  isDark?: boolean;
}

export const DeviceSwitcherModal: React.FC<DeviceSwitcherModalProps> = ({
  currentDevice,
  isOpen,
  onClose,
  onSelectDevice,
  isDark = false
}) => {
  const [selectedBrand, setSelectedBrand] = useState<'all' | 'tecno' | 'samsung' | 'xiaomi' | 'infinix' | 'other'>('tecno');
  const [searchQuery, setSearchQuery] = useState('');
  const [isScanningLive, setIsScanningLive] = useState(false);
  const [scanTelemetry, setScanTelemetry] = useState<any>(null);
  const [customBrand, setCustomBrand] = useState('Tecno Mobile');
  const [customModel, setCustomModel] = useState('Tecno One');
  const [customProcessor, setCustomProcessor] = useState('MediaTek Helio G99 (8-Core)');

  if (!isOpen) return null;

  // Run live hardware sensor scan
  const handleRunLiveAutoDetect = async () => {
    setIsScanningLive(true);
    setScanTelemetry(null);

    try {
      const gpu = detectGPU();
      const screenSpecs = detectScreenSpecs();
      const cores = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 8 : 8;
      const mem = typeof navigator !== 'undefined' && (navigator as any).deviceMemory ? (navigator as any).deviceMemory : 8;
      const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';

      let batteryPct = 80;
      let charging = false;
      if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
        try {
          const b: any = await (navigator as any).getBattery();
          batteryPct = Math.round((b.level || 0.8) * 100);
          charging = !!b.charging;
        } catch {}
      }

      // Check if user agent reveals phone
      let detectedBrand = 'Tecno Mobile';
      let detectedModel = 'Tecno One (Spark Series)';
      let os = 'HiOS 14 (Android 14)';

      const uaLower = ua.toLowerCase();
      if (uaLower.includes('tecno')) {
        detectedBrand = 'Tecno Mobile';
        detectedModel = uaLower.includes('camon') ? 'Tecno Camon 30' : uaLower.includes('pova') ? 'Tecno Pova 6' : 'Tecno One (Spark 20)';
        os = 'HiOS 14 (Android 14)';
      } else if (uaLower.includes('infinix')) {
        detectedBrand = 'Infinix';
        detectedModel = 'Infinix Note 40';
        os = 'XOS 14 (Android 14)';
      } else if (uaLower.includes('samsung') || uaLower.includes('sm-')) {
        detectedBrand = 'Samsung';
        detectedModel = 'Galaxy A54 5G';
        os = 'One UI 6.1 (Android 14)';
      } else if (uaLower.includes('redmi') || uaLower.includes('xiaomi')) {
        detectedBrand = 'Xiaomi';
        detectedModel = 'Redmi Note 13';
        os = 'HyperOS (Android 14)';
      }

      const telemetry = {
        detectedBrand,
        detectedModel,
        gpu: gpu.renderer || 'Mali-G57 MC2 (ARM)',
        cores: `${cores}-Core CPU`,
        ram: `${mem} GB RAM`,
        battery: `${batteryPct}% ${charging ? '(Charging)' : ''}`,
        screen: screenSpecs.resolution,
        refresh: `${screenSpecs.refreshRate} Hz`,
        touchPoints: `${screenSpecs.touchPoints}-point multi-touch`
      };

      setScanTelemetry(telemetry);

      // Auto-apply detected profile
      const detectedDevice: DeviceInfo = await mergeLiveHardwareMetrics({
        manufacturer: detectedBrand,
        model: detectedModel,
        osName: os,
        processorName: gpu.renderer.includes('Mali') ? 'MediaTek Helio G99 (8-Core 2.2 GHz)' : 'Qualcomm Snapdragon (8-Core)',
        gpuRenderer: gpu.renderer || 'Mali-G57 MC2',
        screenResolution: screenSpecs.resolution,
        screenRefreshRate: screenSpecs.refreshRate,
        maxTouchPoints: screenSpecs.touchPoints,
        batteryPercentage: batteryPct,
        batteryCharging: charging,
        ramTotalGB: mem,
        ramUsedGB: Number((mem * 0.48).toFixed(1)),
        cpuCores: cores,
        isAutoDetected: true
      });

      saveCustomDeviceProfile(detectedDevice);
      onSelectDevice(detectedDevice);
    } catch (e) {
      console.warn('Live detect caught:', e);
    } finally {
      setIsScanningLive(false);
    }
  };

  // Select a preset phone profile
  const handleSelectPreset = async (preset: typeof PRESET_DEVICES[0]) => {
    const updatedDevice = await mergeLiveHardwareMetrics({
      manufacturer: preset.manufacturer,
      model: preset.model,
      osName: preset.osName,
      processorName: preset.processorName,
      gpuRenderer: preset.gpuRenderer,
      ramTotalGB: preset.ramTotalGB,
      ramUsedGB: Number((preset.ramTotalGB * 0.48).toFixed(1)),
      storageTotalGB: preset.storageTotalGB,
      storageUsedGB: Number((preset.storageTotalGB * 0.58).toFixed(1)),
      screenResolution: preset.screenResolution,
      screenRefreshRate: preset.screenRefreshRate,
      batteryCapacityMah: preset.batteryCapacityMah,
      isAutoDetected: false
    });

    saveCustomDeviceProfile(updatedDevice);
    onSelectDevice(updatedDevice);
    onClose();
  };

  // Apply custom phone entry (e.g. "Tecno One")
  const handleApplyCustomDevice = async () => {
    if (!customModel.trim()) return;

    const updatedDevice = await mergeLiveHardwareMetrics({
      manufacturer: customBrand.trim() || 'Tecno Mobile',
      model: customModel.trim(),
      osName: customBrand.toLowerCase().includes('tecno') ? 'HiOS 14 (Android 14)' : 'Android 14',
      processorName: customProcessor.trim() || 'MediaTek Helio G99 (8-Core 2.2 GHz)',
      isAutoDetected: false
    });

    saveCustomDeviceProfile(updatedDevice);
    onSelectDevice(updatedDevice);
    onClose();
  };

  // Filter presets
  const filteredPresets = PRESET_DEVICES.filter((d) => {
    if (selectedBrand === 'tecno' && !d.manufacturer.toLowerCase().includes('tecno')) return false;
    if (selectedBrand === 'samsung' && !d.manufacturer.toLowerCase().includes('samsung')) return false;
    if (selectedBrand === 'xiaomi' && !d.manufacturer.toLowerCase().includes('xiaomi')) return false;
    if (selectedBrand === 'infinix' && !d.manufacturer.toLowerCase().includes('infinix')) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        d.model.toLowerCase().includes(q) ||
        d.manufacturer.toLowerCase().includes(q) ||
        d.processorName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`w-full max-w-md rounded-3xl p-5 max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl border ${
          isDark
            ? 'bg-slate-900 text-white border-slate-700'
            : 'bg-white text-slate-900 border-slate-100'
        }`}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-md">
              <Smartphone className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                Select Your Smartphone Model
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                اپنا اصلی موبائل ماڈل اور ہارڈویئر منتخب کریں
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close device selector"
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Device Banner */}
        <div className="mt-3.5 p-3 rounded-2xl bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 dark:from-blue-950/40 dark:via-purple-950/40 dark:to-indigo-950/40 border border-blue-200/60 dark:border-blue-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-700 flex items-center justify-center text-blue-600 font-bold text-xs shadow-xs">
              📱
            </div>
            <div>
              <span className="text-[10px] font-bold text-blue-600 tracking-wide uppercase block">
                Active Smartphone
              </span>
              <h4 className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">
                {currentDevice.manufacturer} {currentDevice.model}
              </h4>
              <span className="text-[11px] text-slate-500 font-medium block">
                {currentDevice.processorName || 'Octa-Core'} • {currentDevice.ramTotalGB}GB RAM • {currentDevice.screenResolution}
              </span>
            </div>
          </div>

          <div className="p-1.5 rounded-full bg-emerald-500 text-white shrink-0 shadow-xs">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
        </div>

        {/* Live Auto-Detect Button with Telemetry */}
        <div className="mt-3">
          <button
            onClick={handleRunLiveAutoDetect}
            disabled={isScanningLive}
            className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-500/25 transition-transform active:scale-95 cursor-pointer disabled:opacity-60"
          >
            <Scan className={`w-4 h-4 ${isScanningLive ? 'animate-spin' : ''}`} />
            <span>
              {isScanningLive
                ? 'Scanning WebGL & Hardware APIs...'
                : 'Auto-Detect My Real Device (لائیو اسکین کریں)'}
            </span>
          </button>

          {/* Real-time Telemetry Card if detected */}
          {scanTelemetry && (
            <div className="mt-2 p-3 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-300 text-left text-xs animate-in fade-in duration-200">
              <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-bold mb-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Live Hardware Detected & Configured!</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-700 dark:text-slate-300">
                <div>📱 Device: <strong>{scanTelemetry.detectedBrand} {scanTelemetry.detectedModel}</strong></div>
                <div>🎮 GPU: <strong>{scanTelemetry.gpu}</strong></div>
                <div>⚡ CPU: <strong>{scanTelemetry.cores}</strong></div>
                <div>💾 RAM: <strong>{scanTelemetry.ram}</strong></div>
                <div>🔋 Battery: <strong>{scanTelemetry.battery}</strong></div>
                <div>📐 Display: <strong>{scanTelemetry.screen} ({scanTelemetry.refresh})</strong></div>
              </div>
            </div>
          )}
        </div>

        {/* Brand Tabs: Tecno (Recommended), Infinix, Samsung, Xiaomi, All */}
        <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'tecno', label: 'Tecno (Techno) ⭐' },
            { id: 'infinix', label: 'Infinix' },
            { id: 'samsung', label: 'Samsung' },
            { id: 'xiaomi', label: 'Xiaomi' },
            { id: 'all', label: 'All Brands' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedBrand(tab.id as any)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                selectedBrand === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Preset Phones */}
        <div className="mt-2.5 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search phone model (e.g. Tecno One, Spark, Camon)..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 outline-hidden"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        </div>

        {/* Preset Phones List */}
        <div className="mt-3 space-y-2 max-h-52 overflow-y-auto pr-1">
          {filteredPresets.map((preset) => {
            const isCurrent =
              currentDevice.model.toLowerCase() === preset.model.toLowerCase() ||
              currentDevice.model.includes(preset.model);

            return (
              <div
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  isCurrent
                    ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/40 shadow-xs'
                    : 'border-slate-100 dark:border-slate-800 hover:border-blue-200 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold text-xs shrink-0">
                    {preset.manufacturer.toLowerCase().includes('tecno') ? '⚡' : '📱'}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                      {preset.model}
                    </h5>
                    <span className="text-[11px] text-slate-500 font-medium block">
                      {preset.processorName} • {preset.ramTotalGB}GB RAM • {preset.screenRefreshRate}Hz
                    </span>
                  </div>
                </div>

                {isCurrent && (
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-100 dark:bg-blue-900/60 px-2 py-0.5 rounded-full shrink-0">
                    Active
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Custom Phone Model Entry (for user's specific "Tecno One" or other models) */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-left">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Enter Your Custom Phone Model (اپنا ماڈل لکھیں)</span>
          </span>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-semibold text-slate-400 block mb-0.5">Brand / Company</label>
              <input
                type="text"
                value={customBrand}
                onChange={(e) => setCustomBrand(e.target.value)}
                placeholder="e.g. Tecno Mobile"
                className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-hidden"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-400 block mb-0.5">Model Name</label>
              <input
                type="text"
                value={customModel}
                onChange={(e) => setCustomModel(e.target.value)}
                placeholder="e.g. Tecno One / Spark"
                className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-hidden"
              />
            </div>
          </div>

          <button
            onClick={handleApplyCustomDevice}
            className="w-full mt-2.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs cursor-pointer transition-transform active:scale-95"
          >
            Apply My Phone Model (محفوظ کریں)
          </button>
        </div>
      </div>
    </div>
  );
};
