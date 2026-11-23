/**
 * MAIN — wires the tree: every flower is a real element.
 * One-shot sound per interaction; live cartela and panel.
 */
import { SHAPE_MAP } from './synesthesia-map.js';
import * as synesthesia from './synesthesia.js';
import { tempered, noteOf } from './notes.js';
import { initPanel } from './tree-ax.js';
import { initXray } from './xray.js';
import { initChannels } from './channels.js';
import { initLesson } from './lesson.js';
import { initCover } from './cover.js';
import { initStations } from './stations.js';
import { initAgent } from './agent.js';

const panel = initPanel({ root: document.body });

// --- Captions: the written version of every sound that really plays.
//     Only while the "Subtítulos" checkbox is checked; when sound is
//     muted there is nothing to caption ---
const captionsEl = document.querySelector('[data-captions]');
let captionsOn = false;
// States the note that REALLY plays (the gesture's first note, on the
// tempered root), not the flower's nominal one: closing goes down.
const captionText = (voice, gesture, base, closing) => {
  const timbre = voice.timbre.charAt(0).toUpperCase() + voice.timbre.slice(1);
  const hz = tempered(base) * gesture.intervals[0];
  const shape = closing ? 'nota grave de cierre'
    : gesture.intervals.length > 1 ? 'acorde que sube' : 'una nota';
  return `♪ ${timbre}, ${shape} · ${gesture.intervals.length > 1 ? 'desde ' : ''}${noteOf(hz)}, ${Math.round(hz)} Hz`;
};
const caption = (voice, gesture, base, closing) => {
  if (!captionsOn || !captionsEl || synesthesia.muted() || !base) return;
  captionsEl.textContent = captionText(voice, gesture, base, closing);
  captionsEl.hidden = false;
};

// Station 2's plate can switch a flower's sound channel off: then it
// stays silent and its sound is written in the plate (initialised below)
let channels = { silenced: () => false, write: () => {} };

const playFlower = (el, isOpen) => {
  const voice = SHAPE_MAP[el.dataset.shape];
  if (!voice) return;
  const closing = isOpen === false && Boolean(voice.onClose);
  const gesture = closing ? voice.onClose : voice.onOpen;
  const base = Number(el.dataset.freq);
  if (channels.silenced(el)) { channels.write(captionText(voice, gesture, base, closing)); return; }
  synesthesia.play(base, { kind: voice.kind, ...gesture });
  caption(voice, gesture, base, closing);
};

// The cartela is the node's chip: when its state changes it flashes once,
// in the same instant its node flashes in the inspector
const paintCaption = (root, text) => {
  const captionEl = root.closest('.flower-card')?.querySelector('[data-state]');
  if (!captionEl || captionEl.textContent === text) return;
  captionEl.textContent = text;
  captionEl.classList.remove('is-changed');
  void captionEl.offsetWidth;
  captionEl.classList.add('is-changed');
};

// --- aria-live region: announces the bloom without moving focus ---
const liveRegion = document.querySelector('[data-announce]');
let tAnnounce = 0;
const announce = (text) => {
  if (!liveRegion) return;
  clearTimeout(tAnnounce);
  liveRegion.textContent = '';
  tAnnounce = setTimeout(() => { liveRegion.textContent = text; }, 80);
};
const flowerName = (el) => el.closest('.flower')?.querySelector('.flower__name')?.textContent
  || el.querySelector?.('.flower__name')?.textContent || el.textContent.trim();

// --- The cover: chapters and the flower's opening ---
const cover = initCover({ play: (el, isOpen) => playFlower(el, isOpen), announce, refresh: (el) => panel.refresh(el) });
initStations({ announce, play: (el, isOpen) => playFlower(el, isOpen), refresh: (el) => panel.refresh(el) });
initAgent({ announce });

// --- Two switches, both off on arrival. Their names never change:
//     aria-pressed carries the state (APG Button), as the state plate
//     teaches. Both remember the person's choice. ---
const btnSound = document.getElementById('btn-sound');
const paintSound = () => btnSound.setAttribute('aria-pressed', String(!synesthesia.muted()));
synesthesia.init();
paintSound();
btnSound.addEventListener('click', () => {
  synesthesia.toggleMute();
  paintSound();
  panel.refresh(btnSound);
});

// "Animaciones" asks for motion; the system's reduced-motion setting
// still wins in the stylesheet. Turning it on lets the flower open once;
// a remembered "on" opens it in silence on arrival (no gesture, no sound).
const MOTION_KEY = 'bloom-v5-motion';
const btnMotion = document.getElementById('btn-motion');
const setMotion = (on) => {
  btnMotion.setAttribute('aria-pressed', String(on));
  document.documentElement.dataset.motion = on ? 'on' : 'off';
};
try { setMotion(localStorage.getItem(MOTION_KEY) === 'on'); } catch (e) { setMotion(false); }
btnMotion.addEventListener('click', () => {
  const on = btnMotion.getAttribute('aria-pressed') !== 'true';
  setMotion(on);
  try { localStorage.setItem(MOTION_KEY, on ? 'on' : 'off'); } catch (e) { /* no storage */ }
  panel.refresh(btnMotion);
  if (on) cover.performFlower();
});

