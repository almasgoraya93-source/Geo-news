import { DeviceHealthCondition, DeviceInfo, DiagnosticTestItem, DiagnosticReport } from '../types/index.ts';

/**
 * Calculates overall phone health score (0-100) based on measurable diagnostics.
 * Never invents fake scores.
 */
export function calculatePhoneHealthScore(params: {
  batteryHealthPct?: number; // 0-100
  storageUsedPct: number;    // 0-100
  ramUsedPct: number;        // 0-100
  batteryTempC: number;      // e.g. 31C
  failedHardwareTestsCount: number;
  totalHardwareTestsTested: number;
}): { score: number; condition: DeviceHealthCondition; label: string } {
  let score = 100;

  // 1. Hardware test deductions (weight: up to 35 points)
  if (params.totalHardwareTestsTested > 0) {
    const failRate = params.failedHardwareTestsCount / params.totalHardwareTestsTested;
    score -= Math.round(failRate * 35);
  }

  // 2. Battery health & temperature (weight: up to 25 points)
  if (params.batteryHealthPct !== undefined) {
    if (params.batteryHealthPct < 75) {
      score -= 15;
    } else if (params.batteryHealthPct < 85) {
      score -= 8;
    }
  }

  if (params.batteryTempC > 42) {
    score -= 15; // overheating
  } else if (params.batteryTempC > 38) {
    score -= 6;
  }

  // 3. Storage pressure (weight: up to 20 points)
  if (params.storageUsedPct > 95) {
    score -= 20;
  } else if (params.storageUsedPct > 85) {
    score -= 10;
  } else if (params.storageUsedPct > 75) {
    score -= 4;
  }

  // 4. RAM pressure (weight: up to 20 points)
  if (params.ramUsedPct > 90) {
    score -= 15;
  } else if (params.ramUsedPct > 80) {
    score -= 7;
  }

  score = Math.max(15, Math.min(100, score));

  let condition: DeviceHealthCondition = 'Good Condition';
  let label = 'Good';

  if (score < 60) {
    condition = 'Needs Attention';
    label = 'Needs Attention';
  } else if (score < 80) {
    condition = 'Average Condition';
    label = 'Average';
  }

  return { score, condition, label };
}

/**
 * Classifies a smartphone problem with severity, causes, and technician requirement.
 */
export function evaluateProblemDetails(problemText: string): {
  problemName: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  isHardware: boolean;
  requiresTechnician: boolean;
  technicianReason?: string;
  possibleCauses: string[];
  recommendedSolution: string;
  stepByStepInstructions: string[];
} {
  const lower = problemText.toLowerCase();

  // Screen crack / physical damage
  if (lower.includes('crack') || lower.includes('toot') || lower.includes('screen') && (lower.includes('masla') || lower.includes('broken') || lower.includes('damage') || lower.includes('line'))) {
    return {
      problemName: 'Screen Damage / Display Glass Fracture',
      severity: 'high',
      isHardware: true,
      requiresTechnician: true,
      technicianReason: 'Physical glass and OLED/LCD digitizer replacement requires specialized thermal separation tools and anti-static workbench.',
      possibleCauses: [
        'Physical impact or accidental drop',
        'Pressure on display panel in pocket or bag',
        'Digitizer matrix micro-fissure'
      ],
      recommendedSolution: 'Professional display panel replacement or temporary protective tempered glass application.',
      stepByStepInstructions: [
        'Apply transparent tempered glass or packing tape over the screen to prevent glass splinters and moisture ingress.',
        'Backup all vital phone data to Google Cloud or a PC immediately in case the touch digitizer stops responding.',
        'Keep phone away from moisture, liquids, and extreme humidity.',
        'Visit an authorized Samsung / OEM service center for genuine AMOLED panel replacement.'
      ]
    };
  }

  // Phone hanging / freezing / lagging
  if (lower.includes('hang') || lower.includes('lag') || lower.includes('slow') || lower.includes('ruk ruk')) {
    return {
      problemName: 'System Freezing & RAM Bottleneck',
      severity: 'medium',
      isHardware: false,
      requiresTechnician: false,
      possibleCauses: [
        'Multiple heavy apps executing background services',
        'System RAM saturation (>80% used)',
        'Storage cache accumulation from social media apps',
        'Pending Android OS software update'
      ],
      recommendedSolution: 'Close unneeded background services, clear cached app data, and restart phone.',
      stepByStepInstructions: [
        'Open Settings -> Apps -> Storage -> Clear Cache on heavy apps (Instagram, TikTok, Chrome).',
        'Check RAM usage in Q Fix AI Software Check and force-stop runaway background tasks.',
        'Reboot smartphone to release kernel memory buffers.',
        'Ensure at least 15% free internal storage for virtual memory paging.'
      ]
    };
  }

  // Battery drain / overheating
  if (lower.includes('battery') || lower.includes('drain') || lower.includes('garam') || lower.includes('heat') || lower.includes('charge')) {
    return {
      problemName: 'Thermal Throttling & Battery Drain',
      severity: 'medium',
      isHardware: false,
      requiresTechnician: false,
      possibleCauses: [
        'High ambient temperature or direct sunlight exposure',
        'Continuous GPS/Location or 5G tethering usage',
        'Rogue app consuming CPU cycles in background',
        'Degraded battery cell chemistry (>500 charge cycles)'
      ],
      recommendedSolution: 'Switch on Adaptive Battery, lower screen brightness, and check battery health.',
      stepByStepInstructions: [
        'Disconnect fast charger immediately if phone feels hot to the touch (>40°C).',
        'Remove thick silicone or protective case temporarily to promote heat dissipation.',
        'Turn off High Performance display mode (switch 120Hz to Adaptive 60Hz temporarily).',
        'If battery percentage drops more than 1% per minute while idle, inspect battery health in Q Fix AI Hardware Test.'
      ]
    };
  }

  // Generic diagnostic
  return {
    problemName: 'General Smartphone Diagnostic Inspection',
    severity: 'low',
    isHardware: false,
    requiresTechnician: false,
    possibleCauses: [
      'App configuration conflict',
      'Temporary cache corruption',
      'System service hiccup'
    ],
    recommendedSolution: 'Perform Q Fix AI Full Scan and review individual hardware/software components.',
    stepByStepInstructions: [
      'Run Q Fix AI Full Scan to audit all 22 hardware and 16 software parameters.',
      'Check Diagnostic Report for specific warnings.',
      'Restart device to refresh system services.'
    ]
  };
}

