import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const app = express();
const port = 4000;

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const redirectUri = `http://localhost:${port}/callback`;
const scopes = 'user-library-read';

const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirectUri)}`;

console.log(`Visita esta URL para autorizar la aplicación: ${authUrl}`);

app.get('/callback', async (req, res) => {
  const code = req.query.code;
  console.log(`Authorization code: ${code}`);

  try {
    const tokenData = await getAccessToken(code);
    if (tokenData) {
      fs.writeFileSync('refresh_token.txt', tokenData.refresh_token);
      res.send(
        'Authorization code received and access token obtained. You can now close this window.'
      );
      console.log('Token de acceso:', tokenData.access_token);
      console.log('Token de actualización:', tokenData.refresh_token);
    } else {
      res.send('Failed to obtain access token.');
    }
  } catch (error) {
    res.send('Error obtaining access token.');
  }
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
    return {
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
      expires_in: response.data.expires_in,
    };
  } catch (error) {
    console.log(
      'Error obteniendo el token de acceso:',
      error.response ? error.response.data : error.message
    );
    return null;
  }
}

// Función para refrescar el token de acceso
async function refreshAccessToken() {
  let refreshToken;
  try {
    refreshToken = fs.readFileSync('refresh_token.txt', 'utf8');
  } catch (err) {
    console.error('No se pudo leer el archivo refresh_token.txt:', err);
    return null;
  }

  const authOptions = {
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization:
        'Basic ' +
        Buffer.from(clientId + ':' + clientSecret).toString('base64'),
    },
    data: `grant_type=refresh_token&refresh_token=${refreshToken}`,
  };

  try {
    const response = await axios(authOptions);
    return {
      access_token: response.data.access_token,
      expires_in: response.data.expires_in,
    };
  } catch (error) {
    console.log(
      'Error refrescando el token de acceso:',
      error.response ? error.response.data : error.message
    );
    return null;
  }
}

// Función para obtener los álbumes favoritos
async function getFavoriteAlbums() {
  const tokenData = await refreshAccessToken();
  if (!tokenData) {
    console.log('No se pudo obtener el token de acceso.');
    return;
  }

  const albumsUrl = 'https://api.spotify.com/v1/me/albums';
  const options = {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
    },
  };

  try {
    const response = await axios.get(albumsUrl, options);
    console.log('Álbumes favoritos:', response.data.items);
    return response.data.items;
  } catch (error) {
    console.log(
      'Error obteniendo los álbumes favoritos:',
      error.response ? error.response.data : error.message
    );
    return null;
  }
}

// Llama a la función para obtener los álbumes favoritos
getFavoriteAlbums().then((albums) => {
  if (albums) {
    albums.forEach((album) => {
      console.log(
        `Álbum: ${album.album.name}, Portada: ${album.album.images[0].url}`
      );
    });
  }
});
