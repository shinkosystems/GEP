// @sos-edit: false
import React from 'react';
import { getChordKeys, getGuitarChord } from '../utils/music';

interface ChordDiagramProps {
  chord: string;
  instrument: 'teclado' | 'violao';
}

export const ChordDiagram: React.FC<ChordDiagramProps> = ({ chord, instrument }) => {
  if (instrument === 'teclado') {
    const whiteKeys = [
      { index: 0, label: 'C' },
      { index: 2, label: 'D' },
      { index: 4, label: 'E' },
      { index: 5, label: 'F' },
      { index: 7, label: 'G' },
      { index: 9, label: 'A' },
      { index: 11, label: 'B' },
      { index: 12, label: 'C' },
      { index: 14, label: 'D' },
      { index: 16, label: 'E' },
      { index: 17, label: 'F' },
      { index: 19, label: 'G' },
      { index: 21, label: 'A' },
      { index: 23, label: 'B' }
    ];

    const blackKeys = [
      { index: 1, x: 18 },  // C#
      { index: 3, x: 42 },  // D#
      { index: 6, x: 80 },  // F#
      { index: 8, x: 104 }, // G#
      { index: 10, x: 128 },// A#
      { index: 13, x: 168 },// C#
      { index: 15, x: 192 },// D#
      { index: 18, x: 230 },// F#
      { index: 20, x: 254 },// G#
      { index: 22, x: 278 } // A#
    ];

    const activeKeys = getChordKeys(chord);

    const whiteWidth = 22;
    const whiteHeight = 80;
    const blackWidth = 12;
    const blackHeight = 48;

    return (
      <div className="chord-diagram" style={{ textAlign: 'center' }} aria-label={`Diagrama de teclado para o acorde ${chord}`}>
        <div className="chord-name">{chord}</div>
        <svg width="250" height="90" viewBox="0 0 310 90" style={{ background: '#111827', borderRadius: '8px', padding: '5px', margin: '0 auto', display: 'block' }}>
          {whiteKeys.map((key, idx) => {
            const x = idx * (whiteWidth + 1) + 2;
            const isActive = activeKeys.includes(key.index);
            return (
              <g key={key.index}>
                <rect
                  x={x}
                  y={2}
                  width={whiteWidth}
                  height={whiteHeight}
                  fill={isActive ? '#F97316' : '#F9FAFC'}
                  stroke="#0B0F19"
                  strokeWidth="1"
                  rx="2"
                />
                {isActive && (
                  <circle
                    cx={x + whiteWidth / 2}
                    cy={whiteHeight - 12}
                    r="4.5"
                    fill="#FFF"
                  />
                )}
              </g>
            );
          })}

          {blackKeys.map((key) => {
            const isActive = activeKeys.includes(key.index);
            const x = key.x;
            return (
              <g key={key.index}>
                <rect
                  x={x}
                  y={2}
                  width={blackWidth}
                  height={blackHeight}
                  fill={isActive ? '#FB923C' : '#1F2937'}
                  stroke="#0B0F19"
                  strokeWidth="1"
                  rx="1"
                />
                {isActive && (
                  <circle
                    cx={x + blackWidth / 2}
                    cy={blackHeight - 8}
                    r="3"
                    fill="#FFF"
                  />
                )}
              </g>
            );
          })}
        </svg>
      </div>
    );
  } else {
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
