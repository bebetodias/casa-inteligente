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