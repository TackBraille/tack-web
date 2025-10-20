import { useEffect, useState } from 'react';

const TTS_KEY = 'tts-enabled';

export function useTTSSetting(): [boolean, (v: boolean) => void] {
  const [enabled, setEnabled] = useState<boolean>(() => {
    try {
      const raw = localStorage.getItem(TTS_KEY);
      return raw ? JSON.parse(raw) : true;
    } catch (e) {
      return true;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(TTS_KEY, JSON.stringify(enabled));
    } catch (e) {
      // ignore
    }
  }, [enabled]);

  return [enabled, setEnabled];
}

export default useTTSSetting;
