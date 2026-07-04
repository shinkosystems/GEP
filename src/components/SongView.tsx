// @sos-edit: false
import React, { useState, useEffect, useRef } from 'react';
import { Song } from '../data/songs';
import { transposeChord } from '../utils/music';
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
  
  // Estado para Gaveta Mobile (Bottom Sheet)
  const [activeSheet, setActiveSheet] = useState<MobileSheetType>('none');

  // Rolagem automática
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(2); // 1 a 5
  const scrollIntervalRef = useRef<number | null>(null);

  // Referências para o gesto de pinça (Pinch-to-Zoom)
  const cifraContainerRef = useRef<HTMLDivElement>(null);
  const touchStartDistRef = useRef<number | null>(null);
  const baseFontSizeRef = useRef<number>(16);

  // Sincroniza estado se a música mudar
  useEffect(() => {
    setTransposeLevel(0);
    setActiveSheet('none');
  }, [song]);

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
    setFontSize(prev => Math.min(Math.max(12, prev + amount), 40));
  };

  // Efeito para tratar o Gesto de Pinça (Pinch-to-Zoom) na Cifra
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
        e.preventDefault(); // Evita o zoom nativo do viewport inteiro

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
      if (line.trim() === '') {
        return <div key={lineIdx} style={{ height: '1.5em' }} aria-hidden="true" />;
      }

      if (line.startsWith('#') || (line.startsWith('(') && line.endsWith(')'))) {
        return <div key={lineIdx} className="comment-line">{line}</div>;
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
      
      {/* Barra superior de navegação da música */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
        <button 
          onClick={onBack}
          className="btn-ctrl"
          style={{ width: 'fit-content', padding: '10px 20px', gap: '8px' }}
          aria-label="Voltar para a lista de músicas"
        >
          ⬅️ Voltar ao Catálogo
        </button>
      </div>

      {/* Cabeçalho da Música */}
      <header style={{ marginTop: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{song.title}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginTop: '4px' }}>
          {song.artist} | Tom original: <strong style={{ color: 'var(--primary)' }}>{song.key}</strong>
        </p>
      </header>

      {/* Layout de Visualização Normal */}
      <div className="cifra-layout">
        
        {/* Coluna de Controles (Esquerda - Omitida no mobile) */}
        <aside className="sidebar-controls desktop-only-aside" aria-label="Controles de exibição e rolagem">
          <div className="control-group">
            <label>Tamanho do Texto</label>
            <div className="control-buttons">
              <button onClick={() => handleZoom(-2)} className="btn-ctrl" aria-label="Diminuir fonte">-</button>
              <button onClick={() => setFontSize(16)} className="btn-ctrl" aria-label="Restaurar tamanho padrão">A</button>
              <button onClick={() => handleZoom(2)} className="btn-ctrl" aria-label="Aumentar fonte">+</button>
            </div>
          </div>

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
                  style={{ width: '100%', accentColor: 'var(--primary)' }}
                />
              </div>
            )}
          </div>

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
          ref={cifraContainerRef}
          className="cifra-container" 
          style={{ fontSize: `${fontSize}px` }}
          aria-label="Letra e Cifra da Música"
        >
          {renderCifra()}
        </main>

        {/* Coluna de Diagramas de Teclado (Direita - Omitida no mobile) */}
        <aside className="chords-sidebar desktop-only-aside" aria-label="Diagramas dos acordes">
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
          <span className="icon">{hideChords ? '👀' : '🔇'}</span>
          <span>{hideChords ? 'Mostrar Cifras' : 'Sem Cifras'}</span>
        </button>

        <button 
          onClick={() => setActiveSheet(activeSheet === 'chords' ? 'none' : 'chords')} 
          className={`mobile-dock-btn ${activeSheet === 'chords' ? 'active' : ''}`}
          aria-label="Ver acordes no teclado"
        >
          <span className="icon">🎹</span>
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
              <h3>🎹 Acordes da Música</h3>
              <button className="bottom-sheet-close" onClick={() => setActiveSheet('none')} aria-label="Fechar gaveta">✕</button>
            </div>
            {uniqueChords.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>Sem acordes para exibir.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '55vh', overflowY: 'auto', paddingRight: '5px' }}>
                {uniqueChords.map(chord => (
                  <div key={chord} style={{ background: 'var(--bg-card-hover)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px 8px' }}>
                    <ChordDiagram chord={chord} />
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
