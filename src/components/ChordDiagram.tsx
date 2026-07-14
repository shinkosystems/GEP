// @sos-edit: false
import React from 'react';
import { getChordKeys, getGuitarChord } from '../utils/music';

interface ChordDiagramProps {
  chord: string;
  instrument: 'teclado' | 'violao';
}

export const ChordDiagram: React.FC<ChordDiagramProps> = ({ chord, instrument }) => {
  if (instrument === 'teclado') {
    // Duas oitavas completas — notas cromáticas com índice 0=C a 23=B
    const allNotes: { index: number; type: 'w' | 'b'; label: string }[] = [
      { index: 0,  type: 'w', label: 'C'  },
      { index: 1,  type: 'b', label: 'C#' },
      { index: 2,  type: 'w', label: 'D'  },
      { index: 3,  type: 'b', label: 'D#' },
      { index: 4,  type: 'w', label: 'E'  },
      { index: 5,  type: 'w', label: 'F'  },
      { index: 6,  type: 'b', label: 'F#' },
      { index: 7,  type: 'w', label: 'G'  },
      { index: 8,  type: 'b', label: 'G#' },
      { index: 9,  type: 'w', label: 'A'  },
      { index: 10, type: 'b', label: 'A#' },
      { index: 11, type: 'w', label: 'B'  },
      { index: 12, type: 'w', label: 'C'  },
      { index: 13, type: 'b', label: 'C#' },
      { index: 14, type: 'w', label: 'D'  },
      { index: 15, type: 'b', label: 'D#' },
      { index: 16, type: 'w', label: 'E'  },
      { index: 17, type: 'w', label: 'F'  },
      { index: 18, type: 'b', label: 'F#' },
      { index: 19, type: 'w', label: 'G'  },
      { index: 20, type: 'b', label: 'G#' },
      { index: 21, type: 'w', label: 'A'  },
      { index: 22, type: 'b', label: 'A#' },
      { index: 23, type: 'w', label: 'B'  },
    ];

    const activeKeys = getChordKeys(chord);

    const wW = 19;  // largura de cada tecla branca
    const wH = 72;  // altura das teclas brancas
    const bW = 11;  // largura de cada tecla preta
    const bH = 44;  // altura das teclas pretas
    const gap = 1;  // espaço entre teclas brancas
    const padX = 3; // padding horizontal

    const whiteKeys = allNotes.filter(n => n.type === 'w');
    const whitePositions: Record<number, number> = {};
    whiteKeys.forEach((key, i) => {
      whitePositions[key.index] = padX + i * (wW + gap);
    });

    const totalWidth = padX + whiteKeys.length * (wW + gap) + padX;
    const svgHeight = wH + 12;

    const blackKeys = allNotes.filter(n => n.type === 'b');

    const getBlackX = (blackIndex: number): number => {
      const prevWhite = allNotes.slice(0, blackIndex).reverse().find(n => n.type === 'w');
      const nextWhite = allNotes.slice(blackIndex + 1).find(n => n.type === 'w');
      if (!prevWhite || !nextWhite) return 0;
      const x1 = whitePositions[prevWhite.index] + wW;
      const x2 = whitePositions[nextWhite.index];
      return (x1 + x2) / 2 - bW / 2;
    };

    return (
      <div className="chord-diagram" style={{ textAlign: 'center' }} aria-label={`Diagrama de teclado para o acorde ${chord}`}>
        <div className="chord-name">{chord}</div>
        <svg
          width="100%"
          viewBox={`0 0 ${totalWidth} ${svgHeight}`}
          style={{ background: '#111827', borderRadius: '8px', display: 'block' }}
          aria-hidden="true"
        >
          {/* Teclas brancas — camada inferior */}
          {whiteKeys.map((key) => {
            const x = whitePositions[key.index];
            const isActive = activeKeys.includes(key.index);
            return (
              <g key={`w-${key.index}`}>
                <rect
                  x={x} y={3}
                  width={wW} height={wH}
                  fill={isActive ? '#F97316' : '#F9FAFC'}
                  stroke="#1F2937" strokeWidth="0.8" rx="2"
                />
                {isActive && (
                  <circle cx={x + wW / 2} cy={3 + wH - 9} r={4} fill="#fff" opacity={0.9} />
                )}
              </g>
            );
          })}

          {/* Teclas pretas — camada superior */}
          {blackKeys.map((key) => {
            const x = getBlackX(key.index);
            const isActive = activeKeys.includes(key.index);
            return (
              <g key={`b-${key.index}`}>
                <rect
                  x={x} y={3}
                  width={bW} height={bH}
                  fill={isActive ? '#FB923C' : '#111827'}
                  stroke="#374151" strokeWidth="0.8" rx="1.5"
                />
                {isActive && (
                  <circle cx={x + bW / 2} cy={3 + bH - 7} r={3} fill="#fff" opacity={0.9} />
                )}
              </g>
            );
          })}
        </svg>
      </div>
    );

    const frets = getGuitarChord(chord);
    
    let maxFret = 0;
    let minFret = 99;
    frets.forEach(f => {
      if (f > 0) {
        if (f > maxFret) maxFret = f;
        if (f < minFret) minFret = f;
      }
    });

    const baseFret = maxFret <= 4 ? 1 : minFret;

    const xCoords = [25, 43, 61, 79, 97, 115];
    const width = 140;
    const height = 100;

    return (
      <div className="chord-diagram" style={{ textAlign: 'center' }} aria-label={`Diagrama de violão para o acorde ${chord}`}>
        <div className="chord-name">{chord}</div>
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ background: '#0B132B', borderRadius: '8px', padding: '5px', margin: '0 auto', display: 'block' }}>
          {baseFret === 1 ? (
            <line x1={xCoords[0]} y1={25} x2={xCoords[5]} y2={25} stroke="#FFF" strokeWidth="4" />
          ) : (
            <line x1={xCoords[0]} y1={25} x2={xCoords[5]} y2={25} stroke="#4A5568" strokeWidth="2" />
          )}

          {xCoords.map((x, idx) => (
            <line key={idx} x1={x} y1={25} x2={x} y2={85} stroke="#4A5568" strokeWidth="1.5" />
          ))}

          {[1, 2, 3, 4].map((fretIdx) => {
            const y = 25 + fretIdx * 15;
            return <line key={fretIdx} x1={xCoords[0]} y1={y} x2={xCoords[5]} y2={y} stroke="#4A5568" strokeWidth="1.5" />;
          })}

          {baseFret > 1 && (
            <text x="6" y="37" fill="#E2E8F0" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
              {baseFret}ª
            </text>
          )}

          {frets.map((fretVal, stringIdx) => {
            if (fretVal > 0) {
              const cx = xCoords[stringIdx];
              const fretOffset = fretVal - baseFret;
              if (fretOffset >= 0 && fretOffset < 4) {
                const cy = 25 + fretOffset * 15 + 7.5;
                return (
                  <circle
                    key={stringIdx}
                    cx={cx}
                    cy={cy}
                    r="5"
                    fill="#F97316"
                    stroke="#FFF"
                    strokeWidth="1"
                  />
                );
              }
            }
            return null;
          })}

          {frets.map((fretVal, stringIdx) => {
            const cx = xCoords[stringIdx];
            if (fretVal === 0) {
              return (
                <circle
                  key={`open-${stringIdx}`}
                  cx={cx}
                  cy={12}
                  r="3"
                  fill="none"
                  stroke="#22C55E"
                  strokeWidth="1.5"
                />
              );
            } else if (fretVal === -1) {
              return (
                <g key={`mute-${stringIdx}`}>
                  <line x1={cx - 3} y1={9} x2={cx + 3} y2={15} stroke="#EF4444" strokeWidth="1.5" />
                  <line x1={cx + 3} y1={9} x2={cx - 3} y2={15} stroke="#EF4444" strokeWidth="1.5" />
                </g>
              );
            }
            return null;
          })}
        </svg>
      </div>
    );
  }
};
