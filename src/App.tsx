// @sos-edit: false
import { useState, useEffect } from 'react';
import { SongList } from './components/SongList';
import { SongView } from './components/SongView';
import { Song, SONG_BLOCKS } from './data/songs';

function App() {
  const [currentSongId, setCurrentSongId] = useState<string | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const songMatch = hash.match(/^#\/musica\/([a-zA-Z0-9_-]+)$/);

      if (songMatch) {
        setCurrentSongId(songMatch[1]);
      } else {
        setCurrentSongId(null);
      }
    };

    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const currentSong = currentSongId
    ? SONG_BLOCKS.flatMap(b => b.songs).find(s => s.id === currentSongId) || null
    : null;

  const handleSelectSong = (song: Song) => {
    window.location.hash = `#/musica/${song.id}`;
  };

  const handleBack = () => {
    window.location.hash = '';
  };

  return (
    <div>
      {/* Cabeçalho Fixo do App */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid var(--border-color)',
        padding: '12px 0'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div
            onClick={handleBack}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
            role="button"
            tabIndex={0}
            aria-label="Ir para página inicial"
            onKeyDown={(e) => { if (e.key === 'Enter') handleBack(); }}
          >
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fff',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <span style={{ fontSize: '1.4rem' }}>🎧</span>
            </div>
            <span style={{ fontFamily: 'var(--font-title)', fontWeight: 700, fontSize: '1.25rem', color: 'var(--text-primary)' }}>
              Queluzito <span style={{ color: 'var(--primary)' }}>Musical</span>
            </span>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Acessível & Responsivo</span>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main style={{ minHeight: 'calc(100vh - 120px)' }}>
        {currentSong ? (
          <SongView song={currentSong} onBack={handleBack} />
        ) : (
          <SongList songBlocks={SONG_BLOCKS} onSelectSong={handleSelectSong} />
        )}
      </main>

      {/* Rodapé */}
      <footer style={{
        backgroundColor: '#070a10',
        borderTop: '1px solid var(--border-color)',
        padding: '24px 0',
        textAlign: 'center',
        fontSize: '0.85rem',
        color: 'var(--text-muted)'
      }}>
        <div className="container">
          <p>© {new Date().getFullYear()} Queluzito Musical. Desenvolvido para acessibilidade musical.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
