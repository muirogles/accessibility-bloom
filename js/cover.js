/**
 * COVER — the four chapters and the flower's opening.
 * Chapters are an APG accordion: a button inside each heading, opened
 * with Enter, Space or a click (never by focus alone). One chapter open
 * at a time; Escape closes it and returns focus to its button. Each
 * button sounds as the circle it is (opening chord up, closing note
 * down), through the work's own engine, mute and captions included.
 * "Animaciones" lets the flower open once, cold voices first and yellow
 * last; with sound on, each voice sounds as its plane opens. The delay
 * comes from the stylesheet (--voice-delay), so picture and sound share
 * one clock; under reduced motion nothing moves and the voices still
 * sound, in the same order.
 */
export function initCover({ play, announce, refresh }) {
  const chapters = [...document.querySelectorAll('.chapter')];
  if (!chapters.length) return { performFlower() {} };
  const toggleOf = (chapter) => chapter.querySelector('.chapter__toggle');
  const nameOf = (chapter) => chapter.querySelector('.chapter__label').textContent.trim();

  const setOpen = (chapter, open) => {
    const button = toggleOf(chapter);
    button.setAttribute('aria-expanded', String(open));
    document.getElementById(button.getAttribute('aria-controls')).hidden = !open;
    refresh(button);
  };

  const revealLowerMenu = (chapter) => {
    if (!chapter.matches('.chapter--3, .chapter--4') || window.matchMedia('(min-width: 64rem)').matches) return;
    window.requestAnimationFrame(() => {
      if (toggleOf(chapter).getAttribute('aria-expanded') !== 'true') return;
      const lastStation = chapter.querySelector('.chapter__station--3 .fruit');
      const dock = document.querySelector('.open-controls');
      if (!lastStation || !dock) return;
      const clearance = parseFloat(getComputedStyle(document.documentElement).fontSize);
      const distance = lastStation.getBoundingClientRect().bottom
        - dock.getBoundingClientRect().top
        + clearance;
      if (distance <= 0) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.scrollBy(0, distance);
      } else {
        window.scrollBy({ top: distance, behavior: 'smooth' });
      }
    });
  };

  chapters.forEach((chapter) => {
    const button = toggleOf(chapter);
    button.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') !== 'true';
      chapters.forEach((other) => { if (other !== chapter) setOpen(other, false); });
      setOpen(chapter, open);
      if (open) revealLowerMenu(chapter);
      play(button, open);
      announce(`${nameOf(chapter)}: ${open ? 'estaciones a la vista' : 'cerrado'}`);
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    chapters.forEach((chapter) => {
      const button = toggleOf(chapter);
      if (button.getAttribute('aria-expanded') !== 'true') return;
      const hadFocus = chapter.contains(document.activeElement);
      setOpen(chapter, false);
      if (hadFocus) button.focus();
    });
  });

  const seconds = (value) => {
    const n = parseFloat(value) || 0;
    return value.trim().endsWith('ms') ? n / 1000 : n;
  };

  // One shot, never a loop, only after the person presses the switch
  const performFlower = () => {
    document.querySelectorAll('.rose__plane[data-shape]').forEach((plane) => {
      const delay = seconds(getComputedStyle(plane).getPropertyValue('--voice-delay'));
      window.setTimeout(() => play(plane, true), delay * 1000);
    });
  };

  return { performFlower };
}
