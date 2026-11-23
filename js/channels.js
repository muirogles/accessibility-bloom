/**
 * CHANNELS — station 2, "Quita un canal".
 * Kandinsky saw sounds and heard colours; accessibility is that
 * synesthesia built on purpose: one meaning travels through several
 * channels and none is indispensable. Five aria-pressed switches turn
 * off, one by one, a way of perceiving the Do4 button:
 *   colour  → the flower keeps its lightness, loses its hue  (1.4.1)
 *   shape   → the flower blurs into a colour field            (1.3.3)
 *   sound   → it stays silent and its sound is written        (1.1.1)
 *   text    → its visible name hides; the tree keeps it       (4.1.2)
 *   pixels  → nothing is drawn; its node remains              (1.3.1)
 * The button keeps working in every combination. What a machine reads
 * (screen reader, voice control, an AI agent) is computed live with the
 * inspector's own functions, so it can never disagree with the tree.
 * Only presentation changes: the button's role, name and state never do.
 */
import { roleOf, nameOf } from './tree-ax.js';

const CHANNELS = {
  color: { name: 'color', off: 'Color apagado: la forma y el texto siguen diciendo qué es.' },
  shape: { name: 'forma', off: 'Forma apagada: el color y el texto lo siguen diciendo.' },
  sound: { name: 'sonido', off: 'Sonido apagado: cada sonido se escribe.' },
  text: { name: 'texto', off: 'Texto apagado: el nombre ya no se ve, pero sigue en el árbol.' },
  pixels: { name: 'píxeles', off: 'Píxeles apagados: no se dibuja nada y el nodo sigue ahí.' },
};

// "color, forma y sonido" · "color, forma ni sonido"
const joinEs = (list, and = 'y') => (list.length < 2 ? list.join('') : `${list.slice(0, -1).join(', ')} ${and} ${list.at(-1)}`);

export function initChannels({ announce = () => {}, refresh = () => {} } = {}) {
  const root = document.querySelector('[data-channels]');
  const flowerCard = document.querySelector('[data-channels-flower]');
  if (!root || !flowerCard) return { silenced: () => false, write: () => {} };
  const flower = flowerCard.querySelector('button.flower');
  const switches = [...root.querySelectorAll('[data-channel]')];
  const remains = root.querySelector('[data-channels-remains]');
  const captionEl = root.querySelector('[data-channels-caption]');
  const json = root.querySelector('[data-machine-json]');
  // The state lives on the whole station: flower and switches are siblings
  const stage = root.closest('section') || root;
  const mark = (key, value) => stage.setAttribute(`data-ch-${key}`, value);
  const voice = root.querySelector('[data-machine-voice]');

  const off = () => switches.filter((b) => b.getAttribute('aria-pressed') === 'false').map((b) => b.dataset.channel);

  // What a machine reads: the same computation as the inspector
  const paintMachine = () => {
    const role = roleOf(flower);
    const [name] = nameOf(flower, role);
    const pressed = flower.getAttribute('aria-pressed') === 'true';
    json.textContent = `{ "role": "${role}", "name": "${name}", "pressed": ${pressed} }`;
    voice.textContent = `${name}, botón de alternar, ${pressed ? 'pulsado' : 'no pulsado'}`;
    return { name, pressed };
  };

  const paintRemains = () => {
    const { name, pressed } = paintMachine();
    const gone = off();
    const kept = Object.keys(CHANNELS).filter((c) => !gone.includes(c)).map((c) => CHANNELS[c].name);
    const what = `es un botón, se llama ${name} y ${pressed ? 'está pulsado' : 'no está pulsado'}`;
    if (!gone.length) remains.textContent = `Los cinco canales cuentan lo mismo: ${what}.`;
    else if (!kept.length) remains.textContent = `Sin ningún canal que ver ni oír, el botón sigue entero en el árbol: ${what}. Lo leen el lector de pantalla, la voz y la IA.`;
    else remains.textContent = `Sin ${joinEs(gone.map((c) => CHANNELS[c].name), 'ni')}, lo siguen contando ${joinEs(kept)}. Y el árbol, siempre: ${what}.`;
    mark('all', gone.length === switches.length ? 'off' : 'on');
  };

  switches.forEach((btn) => {
    btn.addEventListener('click', () => {
      const isOn = btn.getAttribute('aria-pressed') !== 'true';
      const channel = btn.dataset.channel;
      btn.setAttribute('aria-pressed', String(isOn));
      mark(channel, isOn ? 'on' : 'off');
      if (channel === 'sound') {
        captionEl.textContent = isOn ? '♪ Con el sonido encendido, se oye. Apágalo y se escribe.'
          : '♪ Sin sonido. Pulsa Do4: lo que suena aparece aquí escrito.';
      }
      paintRemains();
      announce(isOn ? `${CHANNELS[channel].name.charAt(0).toUpperCase() + CHANNELS[channel].name.slice(1)} encendido.` : CHANNELS[channel].off);
      refresh(btn);
    });
  });

  // The flower's state changes from main.js: follow it
  new MutationObserver(paintRemains).observe(flower, { attributes: true, attributeFilter: ['aria-pressed'] });
  switches.forEach((b) => mark(b.dataset.channel, 'on'));
  paintRemains();

  return {
    // A flower inside the plate with its sound channel off stays silent…
    silenced: (el) => stage.getAttribute('data-ch-sound') === 'off' && flowerCard.contains(el),
    // …and its sound is written instead (the same words as the captions)
    write: (text) => { captionEl.textContent = text; },
  };
}
