// Genera un SPOTIFY_REFRESH_TOKEN nuevo.
// Uso: node --env-file=.env scripts/get-spotify-token.mjs
// Requiere el Redirect URI http://127.0.0.1:4000/callback registrado en el dashboard (Spotify ya no acepta localhost).
import http from 'node:http';
import { randomBytes } from 'node:crypto';

const { SPOTIFY_CLIENT_ID: id, SPOTIFY_CLIENT_SECRET: secret } = process.env;
if (!id || !secret) {
  console.error('Faltan SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET en .env');
  process.exit(1);
}

const redirect = 'http://127.0.0.1:4000/callback';
const state = randomBytes(8).toString('hex');
const authUrl =
  'https://accounts.spotify.com/authorize?' +
  new URLSearchParams({
    client_id: id,
    response_type: 'code',
    redirect_uri: redirect,
    scope: 'user-library-read',
    state,
  });

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1:4000');
  if (url.pathname !== '/callback') return res.end();

  const code = url.searchParams.get('code');
  if (url.searchParams.get('state') !== state || !code) {
    res.end('Error: state o code invalido');
    console.error('Autorizacion fallida:', url.searchParams.get('error'));
    return server.close();
  }

  const r = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + Buffer.from(`${id}:${secret}`).toString('base64'),
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirect,
    }),
  });
  const data = await r.json();
  res.end(data.refresh_token ? 'Listo, vuelve a la terminal.' : 'Error, mira la terminal.');

  if (data.refresh_token) {
    console.log('\nSPOTIFY_REFRESH_TOKEN=' + data.refresh_token + '\n');
  } else {
    console.error('Error:', data);
  }
  server.close();
});

server.listen(4000, '127.0.0.1', () => {
  console.log('Abre esta URL en el navegador y acepta:\n\n' + authUrl + '\n');
});
