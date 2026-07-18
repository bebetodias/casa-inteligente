import { getEstatisticasGerais } from './shoppingService';
import { CATEGORIAS } from './catalog';

const MODULOS = [
  {
    id: 'compras',
    nome: 'Lista de Compras',
    descricao: 'Lista inteligente que aprende com suas compras e sugere o que está acabando.',
    icon: 'cart',
    cor: 'brand',
    rota: '/compras',
    badge: null,
  },
  {
    id: 'receitas',
    nome: 'SuperCook',
    descricao: 'Sugestões de receitas com base nos ingredientes que você tem em casa.',
    icon: 'chef',
    cor: 'success',
    rota: '/receitas',
    badge: { texto: 'Beta', variant: 'warning' },
  },
  {
    id: 'plantas',
    nome: 'Plantas & Jardim',
    descricao: 'Cadastre suas plantas e receba lembretes de regar, adubar e podar.',
    icon: 'plant',
    cor: 'success',
    rota: '/plantas',
    badge: null,
  },
  {
    id: 'manutencao',
    nome: 'Manutenção da Casa',
    descricao: 'Tarefas e lembretes para cuidar da sua casa e evitar surpresas.',
    icon: 'tools',
    cor: 'warning',
    rota: '/manutencao',
    badge: null,
  },
];

export async function getModulos() {
  await new Promise((r) => setTimeout(r, 200));
  return MODULOS;
}

export async function getEstatisticas() {
  // Usa os dados reais do shoppingService para o módulo de compras
  const statsCompras = await getEstatisticasGerais();

  return {
    compras: {
      itensNaLista: statsCompras.itensNaLista,
      comprasNoMes: statsCompras.comprasNoMes,
      gastoEstimado: statsCompras.gastoTotalMes,
    },
    receitas: {
      receitasFavoritas: 4,
      ingredientesDisponiveis: 18,
    },
    plantas: {
      total: 6,
      precisamCuidado: 2,
    },
    manutencao: {
      pendentes: 3,
      concluidasNoMes: 2,
    },
  };
}

export async function getAtividadeRecente() {
  await new Promise((r) => setTimeout(r, 250));
  return [
    { id: '1', tipo: 'compra', usuario: 'Maria', texto: 'adicionou **Leite** à lista', quando: 'há 5 min' },
    { id: '2', tipo: 'planta', usuario: 'João', texto: 'regou a **Samambaia** ', quando: 'há 2 horas' },
    { id: '3', tipo: 'receita', usuario: 'Maria', texto: 'favoritou **Risoto de Cogumelos** ', quando: 'ontem' },
    { id: '4', tipo: 'manutencao', usuario: 'João', texto: 'concluiu **Trocar filtro do ar** ', quando: 'há 2 dias' },
  ];
}