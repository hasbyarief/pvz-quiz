import React from 'react';
import { PlantType } from '../types/game';
import { PLANTS } from '../game/constants';
import { PlantRenderer } from './svg/PlantRenderer';
import { SunSVG } from './svg/SunSVG';
import { ShovelSVG } from './svg/ShovelSVG';
import { Volume2, VolumeX, Pause, Play, RotateCcw, Apple, Shirt, PawPrint, Calendar, Smile, BookOpen, Utensils, Car, GraduationCap } from 'lucide-react';
import { SubjectCategory, SUBJECTS } from '../game/quizData';

interface HUDProps {
  sun: number;
  selectedPlant: PlantType | null;
  isShovelActive: boolean;
  onSelectPlant: (type: PlantType) => void;
  onToggleShovel: () => void;
  cooldowns: Record<PlantType, number>; // remaining seconds
  currentWave: number;
  totalWaves: number;
  waveProgress: number; // 0..1
  isMuted: boolean;
  onToggleMute: () => void;
  isPaused: boolean;
  onTogglePause: () => void;
  onRestart: () => void;
  selectedSubject: SubjectCategory;
  quizStats: {
    answered: number;
    correct: number;
  };
}

const PLANT_ORDER: PlantType[] = ['sunflower', 'peashooter', 'repeater', 'wallnut', 'cherrybomb', 'snowpea'];

