import { create } from 'zustand';

export const useToastStore = create((set) => ({
  visible: false,
  mensagem: '',
  variant: 'success',
  showToast: ({ descricao, tipo = 'success', titulo }) => {
    // titulo é opcional ou concatenado, mantendo compatibilidade
    const texto = titulo ? `${titulo} - ${descricao}` : descricao;
    set({ visible: true, mensagem: texto, variant: tipo });
  },
  hideToast: () => set({ visible: false })
}));

export function useToast() {
  const showToast = useToastStore((s) => s.showToast);
  return { showToast };
}
