/**
 * LESSON — the live specimens of a plate.
 *
 * · Disclosure: a <button aria-expanded aria-controls> that shows or hides
 *   the branch it controls. Its label never changes: the state lives in
 *   aria-expanded alone.
 * · Mixed checkbox: a parent that is checked, unchecked or "mixed" (some
 *   of its group). Pressing it checks or clears the whole group.
 * · Slider: a native range whose raw number becomes words with
 *   aria-valuetext ("21 grados" instead of "21").
 */
export function initLesson({ refresh, rebuild, play }) {
  // Disclosure: the button grows the branch it controls
  document.querySelectorAll('button[aria-expanded][aria-controls][data-disclosure]').forEach((btn) => {
    const branch = document.getElementById(btn.getAttribute('aria-controls'));
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      if (branch) branch.hidden = !open;
      rebuild?.();                          // its branch enters or leaves the tree
      play?.(btn, open);
      // no live announcement: assistive technology already reports the
      // aria-expanded change on the focused button; saying it twice is noise
      refresh(btn);
    });
  });

  // Mixed checkbox: the parent tells the state of its whole group
  document.querySelectorAll('[data-mixed-parent]').forEach((parent) => {
    const group = parent.closest('[data-mixed-group]');
    const children = [...group.querySelectorAll('[data-mixed-child]')];
    const sync = () => {
      const on = children.filter((c) => c.checked).length;
      parent.checked = on === children.length;
      parent.indeterminate = on > 0 && on < children.length;
      refresh(parent);
    };
    let bulk = false;                       // while the parent sets its group, children do not re-sync it
    parent.addEventListener('change', () => {
      const target = parent.checked;        // read BEFORE any child changes: a sync would rewrite it
      bulk = true;
      children.forEach((c) => {
        if (c.checked !== target) {
          c.checked = target;
          c.dispatchEvent(new Event('change', { bubbles: true }));   // each child applies its own effect
        }
      });
      bulk = false;
      sync();
    });
    children.forEach((c) => c.addEventListener('change', () => { if (!bulk) sync(); }));
    sync();
  });

  // Slider: the number, in words
  document.querySelectorAll('input[type="range"][data-valuetext]').forEach((range) => {
    const out = document.getElementById(range.dataset.output);
    const paint = () => {
      const text = range.dataset.valuetext.replace('{v}', range.value);
      range.setAttribute('aria-valuetext', text);
      if (out) out.textContent = text;
      refresh(range);
    };
    range.addEventListener('input', paint);
    paint();
  });
}
