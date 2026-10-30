import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronLeft,
  Bell,
  Plus,
  Mic,
  MicOff,
  Send,
  Copy,
  Volume2,
  RotateCw,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Check,
  X,
  Loader2,
  Wrench,
  AlertTriangle
} from 'lucide-react';
import { QFixLogo } from '../common/QFixLogo.tsx';
import { AttachmentModal } from './AttachmentModal.tsx';
import { CameraModal } from './CameraModal.tsx';
import { ChatMessage, AppTab, Language } from '../../types/index.ts';

interface AIChatBoardProps {
  onBack: () => void;
  onNavigate: (tab: AppTab) => void;
  onOpenNotifications: () => void;
  language?: Language;
  isDark?: boolean;
}

const CRACKED_SCREEN_SAMPLE = 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80';

export const AIChatBoard: React.FC<AIChatBoardProps> = ({
  onBack,
  onNavigate,
  onOpenNotifications,
  language = 'ur',
  isDark = false
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'user',
      text: 'Mera phone bar bar hang ho raha hai, is ka kya reason ho sakta hai?',
      timestamp: '09:20 AM'
    },
    {
      id: 'msg-2',
      sender: 'ai',
      text: `Phones ke hang hone ki kai wajahen ho sakti hain. Aam tor par yeh masail ki wajah se hota hai:

1.  Zyada apps background mein chalna
2.  RAM ki kami
3.  Storage full hona
4.  Software update ki zarurat
5.  Malware ya harmful apps

Solution:
• Unused apps band karen
• Cache clear karen
• Phone restart karen
• Agar masla jari rahe to factory reset ka option bhi try kar sakte hain.`,
      timestamp: '09:23 AM',
      options: [
        'Storage cache clear karen',
        'RAM audit scan chalayein',
        'Background apps band karen'
      ]
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAttachmentOpen, setIsAttachmentOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Speech Recognition setup
  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = language === 'ur' ? 'ur-PK' : language === 'hi' ? 'hi-IN' : 'en-US';

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      rec.onerror = () => {
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, [language]);

  const toggleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (err) {
        console.warn('SpeechRecognition error:', err);
      }
    }
  };

  const handleSend = async (customText?: string, attachmentData?: { url: string; name: string }) => {
    const textToSend = customText !== undefined ? customText : inputText;
    if (!textToSend.trim() && !attachmentData) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsgId = 'user-' + Date.now();

    const newMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: textToSend,
      timestamp: timeStr,
      attachment: attachmentData
        ? {
            type: 'image',
            url: attachmentData.url,
            name: attachmentData.name
          }
        : undefined
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          image: attachmentData?.url,
          language
        })
      });

      const data = await response.json();

      const aiMsgId = 'ai-' + Date.now();
      const aiReplyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setMessages((prev) => [
        ...prev,
        {
          id: aiMsgId,
          sender: 'ai',
          text: data.response || 'Diagnostic complete.',
          timestamp: aiReplyTime,
          options: data.options,
          repairPlan: data.repairPlan
        }
      ]);
    } catch (err) {
      console.error('Chat error:', err);
      // Fallback
      setMessages((prev) => [
        ...prev,
        {
          id: 'ai-err-' + Date.now(),
          sender: 'ai',
          text: 'Masla diagnose ho chuka hai. Kripya apne hardware test aur software checks run karein.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleReadAloud = (text: string, id: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;

    // Pick Urdu/Hindi or English voice if available
    const voices = window.speechSynthesis.getVoices();
    const urVoice = voices.find((v) => v.lang.includes('ur') || v.lang.includes('hi'));
    if (urVoice) utterance.voice = urVoice;

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const handleLikeDislike = (id: string, type: 'like' | 'dislike') => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === id) {
          return {
            ...msg,
            liked: type === 'like' ? !msg.liked : false,
            disliked: type === 'dislike' ? !msg.disliked : false
          };
        }
        return msg;
      })
    );
  };

  // Sample screenshot cracked screen demo (matching Screen 6 from reference!)
  const triggerCrackedScreenSample = () => {
    handleSend('Ye dekho meri screen ka ye masla hai, kya yeh theek ho sakta hai?', {
      url: CRACKED_SCREEN_SAMPLE,
      name: 'broken_screen_photo.jpg'
    });
  };

  return (
    <div className={`w-full flex flex-col h-[calc(100vh-64px)] max-w-md mx-auto relative ${isDark ? 'bg-slate-900 text-white' : 'bg-[#FAFAFC] text-slate-900'}`}>
      {/* Top Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            aria-label="Back to dashboard"
            className="p-1.5 -ml-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2]" />
          </button>

          <QFixLogo size={32} showText subtitle="AI Chat Board" />
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onOpenNotifications}
            aria-label="Open notifications"
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
          >
            <Bell className="w-5 h-5 stroke-[1.8]" />
          </button>
        </div>
      </header>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';

          if (isUser) {
            return (
              <div key={msg.id} className="flex flex-col items-end pl-10 space-y-1">
                {/* Image attachment if present */}
                {msg.attachment && (
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm max-w-[260px] mb-1">
                    <img
                      src={msg.attachment.url}
                      alt={msg.attachment.name}
                      className="w-full h-auto object-cover max-h-56"
                    />
                  </div>
                )}

                {/* User Message Bubble matching screenshot gradient */}
                <div className="py-2.5 px-4 rounded-2xl rounded-tr-xs bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm text-sm font-medium leading-relaxed">
                  {msg.text}
                </div>
                <span className="text-[10px] text-slate-400 font-medium pr-1">
                  {msg.timestamp}
                </span>
              </div>
            );
          }

          // AI Message Bubble
          return (
            <div key={msg.id} className="flex items-start gap-2.5 pr-8">
              {/* Q Logo Avatar */}
              <div className="shrink-0 mt-0.5">
                <QFixLogo size={28} />
              </div>

              <div className="flex-1 min-w-0 space-y-2">
                {/* Bubble Body */}
                <div
                  className={`p-3.5 rounded-2xl rounded-tl-xs border transition-all ${
                    isDark
                      ? 'bg-slate-800/90 border-slate-700 text-slate-100'
                      : 'bg-white border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] text-slate-800'
                  } text-[13px] leading-relaxed whitespace-pre-line`}
                >
                  {msg.text}

                  {/* Repair plan banner if flagged as hardware / severe */}
                  {msg.repairPlan && (
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white mb-1.5">
                        <Wrench className="w-3.5 h-3.5 text-blue-600" />
                        <span>Repair Assessment</span>
                        {msg.repairPlan.requiresTechnician && (
                          <span className="ml-auto px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 text-[10px] font-semibold">
                            Technician Recommended
                          </span>
                        )}
                      </div>
                      <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                        {msg.repairPlan.recommendations.map((rec, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-blue-500 font-bold">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* AI Response Action Buttons matching screenshot */}
                <div className="flex items-center gap-2 pt-0.5 text-slate-400">
                  <button
                    onClick={() => handleCopy(msg.text, msg.id)}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-medium transition-colors cursor-pointer"
                    title="Copy Response"
                  >
                    {copiedId === msg.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-600 font-semibold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleReadAloud(msg.text, msg.id)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-medium transition-colors cursor-pointer ${
                      speakingId === msg.id ? 'text-blue-600 bg-blue-50 dark:bg-blue-950/60' : ''
                    }`}
                    title="Read Aloud"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{speakingId === msg.id ? 'Stop' : 'Read Aloud'}</span>
                  </button>

                  <button
                    onClick={() => handleSend(messages[messages.length - 2]?.text || 'Help with phone')}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-medium transition-colors cursor-pointer"
                    title="Regenerate"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Regenerate</span>
                  </button>

                  <div className="ml-auto flex items-center gap-1">
                    <button
                      onClick={() => handleLikeDislike(msg.id, 'like')}
                      className={`p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer ${
                        msg.liked ? 'text-blue-600 bg-blue-50' : 'text-slate-400'
                      }`}
                      aria-label="Like"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleLikeDislike(msg.id, 'dislike')}
                      className={`p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer ${
                        msg.disliked ? 'text-red-600 bg-red-50' : 'text-slate-400'
                      }`}
                      aria-label="Dislike"
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({ title: 'Q Fix AI Diagnosis', text: msg.text });
                        } else {
                          handleCopy(msg.text, msg.id);
                        }
                      }}
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-slate-400"
                      aria-label="Share"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <span className="text-[10px] text-slate-400 font-medium pl-1 block">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-center gap-2.5 text-slate-400 text-xs py-2">
            <QFixLogo size={24} />
            <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]"></span>
              <span className="text-[11px] text-slate-500 ml-1 font-medium">
                Q Fix AI is diagnosing...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Attachment Shortcuts / Sample Prompt Bar */}
      <div className="px-4 py-1.5 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
        <button
          onClick={triggerCrackedScreenSample}
          className="shrink-0 px-3 py-1 rounded-full bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 font-semibold text-[11px] hover:bg-blue-100 cursor-pointer transition-colors"
        >
          📱 Test Cracked Screen Diagnosis
        </button>
        <button
          onClick={() => handleSend('Mera phone bohot garam ho raha hai charge karte waqt')}
          className="shrink-0 px-3 py-1 rounded-full bg-purple-50 dark:bg-slate-800 border border-purple-200 dark:border-slate-700 text-purple-600 dark:text-purple-400 font-semibold text-[11px] hover:bg-purple-100 cursor-pointer transition-colors"
        >
          🔥 Overheating & Battery Drain
        </button>
      </div>

      {/* Bottom Message Input Bar matching screenshot */}
      <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
        {/* Plus (+) Attachment Button */}
        <button
          type="button"
          onClick={() => setIsAttachmentOpen(true)}
          aria-label="Add Attachment"
          className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-sm hover:bg-blue-700 transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* Input Pill */}
        <div className="flex-1 flex items-center bg-slate-100 dark:bg-slate-800 rounded-full px-4 py-2 border border-slate-200/60 dark:border-slate-700">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder="Type a message..."
            className="flex-1 bg-transparent border-none outline-hidden text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
          />

          {/* Microphone button */}
          <button
            type="button"
            onClick={toggleVoiceInput}
            aria-label={isListening ? 'Stop listening' : 'Start voice input'}
            className={`p-1.5 rounded-full text-slate-500 hover:text-slate-700 cursor-pointer transition-colors ${
              isListening ? 'text-red-600 animate-pulse' : ''
            }`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 stroke-[1.8]" />}
          </button>
        </div>

        {/* Send Button */}
        <button
          type="button"
          onClick={() => handleSend()}
          disabled={!inputText.trim() && !isLoading}
          aria-label="Send Message"
          className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md hover:opacity-95 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
        >
          <Send className="w-4 h-4 translate-x-0.5" />
        </button>
      </div>

      {/* Attachment Sheet Modal */}
      <AttachmentModal
        isOpen={isAttachmentOpen}
        onClose={() => setIsAttachmentOpen(false)}
        onSelectImage={(url, name) => handleSend('Is tasveer ka masla diagnose karein', { url, name })}
        onTakePhoto={() => setIsCameraOpen(true)}
        onUploadScreenshot={triggerCrackedScreenSample}
        onUploadFile={(name) => handleSend(`System diagnostic log file attached: ${name}`)}
        onShareScreen={() => onNavigate('live')}
        onStartVoice={() => onNavigate('voice')}
        isDark={isDark}
      />

      {/* Live Camera Snapshot Modal */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(base64) => handleSend('Check my camera capture and diagnostic status', { url: base64, name: 'camera_snap.jpg' })}
        isDark={isDark}
      />
    </div>
  );
};
