/**
 * STATIONS — the specimens that are not flowers. Every one is real and
 * tells the truth about this very page:
 *   · The route (3) is read from the tree on load with the inspector's own
 *     roleOf/nameOf: the landmarks in DOM order, one petal per station
 *     inside main, how many headings each level holds, and what a
 *     screen reader says before reading the list ("lista, N elementos").
 *   · The focus order (7): four real buttons in DOM order. «Mover con CSS»
 *     reorders them with the CSS `order` property only: the numbers
 *     (the DOM) stay, so Tab visibly jumps. Nothing else can fail.
 *   · The layer (9) is a native <dialog> opened with showModal(): the
 *     rest of the page turns inert, Escape closes it and focus returns
 *     to the button that opened it. No script traps focus.
 *   · «Mirar como» (11) recolours the whole work: data-vision on the
 *     root swaps the primitive colours for the precomputed dichromacy
 *     palettes (tools/cvd-palette.mjs); «Sin color» is the greyscale.
 */
import { roleOf, nameOf, isRendered } from './tree-ax.js';

const LANDMARKS = new Set(['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form']);
export const VISION = {
  typical: 'Visión típica: la obra con sus colores.',
  protanopia: 'Protanopia: sin conos del rojo. El rojo se apaga; la forma sigue.',
  deuteranopia: 'Deuteranopia: sin conos del verde. Rojo y verde se confunden; la forma sigue.',
  tritanopia: 'Tritanopia: sin conos del azul. Azul y amarillo cambian; la forma sigue.',
  greyscale: 'Sin color: solo quedan la luz, la forma, el texto y el sonido.',
};

const el = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
};

function buildAtlas() {
  const regions = document.querySelector('[data-atlas-regions]');
  const levels = document.querySelector('[data-atlas-levels]');
  if (!regions || !levels) return;

  const marks = [...document.querySelectorAll('header, nav, main, aside, footer, form, search, [role]')]
    .filter((node) => LANDMARKS.has(roleOf(node)) && isRendered(node));
  for (const node of marks) {
    const role = roleOf(node);
    const [name] = nameOf(node, role);
    const nested = marks.some((outer) => outer !== node && outer.contains(node));
    const item = el('li', `atlas__region atlas__region--${role}${nested ? ' atlas__region--nested' : ''}`);
    item.append(el('span', 'atlas__role', role), el('span', 'atlas__name', name ? `«${name}»` : ''));
    if (role === 'main') {
      const stations = [...node.querySelectorAll(':scope > section[id]')].filter((s) => roleOf(s) === 'region');
      item.querySelector('.atlas__name').textContent = `${stations.length} regiones dentro, una por estación`;
      const petals = el('span', 'atlas__petals');
      petals.setAttribute('aria-hidden', 'true');
      stations.forEach((s) => petals.append(el('span', `atlas__petal tone--${s.id}`)));
      item.append(petals);
    }
    regions.append(item);
  }
  // A list says its size before its first item: write it for the room
  const say = document.querySelector('[data-atlas-say]');
  if (say) say.textContent = `«Regiones, lista, ${regions.children.length} elementos»`;

  for (const level of [1, 2, 3]) {
    const count = [...document.querySelectorAll(`h${level}`)].filter(isRendered).length;
    const item = el('li', `atlas__level atlas__level--${level}`);
    const bar = el('span', 'atlas__bar');
    bar.setAttribute('aria-hidden', 'true');
    item.append(el('span', 'atlas__count', `h${level} · ${count}`), bar);
    levels.append(item);
  }
}

function wireFocusOrder({ announce, refresh }) {
  const order = document.querySelector('[data-focus-order]');
  if (!order) return;
  const stops = [...order.querySelectorAll('[data-focus-order-stop]')];
  stops.forEach((stop, i) => stop.addEventListener('click', () => {
    announce(`${stop.textContent}: parada ${i + 1} de ${stops.length} en el HTML.`);
  }));
  const shuffle = order.querySelector('[data-focus-order-shuffle]');
  shuffle.addEventListener('click', () => {
    const on = shuffle.getAttribute('aria-pressed') !== 'true';
    shuffle.setAttribute('aria-pressed', String(on));
    order.toggleAttribute('data-shuffled', on);
    announce(on ? 'El CSS ha movido las paradas: el foco sigue el orden del HTML.' : 'Las paradas vuelven al orden del HTML.');
    refresh(shuffle);
  });
}

function wireLayer({ play }) {
  const open = document.querySelector('[data-layer-open]');
  const layer = document.querySelector('[data-layer]');
  if (!open || !layer || typeof layer.showModal !== 'function') return;
  // the deepest voice of the work (Sol3) opens what lies underneath
  open.addEventListener('click', () => { layer.showModal(); play(open, true); });
}

function wireVision({ announce, refresh }) {
  const group = document.querySelector('[data-vision]');
  if (!group) return;
  const root = document.documentElement;
  // A test, not a setting: every visit starts with typical vision, even
  // when the browser restores the checked radio after a reload
  group.querySelector('[value="typical"]').checked = true;
  delete root.dataset.vision;
  root.dataset.greyscale = 'off';
  group.addEventListener('change', (event) => {
    const value = event.target.value;
    if (!VISION[value]) return;
    root.dataset.greyscale = value === 'greyscale' ? 'on' : 'off';
    if (value === 'typical' || value === 'greyscale') delete root.dataset.vision;
    else root.dataset.vision = value;
    announce(VISION[value]);
    refresh(event.target);
  });
}

export function initStations({ announce = () => {}, play = () => {}, refresh = () => {} } = {}) {
  buildAtlas();
  wireFocusOrder({ announce, refresh });
  wireLayer({ play });
  wireVision({ announce, refresh });
}