// --- Circle flower: <button aria-pressed> ---
// A toggle may change the whole work (data-setting); none does today:
// «Mirar como» (Perception) is a radio group, wired in stations.js.
const viewEffect = {};
// (only toggles: a disclosure is a button too, but its state is
// aria-expanded and lesson.js wires it)
document.querySelectorAll('button.flower--circle[aria-pressed]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const isOn = btn.getAttribute('aria-pressed') !== 'true';
    btn.setAttribute('aria-pressed', String(isOn));
    paintCaption(btn, `pressed=${isOn}`);
    playFlower(btn, isOn);
    const effect = viewEffect[btn.dataset.setting]?.(isOn);
    announce(`${flowerName(btn)} ${isOn ? 'florece' : 'se cierra'}${effect ? ' ' + effect : ''}`);
    panel.refresh(btn);
  });
});

// --- Triangle flower: an <a> that takes you somewhere. Pointer and
//     focus only HALF-OPEN it (CSS); full bloom belongs to activation,
//     and on a link it lasts the gesture, because a link keeps no state ---
const bloom = (el) => {
  el.classList.add('blooming');
  clearTimeout(el._tBloom);
  el._tBloom = setTimeout(() => el.classList.remove('blooming'), 900);
};
document.querySelectorAll('a[data-shape]').forEach((anchor) => {
  anchor.addEventListener('click', () => {
    playFlower(anchor, true);
    bloom(anchor);
  });
});

// --- The walk knows where you are: aria-current="location" on the
//     visible section's link. Never by colour alone: the triangle grows
//     and the underline thickens ---
const navLinks = [...document.querySelectorAll('.chapters a[href^="#"]')];
const markNav = (id) => navLinks.forEach((a) => {
  if (a.getAttribute('href') === '#' + id) a.setAttribute('aria-current', 'location');
  else a.removeAttribute('aria-current');
});
const watcher = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) markNav(e.target.id); });
}, { rootMargin: '-45% 0% -45% 0%' });
navLinks.forEach((a) => {
  const target = document.querySelector(a.getAttribute('href'));
  if (target) watcher.observe(target);
});

// --- The watering: a real field with a visible label, permanent help,
//     aria-invalid only while the error exists and the message tied to
//     the field with aria-describedby. Announced without stealing focus…
//     except on submit, where returning focus to the field IS right ---
const wateringForm = document.querySelector('[data-watering]');
if (wateringForm) {
  const field = wateringForm.querySelector('#watering-email');
  const errorBox = wateringForm.querySelector('[data-error]');
  const errorText = wateringForm.querySelector('[data-error-text]');
  const okBox = wateringForm.querySelector('[data-ok]');
  const clearError = () => {
    errorBox.hidden = true;
    field.removeAttribute('aria-invalid');
    field.setAttribute('aria-describedby', 'watering-help');
    panel.refresh(field);
  };
  const fail = (text) => {
    okBox.hidden = true;
    errorText.textContent = text;
    errorBox.hidden = false;
    field.setAttribute('aria-invalid', 'true');
    field.setAttribute('aria-describedby', 'watering-help watering-error');
    announce(text);
    field.focus();
    panel.refresh(field);
  };
  field.addEventListener('input', () => { if (field.hasAttribute('aria-invalid')) clearError(); });
  // An AI agent can fill and submit this form as the WebMCP tool
  // "water_garden" (index.html): it gets back the very sentence a person
  // reads and hears (SubmitEvent.agentInvoked / respondWith).
  wateringForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const reply = (text) => { if (e.agentInvoked) e.respondWith(Promise.resolve(text)); };
    const value = field.value.trim();
    if (!value) {
      const text = 'Error: falta el correo de contacto. Escribe una dirección con la forma nombre@dominio.com.';
      fail(text); return reply(text);
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      const text = 'Error: el correo no tiene la forma nombre@dominio.com. Revisa la arroba y el punto.';
      fail(text); return reply(text);
    }
    clearError();
    okBox.hidden = false;
    announce('Regado: el correo tiene una forma válida.');
    playFlower(field, true);
    reply('Regado: el correo tiene una forma válida.');
  });
}

