// @sos-edit: false
import React, { useState } from 'react';
import { ADMIN_EMAIL, ADMIN_PASSWORD_HASH, hashPassword, setAuthenticated } from '../auth/credentials';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (email.trim().toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        setError('E-mail ou senha incorretos.');
        setIsLoading(false);
        return;
      }

      const inputHash = await hashPassword(password);
      if (inputHash === ADMIN_PASSWORD_HASH) {
        setAuthenticated(true);
        onSuccess();
        onClose();
      } else {
        setError('E-mail ou senha incorretos.');
      }
    } catch (err) {
      console.error(err);
      setError('Ocorreu um erro ao processar o login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="bottom-sheet-backdrop" onClick={onClose} />
      <div className="login-modal-container" role="dialog" aria-modal="true" aria-label="Acesso Restrito">
        <div className="login-modal-header">
          <h3>Acesso Restrito 🔐</h3>
          <button className="bottom-sheet-close" onClick={onClose} aria-label="Fechar painel">✕</button>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
            Apenas administradores podem reorganizar as músicas e blocos.
          </p>

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

          <div className="control-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu e-mail"
              className="note-input"
              style={{
                width: '100%',
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)'
              }}
            />
          </div>

          <div className="control-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Senha</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              className="note-input"
              style={{
                width: '100%',
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button
              type="submit"
              disabled={isLoading}
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
              {isLoading ? 'Autenticando...' : 'Entrar'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-ctrl"
              style={{
                padding: '12px 16px',
                borderRadius: '8px'
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
