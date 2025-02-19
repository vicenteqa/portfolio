import axios from 'axios';

const clientId = process.env.SPOTIFY_CLIENT_ID;
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

  const albumsUrl = 'https://api.spotify.com/v1/me/albums?limit=50';
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
  favoriteAlbums.map((album) => {
    if (album.album.name.toLowerCase().includes('remaste')) {
    }
  });
  if (favoriteAlbums) {
    const shuffledAlbums = favoriteAlbums.sort(() => Math.random() - 0.5);

    const albums = shuffledAlbums.slice(0, 35).map((album) => {
      const cleanName = album.album.name.replace(/\s?\(.*?\)$/g, '').trim();

      return {
        id: album.album.id,
        name: cleanName,
        url: album.album.external_urls.spotify,
        cover: album.album.images[0].url,
        artists: album.album.artists.map((artist) => artist.name).join(', '),
      };
    });

    return albums;
  }
}

export default async function handler(req, res) {
  try {
    const albums = await getFavoriteAlbumsSpecificData();
    if (albums) {
      res.status(200).json(albums);
    } else {
      res.status(500).json({ error: 'Failed to load albums' });
    }
  } catch (error) {
    console.error('API Route Error:', error);
    res.status(500).json({ error: 'Failed to fetch albums' });
  }
}
