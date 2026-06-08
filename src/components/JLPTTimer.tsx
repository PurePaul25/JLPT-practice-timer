import React from 'react';
import { useTimerContext } from '../context/TimerContext';
import { useFullscreen } from '../hooks/useFullscreen';
import { LevelSelector } from './LevelSelector';
import { TimerDisplay } from './TimerDisplay';
import { ProgressTimeline } from './ProgressTimeline';
import { TimerControls } from './TimerControls';
import { SoundController } from './SoundController';
import { ConfirmModal } from './ConfirmModal';
import { CompletionModal } from './CompletionModal';
import { Sun, Moon, Maximize2, Minimize2, Eye, EyeOff } from 'lucide-react';

// Small decorative top gradient bar using the selected level colour
const LevelGradientBar: React.FC = () => {
  const { selectedLevel } = useTimerContext();
  return (
    <div className={`h-2 w-full bg-gradient-to-r ${selectedLevel.badgeColor}`} />
  );
};

export const JLPTTimer: React.FC = () => {
  const {
    theme, toggleTheme,
    status,
    keepScreenAwake, toggleKeepScreenAwake, isWakeLockActive,
    showChangeLevelModal, confirmChangeLevel,
    showResetConfirmModal, confirmReset,
  } = useTimerContext();

  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const isActive = status === 'running' || status === 'paused';

  return (
    <div className={`min-h-screen transition-colors duration-300 flex flex-col ${
      theme === 'dark'
        ? 'bg-slate-950'
        : 'bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100'
    }`}>

      {/* TOP NAV */}
      <header className="sticky top-0 z-30 border-b border-slate-200/60 bg-white/80 backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-sm shadow-indigo-500/20">
              <span className="text-sm font-black text-white">日</span>
            </div>
            <div>
              <p className="text-sm font-extrabold leading-none text-slate-900 dark:text-white">JLPT Timer</p>
              <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500">Modern Learning</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5">
            <SoundController />

            {/* Screen Awake */}
            <button
              onClick={toggleKeepScreenAwake}
              title={keepScreenAwake ? 'Tắt giữ màn hình sáng' : 'Bật giữ màn hình sáng'}
              className={`flex items-center justify-center rounded-xl border p-2 transition
                ${keepScreenAwake && isActive
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-800/50 dark:bg-emerald-950/30 dark:text-emerald-400'
                  : 'border-slate-200 bg-white text-slate-400 hover:text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:hover:text-slate-300'
                }`}
            >
              {keepScreenAwake && isWakeLockActive
                ? <Eye className="h-4 w-4" />
                : <EyeOff className="h-4 w-4" />
              }
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình'}
              className="flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-slate-400 hover:text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:hover:text-slate-300 transition"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Giao diện sáng' : 'Giao diện tối'}
              className="flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-slate-400 hover:text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:hover:text-slate-300 transition"
            >
              {theme === 'dark'
                ? <Sun className="h-4 w-4 text-amber-400" />
                : <Moon className="h-4 w-4" />
              }
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex flex-1 flex-col items-center justify-start px-4 py-8">
        <div className="w-full max-w-3xl space-y-4">

          {/* Level Selector Card */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800/60 dark:bg-slate-900/70">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Chọn cấp độ thi
            </p>
            <LevelSelector />
          </div>

          {/* Main Timer Card */}
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xl dark:border-slate-800/60 dark:bg-slate-900/70">
            {/* Coloured top stripe */}
            <LevelGradientBar />

            <div className="px-4 pb-7 pt-5 space-y-5 sm:px-8">
              {/* Clock display */}
              <TimerDisplay />

              {/* Step timeline */}
              <ProgressTimeline />

              {/* Divider */}
              <div className="h-px w-full bg-slate-100 dark:bg-slate-800" />

              {/* Control buttons */}
              <TimerControls />
            </div>
          </div>
        </div>
      </main>

      {/* MODALS */}
      <ConfirmModal
        isOpen={showChangeLevelModal}
        title="Thay đổi cấp độ?"
        message="Đổi cấp độ sẽ kết thúc bài thi hiện tại và reset toàn bộ tiến trình. Bạn có chắc không?"
        confirmLabel="Đồng ý đổi"
        cancelLabel="Huỷ"
        onConfirm={() => confirmChangeLevel(true)}
        onCancel={() => confirmChangeLevel(false)}
      />
      <ConfirmModal
        isOpen={showResetConfirmModal}
        title="Reset bài thi?"
        message="Toàn bộ tiến trình thi hiện tại sẽ bị xoá và đồng hồ quay về trạng thái ban đầu."
        confirmLabel="Đồng ý reset"
        cancelLabel="Huỷ"
        onConfirm={() => confirmReset(true)}
        onCancel={() => confirmReset(false)}
      />
      <CompletionModal />
    </div>
  );
};

export default JLPTTimer;
