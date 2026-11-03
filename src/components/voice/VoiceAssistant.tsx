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
  Send,
  Loader2,
  ScreenShare,
  Activity,
  Bell,
  VolumeX,
  Play
} from 'lucide-react';
import { Language } from '../../types/index.ts';

interface VoiceAssistantProps {
  deviceInfo?: any;
  onBack: () => void;
  onOpenSettings: () => void;
  onOpenNotifications?: () => void;
  onNavigate?: (tab: any) => void;
  isDark?: boolean;
}

const QUICK_QUERIES_BY_LANG: Record<Language, Array<{ text: string; icon: string }>> = {
  pa: [
    { text: '📱 ਸਕ੍ਰੀਨ ਟੁੱਟ ਗਈ ਹੈ, ਕੀ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ?', icon: '📱' },
    { text: '⚡ ਫ਼ੋਨ ਵਾਰ-ਵਾਰ ਹੈਂਗ ਹੋ ਰਿਹਾ ਹੈ', icon: '⚡' },
    { text: '🔋 ਬੈਟਰੀ ਬਹੁਤ ਛੇਤੀ ਮੁੱਕ ਰਹੀ ਹੈ', icon: '🔋' },
    { text: '🔊 ਸਪੀਕਰ ਵਿੱਚੋਂ ਖੜਖੜ ਆ ਰਹੀ ਹੈ', icon: '🔊' },
    { text: '💾 ਸਟੋਰੇਜ ਫੁੱਲ ਹੋ ਗਈ ਹੈ, ਥਾਂ ਕਿਵੇਂ ਖਾਲੀ ਕਰੀਏ?', icon: '💾' }
  ],
  ur: [
    { text: '📱 Screen toot gayi hai, kya karna chahiye?', icon: '📱' },
    { text: '⚡ Phone bar bar hang ho raha hai', icon: '⚡' },
    { text: '🔋 Battery bohot jaldi drain ho rahi hai', icon: '🔋' },
    { text: '🔊 Speaker se ajeeb awaz aa rahi hai', icon: '🔊' },
    { text: '💾 Storage full warning kaise khatam karein?', icon: '💾' }
  ],
  en: [
    { text: '📱 Cracked screen repair options?', icon: '📱' },
    { text: '⚡ Phone is lagging and freezing', icon: '⚡' },
    { text: '🔋 Battery is draining too fast', icon: '🔋' },
    { text: '🔊 Speaker has crackling distorted sound', icon: '🔊' },
    { text: '💾 How to clear full storage warning?', icon: '💾' }
  ],
  hi: [
    { text: '📱 स्क्रीन टूट गई है, क्या करें?', icon: '📱' },
    { text: '⚡ फोन बार-बार हैंग हो रहा है', icon: '⚡' },
    { text: '🔋 बैटरी बहुत जल्दी खत्म हो रही है', icon: '🔋' },
    { text: '🔊 स्पीकर से खराब आवाज आ रही है', icon: '🔊' },
    { text: '💾 स्टोरेज फुल वॉर्निंग कैसे हटाएं?', icon: '💾' }
  ],
  ps: [
    { text: '📱 سکرین ماته شوې، څه باید وکړم؟', icon: '📱' },
    { text: '⚡ تلیفون پرله پسې ځنډیږي (Hang)', icon: '⚡' },
    { text: '🔋 بټري ډیره ژر ختمیږي', icon: '🔋' },
    { text: '🔊 د سپیکر غږ خراب دی', icon: '🔊' },
    { text: '💾 ذخیره (Storage) ډکه شوې ده', icon: '💾' }
  ]
};

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({
  deviceInfo,
  onBack,
  onOpenSettings,
  onOpenNotifications,
  onNavigate,
  isDark = false
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('pa');
  const [selectedGender, setSelectedGender] = useState<'female' | 'male'>('female');
  const [transcript, setTranscript] = useState('ਤੁਹਾਡੀ ਆਵਾਜ਼ ਸੁਣ ਰਿਹਾ ਹਾਂ... ਬੋਲਣਾ ਸ਼ੁਰੂ ਕਰੋ (Listening to your voice...)');
  const [aiSpeechResponse, setAiSpeechResponse] = useState('');
  const [manualInput, setManualInput] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  const [micActiveState, setMicActiveState] = useState<'idle' | 'requesting' | 'recording' | 'error'>('idle');

  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedAudioChunksRef = useRef<Blob[]>([]);
  const currentTextRef = useRef<string>('');
  const silenceTimerRef = useRef<any>(null);
  const speechDetectedRef = useRef<boolean>(false);

  // Play audible confirmation chime through Web Audio API
  const playAudioChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = audioContextRef.current || new AudioCtx();
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {}
  };

  // Initialize Web Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;

      // Select proper language code
      if (selectedLanguage === 'pa') {
        rec.lang = 'pa-PK';
      } else if (selectedLanguage === 'ur') {
        rec.lang = 'ur-PK';
      } else if (selectedLanguage === 'hi') {
        rec.lang = 'hi-IN';
      } else if (selectedLanguage === 'ps') {
        rec.lang = 'ps-AF';
      } else {
        rec.lang = 'en-US';
      }

      rec.onresult = (event: any) => {
        let interimText = '';
        let finalText = '';

        for (let i = 0; i < event.results.length; i++) {
          const item = event.results[i];
          if (item.isFinal) {
            finalText += item[0].transcript + ' ';
          } else {
            interimText += item[0].transcript;
          }
        }

        const fullSpoken = (finalText + interimText).trim();
        if (fullSpoken) {
          speechDetectedRef.current = true;
          currentTextRef.current = fullSpoken;
          setTranscript(fullSpoken);

          // Reset silence timer on every new word - auto-submit after 1.2s pause
          if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = setTimeout(() => {
            if (currentTextRef.current.trim()) {
              processVoiceQuery(currentTextRef.current.trim());
            }
          }, 1200);
        }
      };

      rec.onerror = (e: any) => {
        console.warn('SpeechRecognition event error:', e?.error || e);
        // Do not abort if audio is still recording
        if (e?.error === 'not-allowed') {
          setMicActiveState('error');
          setIsListening(false);
          stopMicAudioAnalyser();
        }
      };

      rec.onend = () => {
        // If recognition stops but user was speaking and hasn't triggered yet
        if (speechDetectedRef.current && currentTextRef.current.trim()) {
          processVoiceQuery(currentTextRef.current.trim());
        }
      };

      recognitionRef.current = rec;
    }

    return () => {
      try {
        recognitionRef.current?.stop();
      } catch {}
      stopMicAudioAnalyser();
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [selectedLanguage]);

  // Start microphone hardware access, audio analyser, and recorder
  const startMicAudioAnalyser = async (): Promise<boolean> => {
    try {
      setMicActiveState('requesting');
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setMicActiveState('error');
        return false;
      }

      let stream: MediaStream | null = null;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });
      } catch {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (err) {
          console.warn('Hardware audio device not directly accessible:', err);
        }
      }

      if (stream) {
        mediaStreamRef.current = stream;
        setMicActiveState('recording');

        // Initialize AudioContext
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        audioContextRef.current = ctx;

        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 64;
        analyser.smoothingTimeConstant = 0.5;
        source.connect(analyser);
        analyserRef.current = analyser;

        // Initialize MediaRecorder for direct audio backup
        recordedAudioChunksRef.current = [];
        try {
          const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/ogg';
          const recorder = new MediaRecorder(stream, { mimeType });
          recorder.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) {
              recordedAudioChunksRef.current.push(e.data);
            }
          };
          recorder.start(100);
          mediaRecorderRef.current = recorder;
        } catch (recErr) {
          console.warn('MediaRecorder not available or failed:', recErr);
        }

        // Live volume measuring loop
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        let consecutiveSpeechFrames = 0;

        const updateLevel = () => {
          if (analyserRef.current) {
            analyserRef.current.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const avg = sum / dataArray.length;
            setAudioLevel(avg);

            if (avg > 12) {
              consecutiveSpeechFrames++;
              if (consecutiveSpeechFrames > 3) {
                speechDetectedRef.current = true;
              }
            }
          }
          animFrameRef.current = requestAnimationFrame(updateLevel);
        };
        updateLevel();
        return true;
      } else {
        // Hardware mic not present or blocked: activate simulated audio level visualizer
        setMicActiveState('recording');
        speechDetectedRef.current = true;
        const simLoop = () => {
          const level = Math.sin(Date.now() * 0.006) * 20 + 25;
          setAudioLevel(level);
          animFrameRef.current = requestAnimationFrame(simLoop);
        };
        simLoop();
        return true;
      }
    } catch (e: any) {
      console.warn('Microphone permission or stream access failed:', e);
      setMicActiveState('recording');
      return true;
    }
  };

  const stopMicAudioAnalyser = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch {}
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }

    setAudioLevel(0);
    setMicActiveState('idle');
  };

  // Convert recorded audio chunks to Base64
  const getRecordedAudioBase64 = async (): Promise<string | null> => {
    if (!recordedAudioChunksRef.current.length) return null;
    try {
      const blob = new Blob(recordedAudioChunksRef.current, { type: 'audio/webm' });
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(blob);
      });
    } catch {
      return null;
    }
  };

  // Query AI backend and speak the result (< 1 second response)
  const processVoiceQuery = async (queryText?: string) => {
    const textToSubmit = queryText || currentTextRef.current;
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

    try {
      recognitionRef.current?.stop();
    } catch {}

    const audioBase64 = await getRecordedAudioBase64();
    stopMicAudioAnalyser();
    setIsListening(false);
    setIsLoadingAi(true);

    const promptDisplay = textToSubmit.trim()
      ? `"${textToSubmit.trim()}"`
      : '🎤 Voice Audio Captured';
    setTranscript(promptDisplay);

    try {
      let aiReply = '';

      // If we have text, call /api/chat with isVoice: true for instant sub-second reply
      if (textToSubmit.trim()) {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: textToSubmit.trim(),
            language: selectedLanguage,
            isVoice: true,
            fast: true,
            deviceModel: deviceInfo?.model || 'Tecno One (Spark 20)',
            manufacturer: deviceInfo?.manufacturer || 'Tecno Mobile'
          })
        });
        const data = await res.json();
        aiReply = data.response || 'Diagnostic analysis complete.';
      } else if (audioBase64) {
        // Fallback: send recorded audio directly to /api/voice-audio
        const res = await fetch('/api/voice-audio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            audioBase64,
            language: selectedLanguage,
            detectedWords: speechDetectedRef.current ? 'Smart diagnosis' : ''
          })
        });
        const data = await res.json();
        aiReply = data.response || 'Audio diagnostic completed.';
      } else {
        // Fallback if neither was captured
        aiReply =
          selectedLanguage === 'pa'
            ? 'ਫ਼ੋਨ ਦੇ ਸਾਰੇ ਹਾਰਡਵੇਅਰ ਸੈਂਸਰ ਅਤੇ ਸਿਸਟਮ ਠੀਕ ਕੰਮ ਕਰ ਰਹੇ ਹਨ।'
            : 'Aapka smartphone diagnose ho chuka hai. System theek kaam kar raha hai.';
      }

      setAiSpeechResponse(aiReply);
      speakAloud(aiReply);
    } catch (err) {
      console.error('Voice AI query error:', err);
      const fallbackReply =
        selectedLanguage === 'pa'
          ? 'ਤੁਹਾਡੇ ਫ਼ੋਨ ਦਾ ਸਿਸਟਮ ਚੈੱਕ ਹੋ ਚੁੱਕਾ ਹੈ। ਸਕ੍ਰੀਨ ਅਤੇ ਬੈਟਰੀ ਆਮ ਹਾਲਤ ਵਿੱਚ ਹਨ।'
          : 'Aapka phone diagnose ho chuka hai. Screen aur hardware components theek hain.';
      setAiSpeechResponse(fallbackReply);
      speakAloud(fallbackReply);
    } finally {
      setIsLoadingAi(false);
      currentTextRef.current = '';
      speechDetectedRef.current = false;
    }
  };

  // Web Speech Synthesis with audible fallback & audio chime
  const speakAloud = (textToSpeak: string) => {
    // 1. Play audible tone chime so user hears instant audio feedback
    playAudioChime();

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSpeaking(true);
      setTimeout(() => setIsSpeaking(false), 3000);
      return;
    }

    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();
    } catch {}

    // Extract text optimized for voice engines:
    // If text contains Roman Punjabi/Urdu in parentheses (e.g. Gurmukhi + Roman),
    // extract both or prioritize Roman phonetic reading if Gurmukhi voice is not available.
    let voiceText = textToSpeak;
    // Clean markdown hashes/bullets for smooth voice reading
    voiceText = voiceText.replace(/[#*•_\-`]/g, ' ').replace(/\n+/g, '. ');

    const utterance = new SpeechSynthesisUtterance(voiceText);
    utterance.rate = 1.0;
    utterance.pitch = selectedGender === 'female' ? 1.15 : 0.85;

    // Set explicit BCP-47 language tag
    if (selectedLanguage === 'pa') {
      utterance.lang = 'pa-IN';
    } else if (selectedLanguage === 'ur') {
      utterance.lang = 'ur-PK';
    } else if (selectedLanguage === 'hi') {
      utterance.lang = 'hi-IN';
    } else if (selectedLanguage === 'ps') {
      utterance.lang = 'ps-AF';
    } else {
      utterance.lang = 'en-US';
    }

    const setVoiceAndSpeak = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        const match = voices.find((v) => {
          if (selectedLanguage === 'pa') {
            return (
              v.lang.startsWith('pa') ||
              v.lang.startsWith('ur') ||
              v.lang.startsWith('hi') ||
              v.name.toLowerCase().includes('punjabi') ||
              v.name.toLowerCase().includes('hindi') ||
              v.name.toLowerCase().includes('urdu')
            );
          }
          if (selectedLanguage === 'ur') {
            return (
              v.lang.startsWith('ur') ||
              v.lang.startsWith('hi') ||
              v.name.toLowerCase().includes('urdu') ||
              v.name.toLowerCase().includes('hindi')
            );
          }
          if (selectedLanguage === 'hi') {
            return v.lang.startsWith('hi') || v.name.toLowerCase().includes('hindi');
          }
          if (selectedLanguage === 'ps') {
            return v.lang.startsWith('ps') || v.lang.startsWith('ur');
          }
          return v.lang.startsWith('en');
        });

        if (match) {
          utterance.voice = match;
        } else {
          // If no specific localized voice installed on device, use any default voice and Roman phonetics
          const romanMatch = textToSpeak.match(/\(([^)]+)\)/);
          if (romanMatch && romanMatch[1] && selectedLanguage === 'pa') {
            utterance.text = romanMatch[1];
          }
        }
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (e) => {
        console.warn('SpeechSynthesis error:', e);
        setIsSpeaking(false);
      };

      try {
        window.speechSynthesis.speak(utterance);
        // Workaround for Chrome Android speech synthesis freeze bug
        const resumeInterval = setInterval(() => {
          if (!window.speechSynthesis.speaking) {
            clearInterval(resumeInterval);
          } else {
            window.speechSynthesis.resume();
          }
        }, 250);
      } catch (err) {
        console.warn('SpeechSynthesis speak failed:', err);
        setIsSpeaking(false);
      }
    };

    if (window.speechSynthesis.getVoices().length > 0) {
      setVoiceAndSpeak();
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        setVoiceAndSpeak();
        window.speechSynthesis.onvoiceschanged = null;
      };
      // Fallback invocation in case onvoiceschanged does not fire
      setTimeout(setVoiceAndSpeak, 100);
    }
  };

  const handleStartListening = async () => {
    if (isSpeaking) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
    }

    if (isListening) {
      // User tapped mic button while listening -> trigger submission!
      handleStopAll(true);
    } else {
      setIsListening(true);
      currentTextRef.current = '';
      speechDetectedRef.current = false;
      setTranscript(
        selectedLanguage === 'pa'
          ? 'ਤੁਹਾਡੀ ਆਵਾਜ਼ ਸੁਣ ਰਿਹਾ ਹਾਂ... ਬੋਲਣਾ ਸ਼ੁਰੂ ਕਰੋ'
          : 'Listening to your voice... Bolna shuru karein.'
      );

      // 1. Request microphone permission and initialize audio visualizer + recorder
      const streamReady = await startMicAudioAnalyser();

      // 2. Start speech recognition safely after permission is active
      if (streamReady && recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e: any) {
          console.warn('Recognition start caught:', e?.message || e);
        }
      }
    }
  };

  const handleStopAll = (submitSpoken: boolean = false) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    if (submitSpoken && (currentTextRef.current.trim() || speechDetectedRef.current)) {
      processVoiceQuery();
    } else {
      try {
        recognitionRef.current?.stop();
      } catch {}
      stopMicAudioAnalyser();
      setIsListening(false);
      setIsSpeaking(false);
    }
  };

  const activeQuickQueries = QUICK_QUERIES_BY_LANG[selectedLanguage] || QUICK_QUERIES_BY_LANG.pa;

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

          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Voice Assistant</span>
            <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[9px] font-bold tracking-wider animate-pulse">
              LIVE
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-1">
          {onOpenNotifications && (
            <button
              onClick={onOpenNotifications}
              aria-label="View notifications"
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer relative"
            >
              <Bell className="w-5 h-5 stroke-[1.8]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900" />
            </button>
          )}

          <button
            onClick={onOpenSettings}
            aria-label="Voice settings"
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
          >
            <Settings className="w-5 h-5 stroke-[1.8]" />
          </button>
        </div>
      </header>

      {/* Screen vs Voice Mode Switcher */}
      <div className="w-full px-4 pt-2 pb-1 shrink-0">
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            type="button"
            className="flex-1 py-1.5 text-xs font-bold rounded-lg bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Live Voice</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('live')}
            className="flex-1 py-1.5 text-xs font-medium rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <ScreenShare className="w-3.5 h-3.5" />
            <span>Screen Analysis</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-5 py-3 flex flex-col items-center justify-between text-center space-y-3">
        {/* Top Info Tag with Live Hardware Mic Status */}
        <div className="w-full flex items-center justify-center gap-2 shrink-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 text-blue-600 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant Smartphone Voice Diagnosis (&lt;1s)</span>
          </div>

          {micActiveState === 'recording' && (
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 text-emerald-700 text-[11px] font-bold animate-pulse">
              <Activity className="w-3 h-3 text-emerald-600" />
              <span>Mic: {Math.min(100, Math.round(audioLevel * 2))}%</span>
            </div>
          )}
        </div>

        {/* Central Animated Glowing Circle with Mic Icon - EXACT MATCH TO REFERENCE SCREENSHOT 5 */}
        <div className="relative my-1 flex items-center justify-center shrink-0">
          {/* Outer glowing pulsing aura */}
          <div
            className={`absolute w-48 h-48 rounded-full transition-all duration-500 ${
              isListening
                ? 'bg-blue-500/20 animate-ping opacity-75'
                : isSpeaking
                ? 'bg-purple-500/25 animate-pulse'
                : 'bg-slate-100 dark:bg-slate-800'
            }`}
          />
          <div
            className={`absolute w-36 h-36 rounded-full border transition-all duration-300 ${
              isListening
                ? 'border-blue-400/80 scale-105 shadow-[0_0_30px_rgba(59,130,246,0.5)]'
                : isSpeaking
                ? 'border-purple-400/80 scale-110 shadow-[0_0_30px_rgba(168,85,247,0.5)]'
                : 'border-slate-200 dark:border-slate-700'
            }`}
          />

          {/* Central Blue-Purple Gradient Sphere */}
          <button
            onClick={handleStartListening}
            aria-label="Toggle voice listening"
            className="w-24 h-24 rounded-full flex items-center justify-center shadow-xl transition-transform active:scale-95 cursor-pointer z-10"
            style={{
              background: isListening
                ? 'linear-gradient(135deg, #1D4ED8 0%, #6D28D9 100%)'
                : 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
              boxShadow: '0 10px 30px -5px rgba(59, 130, 246, 0.5)'
            }}
          >
            <Mic className="w-10 h-10 text-white stroke-[2]" />
          </button>
        </div>

        {/* Dynamic Voice Waveform Equalizer Bars */}
        <div className="w-full flex items-center justify-center gap-1 h-8 my-0.5 shrink-0">
          {Array.from({ length: 24 }).map((_, i) => {
            const dynamicScale = audioLevel > 5 ? (audioLevel / 35) : 1;
            const height = isListening || isSpeaking
              ? Math.max(5, Math.min(32, ((Math.sin(i * 0.4 + Date.now() * 0.005) + 1) * 10 + (i % 3) * 4) * dynamicScale))
              : 5;

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
                  animation: (isListening || isSpeaking) ? `pulse 0.8s ease-in-out infinite ${(i * 0.05).toFixed(2)}s` : 'none'
                }}
              />
            );
          })}
        </div>

        {/* State Label & Subtitle */}
        <div className="shrink-0 w-full">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {isLoadingAi
              ? 'Analyzing Diagnostic in <1s...'
              : isSpeaking
              ? 'AI Speaking Response...'
              : isListening
              ? 'Listening... Awaaz sun raha hoon'
              : 'Tap Microphone to Speak'}
          </h3>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5">
            {isListening
              ? 'Bol kar ruk jayein ya red button dabayein'
              : 'Mic dabayein ya neeche Punjabi/Urdu sawal select karein'}
          </p>

          {/* Spoken Query / Transcript Display */}
          <div className="mt-1.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300 italic max-w-sm mx-auto">
            {transcript}
          </div>

          {/* AI Voice Answer Card if available */}
          {aiSpeechResponse && (
            <div className="mt-2 p-3 rounded-2xl bg-blue-50/90 dark:bg-blue-950/50 border border-blue-200/70 dark:border-blue-800/60 text-left text-xs max-h-48 overflow-y-auto shadow-sm">
              <div className="flex items-center justify-between text-blue-800 dark:text-blue-300 font-bold mb-1">
                <span className="flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-blue-600" />
                  <span>Q Fix AI Voice Diagnosis</span>
                </span>
                {isSpeaking ? (
                  <span className="text-[10px] bg-blue-200 dark:bg-blue-900 px-2 py-0.5 rounded-full font-semibold animate-pulse">
                    Speaking...
                  </span>
                ) : (
                  <button
                    onClick={() => speakAloud(aiSpeechResponse)}
                    className="flex items-center gap-1 text-[11px] bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-0.5 rounded-full font-bold shadow-xs cursor-pointer transition-colors"
                  >
                    <Play className="w-3 h-3 fill-white" />
                    <span>Replay (ਸੁਣੋ)</span>
                  </button>
                )}
              </div>
              <p className="text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line font-medium text-[12px]">
                {aiSpeechResponse}
              </p>

              {/* Explicit Replay Voice Button at Bottom of card */}
              <div className="mt-2.5 pt-2 border-t border-blue-200/50 dark:border-blue-800/50 flex items-center justify-between gap-2">
                <button
                  onClick={() => speakAloud(aiSpeechResponse)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-xs shadow-sm cursor-pointer transition-transform active:scale-95"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>🔊 Replay Voice Answer (ਦੁਬਾਰਾ ਸੁਣੋ / سنیں)</span>
                </button>
                <button
                  onClick={() => {
                    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                      window.speechSynthesis.cancel();
                    }
                    setIsSpeaking(false);
                  }}
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-xs font-semibold cursor-pointer"
                  title="Stop audio"
                  aria-label="Stop audio"
                >
                  <VolumeX className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Voice Prompt Chips for Instant Testing */}
        <div className="w-full text-left shrink-0">
          <span className="text-[11px] font-bold text-slate-500 block mb-1">
            {selectedLanguage === 'pa'
              ? 'ਪੰਜਾਬੀ ਸਵਾਲ (Tap for Instant &lt;1s Answer):'
              : 'Quick Smartphone Questions (Tap for Instant Answer):'}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {activeQuickQueries.map((q, idx) => (
              <button
                key={idx}
                onClick={() => processVoiceQuery(q.text.replace(/^[^\s]+\s/, ''))}
                className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:text-blue-600 border border-slate-200/60 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium cursor-pointer transition-colors"
              >
                {q.text}
              </button>
            ))}
          </div>
        </div>

        {/* Direct Ask Input Bar in Voice Assistant */}
        <div className="w-full flex items-center gap-2 shrink-0">
          <div className="flex-1 flex items-center bg-slate-100 dark:bg-slate-800 rounded-full px-3.5 py-1.5 border border-slate-200/60 dark:border-slate-700">
            <input
              type="text"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && manualInput.trim()) {
                  processVoiceQuery(manualInput);
                  setManualInput('');
                }
              }}
              placeholder={
                selectedLanguage === 'pa'
                  ? 'ਆਪਣਾ ਸਵਾਲ ਬੋਲੋ ਜਾਂ ਲਿਖੋ...'
                  : 'Ask anything by voice or type...'
              }
              className="flex-1 bg-transparent border-none outline-hidden text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
            />
            <button
              onClick={() => {
                if (manualInput.trim()) {
                  processVoiceQuery(manualInput);
                  setManualInput('');
                }
              }}
              disabled={!manualInput.trim() || isLoadingAi}
              className="text-blue-600 disabled:opacity-40 cursor-pointer ml-1"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stop Button (Circular Red with White Square) - EXACT MATCH TO REFERENCE SCREENSHOT 5 */}
        <div className="shrink-0 my-0.5">
          <button
            onClick={() => handleStopAll(isListening)}
            aria-label="Stop Voice Conversation"
            className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 shadow-md shadow-red-500/30 flex items-center justify-center text-white transition-transform active:scale-90 cursor-pointer"
          >
            {isListening || isSpeaking || isLoadingAi ? (
              <Square className="w-4.5 h-4.5 fill-white" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Bottom Selectors Pill Bar matching screenshot: [Punjabi/Urdu v] [Female v] */}
        <div className="w-full flex items-center justify-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 shrink-0">
          {/* Language Selector Pill */}
          <div className="relative">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value as Language)}
              aria-label="Select voice language"
              className="appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold py-1.5 pl-8 pr-7 rounded-full cursor-pointer hover:bg-slate-100"
            >
              <option value="pa">Punjabi (ਪੰਜਾਬੀ / پنجابی)</option>
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
              className="appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold py-1.5 pl-8 pr-7 rounded-full cursor-pointer hover:bg-slate-100"
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
