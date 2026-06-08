import React from 'react';
import { motion } from 'framer-motion';
import { useTimerContext } from '../context/TimerContext';
import { Check, Coffee, Mic, BookOpen, FileText, Languages } from 'lucide-react';

const SECTION_ICONS: Record<string, React.ReactNode> = {
  vocabulary: <Languages className="h-3.5 w-3.5" />,
  grammar: <BookOpen className="h-3.5 w-3.5" />,
  reading: <FileText className="h-3.5 w-3.5" />,
  'grammar-reading': <BookOpen className="h-3.5 w-3.5" />,
  'language-reading': <BookOpen className="h-3.5 w-3.5" />,
  listening: <Mic className="h-3.5 w-3.5" />,
};

export const ProgressTimeline: React.FC = () => {
  const { selectedLevel, currentSectionIndex, status } = useTimerContext();
  const sections = selectedLevel.sections;

  return (
    <div className="w-full px-1 py-2">
      <div className="relative flex flex-nowrap items-start justify-between gap-1">
        {/* Connector line behind everything - centered exactly at top-4 (16px) */}
        <div className="absolute inset-x-0 top-4 -translate-y-1/2 h-px bg-slate-200 dark:bg-slate-700" />

        {sections.map((section, index) => {
          const isCompleted = index < currentSectionIndex;
          const isActive = index === currentSectionIndex;

          let bubbleClass = '';
          if (isCompleted) {
            bubbleClass = 'bg-emerald-500 border-emerald-500 text-white shadow-emerald-200 dark:shadow-emerald-900/30';
          } else if (isActive) {
            bubbleClass = 'bg-indigo-600 border-indigo-600 text-white shadow-indigo-200 dark:shadow-indigo-900/30 ring-4 ring-indigo-100 dark:ring-indigo-900/40';
          } else {
            bubbleClass = 'bg-white border-slate-200 text-slate-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-500';
          }

          return (
            <div key={section.id} className="relative z-10 flex flex-col items-center gap-1.5 flex-1 flex-shrink-0">
              {/* Bubble circle */}
              <motion.div
                initial={false}
                animate={isActive && status === 'running' ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                transition={{ repeat: Infinity, duration: 2 }}
                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 shadow-sm transition-all duration-300 ${bubbleClass}`}
              >
                {isCompleted ? (
                  <Check className="h-3.5 w-3.5" />
                ) : section.isBreak ? (
                  <Coffee className="h-3.5 w-3.5" />
                ) : (
                  SECTION_ICONS[section.id] || null
                )}
              </motion.div>

              {/* Label text - responsive max-w to avoid squeezing too much */}
              <span className={`text-center text-[10px] font-semibold leading-tight transition-colors duration-300 max-w-[72px] sm:max-w-[90px]
                ${isCompleted ? 'text-emerald-600 dark:text-emerald-400'
                  : isActive ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-400 dark:text-slate-500'}`}
              >
                {section.nameVi}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
