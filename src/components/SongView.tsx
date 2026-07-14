// @sos-edit: false
import React, { useState, useEffect, useRef } from 'react';
import { Song, SongBlock } from '../data/songs';
import { transposeChord, isChord, isChordLine } from '../utils/music';
import { ChordDiagram } from './ChordDiagram';

interface SongViewProps {
  song: Song;
  songBlocks: SongBlock[];
  onBack: () => void;
}

type MobileSheetType = 'none' | 'tools' | 'chords';

export const SongView: React.FC<SongViewProps> = ({ song, songBlocks, onBack }) => {
  const [transposeLevel, setTransposeLevel] = useState(0);
  const [fontSize, setFontSize] = useState(16); // px
  const [hideChords, setHideChords] = useState(false);
  const [instrument, setInstrument] = useState<'teclado' | 'violao'>('teclado');
  
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
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [editingLineIdx, setEditingLineIdx] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');

  // Carrega as anotações do localStorage para a música atual
  useEffect(() => {
    const savedNotes = localStorage.getItem(`notes_${song.id}`);
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (e) {
        console.error("Erro ao carregar anotações", e);
        setNotes({});
      }
    } else {
      setNotes({});
    }
  }, [song]);

  useEffect(() => {
    setTransposeLevel(0);
    setActiveSheet('none');
    setEditingLineIdx(null);
    setEditingText('');
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
      } else if (e.key === 'ArrowRight' && isScrolling) {
        e.preventDefault();
        setScrollSpeed(prev => Math.min(5, prev + 1));
      } else if (e.key === 'ArrowLeft' && isScrolling) {
        e.preventDefault();
        setScrollSpeed(prev => Math.max(1, prev - 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isScrolling]);

  // Busca o bloco ao qual esta música pertence
  const currentBlock = songBlocks.find(b => b.songs.some(s => s.id === song.id));
  const blockSongs = currentBlock ? currentBlock.songs : [];
  const currentSongIdx = blockSongs.findIndex(s => s.id === song.id);
  
  const prevSong = currentSongIdx > 0 ? blockSongs[currentSongIdx - 1] : null;
  const nextSong = currentSongIdx < blockSongs.length - 1 ? blockSongs[currentSongIdx + 1] : null;

  // Busca o próximo bloco se este bloco foi finalizado
  const currentBlockIdx = songBlocks.findIndex(b => b.id === currentBlock?.id);
  const nextBlock = currentBlockIdx !== -1 && currentBlockIdx < songBlocks.length - 1 ? songBlocks[currentBlockIdx + 1] : null;
  const firstSongOfNextBlock = nextBlock && nextBlock.songs.length > 0 ? nextBlock.songs[0] : null;

  const handleNavigate = (songId: string) => {
    window.location.hash = `#/musica/${songId}`;
  };

  // Processa e extrai todos os acordes únicos da cifra para exibir diagramas
  const getUniqueChords = (): string[] => {
    const chords: string[] = [];
    const lines = song.content.trim().split('\n');

    for (const line of lines) {
      if (isChordLine(line)) {
        // Formato tradicional: extrai palavras que são acordes
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
        // Formato ChordPro: extrai o que estiver dentro de [ ]
        const regex = /\[([^\]]+)\]/g;
        let match;
        while ((match = regex.exec(line)) !== null) {
          const token = match[1];
          if (isChord(token)) {
            const transposed = transposeChord(token, transposeLevel);
            if (!chords.includes(transposed)) {
              chords.push(transposed);
            }
          }
        }
      }
    }
    return chords;
  };

  const handleSaveNote = (lineIdx: number) => {
    const updatedNotes = { ...notes };
    if (editingText.trim()) {
      updatedNotes[lineIdx] = editingText;
    } else {
      delete updatedNotes[lineIdx];
    }
    setNotes(updatedNotes);
    localStorage.setItem(`notes_${song.id}`, JSON.stringify(updatedNotes));
    setEditingLineIdx(null);
    setEditingText('');
  };

  const handleDeleteNote = (lineIdx: number) => {
    const updatedNotes = { ...notes };
    delete updatedNotes[lineIdx];
    setNotes(updatedNotes);
    localStorage.setItem(`notes_${song.id}`, JSON.stringify(updatedNotes));
  };

  // Renderiza a cifra dividida em linhas e segmentos (acordes + sílabas)
  const renderCifra = () => {
    const lines = song.content.trim().split('\n');

    return lines.map((line, lineIdx) => {
      if (line.trim() === '') {
        return <div key={lineIdx} style={{ height: '1.5em' }} aria-hidden="true" />;
      }

      let lineElement: React.ReactNode = null;

      if (line.startsWith('#') || (line.startsWith('(') && line.endsWith(')'))) {
        lineElement = <div className="comment-line">{line}</div>;
      } else if (isChordLine(line)) {
        if (hideChords) return null; // Oculta a linha de acordes se hideChords for true

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

        lineElement = (
          <div className="cifra-line" style={{ display: 'block', lineHeight: '1.5', fontFamily: 'var(--font-cifra)' }}>
            {elements}
          </div>
        );
      } else {
        // Caso 2: Formato ChordPro (cifras inline [Chord]letra)
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

        lineElement = (
          <div className="cifra-line" style={{ marginTop: hasChords && !hideChords ? '1.2em' : '0.2em' }}>
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
      }

      const hasNote = notes[lineIdx] !== undefined;
      const isEditing = editingLineIdx === lineIdx;

      return (
        <div key={lineIdx} className="cifra-line-wrapper">
          {!hasNote && !isEditing && (
            <button
              onClick={() => {
                setEditingLineIdx(lineIdx);
                setEditingText('');
              }}
              className="btn-add-note"
              title="Adicionar anotação"
              aria-label="Adicionar anotação"
            >
              ＋
            </button>
          )}

          {lineElement}

          {isEditing && (
            <div className="note-input-container">
              <input
                type="text"
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                placeholder="Escreva sua anotação..."
                className="note-input"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveNote(lineIdx);
                  } else if (e.key === 'Escape') {
                    setEditingLineIdx(null);
                  }
                }}
              />
              <button onClick={() => handleSaveNote(lineIdx)} className="btn-note-save">
                Salvar
              </button>
              <button onClick={() => setEditingLineIdx(null)} className="btn-note-cancel">
                Cancelar
              </button>
            </div>
          )}

          {hasNote && !isEditing && (
            <div className="note-box">
              <span 
                onClick={() => {
                  setEditingLineIdx(lineIdx);
                  setEditingText(notes[lineIdx]);
                }}
                style={{ cursor: 'pointer' }}
                title="Clique para editar"
              >
                📝 {notes[lineIdx]}
              </span>
              <button 
                onClick={() => handleDeleteNote(lineIdx)} 
                className="btn-note-delete"
                title="Excluir anotação"
                aria-label="Excluir anotação"
              >
                🗑️
              </button>
            </div>
          )}
        </div>
      );
    });
  };

  const uniqueChords = getUniqueChords();

  return (
    <div className="container" style={{ paddingBottom: '120px' }}>
      
      {/* Cabeçalho da Música com Navegação Unificada */}
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginTop: '24px',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '16px',
        gap: '16px',
        flexWrap: 'wrap'
      }}>
        {/* Esquerda: Título, Artista e Tom Original */}
        <div style={{ flex: '1 1 300px' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>{song.title}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginTop: '4px', margin: 0 }}>
            {song.artist} | Tom original: <strong style={{ color: 'var(--primary)' }}>{song.key}</strong>
          </p>
        </div>

        {/* Direita: Botões de Controle e Navegação */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button 
            onClick={onBack}
            className="btn-ctrl"
            style={{ width: 'fit-content', padding: '10px 16px', gap: '8px' }}
            aria-label="Voltar para a lista de músicas"
          >
            ⬅️ Voltar
          </button>

          {currentBlock && (
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <button
                onClick={() => prevSong && handleNavigate(prevSong.id)}
                className="btn-ctrl"
                disabled={!prevSong}
                style={{
                  opacity: prevSong ? 1 : 0.4,
                  cursor: prevSong ? 'pointer' : 'not-allowed',
                  padding: '10px 12px'
                }}
                aria-label="Música anterior do bloco"
              >
                ◀️ Anterior
              </button>
              <span style={{
                fontFamily: 'var(--font-title)',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                fontWeight: 600,
                padding: '0 4px',
                whiteSpace: 'nowrap'
              }}>
                {currentBlock.name} ({currentSongIdx + 1}/{blockSongs.length})
              </span>
              {nextSong ? (
                <button
                  onClick={() => handleNavigate(nextSong.id)}
                  className="btn-ctrl"
                  style={{ padding: '10px 12px', cursor: 'pointer' }}
                  aria-label="Próxima música do bloco"
                >
                  Próxima ▶️
                </button>
              ) : firstSongOfNextBlock ? (
                <button
                  onClick={() => handleNavigate(firstSongOfNextBlock.id)}
                  className="btn-ctrl active"
                  style={{
                    padding: '10px 12px',
                    cursor: 'pointer',
                    background: 'var(--primary)',
                    color: '#fff',
                    borderColor: 'var(--primary)'
                  }}
                  aria-label="Ir para a primeira música do próximo bloco"
                >
                  Próx. Bloco ➔
                </button>
              ) : (
                <button
                  className="btn-ctrl"
                  disabled
                  style={{ opacity: 0.4, cursor: 'not-allowed', padding: '10px 12px' }}
                  aria-label="Não há mais blocos ou músicas"
                >
                  Próxima ▶️
                </button>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Barra de Ajustes Horizontal (Desktop/Tablet) */}
      <section className="toolbar-controls desktop-only-aside" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '16px 24px',
        marginTop: '20px',
        boxShadow: 'var(--shadow-sm)',
        flexWrap: 'wrap'
      }} aria-label="Ajustes de cifragem">
        {/* Tamanho da Fonte */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Texto:</span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button onClick={() => handleZoom(-2)} className="btn-ctrl" style={{ padding: '6px 12px' }} aria-label="Diminuir fonte">-</button>
            <button onClick={() => setFontSize(16)} className="btn-ctrl" style={{ padding: '6px 12px' }} aria-label="Restaurar tamanho padrão">A</button>
            <button onClick={() => handleZoom(2)} className="btn-ctrl" style={{ padding: '6px 12px' }} aria-label="Aumentar fonte">+</button>
          </div>
        </div>

        {/* Tom / Transposição */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Tom:</span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button onClick={() => handleTranspose(-1)} className="btn-ctrl" style={{ padding: '6px 12px' }} aria-label="Diminuir meio tom">♭</button>
            <button 
              onClick={() => setTransposeLevel(0)} 
              className="btn-ctrl active" 
              style={{ padding: '6px 16px', minWidth: '80px' }}
              aria-label={`Tom atual transposto em ${transposeLevel} semitones`}
            >
              {transposeLevel === 0 ? 'Original' : `${transposeLevel > 0 ? '+' : ''}${transposeLevel}`}
            </button>
            <button onClick={() => handleTranspose(1)} className="btn-ctrl" style={{ padding: '6px 12px' }} aria-label="Aumentar meio tom">♯</button>
          </div>
        </div>

        {/* Rolagem Automática */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Rolagem:</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              onClick={() => setIsScrolling(!isScrolling)} 
              className={`btn-ctrl ${isScrolling ? 'active' : ''}`}
              style={{ padding: '6px 16px', gap: '8px', minWidth: '150px' }}
              aria-label={isScrolling ? 'Pausar rolagem automática' : 'Iniciar rolagem automática'}
            >
              {isScrolling ? '⏸️ Pausar (Espaço)' : '▶️ Rolar (Espaço)'}
            </button>
            {isScrolling && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Velocidade: {scrollSpeed}</span>
                <input 
                  type="range" 
                  min="1" 
                  max="5" 
                  value={scrollSpeed} 
                  onChange={(e) => setScrollSpeed(Number(e.target.value))} 
                  style={{ width: '80px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Seletor de Instrumento */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Instrumento:</span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button 
              onClick={() => setInstrument('teclado')} 
              className={`btn-ctrl ${instrument === 'teclado' ? 'active' : ''}`}
              style={{ padding: '6px 12px' }}
              aria-label="Visualizar acordes no teclado"
            >
              🎹 Teclado
            </button>
            <button 
              onClick={() => setInstrument('violao')} 
              className={`btn-ctrl ${instrument === 'violao' ? 'active' : ''}`}
              style={{ padding: '6px 12px' }}
              aria-label="Visualizar acordes no violão"
            >
              🎸 Violão
            </button>
          </div>
        </div>

        {/* Leitura Limpa */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Cifras:</span>
          <button 
            onClick={() => setHideChords(!hideChords)} 
            className={`btn-ctrl ${hideChords ? 'active' : ''}`}
            style={{ padding: '6px 16px' }}
            aria-label={hideChords ? 'Mostrar cifras' : 'Ocultar cifras para leitura pura'}
          >
            {hideChords ? '👀 Mostrar' : '🔇 Ocultar'}
          </button>
        </div>
      </section>

      {/* Layout de Cifra de Duas Colunas */}
      <div className="cifra-layout">
        
        {/* Coluna da Cifra (Centro/Esquerda) */}
        <main 
          ref={cifraContainerRef}
          className="cifra-container" 
          style={{ fontSize: `${fontSize}px` }}
          aria-label="Letra e Cifra da Música"
        >
          {renderCifra()}
        </main>

        {/* Coluna de Diagramas Sticky (Direita - Desktop apenas) */}
        <aside className="chords-sidebar desktop-only-aside" aria-label="Diagramas dos acordes">
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '12px' }}>
            {instrument === 'teclado' ? '🎹 Acordes no Teclado' : '🎸 Acordes no Violão'}
            <span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--text-muted)', marginLeft: '6px' }}>({uniqueChords.length})</span>
          </h2>
          <div className="chords-sidebar-scroll">
            {uniqueChords.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Sem acordes para exibir.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {uniqueChords.map(chord => (
                  <div key={chord} style={{ background: 'var(--bg-card-hover)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '8px 4px' }}>
                    <ChordDiagram chord={chord} instrument={instrument} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Grade completa de acordes abaixo da cifra — visível em todos os tamanhos */}
      {uniqueChords.length > 0 && (
        <section style={{
          marginTop: '40px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)'
        }} aria-label="Todos os acordes da música">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '20px', color: 'var(--text-primary)' }}>
            {instrument === 'teclado' ? '🎹' : '🎸'} Todos os Acordes
            <span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--text-muted)', marginLeft: '8px' }}>
              {uniqueChords.length} acorde{uniqueChords.length !== 1 ? 's' : ''} nesta música
            </span>
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: '16px'
          }}>
            {uniqueChords.map(chord => (
              <div key={chord} style={{
                background: 'var(--bg-card-hover)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '12px 8px'
              }}>
                <ChordDiagram chord={chord} instrument={instrument} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Botão de navegação para o próximo bloco */}
      {!nextSong && firstSongOfNextBlock && nextBlock && (
        <section style={{
          marginTop: '30px',
          background: 'linear-gradient(135deg, var(--primary-light) 0%, rgba(140, 102, 31, 0.15) 100%)',
          border: '1.5px solid var(--primary)',
          borderRadius: '16px',
          padding: '28px 24px',
          textAlign: 'center',
          boxShadow: 'var(--shadow-md)',
          animation: 'fadeIn 0.4s ease-out'
        }}>
          <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '8px' }}>🎉 Fim do Bloco!</span>
          <p style={{ color: 'var(--text-secondary)', margin: '0 0 16px 0', fontSize: '1rem' }}>
            Você finalizou as músicas do bloco <strong>{currentBlock?.name}</strong>.
          </p>
          <button
            onClick={() => handleNavigate(firstSongOfNextBlock.id)}
            className="btn-ctrl active"
            style={{
              padding: '12px 24px',
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: '10px',
              border: 'none',
              background: 'var(--primary)',
              color: '#fff',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(140, 102, 31, 0.3)',
              transition: 'transform 0.2s, background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.03)';
              e.currentTarget.style.background = 'var(--primary-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.background = 'var(--primary)';
            }}
          >
            Ir para o próximo bloco: <strong>{nextBlock.name}</strong> ➔
          </button>
        </section>
      )}

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
          aria-label={instrument === 'teclado' ? 'Ver acordes no teclado' : 'Ver acordes no violão'}
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

              {/* Instrumento Mobile */}
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
              <h3>{instrument === 'teclado' ? '🎹 Acordes da Música' : '🎸 Acordes no Violão'}</h3>
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
