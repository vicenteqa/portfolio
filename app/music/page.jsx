'use client';

import React, { useEffect, useState } from 'react';
import { getFavoriteAlbumsSpecificData } from './get-albums.js';
import { ClipLoader } from 'react-spinners';

const SpotifyMusic = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const data = await getFavoriteAlbumsSpecificData();
        setAlbums(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbums();
  }, []);

  if (loading) {
    return (
      <div className="spinner-container">
        <ClipLoader size={50} color={'#123abc'} loading={loading} />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Álbumes Favoritos</h1>
      <ul>
        {albums.map((album) => (
          <li key={album.href}>
            <a href={album.href} target="_blank" rel="noopener noreferrer">
              <img src={album.cover_image} alt={album.name} />
              <p>{album.name}</p>
              <p>{album.artists}</p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SpotifyMusic;
