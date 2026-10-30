import React from 'react';

interface RepeaterSVGProps {
  className?: string;
  isShooting?: boolean;
}

export const RepeaterSVG: React.FC<RepeaterSVGProps> = ({ className = '', isShooting = false }) => {
  return (
    <svg viewBox="0 0 100 100" className={`w-full h-full ${className}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="repHeadGrad" cx="38%" cy="35%" r="62%">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="45%" stopColor="#16a34a" />
          <stop offset="90%" stopColor="#15803d" />
          <stop offset="100%" stopColor="#14532d" />
        </radialGradient>
        <linearGradient id="repStemGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#16a34a" />
          <stop offset="100%" stopColor="#052e16" />
        </linearGradient>
        <linearGradient id="repSnootGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#15803d" />
          <stop offset="65%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#14532d" />
        </linearGradient>
        <linearGradient id="repCrestGrad" x1="100%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#14532d" />
          <stop offset="60%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#86efac" />
        </linearGradient>
      </defs>

      {/* Ground Shadow */}
      <ellipse cx="46" cy="92" rx="28" ry="6" fill="#0f172a" opacity="0.32" />

      {/* Base Leaves */}
      <path d="M 45 88 C 22 88, 12 82, 16 78 C 28 76, 42 84, 46 88 Z" fill="#15803d" stroke="#052e16" strokeWidth="2" />
      <path d="M 45 88 C 68 88, 78 82, 74 78 C 62 76, 48 84, 45 88 Z" fill="#16a34a" stroke="#052e16" strokeWidth="2" />
      <path d="M 46 88 C 46 96, 30 94, 28 90 C 34 86, 42 86, 46 88 Z" fill="#14532d" />

      {/* Curved Thick Stem */}
      <path
        d="M 46 88 C 42 70, 52 56, 45 42"
        fill="none"
        stroke="url(#repStemGrad)"
        strokeWidth="11"
        strokeLinecap="round"
      />

      {/* Double Backward Crest / Plumes (Repeater's iconic hair leaves) */}
      {/* Lower Back Leaf */}
      <path
        d="M 28 44 C 10 40, 2 28, 8 20 C 18 24, 24 34, 30 40 Z"
        fill="url(#repCrestGrad)"
        stroke="#052e16"
        strokeWidth="2.2"
      />
      {/* Upper Back Leaf (Top Crest) */}
      <path
        d="M 32 32 C 14 24, 8 10, 16 6 C 24 10, 28 20, 34 28 Z"
        fill="url(#repCrestGrad)"
        stroke="#052e16"
        strokeWidth="2.2"
      />

      {/* Head Group with recoil animation */}
      <g transform={isShooting ? 'translate(4, -1) scale(0.96, 1.04)' : 'translate(0, 0)'}>
        {/* Reinforced Double Snout / Double Barrel */}
        {/* Main Extended Snout */}
        <path
          d="M 52 27 L 83 22 C 87 22, 90 26, 89 36 C 88 46, 85 49, 81 49 L 50 45 Z"
          fill="url(#repSnootGrad)"
          stroke="#052e16"
          strokeWidth="2.5"
        />

        {/* Outer Ring / Double Barrel Ridge */}
        <path
          d="M 68 25 L 72 24 C 74 24, 75 27, 75 36 C 75 44, 73 47, 71 47 L 67 46 Z"
          fill="#14532d"
          opacity="0.6"
        />

        {/* Snout Opening Rim */}
        <ellipse cx="83" cy="35" rx="5.5" ry="11.5" fill="#14532d" />
        <ellipse cx="84" cy="35" rx="4" ry="9" fill="#022c22" />

        {/* Round Head */}
        <circle cx="42" cy="36" r="23" fill="url(#repHeadGrad)" stroke="#052e16" strokeWidth="3" />

        {/* Determined Brow Arch (Repeater's fierce battle expression) */}
        <path
          d="M 46 19 Q 54 18 63 22"
          fill="none"
          stroke="#052e16"
          strokeWidth="3.2"
          strokeLinecap="round"
        />

        {/* Large Expressive Eye */}
        <ellipse cx="54" cy="27" rx="6" ry="9" fill="#ffffff" stroke="#052e16" strokeWidth="1.6" />
        {/* Pupil focused forward */}
        <ellipse cx="57" cy="27" rx="3.5" ry="5.5" fill="#0f172a" />
        {/* Eye Shine Highlights */}
        <circle cx="56" cy="24" r="1.8" fill="#ffffff" />
        <circle cx="59" cy="29" r="0.9" fill="#ffffff" />

        {/* Cheek Blush */}
        <ellipse cx="44" cy="46" rx="4.5" ry="2.5" fill="#052e16" opacity="0.35" />
      </g>
    </svg>
  );
};
