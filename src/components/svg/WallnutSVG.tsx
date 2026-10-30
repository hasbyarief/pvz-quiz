import React from 'react';

interface WallnutSVGProps {
  className?: string;
  hp?: number;
  maxHp?: number;
}

export const WallnutSVG: React.FC<WallnutSVGProps> = ({ className = '', hp = 4000, maxHp = 4000 }) => {
  const hpRatio = hp / maxHp;
  const isCracked = hpRatio < 0.66;
  const isHeavilyCracked = hpRatio < 0.33;

  return (
    <svg viewBox="0 0 100 100" className={`w-full h-full ${className}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="wallnutBodyGrad" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#d97706" />
          <stop offset="65%" stopColor="#92400e" />
          <stop offset="100%" stopColor="#451a03" />
        </radialGradient>
        <linearGradient id="wallnutRidge" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#78350f" />
          <stop offset="50%" stopColor="#b45309" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>
      </defs>

      {/* Ground Shadow */}
      <ellipse cx="50" cy="92" rx="26" ry="6" fill="#0f172a" opacity="0.4" />

      {/* Nut Body (Heavy thick oval) */}
      <path
        d="M 50 14 C 74 14, 82 32, 82 56 C 82 78, 72 90, 50 90 C 28 90, 18 78, 18 56 C 18 32, 26 14, 50 14 Z"
        fill="url(#wallnutBodyGrad)"
        stroke="#451a03"
        strokeWidth="3.5"
      />

      {/* Nut shell textured side ridges */}
      <path
        d="M 28 28 C 22 42, 22 70, 28 82"
        fill="none"
        stroke="#78350f"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M 72 28 C 78 42, 78 70, 72 82"
        fill="none"
        stroke="#78350f"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Center ridge seam */}
      <path
        d="M 50 16 C 52 38, 48 68, 50 88"
        fill="none"
        stroke="#b45309"
        strokeWidth="2"
        strokeDasharray="4 6"
      />

      {/* Eyes & Expressions */}
      {!isHeavilyCracked ? (
        <g>
          {/* Big Wide Staring Eyes */}
          {/* Left Eye */}
          <ellipse cx="40" cy="38" rx="8" ry="11" fill="#ffffff" stroke="#451a03" strokeWidth="2" />
          <ellipse cx="42" cy="38" rx="4.5" ry="6.5" fill="#0f172a" />
          <circle cx="41" cy="35" r="2" fill="#ffffff" />

          {/* Right Eye */}
          <ellipse cx="60" cy="38" rx="8" ry="11" fill="#ffffff" stroke="#451a03" strokeWidth="2" />
          <ellipse cx="62" cy="38" rx="4.5" ry="6.5" fill="#0f172a" />
          <circle cx="61" cy="35" r="2" fill="#ffffff" />

          {/* Eyebrows */}
          {isCracked ? (
            // Worried raised angled brows
            <>
              <path d="M 32 26 L 47 30" stroke="#451a03" strokeWidth="3" strokeLinecap="round" />
              <path d="M 68 26 L 53 30" stroke="#451a03" strokeWidth="3" strokeLinecap="round" />
            </>
          ) : (
            // Calm determined brows
            <>
              <path d="M 33 28 Q 40 25 47 28" fill="none" stroke="#451a03" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 53 28 Q 60 25 67 28" fill="none" stroke="#451a03" strokeWidth="2.5" strokeLinecap="round" />
            </>
          )}

          {/* Mouth */}
          {isCracked ? (
            // Worried wavy mouth
            <path d="M 42 62 Q 50 56 58 62" fill="none" stroke="#451a03" strokeWidth="3" strokeLinecap="round" />
          ) : (
            // Determined little smile
            <path d="M 44 58 Q 50 63 56 58" fill="none" stroke="#451a03" strokeWidth="3" strokeLinecap="round" />
          )}
        </g>
      ) : (
        // Heavily Cracked / Distressed Face
        <g>
          {/* Teary distressed eyes */}
          <ellipse cx="38" cy="40" rx="7" ry="10" fill="#ffffff" stroke="#451a03" strokeWidth="2" />
          <ellipse cx="39" cy="41" rx="4" ry="5.5" fill="#0f172a" />
          <circle cx="38" cy="38" r="1.5" fill="#ffffff" />

          <ellipse cx="62" cy="40" rx="7" ry="10" fill="#ffffff" stroke="#451a03" strokeWidth="2" />
          <ellipse cx="63" cy="41" rx="4" ry="5.5" fill="#0f172a" />
          <circle cx="62" cy="38" r="1.5" fill="#ffffff" />

          {/* Distressed Eyebrows */}
          <path d="M 30 28 L 45 34" stroke="#451a03" strokeWidth="3" strokeLinecap="round" />
          <path d="M 70 28 L 55 34" stroke="#451a03" strokeWidth="3" strokeLinecap="round" />

          {/* Tear drops */}
          <path d="M 32 48 C 30 54, 34 58, 36 58 C 38 58, 40 54, 32 48 Z" fill="#38bdf8" />
          <path d="M 68 48 C 66 54, 70 58, 72 58 C 74 58, 76 54, 68 48 Z" fill="#38bdf8" />

          {/* Open crying mouth */}
          <ellipse cx="50" cy="64" rx="8" ry="6" fill="#451a03" />
          <path d="M 45 62 Q 50 66 55 62" fill="#ef4444" />
        </g>
      )}

      {/* Cracks - Moderate */}
      {isCracked && (
        <path
          d="M 68 32 L 62 38 L 66 46 L 58 52"
          fill="none"
          stroke="#451a03"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}

      {/* Cracks - Heavy */}
      {isHeavilyCracked && (
        <>
          <path
            d="M 24 40 L 30 46 L 26 58 L 34 66"
            fill="none"
            stroke="#451a03"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 74 60 L 66 66 L 72 74"
            fill="none"
            stroke="#451a03"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Missing shell chip */}
          <polygon points="76,28 82,34 78,38" fill="#451a03" />
        </>
      )}
    </svg>
  );
};
