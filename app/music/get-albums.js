import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

const clientId = process.env.SPOTIFY_CLIENT_ID;
console.log(clientId);
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

async function refreshAccessToken() {
  const authOptions = {
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization:
        'Basic ' +
        Buffer.from(clientId + ':' + clientSecret).toString('base64'),
    },
    data: `grant_type=refresh_token&refresh_token=${process.env.SPOTIFY_REFRESH_TOKEN}`,
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
    return response.data.items;
  } catch (error) {
    console.log(
      'Error obteniendo los álbumes favoritos:',
      error.response ? error.response.data : error.message
    );
    return null;
  }
}

export async function getFavoriteAlbumsSpecificData() {
  const favoriteAlbums = await getFavoriteAlbums();
  if (favoriteAlbums) {
    const albums = favoriteAlbums.map((album) => {
      return {
        name: album.album.name,
        url: album.album.external_urls.spotify,
        cover: album.album.images[0].url,
        artists: album.album.artists.map((artist) => artist.name).join(', '),
      };
    });
    return albums;
  }
}
