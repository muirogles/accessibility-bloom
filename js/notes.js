/**
 * NOTES — the work's tuning, in one place.
 * Twelve-tone equal temperament, La4 = 440 Hz, scientific octave index
 * (Do4 = middle C = MIDI 60). Flowers declare rounded Hz in data-freq;
 * the synth snaps that root to its tempered pitch, so Re5 is exactly
 * twice Re4. The gesture's intervals (5/4, 3/2…) stay just ratios on
 * top of the tempered root: pure chords over an even tuning.
 */
const NAMES = ['Do', 'Do♯', 'Re', 'Re♯', 'Mi', 'Fa', 'Fa♯', 'Sol', 'Sol♯', 'La', 'La♯', 'Si'];
// Diatonic position of each pitch class (a sharp sits on its natural)
const LETTER = [0, 0, 1, 1, 2, 3, 3, 4, 4, 5, 5, 6];

export const midiOf = (hz) => Math.round(69 + 12 * Math.log2(hz / 440));
export const hzOf = (midi) => 440 * 2 ** ((midi - 69) / 12);
export const tempered = (hz) => hzOf(midiOf(hz));

/** "Fa♯5" for 740 Hz */
export const noteOf = (hz) => {
  const m = midiOf(hz);
  return NAMES[m % 12] + (Math.floor(m / 12) - 1);
};

/** Treble-staff step: 0 is the bottom line (Mi4), one per diatonic step */
export const stepOf = (midi) => (Math.floor(midi / 12) - 1) * 7 + LETTER[midi % 12] - (4 * 7 + 2);

/** Hz written the Spanish way, one decimal: 293,7 */
export const hzText = (hz) => hz.toFixed(1).replace('.', ',');
