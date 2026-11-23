/**
 * SYNESTHESIA — the audio engine.
 * One-shots with a natural fade-out, no loops. When a new sound arrives,
 * the previous one is cut with a short fade (no overlaps).
 * Sound is OFF on arrival: it only plays once the person turns it on
 * ("Sonido"), and that choice is remembered.
 */
import { tempered } from './notes.js';

const SOUND_KEY = 'bloom-v5-sound';
let ctx = null;
let voice = null;       // master gain of the sound currently playing
let isMuted = true;

export function init() {
  try { isMuted = localStorage.getItem(SOUND_KEY) !== 'on'; } catch (e) { /* no storage */ }
  return isMuted;
}

export function muted() { return isMuted; }

export function toggleMute() {
  isMuted = !isMuted;
  if (isMuted) cut(0.05);
  try { localStorage.setItem(SOUND_KEY, isMuted ? 'off' : 'on'); } catch (e) { /* no storage */ }
  return isMuted;
}

function cut(dur = 0.06) {
  if (!voice || !ctx) return;
  const t = ctx.currentTime;
  try {
    voice.gain.cancelScheduledValues(t);
    voice.gain.setValueAtTime(Math.max(voice.gain.value, 0.0001), t);
    voice.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  } catch (e) { /* node already released */ }
  voice = null;
}

/**
 * Fires a one-shot.
 * @param {number} base — base frequency in Hz
 * @param {object} opciones — { tipo, intervalos, paso, ganancia, caida }
 */
export function play(base, { kind = 'sine', intervals = [1], step = 0.09, gain = 0.08, decay = 0.9 } = {}) {
  if (isMuted || !base) return;
  ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === 'suspended') ctx.resume();
  cut();
  const t = ctx.currentTime;
  const root = tempered(base);   // 294 → 293.66: the octave above is exactly ×2
  const master = ctx.createGain();
  master.gain.setValueAtTime(1, t);
  master.connect(ctx.destination);
  voice = master;
  intervals.forEach((iv, i) => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = kind;
    o.frequency.value = root * iv;
    const t0 = t + i * step;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + decay);
    o.connect(g).connect(master);
    o.start(t0);
    o.stop(t0 + decay + 0.05);
  });
  const fin = (intervals.length - 1) * step + decay + 0.1;
  setTimeout(() => { if (voice === master) voice = null; }, fin * 1000);
}
