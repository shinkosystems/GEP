// @sos-edit: false
import React, { useState } from 'react';
import { Song, SongBlock } from '../data/songs';

interface AddSongPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSong: (song: Song, targetBlockId: string) => void;
  songBlocks: SongBlock[];
}

export const AddSongPanel: React.FC<AddSongPanelProps> = ({
  isOpen,
  onClose,
  onAddSong,
  songBlocks
}) => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [key, setKey] = useState('A');
  const [content, setContent] = useState('');
  const [targetBlockId, setTargetBlockId] = useState(songBlocks[0]?.id || '');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Helper para normalizar o título da música em um slug/ID válido e sem acentos
  const generateSlug = (str: string): string => {
    return str
      .toLowerCase()
      .normalize('NFD') // Separa os acentos das letras (ex: 'ã' virá 'a' + '~')
      .replace(/[\u0300-\u036f]/g, '') // Remove os acentos avulsos
      .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais não alfanuméricos
      .trim()
      .replace(/\s+/g, '-'); // Troca espaços por hífens
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !artist.trim() || !content.trim() || !targetBlockId) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const generatedId = generateSlug(title);

    // Verificar se já existe uma música com o mesmo ID
    const allSongs = songBlocks.flatMap(b => b.songs);
    if (allSongs.some(s => s.id === generatedId)) {
      setError('Já existe uma música cadastrada com esse título (ou título similar).');
      return;
    }

    const newSong: Song = {
      id: generatedId,
      title: title.trim(),
      artist: artist.trim(),
      key: key.trim(),
      content: content.trim()
    };

    onAddSong(newSong, targetBlockId);
    
    // Limpar formulário
    setTitle('');
    setArtist('');
    setKey('A');
    setContent('');
    onClose();
  };

  return (
    <>
      <div className="bottom-sheet-backdrop" onClick={onClose} style={{ display: 'block', opacity: 1 }} />
      <div className="add-song-drawer" role="dialog" aria-modal="true" aria-label="Adicionar Nova Música">
        <div className="login-modal-header" style={{ marginBottom: '20px' }}>
          <h3 style={{ margin: 0 }}>＋ Adicionar Música 🎵</h3>
          <button className="bottom-sheet-close" onClick={onClose} aria-label="Fechar painel">✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {error && (
            <div className="login-error-message" style={{
              backgroundColor: '#FFEBEE',
              color: '#C62828',
              border: '1.5px solid #FFCDD2',
              borderRadius: '8px',
              padding: '10px 14px',
              fontSize: '0.85rem',
              fontWeight: 500
            }}>
              ⚠️ {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Título da Música *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Menino da Porteira"
              className="note-input"
              style={{ width: '100%', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Artista / Cantor *</label>
            <input
              type="text"
              required
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              placeholder="Ex: Sérgio Reis"
              className="note-input"
              style={{ width: '100%', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Tom *</label>
              <input
                type="text"
                required
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Ex: A, C#, G"
                className="note-input"
                style={{ width: '100%', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Bloco de Destino *</label>
              <select
                value={targetBlockId}
                onChange={(e) => setTargetBlockId(e.target.value)}
                className="note-input"
                style={{
                  width: '100%',
                  backgroundColor: 'var(--bg-main)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  padding: '8px'
                }}
              >
                {songBlocks.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Cifra (Letra e Acordes) *</label>
            <textarea
              required
              rows={12}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Cole a cifra aqui... Adicione os acordes acima das letras. Ex:
[Intro] E A E A
A
Toda vez que eu viajava..."
              className="note-input"
              style={{
                width: '100%',
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                lineHeight: 1.4,
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button
              type="submit"
              className="btn-ctrl active"
              style={{
                flex: 1,
                padding: '12px',
                background: 'var(--primary)',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                fontWeight: 600,
                borderRadius: '8px'
              }}
            >
              Adicionar Música
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-ctrl"
              style={{ padding: '12px 16px', borderRadius: '8px' }}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