export const HUD: React.FC<HUDProps> = ({
  sun,
  selectedPlant,
  isShovelActive,
  onSelectPlant,
  onToggleShovel,
  cooldowns,
  currentWave,
  totalWaves,
  waveProgress,
  isMuted,
  onToggleMute,
  isPaused,
  onTogglePause,
  onRestart,
  selectedSubject,
  quizStats
}) => {
  const currentSubj = SUBJECTS.find((s) => s.id === selectedSubject) || SUBJECTS[0];

  const renderSubjectIcon = () => {
    switch (selectedSubject) {
      case 'fruits':
        return <Apple className="w-3.5 h-3.5 text-emerald-400" />;
      case 'clothing':
        return <Shirt className="w-3.5 h-3.5 text-indigo-400" />;
      case 'animals':
        return <PawPrint className="w-3.5 h-3.5 text-amber-400" />;
      case 'months':
        return <Calendar className="w-3.5 h-3.5 text-sky-400" />;
      case 'body_parts':
        return <Smile className="w-3.5 h-3.5 text-rose-400" />;
      case 'school_items':
        return <BookOpen className="w-3.5 h-3.5 text-cyan-400" />;
      case 'food':
        return <Utensils className="w-3.5 h-3.5 text-orange-400" />;
      case 'transportation':
        return <Car className="w-3.5 h-3.5 text-purple-400" />;
    }
  };

  return (
    <header className="w-full max-w-[1280px] mx-auto px-3 py-1.5 flex flex-wrap items-center justify-between gap-2 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl shadow-2xl relative z-30 shrink-0">
      {/* LEFT: Sun Bank & Plant Seed Packets */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Sun Bank Counter */}
        <div className="flex items-center gap-2 bg-gradient-to-b from-amber-950/80 to-amber-900/60 border-2 border-amber-500/70 rounded-xl px-3 py-1.5 shadow-inner">
          <div className="w-9 h-9 shrink-0 animate-pulse">
            <SunSVG />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300/80">Matahari</span>
            <span className="text-xl font-black text-amber-100 font-mono tracking-tight leading-none tabular-nums">
              {sun}
            </span>
          </div>
        </div>

        {/* Seed Packets / Plant Cards */}
        <div className="flex items-center gap-1.5 bg-slate-950/60 p-1.5 rounded-xl border border-slate-800">
          {PLANT_ORDER.map((type) => {
            const config = PLANTS[type];
            const remainingCooldown = cooldowns[type] || 0;
            const cooldownRatio = remainingCooldown / config.cooldown;
            const isAffordable = sun >= config.cost;
            const isReady = remainingCooldown <= 0;
            const isSelected = selectedPlant === type;
            const isDisabled = !isAffordable || !isReady;

            return (
              <button
                key={type}
                type="button"
                onClick={() => {
                  if (!isDisabled) {
                    onSelectPlant(type);
                  }
                }}
                disabled={isDisabled}
                title={`${config.name} (${config.cost} Matahari) - ${config.description}`}
                className={`group relative flex flex-col items-center justify-between w-[68px] sm:w-[74px] h-[86px] sm:h-[92px] p-1 rounded-lg border-2 transition-all duration-150 select-none overflow-hidden ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/50 scale-105 shadow-lg shadow-amber-500/20'
                    : isDisabled
                    ? 'bg-slate-900/50 border-slate-700/50 opacity-60 cursor-not-allowed'
                    : 'bg-slate-800/90 border-slate-600 hover:border-emerald-400 hover:bg-slate-700/80 cursor-pointer active:scale-95'
                }`}
              >
                {/* Seed Packet Header: Name */}
                <div className="w-full flex items-center justify-center min-h-[22px] px-0.5">
                  <span className="text-[8.5px] sm:text-[9px] font-bold text-slate-100 uppercase tracking-tight text-center leading-[1.1] break-words">
                    {config.name}
                  </span>
                </div>

                {/* Plant Thumbnail SVG */}
                <div className={`w-9 h-9 sm:w-10 sm:h-10 my-0.5 transition-transform ${isSelected ? 'scale-110' : 'group-hover:scale-105'}`}>
                  <PlantRenderer type={type} />
                </div>

                {/* Sun Cost Badge */}
                <div className="flex items-center justify-center gap-0.5 w-full bg-slate-950/80 py-0.5 px-1 rounded text-center">
                  <div className="w-3 h-3 shrink-0">
                    <SunSVG />
                  </div>
                  <span className={`text-[11px] font-black font-mono leading-none ${isAffordable ? 'text-amber-300' : 'text-rose-400'}`}>
                    {config.cost}
                  </span>
                </div>

                {/* Cooldown Recharge Translucent Overlay */}
                {cooldownRatio > 0 && (
                  <div
                    className="absolute inset-0 bg-slate-950/75 pointer-events-none transition-all duration-100 flex items-center justify-center"
                    style={{
                      clipPath: `polygon(0 0, 100% 0, 100% ${Math.ceil(cooldownRatio * 100)}%, 0 ${Math.ceil(cooldownRatio * 100)}%)`
                    }}
                  >
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      {remainingCooldown.toFixed(1)}s
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Shovel Tool */}
        <button
          type="button"
          onClick={onToggleShovel}
          title="Sekop: Klik untuk mencabut tanaman dari rumput"
          className={`flex flex-col items-center justify-center w-12 sm:w-14 h-[86px] sm:h-[92px] p-1 rounded-xl border-2 transition-all cursor-pointer ${
            isShovelActive
              ? 'bg-rose-500/20 border-rose-400 ring-2 ring-rose-400/50 scale-105 shadow-lg shadow-rose-500/20'
              : 'bg-slate-800/80 border-slate-700 hover:border-slate-500 hover:bg-slate-700 active:scale-95'
          }`}
        >
          <div className="w-8 h-8">
            <ShovelSVG />
          </div>
          <span className="text-[9px] font-bold text-slate-300 mt-1 uppercase tracking-tight">
            Sekop
          </span>
        </button>
      </div>

      {/* RIGHT: Subject Badge, Wave Progress Bar & Action Controls */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {/* Active Subject Badge (Display-only - locked during gameplay) */}
        <div
          title={`Materi Kuis: ${currentSubj.name} (${currentSubj.englishTitle}) - Dipilih di menu awal`}
          className="flex items-center gap-2 bg-slate-950/70 border border-slate-700/80 px-2.5 py-1.5 rounded-xl text-left select-none"
        >
          <div className="p-1 rounded-lg bg-slate-900 border border-slate-700">
            {renderSubjectIcon()}
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight flex items-center gap-1">
              <GraduationCap className="w-2.5 h-2.5 text-amber-400" />
              Materi Kuis
            </span>
            <span className="text-xs font-black text-amber-300 truncate max-w-[110px]">
              {currentSubj.name}
            </span>
          </div>
        </div>

        {/* Quiz Target Progress Tracker */}
        <div className="flex flex-col items-center justify-center bg-slate-950/70 px-2.5 py-1.5 rounded-xl border border-slate-800">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Jawaban Benar</span>
          <span className="text-xs font-black font-mono text-emerald-400">
            {quizStats.correct}/25 {quizStats.correct >= 25 ? '✓' : ''}
          </span>
        </div>

        {/* Wave Progress Bar */}
        <div className="flex flex-col gap-1 w-28 sm:w-36 bg-slate-950/70 p-2 rounded-xl border border-slate-800">
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-300">
            <span>Wave {currentWave}/{totalWaves}</span>
            <span className="text-amber-400 font-mono">{Math.round(waveProgress * 100)}%</span>
          </div>

          <div className="relative w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-600 transition-all duration-300 rounded-full"
              style={{ width: `${Math.min(100, Math.max(0, waveProgress * 100))}%` }}
            />
          </div>
        </div>

        {/* System Buttons */}
        <div className="flex items-center gap-1">
          {/* Pause / Resume */}
          <button
            type="button"
            onClick={onTogglePause}
            title={isPaused ? 'Lanjutkan Game' : 'Jeda Game'}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors cursor-pointer"
          >
            {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4" />}
          </button>

          {/* Sound Mute Toggle */}
          <button
            type="button"
            onClick={onToggleMute}
            title={isMuted ? 'Nyalakan Audio' : 'Bisukan Audio'}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Restart */}
          <button
            type="button"
            onClick={onRestart}
            title="Mulai Ulang Game"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>
    </header>
  );
};
