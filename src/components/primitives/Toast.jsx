import { useEffect } from 'react';
import './Toast.css';

export function Toast({ mensagem, visible, onClose, variant = 'success' }) {
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div className={`toast toast--${variant}`} role="status">
      <span className="toast__icon">
        {variant === 'success' ? '✓' : variant === 'error' ? '✕' : 'ℹ'}
      </span>
      <span className="toast__msg">{mensagem}</span>
    </div>
  );
}