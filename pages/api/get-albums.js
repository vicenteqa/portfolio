import axios from 'axios';
import fallbackAlbums from '../../app/collection/music.json';
import { createAlbumsService } from '@/lib/albums';

const service = createAlbumsService({ http: axios });

const shuffle = (list) => [...list].sort(() => Math.random() - 0.5);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const albums = await service.getAlbums();
    // The fallback must not sit in a shared cache for an hour once Spotify is back.
    res.setHeader(
      'Cache-Control',
      albums ? 'public, s-maxage=3600, stale-while-revalidate=59' : 'public, s-maxage=60'
    );
    res.status(200).json(shuffle(albums || fallbackAlbums));
  } catch (error) {
    console.error('API Route Error:', error?.message);
    res.status(500).json({ error: 'Failed to fetch albums' });
  }
}
