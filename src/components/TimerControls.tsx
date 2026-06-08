import React from 'react';
import { motion } from 'framer-motion';
import { useTimerContext } from '../context/TimerContext';
import { Play, Pause, SkipForward, ChevronLeft, RotateCcw } from 'lucide-react';

export const TimerControls: React.FC = () => {
  const {
    status,
    currentSectionIndex,
    startExam,
    pauseExam,
    resumeExam,
    skipSection,
    prevSection,
    resetExam,
  } = useTimerContext();

  const isIdle = status === 'idle';
  const isRunning = status === 'running';
  const isPaused = status === 'paused';
  const isFinished = status === 'finished';
  const isFirstSection = currentSectionIndex === 0;

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* PRIMARY BUTTON */}
      <div className="w-full">
        {isIdle && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={startExam}
            className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600 py-4 text-base font-bold text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-shadow"
          >
            <Play className="h-5 w-5 fill-current" />
            Bắt đầu thi
          </motion.button>
        )}
        {isRunning && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={pauseExam}
            className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-slate-800 py-4 text-base font-bold text-white transition hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600"
          >
            <Pause className="h-5 w-5 fill-current" />
            Tạm dừng
          </motion.button>
        )}
        {isPaused && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={resumeExam}
            className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 py-4 text-base font-bold text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-shadow"
          >
            <Play className="h-5 w-5 fill-current" />
            Tiếp tục
          </motion.button>
        )}
        {isFinished && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={resetExam}
            className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 py-4 text-base font-bold text-white shadow-lg transition"
          >
            <RotateCcw className="h-5 w-5" />
            Thi lại từ đầu
          </motion.button>
        )}
      </div>

      {/* SECONDARY BUTTONS — only when exam is active */}
      {!isIdle && (
        <div className="flex items-center justify-center gap-2.5">
          <button
            onClick={prevSection}
            disabled={isFirstSection}
            title="Quay lại phần trước"
            className={`flex items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-semibold transition
              ${isFirstSection
                ? 'cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-700'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Phần trước
          </button>

          <button
            onClick={resetExam}
            title="Reset bài thi"
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-rose-950/20 dark:hover:text-rose-400 transition"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>

          <button
            onClick={skipSection}
            disabled={isFinished}
            title="Bỏ qua phần này"
            className={`flex items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-semibold transition
              ${isFinished
                ? 'cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-700'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
          >
            Bỏ qua
            <SkipForward className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
