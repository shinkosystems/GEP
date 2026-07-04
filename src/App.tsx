// @sos-edit: false
import { useState } from 'react';
import { SongList } from './components/SongList';
import { SongView } from './components/SongView';
import { Song } from './data/songs';

function App() {
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);

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
            onClick={() => setSelectedSong(null)} 
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
            role="button"
            tabIndex={0}
            aria-label="Ir para página inicial"
            onKeyDown={(e) => { if (e.key === 'Enter') setSelectedSong(null); }}
          >
            <span style={{ fontSize: '1.75rem' }}>🎹</span>
            <span style={{ fontFamily: 'var(--font-title)', fontWeight: 700, fontSize: '1.25rem', letterSpacing: '0.05em' }}>
              GEP <span style={{ color: 'var(--primary)' }}>CIFRAS</span>
            </span>
          </div>
          
          <div style={{ display: 'flex', gap: '16px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <span>Acessível & Responsivo</span>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main style={{ minHeight: 'calc(100vh - 120px)' }}>
        {selectedSong ? (
          <SongView song={selectedSong} onBack={() => setSelectedSong(null)} />
        ) : (
          <SongList onSelectSong={setSelectedSong} />
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
