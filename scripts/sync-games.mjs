// Builds app/collection/games.json from data/games.csv and, when IGDB
// credentials are available, fills in year + cover art.
//
//   node --env-file=.env scripts/sync-games.mjs            # only fetch what is missing
//   node --env-file=.env scripts/sync-games.mjs --refresh  # look everything up again
//
// .env needs IGDB_CLIENT_ID and IGDB_CLIENT_SECRET (a free Twitch developer app).
// Without them it still writes games.json (no covers), so the page keeps working.
// Run it by hand when the collection changes; visitors never touch IGDB.
import { mkdir, readFile, readdir, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { PLATFORMS, coverUrl, parseCsv, pickBest, slugify, yearOf } from './games-lib.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const CSV = path.join(ROOT, 'data/games.csv');
const OUT = path.join(ROOT, 'app/collection/games.json');
const COVERS = path.join(ROOT, 'public/games');
const OWN = path.join(ROOT, 'data/covers');

const env = process.env;
const TOKEN_URL = env.TWITCH_TOKEN_URL || 'https://id.twitch.tv/oauth2/token';
const API = env.IGDB_API_URL || 'https://api.igdb.com/v4';
const IMAGES = env.IGDB_IMAGE_URL || 'https://images.igdb.com';
const refresh = process.argv.includes('--refresh');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const rows = parseCsv(await readFile(CSV, 'utf8'));
let previous = [];
try {
  previous = JSON.parse(await readFile(OUT, 'utf8')).games;
} catch {}
const known = new Map(previous.map((g) => [g.id, g]));

const base = (row) => ({
  id: slugify(`${row.title} ${row.platform}`),
  title: row.title,
  platform: row.platform,
  note: row.note || null,
});

for (const r of rows) {
  if (!PLATFORMS[r.platform]) throw new Error(`Unknown platform "${r.platform}" for "${r.title}"`);
}

const haveCreds = env.IGDB_CLIENT_ID && env.IGDB_CLIENT_SECRET;
let token = null;
let platformIds = {};

async function igdb(endpoint, body) {
  const res = await fetch(`${API}/${endpoint}`, {
    method: 'POST',
    headers: {
      'Client-ID': env.IGDB_CLIENT_ID,
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
    body,
  });
  if (!res.ok) throw new Error(`IGDB ${endpoint} -> ${res.status}`);
  await sleep(260); // IGDB allows ~4 requests per second
  return res.json();
}

if (haveCreds) {
  const res = await fetch(
    `${TOKEN_URL}?client_id=${env.IGDB_CLIENT_ID}&client_secret=${env.IGDB_CLIENT_SECRET}&grant_type=client_credentials`,
    { method: 'POST' }
  );
  if (!res.ok) throw new Error(`Twitch token request failed: ${res.status}`);
  token = (await res.json()).access_token;

  const all = await igdb('platforms', 'fields name; limit 500;');
  for (const [label, p] of Object.entries(PLATFORMS)) {
    const hit = all.find((x) => p.igdb.test(x.name));
    if (!hit) throw new Error(`No IGDB platform matches "${label}"`);
    platformIds[label] = hit.id;
  }
} else {
  console.warn('IGDB_CLIENT_ID / IGDB_CLIENT_SECRET not set: writing the list without covers.\n');
}

async function lookup(row) {
  const fields = 'fields name,alternative_names.name,first_release_date,cover.image_id,url;';
  let candidates;
  if (row.igdb_id) {
    candidates = await igdb('games', `${fields} where id = ${Number(row.igdb_id)};`);
  } else {
    const q = row.title.replaceAll('"', '');
    candidates = await igdb(
      'games',
      `search "${q}"; ${fields} where platforms = (${platformIds[row.platform]}); limit 15;`
    );
  }
  return pickBest(candidates, row.title);
}

async function saveCover(imageId, id) {
  const res = await fetch(coverUrl(imageId, IMAGES));
  if (!res.ok) throw new Error(`cover ${res.status}`);
  await sharp(Buffer.from(await res.arrayBuffer()))
    .resize({ width: 264 })
    .webp({ quality: 80 })
    .toFile(path.join(COVERS, `${id}.webp`));
}

// Your own photos/scans of the real boxes win over whatever IGDB had.
const own = new Map();
try {
  for (const f of await readdir(OWN)) {
    const m = f.match(/^(.+)\.(jpe?g|png|webp)$/i);
    if (m) own.set(m[1], path.join(OWN, f));
  }
} catch {}
await mkdir(COVERS, { recursive: true });
const games = [];
const review = [];
const failed = [];

for (const row of rows) {
  const entry = base(row);
  const old = known.get(entry.id);
  // skip what is already resolved, unless asked to refresh or the CSV now points at another IGDB id
  const done =
    old && old.cover && !refresh && (!row.igdb_id || String(old.igdbId) === row.igdb_id) &&
    !(old.ownCover && !own.has(entry.id)); // own photo was removed: go back to IGDB's cover

  if (done || !haveCreds) {
    games.push({ ...entry, ...(old ? { year: old.year, cover: old.cover, igdbId: old.igdbId ?? null, igdbUrl: old.igdbUrl } : { year: null, cover: null, igdbId: null, igdbUrl: null }) });
    continue;
  }

  try {
    const hit = await lookup(row);
    if (!hit) {
      failed.push(row);
      games.push({ ...entry, year: null, cover: null, igdbId: null, igdbUrl: null });
      continue;
    }
    let cover = null;
    if (hit.cover?.image_id) {
      await saveCover(hit.cover.image_id, entry.id);
      cover = `/games/${entry.id}.webp`;
    }
    // an id typed into the CSV is a human decision: never second-guess it
    if (row.igdb_id) hit.confidence = 1;
    if (hit.confidence < 0.6) review.push({ row, matched: hit.name, confidence: hit.confidence });
    games.push({ ...entry, year: yearOf(hit.first_release_date), cover, igdbId: hit.id, igdbUrl: hit.url ?? null });
    console.log(`${hit.confidence >= 0.6 ? 'ok   ' : 'check'} ${row.platform.padEnd(10)} ${row.title}  ->  ${hit.name}`);
  } catch (e) {
    console.error(`FAIL  ${row.title}: ${e.message}`);
    failed.push(row);
    games.push({ ...entry, year: null, cover: null, igdbId: null, igdbUrl: null });
  }
}

// apply own covers
const unknownOwn = [...own.keys()].filter((id) => !games.some((g) => g.id === id));
for (const g of games) {
  const file = own.get(g.id);
  if (!file) continue;
  await sharp(file).rotate().resize({ width: 264 }).webp({ quality: 82 }).toFile(path.join(COVERS, `${g.id}.webp`));
  g.cover = `/games/${g.id}.webp`;
  g.ownCover = true;
  console.log(`own   ${g.platform.padEnd(10)} ${g.title}  <-  data/covers/${path.basename(file)}`);
}

// drop covers of games that are no longer in the list
for (const f of await readdir(COVERS)) {
  if (f.endsWith('.webp') && !games.some((g) => `${g.id}.webp` === f)) {
    await unlink(path.join(COVERS, f));
    console.log(`removed orphan cover ${f}`);
  }
}

await mkdir(path.dirname(OUT), { recursive: true });
await writeFile(OUT, JSON.stringify({ games }, null, 2) + '\n');

const withCover = games.filter((g) => g.cover).length;
console.log(`\n${games.length} games written to app/collection/games.json (${withCover} with cover).`);
if (unknownOwn.length) console.log(`\nIgnored files in data/covers (no game with that id): ${unknownOwn.join(', ')}`);
if (review.length) {
  console.log('\nCheck these matches (low confidence). Put the right IGDB id in data/games.csv:');
  for (const r of review) console.log(`  "${r.row.title}" (${r.row.platform}) matched "${r.matched}" [${r.confidence}]`);
}
if (failed.length) {
  console.log('\nNot found / failed:');
  for (const r of failed) console.log(`  "${r.title}" (${r.platform})`);
}
