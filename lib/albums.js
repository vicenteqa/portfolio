// Spotify "saved albums" service with the failure modes handled:
//  - 1h cache; stale list kept if a refresh fails (stale-if-error)
//  - failures are cached too (5 min), so a dead token or a Spotify outage is
//    not hammered with one request per visitor
//  - concurrent callers share a single in-flight refresh
//  - pagination is capped and only follows URLs on api.spotify.com
// `http` is axios-like ({ get, post }); it is injected so this can be tested.

const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const API_PREFIX = 'https://api.spotify.com/';
const FIRST_PAGE = `${API_PREFIX}v1/me/albums?limit=50`;

export const ALBUMS_TTL = 60 * 60 * 1000;
export const FAILURE_TTL = 5 * 60 * 1000;
export const MAX_PAGES = 20;

// Only safe fields: never log the request, headers or tokens.
const describe = (error) => {
  const data = error?.response?.data;
  return {
    status: error?.response?.status,
    error: data?.error?.message || data?.error || undefined,
    description: data?.error_description,
    message: error?.response ? undefined : error?.message,
  };
};

const normalize = (items) =>
  items.map(({ album }) => ({
    id: album.id,
    name: album.name.replace(/\s?\(.*?\)$/g, '').trim(),
    url: album.external_urls.spotify,
    cover: album.images?.[0]?.url,
    artists: album.artists.map((a) => a.name).join(', '),
  }));

export function createAlbumsService({
  http,
  env = process.env,
  now = Date.now,
  log = console,
}) {
  let accessToken = null;
  let tokenExpiry = 0;
  let refreshToken = null; // only set if Spotify ever rotates it
  let albums = null;
  let albumsExpiry = 0;
  let failedUntil = 0;
  let inflight = null;

  async function getToken() {
    if (accessToken && now() < tokenExpiry) return accessToken;

    const { SPOTIFY_CLIENT_ID: id, SPOTIFY_CLIENT_SECRET: secret } = env;
    const refresh = refreshToken || env.SPOTIFY_REFRESH_TOKEN;
    if (!id || !secret || !refresh) throw new Error('Spotify credentials are not configured');

    const res = await http.post(
      TOKEN_URL,
      new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refresh }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: 'Basic ' + Buffer.from(`${id}:${secret}`).toString('base64'),
        },
      }
    );

    accessToken = res.data.access_token;
    // refresh 5 minutes early
    tokenExpiry = now() + (res.data.expires_in - 300) * 1000;
    if (res.data.refresh_token && res.data.refresh_token !== refresh) {
      refreshToken = res.data.refresh_token;
      log.warn(
        '[spotify] Spotify rotated the refresh token. The new one is only kept in memory: update SPOTIFY_REFRESH_TOKEN.'
      );
    }
    return accessToken;
  }

  async function fetchAll() {
    const token = await getToken();
    const items = [];
    let url = FIRST_PAGE;
    for (let page = 0; url; page++) {
      if (page >= MAX_PAGES) {
        log.warn(`[spotify] stopped after ${MAX_PAGES} pages`);
        break;
      }
      if (!url.startsWith(API_PREFIX)) throw new Error('Unexpected pagination host');
      const res = await http.get(url, { headers: { Authorization: `Bearer ${token}` } });
      items.push(...res.data.items);
      url = res.data.next;
    }
    return normalize(items);
  }

  function refresh() {
    if (!inflight) {
      inflight = (async () => {
        try {
          albums = await fetchAll();
          albumsExpiry = now() + ALBUMS_TTL;
          failedUntil = 0;
          return albums;
        } catch (error) {
          failedUntil = now() + FAILURE_TTL;
          log.error(
            `[spotify] unavailable, serving ${albums ? 'the last good list' : 'the fallback'}:`,
            describe(error)
          );
          return null;
        } finally {
          inflight = null;
        }
      })();
    }
    return inflight;
  }

  // Returns the albums, the last good list if refreshing failed, or null.
  async function getAlbums() {
    const t = now();
    if (albums && t < albumsExpiry) return albums;
    if (t < failedUntil) return albums;
    return (await refresh()) ?? albums;
  }

  return { getAlbums };
}
