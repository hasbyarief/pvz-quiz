import React from 'react';
import {
  PlantInstance,
  ZombieInstance,
  ProjectileInstance,
  SunInstance,
  LawnMowerInstance,
  ParticleEffect,
  PlantType
} from '../types/game';
import {
  GRID_ROWS,
  GRID_COLS,
  STAGE_WIDTH,
  CELL_WIDTH,
  CELL_HEIGHT,
  LAWN_LEFT_OFFSET,
  LAWN_GRID_WIDTH,
  LAWN_HEIGHT,
  RIGHT_STREET_WIDTH
} from '../game/constants';
import { PlantRenderer } from './svg/PlantRenderer';
import { ZombieSVG } from './svg/ZombieSVG';
import { LawnMowerSVG } from './svg/LawnMowerSVG';
import { SunSVG } from './svg/SunSVG';
import { ProjectileSVG } from './svg/ProjectilesSVG';
import { ShovelSVG } from './svg/ShovelSVG';
import { ExplosionEffectSVG } from './svg/ExplosionEffectSVG';

interface LawnGridProps {
  plants: PlantInstance[];
  zombies: ZombieInstance[];
  projectiles: ProjectileInstance[];
  suns: SunInstance[];
  lawnMowers: LawnMowerInstance[];
  particles: ParticleEffect[];
  selectedPlant: PlantType | null;
  isShovelActive: boolean;
  hoveredCell: { row: number; col: number } | null;
  mousePos: { x: number; y: number } | null;
  onCellClick: (row: number, col: number) => void;
  onCellHover: (row: number | null, col: number | null) => void;
  onSunClick: (sunId: string, e?: React.SyntheticEvent) => void;
  onContextMenu: (e: React.MouseEvent) => void;
}

