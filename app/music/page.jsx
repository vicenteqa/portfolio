'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { AlbumSkeleton } from '@/components/ui/skeleton';
import { FaMusic, FaSpotify } from 'react-icons/fa';

const SpotifyMusic = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const res = await fetch('/api/get-albums');
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to fetch albums');
        }
        const data = await res.json();

        if (Array.isArray(data)) {
          setAlbums(data);
        } else {
          console.error('Data received is not an array:', data);
          setError('Invalid data received from server.');
        }
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
      <div className="p-6 pb-12 min-h-screen">
        <div className="max-w-screen-xl mx-auto">
          {/* Header skeleton */}
          <div className="mb-8">
            <div className="h-10 w-48 bg-white/5 rounded-lg mb-4 animate-pulse"></div>
            <div className="h-4 w-full max-w-3xl bg-white/5 rounded mb-2 animate-pulse"></div>
            <div className="h-4 w-2/3 bg-white/5 rounded animate-pulse"></div>
          </div>

          {/* Album grid skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-8 md:gap-10 lg:gap-12 justify-items-center">
            {[...Array(35)].map((_, i) => (
              <AlbumSkeleton key={i} />
            ))}
          </div>

          {/* Loading indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="fixed bottom-8 right-8 flex items-center gap-3 px-6 py-3 bg-accent/20 backdrop-blur-xl border border-accent/30 rounded-full"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
            >
              <FaSpotify className="text-accent text-xl" />
            </motion.div>
            <span className="text-accent font-body text-sm font-medium">
              Loading vinyl collection...
            </span>
          </motion.div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="bg-error/10 border border-error/30 rounded-2xl p-8 max-w-md text-center">
          <div className="text-error text-5xl mb-4">
            <FaMusic />
          </div>
          <h2 className="text-2xl font-display font-bold text-error mb-3">
            Unable to Load Music
          </h2>
          <p className="text-white/60 font-body mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-error text-white font-display font-bold rounded-full hover:bg-error/80 transition-colors duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!Array.isArray(albums) || albums.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 max-w-md text-center">
          <div className="text-white/40 text-5xl mb-4">
            <FaMusic />
          </div>
          <h2 className="text-2xl font-display font-bold text-white mb-3">
            No Albums Found
          </h2>
          <p className="text-white/60 font-body">
            Unable to find any albums in your collection.
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 pb-12"
    >
      <div className="max-w-screen-xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 text-center xl:text-left"
        >
          <h1 className="text-4xl xl:text-5xl font-display font-bold mb-4 flex items-center gap-3 justify-center xl:justify-start">
            <FaSpotify className="text-accent" />
            <span className="text-white">Vinyl</span>{' '}
            <span className="text-accent">Collection</span>
          </h1>
          <p className="text-white/60 font-body text-lg max-w-3xl">
            Explore my personal vinyl collection mapped to Spotify! The albums
            displayed are pulled from the Spotify API, because few things reveal
            more about someone than the music they listen to.{' '}
            <span className="text-accent">Reload to discover even more!</span>
          </p>
        </motion.div>

        {/* Albums grid */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.03,
              },
            },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-8 md:gap-10 lg:gap-12 justify-items-center"
        >
          {albums.map((album, index) => (
            <motion.div
              key={album.id}
              variants={{
                hidden: { opacity: 0, y: 20, scale: 0.9 },
                show: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    duration: 0.4,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  },
                },
              }}
              className="relative group transform transition-all duration-300 hover:scale-105 hover:rotate-1 hover:z-10"
            >
              <a
                href={album.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="relative w-52 h-52 overflow-hidden rounded-xl shadow-lg border-2 border-white/5 group-hover:border-accent/50 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-accent/20">
                  <Image
                    src={album.cover}
                    alt={album.name}
                    width={200}
                    height={200}
                    className="object-cover w-full h-full transition-transform duration-500 transform group-hover:scale-110 group-hover:rotate-3"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <p className="text-sm font-display font-bold text-white mb-1 line-clamp-2">
                      {album.name}
                    </p>
                    <p className="text-xs font-body text-white/80 line-clamp-1">
                      {album.artists}
                    </p>
                  </div>
                  {/* Play icon overlay */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-50 group-hover:scale-100">
                    <div className="w-16 h-16 rounded-full bg-accent/90 backdrop-blur-sm flex items-center justify-center">
                      <FaSpotify className="text-primary text-2xl" />
                    </div>
                  </div>
                </div>
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SpotifyMusic;
