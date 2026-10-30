import React, { useEffect, useState } from 'react';
import { QuizQuestion, SUBJECTS } from '../game/quizData';
import { QUIZ_SUN_VALUE } from '../game/constants';
import { SunSVG } from './svg/SunSVG';
import { CheckCircle2, XCircle, Sparkles, Apple, Shirt, PawPrint, Calendar, Smile, BookOpen, Utensils, Car } from 'lucide-react';
import { soundManager } from '../audio/soundManager';

interface SunQuizModalProps {
  question: QuizQuestion;
  onAnswer: (isCorrect: boolean) => void;
  onCancel?: () => void;
}

export const SunQuizModal: React.FC<SunQuizModalProps> = ({ question, onAnswer }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(10);

  const subjectMeta = SUBJECTS.find((s) => s.id === question.subject) || SUBJECTS[0];

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedIndex(idx);
    setIsAnswered(true);

    const isCorrect = idx === question.correctIndex;

    if (isCorrect) {
      soundManager.playQuizCorrect();
      setTimeout(() => {
        onAnswer(true);
      }, 750);
    } else {
      soundManager.playQuizWrong();
      // Give student 2.2 seconds to read explanation before closing, or click continue
      setTimeout(() => {
        onAnswer(false);
      }, 2200);
    }
  };

  // Hitung mundur 10 detik. Saat habis, jawaban otomatis dianggap salah.
  useEffect(() => {
    if (isAnswered) return;

    if (timeLeft <= 0) {
      setIsAnswered(true);
      soundManager.playQuizWrong();
      onAnswer(false);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setTimeLeft((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearTimeout(timeoutId);
  }, [timeLeft, isAnswered, onAnswer]);

  const timerColor =
    timeLeft >= 6
      ? 'bg-emerald-500 text-emerald-300 border-emerald-500/50'
      : timeLeft >= 3
        ? 'bg-amber-500 text-amber-300 border-amber-500/50'
        : 'bg-rose-500 text-rose-300 border-rose-500/50';

  const timerBarColor =
    timeLeft >= 6 ? 'bg-emerald-400' : timeLeft >= 3 ? 'bg-amber-400' : 'bg-rose-500';

  // Keyboard shortcut listener (1, 2, 3, 4)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnswered) return;

      const keyMap: Record<string, number> = {
        '1': 0,
        '2': 1,
        '3': 2,
        '4': 3,
        'Numpad1': 0,
        'Numpad2': 1,
        'Numpad3': 2,
        'Numpad4': 3
      };

      if (e.key in keyMap) {
        const optionIdx = keyMap[e.key];
        if (optionIdx < question.options.length) {
          e.preventDefault();
          handleSelect(optionIdx);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswered, question]);

  const renderSubjectIcon = () => {
    switch (question.subject) {
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
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-amber-500/80 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative flex flex-col items-center">
        {/* Glowing Sun Badge */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 -mt-14 mb-3 drop-shadow-[0_8px_20px_rgba(245,158,11,0.5)] animate-bounce">
          <SunSVG />
        </div>

        {/* Header Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700 text-xs font-bold text-slate-200">
            {renderSubjectIcon()}
            <span>{subjectMeta.name}</span>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-[11px] font-black text-emerald-300 font-mono">
            <span>Soal {question.questionNumber || 1} / {question.totalQuestions || 25}</span>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/50 text-[11px] font-black text-amber-300 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>+{QUIZ_SUN_VALUE} Matahari</span>
          </div>
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-amber-200 text-center font-sans uppercase tracking-tight mb-2">
          Kuis Matahari!
        </h3>

        {/* Countdown Timer */}
        <div className="w-full mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-slate-300">Waktu menjawab</span>
            <span className={`text-sm font-black font-mono tabular-nums ${timerColor.split(' ').slice(1).join(' ')}`}>
              00:{String(timeLeft).padStart(2, '0')}
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
            <div
              className={`h-full rounded-full transition-all duration-300 ${timerBarColor}`}
              style={{ width: `${(timeLeft / 10) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Box */}
        <div className="w-full bg-slate-950/70 border border-slate-800 rounded-2xl p-4 sm:p-5 mb-4 text-center">
          <p className="text-base sm:text-lg font-bold text-slate-100 leading-relaxed font-sans">
            {question.question}
          </p>
        </div>

        {/* Hint text */}
        <p className="text-xs text-slate-300 mb-4 text-center font-medium">
          Pilih jawaban yang benar di bawah untuk mengumpulkan matahari:
        </p>

        {/* Options Grid */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
          {question.options.map((opt, idx) => {
            const isThisSelected = selectedIndex === idx;
            const isThisCorrect = idx === question.correctIndex;

            let btnStyle = 'bg-slate-800/90 border-slate-700 hover:border-amber-400 hover:bg-slate-700/80 text-slate-100';

            if (isAnswered) {
              if (isThisCorrect) {
                btnStyle = 'bg-emerald-950/90 border-emerald-500 text-emerald-100 ring-2 ring-emerald-500/50 shadow-lg shadow-emerald-500/20';
              } else if (isThisSelected && !isThisCorrect) {
                btnStyle = 'bg-rose-950/90 border-rose-500 text-rose-100 ring-2 ring-rose-500/50';
              } else {
                btnStyle = 'bg-slate-900/50 border-slate-800 opacity-40 text-slate-400';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelect(idx)}
                disabled={isAnswered}
                className={`flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl border-2 transition-all duration-150 cursor-pointer text-left active:scale-95 ${btnStyle}`}
              >
                {/* Option Text */}
                <span className="font-bold text-sm sm:text-base flex-1 leading-snug">
                  {opt}
                </span>

                {/* Feedback Icon */}
                {isAnswered && isThisCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 ml-2" />
                )}
                {isAnswered && isThisSelected && !isThisCorrect && (
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback / Explanation Banner */}
        {isAnswered && (
          <div className={`w-full p-3 rounded-xl border text-xs sm:text-sm font-semibold flex flex-col gap-1 text-center animate-in zoom-in-95 ${
            selectedIndex === question.correctIndex
              ? 'bg-emerald-950/70 border-emerald-600/70 text-emerald-200'
              : 'bg-rose-950/70 border-rose-600/70 text-rose-200'
          }`}>
            <span className="font-bold">
              {selectedIndex === question.correctIndex
                ? `Benar! +${QUIZ_SUN_VALUE} Matahari berhasil didapatkan!`
                : 'Belum tepat! Perhatikan pembahasannya di bawah:'}
            </span>
            <span className="text-slate-300 font-normal text-xs">
              {question.explanation}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
