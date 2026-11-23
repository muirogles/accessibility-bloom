/**
 * SYNESTHESIA SHAPE_MAP — one shape, one colour, one timbre.
 * One-shot sounds with a fade-out; never looping.
 */
// `timbre` is the name station 2's score gives each voice: the
// captions say the same, in the same words.
// Every gesture that opens starts on its root (interval 1): the note a
// flower declares is the note it sounds, and the score writes that
// note. The rhombus is "agudo" because its flowers sit high (Si4–Mi5),
// not because it jumps an octave.
export const SHAPE_MAP = {
  circle:      { labelEl: 'button',   color: 'azul',     kind: 'sine',     timbre: 'seno',     onOpen: { intervals: [1, 5 / 4, 3 / 2], step: 0.09, gain: 0.09, decay: 0.9 }, onClose: { intervals: [3 / 4], step: 0.09, gain: 0.06, decay: 0.7 } },
  triangle:    { labelEl: 'a',        color: 'amarillo', kind: 'triangle', timbre: 'onda triangular', onOpen: { intervals: [1, 3 / 2], step: 0.07, gain: 0.075, decay: 0.55 } },
  square:      { labelEl: 'checkbox', color: 'rojo',     kind: 'square',   timbre: 'onda cuadrada', onOpen: { intervals: [1, 2], step: 0.08, gain: 0.05, decay: 0.6 }, onClose: { intervals: [1 / 2], step: 0.08, gain: 0.04, decay: 0.5 } },
  rhombus:     { labelEl: 'radio',    color: 'violeta',  kind: 'sine',     timbre: 'seno agudo', onOpen: { intervals: [1, 5 / 4], step: 0.06, gain: 0.06, decay: 0.45 } },
  bar:         { labelEl: 'input text', color: 'cian',   kind: 'sawtooth', timbre: 'onda de sierra', onOpen: { intervals: [1, 3 / 2], step: 0.07, gain: 0.045, decay: 0.5 }, onClose: { intervals: [3 / 4], step: 0.07, gain: 0.035, decay: 0.4 } }

};
