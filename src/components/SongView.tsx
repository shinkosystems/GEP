// @sos-edit: false
import React, { useState, useEffect, useRef } from 'react';
import { Song, SONG_BLOCKS } from '../data/songs';
import { transposeChord, isChord, isChordLine } from '../utils/music';
import { ChordDiagram } from './ChordDiagram';

interface SongViewProps {
  song: Song;
  onBack: () => void;
}

type MobileSheetType = 'none' | 'tools' | 'chords';

export const SongView: React.FC<SongViewProps> = ({ song, onBack }) => {
  const [transposeLevel, setTransposeLevel] = useState(0);
  const [fontSize, setFontSize] = useState(16); // px
  const [hideChords, setHideChords] = useState(false);
  const [instrument, setInstrument] = useState<'teclado' | 'violao'>('teclado');
  
  const [activeSheet, setActiveSheet] = useState<MobileSheetType>('none');

  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(2); // 1 a 5
  const scrollIntervalRef = useRef<number | null>(null);

  const cifraContainerRef = useRef<HTMLDivElement>(null);
  const touchStartDistRef = useRef<number | null>(null);
  const baseFontSizeRef = useRef<number>(16);

  useEffect(() => {
    setTransposeLevel(0);
    setActiveSheet('none');
  }, [song]);

  const handleTranspose = (amount: number) => {
    setTransposeLevel(prev => {
      const next = prev + amount;
      if (next < -12) return -12;
      if (next > 12) return 12;
      return next;
    });
  };

  const handleZoom = (amount: number) => {
    setFontSize(prev => Math.min(Math.max(12, prev + amount), 40));
  };

  useEffect(() => {
    const container = cifraContainerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
        touchStartDistRef.current = dist;
        baseFontSizeRef.current = fontSize;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && touchStartDistRef.current !== null) {
        e.preventDefault();

        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const currentDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);

        const scale = currentDist / touchStartDistRef.current;
        let newSize = Math.round(baseFontSizeRef.current * scale);

        newSize = Math.max(12, Math.min(40, newSize));
        setFontSize(newSize);
      }
    };

    const handleTouchEnd = () => {
      touchStartDistRef.current = null;
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);
    container.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [fontSize]);

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

  const currentBlock = SONG_BLOCKS.find(b => b.songs.some(s => s.id === song.id));
  const blockSongs = currentBlock ? currentBlock.songs : [];
  const currentSongIdx = blockSongs.findIndex(s => s.id === song.id);
  
  const prevSong = currentSongIdx > 0 ? blockSongs[currentSongIdx - 1] : null;
  const nextSong = currentSongIdx < blockSongs.length - 1 ? blockSongs[currentSongIdx + 1] : null;

  const handleNavigate = (songId: string) => {
    window.location.hash = `#/musica/${songId}`;
  };

  const getUniqueChords = (): string[] => {
    const chords: string[] = [];
    const lines = song.content.trim().split('\n');

    for (const line of lines) {
      if (isChordLine(line)) {
        const tokens = line.trim().split(/\s+/);
        for (const token of tokens) {
          if (isChord(token)) {
            const transposed = transposeChord(token, transposeLevel);
            if (!chords.includes(transposed)) {
              chords.push(transposed);
            }
          }
        }
      } else {
        const regex = /\[([^\]]+)\]/g;
        let match;
        while ((match = regex.exec(line)) !== null) {
          const transposed = transposeChord(match[1], transposeLevel);
          if (!chords.includes(transposed)) {
            chords.push(transposed);
          }
        }
      }
    }
    return chords;
  };

  const renderCifra = () => {
    const lines = song.content.trim().split('\n');

    return lines.map((line, lineIdx) => {
      if (line.trim() === '') {
        return <div key={lineIdx} style={{ height: '1.5em' }} aria-hidden="true" />;
      }

      if (line.startsWith('#') || (line.startsWith('(') && line.endsWith(')'))) {
        return <div key={lineIdx} className="comment-line">{line}</div>;
      }

      if (isChordLine(line)) {
        if (hideChords) return null;

        const regex = /\S+/g;
        let match;
        const lineChords: { token: string; startIndex: number; length: number }[] = [];
        
        while ((match = regex.exec(line)) !== null) {
          lineChords.push({
            token: match[0],
            startIndex: match.index,
            length: match[0].length
          });
        }

        const elements: React.ReactNode[] = [];
        let lastRealEndIndex = 0;
        let lastOriginalEndIndex = 0;

        lineChords.forEach((item, idx) => {
          const gap = item.startIndex - lastOriginalEndIndex;
          if (gap > 0) {
            const adjustedGap = item.startIndex - lastRealEndIndex;
            if (adjustedGap > 0) {
              elements.push(
                <span key={`space-${idx}`} className="cifra-text" style={{ whiteSpace: 'pre' }}>
                  {' '.repeat(adjustedGap)}
                </span>
              );
              lastRealEndIndex += adjustedGap;
            }
          }

          const isTokenChord = isChord(item.token);
          const content = isTokenChord ? transposeChord(item.token, transposeLevel) : item.token;

          elements.push(
            <span 
              key={`chord-${idx}`} 
              className={isTokenChord ? "cifra-chord" : "comment-line"} 
              style={{ position: 'static', display: 'inline', fontWeight: isTokenChord ? 'bold' : 'normal' }}
            >
              {content}
            </span>
          );

          lastRealEndIndex += content.length;
          lastOriginalEndIndex = item.startIndex + item.length;
        });

        return (
          <div key={lineIdx} className="cifra-line" style={{ display: 'block', lineHeight: '1.5', fontFamily: 'var(--font-cifra)' }}>
            {elements}
          </div>
        );
      }

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
          segmentRegex.lastIndex++;
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
    <div className="container" style={{ paddingBottom: '120px' }}>
      
      {/* Container de Cabeçalho Sticky para que nada seja coberto durante o scroll */}
      <div className="sticky-song-header-container">
        
        {/* Row 1: Título e Botões na mesma row */}
        <div className="song-title-row">
          <div>
            <h1 className="song-title-text">{song.title}</h1>
            <p className="song-subtitle-text">
              {song.artist} | Tom original: <strong style={{ color: 'var(--primary)' }}>{song.key}</strong>
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button 
              onClick={onBack}
              className="btn-ctrl-sm"
              style={{ display: 'flex', gap: '6px', alignItems: 'center' }}
              aria-label="Voltar para a lista de músicas"
            >
              ⬅️ Voltar
            </button>

            {currentBlock && (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  onClick={() => prevSong && handleNavigate(prevSong.id)}
                  className="btn-ctrl-sm"
                  disabled={!prevSong}
                  style={{ opacity: prevSong ? 1 : 0.4, cursor: prevSong ? 'pointer' : 'not-allowed' }}
                  aria-label="Música anterior do bloco"
                >
                  ◀️ Anterior
                </button>
                <span style={{
                  fontFamily: 'var(--font-title)',
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  fontWeight: 600,
                  padding: '0 4px'
                }}>
                  {currentBlock.name} ({currentSongIdx + 1}/{blockSongs.length})
                </span>
                <button
                  onClick={() => nextSong && handleNavigate(nextSong.id)}
                  className="btn-ctrl-sm"
                  disabled={!nextSong}
                  style={{
                    opacity: nextSong ? 1 : 0.4,
                    cursor: nextSong ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    lineHeight: '1.1',
                    padding: '2px 12px',
                    height: '36px'
                  }}
                  aria-label="Próxima música do bloco"
                >
                  <span>Próxima</span>
                  <span style={{ fontSize: '0.75rem' }}>▶️</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Row 2: Container de tom e afins (embaixo da row do título) */}
        <div className="song-controls-row">
          {/* TEXTO */}
          <div className="control-item-inline">
            <span className="control-label-inline">TEXTO:</span>
            <div className="btn-group-inline">
              <button onClick={() => handleZoom(-2)} className="btn-ctrl-sm">-</button>
              <button onClick={() => setFontSize(16)} className="btn-ctrl-sm">A</button>
              <button onClick={() => handleZoom(2)} className="btn-ctrl-sm">+</button>
            </div>
          </div>

          {/* TOM */}
          <div className="control-item-inline">
            <span className="control-label-inline">TOM:</span>
            <div className="btn-group-inline">
              <button onClick={() => handleTranspose(-1)} className="btn-ctrl-sm">♭</button>
              <button 
                onClick={() => setTransposeLevel(0)} 
                className="btn-ctrl-sm active"
                style={{ minWidth: '70px' }}
              >
                {transposeLevel === 0 ? 'Original' : `${transposeLevel > 0 ? '+' : ''}${transposeLevel}`}
              </button>
              <button onClick={() => handleTranspose(1)} className="btn-ctrl-sm">♯</button>
            </div>
          </div>

          {/* ROLAGEM (Botão de Start do Scroll no topo da página) */}
          <div className="control-item-inline">
            <span className="control-label-inline">ROLAGEM:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button 
                onClick={() => setIsScrolling(!isScrolling)} 
                className={`btn-ctrl-sm ${isScrolling ? 'active' : ''}`}
                style={{ minWidth: '130px' }}
              >
                {isScrolling ? '⏸️ Pausar (Espaço)' : '▶️ Rolar (Espaço)'}
              </button>
              {isScrolling && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Velocidade: {scrollSpeed}</span>
                  <input 
                    type="range" 
                    min="1" 
                    max="5" 
                    value={scrollSpeed} 
                    onChange={(e) => setScrollSpeed(Number(e.target.value))} 
                    style={{ width: '80px', accentColor: 'var(--primary)' }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* INSTRUMENTO */}
          <div className="control-item-inline">
            <span className="control-label-inline">INSTRUMENTO:</span>
            <div className="btn-group-inline">
              <button 
                onClick={() => setInstrument('teclado')} 
                className={`btn-ctrl-sm ${instrument === 'teclado' ? 'active' : ''}`}
              >
                🎹 Teclado
              </button>
              <button 
                onClick={() => setInstrument('violao')} 
                className={`btn-ctrl-sm ${instrument === 'violao' ? 'active' : ''}`}
              >
                🎸 Violão
              </button>
            </div>
          </div>

          {/* CIFRAS */}
          <div className="control-item-inline">
            <span className="control-label-inline">CIFRAS:</span>
            <button 
              onClick={() => setHideChords(!hideChords)} 
              className={`btn-ctrl-sm ${hideChords ? 'active' : ''}`}
              style={{ display: 'flex', gap: '6px', alignItems: 'center' }}
            >
              {hideChords ? '👁️ Mostrar' : '🚫 Ocultar'}
            </button>
          </div>
        </div>
      </div>

      {/* Layout de Visualização Principal */}
      <div className="cifra-layout">
        
        {/* Coluna da Cifra (Centro) */}
        <main 
          ref={cifraContainerRef}
          className="cifra-container" 
          style={{ fontSize: `${fontSize}px` }}
          aria-label="Letra e Cifra da Música"
        >
          {renderCifra()}
        </main>

        {/* Coluna de Diagramas de Acordes (Direita - Omitida no mobile) */}
        <aside className="chords-sidebar desktop-only-aside" aria-label="Diagramas dos acordes">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            {instrument === 'teclado' ? '🎹 Acordes no Teclado' : '🎸 Acordes no Violão'}
          </h2>
          {uniqueChords.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '12px' }}>Sem acordes para exibir.</p>
          ) : (
            <div className="chords-grid" style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '16px' }}>
              {uniqueChords.map(chord => (
                <div key={chord} style={{ background: 'var(--bg-card-hover)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '12px 6px' }}>
                  <ChordDiagram chord={chord} instrument={instrument} />
                </div>
              ))}
            </div>
          )}
        </aside>
      </div>

      {/* ==========================================================================
         RECURSOS E ELEMENTOS MOBILE (BARRA DE NAVEGAÇÃO E GAVETAS DESLIZANTES)
         ========================================================================== */}
      <nav className="mobile-dock" aria-label="Menu rápido mobile">
        <button 
          onClick={() => setActiveSheet(activeSheet === 'tools' ? 'none' : 'tools')} 
          className={`mobile-dock-btn ${activeSheet === 'tools' ? 'active' : ''}`}
          aria-label="Ajustes de tom e tamanho"
        >
          <span className="icon">⚙️</span>
          <span>Ajustes</span>
        </button>

        <button 
          onClick={() => setIsScrolling(!isScrolling)} 
          className={`mobile-dock-btn ${isScrolling ? 'active' : ''}`}
          aria-label={isScrolling ? 'Pausar rolagem automática' : 'Iniciar rolagem automática'}
        >
          <span className="icon">{isScrolling ? '⏸️' : '▶️'}</span>
          <span>{isScrolling ? 'Pausar' : 'Rolar'}</span>
        </button>

        <button 
          onClick={() => setHideChords(!hideChords)} 
          className={`mobile-dock-btn ${hideChords ? 'active' : ''}`}
          aria-label={hideChords ? 'Mostrar cifras' : 'Ocultar cifras'}
        >
          <span className="icon">{hideChords ? '👁️' : '🚫'}</span>
          <span>{hideChords ? 'Mostrar Cifras' : 'Sem Cifras'}</span>
        </button>

        <button 
          onClick={() => setActiveSheet(activeSheet === 'chords' ? 'none' : 'chords')} 
          className={`mobile-dock-btn ${activeSheet === 'chords' ? 'active' : ''}`}
          aria-label="Ver acordes"
        >
          <span className="icon">{instrument === 'teclado' ? '🎹' : '🎸'}</span>
          <span>Acordes ({uniqueChords.length})</span>
        </button>
      </nav>

      {/* Gaveta de Ajustes/Ferramentas Mobile */}
      {activeSheet === 'tools' && (
        <>
          <div className="bottom-sheet-backdrop" onClick={() => setActiveSheet('none')} />
          <div className="bottom-sheet" role="dialog" aria-modal="true" aria-label="Painel de Ajustes">
            <div className="bottom-sheet-header">
              <h3>Ajustes de Exibição</h3>
              <button className="bottom-sheet-close" onClick={() => setActiveSheet('none')} aria-label="Fechar painel">✕</button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Tamanho da Fonte */}
              <div className="control-group">
                <label>Tamanho do Texto ({fontSize}px)</label>
                <div className="control-buttons">
                  <button onClick={() => handleZoom(-2)} className="btn-ctrl" style={{ padding: '12px' }}>- Diminuir</button>
                  <button onClick={() => setFontSize(16)} className="btn-ctrl" style={{ padding: '12px' }}>Restaurar (16px)</button>
                  <button onClick={() => handleZoom(2)} className="btn-ctrl" style={{ padding: '12px' }}>+ Aumentar</button>
                </div>
              </div>

              {/* Tom / Transposição */}
              <div className="control-group">
                <label>Tom / Transposição</label>
                <div className="control-buttons">
                  <button onClick={() => handleTranspose(-1)} className="btn-ctrl" style={{ padding: '12px' }}>♭ Baixar Meio Tom</button>
                  <button 
                    onClick={() => setTransposeLevel(0)} 
                    className="btn-ctrl active" 
                    style={{ padding: '12px', flex: 1.2 }}
                  >
                    {transposeLevel === 0 ? 'Original' : `${transposeLevel > 0 ? '+' : ''}${transposeLevel}`}
                  </button>
                  <button onClick={() => handleTranspose(1)} className="btn-ctrl" style={{ padding: '12px' }}>♯ Subir Meio Tom</button>
                </div>
              </div>

              {/* Instrumento */}
              <div className="control-group">
                <label>Instrumento</label>
                <div className="control-buttons">
                  <button 
                    onClick={() => setInstrument('teclado')} 
                    className={`btn-ctrl ${instrument === 'teclado' ? 'active' : ''}`}
                    style={{ padding: '12px' }}
                  >
                    🎹 Teclado
                  </button>
                  <button 
                    onClick={() => setInstrument('violao')} 
                    className={`btn-ctrl ${instrument === 'violao' ? 'active' : ''}`}
                    style={{ padding: '12px' }}
                  >
                    🎸 Violão
                  </button>
                </div>
              </div>

              {/* Velocidade de Rolagem */}
              <div className="control-group">
                <label>Velocidade de Rolagem ({scrollSpeed})</label>
                <input 
                  type="range" 
                  min="1" 
                  max="5" 
                  value={scrollSpeed} 
                  onChange={(e) => setScrollSpeed(Number(e.target.value))} 
                  style={{ width: '100%', height: '10px', accentColor: 'var(--primary)', marginTop: '8px' }}
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Gaveta de Acordes Mobile */}
      {activeSheet === 'chords' && (
        <>
          <div className="bottom-sheet-backdrop" onClick={() => setActiveSheet('none')} />
          <div className="bottom-sheet" role="dialog" aria-modal="true" aria-label="Gaveta de Acordes">
            <div className="bottom-sheet-header">
              <h3>{instrument === 'teclado' ? '🎹 Acordes no Teclado' : '🎸 Acordes no Violão'}</h3>
              <button className="bottom-sheet-close" onClick={() => setActiveSheet('none')} aria-label="Fechar gaveta">✕</button>
            </div>
            {uniqueChords.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>Sem acordes para exibir.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '55vh', overflowY: 'auto', paddingRight: '5px' }}>
                {uniqueChords.map(chord => (
                  <div key={chord} style={{ background: 'var(--bg-card-hover)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px 8px' }}>
                    <ChordDiagram chord={chord} instrument={instrument} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
