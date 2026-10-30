import React from 'react';

interface ExplosionEffectSVGProps {
  className?: string;
  progress?: number; // 0..1
}

export const ExplosionEffectSVG: React.FC<ExplosionEffectSVGProps> = ({ className = '', progress = 0 }) => {
  const scale = 0.5 + progress * 0.9;
  const opacity = Math.max(0, 1 - progress * 1.2);

  return (
    <svg
      viewBox="0 0 200 200"
      className={`w-full h-full pointer-events-none ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{
        transform: `scale(${scale})`,
        opacity
      }}
    >
      <defs>
        <radialGradient id="boomCore" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="30%" stopColor="#fef08a" />
          <stop offset="60%" stopColor="#f97316" />
          <stop offset="85%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#7f1d1d" />
        </radialGradient>
      </defs>

      {/* Outer Shockwave Ring */}
      <circle cx="100" cy="100" r={80 + progress * 20} fill="none" stroke="#f97316" strokeWidth="4" opacity={0.6} />

      {/* Billowing Smoke Puffs */}
      <circle cx="60" cy="80" r="34" fill="#334155" opacity="0.6" />
      <circle cx="140" cy="80" r="32" fill="#334155" opacity="0.6" />
      <circle cx="80" cy="130" r="36" fill="#1e293b" opacity="0.7" />
      <circle cx="125" cy="130" r="34" fill="#1e293b" opacity="0.7" />
      <circle cx="100" cy="65" r="30" fill="#475569" opacity="0.6" />

      {/* Jagged Explosion Star */}
      <polygon
        points="100,10 125,65 185,45 155,95 195,130 140,140 135,195 95,155 55,190 65,135 10,125 50,90 20,40 75,60"
        fill="url(#boomCore)"
        stroke="#450a0a"
        strokeWidth="3.5"
      />

      {/* Inner Yellow Core Star */}
      <polygon
        points="100,40 115,75 150,65 130,95 160,115 125,120 120,155 95,130 70,150 78,118 45,110 70,90 50,60 85,72"
        fill="#fef08a"
      />

      {/* White Hot Center */}
      <circle cx="100" cy="100" r="22" fill="#ffffff" />

      {/* BOOM Comic Text */}
      <text
        x="100"
        y="112"
        textAnchor="middle"
        fontFamily="sans-serif"
        fontWeight="900"
        fontSize="34"
        fill="#dc2626"
        stroke="#ffffff"
        strokeWidth="4"
        paintOrder="stroke fill"
        letterSpacing="2"
      >
        BOOM!
      </text>
    </svg>
  );
};
