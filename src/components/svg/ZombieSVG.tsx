import React from 'react';
import { ZombieType } from '../../types/game';

interface ZombieSVGProps {
  type: ZombieType;
  isEating?: boolean;
  isSlowed?: boolean;
  coneHp?: number;
  bucketHp?: number;
  animTime?: number;
  className?: string;
}

export const ZombieSVG: React.FC<ZombieSVGProps> = ({
  type,
  isEating = false,
  isSlowed = false,
  coneHp = 560,
  bucketHp = 1300,
  animTime = 0,
  className = ''
}) => {
  // Walking waddle or eating chomp bob
  const waddleOffset = isEating ? Math.sin(animTime * 12) * 2 : Math.sin(animTime * 3.5) * 3;
  const legCycle = Math.sin(animTime * 3.5);

  const hasCone = type === 'conehead' && coneHp > 0;
  const hasBucket = type === 'buckethead' && bucketHp > 0;
  const hasFlag = type === 'flag';

  return (
    <svg
      viewBox="0 0 110 130"
      className={`w-full h-full ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{
        filter: isSlowed ? 'drop-shadow(0 0 8px #38bdf8) hue-rotate(180deg) saturate(1.4)' : undefined
      }}
    >
      <defs>
        {/* Zombie Skin Gradient */}
        <radialGradient id="zombieSkin" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="60%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#166534" />
        </radialGradient>
        {/* Grey Suit Gradient */}
        <linearGradient id="suitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#64748b" />
          <stop offset="60%" stopColor="#475569" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
        {/* Cone Gradient */}
        <linearGradient id="coneGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="50%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#c2410c" />
        </linearGradient>
        {/* Bucket Gradient */}
        <linearGradient id="bucketGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#cbd5e1" />
          <stop offset="40%" stopColor="#f1f5f9" />
          <stop offset="75%" stopColor="#64748b" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
      </defs>

      {/* Ground Shadow */}
      <ellipse cx="52" cy="122" rx="30" ry="6" fill="#0f172a" opacity="0.45" />

      {/* Main Body Group with Waddle Animation */}
      <g transform={`translate(${waddleOffset}, 0)`}>
        {/* Left Leg (Blue Pants) */}
        <g transform={`rotate(${legCycle * 14} 50 95)`}>
          <path d="M 46 92 L 44 116 L 38 120 L 48 122 L 50 92 Z" fill="#1e3a8a" stroke="#0f172a" strokeWidth="1.5" />
          {/* Black Shoe */}
          <path d="M 36 118 C 30 118, 28 123, 34 124 L 48 124 L 46 118 Z" fill="#0f172a" />
        </g>

        {/* Right Leg (Blue Pants with torn knee) */}
        <g transform={`rotate(${-legCycle * 14} 58 95)`}>
          <path d="M 54 92 L 56 104 L 52 108 L 58 116 L 66 122 L 56 122 L 58 92 Z" fill="#1d4ed8" stroke="#0f172a" strokeWidth="1.5" />
          {/* Exposed Green Knee */}
          <ellipse cx="54" cy="106" rx="2" ry="3" fill="#4ade80" />
          {/* Black Shoe */}
          <path d="M 52 120 C 46 120, 44 124, 50 125 L 68 125 L 66 120 Z" fill="#1e293b" />
        </g>

        {/* Torso: Grey Business Suit */}
        <path
          d="M 40 58 L 68 58 L 66 94 L 42 94 Z"
          fill="url(#suitGrad)"
          stroke="#0f172a"
          strokeWidth="2"
        />

        {/* White Dress Shirt V-Neck */}
        <polygon points="50,58 58,58 54,72" fill="#f8fafc" stroke="#0f172a" strokeWidth="1" />

        {/* Bright Red Necktie */}
        <polygon points="53,60 55,60 56,78 54,82 52,78" fill="#ef4444" stroke="#991b1b" strokeWidth="1" />

        {/* Suit Lapels & Pocket */}
        <path d="M 42 58 L 49 72 L 40 76" fill="none" stroke="#334155" strokeWidth="1.5" />
        <path d="M 66 58 L 59 72 L 67 76" fill="none" stroke="#334155" strokeWidth="1.5" />

        {/* Flag in Hand (for Flag Zombie) */}
        {hasFlag && (
          <g transform="translate(68, 15)">
            {/* Wooden Staff */}
            <line x1="0" y1="0" x2="-4" y2="95" stroke="#78350f" strokeWidth="3.5" strokeLinecap="round" />
            {/* Gold Spear Tip */}
            <polygon points="0,-6 -3,0 3,0" fill="#eab308" stroke="#a16207" strokeWidth="1" />

            {/* Red Tattered Flag */}
            <path
              d="M 0 0 L 36 6 L 28 18 L 38 28 L 0 34 Z"
              fill="#dc2626"
              stroke="#991b1b"
              strokeWidth="1.5"
            />
            {/* SVG Brain Icon on Flag */}
            <g transform="translate(10, 8) scale(0.65)">
              <path
                d="M 6 4 C 3 4, 1 7, 2 10 C 1 12, 2 15, 5 16 C 8 16, 9 14, 9 14 C 9 14, 10 16, 13 16 C 16 15, 17 12, 16 10 C 17 7, 15 4, 12 4 C 10 4, 9 6, 9 6 C 9 6, 8 4, 6 4 Z"
                fill="#fecdd3"
                stroke="#fda4af"
                strokeWidth="1.2"
              />
              <path d="M 9 6 L 9 14" stroke="#fda4af" strokeWidth="1" />
              <path d="M 4 9 C 6 10, 7 8, 9 9" stroke="#fda4af" strokeWidth="0.8" fill="none" />
              <path d="M 14 9 C 12 10, 11 8, 9 9" stroke="#fda4af" strokeWidth="0.8" fill="none" />
            </g>
          </g>
        )}

        {/* Arms Reaching Forward (To Bite / Shamble) */}
        <g transform={isEating ? 'translate(-4, 4) rotate(-10 40 64)' : 'translate(0, 0)'}>
          {/* Back Arm */}
          <path d="M 60 62 L 78 68 L 84 76" fill="none" stroke="#475569" strokeWidth="7" strokeLinecap="round" />
          <circle cx="85" cy="77" r="4.5" fill="url(#zombieSkin)" stroke="#166534" strokeWidth="1.2" />

          {/* Front Arm (Torn sleeve with green zombie hand) */}
          <path d="M 44 62 L 24 66 L 14 74" fill="none" stroke="#475569" strokeWidth="8" strokeLinecap="round" />
          {/* Torn Sleeve Cuff */}
          <path d="M 23 64 L 21 72 L 25 70 Z" fill="#334155" />
          {/* Pale Green Shambling Hand */}
          <circle cx="12" cy="75" r="5" fill="url(#zombieSkin)" stroke="#166534" strokeWidth="1.5" />
          {/* Clawed Fingers */}
          <path d="M 9 75 L 4 74 M 9 78 L 4 80 M 11 80 L 7 84" stroke="#166534" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* Zombie Head Assembly */}
        <g transform="translate(48, 38)">
          {/* Head Base */}
          <ellipse cx="0" cy="0" rx="19" ry="21" fill="url(#zombieSkin)" stroke="#14532d" strokeWidth="2.5" />

          {/* Messy Hair Tufts */}
          <path d="M -12 -18 Q -16 -26 -8 -22 Q -4 -28 2 -21" fill="none" stroke="#713f12" strokeWidth="2" strokeLinecap="round" />

          {/* Sunken Ear */}
          <ellipse cx="19" cy="0" rx="3.5" ry="5.5" fill="#4ade80" stroke="#14532d" strokeWidth="1" />

          {/* Asymmetric Zombie Eyes */}
          {/* Right Eye (Larger, bulging) */}
          <circle cx="-6" cy="-4" r="7.5" fill="#fef08a" stroke="#14532d" strokeWidth="1.8" />
          <circle cx="-8" cy="-4" r="2.2" fill="#0f172a" />
          {/* Left Eye (Smaller, squinty) */}
          <circle cx="8" cy="-5" r="5.5" fill="#fef08a" stroke="#14532d" strokeWidth="1.8" />
          <circle cx="6" cy="-5" r="1.6" fill="#0f172a" />

          {/* Zombie Nose Cavity */}
          <polygon points="-1,4 -4,6 0,7" fill="#14532d" />

          {/* Mouth (Gapes open with exposed yellow teeth, animates when eating) */}
          <g transform={isEating ? 'scale(1, 1.25)' : 'scale(1, 1)'}>
            <path
              d="M -12 11 Q -3 18 10 11 Q 6 22 -6 20 Z"
              fill="#450a0a"
              stroke="#14532d"
              strokeWidth="1.5"
            />
            {/* Upper Teeth */}
            <rect x="-8" y="11" width="3" height="4" fill="#fef08a" stroke="#713f12" strokeWidth="0.8" />
            <rect x="-2" y="11" width="2.8" height="4.5" fill="#fef08a" stroke="#713f12" strokeWidth="0.8" />
            <rect x="4" y="11" width="3" height="3.5" fill="#fef08a" stroke="#713f12" strokeWidth="0.8" />
            {/* Lower Teeth */}
            <rect x="-5" y="16" width="3" height="3" fill="#fef08a" stroke="#713f12" strokeWidth="0.8" />
            <rect x="1" y="15" width="2.5" height="3.5" fill="#fef08a" stroke="#713f12" strokeWidth="0.8" />
          </g>

          {/* CONEHEAD ATTACHMENT */}
          {hasCone && (
            <g transform="translate(0, -18)">
              {/* Traffic Cone Base */}
              <ellipse cx="0" cy="2" rx="18" ry="6" fill="#c2410c" stroke="#7c2d12" strokeWidth="1.5" />
              {/* Orange Cone Body */}
              <path
                d="M -15 2 L -5 -38 L 5 -38 L 15 2 Z"
                fill="url(#coneGrad)"
                stroke="#9a3412"
                strokeWidth="2"
              />
              {/* White Reflective Band */}
              <path
                d="M -11 -12 L -8 -24 L 8 -24 L 11 -12 Z"
                fill="#ffffff"
                stroke="#e2e8f0"
                strokeWidth="1"
                opacity="0.95"
              />
              {/* Top Cap */}
              <ellipse cx="0" cy="-38" rx="5" ry="2" fill="#ea580c" />
              {/* Cone Damage Cracks if damaged */}
              {coneHp < 350 && (
                <path d="M -3 -8 L 2 -16 L -1 -24" stroke="#7c2d12" strokeWidth="1.8" fill="none" />
              )}
            </g>
          )}

          {/* BUCKETHEAD ATTACHMENT */}
          {hasBucket && (
            <g transform="translate(0, -16)">
              {/* Galvanized Metal Bucket */}
              <path
                d="M -17 6 L -13 -32 L 13 -32 L 17 6 Z"
                fill="url(#bucketGrad)"
                stroke="#334155"
                strokeWidth="2"
              />
              {/* Top Rim */}
              <ellipse cx="0" cy="-32" rx="13" ry="4" fill="#64748b" stroke="#334155" strokeWidth="1.5" />
              {/* Bottom Rim */}
              <ellipse cx="0" cy="6" rx="17" ry="5" fill="#94a3b8" stroke="#334155" strokeWidth="1.5" />
              {/* Metal Handle Ring */}
              <circle cx="16" cy="-12" r="3" fill="none" stroke="#475569" strokeWidth="2" />
              {/* Metal Handle Wire */}
              <path d="M 16 -12 C 14 -28, -14 -28, -16 -12" fill="none" stroke="#64748b" strokeWidth="2.5" />
              {/* Blood / Rust stains & dents */}
              <path d="M 4 -18 Q 8 -10 6 -4" stroke="#991b1b" strokeWidth="2.5" fill="none" opacity="0.8" />
              {/* Dent in bucket if damaged */}
              {bucketHp < 800 && (
                <path d="M -10 -16 Q -5 -12 -9 -6" stroke="#1e293b" strokeWidth="3" fill="none" />
              )}
            </g>
          )}
        </g>
      </g>
    </svg>
  );
};
