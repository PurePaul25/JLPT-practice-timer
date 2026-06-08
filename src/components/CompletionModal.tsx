import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Check, Calendar, Clock, Award } from 'lucide-react';
import { useTimerContext } from '../context/TimerContext';

export const CompletionModal: React.FC = () => {
  const { showCompletionModal, closeCompletionModal, selectedLevel } = useTimerContext();

  const formatDate = () => {
    const d = new Date();
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  };

  const totalMinutes = Math.round(
    selectedLevel.sections.reduce((acc, s) => acc + s.duration, 0) / 60
  );

  return (
    <AnimatePresence>
      {showCompletionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', duration: 0.5, bounce: 0.3 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-2xl dark:border-slate-800 dark:bg-slate-900"
          >
            {/* Top gradient stripe */}
            <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${selectedLevel.badgeColor}`} />

            {/* Trophy */}
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
              <Trophy className="h-10 w-10 animate-bounce" />
            </div>

            <h2 className="mt-6 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Hoàn thành kỳ thi! 🎉
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Bạn đã hoàn thành toàn bộ bài thi thử JLPT. Chúc mừng!
            </p>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-4 text-left dark:bg-slate-800/40">
              <div className="flex items-center gap-2.5">
                <Award className="h-5 w-5 shrink-0 text-indigo-500" />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Cấp độ</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">JLPT {selectedLevel.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="h-5 w-5 shrink-0 text-emerald-500" />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Thời gian</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{totalMinutes} phút</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Calendar className="h-5 w-5 shrink-0 text-purple-500" />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Ngày thi</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{formatDate()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="h-5 w-5 shrink-0 text-emerald-500" />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Trạng thái</p>
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Hoàn thành</p>
                </div>
              </div>
            </div>

            <button
              onClick={closeCompletionModal}
              className={`mt-6 w-full rounded-2xl bg-gradient-to-r ${selectedLevel.badgeColor} py-3.5 text-sm font-bold text-white shadow-lg transition hover:opacity-90`}
            >
              Quay về trang chủ
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
