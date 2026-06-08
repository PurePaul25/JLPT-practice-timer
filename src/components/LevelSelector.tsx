import React from 'react';
import { motion } from 'framer-motion';
import { useTimerContext } from '../context/TimerContext';
import { JLPT_LEVELS } from '../config/jlptConfig';

export const LevelSelector: React.FC = () => {
  const { levelId, changeLevel, status } = useTimerContext();
  const isExamActive = status === 'running' || status === 'paused';

  return (
    <div className="w-full">
      {isExamActive && (
        <div className="mb-3 flex items-center justify-center gap-2 text-xs font-semibold text-rose-500 dark:text-rose-400">
          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
          Đang thi — đổi cấp độ sẽ reset bài thi
        </div>
      )}
      <div className="relative flex rounded-2xl bg-slate-100 p-1 dark:bg-slate-800/60">
        {JLPT_LEVELS.map((level) => {
          const isSelected = level.id === levelId;
          return (
            <div key={level.id} className="relative flex-1">
              {isSelected && (
                <motion.div
                  layoutId="level-pill"
                  className={`absolute inset-0 rounded-xl bg-gradient-to-br ${level.badgeColor} shadow-md`}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <button
                onClick={() => changeLevel(level.id)}
                className="relative z-10 w-full py-2.5 text-center text-sm font-bold transition-colors duration-200"
              >
                <span className={isSelected
                  ? 'text-white'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                }>
                  {level.name}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