// --- The tree, for machines: the inspector's same data, as JSON ---
document.querySelector('[data-export-tree]')?.addEventListener('click', () => {
  const data = JSON.stringify(panel.exportTree(), null, 2);
  const url = URL.createObjectURL(new Blob([data], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'accessibility-bloom-tree.json';
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  announce('Árbol de accesibilidad descargado en formato JSON');
});

// --- Checkboxes that tell the truth: "Alto contraste" and "Subtítulos"
//     are not props. Their state changes the work, and "Alto contraste"
//     starts checked when the system already asks for more contrast ---
const mqContrast = window.matchMedia('(prefers-contrast: more)');
const applySetting = (control) => {
  if (control.dataset.setting === 'contrast') {
    if (control.checked) document.documentElement.dataset.contrast = 'more';
    else document.documentElement.dataset.contrast = 'standard';
  }
  if (control.dataset.setting === 'captions') {
    captionsOn = control.checked;
    if (!captionsOn && captionsEl) { captionsEl.hidden = true; captionsEl.textContent = ''; }
  }
};
const contrastBox = document.querySelector('[data-setting="contrast"]');
const syncContrast = () => {
  if (!contrastBox) return;
  contrastBox.checked = mqContrast.matches;
  applySetting(contrastBox);
  paintCaption(contrastBox.closest('.flower'), `checked=${contrastBox.checked}`);
  panel.refresh(contrastBox);
};
syncContrast();
mqContrast.addEventListener('change', syncContrast);
const settingEffect = {
  contrast: (on) => (on ? 'y la obra sube el contraste' : 'y la obra vuelve al contraste de siempre'),
  captions: (on) => (on ? 'y cada sonido se escribe en pantalla' : 'y los sonidos dejan de escribirse'),
};

// --- Square and rhombus flowers: checkbox and radios ---
document.querySelectorAll('input[type="checkbox"].flower__control, input[type="radio"].flower__control').forEach((control) => {
  control.addEventListener('change', () => {
    const flower = control.closest('.flower');
    if (control.dataset.setting) applySetting(control);
    if (control.type === 'checkbox') paintCaption(flower, `checked=${control.checked}`);
    playFlower(flower, control.checked);
    const effect = settingEffect[control.dataset.setting];
    announce(`${flowerName(control)} ${control.checked ? 'florece' : 'se cierra'}${effect ? ' ' + effect(control.checked) : ''}`);
    panel.refresh(control);
    if (control.type === 'radio') {
      document.querySelectorAll(`input[name="${control.name}"]`).forEach((r) => panel.refresh(r));
    }
  });
});

// --- The inspector: modal dialog on mobile, fixed column on desktop ---
const dlgPanel = document.querySelector('.panel-box');
const mqDesktop = window.matchMedia('(min-width: 64rem)');
let lastPanelOpener = null;

const openPanelModal = (trigger) => {
  lastPanelOpener = trigger || document.activeElement;
  dlgPanel?.showModal();
};

const closePanelModal = () => {
  dlgPanel?.close();
  if (lastPanelOpener && typeof lastPanelOpener.focus === 'function') {
    lastPanelOpener.focus();
  }
};

document.querySelector('[data-open-panel]')?.addEventListener('click', (e) => openPanelModal(e.currentTarget));
document.querySelector('[data-close-panel]')?.addEventListener('click', () => closePanelModal());
dlgPanel?.addEventListener('close', () => {
  if (lastPanelOpener && typeof lastPanelOpener.focus === 'function' && document.activeElement === document.body) {
    lastPanelOpener.focus();
  }
});
mqDesktop.addEventListener('change', () => { if (mqDesktop.matches && dlgPanel?.open) dlgPanel.close(); });
// Links to the inspector open it as a dialog when it is not visible
document.querySelectorAll('[data-skip-inspector]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    if (!mqDesktop.matches) { e.preventDefault(); openPanelModal(anchor); }
  });
});

// --- The inspector follows focus, and also its absence: when focus
//     falls back to <body> (an in-page link blurs itself on arrival, a
//     click on the canvas), it says so. After an in-page link it names
//     the target, where the browser's next Tab starts ---
let jumpTarget = null;
document.addEventListener('click', (e) => {
  const a = e.target.closest?.('a[href^="#"]');
  jumpTarget = a ? document.getElementById(decodeURIComponent(a.hash.slice(1))) : null;
});
document.addEventListener('focusin', (e) => panel.follow(e.target));
// A click on the work selects what was clicked (after focusin has told
// where focus really went): the inspector's element picker
document.addEventListener('click', (e) => panel.pick(e.target));
document.addEventListener('focusout', () => {
  // wait for the browser to settle the new focus before reading it
  requestAnimationFrame(() => {
    if (document.activeElement && document.activeElement !== document.body) return;
    panel.rest(jumpTarget);
    jumpTarget = null;
  });
});

// --- X-ray: the Accessibility Tree laid over the work, from the
//     inspector (always at hand while presenting) ---
initXray({
  button: document.querySelector('[data-xray-toggle]'),
  hosts: [...document.querySelectorAll('.cover, .artwork-side, .roots')],
  announce,
});

// --- Station 2: "Quita un canal" ---
channels = initChannels({ announce, refresh: (el) => panel.refresh(el) });

// --- The plates' live specimens and what the tree hands over ---
initLesson({ refresh: (el) => panel.refresh(el), rebuild: () => panel.rebuild(), play: playFlower });

// --- In development, the score checks itself against the flowers ---
if (import.meta.env.DEV) import('./score-check.js').then((m) => m.checkScore());
