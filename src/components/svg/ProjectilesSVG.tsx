import React from 'react';

interface ProjectileSVGProps {
  type: 'pea' | 'snowpea';
  className?: string;
}

export const ProjectileSVG: React.FC<ProjectileSVGProps> = ({ type, className = '' }) => {
  if (type === 'snowpea') {
    return (
      <svg viewBox="0 0 40 40" className={`w-full h-full ${className}`} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="icePeaGrad" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#7dd3fc" />
            <stop offset="80%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0369a1" />
          </radialGradient>
        </defs>

        {/* Cold Trail */}
        <path d="M 4 20 L 16 14 L 16 26 Z" fill="#bae6fd" opacity="0.6" />
        <ellipse cx="10" cy="20" rx="6" ry="3" fill="#38bdf8" opacity="0.4" />

        {/* Crystal Orb */}
        <circle cx="24" cy="20" r="12" fill="url(#icePeaGrad)" stroke="#0284c7" strokeWidth="2" />

        {/* Ice Facet Lines */}
        <polygon points="20,12 28,15 24,20" fill="#ffffff" opacity="0.7" />
        <circle cx="21" cy="16" r="2.5" fill="#ffffff" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 40 40" className={`w-full h-full ${className}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="greenPeaGrad" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#bbf7d0" />
          <stop offset="40%" stopColor="#4ade80" />
          <stop offset="85%" stopColor="#15803d" />
          <stop offset="100%" stopColor="#14532d" />
        </radialGradient>
      </defs>

      {/* Speed Trail */}
      <ellipse cx="10" cy="20" rx="8" ry="4" fill="#86efac" opacity="0.5" />

      {/* Spherical Green Pea */}
      <circle cx="22" cy="20" r="12" fill="url(#greenPeaGrad)" stroke="#14532d" strokeWidth="2" />

      {/* Spherical Specular Highlight */}
      <circle cx="18" cy="16" r="3" fill="#ffffff" opacity="0.9" />
    </svg>
  );
};
