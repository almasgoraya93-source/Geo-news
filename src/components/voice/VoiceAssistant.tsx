import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  Settings,
  Mic,
  Square,
  Volume2,
  Globe,
  User,
  Sparkles,
  Sliders
} from 'lucide-react';
import { Language } from '../../types/index.ts';

interface VoiceAssistantProps {
  onBack: () => void;
  onOpenSettings: () => void;
  isDark?: boolean;
}

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({
  onBack,
  onOpenSettings,
  isDark = false
}) => {
  const [isListening, setIsListening] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('ur');
  const [selectedGender, setSelectedGender] = useState<'female' | 'male'>('female');
  const [transcript, setTranscript] = useState('Listening to your voice...');
  const [aiSpeechResponse, setAiSpeechResponse] = useState('');

  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize Web Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = selectedLanguage === 'ur' ? 'ur-PK' : selectedLanguage === 'hi' ? 'hi-IN' : selectedLanguage === 'ps' ? 'ps-AF' : 'en-US';

      rec.onresult = (event: any) => {
        let currentText = '';
        for (let i = 0; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript;
        }
        setTranscript(currentText);

        // If user finished a thought, generate voice response
        if (event.results[0].isFinal) {
          handleVoiceQuery(currentText);
        }
      };

      recognitionRef.current = rec;
      if (isListening) {
        try {
          rec.start();
        } catch {
          // already started
        }
      }
    }

    return () => {
      try {
        recognitionRef.current?.stop();
      } catch {}
    };
  }, [selectedLanguage]);

  const handleVoiceQuery = (queryText: string) => {
    setIsListening(false);
    setIsSpeaking(true);

    let reply = '';
    if (selectedLanguage === 'ur') {
      reply = 'Maine aapki awaz sun li hai. Aapka phone abhi theek condition mein hai aur battery health 96% hai.';
    } else if (selectedLanguage === 'hi') {
      reply = 'मैंने आपकी आवाज सुन ली है। आपका फोन सही स्थिति में है और बैटरी 96% है।';
    } else if (selectedLanguage === 'ps') {
      reply = 'ما ستاسو غږ واورېد. ستاسو تلیفون په ښه حالت کې دی او د بیټرۍ روغتیا ۹۶ سلنه ده.';
    } else {
      reply = 'I heard your request. Your smartphone hardware diagnostics are passing, and battery health is at 96%.';
    }

    setAiSpeechResponse(reply);

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(reply);
      utterance.rate = 1.0;
      utterance.pitch = selectedGender === 'female' ? 1.1 : 0.9;

      const voices = window.speechSynthesis.getVoices();
      const match = voices.find((v) => {
        if (selectedLanguage === 'ur') return v.lang.includes('ur') || v.lang.includes('hi');
        if (selectedLanguage === 'hi') return v.lang.includes('hi');
        return v.lang.includes('en');
      });
      if (match) utterance.voice = match;

      utterance.onend = () => {
        setIsSpeaking(false);
      };
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsSpeaking(false), 3000);
    }
  };

  const handleToggleListening = () => {
    if (isListening || isSpeaking) {
      try {
        recognitionRef.current?.stop();
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
      } catch {}
      setIsListening(false);
      setIsSpeaking(false);
    } else {
      try {
        recognitionRef.current?.start();
      } catch {}
      setIsListening(true);
      setTranscript('Listening to your voice...');
    }
  };

  return (
    <div className={`w-full flex flex-col h-[calc(100vh-64px)] max-w-md mx-auto relative ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
      {/* Top Header */}
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
            Voice Assistant
          </h2>
        </div>

        <button
          onClick={onOpenSettings}
          aria-label="Voice settings"
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
        >
          <Settings className="w-5 h-5 stroke-[1.8]" />
        </button>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col items-center justify-between text-center">
        {/* Top Info Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 text-blue-600 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Real-time Smartphone Voice Diagnostic</span>
        </div>

        {/* Central Animated Glowing Circle with Mic Icon - EXACT MATCH TO REFERENCE SCREENSHOT 5 */}
        <div className="relative my-6 flex items-center justify-center">
          {/* Outer glowing pulsing aura */}
          <div
            className={`absolute w-56 h-56 rounded-full transition-all duration-700 ${
              isListening
                ? 'bg-blue-500/15 animate-ping opacity-75'
                : isSpeaking
                ? 'bg-purple-500/20 animate-pulse'
                : 'bg-slate-100 dark:bg-slate-800'
            }`}
          />
          <div
            className={`absolute w-44 h-44 rounded-full border transition-all duration-500 ${
              isListening
                ? 'border-blue-400/50 scale-105'
                : isSpeaking
                ? 'border-purple-400/60 scale-110'
                : 'border-slate-200 dark:border-slate-700'
            }`}
          />

          {/* Central Blue-Purple Gradient Sphere */}
          <div
            className="w-32 h-32 rounded-full flex items-center justify-center shadow-xl transition-transform active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
              boxShadow: '0 10px 30px -5px rgba(59, 130, 246, 0.5)'
            }}
          >
            <Mic className="w-14 h-14 text-white stroke-[2]" />
          </div>
        </div>

        {/* Dynamic Voice Waveform Equalizer Bars */}
        <div className="w-full flex items-center justify-center gap-1.5 h-12 my-2">
          {Array.from({ length: 24 }).map((_, i) => {
            const height = isListening || isSpeaking
              ? Math.max(8, (Math.sin(i * 0.4 + Date.now() * 0.005) + 1) * 20 + (i % 3) * 6)
              : 6;

            return (
              <div
                key={i}
                className={`w-1 rounded-full transition-all duration-150 ${
                  isSpeaking
                    ? 'bg-purple-500'
                    : isListening
                    ? 'bg-blue-500'
                    : 'bg-slate-300 dark:bg-slate-700'
                }`}
                style={{
                  height: `${height}px`,
                  animation: (isListening || isSpeaking) ? `pulse 0.8s ease-in-out infinite ${(i * 0.06).toFixed(2)}s` : 'none'
                }}
              />
            );
          })}
        </div>

        {/* State Label & Subtitle */}
        <div className="my-2">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            {isSpeaking ? 'Speaking...' : isListening ? 'Listening...' : 'Tap to Start'}
          </h3>
          <p className="text-xs text-slate-400 font-medium mt-1">
            {isListening || isSpeaking ? 'Tap to stop' : 'Tap the microphone or button to talk'}
          </p>

          {/* Transcript feedback */}
          <p className="text-xs text-slate-600 dark:text-slate-300 italic mt-3 max-w-xs line-clamp-2 px-2">
            "{isSpeaking ? aiSpeechResponse : transcript}"
          </p>
        </div>

        {/* Stop Button (Circular Red with White Square) - EXACT MATCH TO REFERENCE SCREENSHOT 5 */}
        <div className="my-4">
          <button
            onClick={handleToggleListening}
            aria-label={isListening || isSpeaking ? 'Stop voice recording' : 'Start voice recording'}
            className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30 flex items-center justify-center text-white transition-transform active:scale-90 cursor-pointer"
          >
            {isListening || isSpeaking ? (
              <Square className="w-6 h-6 fill-white" />
            ) : (
              <Mic className="w-7 h-7" />
            )}
          </button>
        </div>

        {/* Bottom Selectors Pill Bar matching screenshot: [Urdu v] [Female v] */}
        <div className="w-full flex items-center justify-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          {/* Language Selector Pill */}
          <div className="relative">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value as Language)}
              aria-label="Select voice language"
              className="appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold py-2 pl-8 pr-7 rounded-full cursor-pointer hover:bg-slate-100"
            >
              <option value="ur">Urdu (اردو)</option>
              <option value="en">English</option>
              <option value="hi">Hindi (हिंदी)</option>
              <option value="ps">Pashto (پښتو)</option>
            </select>
            <Globe className="w-3.5 h-3.5 text-blue-600 absolute left-3 top-2.5 pointer-events-none" />
            <span className="text-[10px] text-slate-400 absolute right-2.5 top-2.5 pointer-events-none">▼</span>
          </div>

          {/* Gender Selector Pill */}
          <div className="relative">
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value as 'female' | 'male')}
              aria-label="Select voice gender"
              className="appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold py-2 pl-8 pr-7 rounded-full cursor-pointer hover:bg-slate-100"
            >
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>
            <User className="w-3.5 h-3.5 text-purple-600 absolute left-3 top-2.5 pointer-events-none" />
            <span className="text-[10px] text-slate-400 absolute right-2.5 top-2.5 pointer-events-none">▼</span>
          </div>
        </div>
      </div>
    </div>
  );
};
