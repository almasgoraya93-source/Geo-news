export type AppTab = 'home' | 'reports' | 'live' | 'settings' | 'chat' | 'hardware' | 'software' | 'voice';

export type Language = 'en' | 'ur' | 'hi' | 'ps' | 'pa';

export type DeviceHealthCondition = 'Good Condition' | 'Average Condition' | 'Needs Attention';

export interface DeviceInfo {
  manufacturer: string;
  model: string;
  marketingName?: string;
  androidVersion: string;
  apiLevel: number;
  osName?: string; // e.g. "HiOS 14 (Tecno)", "One UI 6.1", "HyperOS"
  buildNumber?: string;
  processorName?: string; // e.g. "MediaTek Helio G99 (8-Core 2.2 GHz)"
  gpuRenderer?: string; // e.g. "Mali-G57 MC2"
  gpuVendor?: string;
  screenResolution?: string; // e.g. "1080 x 2460 (FHD+)"
  screenRefreshRate?: number; // e.g. 120 or 90 or 60 Hz
  maxTouchPoints?: number; // e.g. 10
  batteryCapacityMah?: number; // e.g. 5000 mAh
  batteryPercentage: number;
  batteryTemperature: number; // in Celsius
  batteryCharging: boolean;
  batteryHealth: 'Good' | 'Fair' | 'Poor';
  storageUsedGB: number;
  storageTotalGB: number;
  storagePercentage: number;
  ramUsedGB: number;
  ramTotalGB: number;
  ramPercentage: number;
  cpuCores: number;
  cpuUsagePercentage: number;
  networkType: string;
  networkSpeedMbps: number;
  pingMs: number;
  securityPatch: string;
  isAutoDetected?: boolean;
}

export type TestStatus = 'untested' | 'testing' | 'pass' | 'fail' | 'warning' | 'unsupported';

export interface DiagnosticTestItem {
  id: string;
  name: string;
  category: 'battery' | 'display' | 'audio' | 'camera' | 'sensors' | 'connectivity' | 'hardware' | 'software';
  status: TestStatus;
  statusLabel: string;
  description: string;
  instructions: string;
  measuredResult?: string;
  recommendation?: string;
  requiresInteraction?: boolean;
}

export interface DiagnosticReport {
  id: string;
  timestamp: string;
  date: string;
  healthScore: number;
  condition: DeviceHealthCondition;
  deviceModel: string;
  summary: string;
  hardwareResults: Record<string, { status: TestStatus; notes: string }>;
  softwareResults: Record<string, { status: TestStatus; notes: string }>;
  detectedProblems: Array<{
    name: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    possibleCauses: string[];
    recommendedSolution: string;
    stepByStepInstructions: string[];
    requiresTechnician: boolean;
    technicianReason?: string;
  }>;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  attachment?: {
    type: 'image' | 'screenshot' | 'file';
    url: string;
    name: string;
  };
  options?: string[];
  repairPlan?: {
    problemName: string;
    severity: 'low' | 'medium' | 'high';
    isHardware: boolean;
    recommendations: string[];
    requiresTechnician: boolean;
  };
  liked?: boolean;
  disliked?: boolean;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  primaryColor: string;
  fontSize: 'small' | 'medium' | 'large';
  reduceAnimations: boolean;
  language: Language;
  aiAssistantEnabled: boolean;
  voiceGender: 'male' | 'female';
  voiceSpeed: number; // 0.8 - 1.5
  responseStyle: 'detailed' | 'concise' | 'step-by-step';
  screenSharingQuality: '720p' | '1080p';
  autoStopSharing: boolean;
  batteryAlerts: boolean;
  overheatingAlerts: boolean;
  storageAlerts: boolean;
  dailyReports: boolean;
  appLockEnabled: boolean;
  pinLock: string | null;
}
