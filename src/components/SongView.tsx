// @sos-edit: false
import React, { useState, useEffect, useRef } from 'react';
import { Song } from '../data/songs';
import { transposeChord } from '../utils/music';
import { ChordDiagram } from './ChordDiagram';

interface SongViewProps {
  song: Song;
  onBack: () => void;
}

export const SongView: React.FC<SongViewProps> = ({ song, onBack }) => {
  const [transposeLevel, setTransposeLevel] = useState(0);
  const [fontSize, setFontSize] = useState(16); // px
  const [hideChords, setHideChords] = useState(false);
  
  // Rolagem automática
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(2); // 1 a 5
  const scrollIntervalRef = useRef<number | null>(null);

  // Transpor tom em semitones
  const handleTranspose = (amount: number) => {
    setTransposeLevel(prev => {
      const next = prev + amount;
      if (next < -12) return -12;
      if (next > 12) return 12;
      return next;
    });
  };

  // Zoom de fonte
  const handleZoom = (amount: number) => {
    setFontSize(prev => Math.min(Math.max(12, prev + amount), 32));
  };

  // Controle de rolagem automática
  useEffect(() => {
    if (isScrolling) {
      const intervalTime = 100 / scrollSpeed;
      scrollIntervalRef.current = window.setInterval(() => {
        window.scrollBy({ top: 1, behavior: 'auto' });
      }, intervalTime);
    } else {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
        scrollIntervalRef.current = null;
      }
    }

    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }, [isScrolling, scrollSpeed]);

  // Atalhos de Teclado Acessíveis
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 's' || e.key === 'S' || e.key === ' ') {
        e.preventDefault();
        setIsScrolling(prev => !prev);
      } else if (e.key === '+') {
        e.preventDefault();
        handleZoom(2);
      } else if (e.key === '-') {
        e.preventDefault();
        handleZoom(-2);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Processa e extrai todos os acordes únicos da cifra para exibir diagramas
  const getUniqueChords = (): string[] => {
    const regex = /\[([^\]]+)\]/g;
    const chords: string[] = [];
    let match;
    while ((match = regex.exec(song.content)) !== null) {
      const transposed = transposeChord(match[1], transposeLevel);
      if (!chords.includes(transposed)) {
        chords.push(transposed);
      }
    }
    return chords;
  };

  // Renderiza a cifra dividida em linhas e segmentos (acordes + sílabas)
  const renderCifra = () => {
    const lines = song.content.trim().split('\n');

    return lines.map((line, lineIdx) => {
      // Se a linha for vazia
      if (line.trim() === '') {
        return <div key={lineIdx} style={{ height: '1.5em' }} aria-hidden="true" />;
      }

      // Se for uma linha de comentário (geralmente começa com # ou entre parênteses)
      if (line.startsWith('#') || (line.startsWith('(') && line.endsWith(')'))) {
        return <div key={lineIdx} className="comment-line">{line}</div>;
      }

      // Separa os blocos [Acorde]Texto
      // Regex para capturar tudo
      const segments: { chord: string; text: string }[] = [];
      const segmentRegex = /(?:\[([^\]]+)\])?([^\[]*)/g;
      let match;
      let hasChords = false;

      while ((match = segmentRegex.exec(line)) !== null) {
        const chord = match[1] || '';
        const text = match[2] || '';
        
        if (chord || text) {
          segments.push({
            chord: chord ? transposeChord(chord, transposeLevel) : '',
            text
          });
          if (chord) hasChords = true;
        }
        if (segmentRegex.lastIndex === match.index) {
          segmentRegex.lastIndex++; // Previne loop infinito
        }
      }

      return (
        <div key={lineIdx} className="cifra-line" style={{ marginTop: hasChords && !hideChords ? '1.2em' : '0.2em' }}>
          {segments.map((seg, segIdx) => (
            <span key={segIdx} className="cifra-segment">
              {seg.chord && !hideChords && (
                <span className="cifra-chord" aria-hidden="true">
                  {seg.chord}
                </span>
              )}
              <span className="cifra-text">{seg.text}</span>
            </span>
          ))}
        </div>
      );
    });
  };

  const uniqueChords = getUniqueChords();

  return (
    <div className="container" style={{ paddingBottom: '80px' }}>
      {/* Botão Voltar */}
      <button 
        onClick={onBack}
        className="btn-ctrl"
        style={{ width: 'fit-content', marginTop: '20px', padding: '10px 20px', gap: '8px' }}
        aria-label="Voltar para a lista de músicas"
      >
        ⬅️ Voltar ao Catálogo
      </button>

      {/* Cabeçalho da Música */}
      <header style={{ marginTop: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{song.title}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginTop: '4px' }}>
          {song.artist} | Tom original: <strong style={{ color: 'var(--primary)' }}>{song.key}</strong>
        </p>
      </header>

      {/* Layout Principal da Página */}
      <div className="cifra-layout">
        
        {/* Coluna de Controles (Esquerda) */}
        <aside className="sidebar-controls" aria-label="Controles de exibição e rolagem">
          {/* Zoom da Fonte */}
          <div className="control-group">
            <label>Tamanho do Texto</label>
            <div className="control-buttons">
              <button onClick={() => handleZoom(-2)} className="btn-ctrl" aria-label="Diminuir fonte">-</button>
              <button onClick={() => setFontSize(16)} className="btn-ctrl" aria-label="Restaurar tamanho padrão">A</button>
              <button onClick={() => handleZoom(2)} className="btn-ctrl" aria-label="Aumentar fonte">+</button>
            </div>
          </div>

          {/* Transposição de Tom */}
          <div className="control-group">
            <label>Tom / Afinação</label>
            <div className="control-buttons">
              <button onClick={() => handleTranspose(-1)} className="btn-ctrl" aria-label="Diminuir meio tom">♭</button>
              <button 
                onClick={() => setTransposeLevel(0)} 
                className="btn-ctrl active" 
                style={{ flex: 1.5 }}
                aria-label={`Tom atual transposto em ${transposeLevel} semitones`}
              >
                {transposeLevel === 0 ? 'Original' : `${transposeLevel > 0 ? '+' : ''}${transposeLevel}`}
              </button>
              <button onClick={() => handleTranspose(1)} className="btn-ctrl" aria-label="Aumentar meio tom">♯</button>
            </div>
          </div>

          {/* Rolagem Automática */}
          <div className="control-group">
            <label>Rolagem Auto</label>
            <button 
              onClick={() => setIsScrolling(!isScrolling)} 
              className={`btn-ctrl ${isScrolling ? 'active' : ''}`}
              aria-label={isScrolling ? 'Pausar rolagem automática' : 'Iniciar rolagem automática'}
            >
              {isScrolling ? '⏸️ Pausar (Espaço)' : '▶️ Rolar (Espaço)'}
            </button>
            {isScrolling && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Velocidade: {scrollSpeed}</label>
                <input 
                  type="range" 
                  min="1" 
                  max="5" 
                  value={scrollSpeed} 
                  onChange={(e) => setScrollSpeed(Number(e.target.value))} 
                  aria-label="Ajustar velocidade de rolagem"
                  style={{ width: '100%', accentColor: 'var(--primary)' }}
                />
              </div>
            )}
          </div>

          {/* Acessibilidade: Ocultar cifras */}
          <div className="control-group">
            <label>Leitura Limpa</label>
            <button 
              onClick={() => setHideChords(!hideChords)} 
              className={`btn-ctrl ${hideChords ? 'active' : ''}`}
              aria-label={hideChords ? 'Mostrar cifras' : 'Ocultar cifras para leitura pura'}
            >
              {hideChords ? '👀 Mostrar Cifras' : '🔇 Ocultar Cifras'}
            </button>
          </div>
        </aside>

        {/* Coluna da Cifra (Centro) */}
        <main 
          className="cifra-container" 
          style={{ fontSize: `${fontSize}px` }}
          aria-label="Letra e Cifra da Música"
        >
          {renderCifra()}
        </main>

        {/* Coluna de Diagramas de Teclado (Direita) */}
        <aside className="chords-sidebar" aria-label="Diagramas dos acordes">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
            🎹 Acordes no Teclado
          </h2>
          {uniqueChords.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '12px' }}>Sem acordes para exibir.</p>
          ) : (
            <div className="chords-grid" style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '16px' }}>
              {uniqueChords.map(chord => (
                <div key={chord} style={{ background: 'var(--bg-card-hover)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '12px 6px' }}>
                  <ChordDiagram chord={chord} />
                </div>
              ))}
            </div>
          )}
        </aside>

      </div>
    </div>
  );
};
