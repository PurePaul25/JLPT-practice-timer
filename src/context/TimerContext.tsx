import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { JLPT_LEVELS, JLPTLevelConfig, JLPTSection } from '../config/jlptConfig';

export type ExamStatus = 'idle' | 'running' | 'paused' | 'finished';

interface TimerContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  status: ExamStatus;
  levelId: string;
  selectedLevel: JLPTLevelConfig;
  changeLevel: (newLevelId: string) => void;
  currentSectionIndex: number;
  currentSection: JLPTSection;
  secondsLeft: number;
  startExam: () => void;
  pauseExam: () => void;
  resumeExam: () => void;
  skipSection: () => void;
  prevSection: () => void;
  resetExam: () => void;
  isSoundEnabled: boolean;
  toggleSound: () => void;
  testSound: () => void;
  isPlayingTest: boolean;
  isPlayingBell: boolean;
  stopBell: () => void;
  keepScreenAwake: boolean;
  toggleKeepScreenAwake: () => void;
  isWakeLockActive: boolean;
  showChangeLevelModal: boolean;
  pendingLevelId: string | null;
  confirmChangeLevel: (confirm: boolean) => void;
  showResetConfirmModal: boolean;
  confirmReset: (confirm: boolean) => void;
  showCompletionModal: boolean;
  closeCompletionModal: () => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const useTimerContext = () => {
  const ctx = useContext(TimerContext);
  if (!ctx) throw new Error('useTimerContext must be used within a TimerProvider');
  return ctx;
};

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ─── Theme ────────────────────────────────────────────────────────────────
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const s = localStorage.getItem('jlpt-timer-theme');
    if (s === 'light' || s === 'dark') return s;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('jlpt-timer-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(p => p === 'light' ? 'dark' : 'light');

  // ─── Level ────────────────────────────────────────────────────────────────
  const [levelId, setLevelId] = useState<string>(
    () => localStorage.getItem('jlpt-timer-level') || 'N3'
  );
  const selectedLevel = JLPT_LEVELS.find(l => l.id === levelId) ?? JLPT_LEVELS[2];

  // ─── Exam State ───────────────────────────────────────────────────────────
  const [status, setStatus] = useState<ExamStatus>('idle');
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(selectedLevel.sections[0].duration);

  const currentSection = selectedLevel.sections[currentSectionIndex] ?? selectedLevel.sections[0];

  // Reset secondsLeft when section index changes
  useEffect(() => {
    setSecondsLeft(selectedLevel.sections[currentSectionIndex]?.duration ?? 0);
  }, [currentSectionIndex, selectedLevel]);

  // ─── Sound ───────────────────────────────────────────────────────────────
  const [isSoundEnabled, setIsSoundEnabled] = useState(
    () => localStorage.getItem('jlpt-timer-sound') !== 'false'
  );
  const [isPlayingTest, setIsPlayingTest] = useState(false);
  const [isPlayingBell, setIsPlayingBell] = useState(false);
  const bellRef = useRef<HTMLAudioElement | null>(null);
  const bellStopTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    bellRef.current = new Audio('/sounds/ChurchBell-Westminster chimes.mp3');
    bellRef.current.preload = 'auto';
    return () => { bellRef.current?.pause(); };
  }, []);

  const stopBell = useCallback(() => {
    if (bellStopTimerRef.current) clearTimeout(bellStopTimerRef.current);
    if (bellRef.current) {
      bellRef.current.pause();
      bellRef.current.currentTime = 0;
    }
    setIsPlayingTest(false);
    setIsPlayingBell(false);
  }, []);

  // Play bell to completion (no auto-stop timeout)
  const playBell = useCallback(() => {
    if (!isSoundEnabled || !bellRef.current) return;
    stopBell();
    setIsPlayingBell(true);
    bellRef.current.currentTime = 0;
    bellRef.current.play().catch(() => setIsPlayingBell(false));
    bellRef.current.onended = () => setIsPlayingBell(false);
  }, [isSoundEnabled, stopBell]);

  const testSound = useCallback(() => {
    if (!bellRef.current) return;
    if (isPlayingBell) {
      stopBell();
      return;
    }
    stopBell();
    setIsPlayingTest(true);
    setIsPlayingBell(true);
    bellRef.current.currentTime = 0;
    bellRef.current.play().catch(() => {
      setIsPlayingTest(false);
      setIsPlayingBell(false);
    });
    bellRef.current.onended = () => {
      setIsPlayingTest(false);
      setIsPlayingBell(false);
    };
  }, [isPlayingBell, stopBell]);

  const toggleSound = () => {
    setIsSoundEnabled(prev => {
      const next = !prev;
      localStorage.setItem('jlpt-timer-sound', String(next));
      if (!next) stopBell();
      return next;
    });
  };

  // ─── Timer Logic ─────────────────────────────────────────────────────────
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  // Use ref to always have latest section info without stale closure
  const currentSectionRef = useRef(currentSection);
  const currentSectionIndexRef = useRef(currentSectionIndex);
  const selectedLevelRef = useRef(selectedLevel);
  const statusRef = useRef(status);

  useEffect(() => { currentSectionRef.current = currentSection; }, [currentSection]);
  useEffect(() => { currentSectionIndexRef.current = currentSectionIndex; }, [currentSectionIndex]);
  useEffect(() => { selectedLevelRef.current = selectedLevel; }, [selectedLevel]);
  useEffect(() => { statusRef.current = status; }, [status]);

  // Section completion logic — uses refs so no stale closure
  const completeSection = useCallback(() => {
    const section = currentSectionRef.current;
    const index = currentSectionIndexRef.current;
    const level = selectedLevelRef.current;
    const sections = level.sections;
    const nextIndex = index + 1;

    // Only ring bell when a real exam section ends (not a break)
    if (!section.isBreak) {
      playBell();
    }

    if (nextIndex < sections.length) {
      setCurrentSectionIndex(nextIndex);
      // secondsLeft will be updated by the useEffect above watching currentSectionIndex
    } else {
      // All sections done
      setStatus('finished');
      setShowCompletionModal(true);
    }
  }, [playBell]);

  // Countdown interval — restarts whenever status or section index changes
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    if (status !== 'running') return;

    timerRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          // Stop this interval first
          if (timerRef.current) clearInterval(timerRef.current);
          timerRef.current = null;
          // Schedule completion OUTSIDE the state updater to avoid nested setState
          Promise.resolve().then(() => {
            // Only complete if still running (not paused/reset between ticks)
            if (statusRef.current === 'running') {
              completeSection();
            }
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status, currentSectionIndex, completeSection]);

  // ─── Controls ────────────────────────────────────────────────────────────
  const startExam = () => {
    setStatus('running');
  };

  const pauseExam = () => {
    setStatus('paused');
  };

  const resumeExam = () => {
    setStatus('running');
  };

  const skipSection = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    completeSection();
  };

  const prevSection = () => {
    stopBell();
    const prevIndex = currentSectionIndexRef.current - 1;
    if (prevIndex >= 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
      setCurrentSectionIndex(prevIndex);
      if (status === 'finished') setStatus('paused');
    }
  };

  const performReset = useCallback(() => {
    stopBell();
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setStatus('idle');
    setCurrentSectionIndex(0);
    setShowResetConfirmModal(false);
  }, [stopBell]);

  const resetExam = () => {
    if (status === 'running' || status === 'paused') {
      setShowResetConfirmModal(true);
    } else {
      performReset();
    }
  };

  const confirmReset = (confirm: boolean) => {
    if (confirm) performReset();
    else setShowResetConfirmModal(false);
  };

  // ─── Level Change ─────────────────────────────────────────────────────────
  const [showChangeLevelModal, setShowChangeLevelModal] = useState(false);
  const [pendingLevelId, setPendingLevelId] = useState<string | null>(null);

  const performLevelChange = useCallback((newId: string) => {
    stopBell();
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setLevelId(newId);
    localStorage.setItem('jlpt-timer-level', newId);
    setCurrentSectionIndex(0);
    setStatus('idle');
    setShowChangeLevelModal(false);
    setPendingLevelId(null);
  }, [stopBell]);

  const changeLevel = (newId: string) => {
    if (newId === levelId) return;
    if (status === 'running' || status === 'paused') {
      setPendingLevelId(newId);
      setShowChangeLevelModal(true);
    } else {
      performLevelChange(newId);
    }
  };

  const confirmChangeLevel = (confirm: boolean) => {
    if (confirm && pendingLevelId) performLevelChange(pendingLevelId);
    else { setShowChangeLevelModal(false); setPendingLevelId(null); }
  };

  // ─── Modals ───────────────────────────────────────────────────────────────
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const closeCompletionModal = () => {
    setShowCompletionModal(false);
    setStatus('idle');
    setCurrentSectionIndex(0);
  };

  // ─── Wake Lock ───────────────────────────────────────────────────────────
  const [keepScreenAwake, setKeepScreenAwake] = useState(true);
  const [isWakeLockActive, setIsWakeLockActive] = useState(false);
  const wakeLockRef = useRef<any>(null);

  const requestWakeLock = useCallback(async () => {
    if (!keepScreenAwake || !('wakeLock' in navigator) || wakeLockRef.current) return;
    try {
      const lock = await (navigator as any).wakeLock.request('screen');
      wakeLockRef.current = lock;
      setIsWakeLockActive(true);
      lock.addEventListener('release', () => {
        setIsWakeLockActive(false);
        wakeLockRef.current = null;
      });
    } catch {}
  }, [keepScreenAwake]);

  const releaseWakeLock = useCallback(async () => {
    if (!wakeLockRef.current) return;
    try { await wakeLockRef.current.release(); } catch {}
    wakeLockRef.current = null;
    setIsWakeLockActive(false);
  }, []);

  useEffect(() => {
    if (status === 'running' && keepScreenAwake) requestWakeLock();
    else releaseWakeLock();
  }, [status, keepScreenAwake, requestWakeLock, releaseWakeLock]);

  useEffect(() => {
    const fn = () => {
      if (document.visibilityState === 'visible' && status === 'running' && keepScreenAwake)
        requestWakeLock();
    };
    document.addEventListener('visibilitychange', fn);
    return () => document.removeEventListener('visibilitychange', fn);
  }, [status, keepScreenAwake, requestWakeLock]);

  const toggleKeepScreenAwake = () => setKeepScreenAwake(p => !p);

  // ─── Exit warning ─────────────────────────────────────────────────────────
  useEffect(() => {
    const fn = (e: BeforeUnloadEvent) => {
      if (status === 'running' || status === 'paused') { e.preventDefault(); e.returnValue = ''; }
    };
    window.addEventListener('beforeunload', fn);
    return () => window.removeEventListener('beforeunload', fn);
  }, [status]);

  return (
    <TimerContext.Provider value={{
      theme, toggleTheme,
      status,
      levelId, selectedLevel, changeLevel,
      currentSectionIndex, currentSection, secondsLeft,
      startExam, pauseExam, resumeExam, skipSection, prevSection, resetExam,
      isSoundEnabled, toggleSound, testSound, isPlayingTest, isPlayingBell, stopBell,
      keepScreenAwake, toggleKeepScreenAwake, isWakeLockActive,
      showChangeLevelModal, pendingLevelId, confirmChangeLevel,
      showResetConfirmModal, confirmReset,
      showCompletionModal, closeCompletionModal,
    }}>
      {children}
    </TimerContext.Provider>
  );
};
