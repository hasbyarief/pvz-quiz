import React, { useState } from 'react';
import { GameState } from '../types/game';
import { Play, RotateCcw, ShieldAlert, Award, Apple, Shirt, PawPrint, Calendar, Smile, BookOpen, Utensils, Car, CheckCircle, GraduationCap, ChevronDown, ChevronUp, Trophy, Sparkles, Skull } from 'lucide-react';
import { PlantRenderer } from './svg/PlantRenderer';
import { ZombieSVG } from './svg/ZombieSVG';
import { PLANTS } from '../game/constants';
import { SubjectCategory, SUBJECTS } from '../game/quizData';

interface ModalsProps {
  gameState: GameState;
  onStartGame: () => void;
  onRestartGame: () => void;
  waveAlert: string | null;
  selectedSubject: SubjectCategory;
  onSelectSubject: (subject: SubjectCategory) => void;
  highestUnlockedLevel: number;
  completedLevels: number[];
  onNextLevel: () => void;
  onBackToMap: () => void;
  stats: {
    zombiesDefeated: number;
    sunCollected: number;
    lawnMowersSaved: number;
    quizAnswered: number;
    quizCorrect: number;
  };
}

export const Modals: React.FC<ModalsProps> = ({
  gameState,
  onStartGame,
  onRestartGame,
  waveAlert,
  selectedSubject,
  onSelectSubject,
  highestUnlockedLevel,
  completedLevels,
  onNextLevel,
  onBackToMap,
  stats
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getSubjectIcon = (id: SubjectCategory) => {
    switch (id) {
      case 'fruits':
        return <Apple className="w-4 h-4 text-emerald-400" />;
      case 'clothing':
        return <Shirt className="w-4 h-4 text-indigo-400" />;
      case 'animals':
        return <PawPrint className="w-4 h-4 text-amber-400" />;
      case 'months':
        return <Calendar className="w-4 h-4 text-sky-400" />;
      case 'body_parts':
        return <Smile className="w-4 h-4 text-rose-400" />;
      case 'school_items':
        return <BookOpen className="w-4 h-4 text-cyan-400" />;
      case 'food':
        return <Utensils className="w-4 h-4 text-orange-400" />;
      case 'transportation':
        return <Car className="w-4 h-4 text-purple-400" />;
      case 'family':
        return <Smile className="w-4 h-4 text-pink-400" />;
      case 'colors':
        return <Sparkles className="w-4 h-4 text-fuchsia-400" />;
      case 'professions':
        return <GraduationCap className="w-4 h-4 text-yellow-400" />;
    }
  };

  const accuracyPct = stats.quizAnswered > 0 ? Math.round((stats.quizCorrect / stats.quizAnswered) * 100) : 0;
  const currentSubject = SUBJECTS.find((s) => s.id === selectedSubject) || SUBJECTS[0];

  return (
    <>
      {/* 1. HUGE WAVE / FINAL WAVE NOTIFICATION BANNER */}
      {waveAlert && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="bg-rose-950/90 border-y-4 border-rose-500 py-4 px-8 w-full shadow-2xl flex flex-col items-center justify-center animate-bounce">
            <span className="text-3xl sm:text-5xl font-black text-rose-200 uppercase tracking-widest text-center font-mono drop-shadow-[0_4px_12px_rgba(244,63,94,0.8)]">
              {waveAlert}
            </span>
            <span className="text-rose-300 text-sm font-bold tracking-wide mt-1">
              Bersiaplah! Pertahankan kebun Anda!
            </span>
          </div>
        </div>
      )}

      {/* 2. START / TITLE SCREEN MODAL (EDUKATIF VOCABULARY) */}
      {gameState === 'READY' && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-emerald-500/70 rounded-3xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl text-center flex flex-col items-center my-auto max-h-[96vh] overflow-y-auto">
            {/* Title Header */}
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12">
                <PlantRenderer type="peashooter" isShooting />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight font-sans uppercase leading-tight">
                  PVZ-QUIZ by hasbyarief
                </h1>
                <div className="flex items-center justify-center gap-1.5 text-xs text-amber-300 font-bold">
                  <GraduationCap className="w-4 h-4 text-amber-400" />
                  <span>English Vocabulary Edition</span>
                </div>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12">
                <ZombieSVG type="basic" />
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 mb-3 max-w-lg">
              Matahari jatuh dari langit secara berkala. Klik matahari dan jawab soal kuis kosakata bahasa Inggris dengan tepat untuk mengumpulkan energi matahari!
            </p>

            {/* ADVENTURE LEVEL MAP: level progression changes quiz topic only */}
            <div className="w-full text-left mb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4" /> Adventure Mode — Pilih Level
                </span>
                <span className="text-[10px] text-slate-400 font-bold">{completedLevels.length}/10 selesai</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 max-h-64 overflow-y-auto pr-1">
                {SUBJECTS.map((subj, index) => {
                  const level = index + 1;
                  const unlocked = level <= highestUnlockedLevel;
                  const completed = completedLevels.includes(level);
                  const selected = selectedSubject === subj.id;
                  return (
                    <button key={subj.id} type="button" disabled={!unlocked}
                      onClick={() => onSelectSubject(subj.id)}
                      className={`relative min-h-[88px] p-2 rounded-xl border-2 text-left transition-all ${
                        !unlocked ? 'bg-slate-950/80 border-slate-800 opacity-50 cursor-not-allowed' :
                        selected ? 'bg-emerald-950 border-emerald-400 ring-2 ring-emerald-400/30' :
                        completed ? 'bg-amber-950/40 border-amber-600/70 hover:border-amber-400' :
                        'bg-slate-900 border-slate-700 hover:border-emerald-500'
                      }`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-black text-slate-400">LEVEL {level}</span>
                        {completed ? <CheckCircle className="w-4 h-4 text-amber-400" /> : unlocked ? getSubjectIcon(subj.id) : <ShieldAlert className="w-4 h-4 text-slate-500" />}
                      </div>
                      <div className="text-xs font-black text-white uppercase leading-tight">{subj.englishTitle}</div>
                      <div className="text-[9px] text-slate-400 mt-1 leading-tight">{subj.name}</div>
                      {selected && <span className="absolute bottom-1 right-1 text-[8px] font-black text-emerald-300">DIPILIH</span>}
                    </button>
                  );
                })}
              </div>
              <div className="mt-2 rounded-xl bg-slate-900/70 border border-slate-800 p-2.5">
                <div className="flex items-center gap-2 mb-0.5">
                  {getSubjectIcon(currentSubject.id)}
                  <span className="text-xs font-black text-amber-300">LEVEL {SUBJECTS.findIndex((s) => s.id === selectedSubject) + 1} — {currentSubject.englishTitle}</span>
                </div>
                <p className="text-[10px] text-slate-400">{currentSubject.description} Soal diacak. Semua level menggunakan mekanik, zombie, tanaman, dan gelombang yang sama.</p>
              </div>
            </div>

            {/* Plants Quick Showcase */}
            <div className="w-full grid grid-cols-3 sm:grid-cols-6 gap-1.5 bg-slate-950/70 p-2 rounded-2xl border border-slate-800 mb-3">
              {(['sunflower', 'peashooter', 'repeater', 'wallnut', 'cherrybomb', 'snowpea'] as const).map((t) => (
                <div key={t} className="flex flex-col items-center p-1 bg-slate-900/60 rounded-xl border border-slate-800/80">
                  <div className="w-8 h-8">
                    <PlantRenderer type={t} />
                  </div>
                  <span className="text-[9px] font-bold text-slate-200 mt-0.5 truncate max-w-full text-center">
                    {PLANTS[t].name}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-amber-300">
                    {PLANTS[t].cost} Sun
                  </span>
                </div>
              ))}
            </div>

            {/* Cara Main Singkat */}
            <div className="text-[11px] text-slate-400 mb-4 space-y-1 bg-slate-900/40 p-2.5 rounded-xl border border-slate-800 w-full text-left">
              <p><strong className="text-amber-300">• Ambil Matahari:</strong> Klik matahari yang jatuh dari langit, lalu pilih jawaban yang tepat untuk kuis!</p>
              <p><strong className="text-slate-200">• Tanam Pasukan:</strong> Klik kartu tanaman, lalu klik petak rumput kosong.</p>
              <p><strong className="text-emerald-300">• Adventure Mode:</strong> Selesaikan level untuk membuka topik kuis berikutnya. Mekanik permainan tetap sama di semua level.</p>
            </div>

            {/* Start Button */}
            <button
              type="button"
              onClick={onStartGame}
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 text-sm font-black rounded-2xl shadow-lg shadow-emerald-500/25 transition-all transform active:scale-95 cursor-pointer uppercase tracking-wider"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Mulai Belajar & Bermain</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. VICTORY MODAL: PERAYAAN JUARA */}
      {gameState === 'VICTORY' && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-slate-900 via-amber-950/40 to-slate-950 border-2 border-amber-500 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-[0_0_50px_rgba(245,158,11,0.4)] text-center flex flex-col items-center animate-in zoom-in-95 relative overflow-hidden">
            {/* Celebration Sparkles Tag */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/60 text-amber-300 text-xs font-black uppercase tracking-widest mb-3 animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>LEVEL {SUBJECTS.findIndex((s) => s.id === selectedSubject) + 1} COMPLETED!</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </div>

            {/* Glowing Trophy */}
            <div className="w-20 h-20 bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 rounded-3xl p-4 shadow-[0_0_35px_rgba(245,158,11,0.6)] animate-bounce mb-3 flex items-center justify-center">
              <Trophy className="w-12 h-12 text-slate-950 fill-current" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-amber-300 uppercase tracking-tight mb-1">
              Level Berhasil Diselesaikan!
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mb-4">
              Luar biasa! Anda sukses menjawab <strong className="text-amber-300">25 soal kuis</strong> dan bertahan melewati <strong className="text-emerald-400">Gelombang ke-5</strong>!
            </p>

            {/* Dual Requirement Badges */}
            <div className="grid grid-cols-2 gap-2 w-full mb-4">
              <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-500/50 flex flex-col items-center">
                <span className="text-[10px] uppercase font-bold text-emerald-400">Kuis Selesai</span>
                <span className="text-base font-black font-mono text-emerald-300">{stats.quizAnswered} / 25 ✓</span>
              </div>
              <div className="p-2 rounded-xl bg-amber-950/60 border border-amber-500/50 flex flex-col items-center">
                <span className="text-[10px] uppercase font-bold text-amber-400">Gelombang Akhir</span>
                <span className="text-base font-black font-mono text-amber-300">Wave 5/5 ✓</span>
              </div>
            </div>

            {/* Game Stats & Quiz Accuracy */}
            <div className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 mb-5 space-y-1.5 text-xs">
              <div className="flex justify-between items-center text-slate-400">
                <span>Topik Kosakata</span>
                <span className="font-bold text-amber-300 uppercase">
                  {SUBJECTS.find((s) => s.id === selectedSubject)?.name}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Akurasi Jawaban</span>
                <span className="font-bold font-mono text-emerald-400">
                  {stats.quizCorrect}/{stats.quizAnswered} ({accuracyPct}%)
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Zombie Dimusnahkan</span>
                <span className="font-bold font-mono text-slate-200">{stats.zombiesDefeated}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Pemotong Rumput Tersisa</span>
                <span className="font-bold font-mono text-blue-400">{stats.lawnMowersSaved}/5 Selamat</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 w-full">
              {SUBJECTS.findIndex((s) => s.id === selectedSubject) < SUBJECTS.length - 1 ? (
                <button type="button" onClick={onNextLevel} className="flex items-center justify-center gap-2 px-3 py-3.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 font-black rounded-xl shadow-lg transition-all active:scale-95 uppercase tracking-wide text-xs">
                  <Play className="w-4 h-4 fill-current" /> NEXT LEVEL
                </button>
              ) : (
                <button type="button" onClick={onBackToMap} className="flex items-center justify-center gap-2 px-3 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black rounded-xl shadow-lg transition-all active:scale-95 uppercase tracking-wide text-xs">
                  <Trophy className="w-4 h-4" /> SELESAI!
                </button>
              )}
              <button type="button" onClick={onBackToMap} className="flex items-center justify-center gap-2 px-3 py-3.5 bg-slate-700 hover:bg-slate-600 text-white font-black rounded-xl transition-all active:scale-95 uppercase tracking-wide text-xs">
                <Award className="w-4 h-4" /> LEVEL MAP
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. GAME OVER MODAL: THE ZOMBIES ATE YOUR BRAINS! */}
      {gameState === 'GAMEOVER' && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-rose-950 via-slate-950 to-black border-2 border-rose-600 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-[0_0_60px_rgba(225,29,72,0.6)] text-center flex flex-col items-center animate-in zoom-in-95 relative">
            {/* Spooky Skull Icon with pulsating eerie glow */}
            <div className="w-16 h-16 bg-rose-950/80 border-2 border-rose-500 rounded-2xl flex items-center justify-center mb-3 shadow-[0_0_30px_rgba(244,63,94,0.7)] animate-pulse">
              <Skull className="w-10 h-10 text-rose-500" />
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-rose-500 uppercase tracking-tight mb-1 font-mono drop-shadow-[0_2px_12px_rgba(244,63,94,0.8)]">
              THE ZOMBIES ATE YOUR BRAINS!
            </h2>
            <p className="text-xs sm:text-sm text-rose-200/90 mb-4 leading-relaxed">
              Zombie berhasil menembus pertahanan dan mencapai rumah Anda! Dengarkan gema musik yang mencekam... Jangan putus asa, kuatkan tanamanmu dan coba lagi!
            </p>

            <div className="w-full bg-slate-950/80 border border-rose-900/60 rounded-2xl p-3 mb-5 text-xs text-slate-400 flex justify-between items-center">
              <span>Hasil Kuis Terkumpul:</span>
              <span className="font-bold font-mono text-amber-300">{stats.quizAnswered} dari 25 Soal</span>
            </div>

            <button
              type="button"
              onClick={onRestartGame}
              className="flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-slate-100 font-black rounded-2xl shadow-lg shadow-rose-600/40 transition-all transform active:scale-95 cursor-pointer uppercase tracking-wider text-sm"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Bangkit & Coba Lagi</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
