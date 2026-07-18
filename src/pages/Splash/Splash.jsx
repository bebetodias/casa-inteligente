import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import './Splash.css';

export function Splash() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(isAuthenticated ? '/modulos' : '/login', { replace: true });
    }, 1800);
    return () => clearTimeout(timer);
  }, [navigate, isAuthenticated]);

  return (
    <div className="splash">
      <div className="splash__content">
        <div className="splash__logo">
          <svg viewBox="0 0 64 64" aria-hidden="true">
            <path
              d="M32 4 L60 24 V58 H40 V40 H24 V58 H4 V24 Z"
              fill="var(--color-brand)"
            />
            <circle cx="32" cy="32" r="4" fill="var(--color-text-inverse)" />
          </svg>
        </div>
        <h1 className="splash__title">Casa Inteligente</h1>
        <p className="splash__tagline">Cuidando do seu lar, juntos.</p>
        <div className="splash__loader" aria-label="Carregando">
          <span></span><span></span><span></span>
        </div>
      </div>
    </div>
  );
}