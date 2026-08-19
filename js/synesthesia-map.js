/**
 * SHAPE_MAP DE SINESTESIA — una forma, un color, un timbre.
 * Sonidos one-shot con desvanecimiento; nunca en bucle.
 */
export const SHAPE_MAP = {
  circulo:     { labelEl: 'button',   color: 'azul',     kind: 'sine',     onOpen: { intervals: [1, 5 / 4, 3 / 2], step: 0.09, gain: 0.09, decay: 0.9 }, onClose: { intervals: [3 / 4], step: 0.09, gain: 0.06, decay: 0.7 } },
  triangulo:   { labelEl: 'a',        color: 'amarillo', kind: 'triangle', onOpen: { intervals: [1, 3 / 2], step: 0.07, gain: 0.075, decay: 0.55 } },
  cuadrado:    { labelEl: 'checkbox', color: 'rojo',     kind: 'square',   onOpen: { intervals: [1, 2], step: 0.08, gain: 0.05, decay: 0.6 }, onClose: { intervals: [1 / 2], step: 0.08, gain: 0.04, decay: 0.5 } },
  rombo:       { labelEl: 'radio',    color: 'violeta',  kind: 'sine',     onOpen: { intervals: [2, 5 / 2], step: 0.06, gain: 0.06, decay: 0.45 } },
  barra:       { labelEl: 'input text', color: 'cian',   kind: 'sawtooth', onOpen: { intervals: [1, 3 / 2], step: 0.07, gain: 0.045, decay: 0.5 }, onClose: { intervals: [3 / 4], step: 0.07, gain: 0.035, decay: 0.4 } }

};
