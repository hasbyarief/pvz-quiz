import React from 'react';

interface SnowPeaSVGProps {
  className?: string;
  isShooting?: boolean;
}

export const SnowPeaSVG: React.FC<SnowPeaSVGProps> = ({ className = '', isShooting = false }) => {
  return (
    <svg viewBox="0 0 100 100" className={`w-full h-full ${className}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="snowHeadGrad" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#cffafe" />
          <stop offset="50%" stopColor="#38bdf8" />
          <stop offset="90%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#0369a1" />
        </radialGradient>
        <linearGradient id="snowStemGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#075985" />
        </linearGradient>
        <linearGradient id="snowCrystalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#bae6fd" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
      </defs>

      {/* Ground Shadow */}
      <ellipse cx="46" cy="92" rx="28" ry="6" fill="#0f172a" opacity="0.35" />

      {/* Base Frosted Leaves */}
      <path d="M 45 88 C 25 88, 15 82, 18 78 C 30 76, 42 84, 46 88 Z" fill="#0284c7" stroke="#075985" strokeWidth="2" />
      <path d="M 45 88 C 65 88, 75 82, 72 78 C 60 76, 48 84, 45 88 Z" fill="#38bdf8" stroke="#075985" strokeWidth="2" />
      <path d="M 46 88 C 46 96, 32 94, 30 90 C 35 86, 42 86, 46 88 Z" fill="#0369a1" />

      {/* Curved Stem */}
      <path
        d="M 46 88 C 42 70, 52 56, 45 42"
        fill="none"
        stroke="url(#snowStemGrad)"
        strokeWidth="11"
        strokeLinecap="round"
      />

      {/* Head & Crystals Group */}
      <g transform={isShooting ? 'translate(3, -1) scale(0.97, 1.03)' : 'translate(0, 0)'}>
        {/* Rear Ice Crystals */}
        {/* Crystal 1 (Top) */}
        <polygon points="30,24 10,12 24,28" fill="url(#snowCrystalGrad)" stroke="#0284c7" strokeWidth="1.5" />
        {/* Crystal 2 (Middle) */}
        <polygon points="26,34 6,32 24,40" fill="url(#snowCrystalGrad)" stroke="#0284c7" strokeWidth="1.5" />
        {/* Crystal 3 (Bottom) */}
        <polygon points="28,42 12,48 26,48" fill="url(#snowCrystalGrad)" stroke="#0284c7" strokeWidth="1.5" />

        {/* Ice Snout Tube */}
        <path
          d="M 52 28 L 82 23 C 86 23, 89 27, 88 36 C 87 45, 84 48, 80 48 L 50 44 Z"
          fill="url(#snowCrystalGrad)"
          stroke="#0369a1"
          strokeWidth="2.5"
        />
        {/* Snout Opening Rim */}
        <ellipse cx="82" cy="35" rx="5" ry="11" fill="#0369a1" />
        <ellipse cx="83" cy="35" rx="3.5" ry="8.5" fill="#082f49" />

        {/* Round Ice Head */}
        <circle cx="42" cy="36" r="23" fill="url(#snowHeadGrad)" stroke="#0369a1" strokeWidth="3" />

        {/* Crystalline facets on forehead */}
        <path d="M 32 20 L 40 26 L 46 18 Z" fill="#ffffff" opacity="0.5" />

        {/* Large Expressive Eye */}
        <ellipse cx="54" cy="27" rx="6" ry="9" fill="#ffffff" stroke="#0369a1" strokeWidth="1.5" />
        {/* Pupil */}
        <ellipse cx="56" cy="27" rx="3.5" ry="5.5" fill="#0c4a6e" />
        {/* Crystalline glint */}
        <circle cx="55" cy="24" r="1.8" fill="#ffffff" />
        <circle cx="58" cy="29" r="0.9" fill="#ffffff" />

        {/* Frost Cheek */}
        <ellipse cx="44" cy="46" rx="4.5" ry="2.5" fill="#38bdf8" opacity="0.6" />
      </g>
    </svg>
  );
};
