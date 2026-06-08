import { useState, useEffect, useCallback } from 'react';

export const useWakeLock = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [wakeLock, setWakeLock] = useState<any | null>(null); // Type 'any' to avoid TS compilation issues if WakeLock is not defined in older TS configs

  useEffect(() => {
    setIsSupported('wakeLock' in navigator);
  }, []);

  const requestWakeLock = useCallback(async () => {
    if (!('wakeLock' in navigator)) return;
    try {
      const lock = await (navigator as any).wakeLock.request('screen');
      setWakeLock(lock);
      setIsActive(true);
      
      lock.addEventListener('release', () => {
        setIsActive(false);
      });
    } catch (err) {
      console.error('Failed to request Wake Lock:', err);
    }
  }, []);

  const releaseWakeLock = useCallback(async () => {
    if (wakeLock) {
      try {
        await wakeLock.release();
        setWakeLock(null);
        setIsActive(false);
      } catch (err) {
        console.error('Failed to release Wake Lock:', err);
      }
    }
  }, [wakeLock]);

  // Re-acquire lock if tab becomes visible again
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (wakeLock !== null && document.visibilityState === 'visible') {
        await requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [wakeLock, requestWakeLock]);

  return { isSupported, isActive, requestWakeLock, releaseWakeLock };
};
