import { useEffect, useRef, useState } from 'react';

/**
 * Hook para detectar alterações não salvas e mostrar confirmação ao sair
 */
export function useExitConfirm(ativo) {
  useEffect(() => {
    if (!ativo) return;

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
      return '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [ativo]);
}