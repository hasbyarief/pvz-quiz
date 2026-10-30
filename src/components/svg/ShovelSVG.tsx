import React from 'react';

interface ShovelSVGProps {
  className?: string;
}

export const ShovelSVG: React.FC<ShovelSVGProps> = ({ className = '' }) => {
  return (
    <svg viewBox="0 0 60 60" className={`w-full h-full ${className}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shovelBlade" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="50%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
      </defs>

      {/* D-Handle Top */}
      <path
        d="M 12 12 C 10 10, 16 6, 20 10 L 22 12 L 18 16 Z"
        fill="#b45309"
        stroke="#78350f"
        strokeWidth="1.5"
      />
      {/* Wooden Shaft */}
      <line x1="16" y1="16" x2="36" y2="36" stroke="#b45309" strokeWidth="5" strokeLinecap="round" />
      <line x1="16" y1="16" x2="36" y2="36" stroke="#78350f" strokeWidth="1" strokeDasharray="3 3" />

      {/* Metal Socket */}
      <rect x="33" y="33" width="7" height="6" transform="rotate(45 36 36)" fill="#475569" stroke="#1e293b" strokeWidth="1" />

      {/* Steel Spade Head */}
      <path
        d="M 36 36 L 46 26 C 52 32, 54 44, 48 50 C 42 56, 30 54, 24 48 L 34 38 Z"
        fill="url(#shovelBlade)"
        stroke="#1e293b"
        strokeWidth="2"
      />
      {/* Blade Ridge */}
      <line x1="36" y1="36" x2="48" y2="48" stroke="#ffffff" strokeWidth="1.5" opacity="0.8" />
    </svg>
  );
};
