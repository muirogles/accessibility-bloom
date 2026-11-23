/**
 * SCORE CHECK — development only (never in the build).
 * Station 2's staff is written by hand; this proves it tells the truth.
 * For every voice: the distinct notes its flowers really sound (data-freq
 * × the opening gesture's first interval), their median (the lower one
 * if the count is even), and from it the staff step. If the row's
 * data-midi or --step disagree, the console says so.
 */
import { SHAPE_MAP } from './synesthesia-map.js';
import { midiOf, noteOf, hzOf, stepOf } from './notes.js';

export function checkScore() {
  for (const row of document.querySelectorAll('.key__row[data-shape]')) {
    const shape = row.dataset.shape;
    const first = SHAPE_MAP[shape].onOpen.intervals[0];
    const notes = [...new Set([...document.querySelectorAll(`[data-shape="${shape}"][data-freq]`)]
      .map((el) => midiOf(Number(el.dataset.freq) * first)))].sort((a, b) => a - b);
    const median = notes[(notes.length - 1) >> 1];
    const step = Number(row.style.getPropertyValue('--step'));
    if (median !== Number(row.dataset.midi) || stepOf(median) !== step) {
      console.warn(`[partitura] ${shape}: suena ${noteOf(hzOf(median))} (paso ${stepOf(median)}), ` +
        `escrita ${noteOf(hzOf(Number(row.dataset.midi)))} (paso ${step})`);
    }
  }
}
