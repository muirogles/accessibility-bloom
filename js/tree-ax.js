/**
 * AX TREE — a live inspector with the DevTools flow: an expandable
 * tree (everything expanded by default) + the node card. Rebuilt from
 * the real DOM. Excludes [data-inspector]: like DevTools, the inspector
 * does not inspect itself.
 */
const FOCUS_SELECTOR = 'a[href],button,summary,input,select,h1,h2,h3,li,header,nav,main,section,article,aside,footer,fieldset,figure';

/* Reads text the way the accname algorithm does: drops aria-hidden and
   hidden subtrees, and inserts a separator at every element boundary —
   so "1" + "La estructura…" do not stick together, and the title's
   decorative numeral never enters the name. */
function readText(el) {
  let out = '';
  for (const n of el.childNodes) {
    if (n.nodeType === 3) out += n.textContent;
    else if (n.nodeType === 1) {
      if (n.getAttribute('aria-hidden') === 'true' || n.hidden) continue;
      out += ' ' + readText(n) + ' ';
    }
  }
  return out.replace(/\s+/g, ' ').replace(/\s+([,.;:!?)»])/g, '$1').trim();
}

export function roleOf(el) {
  const t = el.tagName;
  if (t === 'HEADER') return 'banner';
  if (t === 'NAV') return 'navigation';
  if (t === 'MAIN') return 'main';
  if (t === 'ASIDE') return 'complementary';
  if (t === 'FOOTER') return 'contentinfo';
  if (t === 'ARTICLE') return 'article';
  if (t === 'FIGURE') return 'figure';
  if (t === 'FIGCAPTION') return 'caption';
  if (t === 'BLOCKQUOTE') return 'blockquote';
  if (t === 'FIELDSET') return 'group';
  if (t === 'UL' || t === 'OL') return 'list';
  if (t === 'LI') return 'listitem';
  if (t === 'SECTION') return (el.hasAttribute('aria-labelledby') || el.hasAttribute('aria-label')) ? 'region' : null;
  if (/^H[1-6]$/.test(t)) return 'heading';
  if (t === 'A' && el.hasAttribute('href')) return 'link';
  if (t === 'BUTTON') return 'button';
  if (t === 'SUMMARY') return 'button';
  if (t === 'SELECT') return el.multiple ? 'listbox' : 'combobox';
  if (t === 'FORM') return (el.hasAttribute('aria-labelledby') || el.hasAttribute('aria-label')) ? 'form' : null;
  if (t === 'INPUT') {
    if (el.type === 'checkbox') return 'checkbox';
    if (el.type === 'radio') return 'radio';
    if (el.type === 'range') return 'slider';
    if (['text', 'email', 'search', 'tel', 'url', 'password'].includes(el.type)) return 'textbox';
  }
  return null;
}

/* The verb the tree offers for a node: a port of the cases of Chromium's
   AXObject::Action() (third_party/blink/renderer/modules/accessibility/
   ax_object.cc, checked 2026-11-22): a text field activates; what can be
   checked is checked or unchecked; a button, a <summary> or a toggle is
   pressed; a link jumps; a <select> opens. Anything else is left blank
   rather than guessed. */
const VERBS = { activate: 'activar', check: 'marcar', uncheck: 'desmarcar', press: 'pulsar', jump: 'saltar', open: 'abrir' };
export function actionOf(el, role) {
  let verb = '';
  if (role === 'textbox') verb = 'activate';
  else if (role === 'checkbox' || role === 'radio') verb = el.checked ? 'uncheck' : 'check';
  else if (role === 'button') verb = 'press';
  else if (role === 'link') verb = 'jump';
  else if (role === 'combobox') verb = 'open';
  return verb ? verb + ' (' + VERBS[verb] + ')' : '';
}

/* The accessible name, step by step in the order of station 5's ladder
   (accname): aria-labelledby › aria-label › <label>/<legend>/<figcaption>
   › own text › title. Returns [name, the step that gave it]. */
export function nameOf(el, role) {
  const [name, source] = nameSteps(el, role);
  if (name || !el.title) return [name, source];
  return [el.title, 'title'];
}

