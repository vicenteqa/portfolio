// Pure helpers for scripts/sync-games.mjs (no network, no filesystem).

export const PLATFORMS = {
  'Mega Drive': { slug: 'mega-drive', igdb: /mega ?drive|genesis/i },
  PS4: { slug: 'ps4', igdb: /^playstation 4$/i },
  PS5: { slug: 'ps5', igdb: /^playstation 5$/i },
  'Xbox 360': { slug: 'xbox-360', igdb: /^xbox 360$/i },
  Switch: { slug: 'switch', igdb: /^nintendo switch$/i },
  'Switch 2': { slug: 'switch-2', igdb: /^nintendo switch 2$/i },
};

export const slugify = (s) =>
  s
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// Minimal CSV: comma separated, "quoted, fields" and "" escapes, # comments.
export function parseCsv(text) {
  const rows = [];
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const cells = [];
    let cur = '';
    let quoted = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (quoted) {
        if (c === '"' && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else if (c === '"') quoted = false;
        else cur += c;
      } else if (c === '"') quoted = true;
      else if (c === ',') {
        cells.push(cur);
        cur = '';
      } else cur += c;
    }
    cells.push(cur);
    rows.push(cells.map((x) => x.trim()));
  }
  const [header, ...body] = rows;
  return body.map((cells) => Object.fromEntries(header.map((h, i) => [h, cells[i] ?? ''])));
}

const norm = (s) =>
  s
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9 ]+/g, ' ')
    .replace(/\b(the|a|an)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

// Jaccard similarity over word sets: 1 = same words.
export function similarity(a, b) {
  const A = new Set(norm(a).split(' ').filter(Boolean));
  const B = new Set(norm(b).split(' ').filter(Boolean));
  if (!A.size || !B.size) return 0;
  let inter = 0;
  for (const w of A) if (B.has(w)) inter++;
  return inter / (A.size + B.size - inter);
}

// Best IGDB candidate for a title. `confidence` < 0.6 means "please check".
export function pickBest(candidates, title) {
  let best = null;
  for (const c of candidates) {
    const score = norm(c.name) === norm(title) ? 1 : similarity(c.name, title);
    // prefer entries that have a cover when scores tie
    const rank = score + (c.cover?.image_id ? 0.001 : 0);
    if (!best || rank > best.rank) best = { candidate: c, score, rank };
  }
  return best ? { ...best.candidate, confidence: Number(best.score.toFixed(2)) } : null;
}

export const yearOf = (unixSeconds) =>
  unixSeconds ? new Date(unixSeconds * 1000).getUTCFullYear() : null;

export const coverUrl = (imageId, base = 'https://images.igdb.com') =>
  `${base}/igdb/image/upload/t_cover_big/${imageId}.jpg`;
