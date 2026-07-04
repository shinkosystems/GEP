// @sos-edit: false
import React from 'react';
import { SONG_BLOCKS, Song } from '../data/songs';

interface SongListProps {
  onSelectSong: (song: Song) => void;
}

export const SongList: React.FC<SongListProps> = ({ onSelectSong }) => {
  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      {/* Hero Section */}
      <section style={{ textAlign: 'center', padding: '60px 0 40px', borderBottom: '1px solid var(--border-color)' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 700, background: 'linear-gradient(135deg, #F97316 0%, #FDBA74 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '16px' }}>
          GEP Cifras
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
          Aplicativo acessível para estudo de blocos musicais e cifras de Tim e Vanessa. Escolha uma música abaixo para ver a letra, acordes e diagramas de teclado.
        </p>
      </section>

      {/* Grid de Blocos */}
      <main style={{ marginTop: '40px' }} aria-label="Lista de Blocos e Músicas">
        <h2 style={{ fontSize: '1.8rem', fontWeight: 600, marginBottom: '24px' }}>📁 Blocos Musicais</h2>
        
        <div className="block-grid">
          {SONG_BLOCKS.map(block => (
            <section key={block.id} className="block-card" aria-labelledby={`title-${block.id}`}>
              <h3 id={`title-${block.id}`}>{block.name}</h3>
              <ul className="block-songs-list">
                {block.songs.map(song => (
                  <li key={song.id}>
                    <button
                      onClick={() => onSelectSong(song)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-primary)',
                        textAlign: 'left',
                        width: '100%',
                        cursor: 'pointer',
                        padding: '6px 8px',
                        borderRadius: '6px',
                        fontSize: '1rem',
                        fontWeight: 500,
                        transition: 'background var(--transition-fast), color var(--transition-fast)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--primary-light)';
                        e.currentTarget.style.color = 'var(--primary)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'none';
                        e.currentTarget.style.color = 'var(--text-primary)';
                      }}
                      aria-label={`Ver cifra de ${song.title} por ${song.artist}`}
                    >
                      🎵 {song.title}
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
};
