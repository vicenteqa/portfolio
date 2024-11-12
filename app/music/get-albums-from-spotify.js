import 'dotenv/config';
import axios from 'axios';

// Carga las credenciales desde .env
const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

// Endpoint de Spotify para solicitar el token
const tokenUrl = 'https://accounts.spotify.com/api/token';
// Endpoint para obtener los álbumes favoritos
const albumsUrl = 'https://api.spotify.com/v1/me/albums';

const redirectUri = 'http://localhost:3000/callback';
const scopes = 'user-library-read';

const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirectUri)}`;

console.log(`Visita esta URL para autorizar la aplicación: ${authUrl}`);

const express = require('express');
const app = express();
const port = 3000;

app.get('/callback', (req, res) => {
  const code = req.query.code;
  console.log(`Authorization code: ${code}`);
  res.send('Authorization code received. You can now close this window.');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Función para obtener el token de acceso
async function getAccessToken(code) {
  const authOptions = {
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization:
        'Basic ' +
        Buffer.from(clientId + ':' + clientSecret).toString('base64'),
    },
    data: `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(redirectUri)}`,
  };

  try {
    const response = await axios(authOptions);
    console.log('Token de acceso:', response.data.access_token);
    return response.data.access_token;
  } catch (error) {
    console.log('Error obteniendo el token de acceso:', error.response.data);
    return null;
  }
}

// Función para obtener los álbumes favoritos
async function getFavoriteAlbums() {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    console.log('No se pudo obtener el token de acceso.');
    return;
  }

  try {
    const response = await axios.get(albumsUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log(response);

    const albums = response.data.items;
    albums.forEach((item) => {
      const album = item.album;
      console.log(`Nombre: ${album.name}, Artista: ${album.artists[0].name}`);
    });
  } catch (error) {
    console.log(`Error: ${error}`);
  }
}

// Llama a la función
getFavoriteAlbums();