export const LawnGrid: React.FC<LawnGridProps> = ({
  plants,
  zombies,
  projectiles,
  suns,
  lawnMowers,
  particles,
  selectedPlant,
  isShovelActive,
  hoveredCell,
  mousePos,
  onCellClick,
  onCellHover,
  onSunClick,
  onContextMenu
}) => {
  // Check if a cell is occupied by a plant
  const getPlantAt = (row: number, col: number) => {
    return plants.find((p) => p.row === row && p.col === col);
  };

  return (
    <div
      className="relative select-none overflow-hidden shadow-2xl border-4 border-emerald-950/80 bg-emerald-900 mx-auto rounded-xl"
      style={{
        width: STAGE_WIDTH, // 1280px
        height: LAWN_HEIGHT // 550px
      }}
      onContextMenu={onContextMenu}
      onMouseLeave={() => onCellHover(null, null)}
    >
      {/* 1. LAWN BASE BACKGROUND & GRID TILES */}
      <div className="absolute inset-0 flex">
        {/* Left House Driveway / Patio Strip (with Brick Pattern & Mower Station) */}
        <div
          className="h-full bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950/50 border-r-4 border-amber-950/70 relative z-0 flex flex-col justify-around items-center"
          style={{ width: LAWN_LEFT_OFFSET }}
        >
          {/* House Wall Brick Texture */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-amber-950/80 border-r-2 border-stone-700 flex flex-col justify-between py-2">
            {Array.from({ length: 15 }).map((_, i) => (
              <div key={i} className="w-full h-3 border-b border-amber-900/60 opacity-60" />
            ))}
          </div>

          {/* Stone Pavers for each row */}
          {Array.from({ length: GRID_ROWS }).map((_, r) => (
            <div
              key={r}
              className="w-full border-b border-stone-600/30 flex items-center justify-end pr-3 opacity-60"
              style={{ height: CELL_HEIGHT }}
            >
              <div className="w-12 h-14 rounded border border-stone-600/50 bg-stone-700/30" />
            </div>
          ))}
        </div>

        {/* 5x9 Lawn Cells (936px x 550px) */}
        <div
          className="relative grid z-0"
          style={{
            gridTemplateRows: `repeat(${GRID_ROWS}, ${CELL_HEIGHT}px)`,
            gridTemplateColumns: `repeat(${GRID_COLS}, ${CELL_WIDTH}px)`,
            width: LAWN_GRID_WIDTH,
            height: LAWN_HEIGHT
          }}
        >
          {Array.from({ length: GRID_ROWS }).map((_, r) =>
            Array.from({ length: GRID_COLS }).map((_, c) => {
              const isEven = (r + c) % 2 === 0;
              const isHovered = hoveredCell?.row === r && hoveredCell?.col === c;
              const existingPlant = getPlantAt(r, c);

              let highlightClass = '';
              if (isHovered) {
                if (selectedPlant) {
                  highlightClass = existingPlant
                    ? 'ring-4 ring-rose-500/80 bg-rose-500/25'
                    : 'ring-4 ring-emerald-300/90 bg-emerald-300/30';
                } else if (isShovelActive) {
                  highlightClass = existingPlant
                    ? 'ring-4 ring-rose-400/90 bg-rose-400/35'
                    : 'ring-2 ring-slate-400/30 bg-slate-400/10';
                }
              }

              return (
                <div
                  key={`${r}-${c}`}
                  onClick={() => onCellClick(r, c)}
                  onMouseEnter={() => onCellHover(r, c)}
                  className={`relative flex items-center justify-center transition-colors cursor-pointer border border-emerald-600/20 ${
                    isEven ? 'bg-[#3b8c3b]' : 'bg-[#327e32]'
                  } ${highlightClass}`}
                  style={{
                    width: CELL_WIDTH,
                    height: CELL_HEIGHT
                  }}
                >
                  {/* Subtle Grass tuft detail */}
                  <div className="absolute bottom-1 right-2 w-3.5 h-2.5 opacity-30 border-b-2 border-r-2 border-emerald-950 rounded-br pointer-events-none" />
                  {isEven && (
                    <div className="absolute top-2 left-3 w-1.5 h-1.5 rounded-full bg-emerald-300/20 pointer-events-none" />
                  )}

                  {/* In-Cell Ghost Plant Preview (Snaps cleanly into the target tile like original PvZ) */}
                  {isHovered && selectedPlant && !existingPlant && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50 z-10 transition-opacity">
                      <div className="w-16 h-16 animate-pulse">
                        <PlantRenderer type={selectedPlant} />
                      </div>
                    </div>
                  )}

                  {/* In-Cell Shovel Dig Target Indicator */}
                  {isHovered && isShovelActive && existingPlant && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-70 z-20 animate-bounce">
                      <div className="w-10 h-10">
                        <ShovelSVG />
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Right Street / Sidewalk where Zombies March In */}
        <div
          className="h-full bg-gradient-to-r from-stone-800 via-stone-900 to-slate-950 border-l-4 border-amber-950/70 relative z-0 flex flex-col justify-between"
          style={{ width: RIGHT_STREET_WIDTH }}
        >
          {/* Concrete sidewalk curb edge */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-stone-700/80 border-r-2 border-stone-600 flex flex-col justify-around">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="w-full h-8 border-b border-stone-800/80" />
            ))}
          </div>

          {/* Road Asphalt texture and street markings */}
          <div className="absolute left-10 right-4 top-0 bottom-0 flex flex-col justify-around items-center opacity-30 pointer-events-none">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-12 h-3 bg-amber-400 rounded-sm" />
            ))}
          </div>

          {/* Road Sewer Grate */}
          <div className="absolute right-6 bottom-8 w-16 h-20 border-2 border-stone-800 bg-stone-950/70 rounded grid grid-cols-4 gap-1 p-1 opacity-50 pointer-events-none">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-stone-800" />
            ))}
          </div>
        </div>
      </div>

      {/* 2. LAWN MOWERS (1 per row on the left patio) */}
      {lawnMowers.map((mower) => {
        if (mower.state === 'offscreen') return null;
        return (
          <div
            key={`mower-${mower.row}`}
            className="absolute z-10 transition-transform pointer-events-none"
            style={{
              left: mower.x + 10,
              top: mower.row * CELL_HEIGHT + (CELL_HEIGHT - 66) / 2,
              width: 84,
              height: 66
            }}
          >
            <LawnMowerSVG isActive={mower.state === 'triggered'} />
          </div>
        );
      })}

      {/* 3. PLANTS PLACED ON GRID */}
      {plants.map((plant) => {
        const x = LAWN_LEFT_OFFSET + plant.col * CELL_WIDTH;
        const y = plant.row * CELL_HEIGHT;

        return (
          <div
            key={plant.id}
            className="absolute z-10 pointer-events-none transition-transform"
            style={{
              left: x + (CELL_WIDTH - 92) / 2,
              top: y + (CELL_HEIGHT - 94) / 2,
              width: 92,
              height: 94
            }}
          >
            <PlantRenderer
              type={plant.type}
              hp={plant.hp}
              maxHp={plant.maxHp}
              isGlowing={plant.type === 'sunflower' && (plant.lastProduceTime % 12 >= 10.0)}
              fuseProgress={plant.fuseTimer !== undefined ? plant.fuseTimer / 1.0 : undefined}
            />
          </div>
        );
      })}

      {/* 4. ZOMBIES SHAMBLING ACROSS LAWN */}
      {zombies.map((zombie) => {
        const y = zombie.row * CELL_HEIGHT;
        return (
          <div
            key={zombie.id}
            className="absolute z-20 pointer-events-none transition-transform"
            style={{
              left: zombie.x - 50,
              top: y + (CELL_HEIGHT - 126) / 2 - 12,
              width: 105,
              height: 128
            }}
          >
            <ZombieSVG
              type={zombie.type}
              isEating={zombie.isEating}
              isSlowed={zombie.slowTimer > 0}
              coneHp={zombie.coneHp}
              bucketHp={zombie.bucketHp}
              animTime={zombie.animTime}
            />
          </div>
        );
      })}

      {/* 5. PROJECTILES (PEAS & ICE PEAS) */}
      {projectiles.map((proj) => {
        const y = proj.row * CELL_HEIGHT + CELL_HEIGHT * 0.28;
        return (
          <div
            key={proj.id}
            className="absolute z-25 pointer-events-none"
            style={{
              left: proj.x,
              top: y,
              width: 32,
              height: 32
            }}
          >
            <ProjectileSVG type={proj.type} />
          </div>
        );
      })}

      {/* 6. PARTICLES & VISUAL EFFECTS */}
      {particles.map((pt) => {
        const progress = 1 - pt.lifetime / pt.maxLifetime;

        if (pt.type === 'explosion') {
          return (
            <div
              key={pt.id}
              className="absolute z-35 pointer-events-none -translate-x-1/2 -translate-y-1/2"
              style={{
                left: pt.x,
                top: pt.y,
                width: 260,
                height: 260
              }}
            >
              <ExplosionEffectSVG progress={progress} />
            </div>
          );
        }

        if (pt.type === 'sunText') {
          return (
            <div
              key={pt.id}
              className="absolute z-40 pointer-events-none -translate-x-1/2 font-black text-amber-300 font-mono text-xl drop-shadow-md select-none transition-all"
              style={{
                left: pt.x,
                top: pt.y - progress * 40,
                opacity: 1 - progress
              }}
            >
              {pt.text || '+25'}
            </div>
          );
        }

        if (pt.type === 'splat' || pt.type === 'frost') {
          return (
            <div
              key={pt.id}
              className="absolute z-30 pointer-events-none -translate-x-1/2 -translate-y-1/2"
              style={{
                left: pt.x,
                top: pt.y,
                width: 28,
                height: 28,
                opacity: 1 - progress,
                transform: `scale(${1 + progress * 0.8})`
              }}
            >
              <div
                className={`w-full h-full rounded-full ${
                  pt.type === 'frost' ? 'bg-cyan-300 blur-[1px]' : 'bg-emerald-400'
                }`}
              />
            </div>
          );
        }

        return null;
      })}

      {/* 7. SUNS (HIGH-RESPONSIVENESS CLICK & TAP TARGET) */}
      {suns.map((sun) => {
        return (
          <div
            key={sun.id}
            onPointerDown={(e) => {
              e.stopPropagation();
              onSunClick(sun.id, e);
            }}
            onClick={(e) => {
              e.stopPropagation();
              onSunClick(sun.id, e);
            }}
            title={sun.isQuiz ? "Matahari Kuis (+50 Poin) - Jawab Soal" : "Matahari Biasa (+25 Poin)"}
            className="absolute z-40 cursor-pointer flex items-center justify-center select-none"
            style={{
              left: sun.x - 45,
              top: sun.y - 45,
              width: 90,
              height: 90,
              opacity: sun.isCollected ? Math.max(0, 1 - sun.collectAnimProgress) : 1,
              pointerEvents: sun.isCollected ? 'none' : 'auto',
              touchAction: 'none'
            }}
          >
            {/* Decoupled Visual Sun with generous drop-shadow & smooth hover */}
            <div className="w-[72px] h-[72px] pointer-events-none transition-transform duration-150 hover:scale-115 active:scale-95 drop-shadow-[0_0_14px_rgba(250,204,21,0.7)] animate-pulse relative">
              <SunSVG className="w-full h-full" isQuiz={sun.isQuiz} />

              {/* Tanda tanya badge mengambang di pojok matahari quiz */}
              {sun.isQuiz && (
                <div className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 font-black text-[11px] w-5 h-5 rounded-full flex items-center justify-center shadow-md border border-slate-900 animate-bounce font-mono">
                  ?
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
