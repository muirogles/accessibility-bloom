/**
 * SINESTESIA — motor de audio.
 * One-shot con fade-out natural, sin bucles. Si llega un sonido nuevo,
 * el anterior se corta con un desvanecimiento breve (sin solapes).
 * El sonido solo arranca por interacción y es silenciable (persistente).
 */
const MUTE_KEY = 'bloom-v4-isMuted';
let ctx = null;
let voice = null;       // ganancia maestra del sonido en curso
let isMuted = false;

export function init() {
  try { isMuted = localStorage.getItem(MUTE_KEY) === '1'; } catch (e) { /* sin storage */ }
  return isMuted;
}

export function muted() { return isMuted; }

export function toggleMute() {
  isMuted = !isMuted;
  if (isMuted) cut(0.05);
  try { localStorage.setItem(MUTE_KEY, isMuted ? '1' : '0'); } catch (e) { /* sin storage */ }
  return isMuted;
}

function cut(dur = 0.06) {
  if (!voice || !ctx) return;
  const t = ctx.currentTime;
  try {
    voice.gain.cancelScheduledValues(t);
    voice.gain.setValueAtTime(Math.max(voice.gain.value, 0.0001), t);
    voice.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  } catch (e) { /* nodo ya liberado */ }
  voice = null;
}

/**
 * Dispara un one-shot.
 * @param {number} base — frecuencia base en Hz
 * @param {object} opciones — { tipo, intervalos, paso, ganancia, caida }
 */
export function play(base, { kind = 'sine', intervals = [1], step = 0.09, gain = 0.08, decay = 0.9 } = {}) {
  if (isMuted || !base) return;
  ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === 'suspended') ctx.resume();
  cut();
  const t = ctx.currentTime;
  const master = ctx.createGain();
  master.gain.setValueAtTime(1, t);
  master.connect(ctx.destination);
  voice = master;
  intervals.forEach((iv, i) => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = kind;
    o.frequency.value = base * iv;
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
