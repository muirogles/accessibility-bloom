/**
 * MAIN — cablea el árbol: cada flor es una etiqueta real.
 * Sonido one-shot por interacción; cartela y panel en vivo.
 */
import { SHAPE_MAP } from './synesthesia-map.js';
import * as synesthesia from './synesthesia.js';
import { initPanel } from './tree-ax.js';
import { initSprouts } from './sprouts.js';

const panel = initPanel({ root: document.body });
initSprouts();

const playFlower = (el, isOpen) => {
  const voice = SHAPE_MAP[el.dataset.shape];
  if (!voice) return;
  const gesture = isOpen === false && voice.onClose ? voice.onClose : voice.onOpen;
  synesthesia.play(Number(el.dataset.freq), { kind: voice.kind, ...gesture });
};

const paintCaption = (root, text) => {
  const captionEl = root.closest('.flower-card')?.querySelector('[data-state]');
  if (captionEl) captionEl.textContent = text;
};

// --- Región aria-live: anuncia la floración sin mover el foco ---
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

// --- Silencio (persistente) ---
const btnSound = document.getElementById('btn-sound');
const paintSound = () => {
  const isMuted = synesthesia.muted();
  btnSound.setAttribute('aria-pressed', isMuted ? 'true' : 'false');
  btnSound.textContent = isMuted ? 'Activar sonido' : 'Silenciar sonido';
};
synesthesia.init();
paintSound();
btnSound.addEventListener('click', () => {
  synesthesia.toggleMute();
  paintSound();
  announce(synesthesia.muted() ? 'Sonido silenciado' : 'Sonido activado');
  panel.refresh(btnSound);
});

// --- El latido del rosetón: se puede pausar a mano; si el sistema pide
//     menos movimiento, ya nace pausado ---
const btnHeartbeat = document.getElementById('btn-heartbeat');
const mqReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let heartbeat = !mqReducedMotion.matches;
const paintHeartbeat = () => {
  document.documentElement.dataset.heartbeat = heartbeat ? 'on' : 'off';
  btnHeartbeat.setAttribute('aria-pressed', heartbeat ? 'false' : 'true');
  btnHeartbeat.textContent = heartbeat ? 'Pausar latido' : 'Reanudar latido';
};
paintHeartbeat();
btnHeartbeat.addEventListener('click', () => {
  heartbeat = !heartbeat;
  paintHeartbeat();
  announce(heartbeat ? 'Latido de los pétalos reanudado' : 'Latido de los pétalos en pausa');
  panel.refresh(btnHeartbeat);
});

// --- Flor círculo: <button aria-pressed> ---
document.querySelectorAll('button.flower--circle').forEach((btn) => {
  btn.addEventListener('click', () => {
    const isOn = btn.getAttribute('aria-pressed') !== 'true';
    btn.setAttribute('aria-pressed', String(isOn));
    paintCaption(btn, `pressed=${isOn}`);
    playFlower(btn, isOn);
    announce(`${flowerName(btn)} ${isOn ? 'florece' : 'se cierra'}`);
    panel.refresh(btn);
  });
});

// --- Flor triángulo: <a> que transporta. El puntero y el foco solo
//     ENTREABREN (CSS); la floración plena es de la activación, y en un
//     enlace dura el gesture porque un enlace no guarda estado ---
const bloom = (el) => {
  el.classList.add('blooming');
  clearTimeout(el._tBloom);
  el._tBloom = setTimeout(() => el.classList.remove('blooming'), 900);
};
document.querySelectorAll('a[data-shape]').forEach((enlace) => {
  enlace.addEventListener('click', () => {
    playFlower(enlace, true);
    bloom(enlace);
  });
});

// --- La corona sabe dónde estás: aria-current="location" en el enlace
//     de la sección visible. Nunca solo por color: el triángulo crece y
//     el subrayado engorda ---
const navLinks = [...document.querySelectorAll('.crown a[href^="#"]')];
const markNav = (id) => navLinks.forEach((a) => {
  if (a.getAttribute('href') === '#' + id) a.setAttribute('aria-current', 'location');
  else a.removeAttribute('aria-current');
});
const watcher = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) markNav(e.target.id); });
}, { rootMargin: '-45% 0px -45% 0px' });
navLinks.forEach((a) => {
  const destino = document.querySelector(a.getAttribute('href'));
  if (destino) watcher.observe(destino);
});

// --- El riego: un campo real con label visible, ayuda permanente,
//     aria-invalid solo mientras el error existe y el mensaje atado al
//     campo con aria-describedby. Se anuncia sin robar el foco... salvo
//     al enviar, donde devolverlo al campo SÍ es lo correcto ---
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
  wateringForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = field.value.trim();
    if (!value) return fail('Error: falta el correo de contacto. Escribe una dirección con la forma nombre@dominio.com.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) return fail('Error: el correo no tiene la forma nombre@dominio.com. Revisa la arroba y el punto.');
    clearError();
    okBox.hidden = false;
    announce('Regado: el correo tiene una forma válida.');
    playFlower(field, true);
  });
}

// --- El árbol, para las máquinas: el mismo dato del inspector, en JSON ---
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

// --- Flores cuadrado y rombo: checkbox y radios ---
document.querySelectorAll('input[type="checkbox"].flower__control, input[type="radio"].flower__control').forEach((control) => {
  control.addEventListener('change', () => {
    const flower = control.closest('.flower');
    if (control.type === 'checkbox') paintCaption(flower, `checked=${control.checked}`);
    playFlower(flower, control.checked);
    announce(`${flowerName(control)} ${control.checked ? 'florece' : 'se cierra'}`);
    panel.refresh(control);
    if (control.type === 'radio') {
      document.querySelectorAll(`input[name="${control.name}"]`).forEach((r) => panel.refresh(r));
    }
  });
});

// --- El inspector: dialog modal en móvil, columna fija en escritorio ---
const dlgPanel = document.querySelector('.panel-box');
const mqDesktop = window.matchMedia('(min-width: 64rem)');
document.querySelector('[data-open-panel]')?.addEventListener('click', () => dlgPanel.showModal());
document.querySelector('[data-close-panel]')?.addEventListener('click', () => dlgPanel.close());
mqDesktop.addEventListener('change', () => { if (mqDesktop.matches && dlgPanel.open) dlgPanel.close(); });
// Los enlaces al inspector lo abren como dialog cuando no está visible
document.querySelectorAll('[data-skip-inspector]').forEach((enlace) => {
  enlace.addEventListener('click', (e) => {
    if (!mqDesktop.matches) { e.preventDefault(); dlgPanel.showModal(); }
  });
});

// --- El inspector sigue el foco ---
document.addEventListener('focusin', (e) => panel.follow(e.target));
