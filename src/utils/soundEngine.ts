// Windows-style sound effects using Web Audio API
const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

type SoundType = 'startup' | 'click' | 'open' | 'close' | 'minimize' | 'maximize' | 'notification' | 'error' | 'success' | 'coin' | 'level' | 'achievement';

const soundConfigs: Record<SoundType, { frequencies: number[]; durations: number[]; type: OscillatorType; gain: number }> = {
  startup: {
    frequencies: [523, 659, 784, 1047],
    durations: [150, 150, 150, 300],
    type: 'sine',
    gain: 0.15
  },
  click: {
    frequencies: [800],
    durations: [30],
    type: 'square',
    gain: 0.05
  },
  open: {
    frequencies: [400, 600],
    durations: [50, 100],
    type: 'sine',
    gain: 0.1
  },
  close: {
    frequencies: [600, 400],
    durations: [50, 80],
    type: 'sine',
    gain: 0.08
  },
  minimize: {
    frequencies: [500, 350],
    durations: [40, 60],
    type: 'triangle',
    gain: 0.08
  },
  maximize: {
    frequencies: [350, 500],
    durations: [40, 60],
    type: 'triangle',
    gain: 0.08
  },
  notification: {
    frequencies: [800, 1000, 800],
    durations: [100, 100, 150],
    type: 'sine',
    gain: 0.12
  },
  error: {
    frequencies: [200, 150],
    durations: [100, 200],
    type: 'sawtooth',
    gain: 0.1
  },
  success: {
    frequencies: [523, 659, 784],
    durations: [80, 80, 150],
    type: 'sine',
    gain: 0.1
  },
  coin: {
    frequencies: [1047, 1319],
    durations: [50, 100],
    type: 'square',
    gain: 0.08
  },
  level: {
    frequencies: [392, 523, 659, 784, 1047],
    durations: [80, 80, 80, 80, 200],
    type: 'sine',
    gain: 0.12
  },
  achievement: {
    frequencies: [523, 659, 784, 1047, 1319, 1568],
    durations: [60, 60, 60, 60, 60, 200],
    type: 'sine',
    gain: 0.15
  }
};

let isMuted = false;
let volume = 0.5;

export function setMuted(muted: boolean) {
  isMuted = muted;
}

export function setVolume(vol: number) {
  volume = Math.max(0, Math.min(1, vol));
}

export function getMuted() {
  return isMuted;
}

export function getVolume() {
  return volume;
}

export async function playSound(type: SoundType) {
  if (isMuted) return;
  
  try {
    // Resume audio context if suspended (browser autoplay policy)
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    const config = soundConfigs[type];
    let startTime = audioContext.currentTime;

    config.frequencies.forEach((freq, i) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.type = config.type;
      oscillator.frequency.setValueAtTime(freq, startTime);

      const duration = config.durations[i] / 1000;
      const gain = config.gain * volume;

      // Envelope
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(gain, startTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

      oscillator.start(startTime);
      oscillator.stop(startTime + duration + 0.05);

      startTime += duration;
    });
  } catch (e) {
    console.warn('Sound playback failed:', e);
  }
}

// Preload sounds by creating a silent play
export function initSounds() {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.001);
}
