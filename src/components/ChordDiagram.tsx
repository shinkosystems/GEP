// @sos-edit: false
import React from 'react';
import { getChordKeys } from '../utils/music';

interface ChordDiagramProps {
  chord: string;
}

export const ChordDiagram: React.FC<ChordDiagramProps> = ({ chord }) => {
  // Teclas brancas representadas por suas notas (duas oitavas)
  // Total 14 teclas brancas
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

  // Teclas pretas e suas posições horizontais relativas (x do centro da tecla)
  // Total 10 teclas pretas
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

  // Tamanhos das teclas no SVG
  const whiteWidth = 22;
  const whiteHeight = 80;
  const blackWidth = 12;
  const blackHeight = 48;

  return (
    <div className="chord-diagram" style={{ textAlign: 'center' }} aria-label={`Diagrama de teclado para o acorde ${chord}`}>
      <div className="chord-name">{chord}</div>
      <svg width="310" height="90" viewBox="0 0 310 90" style={{ background: '#111827', borderRadius: '8px', padding: '5px' }}>
        {/* Renderiza as teclas brancas */}
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
              {/* Marcações adicionais nas tônicas ativas */}
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

        {/* Renderiza as teclas pretas por cima */}
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
};
