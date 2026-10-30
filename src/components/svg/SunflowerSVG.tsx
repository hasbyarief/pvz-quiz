import React from 'react';

interface SunflowerSVGProps {
  className?: string;
  isGlowing?: boolean;
}

export const SunflowerSVG: React.FC<SunflowerSVGProps> = ({ className = '', isGlowing = false }) => {
  // 12 petals around the center
  const petals = Array.from({ length: 12 }, (_, i) => i * 30);

  return (
    <svg viewBox="0 0 100 100" className={`w-full h-full ${className}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="sunFaceGrad" cx="45%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#a16207" />
          <stop offset="70%" stopColor="#713f12" />
          <stop offset="100%" stopColor="#451a03" />
        </radialGradient>
        <linearGradient id="sunPetalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="60%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>
        <filter id="sunGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Ground Shadow */}
      <ellipse cx="48" cy="92" rx="26" ry="6" fill="#0f172a" opacity="0.3" />

      {/* Base Leaves */}
      <path d="M 48 88 C 24 88, 14 82, 18 76 C 30 76, 42 82, 48 88 Z" fill="#16a34a" stroke="#14532d" strokeWidth="2" />
      <path d="M 48 88 C 72 88, 82 82, 78 76 C 66 76, 54 82, 48 88 Z" fill="#22c55e" stroke="#14532d" strokeWidth="2" />

      {/* Thick Green Stem */}
      <path
        d="M 48 88 C 45 72, 51 60, 48 46"
        fill="none"
        stroke="#16a34a"
        strokeWidth="9"
        strokeLinecap="round"
      />

      {/* Sunflower Head Assembly */}
      <g
        transform="translate(48, 42)"
        filter={isGlowing ? 'url(#sunGlow)' : undefined}
      >
        {/* Glowing Halo when producing */}
        {isGlowing && (
          <circle cx="0" cy="0" r="38" fill="#facc15" opacity="0.4" />
        )}

        {/* 12 Radiant Petals */}
        <g>
          {petals.map((angle) => (
            <path
              key={angle}
              d="M 0 -18 C -7 -28, -8 -36, 0 -38 C 8 -36, 7 -28, 0 -18 Z"
              fill="url(#sunPetalGrad)"
              stroke="#ca8a04"
              strokeWidth="1.5"
              transform={`rotate(${angle})`}
            />
          ))}
        </g>

        {/* Brown Face Disc */}
        <circle cx="0" cy="0" r="22" fill="url(#sunFaceGrad)" stroke="#451a03" strokeWidth="2" />

        {/* Disc Texture Dots */}
        <circle cx="-10" cy="-6" r="1.2" fill="#ca8a04" opacity="0.6" />
        <circle cx="10" cy="-6" r="1.2" fill="#ca8a04" opacity="0.6" />
        <circle cx="-8" cy="8" r="1.2" fill="#ca8a04" opacity="0.6" />
        <circle cx="8" cy="8" r="1.2" fill="#ca8a04" opacity="0.6" />

        {/* Cute Smiling Eyes */}
        <ellipse cx="-7" cy="-2" rx="3.5" ry="5.5" fill="#0f172a" />
        <circle cx="-8" cy="-4" r="1.4" fill="#ffffff" />
        <ellipse cx="7" cy="-2" rx="3.5" ry="5.5" fill="#0f172a" />
        <circle cx="6" cy="-4" r="1.4" fill="#ffffff" />

        {/* Rosy Cheeks */}
        <ellipse cx="-13" cy="5" rx="3" ry="1.8" fill="#f97316" opacity="0.6" />
        <ellipse cx="13" cy="5" rx="3" ry="1.8" fill="#f97316" opacity="0.6" />

        {/* Happy Smiling Mouth */}
        <path
          d="M -6 6 Q 0 13 6 6"
          fill="#451a03"
          stroke="#451a03"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path d="M -4 7 Q 0 11 4 7 Z" fill="#ef4444" />
      </g>
    </svg>
  );
};
