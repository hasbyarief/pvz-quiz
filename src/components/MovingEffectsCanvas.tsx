import React, { useEffect, useRef } from 'react';
import { ParticleEffect, ProjectileInstance } from '../types/game';
import { CELL_HEIGHT, STAGE_WIDTH, LAWN_HEIGHT } from '../game/constants';

interface MovingEffectsCanvasProps {
  projectiles: ProjectileInstance[];
  particles: ParticleEffect[];
}

/**
 * Low-end hybrid renderer:
 * React still owns game rules and interactive controls, while high-churn
 * projectiles and short-lived effects are painted into one canvas layer.
 */
export const MovingEffectsCanvas = React.memo<MovingEffectsCanvasProps>(
  ({ projectiles, particles }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d', { alpha: true, desynchronized: true });
      if (!canvas || !ctx) return;

      // Deliberately render at the game's logical resolution (DPR 1) on Low mode.
      if (canvas.width !== STAGE_WIDTH) canvas.width = STAGE_WIDTH;
      if (canvas.height !== LAWN_HEIGHT) canvas.height = LAWN_HEIGHT;
      ctx.clearRect(0, 0, STAGE_WIDTH, LAWN_HEIGHT);

      // Peas and ice peas: compact vector sprites, no DOM/SVG nodes per shot.
      for (const projectile of projectiles) {
        const x = projectile.x + 16;
        const y = projectile.row * CELL_HEIGHT + CELL_HEIGHT * 0.28 + 16;
        const ice = projectile.type === 'snowpea';
        ctx.save();
        ctx.translate(x, y);
        ctx.fillStyle = ice ? '#67e8f9' : '#4ade80';
        ctx.strokeStyle = ice ? '#0e7490' : '#166534';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(0, 0, 9, 7, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = ice ? '#ecfeff' : '#bbf7d0';
        ctx.beginPath();
        ctx.ellipse(-2.5, -2, 3, 2, -0.35, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Short-lived impact, frost, explosion and floating score effects.
      for (const particle of particles) {
        const progress = Math.max(0, Math.min(1, 1 - particle.lifetime / particle.maxLifetime));
        ctx.save();

        if (particle.type === 'sunText') {
          ctx.globalAlpha = 1 - progress;
          ctx.font = '900 22px ui-monospace, SFMono-Regular, monospace';
          ctx.textAlign = 'center';
          ctx.lineWidth = 3;
          ctx.strokeStyle = 'rgba(120,53,15,0.8)';
          ctx.fillStyle = '#fcd34d';
          const text = particle.text || '+25';
          const y = particle.y - progress * 40;
          ctx.strokeText(text, particle.x, y);
          ctx.fillText(text, particle.x, y);
        } else if (particle.type === 'explosion') {
          const radius = 20 + progress * 92;
          ctx.globalAlpha = 1 - progress;
          ctx.fillStyle = '#fb923c';
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = (1 - progress) * 0.8;
          ctx.fillStyle = '#fef3c7';
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, radius * 0.48, 0, Math.PI * 2);
          ctx.fill();
        } else {
          const radius = 7 + progress * 8;
          ctx.globalAlpha = 1 - progress;
          ctx.fillStyle = particle.type === 'frost' ? '#67e8f9' : '#86efac';
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
          ctx.fill();
          if (particle.type === 'frost') {
            ctx.strokeStyle = '#e0f2fe';
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        }

        ctx.restore();
      }
    }, [projectiles, particles]);

    return (
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 z-[35] w-full h-full pointer-events-none"
        style={{ width: STAGE_WIDTH, height: LAWN_HEIGHT }}
      />
    );
  }
);

MovingEffectsCanvas.displayName = 'MovingEffectsCanvas';
