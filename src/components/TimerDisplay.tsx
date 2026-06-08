import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTimerContext } from '../context/TimerContext';
import { Coffee, Timer, PauseCircle } from 'lucide-react';

export const TimerDisplay: React.FC = () => {
  const { secondsLeft, currentSection, selectedLevel, status } = useTimerContext();

  const formatTime = (total: number) => {
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    return {
      h: h.toString().padStart(2, '0'),
      m: m.toString().padStart(2, '0'),
      s: s.toString().padStart(2, '0'),
    };
  };

  const { h, m, s } = formatTime(secondsLeft);

  const isUrgent = status === 'running' && secondsLeft < 30;
  const isWarning = status === 'running' && secondsLeft >= 30 && secondsLeft < 60;
  const isCaution = status === 'running' && secondsLeft >= 60 && secondsLeft < 300;

  const clockColor = isUrgent
    ? 'text-rose-500 dark:text-rose-400'
    : isWarning
    ? 'text-rose-400 dark:text-rose-400'
    : isCaution
    ? 'text-amber-500 dark:text-amber-400'
    : 'text-slate-800 dark:text-white';

  const glowClass = isUrgent
    ? 'drop-shadow-[0_0_20px_rgba(244,63,94,0.5)]'
    : isCaution
    ? 'drop-shadow-[0_0_12px_rgba(245,158,11,0.3)]'
    : '';

  return (
    <div className="flex flex-col items-center gap-5 py-6">
      {/* Level + Section badge */}
      <div className="flex items-center gap-3">
        <span className={`rounded-full bg-gradient-to-r ${selectedLevel.badgeColor} px-4 py-1 text-xs font-black tracking-widest text-white shadow-sm`}>
          JLPT {selectedLevel.name}
        </span>
        <span className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
          {currentSection.isBreak
            ? <Coffee className="h-3.5 w-3.5 text-emerald-500" />
            : <Timer className="h-3.5 w-3.5 text-indigo-500" />
          }
          {currentSection.nameVi}
        </span>
      </div>

      {/* Main Clock */}
      <div className={`relative flex items-end justify-center gap-1 font-mono transition-all duration-300 ${clockColor} ${glowClass} ${isUrgent ? 'animate-pulse' : ''}`}>
        {/* Hours */}
        <AnimatePresence mode="popLayout">
          <motion.span
            key={h}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="font-black text-7xl md:text-8xl tabular-nums leading-none"
          >
            {h}
          </motion.span>
        </AnimatePresence>
        <span className="mb-2 text-4xl font-black opacity-60 sm:text-5xl md:text-6xl">:</span>
        {/* Minutes */}
        <AnimatePresence mode="popLayout">
          <motion.span
            key={m}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="font-black text-7xl md:text-8xl tabular-nums leading-none"
          >
            {m}
          </motion.span>
        </AnimatePresence>
        <span className="mb-2 text-4xl font-black opacity-60 sm:text-5xl md:text-6xl">:</span>
        {/* Seconds */}
        <AnimatePresence mode="popLayout">
          <motion.span
            key={s}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="font-black text-7xl md:text-8xl tabular-nums leading-none"
          >
            {s}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Status hint */}
      <div className="h-5 text-center">
        <AnimatePresence mode="wait">
          {status === 'idle' && (
            <motion.p key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Sẵn sàng bắt đầu
            </motion.p>
          )}
          {status === 'paused' && (
            <motion.p key="paused" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-500 dark:text-amber-400 animate-pulse">
              <PauseCircle className="h-3.5 w-3.5" /> Đang tạm dừng
            </motion.p>
          )}
          {isUrgent && (
            <motion.p key="urgent" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-xs font-bold uppercase tracking-widest text-rose-500 dark:text-rose-400">
              ⚡ Sắp hết giờ! Dưới 30 giây!
            </motion.p>
          )}
          {isWarning && (
            <motion.p key="warning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-xs font-semibold text-rose-400 dark:text-rose-400">
              ⚠️ Còn dưới 1 phút
            </motion.p>
          )}
          {isCaution && (
            <motion.p key="caution" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-xs font-semibold text-amber-500 dark:text-amber-400">
              ⏳ Còn dưới 5 phút — hãy tập trung!
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
