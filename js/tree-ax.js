/**
 * ÁRBOL AX — inspector en vivo con el flujo de DevTools:
 * árbol expandible (todo expandido por defecto) + ficha del nodo.
 * Se reconstruye del DOM real. Excluye [data-inspector]: como
 * DevTools, el inspector no se inspecciona a sí mismo.
 */
const FOCUS_SELECTOR = 'a[href],button,summary,input,select,h1,h2,h3,li,header,nav,main,section,article,aside,footer,fieldset,figure';

/* Lee el texto como lo lee el algoritmo accname: descarta los subárboles
   aria-hidden y los ocultos, e inserta separación en cada límite de
   elemento —así «1» + «La estructura…» no se pegan, y el número
   decorativo del título no entra en el nombre. */
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

function roleOf(el) {
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

function nameOf(el, role) {
  if (el.hasAttribute('aria-label')) return [el.getAttribute('aria-label'), 'aria-label'];
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
  if (el.labels?.length) {
    return [readText(el.labels[0]).slice(0, 60), '<label> asociado'];
  }
  if (role === 'group') {
    const leyenda = el.querySelector('legend');
    if (leyenda) return [readText(leyenda), '<legend>'];
  }
  if (role === 'figure') {
    const pie = el.querySelector('figcaption');
    if (pie) return [readText(pie).slice(0, 60), '<figcaption>'];
  }
  if (role === 'button' || role === 'link' || role === 'heading' || role === 'caption') {
    return [readText(el).slice(0, 60), 'contenido de texto'];
  }
  return ['', 'sin nombre (correcto para este rol)'];
}

function stateOf(el, role) {
  if (role === 'checkbox' || role === 'radio') {
    return (el.disabled ? 'disabled · ' : '') + 'checked=' + el.checked;
  }
  if (role === 'slider') return 'now=' + el.value + ' (' + el.min + '–' + el.max + ')';
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

/* El texto que cuelga de un elemento, con la misma poda que el nombre */
function textOf(el) {
  return readText(el).slice(0, 80);
}

function construir(el) {
  const nodes = [];
  for (const child of el.children) {
    // La poda real: lo oculto y lo decorativo no entran en el árbol
    if (child.hasAttribute('data-inspector') || child.tagName === 'SCRIPT' || child.tagName === 'STYLE') continue;
    if (child.getAttribute('aria-hidden') === 'true' || child.getAttribute('role') === 'presentation') continue;
    const role = roleOf(child);
    if (role) {
      // Todos los niveles reales: list→listitem, figure→caption…
      const children = construir(child);
      /* Un listitem, una región o un grupo no tienen nombre accesible: su
         contenido llega al árbol como un nodo de texto (StaticText), y es
         exactamente lo que lee en voz alta la tecnología de apoyo. Sin
         esto, esos nodos se ven vacíos y parece que no dicen nada. Solo se
         añade cuando el nodo NO tiene nombre: si lo tiene, ese nombre ya
         viene de su texto y repetirlo sería ruido. */
      if (!children.length && !nameOf(child, role)[0]) {
        const text = textOf(child);
        if (text) children.push({ el: child, role: 'StaticText', text, children: [], parentEl: child });
      }
      nodes.push({ el: child, role, children });
    } else {
      nodes.push(...construir(child));
    }
  }
  return nodes;
}

export function initPanel({ root = document.body } = {}) {
  const cont = document.querySelector('[data-tree]');
  const dl = document.querySelector('[data-card-dl]');
  const focusLine = document.querySelector('[data-focus]');
  const shapeMap = new Map();
  const toggles = [];
  let seleccionado = null;

  const tree = construir(root);

  function row(node) {
    const li = document.createElement('li');
    li.className = 'node';
    const rowEl = document.createElement('div');
    rowEl.className = 'node__row';
    const isText = node.role === 'StaticText';
    const [name] = isText ? [node.text] : nameOf(node.el, node.role);
    if (isText) li.className = 'node node--text';
    let subList = null;

    if (node.children.length) {
      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'node__toggle';
      toggle.setAttribute('aria-expanded', 'true');
      const labelFor = (isOpen) => toggle.setAttribute('aria-label', (isOpen ? 'Contraer ' : 'Expandir ') + node.role + (name ? ' «' + name + '»' : ''));
      toggle.textContent = '▾';
      labelFor(true);
      toggle.addEventListener('click', () => {
        const isOpen = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!isOpen));
        toggle.textContent = isOpen ? '▸' : '▾';
        labelFor(!isOpen);
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
    if (name) {
      const nom = document.createElement('span');
      nom.className = 'node__name';
      nom.textContent = '"' + name + '"';
      sel.append(nom);
    }
    const stateTxt = isText ? '' : stateOf(node.el, node.role);
    const est = document.createElement('span');
    est.className = 'node__state';
    est.textContent = stateTxt;
    if (stateTxt) sel.append(est);
    sel.addEventListener('click', () => selectNode(node.el));
    rowEl.appendChild(sel);
    li.appendChild(rowEl);
    if (!isText) shapeMap.set(node.el, { node, sel, est });

    if (node.children.length) {
      subList = document.createElement('ul');
      node.children.forEach((h) => subList.appendChild(row(h)));
      li.appendChild(subList);
    }
    return li;
  }

  const ul = document.createElement('ul');
  tree.forEach((n) => ul.appendChild(row(n)));
  cont.appendChild(ul);

  document.querySelectorAll('[data-action]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const contraer = btn.dataset.action === 'contraer';
      toggles.forEach((a) => {
        if ((a.getAttribute('aria-expanded') === 'true') === contraer) a.click();
      });
    });
  });

  // Orden de foco real de la página (sin el inspector)
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
    // Propiedades como DevTools, según el elemento
    const props = [];
    if (node.role === 'heading') props.push('level=' + node.el.tagName[1]);
    if (node.role === 'link') props.push('url=' + node.el.getAttribute('href'));
    if (node.el.disabled) props.push('disabled=true');
    if (node.role === 'textbox' && node.el.required) props.push('required=true');
    if (node.role === 'textbox' && node.el.type) props.push('type=' + node.el.type);
    if (node.el.hasAttribute('lang')) props.push('lang=' + node.el.getAttribute('lang'));
    // Descripción accesible (aria-describedby / title)
    let desc = '';
    const db = node.el.getAttribute('aria-describedby');
    if (db) desc = db.split(/\s+/).map((i) => {
      const ref = document.getElementById(i);
      return ref ? readText(ref) : '';
    }).join(' ');
    else if (node.el.title) desc = node.el.title;
    // Nodo padre en el árbol
    let parent = '—';
    let p = node.el.parentElement;
    while (p && p !== document.body) { const r = roleOf(p); if (r) { parent = r; break; } p = p.parentElement; }
    // Orden de foco dinámico: Xº de Y
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
    if (seleccionado) seleccionado.sel.setAttribute('aria-current', 'false');
    seleccionado = m;
    m.sel.setAttribute('aria-current', 'true');
    paintCard(el);
  }

  function refresh(el) {
    const m = shapeMap.get(el);
    if (!m) return;
    const txt = stateOf(m.node.el, m.node.role);
    m.est.textContent = txt;
    if (txt && !m.est.isConnected) m.sel.append(m.est);
    if (seleccionado === m) paintCard(el);
  }

  function follow(objetivo) {
    if (objetivo.closest?.('[data-inspector]')) {
      focusLine.textContent = 'Foco en el inspector (fuera de su propio árbol, como DevTools).';
      return;
    }
    const cercano = objetivo.closest?.(FOCUS_SELECTOR);
    const m = cercano ? shapeMap.get(cercano) : null;
    if (!m) return;
    const [name] = nameOf(m.node.el, m.node.role);
    const state = stateOf(m.node.el, m.node.role);
    focusLine.textContent = 'Foco → ' + m.node.role + (name ? ' «' + name + '»' : '') + (state ? ' · ' + state : '');
    selectNode(cercano);
    visible(m.sel);
  }

  // El árbol, legible por máquinas: la misma poda y los mismos datos
  // que ve la tecnología de apoyo, en JSON
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

  return { follow, refresh, selectNode, exportTree };
}