function nameSteps(el, role) {
  const lb = el.getAttribute('aria-labelledby');
  if (lb) {
    const text = lb.split(/\s+/)
      .map((id) => {
        const ref = document.getElementById(id);
        return ref ? readText(ref) : '';
      })
      .join(' ');
    return [text, 'aria-labelledby → #' + lb];
  }
  if (el.hasAttribute('aria-label')) return [el.getAttribute('aria-label'), 'aria-label'];
  if (el.labels?.length) {
    return [readText(el.labels[0]).slice(0, 60), '<label> asociado'];
  }
  if (role === 'group') {
    const legend = el.querySelector('legend');
    if (legend) return [readText(legend), '<legend>'];
  }
  if (role === 'figure') {
    const caption = el.querySelector('figcaption');
    if (caption) return [readText(caption).slice(0, 60), '<figcaption>'];
  }
  if (role === 'button' || role === 'link' || role === 'heading' || role === 'caption') {
    return [readText(el).slice(0, 60), 'contenido de texto'];
  }
  return ['', 'sin nombre (correcto para este rol)'];
}

export function stateOf(el, role) {
  if (role === 'checkbox' || role === 'radio') {
    // a checkbox has three values: true, false and mixed (some of its group)
    const checked = el.indeterminate ? 'mixed' : String(el.checked);
    return (el.disabled ? 'disabled · ' : '') + 'checked=' + checked;
  }
  if (role === 'slider') {
    const text = el.getAttribute('aria-valuetext');
    return 'now=' + el.value + ' (' + el.min + '–' + el.max + ')' + (text ? ' · valuetext="' + text + '"' : '');
  }
  // a disclosure: the button says whether what it controls is shown
  const expanded = el.getAttribute('aria-expanded');
  if (expanded !== null && role === 'button') return 'expanded=' + expanded;
  if (role === 'textbox') {
    return (el.required ? 'required · ' : '') + 'invalid=' + (el.getAttribute('aria-invalid') === 'true');
  }
  if (role === 'combobox' || role === 'listbox') return 'value=' + el.value;
  if (el.tagName === 'SUMMARY') return 'expanded=' + !!el.parentElement.open;
  const p = el.getAttribute('aria-pressed');
  if (p !== null) return 'pressed=' + p;
  if (role === 'heading') return 'h' + el.tagName[1];
  return '';
}

/* The text hanging from an element, pruned like the name */
function textOf(el) {
  return readText(el).slice(0, 80);
}

function build(el) {
  const nodes = [];
  for (const child of el.children) {
    // The real pruning: hidden and decorative content never enters the tree
    if (child.hasAttribute('data-inspector') || child.tagName === 'SCRIPT' || child.tagName === 'STYLE') continue;
    if (child.getAttribute('aria-hidden') === 'true' || child.getAttribute('role') === 'presentation') continue;
    if (!isRendered(child)) continue;
    const role = roleOf(child);
    if (role) {
      // Every real level: list→listitem, figure→caption…
      const children = build(child);
      /* A listitem, a region or a group has no accessible name: its
         content reaches the tree as a text node (StaticText), exactly what
         assistive technology reads aloud. Without this those nodes look
         empty, as if they said nothing. It is only added when the node
         has NO name: when it has one, that name already comes from its
         text and repeating it would be noise. */
      if (!children.length && !nameOf(child, role)[0]) {
        const text = textOf(child);
        if (text) children.push({ el: child, role: 'StaticText', text, children: [], parentEl: child });
      }
      nodes.push({ el: child, role, children });
    } else {
      nodes.push(...build(child));
    }
  }
  return nodes;
}

/* Not rendered, not in the tree: an element with `hidden` or
   display: none, and the content of a closed <details> (only its
   <summary> is rendered). A display: contents box has no box of its own
   but its children are rendered, so it is walked through, never cut. */
export function isRendered(el) {
  if (el.hidden) return false;
  const display = getComputedStyle(el).display;
  if (display === 'none') return false;
  if (display === 'contents' || !el.checkVisibility) return true;
  return el.checkVisibility();
}

