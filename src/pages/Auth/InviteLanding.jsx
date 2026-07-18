import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/primitives/Button';
import { Input } from '../../components/primitives/Input';
import { useAuthStore } from '../../stores/authStore';
import { Link } from 'react-router-dom';
import './Auth.css';

export function InviteLanding() {
  const navigate = useNavigate();
  const validateInvite = useAuthStore((s) => s.validateInvite);

  const [codigo, setCodigo] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCodigo(e.target.value.toUpperCase());
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!codigo.trim()) {
      setError('Digite o código de convite.');
      return;
    }
    setLoading(true);
    try {
      await validateInvite(codigo);
      navigate(`/convite/${encodeURIComponent(codigo.trim().toUpperCase())}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth">
      <div className="auth__panel auth__panel--brand">
        <div className="auth__brand-content">
          <div className="auth__brand-logo">
            <svg viewBox="0 0 64 64" aria-hidden="true">
              <path
                d="M32 4 L60 24 V58 H40 V40 H24 V58 H4 V24 Z"
                fill="var(--color-text-inverse)"
              />
              <circle cx="32" cy="32" r="4" fill="var(--color-brand)" />
            </svg>
          </div>
          <h2 className="auth__brand-title">Você foi convidado!</h2>
          <p className="auth__brand-text">
            Alguém da sua família quer compartilhar o Casa Inteligente com você.
            Informe o código que você recebeu para entrar na casa.
          </p>
          <div className="invite__hint-box">
            <strong>Onde encontrar o código?</strong>
            <p>Quem te convidou pode compartilhar o código pelo app ou nas
            configurações da casa. O formato é <code>CASA-XXXXXX</code>.</p>
          </div>
        </div>
      </div>

      <div className="auth__panel auth__panel--form">
        <div className="auth__form-wrapper">
          <div className="auth__header">
            <h1 className="auth__title">Entrar com convite</h1>
            <p className="auth__subtitle">Digite o código de 6 caracteres recebido.</p>
          </div>

          <form className="auth__form" onSubmit={handleSubmit} noValidate>
            {error && (
              <div className="auth__alert" role="alert">
                {error}
              </div>
            )}

            <div className="invite__code-field">
              <label htmlFor="codigo" className="field__label">
                Código de convite
                <span className="field__required">*</span>
              </label>
              <input
                id="codigo"
                className={`invite__code-input ${error ? 'invite__code-input--error' : ''}`}
                type="text"
                placeholder="CASA-XXXXXX"
                value={codigo}
                onChange={handleChange}
                maxLength={12}
                autoComplete="off"
                autoFocus
                spellCheck={false}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="large"
              isLoading={loading}
              isBlock
            >
              Validar código
            </Button>
          </form>

          <p className="auth__footer">
            Já tem uma conta?{' '}
            <Link to="/login" className="auth__link auth__link--bold">
              Entrar
            </Link>
            {' '}ou{' '}
            <Link to="/cadastro" className="auth__link auth__link--bold">
              criar conta nova
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}