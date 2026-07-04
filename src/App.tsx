// @sos-edit: false
import { useState, useEffect } from 'react';
import { SongList } from './components/SongList';
import { SongView } from './components/SongView';
import { Song, SONG_BLOCKS } from './data/songs';

function App() {
  const [currentSongId, setCurrentSongId] = useState<string | null>(null);

  // Efeito para sincronizar o estado da música selecionada com a URL (Hash)
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

  // Encontra a música ativa com base no ID da URL
  const currentSong = currentSongId
    ? SONG_BLOCKS.flatMap(b => b.songs).find(s => s.id === currentSongId) || null
    : null;

  // Ao selecionar uma música, atualiza o hash da URL
  const handleSelectSong = (song: Song) => {
    window.location.hash = `#/musica/${song.id}`;
  };

  // Ao voltar, limpa o hash
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
        backgroundColor: 'rgba(11, 15, 25, 0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-color)',
        padding: '16px 0'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div 
            onClick={handleBack} 
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
            role="button"
            tabIndex={0}
            aria-label="Ir para página inicial"
            onKeyDown={(e) => { if (e.key === 'Enter') handleBack(); }}
          >
            <span style={{ fontSize: '1.75rem' }}>🎹</span>
            <span style={{ fontFamily: 'var(--font-title)', fontWeight: 700, fontSize: '1.25rem', letterSpacing: '0.05em' }}>
              GEP <span style={{ color: 'var(--primary)' }}>CIFRAS</span>
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
          <p>© {new Date().getFullYear()} GEP Cifras. Desenvolvido para acessibilidade musical.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
