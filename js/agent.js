/**
 * AGENT — the work, offered to AI agents through WebMCP (a proposed web
 * standard, in origin trial from Chrome 149; developer.chrome.com/docs/
 * ai/webmcp). An agent reads the same Accessibility Tree a screen reader
 * reads, and acts through the same controls a person presses:
 *   · list_stations, read_station_tree — read only; the tree is computed
 *     with the inspector's own roleOf/nameOf/stateOf/actionOf.
 *   · go_to_station, set_vision — act by focusing a station or by
 *     clicking the very radio a person would, so the change is announced
 *     and visible.
 *   · water_garden — declarative: the watering <form> carries toolname
 *     and tooldescription (index.html); main.js answers agent submits.
 * Everything an agent does is said in the work's live region, so whoever
 * is in front of the screen knows. Sound and motion are never touched:
 * they stay the person's decision. Without WebMCP nothing here runs.
 */
import { roleOf, nameOf, stateOf, actionOf, isRendered } from './tree-ax.js';
import { VISION } from './stations.js';

const STATIONS = () => [...document.querySelectorAll('#trunk > section[id]')];
const titleOf = (section) => section.querySelector('h2')?.textContent.replace(/^\d+/, '').trim() ?? section.id;
const VISIONS = ['typical', 'protanopia', 'deuteranopia', 'tritanopia', 'greyscale'];

export function initAgent({ announce = () => {} } = {}) {
  const context = document.modelContext;
  if (!context?.registerTool) return { tools: 0 };
  const ids = STATIONS().map((s) => s.id);
  // registerTool returns a promise in the documented API; wrapped so a
  // synchronous return or a rejection never breaks the page
  const register = (tool) => Promise.resolve().then(() => context.registerTool(tool)).catch(() => {});

  register({
    name: 'list_stations',
    description: 'Lists the twelve stations of Accessibility Bloom in reading order, with number, title and anchor.',
    inputSchema: { type: 'object', properties: {} },
    annotations: { readOnlyHint: true },
    execute: async () => JSON.stringify(STATIONS().map((s, i) => ({ number: i + 1, id: s.id, title: titleOf(s), anchor: '#' + s.id }))),
  });

  register({
    name: 'read_station_tree',
    description: 'Returns the interactive accessibility nodes of one station: role, accessible name, state and the action the tree offers.',
    inputSchema: {
      type: 'object',
      properties: { station: { type: 'string', enum: ids, description: 'The station id, as given by list_stations.' } },
      required: ['station'],
    },
    annotations: { readOnlyHint: true },
    execute: async ({ station }) => {
      const section = document.getElementById(station);
      if (!section) return `No station "${station}".`;
      const nodes = [...section.querySelectorAll('a[href], button, input, select, textarea, summary')]
        .filter((el) => isRendered(el) && !el.closest('[aria-hidden="true"], [inert]'))
        .map((el) => {
          const role = roleOf(el);
          const [name] = nameOf(el, role);
          return { role, name, state: stateOf(el, role) || null, action: actionOf(el, role) || null };
        });
      announce(`Un agente lee el árbol de «${titleOf(section)}».`);
      return JSON.stringify({ station, title: titleOf(section), nodes });
    },
  });

  register({
    name: 'go_to_station',
    description: 'Scrolls to a station of the work and moves focus to its title, so a person sees where the agent is.',
    inputSchema: {
      type: 'object',
      properties: { station: { type: 'string', enum: ids, description: 'The station id, as given by list_stations.' } },
      required: ['station'],
    },
    execute: async ({ station }) => {
      const section = document.getElementById(station);
      if (!section) return `No station "${station}".`;
      const heading = section.querySelector('h2');
      heading.setAttribute('tabindex', '-1');
      heading.focus();
      section.scrollIntoView({ block: 'start' });
      announce(`Un agente te lleva a «${titleOf(section)}».`);
      return `Now at station "${titleOf(section)}".`;
    },
  });

  register({
    name: 'set_vision',
    description: 'Shows the whole work as seen with a colour vision deficiency, or without colour, by checking the "Mirar como" radio a person would use.',
    inputSchema: {
      type: 'object',
      properties: { vision: { type: 'string', enum: VISIONS, description: 'typical, protanopia, deuteranopia, tritanopia or greyscale.' } },
      required: ['vision'],
    },
    execute: async ({ vision }) => {
      const radio = document.querySelector(`[data-vision] input[value="${vision}"]`);
      if (!radio) return `No vision "${vision}".`;
      radio.click();
      // one sentence for the room: who acted, and what it means
      announce(`Un agente cambia la mirada. ${VISION[vision]}`);
      return `The work is now shown as: ${vision}.`;
    },
  });

  // A declarative tool (a <form toolname>) is being filled by an agent:
  // say it aloud. Imperative tools announce themselves, in their own words.
  const isForm = (name) => Boolean(document.querySelector(`form[toolname="${name}"]`));
  context.addEventListener?.('toolactivated', ({ toolName }) => { if (isForm(toolName)) announce(`Un agente está rellenando «${toolName}».`); });
  context.addEventListener?.('toolcancel', ({ toolName }) => { if (isForm(toolName)) announce(`El agente ha cancelado «${toolName}».`); });
  return { tools: 4 };
}
