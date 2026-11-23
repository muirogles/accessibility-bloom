/**
 * CVD PALETTE — how the work's primitive colours look with each kind of
 * dichromacy, precomputed so the work can show it with CSS alone (no SVG
 * filter). Run: node tools/cvd-palette.mjs
 *
 * Model: Machado, Oliveira & Fernandes (2009), "A Physiologically-based
 * Model for Simulation of Color Vision Deficiency", IEEE TVCG 15(6).
 * Matrices for severity 1.0 (dichromacy), as published by the authors:
 * https://www.inf.ufrgs.br/~oliveira/pubs_files/CVD_Simulation/CVD_Simulation.html
 * Applied here to linear RGB (sRGB decoded, then encoded back) — our
 * choice, stated in the README; the authors' page does not say it.
 */
import fs from 'node:fs';

const MATRICES = {
  protanopia: [[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]],
  deuteranopia: [[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.011820, 0.042940, 0.968881]],
  tritanopia: [[1.255528, -0.076749, -0.178779], [-0.078411, 0.930809, 0.147602], [0.004733, 0.691367, 0.303900]],
};

const tokens = fs.readFileSync(new URL('../css/tokens.css', import.meta.url), 'utf8');
const primitives = [...tokens.matchAll(/^\s*(--k-[a-z0-9-]+):\s*(#[0-9a-f]{6});/gim)].map((m) => [m[1], m[2]]);

const toLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toSrgb = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
const hex = (rgb) => '#' + rgb.map((c) => Math.round(Math.min(1, Math.max(0, toSrgb(c))) * 255).toString(16).padStart(2, '0')).join('');
const simulate = (value, m) => {
  const rgb = [1, 3, 5].map((i) => toLinear(parseInt(value.slice(i, i + 2), 16) / 255));
  return hex(m.map((row) => row[0] * rgb[0] + row[1] * rgb[1] + row[2] * rgb[2]));
};

let css = '';
for (const [name, m] of Object.entries(MATRICES)) {
  css += `:root[data-vision="${name}"] {\n`;
  for (const [token, value] of primitives) css += `  ${token}: ${simulate(value, m)};\n`;
  css += '}\n';
}
process.stdout.write(css);
