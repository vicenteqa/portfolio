import axios from 'axios';

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

// Simple in-memory cache
let cachedToken = null;
let tokenExpiryTime = null;
let cachedAlbums = null;
let albumsExpiryTime = null;

async function refreshAccessToken() {
  // Return cached token if still valid
  if (cachedToken && tokenExpiryTime && Date.now() < tokenExpiryTime) {
    return { access_token: cachedToken };
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
    data: `grant_type=refresh_token&refresh_token=${process.env.SPOTIFY_REFRESH_TOKEN}`,
  };

  try {
    const response = await axios(authOptions);
    cachedToken = response.data.access_token;
    // Set expiry 5 minutes before actual expiry to be safe
    tokenExpiryTime = Date.now() + (response.data.expires_in - 300) * 1000;
    
    return {
      access_token: response.data.access_token,
      expires_in: response.data.expires_in,
    };
  } catch (error) {
    console.log(
      'Error refreshing access token:',
      error.response ? error.response.data : error.message
    );
    return null;
  }
}

async function getFavoriteAlbums() {
  const tokenData = await refreshAccessToken();
  if (!tokenData) {
    console.log('Could not get access token.');
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
      'Error getting favorite albums:',
      error.response ? error.response.data : error.message
    );
    return null;
  }
}

export async function getFavoriteAlbumsSpecificData() {
  // Check if we have fresh cached albums (cache for 1 hour)
  if (cachedAlbums && albumsExpiryTime && Date.now() < albumsExpiryTime) {
    // Return a shuffled slice of cached data to maintain the "discovery" feel
    return [...cachedAlbums].sort(() => Math.random() - 0.5).slice(0, 35);
  }

  const favoriteAlbums = await getFavoriteAlbums();
  
  if (favoriteAlbums) {
    const albums = favoriteAlbums.map((album) => {
      const cleanName = album.album.name.replace(/\s?\(.*?\)$/g, '').trim();

      return {
        id: album.album.id,
        name: cleanName,
        url: album.album.external_urls.spotify,
        cover: album.album.images[0].url,
        artists: album.album.artists.map((artist) => artist.name).join(', '),
      };
    });

    // Cache the processed albums for 1 hour
    cachedAlbums = albums;
    albumsExpiryTime = Date.now() + 60 * 60 * 1000;

    // Return shuffled slice
    return [...albums].sort(() => Math.random() - 0.5).slice(0, 35);
  }
  return null;
}

export default async function handler(req, res) {
  try {
    const albums = await getFavoriteAlbumsSpecificData();
    if (albums) {
      // Set browser cache for 1 hour, but allow revalidation
      res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=59');
      res.status(200).json(albums);
    } else {
      res.status(500).json({ error: 'Failed to load albums' });
    }
  } catch (error) {
    console.error('API Route Error:', error);
    res.status(500).json({ error: 'Failed to fetch albums' });
  }
}
