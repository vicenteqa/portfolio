'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import CrateDigger from '@/components/CrateDigger';
import GameShelf from '@/components/GameShelf';
import PageHeader from '@/components/PageHeader';
import { FaMusic, FaCompactDisc } from 'react-icons/fa';

const Header = () => (
  <PageHeader
    label="collection"
    className="!mb-6"
    intro="The records I listen to and the games I own. Few things say more about someone than that."
  >
    My <span className="text-accent">collection</span>
  </PageHeader>
);

const TABS = [
  { id: 'vinyl', label: 'vinyl' },
  { id: 'games', label: 'games' },
];

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
  const [tab, setTab] = useState('vinyl');

  // #games opens the games tab directly
  useEffect(() => {
    if (window.location.hash === '#games') setTab('games');
  }, []);

  const pick = (id) => {
    setTab(id);
    window.history.replaceState(null, '', id === 'vinyl' ? '/collection' : `/collection#${id}`);
  };

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

      <div role="tablist" aria-label="Collection" className="mb-8 flex border-b border-white/10 font-mono text-sm">
        {TABS.map((t) => (
          <button
            key={t.id}
            id={`tab-${t.id}`}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            aria-controls={`panel-${t.id}`}
            onClick={() => pick(t.id)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                const next = tab === 'vinyl' ? 'games' : 'vinyl';
                pick(next);
                document.getElementById(`tab-${next}`)?.focus();
              }
            }}
            tabIndex={tab === t.id ? 0 : -1}
            className={`-mb-px border-b-2 px-5 py-2.5 transition-colors ${
              tab === t.id
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-transparent text-white/50 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'games' && (
        <div role="tabpanel" id="panel-games" aria-labelledby="tab-games">
          <GameShelf />
        </div>
      )}

      {tab === 'vinyl' && (
        <div role="tabpanel" id="panel-vinyl" aria-labelledby="tab-vinyl">

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
        </div>
      )}
    </section>
  );
};

export default MusicPage;
