import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export function usePlants(casaId, membroId) {
  const [plantas, setPlantas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const carregar = useCallback(async () => {
    if (!casaId) return;
    try {
      setLoading(true);
      setError(null);
      const { data, error: err } = await supabase
        .from('plantas')
        .select('*')
        .eq('casa_id', casaId)
        .order('criado_em', { ascending: false });

      if (err) throw err;
      
      setPlantas(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [casaId]);

  useEffect(() => {
    carregar();

    if (!casaId) return;

    const channel = supabase
      .channel('plantas_realtime')
      .on(
        'postgres_changes',
        {
          event: '*', 
          schema: 'public',
          table: 'plantas',
          filter: `casa_id=eq.${casaId}`,
        },
        () => {
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
    
    const novaPlanta = {
      casa_id: casaId,
      nome: dados.nome,
      especie: dados.especie || null,
      local: dados.local || null,
      frequencia_rega: dados.frequencia_rega || 7, // days
      ultima_rega: new Date().toISOString(),
      criado_em: new Date().toISOString(),
      criado_por: membroId,
    };

    const { data, error } = await supabase
      .from('plantas')
      .insert([novaPlanta])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }, [casaId, membroId]);

  const regar = useCallback(async (plantaId) => {
    const { error } = await supabase
      .from('plantas')
      .update({ ultima_rega: new Date().toISOString() })
      .eq('id', plantaId);

    if (error) throw new Error(error.message);
  }, []);

  const remover = useCallback(async (plantaId) => {
    const { error } = await supabase
      .from('plantas')
      .delete()
      .eq('id', plantaId);

    if (error) throw new Error(error.message);
  }, []);

  return {
    plantas,
    loading,
    error,
    recarregar: carregar,
    adicionar,
    regar,
    remover,
  };
}
