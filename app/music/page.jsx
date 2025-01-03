'use client';

import React, { useEffect, useState } from 'react';
import { getFavoriteAlbumsSpecificData } from './get-albums.js';
import { ClipLoader } from 'react-spinners';
import Image from 'next/image';

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
      <div className="flex justify-center items-center min-h-screen">
        <ClipLoader size={50} color={'#123abc'} loading={loading} />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <div className="max-w-screen-xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 md:mb-3 lg:mb-4 text-left">
          Music
        </h1>
        <p className="text-white/60 mb-8">
          Explore my personal vinyl collection mapped to Spotify! The albums
          displayed are pulled from the Spotify API. Reload to discover even
          more!
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
          {albums.map((album) => (
            <div
              key={album.id}
              className="relative group transform transition-transform hover:scale-105 hover:rotate-1"
            >
              <a
                href={album.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="relative w-52 h-52 overflow-hidden rounded-lg shadow-lg">
                  <Image
                    src={album.cover}
                    alt={album.name}
                    width={200}
                    height={200}
                    className="object-cover w-full h-full transition-transform transform group-hover:scale-110 group-hover:rotate-3"
                  />
                  {/* Text and background overlay visible only on hover */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-sm font-semibold">{album.name}</p>
                    <p className="text-xs">{album.artists}</p>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpotifyMusic;
