import React from 'react';
import { useTimerContext } from '../context/TimerContext';
import { Bell, BellOff, Volume2 } from 'lucide-react';

export const SoundController: React.FC = () => {
  const { isSoundEnabled, toggleSound, testSound, isPlayingBell, stopBell } = useTimerContext();

  return (
    <div className="flex items-center gap-3">
      {/* Toggle */}
      <button
        onClick={toggleSound}
        title={isSoundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
        className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition
          ${isSoundEnabled
            ? 'border-indigo-200 bg-indigo-50 text-indigo-600 dark:border-indigo-800/60 dark:bg-indigo-950/30 dark:text-indigo-400'
            : 'border-slate-200 bg-white text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
          }`}
      >
        {isSoundEnabled
          ? <Volume2 className="h-3.5 w-3.5" />
          : <BellOff className="h-3.5 w-3.5" />
        }
        {isSoundEnabled ? 'Âm thanh: Bật' : 'Âm thanh: Tắt'}
      </button>

      {/* Test bell / Mute bell */}
      {isSoundEnabled && (
        <button
          onClick={isPlayingBell ? stopBell : testSound}
          title={isPlayingBell ? 'Dừng tiếng chuông ngay lập tức' : 'Chạy thử tiếng chuông'}
          className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition
            ${isPlayingBell
              ? 'border-rose-300 bg-rose-50 text-rose-600 dark:border-rose-800/60 dark:bg-rose-950/30 dark:text-rose-400 shadow-sm shadow-rose-200 dark:shadow-rose-900/20'
              : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
            }`}
        >
          <Bell className={`h-3.5 w-3.5 ${isPlayingBell ? 'animate-bounce text-rose-500' : ''}`} />
          {isPlayingBell ? 'Dừng chuông' : 'Thử chuông'}
        </button>
      )}
    </div>
  );
};