/**
 * Format bytes to readable GB/MB string
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 GB';
  const gb = bytes / (1024 * 1024 * 1024);
  if (gb >= 1) return `${gb.toFixed(1)} GB`;
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(0)} MB`;
}

/**
 * Formatted translations for UI labels
 */
export const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    home: 'Home',
    reports: 'Reports',
    live: 'Live',
    settings: 'Settings',
    hardwareTest: 'Hardware Test',
    softwareCheck: 'Software Check',
    aiChatBoard: 'AI Chat Board',
    liveScreenAnalysis: 'Live Screen Analysis',
    voiceAssistant: 'Voice Assistant',
    fullScan: 'Full Scan',
    goodCondition: 'Good Condition',
    battery: 'Battery',
    storage: 'Storage',
    ram: 'RAM',
    listening: 'Listening...',
    tapToStop: 'Tap to stop',
    startSharing: 'Start Sharing',
    stopSharing: 'Stop Sharing',
    startTest: 'Start Test',
    startCheck: 'Start Check',
    viewFullReport: 'View Full Report'
  },
  ur: {
    home: 'ہوم',
    reports: 'رپورٹس',
    live: 'لائیو',
    settings: 'سیٹنگز',
    hardwareTest: 'ہارڈویئر ٹیسٹ',
    softwareCheck: 'سافٹ ویئر چیک',
    aiChatBoard: 'اے آئی چیٹ بورڈ',
    liveScreenAnalysis: 'لائیو اسکرین تجزیہ',
    voiceAssistant: 'وائس اسسٹنٹ',
    fullScan: 'مکمل اسکین',
    goodCondition: 'بہترین حالت',
    battery: 'بیٹری',
    storage: 'اسٹوریج',
    ram: 'ریم',
    listening: 'سن رہا ہوں...',
    tapToStop: 'روکنے کے لیے دبائیں',
    startSharing: 'اسکرین شیئر شروع کریں',
    stopSharing: 'اسکرین شیئر بند کریں',
    startTest: 'ٹیسٹ شروع کریں',
    startCheck: 'چیک شروع کریں',
    viewFullReport: 'مکمل رپورٹ دیکھیں'
  },
  hi: {
    home: 'होम',
    reports: 'रिपोर्ट्स',
    live: 'लाइव',
    settings: 'सेटिंग्स',
    hardwareTest: 'हार्डवेयर टेस्ट',
    softwareCheck: 'सॉफ्टवेयर चेक',
    aiChatBoard: 'एआई चैट बोर्ड',
    liveScreenAnalysis: 'लाइव स्क्रीन विश्लेषण',
    voiceAssistant: 'वॉयस असिस्टेंट',
    fullScan: 'फुल स्कैन',
    goodCondition: 'अच्छी स्थिति',
    battery: 'बैटरी',
    storage: 'स्टोरेज',
    ram: 'रैम',
    listening: 'सुन रहा हूँ...',
    tapToStop: 'रोकने के लिए टैप करें',
    startSharing: 'शेयरिंग शुरू करें',
    stopSharing: 'शेयरिंग बंद करें',
    startTest: 'टेस्ट शुरू करें',
    startCheck: 'चेक शुरू करें',
    viewFullReport: 'पूरी रिपोर्ट देखें'
  },
  ps: {
    home: 'کور',
    reports: 'راپورونه',
    live: 'ژوندی',
    settings: 'تنظیمات',
    hardwareTest: 'هارډویر ازموینه',
    softwareCheck: 'سافټویر معاینه',
    aiChatBoard: 'د AI چیټ بورډ',
    liveScreenAnalysis: 'ژوندی سکرین تحلیل',
    voiceAssistant: 'غږیز مرستیال',
    fullScan: 'بشپړ سکین',
    goodCondition: 'ښه حالت',
    battery: 'بیټرۍ',
    storage: 'زېرمه',
    ram: 'ریم',
    listening: 'اوریدل کیږي...',
    tapToStop: 'د درولو لپاره لمس کړئ',
    startSharing: 'شریکول پیل کړئ',
    stopSharing: 'شریکول بند کړئ',
    startTest: 'ازموینه پیل کړئ',
    startCheck: 'معاینه پیل کړئ',
    viewFullReport: 'بشپړ راپور وګورئ'
  }
};
