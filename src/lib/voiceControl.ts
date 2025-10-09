// Lightweight voice control helpers: wraps SpeechRecognition and SpeechSynthesis
// Provide a simple command parser and TTS wrapper. This is intentionally small
// and dependency-free so it works out-of-the-box in supported browsers.

type Command = { intent: string; args?: string[] } | null;

export function parseVoiceCommand(text: string): Command {
  if (!text) return null;
  const t = text.trim().toLowerCase();

  // Simple intent recognition via regex and startsWith checks.
  if (t.startsWith('new chat') || t.startsWith('start new chat') || t === 'new conversation') {
    return { intent: 'new_chat' };
  }

  if (t.includes('next session') || t.includes('next chat') || t === 'next') {
    return { intent: 'next_session' };
  }

  if (t.includes('previous session') || t.includes('previous chat') || t === 'previous' || t === 'back') {
    return { intent: 'previous_session' };
  }

  if (t.startsWith('open sidebar') || t.startsWith('show sidebar')) {
    return { intent: 'open_sidebar' };
  }

  if (t.startsWith('close sidebar') || t.startsWith('hide sidebar')) {
    return { intent: 'close_sidebar' };
  }

  if (t.startsWith('read') || t.startsWith('read aloud') || t.startsWith('speak')) {
    // e.g. "read summary" or "read this"
    const words = t.split(/\s+/);
    return { intent: 'read', args: words.slice(1) };
  }

  if (t.startsWith('delete') || t.startsWith('remove')) {
    // e.g. "delete chat 2" or "remove chat"
    const words = t.split(/\s+/);
    // attempt to capture a trailing number
    const num = words.find(w => /^[0-9]+$/.test(w));
    return { intent: 'delete_chat', args: num ? [num] : words.slice(1) };
  }

  if (t.startsWith('summarize') || t.startsWith('summarise')) {
    return { intent: 'summarize', args: [t.replace(/^summarize\s*/i, '')] };
  }

  if (t === 'stop listening' || t === 'stop') {
    return { intent: 'stop_listening' };
  }

  if (t === 'start listening' || t === 'listen') {
    return { intent: 'start_listening' };
  }

  if (t.startsWith('change model to')) {
    const m = t.replace('change model to', '').trim();
    return { intent: 'change_model', args: [m] };
  }

  // Default: treat as a message to submit
  return { intent: 'submit_text', args: [text] };
}

// TTS wrapper using the Web Speech API (SpeechSynthesis)
export function speak(text: string, options?: { lang?: string; voiceName?: string; rate?: number; pitch?: number; volume?: number }) {
  if (!('speechSynthesis' in window)) {
    console.warn('SpeechSynthesis not available in this browser');
    return Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    const utter = new SpeechSynthesisUtterance(text);
    if (options?.lang) utter.lang = options.lang;
    if (options?.rate) utter.rate = options.rate;
    if (options?.pitch) utter.pitch = options.pitch;
    if (options?.volume) utter.volume = options.volume;

    // Try to pick a voice that matches voiceName if provided
    const voices = window.speechSynthesis.getVoices();
    if (options?.voiceName) {
      const v = voices.find((x) => x.name === options.voiceName);
      if (v) utter.voice = v;
    }

    utter.onend = () => resolve();
    utter.onerror = () => resolve();
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  });
}

// Lightweight SpeechRecognition starter that exposes events
export function createSpeechRecognizer(onResult: (text: string, isFinal: boolean) => void, lang = 'en-US') {
  // Feature detection
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!SpeechRecognition) return null;

  const rec: SpeechRecognition = new SpeechRecognition();
  rec.continuous = true;
  rec.interimResults = true;
  rec.lang = lang;

  rec.onresult = (event: SpeechRecognitionEvent) => {
    const transcript = Array.from(event.results)
      .map((r) => r[0].transcript)
      .join('');
    const isFinal = Array.from(event.results).some((r) => r.isFinal);
    onResult(transcript, isFinal);
  };

  return rec;
}
