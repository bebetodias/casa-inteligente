import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

// Helper to map DB row to frontend item format
const mapDbToItem = (row) => ({
  id: row.id,
  status: row.comprado ? 'comprado' : 'pendente',
  precoSugerido: row.preco_sugerido,
  quantidade: row.quantidade,
  unidade: row.unidade,
  produto: {
    id: row.produto_id || `prod-${row.id}`,
    nome: row.nome,
    categoria: row.categoria,
  },
  criado_em: row.criado_em,
});

export function useShoppingList(casaId, membroId) {
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const carregar = useCallback(async () => {
    if (!casaId) return;
    try {
      setLoading(true);
      setError(null);
      const { data, error: err } = await supabase
        .from('compras')
        .select('*')
        .eq('casa_id', casaId)
        .order('criado_em', { ascending: false });

      if (err) throw err;
      
      setItens(data.map(mapDbToItem));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [casaId]);

  useEffect(() => {
    carregar();

    // Supabase Realtime Subscription
    if (!casaId) return;

    const channel = supabase
      .channel('compras_realtime')
      .on(
        'postgres_changes',
        {
          event: '*', // INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'compras',
          filter: `casa_id=eq.${casaId}`,
        },
        () => {
          // Quando houver qualquer mudança, recarregamos a lista inteira
          // (Poderíamos otimizar atualizando o estado localmente, mas recarregar garante consistência)
          carregar();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [carregar, casaId]);

  const adicionar = useCallback(async (dados) => {
    if (!casaId) return;
    // Tenta pegar a categoria do catálogo, ou usa uma default
    const categoria = dados.categoria || 'outros';
    
    const novaCompra = {
      casa_id: casaId,
      nome: dados.nome,
      categoria: categoria,
      produto_id: String(dados.produtoId || ''),
      quantidade: dados.quantidade || 1,
      unidade: dados.unidade || 'un',
      preco_sugerido: dados.precoSugerido || 0,
      comprado: false,
      criado_por: membroId,
    };

    const { data, error } = await supabase
      .from('compras')
      .insert([novaCompra])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return mapDbToItem(data);
  }, [casaId, membroId]);

  const atualizar = useCallback(async (itemId, patch) => {
    const { error } = await supabase
      .from('compras')
      .update(patch)
      .eq('id', itemId);

    if (error) throw new Error(error.message);
  }, []);

  const remover = useCallback(async (itemId) => {
    const { error } = await supabase
      .from('compras')
      .delete()
      .eq('id', itemId);

    if (error) throw new Error(error.message);
  }, []);

  const comprar = useCallback(async (dados) => {
    const { error } = await supabase
      .from('compras')
      .update({ 
        comprado: true,
        quantidade: dados.quantidade || 1,
        unidade: dados.unidade,
        preco_sugerido: dados.precoTotal ? (dados.precoTotal / (dados.quantidade || 1)) : 0
      })
      .eq('id', dados.itemId);

    if (error) throw new Error(error.message);
  }, []);

  const limpar = useCallback(async () => {
    if (!casaId) return;
    // Limpa apenas os pendentes
    const { error } = await supabase
      .from('compras')
      .delete()
      .eq('casa_id', casaId)
      .eq('comprado', false);

    if (error) throw new Error(error.message);
  }, [casaId]);

  const readicionar = useCallback(async (produtoId) => {
    // Busca no histórico se já existia
    const { data: historico } = await supabase
      .from('compras')
      .select('*')
      .eq('casa_id', casaId)
      .eq('produto_id', String(produtoId))
      .order('criado_em', { ascending: false })
      .limit(1)
      .single();

    if (historico) {
      await adicionar({
        nome: historico.nome,
        produtoId: historico.produto_id,
        categoria: historico.categoria,
        quantidade: historico.quantidade,
        unidade: historico.unidade,
      });
    } else {
      // Fallback
      await adicionar({ nome: 'Item ' + produtoId, produtoId });
    }
  }, [casaId, adicionar]);

  return {
    itens,
    loading,
    error,
    recarregar: carregar, // Realtime makes manual reload less necessary, but kept for compatibility
    adicionar,
    atualizar,
    remover,
    comprar,
    limpar,
    readicionar,
  };
}