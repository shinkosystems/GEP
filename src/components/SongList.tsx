// @sos-edit: false
import React, { useState } from 'react';
import { Song, SongBlock } from '../data/songs';
import { isAuthenticated, setAuthenticated } from '../auth/credentials';
import { LoginModal } from './LoginModal';
import { AddSongPanel } from './AddSongPanel';

interface SongListProps {
  songBlocks: SongBlock[];
  onSelectSong: (song: Song) => void;
  onUpdateSongBlocks: (newBlocks: SongBlock[]) => void;
  onResetSongBlocks: () => void;
}

export const SongList: React.FC<SongListProps> = ({
  songBlocks,
  onSelectSong,
  onUpdateSongBlocks,
  onResetSongBlocks,
}) => {
  const [isOrganizeMode, setIsOrganizeMode] = useState(false);
  const [draggedSong, setDraggedSong] = useState<{ id: string; blockId: string } | null>(null);
  const [draggingSongId, setDraggingSongId] = useState<string | null>(null);
  const [dragOverBlockId, setDragOverBlockId] = useState<string | null>(null);
  const [dragOverSongId, setDragOverSongId] = useState<string | null>(null);
  
  // Estado para suporte a cliques/toques (Click-to-Move) no mobile
  const [selectedSong, setSelectedSong] = useState<{ id: string; blockId: string } | null>(null);

  // Estado para o modal de Login
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Estados para criação de blocos
  const [showAddBlockInput, setShowAddBlockInput] = useState(false);
  const [newBlockName, setNewBlockName] = useState('');

  // Estados para adição de músicas
  const [isAddSongPanelOpen, setIsAddSongPanelOpen] = useState(false);

  // Estados para edição do nome de blocos
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [editingBlockName, setEditingBlockName] = useState('');

  const handleDragStart = (e: React.DragEvent, songId: string, sourceBlockId: string) => {
    e.dataTransfer.setData('text/plain', songId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedSong({ id: songId, blockId: sourceBlockId });
    setDraggingSongId(songId);
  };

  const handleDragEnd = () => {
    setDraggedSong(null);
    setDraggingSongId(null);
    setDragOverBlockId(null);
    setDragOverSongId(null);
  };

  const handleDragOverBlock = (e: React.DragEvent, blockId: string) => {
    e.preventDefault();
    if (dragOverBlockId !== blockId) {
      setDragOverBlockId(blockId);
    }
  };

  const handleDragOverSong = (e: React.DragEvent, songId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragOverSongId !== songId) {
      setDragOverSongId(songId);
    }
  };

  const handleDrop = (e: React.DragEvent, targetBlockId: string, targetSongId: string | null) => {
    e.preventDefault();
    const songId = e.dataTransfer.getData('text/plain') || draggedSong?.id;
    const sourceBlockId = draggedSong?.blockId;

    if (!songId || !sourceBlockId) return;

    moveSong(songId, sourceBlockId, targetBlockId, targetSongId);
    handleDragEnd();
  };

  // Suporte a Click-to-Move no mobile/desktop
  const handleSongClick = (songId: string, blockId: string) => {
    if (selectedSong && selectedSong.id === songId && selectedSong.blockId === blockId) {
      setSelectedSong(null); // Desmarca se clicar de novo
    } else {
      setSelectedSong({ id: songId, blockId: blockId });
    }
  };

  const handleMoveSelectedToBlock = (targetBlockId: string) => {
    if (!selectedSong) return;
    moveSong(selectedSong.id, selectedSong.blockId, targetBlockId, null);
  };

  const moveSong = (
    songId: string,
    sourceBlockId: string,
    targetBlockId: string,
    targetSongId: string | null
  ) => {
    // 1. Encontrar a música de origem
    const sourceBlock = songBlocks.find(b => b.id === sourceBlockId);
    const songToMove = sourceBlock?.songs.find(s => s.id === songId);

    if (!songToMove) return;

    // 2. Remover do bloco de origem
    let updatedBlocks = songBlocks.map(b => {
      if (b.id === sourceBlockId) {
        return {
          ...b,
          songs: b.songs.filter(s => s.id !== songId)
        };
      }
      return b;
    });

    // 3. Adicionar no bloco de destino na posição correta
    updatedBlocks = updatedBlocks.map(b => {
      if (b.id === targetBlockId) {
        let newSongs = [...b.songs];
        if (targetSongId) {
          const index = newSongs.findIndex(s => s.id === targetSongId);
          if (index !== -1) {
            newSongs.splice(index, 0, songToMove);
          } else {
            newSongs.push(songToMove);
          }
        } else {
          newSongs.push(songToMove);
        }
        return {
          ...b,
          songs: newSongs
        };
      }
      return b;
    });

    onUpdateSongBlocks(updatedBlocks);
    setSelectedSong(null);
  };

  const handleToggleOrganizeMode = () => {
    if (isOrganizeMode) {
      setIsOrganizeMode(false);
      setSelectedSong(null);
      setDraggedSong(null);
      setEditingBlockId(null);
      setEditingBlockName('');
    } else {
      if (isAuthenticated()) {
        setIsOrganizeMode(true);
      } else {
        setIsLoginModalOpen(true);
      }
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setIsOrganizeMode(false);
    setSelectedSong(null);
    setDraggedSong(null);
    setShowAddBlockInput(false);
    setNewBlockName('');
    setEditingBlockId(null);
    setEditingBlockName('');
  };

  const handleCreateBlock = () => {
    if (!newBlockName.trim()) return;
    const newBlock: SongBlock = {
      id: `block-${Date.now()}`,
      name: newBlockName.trim(),
      songs: []
    };
    onUpdateSongBlocks([...songBlocks, newBlock]);
    setNewBlockName('');
    setShowAddBlockInput(false);
  };

  const handleDeleteBlock = (blockId: string, blockName: string) => {
    const block = songBlocks.find(b => b.id === blockId);
    if (!block) return;

    if (block.songs.length > 0) {
      if (!window.confirm(`O bloco "${blockName}" contém ${block.songs.length} música(s). Deseja realmente excluí-lo e todas as suas músicas?`)) {
        return;
      }
    }

    const updatedBlocks = songBlocks.filter(b => b.id !== blockId);
    onUpdateSongBlocks(updatedBlocks);
    if (selectedSong && selectedSong.blockId === blockId) {
      setSelectedSong(null);
    }
  };

  const handleSaveBlockName = (blockId: string) => {
    if (!editingBlockName.trim()) return;
    const updatedBlocks = songBlocks.map(b => {
      if (b.id === blockId) {
        return {
          ...b,
          name: editingBlockName.trim()
        };
      }
      return b;
    });
    onUpdateSongBlocks(updatedBlocks);
    setEditingBlockId(null);
    setEditingBlockName('');
  };

  const handleAddSong = (newSong: Song, targetBlockId: string) => {
    const updatedBlocks = songBlocks.map(b => {
      if (b.id === targetBlockId) {
        return {
          ...b,
          songs: [...b.songs, newSong]
        };
      }
      return b;
    });
    onUpdateSongBlocks(updatedBlocks);
  };

  const handleDeleteSong = (songId: string, blockId: string, songTitle: string) => {
    if (!window.confirm(`Deseja realmente excluir a música "${songTitle}" deste bloco?`)) return;
    const updatedBlocks = songBlocks.map(b => {
      if (b.id === blockId) {
        return {
          ...b,
          songs: b.songs.filter(s => s.id !== songId)
        };
      }
      return b;
    });
    onUpdateSongBlocks(updatedBlocks);
    if (selectedSong && selectedSong.id === songId) {
      setSelectedSong(null);
    }
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(songBlocks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "gep_song_blocks.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      {/* Hero Section */}
      <section style={{ textAlign: 'center', padding: '40px 0 30px', borderBottom: '1px solid var(--border-color)', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 700, background: 'linear-gradient(135deg, #8C661F 0%, #F2BF5E 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '16px' }}>
          GEP Cifras
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
          Aplicativo acessível para estudo de blocos musicais e cifras de Tim e Vanessa. Escolha uma música abaixo para ver a letra, acordes e diagramas de teclado.
        </p>
      </section>

      {/* Barra de Controle de Organização */}
      <div className="organize-bar">
        {showAddBlockInput ? (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flex: 1 }}>
            <input
              type="text"
              value={newBlockName}
              onChange={(e) => setNewBlockName(e.target.value)}
              placeholder="Nome do novo bloco..."
              className="note-input"
              style={{
                maxWidth: '300px',
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                padding: '8px 12px'
              }}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCreateBlock();
                } else if (e.key === 'Escape') {
                  setShowAddBlockInput(false);
                  setNewBlockName('');
                }
              }}
            />
            <button 
              onClick={handleCreateBlock}
              className="btn-note-save"
              style={{ padding: '8px 16px', height: '38px' }}
            >
              Salvar
            </button>
            <button 
              onClick={() => { setShowAddBlockInput(false); setNewBlockName(''); }}
              className="btn-note-cancel"
              style={{ padding: '8px 16px', height: '38px' }}
            >
              Cancelar
            </button>
          </div>
        ) : (
          <span style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            {isOrganizeMode ? (
              selectedSong ? (
                <span style={{ color: 'var(--primary)', fontWeight: 600 }}>
                  👉 Música selecionada! Clique no botão "[ Mover para cá ]" do bloco de destino.
                </span>
              ) : (
                '🛠️ Arraste as músicas ou clique em uma delas para selecioná-la e movê-la.'
              )
            ) : (
              '📂 Organize e distribua suas músicas em blocos personalizados.'
            )}
          </span>
        )}
        
        <div style={{ display: 'flex', gap: '10px' }}>
          {isOrganizeMode && !showAddBlockInput && (
            <>
              <button
                onClick={() => setShowAddBlockInput(true)}
                className="btn-ctrl"
                style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '0.9rem', color: 'var(--primary)', borderColor: 'var(--primary)' }}
                aria-label="Criar novo bloco de músicas"
              >
                ＋ Novo Bloco
              </button>
              <button
                onClick={() => setIsAddSongPanelOpen(true)}
                className="btn-ctrl"
                style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '0.9rem', color: 'var(--primary)', borderColor: 'var(--primary)' }}
                aria-label="Adicionar nova música"
              >
                ＋ Adicionar Música
              </button>
              <button
                onClick={handleExportJSON}
                className="btn-ctrl"
                style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '0.9rem', color: '#1B5E20', borderColor: '#A5D6A7' }}
                aria-label="Exportar a configuração atual de blocos para JSON"
              >
                📥 Exportar JSON
              </button>
            </>
          )}
          {isAuthenticated() && (
            <button
              onClick={handleLogout}
              className="btn-ctrl"
              style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '0.9rem', color: '#D32F2F', borderColor: '#FFCDD2' }}
              aria-label="Sair do modo administrador"
            >
              Sair 🚪
            </button>
          )}
          <button 
            onClick={handleToggleOrganizeMode}
            className={`btn-toggle-organize ${isOrganizeMode ? 'active' : ''}`}
            aria-label="Alternar modo de organização dos blocos"
          >
            {isOrganizeMode ? '✓ Concluir Organização' : '⚙️ Organizar Blocos'}
          </button>
          <button 
            onClick={onResetSongBlocks}
            className="btn-ctrl"
            style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '0.9rem' }}
            aria-label="Restaurar distribuição padrão de músicas nos blocos"
          >
            Restaurar Padrão
          </button>
        </div>
      </div>

      {/* Grid de Blocos */}
      <main aria-label="Lista de Blocos e Músicas">
        <h2 style={{ fontSize: '1.8rem', fontWeight: 600, marginBottom: '24px' }}>📁 Blocos Musicais</h2>
        
        <div className="block-grid">
          {songBlocks.map(block => {
            const isDragOver = dragOverBlockId === block.id;
            const canShowMoveHere = selectedSong && selectedSong.blockId !== block.id;
            
            return (
              <section 
                key={block.id} 
                className={`block-card ${isDragOver ? 'drag-over' : ''}`} 
                aria-labelledby={`title-${block.id}`}
                onDragOver={(e) => isOrganizeMode && handleDragOverBlock(e, block.id)}
                onDragLeave={isOrganizeMode ? () => setDragOverBlockId(null) : undefined}
                onDrop={(e) => isOrganizeMode && handleDrop(e, block.id, null)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                    {editingBlockId === block.id ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '100%' }}>
                        <input
                          type="text"
                          value={editingBlockName}
                          onChange={(e) => setEditingBlockName(e.target.value)}
                          className="note-input"
                          style={{
                            fontSize: '1rem',
                            fontWeight: 600,
                            padding: '4px 8px',
                            width: '100%',
                            maxWidth: '150px',
                            backgroundColor: 'var(--bg-main)',
                            border: '1.5px solid var(--primary)',
                            borderRadius: '6px',
                            color: 'var(--text-primary)'
                          }}
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleSaveBlockName(block.id);
                            } else if (e.key === 'Escape') {
                              setEditingBlockId(null);
                            }
                          }}
                        />
                        <button 
                          onClick={() => handleSaveBlockName(block.id)} 
                          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: '#2E7D32' }}
                          title="Salvar Nome"
                        >
                          ✓
                        </button>
                        <button 
                          onClick={() => setEditingBlockId(null)} 
                          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: '#C62828' }}
                          title="Cancelar"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <>
                        <h3 id={`title-${block.id}`} style={{ margin: 0 }}>{block.name}</h3>
                        {isOrganizeMode && (
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button 
                              onClick={() => { setEditingBlockId(block.id); setEditingBlockName(block.name); }}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--text-muted)',
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                                padding: '2px 4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '4px',
                                transition: 'color var(--transition-fast)'
                              }}
                              title="Editar Nome do Bloco"
                              aria-label={`Editar nome do bloco ${block.name}`}
                              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
                              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                            >
                              ✏️
                            </button>
                            <button 
                              onClick={() => handleDeleteBlock(block.id, block.name)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--text-muted)',
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                                padding: '2px 4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '4px',
                                transition: 'color var(--transition-fast)'
                              }}
                              title="Excluir Bloco"
                              aria-label={`Excluir bloco ${block.name}`}
                              onMouseEnter={(e) => e.currentTarget.style.color = '#D32F2F'}
                              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                            >
                              🗑️
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  {isOrganizeMode && canShowMoveHere && (
                    <button
                      onClick={() => handleMoveSelectedToBlock(block.id)}
                      className="btn-ctrl active"
                      style={{ 
                        padding: '4px 8px', 
                        fontSize: '0.75rem', 
                        borderRadius: '6px', 
                        background: 'var(--primary)',
                        color: '#fff',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                       colocar aqui 📥
                    </button>
                  )}
                </div>
                
                <ul className="block-songs-list" style={{ minHeight: isOrganizeMode ? '100px' : 'auto' }}>
                  {block.songs.length === 0 && isOrganizeMode && (
                    <li style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', padding: '20px 0', border: '1px dashed var(--border-color)', borderRadius: '8px' }}>
                      Arraste músicas aqui
                    </li>
                  )}
                  {block.songs.map(song => {
                    const isDragging = draggingSongId === song.id;
                    const isDragOverSong = dragOverSongId === song.id;
                    const isSelected = selectedSong?.id === song.id;

                    return (
                      <li 
                        key={song.id}
                        draggable={isOrganizeMode}
                        onDragStart={(e) => handleDragStart(e, song.id, block.id)}
                        onDragEnd={handleDragEnd}
                        onDragOver={(e) => isOrganizeMode && handleDragOverSong(e, song.id)}
                        onDragLeave={isOrganizeMode ? () => setDragOverSongId(null) : undefined}
                        onDrop={(e) => isOrganizeMode && handleDrop(e, block.id, song.id)}
                        onClick={() => isOrganizeMode && handleSongClick(song.id, block.id)}
                        className={isOrganizeMode ? `song-drag-item ${isDragging ? 'dragging' : ''} ${isDragOverSong ? 'drag-over-song' : ''} ${isSelected ? 'selected' : ''}` : ''}
                      >
                        {isOrganizeMode ? (
                          <>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span className="drag-handle" style={{ cursor: 'grab' }}>☰</span>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  <span style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                                    {song.title}
                                  </span>
                                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    {song.artist}
                                  </span>
                                </div>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteSong(song.id, block.id, song.title);
                                }}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: 'var(--text-muted)',
                                  cursor: 'pointer',
                                  fontSize: '0.85rem',
                                  padding: '4px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  borderRadius: '4px',
                                  transition: 'color var(--transition-fast)'
                                }}
                                title="Remover Música"
                                onMouseEnter={(e) => e.currentTarget.style.color = '#D32F2F'}
                                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                              >
                                🗑️
                              </button>
                            </div>
                          </>
                        ) : (
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
                        )}
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>
      </main>
      
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onSuccess={() => setIsOrganizeMode(true)}
      />

      <AddSongPanel
        isOpen={isAddSongPanelOpen}
        onClose={() => setIsAddSongPanelOpen(false)}
        onAddSong={handleAddSong}
        songBlocks={songBlocks}
      />
    </div>
  );
};
