/* Shared social/video artwork primitives. Brand values come from the website. */
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const tokens = JSON.parse(fs.readFileSync(path.join(root, 'styles/tokens.json'), 'utf8'));
const colors = Object.fromEntries(Object.entries(tokens.colors).map(([key, value]) => [key, value.hex]));
const paths = [...fs.readFileSync(path.join(root, 'assets/htafl-mark.svg'), 'utf8').matchAll(/<path[^>]+d="([^"]+)"/g)].map((match) => match[1]);
if (paths.length !== 5) throw new Error('Expected the five production logo paths.');
const escape = (value) => String(value).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const rect = (x,y,w,h,fill,r=0,stroke) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="2"` : ''}/>`;
const text = (x,y,value,size,color,display=false,weight) => `<text x="${x}" y="${y}" font-family="${escape(display ? tokens.typography.display.family : tokens.typography.body.family)}, Arial, sans-serif" font-size="${size}" font-weight="${weight || (display ? 700 : 400)}"${display ? ` letter-spacing="${value === 'HTAFL' ? '-0.03em' : '-0.035em'}"` : ''} fill="${color}">${escape(value)}</text>`;
const mark = (x,y,size,color) => `<g transform="translate(${x} ${y}) scale(${size / 900}) translate(-178 -89)" fill="${color}">${paths.map(d=>`<path d="${d}"/>`).join('')}</g>`;
function wrap(value, limit, maxLines) {
  const lines = []; let line = '';
  for (const word of String(value).trim().split(/\s+/)) {
    if (word.length > limit) throw new Error(`Word too long for layout: ${word}`);
    if (line && (line + ' ' + word).length > limit) { lines.push(line); line = word; }
    else line += (line ? ' ' : '') + word;
  }
  if (line) lines.push(line);
  if (lines.length > maxLines) throw new Error(`Copy does not fit: ${value}. Shorten it or use another slide.`);
  return lines;
}
function svg(width,height,label,content) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="art-title art-desc"><title id="art-title">${escape(label)}</title><desc id="art-desc">Editable HTAFL artwork. Bracketed copy and empty image frames are template placeholders, not approved posts.</desc>${content}</svg>`;
}
function approvedImage(record) {
  if (record.publicationConsent !== true || typeof record.image?.alt !== 'string' || !record.image.alt.trim() ||
      typeof record.credit !== 'string' || !record.credit.trim()) throw new Error('Images require publicationConsent, descriptive alt text and approved public credit.');
  const file = path.resolve(root,record.image.src);
  const type = {'.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp'}[path.extname(file).toLowerCase()];
  if (!file.startsWith(root+path.sep) || !type) throw new Error('Use a local PNG, JPEG or WebP inside the repository.');
  return `data:${type};base64,${fs.readFileSync(file).toString('base64')}`;
}
module.exports = { root, tokens, colors, paths, escape, rect, text, mark, wrap, svg, approvedImage };

