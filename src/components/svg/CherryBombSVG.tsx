import React from 'react';

interface CherryBombSVGProps {
  className?: string;
  fuseProgress?: number; // 0..1 (1 is just planted, 0 is exploding)
}

export const CherryBombSVG: React.FC<CherryBombSVGProps> = ({ className = '', fuseProgress = 1.0 }) => {
  // As fuse ticks down, the cherries swell slightly and sparks burst
  const swellScale = 1 + (1 - fuseProgress) * 0.15;
  const isIgnited = fuseProgress < 0.9;

  return (
    <svg viewBox="0 0 100 100" className={`w-full h-full ${className}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="cherryGrad" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#f87171" />
          <stop offset="50%" stopColor="#dc2626" />
          <stop offset="85%" stopColor="#991b1b" />
          <stop offset="100%" stopColor="#450a0a" />
        </radialGradient>
        <radialGradient id="sparkGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#fde047" />
          <stop offset="80%" stopColor="#ea580c" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      {/* Shadow */}
      <ellipse cx="50" cy="92" rx="34" ry="7" fill="#0f172a" opacity="0.4" />

      {/* Stems */}
      <g>
        {/* Left Stem */}
        <path
          d="M 36 50 C 34 32, 44 20, 52 14"
          fill="none"
          stroke="#15803d"
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* Right Stem */}
        <path
          d="M 64 56 C 66 36, 58 22, 52 14"
          fill="none"
          stroke="#16a34a"
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* Joined Stem Top Node */}
        <circle cx="52" cy="14" r="3.5" fill="#14532d" />
        {/* Stem Leaf */}
        <path d="M 52 14 C 42 10, 36 12, 38 6 C 46 8, 50 12, 52 14 Z" fill="#22c55e" stroke="#15803d" strokeWidth="1" />

        {/* Fuse Cord & Sparks */}
        <path d="M 52 14 Q 56 6 62 4" fill="none" stroke="#78350f" strokeWidth="2.5" strokeDasharray="3 2" />

        {/* Sparking Fuse Tip */}
        <g transform="translate(62, 4)">
          <circle cx="0" cy="0" r={isIgnited ? 7 : 4} fill="url(#sparkGrad)" />
          {isIgnited && (
            <>
              {/* Spark Star Rays */}
              <line x1="-8" y1="-8" x2="8" y2="8" stroke="#facc15" strokeWidth="1.5" />
              <line x1="8" y1="-8" x2="-8" y2="8" stroke="#facc15" strokeWidth="1.5" />
              <line x1="0" y1="-10" x2="0" y2="10" stroke="#f97316" strokeWidth="1.5" />
              <line x1="-10" y1="0" x2="10" y2="0" stroke="#f97316" strokeWidth="1.5" />
            </>
          )}
        </g>
      </g>

      {/* Left Cherry */}
      <g transform={`translate(34, 62) scale(${swellScale}) translate(-34, -62)`}>
        <circle cx="34" cy="62" r="21" fill="url(#cherryGrad)" stroke="#450a0a" strokeWidth="2.5" />
        {/* Highlight */}
        <ellipse cx="26" cy="52" rx="5" ry="3" fill="#fca5a5" opacity="0.6" transform="rotate(-30 26 52)" />

        {/* Angry Eye Left */}
        <ellipse cx="28" cy="58" rx="4" ry="5" fill="#ffffff" stroke="#450a0a" strokeWidth="1.2" />
        <circle cx="30" cy="59" r="2.2" fill="#0f172a" />
        {/* Angry Brow */}
        <path d="M 23 52 L 34 56" stroke="#450a0a" strokeWidth="2.8" strokeLinecap="round" />

        {/* Angry Eye Right */}
        <ellipse cx="40" cy="58" rx="4" ry="5" fill="#ffffff" stroke="#450a0a" strokeWidth="1.2" />
        <circle cx="39" cy="59" r="2.2" fill="#0f172a" />
        {/* Angry Brow */}
        <path d="M 45 52 L 34 56" stroke="#450a0a" strokeWidth="2.8" strokeLinecap="round" />

        {/* Gritted Teeth Mouth */}
        <rect x="28" y="68" width="12" height="5" rx="2" fill="#ffffff" stroke="#450a0a" strokeWidth="1.5" />
        <line x1="32" y1="68" x2="32" y2="73" stroke="#450a0a" strokeWidth="1" />
        <line x1="36" y1="68" x2="36" y2="73" stroke="#450a0a" strokeWidth="1" />
      </g>

      {/* Right Cherry (Slightly lower & offset) */}
      <g transform={`translate(66, 66) scale(${swellScale}) translate(-66, -66)`}>
        <circle cx="66" cy="66" r="21" fill="url(#cherryGrad)" stroke="#450a0a" strokeWidth="2.5" />
        {/* Highlight */}
        <ellipse cx="58" cy="56" rx="5" ry="3" fill="#fca5a5" opacity="0.6" transform="rotate(-30 58 56)" />

        {/* Angry Eye Left */}
        <ellipse cx="60" cy="62" rx="4" ry="5" fill="#ffffff" stroke="#450a0a" strokeWidth="1.2" />
        <circle cx="62" cy="63" r="2.2" fill="#0f172a" />
        <path d="M 55 56 L 66 60" stroke="#450a0a" strokeWidth="2.8" strokeLinecap="round" />

        {/* Angry Eye Right */}
        <ellipse cx="72" cy="62" rx="4" ry="5" fill="#ffffff" stroke="#450a0a" strokeWidth="1.2" />
        <circle cx="71" cy="63" r="2.2" fill="#0f172a" />
        <path d="M 77 56 L 66 60" stroke="#450a0a" strokeWidth="2.8" strokeLinecap="round" />

        {/* Gritted Mouth */}
        <rect x="60" y="72" width="12" height="5" rx="2" fill="#ffffff" stroke="#450a0a" strokeWidth="1.5" />
        <line x1="64" y1="72" x2="64" y2="77" stroke="#450a0a" strokeWidth="1" />
        <line x1="68" y1="72" x2="68" y2="77" stroke="#450a0a" strokeWidth="1" />
      </g>
    </svg>
  );
};
