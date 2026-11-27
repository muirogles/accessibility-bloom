/**
 * X-RAY — the Accessibility Tree laid over the work itself.
 * Station 1 draws two trees growing from one DOM: the pixels' one and
 * the meaning's one. The x-ray shows them one on top of the other:
 * what is seen (the pixels) is veiled, and every element with meaning
 * shows its node — role «name» state — in the colour of its shape in
 * the grammar.
 *
 * It reads role, name and state with the SAME functions as the
 * inspector (tree-ax.js), so both can never disagree. The chips are
 * aria-hidden: they duplicate, visually, what the inspector and the
 * real tree already expose to assistive technology. They take no
 * pointer events, so the work stays fully operable underneath.
 */
import { roleOf, nameOf, stateOf, isRendered } from './tree-ax.js';

// The roles worth showing: landmarks and regions (the structure),
// headings, groups and figures, and every interactive control.
const SHOWN = new Set([
  'banner', 'navigation', 'main', 'region', 'contentinfo', 'complementary',
  'heading', 'group', 'figure',
  'link', 'button', 'checkbox', 'radio', 'textbox', 'slider', 'combobox',
]);
// Structure roles get a frame; controls get a frame and a chip above it.
const STRUCTURE = new Set(['banner', 'navigation', 'main', 'region', 'contentinfo', 'complementary', 'group', 'figure']);
// Names are shortened so the state — the living part — always shows
const NAME_MAX = 24;
// The narrowest a chip may wrap to, in px (12 cartela characters)
const CHIP_MIN = 96;

// Pruned like the tree: hidden, decorative, the inspector itself, and
// whatever is not rendered (the content of a closed <details>)
const isPruned = (el) => !!el.closest('[aria-hidden="true"], [data-inspector], [hidden]') || !isRendered(el);

// A visually hidden native control (a checkbox inside its flower) is a
// 1 px box: the node is drawn on the label that wears it. Anything else
// in a 1 px box is hidden from sight but present in the tree (a heading
// only screen readers get): it is drawn on its parent and flagged.
function boxOf(el) {
  let r = el.getBoundingClientRect();
  const tiny = r.width <= 1 || r.height <= 1;
  if (tiny && (el.labels?.[0] || el.closest('label'))) {
    return { r: (el.labels?.[0] || el.closest('label')).getBoundingClientRect(), treeOnly: false };
  }
  if (tiny && el.parentElement) return { r: el.parentElement.getBoundingClientRect(), treeOnly: true };
  return { r, treeOnly: false };
}

// Chips are laid out in document order; one that meets an already
// placed chip moves down just enough. No two chips ever overlap.
function settle(layer) {
  const placed = [];
  for (const chip of layer.querySelectorAll('.xray__chip')) {
    const r = chip.getBoundingClientRect();
    let dy = 0;
    for (let k = 0; k < 24; k += 1) {
      const hit = placed.find((p) => r.left < p.right - 1 && p.left < r.right - 1 && r.top + dy < p.bottom - 1 && p.top < r.bottom + dy - 1);
      if (!hit) break;
      dy = hit.bottom - r.top;
    }
    if (dy) chip.style.translate = '0 ' + Math.ceil(dy) + 'px';
    placed.push({ left: r.left, right: r.right, top: r.top + dy, bottom: r.bottom + dy });
  }
}

function chipText(el, role) {
  let [name] = nameOf(el, role);
  name = (name || '').trim();
  if (name.length > NAME_MAX) name = name.slice(0, NAME_MAX - 1) + '…';
  const state = stateOf(el, role);
  return { role, name, state };
}

export function initXray({ button, buttons, hosts, announce }) {
  // One control in the inspector (desktop) and, on mobile, a twin
  // outside the modal dialog — otherwise the toggle is trapped inert
  // under showModal() and the overlay cannot be turned off while looking.
  const toggles = (buttons ?? (button ? [button] : [])).filter(Boolean);
  let on = false;
  let layers = [];
  let frame = 0;

  function clear() {
    layers.forEach((l) => l.remove());
    layers = [];
  }

  function draw() {
    frame = 0;
    clear();
    if (!on) return;
    for (const host of hosts) {
      const layer = document.createElement('div');
      layer.className = 'xray';
      layer.setAttribute('aria-hidden', 'true');
      const hr = host.getBoundingClientRect();
      for (const el of host.querySelectorAll('*')) {
        const role = roleOf(el);
        if (!role || !SHOWN.has(role) || isPruned(el)) continue;
        const { r, treeOnly } = boxOf(el);
        if (!r.width || !r.height) continue;
        const { name, state } = chipText(el, role);
        const node = document.createElement('div');
        node.className = 'xray__node xray__node--' + role + (STRUCTURE.has(role) ? ' xray__node--frame' : '') + (treeOnly ? ' xray__node--tree-only' : '');
        node.style.setProperty('--x', (r.left - hr.left - host.clientLeft) + 'px');
        node.style.setProperty('--y', (r.top - hr.top - host.clientTop) + 'px');
        node.style.setProperty('--w', r.width + 'px');
        node.style.setProperty('--h', r.height + 'px');
        // the room for its chip: its own frame (never less than a short
        // line, CHIP_MIN), and never past the right edge of the host, so
        // a chip wraps inside its node instead of covering a neighbour or
        // running off a phone screen
        const hostRoom = Math.max(0, hr.width - (r.left - hr.left));
        node.style.setProperty('--room', Math.min(hostRoom, Math.max(r.width, CHIP_MIN)) + 'px');
        const chip = document.createElement('span');
        chip.className = 'xray__chip';
        const roleEl = document.createElement('b');
        roleEl.className = 'xray__role';
        roleEl.textContent = role;
        chip.append(roleEl);
        if (name) chip.append(' «' + name + '»');
        if (state) {
          const st = document.createElement('span');
          st.className = 'xray__state';
          st.textContent = state;
          chip.append(' ', st);
        }
        if (treeOnly) {
          const only = document.createElement('span');
          only.className = 'xray__only';
          only.textContent = 'solo en el árbol';
          chip.append(' ', only);
        }
        node.append(chip);
        layer.append(node);
      }
      host.append(layer);
      layers.push(layer);
      settle(layer);
    }
  }

  // One redraw per frame at most, whatever triggered it
  const schedule = () => { if (on && !frame) frame = requestAnimationFrame(draw); };

  function set(next) {
    on = next;
    for (const b of toggles) b.setAttribute('aria-pressed', String(on));
    document.documentElement.dataset.xray = on ? 'on' : 'off';
    if (on) draw(); else clear();
  }

  for (const b of toggles) {
    b.addEventListener('click', () => {
      set(!on);
      announce(on
        ? 'Radiografía activada: cada elemento muestra sobre la obra su rol, su nombre y su estado'
        : 'Radiografía desactivada');
    });
  }

  // The x-ray tells the state NOW: it is redrawn when a state changes,
  // when the layout changes and when the fonts arrive.
  document.addEventListener('change', schedule);
  document.addEventListener('click', schedule);
  new MutationObserver(schedule).observe(document.body, {
    subtree: true, attributes: true,
    attributeFilter: ['aria-pressed', 'aria-expanded', 'aria-invalid', 'aria-current', 'hidden', 'open', 'class'],
  });
  const ro = new ResizeObserver(schedule);
  hosts.forEach((h) => ro.observe(h));
  document.fonts?.ready.then(schedule);

  set(false);
  return { redraw: schedule };
}
