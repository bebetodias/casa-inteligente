import { useState, useEffect, useCallback } from 'react';
import { RECEITAS_BASE, calcularMatchReceita } from '../services/mock/recipesMock';
import { buscarReceitasOnline } from '../services/recipesApi';

const STORAGE_KEYS = {
  DESPENSA: 'casa_inteligente_despensa',
  FAVORITOS: 'casa_inteligente_receitas_fav',
  CUSTOM: 'casa_inteligente_receitas_custom',
};

const INGREDIENTES_DEFAULT = [
  'Ovo',
  'Tomate',
  'Cebola',
  'Alho',
  'Sal',
  'Azeite de oliva',
  'Óleo',
  'Arroz',
  'Feijão',
  'Macarrão',
  'Queijo mussarela',
  'Manteiga',
  'Leite',
];

export function useRecipes() {
  const [despensa, setDespensa] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DESPENSA);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Erro ao ler despensa do localStorage', e);
      }
    }
    return INGREDIENTES_DEFAULT;
  });

  const [favoritos, setFavoritos] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FAVORITOS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Erro ao ler favoritos do localStorage', e);
      }
    }
    return ['rec-1'];
  });

  const [receitasCustom, setReceitasCustom] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CUSTOM);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Erro ao ler receitas customizadas', e);
      }
    }
    return [];
  });

  const [receitasOnline, setReceitasOnline] = useState([]);
  const [loadingOnline, setLoadingOnline] = useState(false);
  const [buscaOnlineAtiva, setBuscaOnlineAtiva] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DESPENSA, JSON.stringify(despensa));
  }, [despensa]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FAVORITOS, JSON.stringify(favoritos));
  }, [favoritos]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOM, JSON.stringify(receitasCustom));
  }, [receitasCustom]);

  // Ações da despensa
  const toggleIngrediente = useCallback((nomeIngrediente) => {
    setDespensa((prev) => {
      const exists = prev.some(
        (i) => i.toLowerCase() === nomeIngrediente.toLowerCase()
      );
      if (exists) {
        return prev.filter((i) => i.toLowerCase() !== nomeIngrediente.toLowerCase());
      } else {
        return [...prev, nomeIngrediente];
      }
    });
  }, []);

  const adicionarIngrediente = useCallback((nomeIngrediente) => {
    if (!nomeIngrediente || !nomeIngrediente.trim()) return;
    const itemFormatado = nomeIngrediente.trim();
    setDespensa((prev) => {
      const exists = prev.some(
        (i) => i.toLowerCase() === itemFormatado.toLowerCase()
      );
      if (exists) return prev;
      return [...prev, itemFormatado];
    });
  }, []);

  const removerIngrediente = useCallback((nomeIngrediente) => {
    setDespensa((prev) =>
      prev.filter((i) => i.toLowerCase() !== nomeIngrediente.toLowerCase())
    );
  }, []);

  const limparDespensa = useCallback(() => {
    setDespensa([]);
  }, []);

  const selecionarBasicos = useCallback(() => {
    setDespensa(INGREDIENTES_DEFAULT);
  }, []);

  // Ações de favoritos e receitas custom
  const toggleFavorito = useCallback((idReceita) => {
    setFavoritos((prev) => {
      if (prev.includes(idReceita)) {
        return prev.filter((id) => id !== idReceita);
      } else {
        return [...prev, idReceita];
      }
    });
  }, []);

  const adicionarReceitaCustom = useCallback((novaReceita) => {
    const receitaComId = {
      ...novaReceita,
      id: `custom-${Date.now()}`,
      imagemEmoji: novaReceita.imagemEmoji || '🍲',
    };
    setReceitasCustom((prev) => [receitaComId, ...prev]);
    return receitaComId;
  }, []);

  // Buscar receitas na web (API TheMealDB)
  const buscarNaWeb = useCallback(async (termoBusca) => {
    const termo = termoBusca && termoBusca.trim() ? termoBusca : 'chicken';
    setLoadingOnline(true);
    setBuscaOnlineAtiva(true);
    try {
      const resultados = await buscarReceitasOnline(termo);
      setReceitasOnline(resultados);
    } catch (e) {
      console.error('Erro na busca online', e);
    } finally {
      setLoadingOnline(false);
    }
  }, []);

  const limparBuscaWeb = useCallback(() => {
    setBuscaOnlineAtiva(false);
    setReceitasOnline([]);
  }, []);

  // Combinar receitas locais com online se a busca online estiver ativa
  const listaBase = buscaOnlineAtiva
    ? [...receitasOnline, ...receitasCustom, ...RECEITAS_BASE]
    : [...receitasCustom, ...RECEITAS_BASE];

  const todasReceitas = listaBase.map((receita) => {
    const match = calcularMatchReceita(receita, despensa);
    const isFavorito = favoritos.includes(receita.id);
    return {
      ...receita,
      match,
      isFavorito,
    };
  });

  return {
    despensa,
    favoritos,
    receitas: todasReceitas,
    loadingOnline,
    buscaOnlineAtiva,
    toggleIngrediente,
    adicionarIngrediente,
    removerIngrediente,
    limparDespensa,
    selecionarBasicos,
    toggleFavorito,
    adicionarReceitaCustom,
    buscarNaWeb,
    limparBuscaWeb,
  };
}
