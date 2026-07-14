// @sos-edit: false

// Notas cromáticas naturais (sustenidos) e seus equivalentes bemóis
export const NOTES_SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
export const NOTES_FLAT  = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

// Mapeador de notas bemóis para índices cromáticos
const FLAT_MAP: { [key: string]: number } = {
  'Db': 1, 'Eb': 3, 'Gb': 6, 'Ab': 8, 'Bb': 10
};

// Retorna o índice cromático de qualquer nota
export function getNoteIndex(note: string): number {
  if (FLAT_MAP[note] !== undefined) {
    return FLAT_MAP[note];
  }
  return NOTES_SHARP.indexOf(note);
}

// Transpõe um acorde completo pelo número de semitones fornecido
export function transposeChord(chord: string, semitones: number): string {
  if (semitones === 0) return chord;

  // Regex para isolar o Tom Principal, Acidentais, a qualidade do Acorde (m7, sus4, etc.) e o Baixo
  const chordRegex = /^([A-G])(#|b)?([^/]*)(?:\/([A-G])(#|b)?)?$/;
  const match = chord.match(chordRegex);

  if (!match) return chord;

  const [_, rootNote, rootAccidental = '', quality, bassNote, bassAccidental = ''] = match;

  const fullRoot = rootNote + rootAccidental;
  const rootIndex = getNoteIndex(fullRoot);
  
  if (rootIndex === -1) return chord;

  // Calcula nova nota fundamental
  const newRootIndex = (rootIndex + semitones + 12) % 12;
  const useFlat = rootAccidental === 'b' || (rootAccidental === '' && ['F'].includes(rootNote) && semitones < 0);
  let newRoot = useFlat ? NOTES_FLAT[newRootIndex] : NOTES_SHARP[newRootIndex];

  let newBass = '';
  if (bassNote) {
    const fullBass = bassNote + bassAccidental;
    const bassIndex = getNoteIndex(fullBass);
    if (bassIndex !== -1) {
      const newBassIndex = (bassIndex + semitones + 12) % 12;
      const useFlatBass = bassAccidental === 'b';
      newBass = '/' + (useFlatBass ? NOTES_FLAT[newBassIndex] : NOTES_SHARP[newBassIndex]);
    }
  }

  return newRoot + quality + newBass;
}

// Dicionário de formas de acordes de piano (posições relativas de teclas a partir da tônica)
export const CHORD_SHAPES: { [key: string]: number[] } = {
  '': [0, 4, 7],         // Maior
  'm': [0, 3, 7],        // Menor
  '7': [0, 4, 7, 10],    // Sétima dominante
  'm7': [0, 3, 7, 10],   // Sétima menor
  'maj7': [0, 4, 7, 11], // Sétima maior
  'M7': [0, 4, 7, 11],
  'sus4': [0, 5, 7],     // Quarta suspensa
  'sus2': [0, 2, 7],     // Segunda suspensa
  'dim': [0, 3, 6],      // Diminuto
  '9': [0, 4, 7, 10, 14], // Nona
  'm9': [0, 3, 7, 10, 14],
  '6': [0, 4, 7, 9],     // Sexta
  'm6': [0, 3, 7, 9],
  'add9': [0, 4, 7, 14],
  '5': [0, 7]            // Power chord
};

// Retorna os semitones absolutos de um acorde para destacar no teclado (duas oitavas, de C a B)
export function getChordKeys(chord: string): number[] {
  const chordRegex = /^([A-G])(#|b)?([^/]*)/;
  const match = chord.match(chordRegex);
  if (!match) return [];

  const [_, rootNote, rootAccidental = '', quality] = match;
  const rootIndex = getNoteIndex(rootNote + rootAccidental);

  if (rootIndex === -1) return [];

  let intervals = CHORD_SHAPES[''];
  const cleanQuality = quality.trim();
  if (CHORD_SHAPES[cleanQuality] !== undefined) {
    intervals = CHORD_SHAPES[cleanQuality];
  } else if (cleanQuality.startsWith('m')) {
    intervals = CHORD_SHAPES['m'];
  }

  const keys = intervals.map(interval => {
    return (rootIndex + interval) % 24;
  });

  const bassMatch = chord.match(/\/([A-G])(#|b)?$/);
  if (bassMatch) {
    const bassIndex = getNoteIndex(bassMatch[1] + (bassMatch[2] || ''));
    if (bassIndex !== -1) {
      if (!keys.includes(bassIndex)) {
        keys.push(bassIndex);
      }
    }
  }

  return keys;
}

// Banco de dados de acordes abertos/básicos de violão
// Posição das cordas: da 6ª (Mi grave) para a 1ª (Mi aguda)
export const GUITAR_CHORDS_DB: { [key: string]: number[] } = {
  'C': [-1, 3, 2, 0, 1, 0],
  'C#': [-1, 4, 3, 1, 2, 1],
  'Db': [-1, 4, 3, 1, 2, 1],
  'D': [-1, -1, 0, 2, 3, 2],
  'D#': [-1, -1, 1, 3, 4, 3],
  'Eb': [-1, -1, 1, 3, 4, 3],
  'E': [0, 2, 2, 1, 0, 0],
  'F': [1, 3, 3, 2, 1, 1],
  'F#': [2, 4, 4, 3, 2, 2],
  'Gb': [2, 4, 4, 3, 2, 2],
  'G': [3, 2, 0, 0, 0, 3],
  'G#': [4, 6, 6, 5, 4, 4],
  'Ab': [4, 6, 6, 5, 4, 4],
  'A': [-1, 0, 2, 2, 2, 0],
  'A#': [-1, 1, 3, 3, 3, 1],
  'Bb': [-1, 1, 3, 3, 3, 1],
  'B': [-1, 2, 4, 4, 4, 2],

  'Cm': [-1, 3, 5, 5, 4, 3],
  'C#m': [-1, 4, 6, 6, 5, 4],
  'Dbm': [-1, 4, 6, 6, 5, 4],
  'Dm': [-1, -1, 0, 2, 3, 1],
  'D#m': [-1, -1, 1, 3, 4, 2],
  'Ebm': [-1, -1, 1, 3, 4, 2],
  'Em': [0, 2, 2, 0, 0, 0],
  'Fm': [1, 3, 3, 1, 1, 1],
  'F#m': [2, 4, 4, 2, 2, 2],
  'Gbm': [2, 4, 4, 2, 2, 2],
  'Gm': [3, 5, 5, 3, 3, 3],
  'G#m': [4, 6, 6, 4, 4, 4],
  'Abm': [4, 6, 6, 4, 4, 4],
  'Am': [-1, 0, 2, 2, 1, 0],
  'A#m': [-1, 1, 3, 3, 2, 1],
  'Bbm': [-1, 1, 3, 3, 2, 1],
  'Bm': [-1, 2, 4, 4, 3, 2],

  'C7': [-1, 3, 2, 3, 1, 0],
  'D7': [-1, -1, 0, 2, 1, 2],
  'E7': [0, 2, 0, 1, 0, 0],
  'F7': [1, 3, 1, 2, 1, 1],
  'G7': [3, 2, 0, 0, 0, 1],
  'A7': [-1, 0, 2, 0, 2, 0],
  'B7': [-1, 2, 1, 2, 0, 2],

  'Cm7': [-1, 3, 5, 3, 4, 3],
  'C#m7': [-1, 4, 6, 4, 5, 4],
  'Dbm7': [-1, 4, 6, 4, 5, 4],
  'Dm7': [-1, -1, 0, 2, 1, 1],
  'Em7': [0, 2, 0, 0, 0, 0],
  'Fm7': [1, 3, 1, 1, 1, 1],
  'F#m7': [2, 4, 2, 2, 2, 2],
  'Gbm7': [2, 4, 2, 2, 2, 2],
  'Gm7': [3, 5, 3, 3, 3, 3],
  'Am7': [-1, 0, 2, 0, 1, 0],
  'Bm7': [-1, 2, 4, 2, 3, 2],

  'Cmaj7': [-1, 3, 2, 0, 0, 0],
  'Dmaj7': [-1, -1, 0, 2, 2, 2],
  'Emaj7': [0, 2, 1, 1, 0, 0],
  'Fmaj7': [-1, 3, 3, 2, 1, 0],
  'Gmaj7': [3, 2, 0, 0, 0, 2],
  'Amaj7': [-1, 0, 2, 1, 2, 0],
  'Bmaj7': [-1, 2, 4, 3, 4, 2],

  'Csus4': [-1, 3, 3, 0, 1, 1],
  'Dsus4': [-1, -1, 0, 2, 3, 3],
  'Esus4': [0, 2, 2, 2, 0, 0],
  'Gsus4': [3, 3, 0, 0, 1, 3],
  'Asus4': [-1, 0, 2, 2, 3, 0],

  'Csus2': [-1, 3, 0, 0, 3, 3],
  'Dsus2': [-1, -1, 0, 2, 3, 0],
  'Esus2': [0, 2, 4, 1, 0, 0],
  'Asus2': [-1, 0, 2, 2, 0, 0],
};

// Retorna as posições de violão para o acorde
export function getGuitarChord(chord: string): number[] {
  const baseChord = chord.split('/')[0].trim();

  if (GUITAR_CHORDS_DB[baseChord]) {
    return GUITAR_CHORDS_DB[baseChord];
  }

  const match = baseChord.match(/^([A-G])(#|b)?(.*)$/);
  if (!match) return [-1, -1, -1, -1, -1, -1];

  const [_, rootNote, accidental = '', quality = ''] = match;
  const rootStr = rootNote + accidental;
  const rootIdx = getNoteIndex(rootStr);

  if (rootIdx === -1) return [-1, -1, -1, -1, -1, -1];

  const distE = (rootIdx - 4 + 12) % 12;
  const distA = (rootIdx - 9 + 12) % 12;

  const useE = distE < distA;
  const shift = useE ? distE : distA;

  let isMinor = quality.startsWith('m') && !quality.startsWith('maj') && !quality.startsWith('M7');
  let is7 = quality.includes('7') && !quality.includes('maj7') && !quality.includes('M7');
  let isM7 = quality.includes('maj7') || quality.includes('M7');
  let isSus4 = quality.includes('sus4') || quality.includes('4');

  let baseShape: number[];
  if (useE) {
    if (isMinor) {
      baseShape = is7 ? [0, 2, 0, 0, 0, 0] : [0, 2, 2, 0, 0, 0];
    } else {
      baseShape = is7 ? [0, 2, 0, 1, 0, 0] : (isM7 ? [0, 2, 1, 1, 0, 0] : [0, 2, 2, 1, 0, 0]);
    }
    if (isSus4) baseShape = [0, 2, 2, 2, 0, 0];
  } else {
    if (isMinor) {
      baseShape = is7 ? [-1, 0, 2, 0, 1, 0] : [-1, 0, 2, 2, 1, 0];
    } else {
      baseShape = is7 ? [-1, 0, 2, 0, 2, 0] : (isM7 ? [-1, 0, 2, 1, 2, 0] : [-1, 0, 2, 2, 2, 0]);
    }
    if (isSus4) baseShape = [-1, 0, 2, 2, 3, 0];
  }

  return baseShape.map(fret => {
    if (fret === -1) return -1;
    return fret + shift;
  });
}

// Marcadores de seção comuns que podem aparecer em linhas de cifra
const SECTION_MARKERS = /^(?:\[?[Ií]ntro\]?|\[?[S]olo\]?|\[?[R]iff\]?|\[?[R]efr[aã]o\]?|\[?[P]onte\]?|\[?[V]erso\]?|\[?[C]horus\]?|\[?[B]ridge\]?|\[?[O]utro\]?|\[?[A]cústico\]?|\[?[P]ré-refr[aã]o\]?):?$/i;

// Símbolos de tablatura ou compasso comuns
const SYMBOLS = /^[||\-~\s+xX*]+$/;

export function isChord(token: string): boolean {
  const chordRegex = /^[A-G](?:#|b)?(?:m|min|maj|M|maj7|maj9|maj13|min7|m7|m9|m11|m13|sus2|sus4|sus|dim|dim7|aug|add9|add11|add2|add4|5|6|7|9|11|13|M7|m7b5|6\/9|7#9|7b9|7#5|7b5)*(?:\([^)]+\))?(?:\/[A-G](?:#|b)?)?$/i;
  return chordRegex.test(token);
}

export function isChordLine(line: string): boolean {
  const trimmed = line.trim();
  if (trimmed === '') return false;

  const tokens = trimmed.split(/\s+/);
  let validCount = 0;

  for (const token of tokens) {
    if (isChord(token) || SECTION_MARKERS.test(token) || SYMBOLS.test(token)) {
      validCount++;
    }
  }

  return validCount / tokens.length >= 0.85;
}
