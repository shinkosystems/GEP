// @sos-edit: false
import { useState, useEffect } from 'react';
import { SongList } from './components/SongList';
import { SongView } from './components/SongView';
import { Song, SongBlock, SONG_BLOCKS } from './data/songs';

function App() {
  const [currentSongId, setCurrentSongId] = useState<string | null>(null);
  const [songBlocks, setSongBlocks] = useState<SongBlock[]>(() => {
    const saved = localStorage.getItem('gep_song_blocks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Erro ao carregar blocos de música salvos", e);
      }
    }
    return SONG_BLOCKS;
  });

  // Efeito para sincronizar o estado da música selecionada com a URL (Hash)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const songMatch = hash.match(/^#\/musica\/([^/]+)$/);
      
      if (songMatch) {
        setCurrentSongId(decodeURIComponent(songMatch[1]));
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
    ? songBlocks.flatMap(b => b.songs).find(s => s.id === currentSongId) || null
    : null;

  // Ao selecionar uma música, atualiza o hash da URL
  const handleSelectSong = (song: Song) => {
    window.location.hash = `#/musica/${song.id}`;
  };

  const handleUpdateSongBlocks = (newBlocks: SongBlock[]) => {
    setSongBlocks(newBlocks);
    localStorage.setItem('gep_song_blocks', JSON.stringify(newBlocks));
  };

  const handleResetSongBlocks = () => {
    if (window.confirm("Deseja mesmo restaurar a ordem padrão dos blocos e músicas?")) {
      setSongBlocks(SONG_BLOCKS);
      localStorage.removeItem('gep_song_blocks');
    }
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
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(12px)',
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
            <span style={{ fontFamily: 'var(--font-title)', fontWeight: 700, fontSize: '1.25rem', letterSpacing: '0.05em', color: 'var(--text-primary)' }}>
              GEP <span style={{ color: 'var(--primary)' }}>Cifras</span>
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
          <SongView song={currentSong} songBlocks={songBlocks} onBack={handleBack} />
        ) : (
          <SongList 
            songBlocks={songBlocks} 
            onSelectSong={handleSelectSong}
            onUpdateSongBlocks={handleUpdateSongBlocks}
            onResetSongBlocks={handleResetSongBlocks}
          />
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