export function initPanel({ root = document.body } = {}) {
  const cont = document.querySelector('[data-tree]');
  const dl = document.querySelector('[data-card-dl]');
  const focusLine = document.querySelector('[data-focus]');
  const shapeMap = new Map();
  const toggles = [];
  let selected = null;

  let tree = build(root);

  let subListCount = 0;

  function row(node) {
    const li = document.createElement('li');
    li.className = 'node';
    const rowEl = document.createElement('div');
    rowEl.className = 'node__row';
    const isText = node.role === 'StaticText';
    const [name] = isText ? [node.text] : nameOf(node.el, node.role);
    if (isText) li.className = 'node node--text';
    let subList = null;
    let subId = '';

    if (node.children.length) {
      subId = 'ax-tree-sub-' + (++subListCount);
      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'node__toggle';
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-controls', subId);
      // A disclosure keeps ONE label; its state lives in aria-expanded alone
      // (a label that also said "Contraer"/"Expandir" would announce it twice)
      toggle.setAttribute('aria-label', 'Rama ' + node.role + (name ? ' «' + name + '»' : ''));
      toggle.textContent = '▾';
      toggle.addEventListener('click', () => {
        const isOpen = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!isOpen));
        toggle.textContent = isOpen ? '▸' : '▾';
        if (subList) subList.hidden = isOpen;
      });
      rowEl.appendChild(toggle);
      toggles.push(toggle);
    } else {
      const indent = document.createElement('span');
      indent.className = 'node__indent';
      rowEl.appendChild(indent);
    }

    const sel = document.createElement('button');
    sel.type = 'button';
    sel.className = 'node__sel';
    sel.setAttribute('aria-current', 'false');
    const role = document.createElement('span');
    role.className = 'node__role';
    role.textContent = node.role;
    sel.append(role);
    const nom = document.createElement('span');
    nom.className = 'node__name';
    if (name) {
      nom.textContent = '"' + name + '"';
      sel.append(nom);
    }
    const stateTxt = isText ? '' : stateOf(node.el, node.role);
    const est = document.createElement('span');
    est.className = 'node__state';
    est.textContent = stateTxt;
    if (stateTxt) sel.append(est);
    // Like DevTools: a click on a node selects it, highlights its
    // element on the page and brings it into view. The page's focus does
    // not move: inspecting never changes what you inspect.
    sel.addEventListener('click', () => { selectNode(node.el); reveal(node.el); });
    rowEl.appendChild(sel);
    li.appendChild(rowEl);
    if (!isText) shapeMap.set(node.el, { node, sel, est, nom });

    if (node.children.length) {
      subList = document.createElement('ul');
      subList.id = subId;
      node.children.forEach((h) => subList.appendChild(row(h)));
      li.appendChild(subList);
    }
    return li;
  }

  function render() {
    const ul = document.createElement('ul');
    tree.forEach((n) => ul.appendChild(row(n)));
    cont.replaceChildren(ul);
  }
  render();

  /* Content shown or hidden (a disclosure, a <details>) adds or removes
     nodes: the tree is built again, keeping the node in the card */
  function rebuild() {
    const keep = selected?.node.el;
    const keepFocus = focused?.node.el;
    const scrollTop = cont.scrollTop;       // the tree must not jump while you work on the page
    shapeMap.clear();
    toggles.length = 0;
    selected = null;
    tree = build(root);
    render();
    if (keep && shapeMap.has(keep)) selectNode(keep);
    else if (tree.length) selectNode(tree[0].el);
    // the focused node is a new object now: point at it again
    focused = keepFocus ? shapeMap.get(keepFocus) || null : null;
    cont.scrollTop = scrollTop;
    if (focused) { paintFocusLine(focused); visible(focused.sel); }
  }
  // <details> fires "toggle" on itself only: listened to on the way down
  document.addEventListener('toggle', (e) => { if (e.target.tagName === 'DETAILS' && !e.target.closest('[data-inspector]')) rebuild(); }, true);

  document.querySelectorAll('[data-action]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const collapse = btn.dataset.action === 'collapse';
      toggles.forEach((a) => {
        if ((a.getAttribute('aria-expanded') === 'true') === collapse) a.click();
      });
    });
  });

  // The page's real focus order (without the inspector)
  function focusables() {
    return [...document.querySelectorAll('a[href], button, input, select, textarea, summary, [tabindex]')]
      .filter((e) => !e.closest('[data-inspector]') && !e.disabled && e.tabIndex >= 0 && !e.closest('[aria-hidden="true"]'));
  }

  function paintCard(el) {
    const m = shapeMap.get(el);
    if (!m) return;
    const { node } = m;
    const [name, source] = nameOf(node.el, node.role);
    const state = stateOf(node.el, node.role);
    // Properties like DevTools, per element
    const props = [];
    if (node.role === 'heading') props.push('level=' + node.el.tagName[1]);
    if (node.role === 'link') props.push('url=' + node.el.getAttribute('href'));
    if (node.el.disabled) props.push('disabled=true');
    if (node.role === 'textbox' && node.el.required) props.push('required=true');
    if (node.role === 'textbox' && node.el.type) props.push('type=' + node.el.type);
    if (node.el.hasAttribute('lang')) props.push('lang=' + node.el.getAttribute('lang'));
    // Accessible description (aria-describedby / title)
    let desc = '';
    const db = node.el.getAttribute('aria-describedby');
    if (db) desc = db.split(/\s+/).map((i) => {
      const ref = document.getElementById(i);
      return ref ? readText(ref) : '';
    }).join(' ');
    else if (node.el.title) desc = node.el.title;
    // Parent node in the tree
    let parent = '—';
    let p = node.el.parentElement;
    while (p && p !== document.body) { const r = roleOf(p); if (r) { parent = r; break; } p = p.parentElement; }
    // Dynamic focus order: Xth of Y
    let focusEl = 'no enfocable';
    const list = focusables();
    const idx = list.indexOf(node.el);
    if (idx !== -1) focusEl = (idx + 1) + 'º de ' + list.length;
    const rows = [
      ['Rol', node.role],
      ['Nombre', name || '—'],
      ['Origen del nombre', source],
      ['Descripción', desc || '—'],
      ['Estados', state || '— (sin estados)'],
      ['Acción', actionOf(node.el, node.role) || '—'],
      ['Propiedades', props.join(' · ') || '—'],
      ['Nodo padre', parent],
      ['Orden de foco', focusEl],
      ['Etiqueta HTML', '<' + node.el.tagName.toLowerCase() + '>'],
      ['Con foco', document.activeElement === node.el ? 'sí' : 'no']
    ];
    dl.textContent = '';
    rows.forEach(([k, v]) => {
      const dt = document.createElement('dt');
      dt.textContent = k;
      const dd = document.createElement('dd');
      dd.textContent = v;
      dl.append(dt, dd);
    });
  }

  /* The highlight: one box over the element's real box, in document
     coordinates so it scrolls with the page; aria-hidden, no pointer.
     It stays while the node is selected from the panel and leaves when
     the page is used again. */
  const highlight = document.createElement('div');
  highlight.className = 'inspect-highlight';
  highlight.setAttribute('aria-hidden', 'true');
  highlight.hidden = true;
  document.body.append(highlight);
  function reveal(node) {
    if (!node.isConnected || !node.getClientRects().length) { highlight.hidden = true; return; }
    // A real control hidden inside its flower (visually-hidden, 1 px) is
    // shown by what the eye sees: its <label> or its flower
    const box = node.getBoundingClientRect();
    const el = box.width < 4 || box.height < 4 ? (node.closest('label, .flower') || node.labels?.[0] || node) : node;
    // instant, like DevTools' «Scroll into view»: a smooth scroll can be
    // overtaken by the next action and land late
    el.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'instant' });
    const place = () => {
      const r = el.getBoundingClientRect();
      highlight.style.setProperty('--hx', (r.left + scrollX) + 'px');
      highlight.style.setProperty('--hy', (r.top + scrollY) + 'px');
      highlight.style.setProperty('--hw', r.width + 'px');
      highlight.style.setProperty('--hh', r.height + 'px');
    };
    place();
    highlight.hidden = false;
    // snapping may settle the page one frame later: place it again
    requestAnimationFrame(place);
  }
  function unhighlight() { highlight.hidden = true; }

  /* A click on the work (not on the panel) selects the nearest node of
     the tree, as DevTools' element picker does. Focus is told apart, on
     the focus line: clicking plain text gives focus to <main>, whose
     tabindex="-1" makes it the skip link's target. */
  function pick(target) {
    if (!target || target.closest?.('[data-inspector]')) return;
    unhighlight();
    let el = target.nodeType === 1 ? target : target.parentElement;
    while (el && !shapeMap.has(el)) el = el.parentElement;
    if (!el) return;
    const m = shapeMap.get(el);
    // open every collapsed branch above it, so the selection can be seen
    let li = m.sel.closest('li')?.parentElement?.closest('li');
    while (li) {
      const toggle = li.querySelector(':scope > .node__row > .node__toggle');
      if (toggle?.getAttribute('aria-expanded') === 'false') toggle.click();
      li = li.parentElement?.closest('li');
    }
    selectNode(el);
    visible(m.sel);
  }

  function visible(selBtn) {
    const box = selBtn.closest('.tree');
    if (!box) return;
    const r = selBtn.getBoundingClientRect();
    const c = box.getBoundingClientRect();
    if (r.top < c.top + 30 || r.bottom > c.bottom - 30) {
      box.scrollTop += r.top - c.top - c.height / 3;
    }
  }

  function selectNode(el) {
    const m = shapeMap.get(el);
    if (!m) return;
    if (selected) selected.sel.setAttribute('aria-current', 'false');
    selected = m;
    m.sel.setAttribute('aria-current', 'true');
    paintCard(el);
  }

  function refresh(el) {
    const m = shapeMap.get(el);
    if (!m) return;
    const txt = stateOf(m.node.el, m.node.role);
    const changed = txt !== m.est.textContent;
    m.est.textContent = txt;
    if (txt && !m.est.isConnected) m.sel.append(m.est);
    // The sap reaches the tree: the state that just changed flashes once
    // in the inspector, tying the pixel to its node. Visual only; the
    // live region already tells the change.
    if (changed && txt) {
      m.est.classList.remove('node__state--changed');
      void m.est.offsetWidth;
      m.est.classList.add('node__state--changed');
    }
    if (selected === m) paintCard(el);
    // The focus line tells the state NOW, not the one it had when focus
    // arrived: when the focused node changes, it is rewritten
    if (focused === m) paintFocusLine(m);
    // The flower's cartela changes with the state, and the figure and
    // the figcaption take their name from it: they are recomputed too, so
    // no node in the tree tells a stale state
    const fig = el.closest('figure');
    if (fig) [fig, fig.querySelector('figcaption')].forEach(rename);
  }

  function rename(el) {
    const m = el && shapeMap.get(el);
    if (!m) return;
    const [name] = nameOf(m.node.el, m.node.role);
    m.nom.textContent = name ? '"' + name + '"' : '';
    if (name && !m.nom.isConnected) m.sel.insertBefore(m.nom, m.est.isConnected ? m.est : null);
    if (selected === m) paintCard(el);
  }

  let focused = null;
  function paintFocusLine(m) {
    const [name] = nameOf(m.node.el, m.node.role);
    const state = stateOf(m.node.el, m.node.role);
    focusLine.textContent = 'Foco → ' + m.node.role + (name ? ' «' + name + '»' : '') + (state ? ' · ' + state : '');
  }

  function follow(target) {
    if (target.closest?.('[data-inspector]')) {
      focused = null;
      focusLine.textContent = 'Foco en el inspector (fuera de su propio árbol, como DevTools).';
      return;
    }
    const closest = target.closest?.(FOCUS_SELECTOR);
    const m = closest ? shapeMap.get(closest) : null;
    if (!m) return;
    focused = m;
    paintFocusLine(m);
    selectNode(closest);
    visible(m.sel);
  }

  // Focus can also leave every element. After an in-page link the
  // browser blurs it (document.activeElement is <body>) and only moves
  // the sequential focus navigation starting point to the link's target:
  // the next Tab starts there. The focus line tells exactly that, and the
  // tree selects the starting point, as DevTools would show no focus.
  function rest(start) {
    focused = null;
    const m = start ? shapeMap.get(start) : null;
    if (!m) {
      focusLine.textContent = 'Sin foco. Pulsa Tab para entrar en el árbol.';
      if (selected) paintCard(selected.node.el);   // its "Con foco" is now "no"
      return;
    }
    const [name] = nameOf(m.node.el, m.node.role);
    focusLine.textContent = 'Sin foco: el enlace lo suelta al llegar. El siguiente Tab parte de ' + m.node.role + (name ? ' «' + name + '»' : '') + '.';
    selectNode(start);
    visible(m.sel);
  }

  // The tree, machine-readable: the same pruning and the same data
  // assistive technology sees, as JSON
  function serialize(nodes) {
    return nodes.map((n) => {
      if (n.role === 'StaticText') return { role: 'StaticText', text: n.text };
      const [name, source] = nameOf(n.el, n.role);
      const state = stateOf(n.el, n.role);
      const o = { role: n.role, labelEl: n.el.tagName.toLowerCase() };
      if (n.el.id) o.id = n.el.id;
      o.name = name || null;
      o.nameSource = source;
      if (state) o.state = state;
      if (n.children.length) o.children = serialize(n.children);
      return o;
    });
  }

  function exportTree() {
    return {
      obra: 'Accessibility Bloom',
      description: 'Árbol de Accesibilidad leído del DOM real de la página: rol, nombre, origen del nombre y estado de cada nodo. Lo decorativo (aria-hidden) y el propio inspector quedan podados, igual que hace el navegador.',
      generado: new Date().toISOString(),
      fuente: location.href,
      licencia: 'CC BY-NC-SA 4.0',
      tree: serialize(tree)
    };
  }

  if (tree.length) selectNode(tree[0].el);

  return { follow, rest, refresh, rebuild, selectNode, pick, exportTree };
}
