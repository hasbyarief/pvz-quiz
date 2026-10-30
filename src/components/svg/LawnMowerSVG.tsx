import React from 'react';

interface LawnMowerSVGProps {
  className?: string;
  isActive?: boolean;
}

export const LawnMowerSVG: React.FC<LawnMowerSVGProps> = ({ className = '', isActive = false }) => {
  return (
    <svg viewBox="0 0 100 80" className={`w-full h-full ${className}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="mowerRedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="60%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#991b1b" />
        </linearGradient>
        <linearGradient id="mowerMetal" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="50%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
      </defs>

      {/* Ground Shadow */}
      <ellipse cx="48" cy="74" rx="36" ry="6" fill="#0f172a" opacity="0.4" />

      {/* Chrome Handlebar Angling Backwards */}
      <path
        d="M 52 38 L 18 12 L 8 16"
        fill="none"
        stroke="#e2e8f0"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M 8 16 L 4 20" stroke="#0f172a" strokeWidth="5" strokeLinecap="round" />

      {/* Main Red Deck Hood */}
      <path
        d="M 28 62 L 32 38 C 34 34, 46 32, 68 32 C 82 32, 88 38, 86 62 Z"
        fill="url(#mowerRedGrad)"
        stroke="#7f1d1d"
        strokeWidth="2.5"
      />

      {/* Engine Motor Block */}
      <rect x="42" y="22" width="24" height="16" rx="3" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
      {/* Air intake ribs */}
      <line x1="46" y1="26" x2="62" y2="26" stroke="#475569" strokeWidth="1.5" />
      <line x1="46" y1="30" x2="62" y2="30" stroke="#475569" strokeWidth="1.5" />
      {/* Pull cord starter circle */}
      <circle cx="54" cy="20" r="3.5" fill="#e2e8f0" stroke="#0f172a" strokeWidth="1" />

      {/* Front Rotary Blade Housing & Blades */}
      <g transform={isActive ? 'rotate(180 82 56)' : 'none'}>
        <path d="M 76 44 L 88 56 L 76 68 Z" fill="url(#mowerMetal)" stroke="#334155" strokeWidth="1.5" />
        <circle cx="82" cy="56" r="3.5" fill="#f8fafc" />
      </g>

      {/* Wheels */}
      {/* Rear Wheel */}
      <circle cx="34" cy="64" r="12" fill="#0f172a" stroke="#334155" strokeWidth="2" />
      <circle cx="34" cy="64" r="7" fill="url(#mowerMetal)" />
      <circle cx="34" cy="64" r="2.5" fill="#0f172a" />

      {/* Front Wheel */}
      <circle cx="78" cy="64" r="10" fill="#0f172a" stroke="#334155" strokeWidth="2" />
      <circle cx="78" cy="64" r="5.5" fill="url(#mowerMetal)" />
      <circle cx="78" cy="64" r="2" fill="#0f172a" />

      {/* Speed lines when racing forward */}
      {isActive && (
        <g stroke="#ffffff" strokeWidth="2" opacity="0.8">
          <line x1="4" y1="45" x2="18" y2="45" />
          <line x1="0" y1="55" x2="22" y2="55" />
          <line x1="6" y1="65" x2="16" y2="65" />
        </g>
      )}
    </svg>
  );
};
