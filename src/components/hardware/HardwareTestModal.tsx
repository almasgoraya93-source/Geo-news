import React, { useState, useEffect, useRef } from 'react';
import { X, CheckCircle2, Play, Volume2, Mic, Smartphone, Eye, Sparkles } from 'lucide-react';
import { DiagnosticTestItem } from '../../types/index.ts';

interface HardwareTestModalProps {
  test: DiagnosticTestItem | null;
  onClose: () => void;
  onPass: (testId: string) => void;
  isDark?: boolean;
}

export const HardwareTestModal: React.FC<HardwareTestModalProps> = ({
  test,
  onClose,
  onPass,
  isDark = false
}) => {
  if (!test) return null;

  // Touch screen interactive drawing grid state
  const [touchedTiles, setTouchedTiles] = useState<Record<number, boolean>>({});
  // Dead pixel test color cycle
  const [pixelColorIndex, setPixelColorIndex] = useState(0);
  const PIXEL_COLORS = ['#EF4444', '#10B981', '#3B82F6', '#FFFFFF', '#000000'];

  // Audio tone generator
  const audioContextRef = useRef<AudioContext | null>(null);

  const playTestTone = (freq = 440) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch (e) {
      console.warn('Audio tone error:', e);
    }
  };

  const triggerVibrate = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([200, 100, 200, 100, 300]);
    }
  };

  const handleTileHover = (index: number) => {
    setTouchedTiles((prev) => ({ ...prev, [index]: true }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className={`w-full max-w-sm rounded-3xl p-6 ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'} shadow-2xl border border-slate-100 flex flex-col relative`}>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3 className="font-bold text-sm">{test.name}</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="py-4 space-y-3 text-left">
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {test.description}
          </p>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 text-xs">
            <strong className="block text-slate-800 dark:text-slate-100 mb-1">
              Test Instruction:
            </strong>
            <span className="text-slate-600 dark:text-slate-300">
              {test.instructions}
            </span>
          </div>

          {/* Special Interactive Test Modes */}
          {test.id === 'touch-screen' && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                Touch Grid (Drag finger/pointer across all tiles):
              </span>
              <div className="grid grid-cols-6 gap-1 p-2 bg-slate-100 dark:bg-slate-800 rounded-xl">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div
                    key={i}
                    onMouseEnter={() => handleTileHover(i)}
                    onTouchMove={() => handleTileHover(i)}
                    className={`h-8 rounded transition-colors cursor-pointer ${
                      touchedTiles[i]
                        ? 'bg-emerald-500'
                        : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {test.id === 'dead-pixel' && (
            <div className="space-y-2 text-center">
              <div
                className="w-full h-24 rounded-2xl transition-colors flex items-center justify-center text-xs font-bold border"
                style={{ backgroundColor: PIXEL_COLORS[pixelColorIndex], color: pixelColorIndex === 4 ? '#fff' : '#000' }}
              >
                Inspect for dark/stuck spots
              </div>
              <button
                onClick={() => setPixelColorIndex((prev) => (prev + 1) % PIXEL_COLORS.length)}
                className="text-xs text-blue-600 font-bold underline cursor-pointer"
              >
                Cycle Color (Red, Green, Blue, White, Black)
              </button>
            </div>
          )}

          {test.id === 'speaker-test' && (
            <div className="text-center py-2">
              <button
                onClick={() => playTestTone(440)}
                className="px-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center gap-2 mx-auto cursor-pointer hover:bg-blue-700"
              >
                <Volume2 className="w-4 h-4" />
                <span>Play 440Hz Stereo Tone</span>
              </button>
            </div>
          )}

          {test.id === 'vibration-test' && (
            <div className="text-center py-2">
              <button
                onClick={triggerVibrate}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center gap-2 mx-auto cursor-pointer hover:bg-indigo-700"
              >
                <Smartphone className="w-4 h-4" />
                <span>Trigger Haptic Vibration</span>
              </button>
            </div>
          )}

          {/* Measured Result */}
          {test.measuredResult && (
            <div className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Measured Result:</span>
              </div>
              <p className="text-emerald-900 dark:text-emerald-200">
                {test.measuredResult}
              </p>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={() => {
              onPass(test.id);
              onClose();
            }}
            className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Mark as Passed</span>
          </button>
        </div>
      </div>
    </div>
  );
};
