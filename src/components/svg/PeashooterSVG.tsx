import React from 'react';

interface PeashooterSVGProps {
  className?: string;
  isShooting?: boolean;
}

export const PeashooterSVG: React.FC<PeashooterSVGProps> = ({ className = '', isShooting = false }) => {
  return (
    <svg viewBox="0 0 100 100" className={`w-full h-full ${className}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="peaHeadGrad" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="60%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#15803d" />
        </radialGradient>
        <linearGradient id="peaStemGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#16a34a" />
          <stop offset="100%" stopColor="#14532d" />
        </linearGradient>
        <linearGradient id="peaSnootGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#15803d" />
          <stop offset="70%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#166534" />
        </linearGradient>
      </defs>

      {/* Ground Shadow */}
      <ellipse cx="46" cy="92" rx="28" ry="6" fill="#0f172a" opacity="0.3" />

      {/* Base Leaves */}
      <path d="M 45 88 C 25 88, 15 82, 18 78 C 30 76, 42 84, 46 88 Z" fill="#16a34a" stroke="#14532d" strokeWidth="2" />
      <path d="M 45 88 C 65 88, 75 82, 72 78 C 60 76, 48 84, 45 88 Z" fill="#22c55e" stroke="#14532d" strokeWidth="2" />
      <path d="M 46 88 C 46 96, 32 94, 30 90 C 35 86, 42 86, 46 88 Z" fill="#15803d" />

      {/* Curved Stem */}
      <path
        d="M 46 88 C 42 70, 52 56, 45 42"
        fill="none"
        stroke="url(#peaStemGrad)"
        strokeWidth="11"
        strokeLinecap="round"
      />

      {/* Back Leaf / Tendril */}
      <path
        d="M 32 40 C 15 32, 10 18, 16 22 C 24 28, 30 35, 34 38 Z"
        fill="#22c55e"
        stroke="#14532d"
        strokeWidth="2.5"
      />

      {/* Head Group with gentle recoil when shooting */}
      <g transform={isShooting ? 'translate(3, -1) scale(0.97, 1.03)' : 'translate(0, 0)'}>
        {/* Extended Snout / Shooter Tube */}
        <path
          d="M 52 28 L 82 23 C 86 23, 89 27, 88 36 C 87 45, 84 48, 80 48 L 50 44 Z"
          fill="url(#peaSnootGrad)"
          stroke="#14532d"
          strokeWidth="2.5"
        />
        {/* Snout Opening Rim */}
        <ellipse cx="82" cy="35" rx="5" ry="11" fill="#14532d" />
        <ellipse cx="83" cy="35" rx="3.5" ry="8.5" fill="#052e16" />

        {/* Round Head */}
        <circle cx="42" cy="36" r="23" fill="url(#peaHeadGrad)" stroke="#14532d" strokeWidth="3" />

        {/* Large Expressive Eye */}
        <ellipse cx="54" cy="27" rx="6" ry="9" fill="#ffffff" stroke="#14532d" strokeWidth="1.5" />
        {/* Pupil looking forward */}
        <ellipse cx="56" cy="27" rx="3.5" ry="5.5" fill="#0f172a" />
        {/* Eye Shine */}
        <circle cx="55" cy="24" r="1.8" fill="#ffffff" />
        <circle cx="58" cy="29" r="0.9" fill="#ffffff" />

        {/* Cheek Blush */}
        <ellipse cx="44" cy="46" rx="4.5" ry="2.5" fill="#15803d" opacity="0.4" />
      </g>
    </svg>
  );
};
