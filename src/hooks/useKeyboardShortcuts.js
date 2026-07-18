import { useEffect } from 'react';

/**
 * Atalhos disponíveis:
 * - N: Novo item
 * - /: Foca na busca
 * - H: Vai para histórico
 * - Esc: Fecha modal/drawer aberto
 */
export function useShoppingShortcuts({ onNew, onSearch, onHistory }) {
  useEffect(() => {
    const handleKey = (e) => {
      // Ignora se estiver digitando em input
      const tag = e.target.tagName;
      const isEditable = tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable;
      if (isEditable) return;

      // Ignora se houver modal aberto (deixa o Esc do modal lidar)
      if (document.querySelector('.modal-overlay, .drawer-overlay')) return;

      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        onNew?.();
      } else if (e.key === '/') {
        e.preventDefault();
        onSearch?.();
      } else if (e.key === 'h' || e.key === 'H') {
        onHistory?.();
      }
    };

    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onNew, onSearch, onHistory]);
}