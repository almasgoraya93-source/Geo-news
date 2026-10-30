import React from 'react';

interface QFixLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  subtitle?: string;
}

export const QFixLogo: React.FC<QFixLogoProps> = ({
  size = 36,
  className = '',
  showText = false,
  subtitle
}) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Circuit Q Emblem matching screenshot */}
      <div
        className="relative flex items-center justify-center rounded-2xl p-1 shadow-sm transition-transform hover:scale-105"
        style={{
          width: size,
          height: size,
          background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
        }}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full p-1"
        >
          {/* Circuit Q outer loop */}
          <circle
            cx="48"
            cy="48"
            r="32"
            stroke="#FFFFFF"
            strokeWidth="11"
            strokeLinecap="round"
          />
          {/* Circuit dot */}
          <circle cx="48" cy="48" r="8" fill="#FFFFFF" />
          {/* Q tail circuit line and pad */}
          <path
            d="M60 60L82 82"
            stroke="#FFFFFF"
            strokeWidth="11"
            strokeLinecap="round"
          />
          <circle cx="82" cy="82" r="5" fill="#38BDF8" />
          {/* Subtle microchip pin accents */}
          <circle cx="20" cy="48" r="3" fill="#A78BFA" />
          <circle cx="48" cy="18" r="3" fill="#A78BFA" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <span className="text-[19px] font-bold tracking-tight text-slate-900 leading-none">
            Q Fix AI
          </span>
          {subtitle && (
            <span className="text-[11px] font-medium text-slate-500 mt-0.5">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
