import React from 'react';

interface SunSVGProps {
  className?: string;
  isFloating?: boolean;
  isQuiz?: boolean;
}

export const SunSVG: React.FC<SunSVGProps> = ({ className = '', isFloating = true, isQuiz = false }) => {
  const rays = [0, 45, 90, 135, 180, 225, 270, 315];

  return (
    <svg viewBox="0 0 100 100" className={`w-full h-full ${className}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="sunCore" cx="45%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="25%" stopColor="#fef08a" />
          <stop offset="65%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#eab308" />
        </radialGradient>
        <radialGradient id="sunAura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fde047" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Radiant Glowing Background Halo */}
      <circle cx="50" cy="50" r="48" fill="url(#sunAura)" />

      {/* Sun Rays */}
      <g transform="translate(50, 50)">
        {rays.map((angle) => (
          <path
            key={angle}
            d="M 0 -26 Q -6 -38 0 -46 Q 6 -38 0 -26 Z"
            fill="#facc15"
            stroke="#ca8a04"
            strokeWidth="1.5"
            transform={`rotate(${angle})`}
          />
        ))}
      </g>

      {/* Inner Glowing Sun Core */}
      <circle cx="50" cy="50" r="26" fill="url(#sunCore)" stroke="#ca8a04" strokeWidth="2.5" />

      {/* Face or Question Mark Badge for Quiz Sun */}
      {isQuiz ? (
        <g>
          {/* Question Mark Circular Badge in Center */}
          <circle cx="50" cy="50" r="16" fill="#1e1b4b" stroke="#f59e0b" strokeWidth="2.2" />
          <text
            x="50"
            y="57.5"
            textAnchor="middle"
            fill="#facc15"
            fontSize="22"
            fontWeight="900"
            fontFamily="monospace"
            className="select-none"
            style={{ filter: 'drop-shadow(0px 0px 4px rgba(245, 158, 11, 0.9))' }}
          >
            ?
          </text>
        </g>
      ) : (
        <>
          {/* Cute Smiling Face */}
          {/* Eyes */}
          <ellipse cx="43" cy="47" rx="3.5" ry="5.5" fill="#713f12" />
          <circle cx="42" cy="45" r="1.4" fill="#ffffff" />
          <ellipse cx="57" cy="47" rx="3.5" ry="5.5" fill="#713f12" />
          <circle cx="56" cy="45" r="1.4" fill="#ffffff" />

          {/* Rosy Cheeks */}
          <ellipse cx="37" cy="53" rx="3.5" ry="2" fill="#f97316" opacity="0.6" />
          <ellipse cx="63" cy="53" rx="3.5" ry="2" fill="#f97316" opacity="0.6" />

          {/* Smiling Mouth */}
          <path
            d="M 43 54 Q 50 61 57 54"
            fill="none"
            stroke="#713f12"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </>
      )}
      {/* Sparkle Glints */}
      <circle cx="34" cy="36" r="2" fill="#ffffff" opacity="0.8" />
      <circle cx="64" cy="34" r="1.2" fill="#ffffff" opacity="0.8" />
    </svg>
  );
};
