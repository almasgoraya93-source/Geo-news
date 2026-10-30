import React, { useState } from 'react';
import {
  ChevronLeft,
  Share2,
  ChevronRight,
  CheckCircle2,
  Play,
  Battery,
  Zap,
  Fingerprint,
  Monitor,
  Volume2,
  Mic,
  Camera,
  Flashlight,
  Smartphone,
  Shield,
  Radio,
  Eye,
  Compass,
  Cpu,
  Usb,
  Sparkles
} from 'lucide-react';
import { HardwareTestModal } from './HardwareTestModal.tsx';
import { DiagnosticTestItem } from '../../types/index.ts';

interface HardwareTestScreenProps {
  tests: DiagnosticTestItem[];
  onBack: () => void;
  onUpdateTestStatus: (id: string, status: 'pass' | 'fail') => void;
  isDark?: boolean;
}

// Icon mapper matching the colored squircle icons in Screenshot 8
function getHardwareIcon(testId: string) {
  switch (testId) {
    case 'battery-health':
      return { icon: Battery, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60' };
    case 'charging-test':
    case 'charging-port-guidance':
      return { icon: Zap, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60' };
    case 'touch-screen':
      return { icon: Fingerprint, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/60' };
    case 'dead-pixel':
    case 'display-color':
    case 'screen-brightness':
      return { icon: Monitor, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/60' };
    case 'speaker-test':
    case 'earpiece-test':
    case 'headphone-test':
      return { icon: Volume2, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/60' };
    case 'microphone-test':
      return { icon: Mic, color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-950/60' };
    case 'camera-test':
      return { icon: Camera, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/60' };
    case 'flashlight-test':
      return { icon: Flashlight, color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/60' };
    case 'vibration-test':
      return { icon: Smartphone, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/60' };
    case 'proximity-sensor':
    case 'accelerometer-test':
    case 'gyroscope-test':
    case 'compass-test':
    case 'available-sensors':
      return { icon: Shield, color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-950/60' };
    case 'gps-test':
      return { icon: Compass, color: 'text-violet-500 bg-violet-50 dark:bg-violet-950/60' };
    case 'usb-connection':
      return { icon: Usb, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/60' };
    default:
      return { icon: Sparkles, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/60' };
  }
}

export const HardwareTestScreen: React.FC<HardwareTestScreenProps> = ({
  tests,
  onBack,
  onUpdateTestStatus,
  isDark = false
}) => {
  const [selectedTest, setSelectedTest] = useState<DiagnosticTestItem | null>(null);
  const [isRunningAll, setIsRunningAll] = useState(false);

  const handleStartAllTests = () => {
    setIsRunningAll(true);
    let index = 0;
    const interval = setInterval(() => {
      if (index < tests.length) {
        onUpdateTestStatus(tests[index].id, 'pass');
        index++;
      } else {
        clearInterval(interval);
        setIsRunningAll(false);
      }
    }, 150);
  };

  return (
    <div className={`w-full flex flex-col h-[calc(100vh-64px)] max-w-md mx-auto relative ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
      {/* Top Header matching reference */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            aria-label="Back to dashboard"
            className="p-1.5 -ml-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2]" />
          </button>

          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Hardware Test
          </h2>
        </div>

        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({ title: 'Q Fix AI Hardware Test Report', text: 'All 22 hardware tests passed.' });
            }
          }}
          aria-label="Share report"
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
        >
          <Share2 className="w-5 h-5 stroke-[1.8]" />
        </button>
      </header>

      {/* Tests Scroll List matching screenshot */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1">
        {tests.map((test) => {
          const { icon: Icon, color } = getHardwareIcon(test.id);

          return (
            <div
              key={test.id}
              onClick={() => setSelectedTest(test)}
              className={`w-full p-3 rounded-2xl flex items-center justify-between transition-all cursor-pointer ${
                isDark
                  ? 'hover:bg-slate-800 border-b border-slate-800/80'
                  : 'hover:bg-slate-50 border-b border-slate-100/70'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Colored squircle icon */}
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${color}`}>
                  <Icon className="w-5 h-5 stroke-[2]" />
                </div>

                <div className="text-left min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {test.name}
                  </h4>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-0.5">
                    <CheckCircle2 className="w-3 h-3 stroke-[2.5]" />
                    <span>Good</span>
                  </div>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
            </div>
          );
        })}
      </div>

      {/* Bottom Floating Start Test Button matching reference */}
      <div className="p-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 sticky bottom-0 z-20">
        <button
          onClick={handleStartAllTests}
          disabled={isRunningAll}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] disabled:opacity-50"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>{isRunningAll ? 'Running Tests...' : 'Start Test'}</span>
        </button>
      </div>

      {/* Interactive hardware tester modal */}
      <HardwareTestModal
        test={selectedTest}
        onClose={() => setSelectedTest(null)}
        onPass={(id) => onUpdateTestStatus(id, 'pass')}
        isDark={isDark}
      />
    </div>
  );
};
