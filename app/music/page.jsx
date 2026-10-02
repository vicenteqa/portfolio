'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import CrateDigger from '@/components/CrateDigger';
import PageHeader from '@/components/PageHeader';
import { FaMusic, FaCompactDisc } from 'react-icons/fa';

const Header = () => (
  <PageHeader
    label="music"
    className="!mb-2"
    intro="Explore my personal vinyl collection! Few things reveal more about someone than the music they listen to. Reload to discover even more!"
  >
    Vinyl <span className="text-accent">collection</span>
  </PageHeader>
);

const Notice = ({ icon: Icon, title, children, action }) => (
  <div className="flex flex-col items-center justify-center py-16">
    <div className="rounded-md border border-white/10 bg-primary/60 p-8 max-w-md text-center">
      <div className="text-white/30 text-5xl mb-4 flex justify-center">
        <Icon />
      </div>
      <h2 className="text-2xl font-display font-bold text-white mb-3">{title}</h2>
      <p className="text-white/60 mb-2">{children}</p>
      {action}
    </div>
  </div>
);

const MusicPage = () => {
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

  return (
    <section className="container mx-auto pb-12">
      <Header />

      {loading && (
        <div className="flex flex-col items-center py-16" aria-busy="true">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
            className="text-accent text-5xl"
          >
            <FaCompactDisc />
          </motion.div>
          <p className="mt-5 font-mono text-sm text-white/50">
            flipping through the crate<span className="animate-blink">_</span>
          </p>
        </div>
      )}

      {!loading && error && (
        <Notice
          icon={FaMusic}
          title="Unable to load music"
          action={
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-3 rounded bg-error/90 text-ink font-mono text-sm font-medium hover:bg-error transition-colors"
            >
              Try again
            </button>
          }
        >
          {error}
        </Notice>
      )}

      {!loading && !error && albums.length === 0 && (
        <Notice icon={FaMusic} title="No albums found">
          The crate is empty.
        </Notice>
      )}

      {!loading && !error && albums.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CrateDigger albums={albums} />
        </motion.div>
      )}
    </section>
  );
};

export default MusicPage;
