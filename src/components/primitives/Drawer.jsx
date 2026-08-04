import { useEffect } from 'react';
import { CloseIcon } from '../../utils/Icons';
import './Drawer.css';

export function Drawer({ open, onClose, title, children, footer, width = 'medium' }) {
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="drawer-overlay" onClick={onClose} role="presentation">
      <aside
        className={`drawer drawer--${width}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        <header className="drawer__header">
          <h2 id="drawer-title" className="drawer__title">{title}</h2>
          <button className="drawer__close" onClick={onClose} aria-label="Fechar">
            <CloseIcon size={20} />
          </button>
        </header>
        <div className="drawer__body">{children}</div>
        {footer && <footer className="drawer__footer">{footer}</footer>}
      </aside>
    </div>
  );
}